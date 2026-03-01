"""
Extract metadata (title, author, language) from PDF and EPUB files.
Uses ebooklib for EPUB; falls back to filename parsing for PDF.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from rich.console import Console

console = Console()


def extract_metadata(book_path: Path, author_override: str | None = None) -> dict[str, Any]:
    """
    Extract metadata from a book file.

    Args:
        book_path: Path to the PDF or EPUB file.
        author_override: If provided, overrides detected author.

    Returns:
        {
          "title": "Clean Code",
          "author": "Robert C. Martin",
          "language": "en",
          "source_file": "Clean Code (Robert C. Martin).epub",
          "file_type": "epub",
        }
    """
    suffix = book_path.suffix.lower()
    metadata: dict[str, Any] = {
        "source_file": book_path.name,
        "file_type": suffix.lstrip("."),
        "title": None,
        "author": None,
        "language": None,
    }

    if suffix == ".epub":
        metadata = _extract_epub_metadata(book_path, metadata)
    elif suffix == ".pdf":
        metadata = _extract_pdf_metadata(book_path, metadata)

    # Fallback: parse from filename pattern "Title (Author).ext"
    if not metadata["title"] or not metadata["author"]:
        parsed = _parse_filename(book_path.stem)
        if not metadata["title"]:
            metadata["title"] = parsed.get("title")
        if not metadata["author"]:
            metadata["author"] = parsed.get("author")

    # Override author if provided via CLI
    if author_override:
        metadata["author"] = author_override

    console.print(
        f"[green]Metadata:[/green] {metadata.get('title', 'Unknown')} "
        f"by {metadata.get('author', 'Unknown')}"
    )
    return metadata


def _extract_epub_metadata(book_path: Path, metadata: dict[str, Any]) -> dict[str, Any]:
    """Extract metadata from EPUB using ebooklib."""
    try:
        from ebooklib import epub

        book = epub.read_epub(str(book_path))

        title_meta = book.get_metadata("DC", "title")
        if title_meta:
            metadata["title"] = title_meta[0][0]

        creator_meta = book.get_metadata("DC", "creator")
        if creator_meta:
            metadata["author"] = creator_meta[0][0]

        lang_meta = book.get_metadata("DC", "language")
        if lang_meta:
            metadata["language"] = lang_meta[0][0]

    except Exception as exc:
        console.print(f"[yellow]EPUB metadata extraction failed:[/yellow] {exc}")

    return metadata


def _extract_pdf_metadata(book_path: Path, metadata: dict[str, Any]) -> dict[str, Any]:
    """Extract metadata from PDF using PyPDF2 if available, else filename only."""
    try:
        from PyPDF2 import PdfReader

        reader = PdfReader(str(book_path))
        info = reader.metadata
        if info:
            if info.title:
                metadata["title"] = info.title
            if info.author:
                metadata["author"] = info.author
    except ImportError:
        # PyPDF2 is optional; fall through to filename parsing
        pass
    except Exception as exc:
        console.print(f"[yellow]PDF metadata extraction failed:[/yellow] {exc}")

    return metadata


def _parse_filename(stem: str) -> dict[str, str | None]:
    """
    Parse 'Title (Author Name)' pattern from filename stem.

    Handles Z-Library suffixes like '(z-library.sk, 1lib.sk, z-lib.sk)' by stripping them first.

    Examples:
        'Clean Code (Robert C. Martin)' -> {'title': 'Clean Code', 'author': 'Robert C. Martin'}
        'Clean Code (Robert C. Martin) (z-library.sk, 1lib.sk)' -> same result
        'A via Expressa Dos Milionarios (DeMarco, MJ)' -> {'title': 'A via Expressa...', 'author': 'DeMarco, MJ'}
    """
    # Strip known Z-Library source suffixes before parsing
    clean_stem = re.sub(r'\s*\([^)]*(?:z-lib|1lib|z-library)[^)]*\)', '', stem).strip()

    match = re.match(r"^(.+?)\s*\(([^)]+)\)\s*$", clean_stem)
    if match:
        return {
            "title": match.group(1).strip(),
            "author": match.group(2).strip(),
        }
    return {"title": clean_stem or stem, "author": None}
