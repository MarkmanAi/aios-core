"""
Extract phase: PDF/EPUB → structured Markdown using Marker.
Outputs: staging/{book-slug}/full_text.md + chapters/*.md + metadata.yaml
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path

import yaml
from rich.console import Console

console = Console()


def slugify(text: str) -> str:
    """Convert 'Thinking in Systems (Meadows)' → 'thinking-in-systems'."""
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[\s_]+", "-", text).strip("-")


def extract(
    book_path: Path,
    staging_dir: Path,
    book_slug: str,
) -> dict[str, Path]:
    """
    Run Marker on the input file, then split by chapters.

    Args:
        book_path: Path to PDF or EPUB file
        staging_dir: Root staging directory (data/staging/)
        book_slug: Slug for this book (e.g., "thinking-in-systems")

    Returns:
        {
          "full_text": Path to full_text.md,
          "chapters": [Path to ch01.md, Path to ch02.md, ...],
          "metadata": Path to metadata.yaml,
        }
    """
    book_staging = staging_dir / book_slug
    chapters_dir = book_staging / "chapters"
    chapters_dir.mkdir(parents=True, exist_ok=True)

    full_text_path = book_staging / "full_text.md"

    if full_text_path.exists():
        console.print(f"[yellow]Extract cache hit:[/yellow] {book_slug}")
    else:
        console.print(f"[cyan]Extracting:[/cyan] {book_path.name}")
        _run_marker(book_path, book_staging)

    # Write metadata
    metadata = _extract_metadata(book_path, book_staging)
    metadata_path = book_staging / "metadata.yaml"
    metadata_path.write_text(
        yaml.dump(metadata, allow_unicode=True, default_flow_style=False),
        encoding="utf-8",
    )

    # Split into chapters
    chapter_paths = _split_chapters(full_text_path, chapters_dir)
    console.print(f"[green]Extracted[/green] {len(chapter_paths)} chapters from {book_slug}")

    return {
        "full_text": full_text_path,
        "chapters": chapter_paths,
        "metadata": metadata_path,
    }


def _run_marker(book_path: Path, output_dir: Path) -> None:
    """Convert PDF/EPUB to Markdown. Uses marker for PDF, ebooklib for EPUB."""
    suffix = book_path.suffix.lower()
    if suffix not in (".pdf", ".epub"):
        raise ValueError(f"Unsupported file type: {suffix}. Expected .pdf or .epub")

    target = output_dir / "full_text.md"

    if suffix == ".epub":
        _extract_epub(book_path, target)
    else:
        _extract_pdf_marker(book_path, output_dir, target)


def _extract_epub(book_path: Path, target: Path) -> None:
    """Extract EPUB content to Markdown using ebooklib + markdownify."""
    import ebooklib
    from ebooklib import epub
    from markdownify import markdownify as md

    book = epub.read_epub(str(book_path), options={"ignore_ncx": True})

    parts: list[str] = []
    for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        html = item.get_content().decode("utf-8", errors="replace")
        text = md(html, heading_style="ATX", strip=["script", "style"])
        text = text.strip()
        if text:
            parts.append(text)

    full_text = "\n\n---\n\n".join(parts)
    target.write_text(full_text, encoding="utf-8")
    console.print(f"[green]EPUB extracted:[/green] {len(parts)} sections -> {target.name}")


def _extract_pdf_marker(book_path: Path, output_dir: Path, target: Path) -> None:
    """Extract PDF using marker CLI."""
    import tempfile

    if not shutil.which("marker"):
        console.print("[red]marker not found.[/red] Install with: pip install marker-pdf")
        sys.exit(1)

    # marker 1.x expects a directory as input — copy file into a temp dir
    with tempfile.TemporaryDirectory() as tmp_input:
        tmp_file = Path(tmp_input) / book_path.name
        shutil.copy2(str(book_path), str(tmp_file))

        result = subprocess.run(
            [
                "marker",
                tmp_input,
                "--output_dir", str(output_dir),
                "--output_format", "markdown",
            ],
            capture_output=True,
            text=True,
        )

    if result.returncode != 0:
        raise RuntimeError(f"Marker failed:\n{result.stderr}")

    # Marker outputs to output_dir/{stem}/{stem}.md
    marker_output = output_dir / book_path.stem
    md_files = list(marker_output.glob("*.md")) if marker_output.exists() else []
    if not md_files:
        md_files = list(output_dir.rglob("*.md"))
    if not md_files:
        raise RuntimeError(f"Marker produced no .md files in {output_dir}")

    shutil.move(str(md_files[0]), str(target))


def _extract_metadata(book_path: Path, staging_dir: Path) -> dict:
    """Extract basic metadata from the book file."""
    metadata: dict = {
        "source_file": book_path.name,
        "file_type": book_path.suffix.lower().lstrip("."),
        "title": None,
        "author": None,
    }

    if book_path.suffix.lower() == ".epub":
        try:
            import ebooklib
            from ebooklib import epub
            book = epub.read_epub(str(book_path))
            metadata["title"] = book.get_metadata("DC", "title")[0][0] if book.get_metadata("DC", "title") else None
            metadata["author"] = book.get_metadata("DC", "creator")[0][0] if book.get_metadata("DC", "creator") else None
            metadata["language"] = book.get_metadata("DC", "language")[0][0] if book.get_metadata("DC", "language") else None
        except Exception:
            pass  # Metadata is optional — fallback to filename

    return metadata


def _extract_page_range(chapter_lines: list[str]) -> tuple[int | None, int | None]:
    """Extract first and last page numbers from Marker page markers.

    Marker generates comments like: <!-- page:42 -->
    Returns (min_page, max_page) or (None, None) if no markers found.
    """
    pages = []
    for line in chapter_lines:
        m = re.search(r"<!--\s*page:(\d+)\s*-->", line)
        if m:
            pages.append(int(m.group(1)))
    if not pages:
        return None, None
    return min(pages), max(pages)


_CHAPTER_RE = re.compile(r"^(CHAPTER|PART)\s+\S+\s*$")


def _split_chapters(full_text_path: Path, chapters_dir: Path) -> list[Path]:
    """
    Split full_text.md into chapter files.

    Detects two header styles:
    1. Markdown headings: lines starting with '# ' or '## '
    2. Plain-text chapter markers: lines matching 'CHAPTER N' or 'PART N'
       (common in EPUB extractions that don't preserve heading markup)
    """
    text = full_text_path.read_text(encoding="utf-8")
    lines = text.split("\n")

    chapters: list[tuple[str, list[str]]] = []
    current_title = "Introduction"
    current_lines: list[str] = []

    for line in lines:
        stripped = line.strip()
        # Detect chapter headers: Markdown H1/H2 OR plain CHAPTER/PART markers
        is_header = (
            line.startswith("# ") or line.startswith("## ")
            or _CHAPTER_RE.match(stripped)
        )
        if is_header:
            if current_lines:
                chapters.append((current_title, current_lines))
            current_title = line.lstrip("#").strip() or stripped
            current_lines = [line]
        else:
            current_lines.append(line)

    if current_lines:
        chapters.append((current_title, current_lines))

    # Write chapter files
    paths: list[Path] = []
    for idx, (title, chapter_lines) in enumerate(chapters, start=1):
        slug = slugify(title)[:50]
        filename = f"{idx:02d}-{slug}.md"
        chapter_path = chapters_dir / filename

        # Extract page range from Marker page markers
        page_start, page_end = _extract_page_range(chapter_lines)
        if page_start is not None:
            page_range_str = f"{page_start}-{page_end}"
            frontmatter = f"<!-- pages: {page_range_str} -->\n\n"
        else:
            page_range_str = "unknown"
            frontmatter = "<!-- pages: unknown -->\n\n"

        chapter_path.write_text(frontmatter + "\n".join(chapter_lines), encoding="utf-8")
        paths.append(chapter_path)

        # Write per-chapter metadata yaml (Q1=2)
        chapter_yaml_path = chapter_path.with_suffix(".yaml")
        chapter_yaml_path.write_text(
            yaml.dump({"page_range": page_range_str}, allow_unicode=True, default_flow_style=False),
            encoding="utf-8",
        )

    return paths
