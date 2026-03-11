"""
Load L1: Merge extracted principles into .neo/data/strategic-principles.md
Appends new principles under an author/book section, deduplicating first.
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path

from rich.console import Console

from knowledge_etl.config import NEO_STRATEGIC_PRINCIPLES
from knowledge_etl.load.dedup import deduplicate
from knowledge_etl.utils.cost import CostTracker
from knowledge_etl.utils.llm import LLMClient

console = Console()


def merge_l1(
    principles: list[dict],
    metadata: dict,
    book_slug: str,
    llm: LLMClient | None = None,
    cost_tracker: CostTracker | None = None,
) -> Path:
    """
    Merge L1 principles into the strategic principles file.

    Format per principle:
      - **[Author]** principle -- *action* (_chapter_ref_)

    Args:
        principles: List of principle dicts from L1 extraction.
        metadata: Book metadata with 'title' and 'author'.
        book_slug: Slug identifier for the book.
        llm: Optional LLMClient for dedup Haiku calls.
        cost_tracker: Optional CostTracker for cost recording.

    Returns:
        Path to the updated strategic-principles.md
    """
    target = NEO_STRATEGIC_PRINCIPLES
    target.parent.mkdir(parents=True, exist_ok=True)

    author = metadata.get("author") or "Unknown"
    title = metadata.get("title") or book_slug
    today = datetime.now().strftime("%Y-%m-%d")

    # Load existing content
    existing_content = ""
    if target.exists():
        existing_content = target.read_text(encoding="utf-8")

    # Parse existing principles for dedup
    existing_principles = _parse_existing_principles(existing_content)

    # Deduplicate
    if existing_principles:
        unique_principles = deduplicate(
            new_items=principles,
            existing_items=existing_principles,
            text_key="principle",
            llm=llm,
            cost_tracker=cost_tracker,
        )
    else:
        unique_principles = principles

    if not unique_principles:
        console.print("[yellow]L1 Load:[/yellow] No new unique principles to add")
        return target

    # Build principle lines
    new_lines = []
    for p in unique_principles:
        principle_text = p.get("principle", "")
        action_text = p.get("action", "")
        attribution = p.get("attribution", author)
        chapter_ref = p.get("chapter_ref", "")

        line = f"- **[{attribution}]** {principle_text}"
        if action_text:
            line += f" -- *{action_text}*"
        if chapter_ref:
            line += f" (_{chapter_ref}_)"

        new_lines.append(line)

    # Check if a section for this book_slug already exists → append inside it
    section_header = f"## {author} -- {title}"
    if existing_content and f"*Source: {book_slug} |" in existing_content:
        # Find the existing section and append new principles inside it
        lines = existing_content.split("\n")
        insert_idx = None
        in_section = False
        for i, line in enumerate(lines):
            if section_header in line:
                in_section = True
            elif in_section and line.startswith("## "):
                # Next section — insert before it
                insert_idx = i
                break
        if insert_idx is None and in_section:
            insert_idx = len(lines)  # End of file

        if insert_idx is not None:
            lines[insert_idx:insert_idx] = new_lines
            updated_content = "\n".join(lines)
        else:
            # Fallback: append new section
            section_lines = [f"\n{section_header}", f"*Source: {book_slug} | Extracted: {today}*", ""] + new_lines + [""]
            updated_content = existing_content.rstrip() + "\n" + "\n".join(section_lines)
    else:
        # New section for this book
        section_lines = [f"\n{section_header}", f"*Source: {book_slug} | Extracted: {today}*", ""] + new_lines + [""]
        new_section = "\n".join(section_lines)
        if existing_content:
            updated_content = existing_content.rstrip() + "\n" + new_section
        else:
            # Initialize file with header
            updated_content = (
                "# Strategic Principles\n"
                "\n"
                "Operational principles extracted from books by the knowledge-etl pipeline.\n"
                "Each principle is attributed to its author and source.\n"
                + new_section
            )

    target.write_text(updated_content, encoding="utf-8")
    console.print(f"[green]L1 Load:[/green] {len(unique_principles)} principles merged into {target.name}")

    return target


def _parse_existing_principles(content: str) -> list[dict]:
    """Parse existing principles from the markdown file for dedup comparison."""
    principles: list[dict] = []
    for line in content.split("\n"):
        line = line.strip()
        if line.startswith("- **["):
            # Extract principle text between ] and --
            try:
                after_bracket = line.split("]** ", 1)[1]
                principle_text = after_bracket.split(" -- ")[0] if " -- " in after_bracket else after_bracket
                principles.append({"principle": principle_text})
            except (IndexError, ValueError):
                continue
    return principles
