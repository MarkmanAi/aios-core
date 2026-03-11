"""
Transform L1: Extract operational principles from a book.
Output: {staging}/{book}/l1/final_principles.json
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from pydantic import BaseModel
from rich.console import Console

from knowledge_etl.config import (
    CHECKPOINTS,
    DEFAULT_MODEL_L1,
    MAX_OUTPUT_L1,
    MAX_OUTPUT_REDUCE,
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

    checkpoint = Checkpoint(CHECKPOINTS, book_slug, "l1")

    prompt_template = (PROMPTS_DIR / "l1_principles.xml").read_text(encoding="utf-8")

    book_title = metadata.get("title") or book_slug
    author = metadata.get("author") or "Unknown"

    all_principles: list[dict] = []

    # Cache check — skip API call if output already exists
    output_path = l1_dir / "final_principles.json"
    if output_path.exists():
        cached = json.loads(output_path.read_text(encoding="utf-8"))
        all_principles = cached.get("principles", [])
        console.print(f"[dim]L1 cache hit: {len(all_principles)} principles[/dim]")
        return all_principles

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

        # Extract page range from chapter frontmatter (<!-- pages: X-Y -->)
        pages_match = re.search(r"<!--\s*pages:\s*(\d+-\d+|unknown)\s*-->", chapter_text)
        chapter_pages = f"pp. {pages_match.group(1)}" if (pages_match and pages_match.group(1) != "unknown") else ""

        task_prompt = _fill_template(
            prompt_template,
            book_title=book_title,
            author=author,
            chapter_num=chapter_num,
            chapter_title=chapter_title,
            chapter_text=chapter_text,
            chapter_pages=chapter_pages,
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

    # Reduce: deduplicate and compress across chapters
    console.print("[cyan]L1 Reduce:[/cyan] Cross-chapter dedup + compression")
    return _reduce_l1(
        chapter_results=chapter_results,
        book_title=book_title,
        author=author,
        llm=llm,
        cost_tracker=cost_tracker,
    )



def _reduce_l1(
    chapter_results: list[dict],
    book_title: str,
    author: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
) -> list[dict]:
    """Run the Reduce pass to deduplicate and compress cross-chapter principles."""
    if not chapter_results:
        return []

    reduce_template = (PROMPTS_DIR / "l1_reduce.xml").read_text(encoding="utf-8")
    reduce_system = _get_system_prompt(reduce_template)

    candidates_json = json.dumps(chapter_results, indent=2, ensure_ascii=False)

    task_prompt = (
        reduce_template
        .replace("{{BOOK_TITLE}}", book_title)
        .replace("{{AUTHOR}}", author)
        # Note: principles with empty chapter_ref all collapse to one bucket in the set count
        .replace("{{TOTAL_CHAPTERS}}", str(len({p.get("chapter_ref", "") for p in chapter_results})))
        .replace("{{JSON_ARRAY_OF_CANDIDATES}}", candidates_json)
    )

    text, usage = llm.call(
        model=DEFAULT_MODEL_L1,
        system_prompt=reduce_system,
        task_prompt=task_prompt,
        max_tokens=MAX_OUTPUT_REDUCE,
    )
    cost_tracker.record("l1_reduce", usage)

    json_match = re.search(r"\{.*\}", text, re.DOTALL)
    if not json_match:
        console.print("[yellow]L1 Reduce warning:[/yellow] LLM returned unparseable response — returning raw chapter results")
        return chapter_results

    try:
        data = json.loads(json_match.group())
        return data.get("principles", chapter_results)
    except json.JSONDecodeError:
        console.print("[yellow]L1 Reduce warning:[/yellow] JSON decode failed — returning raw chapter results")
        return chapter_results


def _fill_template(
    template: str,
    book_title: str,
    author: str,
    chapter_num: str,
    chapter_title: str,
    chapter_text: str,
    chapter_pages: str = "",
) -> str:
    return (
        template
        .replace("{{BOOK_TITLE}}", book_title)
        .replace("{{AUTHOR}}", author)
        .replace("{{CHAPTER_NUM}}", chapter_num)
        .replace("{{CHAPTER_TITLE}}", chapter_title)
        .replace("{{CHAPTER_TEXT}}", chapter_text)
        .replace("{{CHAPTER_PAGES}}", chapter_pages)
    )


def _get_system_prompt(template: str) -> str:
    """Extract system prompt from XML template."""
    match = re.search(r"<system_prompt>(.*?)</system_prompt>", template, re.DOTALL)
    return match.group(1).strip() if match else "You are an expert knowledge extractor."


def _parse_principles(text: str, output_path: Path) -> list[dict]:
    """Parse JSON from LLM response, save to file, return list."""
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
