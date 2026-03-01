"""
Transform L1: Extract operational principles from a book.
Output: {staging}/{book}/l1/final_principles.json
"""

from __future__ import annotations

import json
from pathlib import Path

from pydantic import BaseModel
from rich.console import Console

from knowledge_etl.config import (
    DEFAULT_MODEL_L1,
    MAX_OUTPUT_L1,
    PROMPTS_DIR,
    STAGING,
)
from knowledge_etl.utils.checkpoint import Checkpoint
from knowledge_etl.utils.cost import CostTracker
from knowledge_etl.utils.llm import LLMClient

console = Console()


class Principle(BaseModel):
    principle: str
    action: str
    attribution: str
    source_quote: str
    chapter_ref: str


class L1Result(BaseModel):
    principles: list[Principle]


def extract_l1(
    book_slug: str,
    full_text_path: Path,
    chapter_paths: list[Path],
    metadata: dict,
    strategy: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    model: str = DEFAULT_MODEL_L1,
) -> list[dict]:
    """
    Extract operational principles from the book.

    Strategy:
      STUFF: send full book → extract all principles in one pass
      MAP-REDUCE: extract per chapter → reduce to unified list

    Returns list of principle dicts ready for Load phase.
    """
    l1_dir = STAGING / book_slug / "l1"
    l1_dir.mkdir(parents=True, exist_ok=True)

    checkpoint = Checkpoint(STAGING / book_slug / ".checkpoints", book_slug, "l1")

    prompt_template = (PROMPTS_DIR / "l1_principles.xml").read_text(encoding="utf-8")

    book_title = metadata.get("title") or book_slug
    author = metadata.get("author") or "Unknown"

    all_principles: list[dict] = []

    if strategy == "stuff":
        console.print("[cyan]L1 Strategy:[/cyan] STUFF (full book)")
        all_principles = _extract_stuff(
            full_text_path=full_text_path,
            book_title=book_title,
            author=author,
            prompt_template=prompt_template,
            llm=llm,
            cost_tracker=cost_tracker,
            model=model,
            l1_dir=l1_dir,
        )
    else:
        console.print(f"[cyan]L1 Strategy:[/cyan] MAP-REDUCE ({len(chapter_paths)} chapters)")
        all_principles = _extract_map_reduce(
            chapter_paths=chapter_paths,
            book_title=book_title,
            author=author,
            prompt_template=prompt_template,
            llm=llm,
            cost_tracker=cost_tracker,
            model=model,
            checkpoint=checkpoint,
            l1_dir=l1_dir,
        )

    # Write final output
    output_path = l1_dir / "final_principles.json"
    output_path.write_text(
        json.dumps({"principles": all_principles}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    console.print(f"[green]L1 complete:[/green] {len(all_principles)} principles extracted")
    return all_principles


def _extract_stuff(
    full_text_path: Path,
    book_title: str,
    author: str,
    prompt_template: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    model: str,
    l1_dir: Path,
) -> list[dict]:
    """Single-pass extraction on full book with prompt caching."""
    book_content = full_text_path.read_text(encoding="utf-8")

    task_prompt = _fill_template(
        prompt_template,
        book_title=book_title,
        author=author,
        chapter_num="ALL",
        chapter_title="Full Book",
        chapter_text="[See cached book content]",
    )

    system = _get_system_prompt(prompt_template)
    text, usage = llm.call(
        model=model,
        system_prompt=system,
        task_prompt=task_prompt,
        book_content=book_content,
        max_tokens=MAX_OUTPUT_L1,
    )
    cost_tracker.record("l1_stuff", usage)

    return _parse_principles(text, l1_dir / "stuff_extraction.json")


def _extract_map_reduce(
    chapter_paths: list[Path],
    book_title: str,
    author: str,
    prompt_template: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    model: str,
    checkpoint: Checkpoint,
    l1_dir: Path,
) -> list[dict]:
    """Per-chapter extraction, then cross-chapter Reduce."""
    system = _get_system_prompt(prompt_template)
    chapter_results: list[dict] = []

    for chapter_path in chapter_paths:
        chapter_key = chapter_path.stem
        if checkpoint.is_done(chapter_key):
            console.print(f"  [dim]Skip (cached):[/dim] {chapter_key}")
            chapter_results.extend(checkpoint.get_result(chapter_key) or [])
            continue

        chapter_text = chapter_path.read_text(encoding="utf-8")
        chapter_title = chapter_path.stem.replace("-", " ").title()
        chapter_num = chapter_path.stem.split("-")[0]

        task_prompt = _fill_template(
            prompt_template,
            book_title=book_title,
            author=author,
            chapter_num=chapter_num,
            chapter_title=chapter_title,
            chapter_text=chapter_text,
        )

        console.print(f"  [cyan]L1:[/cyan] {chapter_key}")
        text, usage = llm.call(
            model=model,
            system_prompt=system,
            task_prompt=task_prompt,
            max_tokens=MAX_OUTPUT_L1,
        )
        cost_tracker.record("l1_map", usage, chapter=chapter_key)

        principles = _parse_principles(text, l1_dir / f"{chapter_key}.json")
        checkpoint.mark_done(chapter_key, principles, usage.cost_usd)
        chapter_results.extend(principles)

    return chapter_results


def _fill_template(
    template: str,
    book_title: str,
    author: str,
    chapter_num: str,
    chapter_title: str,
    chapter_text: str,
) -> str:
    return (
        template
        .replace("{{BOOK_TITLE}}", book_title)
        .replace("{{AUTHOR}}", author)
        .replace("{{CHAPTER_NUM}}", chapter_num)
        .replace("{{CHAPTER_TITLE}}", chapter_title)
        .replace("{{CHAPTER_TEXT}}", chapter_text)
    )


def _get_system_prompt(template: str) -> str:
    """Extract system prompt from XML template."""
    import re
    match = re.search(r"<system_prompt>(.*?)</system_prompt>", template, re.DOTALL)
    return match.group(1).strip() if match else "You are an expert knowledge extractor."


def _parse_principles(text: str, output_path: Path) -> list[dict]:
    """Parse JSON from LLM response, save to file, return list."""
    import re
    # Extract JSON from response (LLM might wrap in markdown code blocks)
    json_match = re.search(r"\{.*\}", text, re.DOTALL)
    if not json_match:
        output_path.write_text(json.dumps({"principles": [], "raw": text}), encoding="utf-8")
        return []

    try:
        data = json.loads(json_match.group())
        principles = data.get("principles", [])
        output_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        return principles
    except json.JSONDecodeError:
        output_path.write_text(json.dumps({"error": "parse_failed", "raw": text}), encoding="utf-8")
        return []
