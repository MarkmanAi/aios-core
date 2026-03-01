#!/usr/bin/env python3
"""
AIOS Knowledge Library — Local Book Catalog
Lists and organizes books in the books/ directory.

Usage:
    python tools/list_library.py           # list all books
    python tools/list_library.py --catalog # grouped by category
"""

import sys
import argparse
from pathlib import Path

BOOKS_DIR = Path(__file__).parent.parent / "books"

CATEGORIES = {
    "Software & Tech": [
        "clean code", "pragmatic", "refactor", "architecture", "design pattern",
        "python", "javascript", "typescript", "rust", "java", "algorithm",
        "data structure", "machine learning", "deep learning", "artificial",
        "database", "system design", "devops", "kubernetes", "docker",
    ],
    "Business & Entrepreneurship": [
        "milionário", "millionaire", "startup", "empreend", "entrepreneur",
        "lean", "zero to one", "negócio", "business", "venture",
        "fastlane", "via expressa",
    ],
    "Finance & Investing": [
        "invest", "financ", "money", "dinheiro", "rico", "wealth",
        "bolsa", "ação", "stock", "trading", "economia", "economic",
        "dalio", "graham", "buffett", "taleb",
    ],
    "Leadership & Management": [
        "manager", "leader", "gestão", "liderança", "team", "agile",
        "scrum", "management", "organization", "cultura",
    ],
    "Psychology & Productivity": [
        "habit", "hábito", "atomic", "mindset", "psychology", "psicolog",
        "focus", "deep work", "thinking", "mental", "brain", "cognitive",
        "produtiv",
    ],
    "Marketing & Sales": [
        "marketing", "sales", "venda", "copywriting", "brand", "funnel",
        "growth", "tração", "traction", "offer", "cliente",
    ],
}


def detect_category(filename: str) -> str:
    lower = filename.lower()
    for cat, keywords in CATEGORIES.items():
        if any(kw in lower for kw in keywords):
            return cat
    return "Other"


def format_size(path: Path) -> str:
    size = path.stat().st_size
    if size > 1_048_576:
        return f"{size / 1_048_576:.1f} MB"
    return f"{size / 1024:.0f} KB"


def list_books(catalog: bool = False):
    if not BOOKS_DIR.exists():
        print(f"Library folder not found: {BOOKS_DIR}")
        print("Run: python tools/zlib.py to download your first book.")
        return

    books = sorted(BOOKS_DIR.glob("*.*"))
    books = [b for b in books if b.is_file() and not b.name.startswith(".")]

    if not books:
        print("No books found in library.")
        print("Run: python tools/zlib.py to download your first book.")
        return

    print(f"\n{'='*60}")
    print(f"   AIOS Knowledge Library — {len(books)} book(s)")
    print(f"{'='*60}")

    if not catalog:
        print(f"\n{'#':<4} {'Title':<45} {'Ext':<6} {'Size'}")
        print("-" * 68)
        for i, book in enumerate(books):
            name  = book.stem[:43]
            ext   = book.suffix.lstrip(".").upper()
            size  = format_size(book)
            print(f"[{i:<2}] {name:<45} {ext:<6} {size}")
    else:
        grouped: dict[str, list] = {}
        for book in books:
            cat = detect_category(book.name)
            grouped.setdefault(cat, []).append(book)

        for cat, items in sorted(grouped.items()):
            print(f"\n  [{cat}]")
            for book in items:
                ext  = book.suffix.lstrip(".").upper()
                size = format_size(book)
                print(f"    - {book.stem[:50]}  ({ext}, {size})")

    total = sum(b.stat().st_size for b in books)
    print(f"\nTotal: {total / 1_048_576:.1f} MB in {BOOKS_DIR}")


def main():
    parser = argparse.ArgumentParser(description="AIOS Knowledge Library Catalog")
    parser.add_argument("--catalog", action="store_true", help="Group by category")
    args = parser.parse_args()
    list_books(catalog=args.catalog)


if __name__ == "__main__":
    main()
