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
    """Run Marker CLI to convert PDF/EPUB to Markdown."""
    if not shutil.which("marker"):
        console.print("[red]marker not found.[/red] Install with: pip install marker-pdf")
        sys.exit(1)

    suffix = book_path.suffix.lower()
    if suffix not in (".pdf", ".epub"):
        raise ValueError(f"Unsupported file type: {suffix}. Expected .pdf or .epub")

    # Marker outputs to a directory with the same name as the file
    marker_output = output_dir / book_path.stem
    marker_output.mkdir(parents=True, exist_ok=True)

    result = subprocess.run(
        [
            "marker",
            str(book_path),
            "--output_dir", str(output_dir),
            "--output_format", "markdown",
        ],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        raise RuntimeError(f"Marker failed:\n{result.stderr}")

    # Find the generated markdown file
    md_files = list(marker_output.glob("*.md"))
    if not md_files:
        raise RuntimeError(f"Marker produced no .md files in {marker_output}")

    # Move to canonical location
    generated_md = md_files[0]
    target = output_dir / "full_text.md"
    shutil.move(str(generated_md), str(target))


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


def _split_chapters(full_text_path: Path, chapters_dir: Path) -> list[Path]:
    """
    Split full_text.md into chapter files based on H1/H2 headers.
    Embeds page markers from Marker output.
    """
    text = full_text_path.read_text(encoding="utf-8")
    lines = text.split("\n")

    chapters: list[tuple[str, list[str]]] = []
    current_title = "Introduction"
    current_lines: list[str] = []

    for line in lines:
        # Detect chapter headers (H1 or H2)
        if line.startswith("# ") or line.startswith("## "):
            if current_lines:
                chapters.append((current_title, current_lines))
            current_title = line.lstrip("#").strip()
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
        chapter_path.write_text("\n".join(chapter_lines), encoding="utf-8")
        paths.append(chapter_path)

    return paths
