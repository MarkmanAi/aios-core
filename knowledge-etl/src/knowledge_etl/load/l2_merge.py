"""
Load L2: Merge strategic frameworks into .neo/kb/strategic/{domain}.md
Creates or updates domain-specific knowledge base files in XML format.
"""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

from rich.console import Console

from knowledge_etl.config import NEO_KB_STRATEGIC
from knowledge_etl.load.dedup import deduplicate
from knowledge_etl.utils.cost import CostTracker
from knowledge_etl.utils.llm import LLMClient

console = Console()


def merge_l2(
    frameworks: dict,
    metadata: dict,
    book_slug: str,
    domain: str,
    llm: LLMClient | None = None,
    cost_tracker: CostTracker | None = None,
) -> Path:
    """
    Merge L2 frameworks into the domain-specific KB file.

    Output format: XML knowledge_base blocks per book.

    Args:
        frameworks: L2 extraction result dict.
        metadata: Book metadata with 'title' and 'author'.
        book_slug: Slug identifier for the book.
        domain: Knowledge domain (e.g., 'software-engineering').
        llm: Optional LLMClient for dedup Haiku calls.
        cost_tracker: Optional CostTracker for cost recording.

    Returns:
        Path to the updated domain file.
    """
    target_dir = NEO_KB_STRATEGIC
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / f"{domain}.md"

    author = metadata.get("author") or "Unknown"
    title = metadata.get("title") or book_slug
    today = datetime.now().strftime("%Y-%m-%d")

    # Load existing content for dedup
    existing_content = ""
    if target.exists():
        existing_content = target.read_text(encoding="utf-8")

    # Extract items for dedup
    new_frameworks = frameworks.get("unified_frameworks", frameworks.get("core_frameworks", []))
    new_heuristics = frameworks.get("unified_heuristics", frameworks.get("decision_heuristics", []))
    new_anti_patterns = frameworks.get("anti_patterns", [])
    new_triggers = frameworks.get("trigger_questions", [])

    # Dedup frameworks against existing
    existing_items = _parse_existing_items(existing_content)
    if existing_items and new_frameworks:
        new_frameworks = deduplicate(
            new_items=new_frameworks,
            existing_items=existing_items,
            text_key="name",
            llm=llm,
            cost_tracker=cost_tracker,
        )

    # Build XML block
    xml_block = _build_xml_block(
        book_slug=book_slug,
        title=title,
        author=author,
        domain=domain,
        date=today,
        frameworks=new_frameworks,
        heuristics=new_heuristics,
        anti_patterns=new_anti_patterns,
        triggers=new_triggers,
    )

    # Append or create
    if existing_content:
        updated = existing_content.rstrip() + "\n\n" + xml_block
    else:
        header = (
            f"# Strategic Knowledge Base: {domain.replace('-', ' ').title()}\n\n"
            f"Knowledge frameworks extracted from books by the knowledge-etl pipeline.\n\n"
        )
        updated = header + xml_block

    target.write_text(updated, encoding="utf-8")

    total_items = len(new_frameworks) + len(new_heuristics) + len(new_anti_patterns) + len(new_triggers)
    console.print(f"[green]L2 Load:[/green] {total_items} items merged into {domain}.md")

    return target


def _build_xml_block(
    book_slug: str,
    title: str,
    author: str,
    domain: str,
    date: str,
    frameworks: list[dict],
    heuristics: list[dict],
    anti_patterns: list[dict],
    triggers: list[dict],
) -> str:
    """Build an XML knowledge_base block."""
    lines = [
        f'<knowledge_base source="{book_slug}" version="1.0">',
        f"  <metadata>",
        f"    <title>{_escape_xml(title)}</title>",
        f"    <author>{_escape_xml(author)}</author>",
        f"    <domain>{_escape_xml(domain)}</domain>",
        f"    <extracted>{date}</extracted>",
        f"  </metadata>",
    ]

    # Frameworks
    if frameworks:
        lines.append("  <frameworks>")
        for fw in frameworks:
            name = fw.get("name", "unnamed")
            fw_type = fw.get("type", "explicit")
            desc = fw.get("description", "")
            components = fw.get("components", [])
            lines.append(f'    <framework name="{_escape_xml(name)}" type="{fw_type}">')
            lines.append(f"      <description>{_escape_xml(desc)}</description>")
            if components:
                lines.append("      <components>")
                for comp in components:
                    lines.append(f"        <component>{_escape_xml(str(comp))}</component>")
                lines.append("      </components>")
            lines.append("    </framework>")
        lines.append("  </frameworks>")

    # Heuristics
    if heuristics:
        lines.append("  <decision_heuristics>")
        for h in heuristics:
            rule = h.get("rule", "")
            lines.append(f"    <heuristic>{_escape_xml(rule)}</heuristic>")
        lines.append("  </decision_heuristics>")

    # Anti-patterns
    if anti_patterns:
        lines.append("  <anti_patterns>")
        for ap in anti_patterns:
            mistake = ap.get("mistake", "")
            why = ap.get("why_wrong", "")
            lines.append(f"    <anti_pattern>")
            lines.append(f"      <mistake>{_escape_xml(mistake)}</mistake>")
            lines.append(f"      <why_wrong>{_escape_xml(why)}</why_wrong>")
            lines.append(f"    </anti_pattern>")
        lines.append("  </anti_patterns>")

    # Trigger questions
    if triggers:
        lines.append("  <trigger_questions>")
        for tq in triggers:
            question = tq.get("question", "")
            purpose = tq.get("purpose", "")
            lines.append(f"    <trigger>")
            lines.append(f"      <question>{_escape_xml(question)}</question>")
            lines.append(f"      <purpose>{_escape_xml(purpose)}</purpose>")
            lines.append(f"    </trigger>")
        lines.append("  </trigger_questions>")

    lines.append("</knowledge_base>")
    return "\n".join(lines)


def _escape_xml(text: str) -> str:
    """Escape XML special characters."""
    return (
        text
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _parse_existing_items(content: str) -> list[dict]:
    """Parse existing framework names from XML content for dedup."""
    import re
    items: list[dict] = []
    for match in re.finditer(r'<framework name="([^"]+)"', content):
        items.append({"name": match.group(1).replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")})
    return items
