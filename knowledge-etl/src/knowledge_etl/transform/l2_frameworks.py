"""
Transform L2: Extract strategic frameworks, heuristics, anti-patterns, triggers.
Output: {staging}/{book}/l2/final_frameworks.json
"""

from __future__ import annotations

import json
import re
import time
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ValidationError
from rich.console import Console

from knowledge_etl.config import (
    CHECKPOINTS,
    DEFAULT_MODEL_L2,
    MAX_OUTPUT_L2,
    PROMPTS_DIR,
    STAGING,
)
from knowledge_etl.utils.checkpoint import Checkpoint
from knowledge_etl.utils.cost import CostTracker
from knowledge_etl.utils.llm import LLMClient

console = Console()


class Framework(BaseModel):
    name: str
    type: Literal["explicit", "implicit"]
    description: str
    components: list[str] = []
    when_to_use: str = ""
    source_quote: str


class DecisionHeuristic(BaseModel):
    rule: str
    source_quote: str


class AntiPattern(BaseModel):
    mistake: str
    why_wrong: str
    source_quote: str


class TriggerQuestion(BaseModel):
    question: str
    purpose: str
    source_quote: str


class L2Result(BaseModel):
    core_frameworks: list[Framework] = []
    decision_heuristics: list[DecisionHeuristic] = []
    anti_patterns: list[AntiPattern] = []
    trigger_questions: list[TriggerQuestion] = []


def extract_l2(
    book_slug: str,
    full_text_path: Path,
    chapter_paths: list[Path],
    metadata: dict,
    strategy: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    model: str = DEFAULT_MODEL_L2,
) -> dict:
    """
    Extract strategic knowledge from the book.
    Always uses Map-Reduce (chapter-level) for L2 because multiple
    knowledge types need per-chapter granularity.
    Then runs a Reduce pass to unify and deduplicate across chapters.

    Returns unified dict with core_frameworks, decision_heuristics,
    anti_patterns, trigger_questions.
    """
    l2_dir = STAGING / book_slug / "l2"
    l2_dir.mkdir(parents=True, exist_ok=True)

    # Cache check — skip all API calls if final output already exists
    l2_dir = STAGING / book_slug / "l2"
    output_path = l2_dir / "final_frameworks.json"
    if output_path.exists():
        cached = json.loads(output_path.read_text(encoding="utf-8"))
        has_frameworks = (
            len(cached.get("unified_frameworks", [])) > 0
            or len(cached.get("core_frameworks", [])) > 0
        )
        if not has_frameworks:
            console.print("[yellow]L2 cache INVALID (0 frameworks) — re-running[/yellow]")
            output_path.unlink()
        else:
            framework_count = len(cached.get("unified_frameworks", cached.get("core_frameworks", [])))
            console.print(f"[dim]L2 cache hit: {framework_count} frameworks[/dim]")
            return cached

    checkpoint = Checkpoint(CHECKPOINTS, book_slug, "l2")

    prompt_template = (PROMPTS_DIR / "l2_frameworks.xml").read_text(encoding="utf-8")
    reduce_template = (PROMPTS_DIR / "reduce_synthesis.xml").read_text(encoding="utf-8")

    book_title = metadata.get("title") or book_slug
    author = metadata.get("author") or "Unknown"
    system = _get_system_prompt(prompt_template)

    chapter_results: list[dict] = []

    # MAP: Extract per chapter (reuses cached book if STUFF strategy)
    if strategy == "stuff":
        book_content = full_text_path.read_text(encoding="utf-8")
    else:
        book_content = None

    for chapter_path in chapter_paths:
        chapter_key = chapter_path.stem
        if checkpoint.is_done(chapter_key):
            console.print(f"  [dim]Skip (cached):[/dim] {chapter_key}")
            result = checkpoint.get_result(chapter_key)
            if result:
                chapter_results.append(result)
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
            chapter_text="[See cached book content]" if book_content else chapter_text,
            chapter_pages=chapter_pages,
        )

        console.print(f"  [cyan]L2:[/cyan] {chapter_key} (waiting 65s for rate limit...)")
        time.sleep(200)
        text, usage = llm.call(
            model=model,
            system_prompt=system,
            task_prompt=task_prompt,
            book_content=book_content,  # None for map-reduce (no cache reuse)
            max_tokens=MAX_OUTPUT_L2,
        )
        cost_tracker.record("l2_map", usage, chapter=chapter_key)

        result = _parse_l2(text, l2_dir / f"{chapter_key}.json")
        if result:
            chapter_results.append(result)
            checkpoint.mark_done(chapter_key, result, usage.cost_usd)

    # REDUCE: Synthesize across chapters
    console.print("[cyan]L2 Reduce:[/cyan] Cross-chapter synthesis")
    unified = _reduce(
        chapter_results=chapter_results,
        book_title=book_title,
        author=author,
        reduce_template=reduce_template,
        llm=llm,
        cost_tracker=cost_tracker,
        checkpoint=checkpoint,
    )

    output_path = l2_dir / "final_frameworks.json"
    output_path.write_text(
        json.dumps(unified, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    framework_count = len(unified.get("unified_frameworks", []))
    heuristic_count = len(unified.get("unified_heuristics", []))
    console.print(f"[green]L2 complete:[/green] {framework_count} frameworks, {heuristic_count} heuristics")
    return unified


def _is_valid_reduce(result: dict) -> bool:
    """Return True if the reduce result contains at least one framework."""
    return (
        len(result.get("unified_frameworks", [])) > 0
        or len(result.get("core_frameworks", [])) > 0
    )


def _reduce(
    chapter_results: list[dict],
    book_title: str,
    author: str,
    reduce_template: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    checkpoint: Checkpoint,
) -> dict:
    """Run the Reduce prompt to unify chapter extractions."""
    from knowledge_etl.config import DEFAULT_MODEL_L2, MAX_OUTPUT_REDUCE

    # Checkpoint hit — skip API call if reduce already succeeded
    cached = checkpoint.get_result("__reduce__")
    if cached and _is_valid_reduce(cached):
        console.print("[dim]L2 Reduce: cache hit (checkpoint)[/dim]")
        return cached

    reduce_system = _get_system_prompt(reduce_template)
    chapters_json = json.dumps(chapter_results, indent=2, ensure_ascii=False)

    task_prompt = (
        reduce_template
        .replace("{{BOOK_TITLE}}", book_title)
        .replace("{{AUTHOR}}", author)
        .replace("{{TOTAL_CHAPTERS}}", str(len(chapter_results)))
        .replace("{{JSON_ARRAY_OF_CHAPTER_RESULTS}}", chapters_json)
    )

    console.print("[cyan]L2 Reduce:[/cyan] waiting 200s for rate limit...")
    time.sleep(200)
    text, usage = llm.call(
        model=DEFAULT_MODEL_L2,
        system_prompt=reduce_system,
        task_prompt=task_prompt,
        max_tokens=MAX_OUTPUT_REDUCE,
    )
    cost_tracker.record("l2_reduce", usage)

    json_match = re.search(r"\{.*\}", text, re.DOTALL)
    if not json_match:
        result = {"raw_reduce": text, "chapter_results": chapter_results}
    else:
        try:
            result = json.loads(json_match.group())
        except json.JSONDecodeError:
            result = {"parse_error": True, "raw": text, "chapter_results": chapter_results}

    checkpoint.mark_done("__reduce__", result, cost_usd=usage.cost_usd)
    return result


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
    match = re.search(r"<system_prompt>(.*?)</system_prompt>", template, re.DOTALL)
    return match.group(1).strip() if match else "You are a knowledge architect."


def _parse_l2(text: str, output_path: Path) -> dict | None:
    json_match = re.search(r"\{.*\}", text, re.DOTALL)
    if not json_match:
        output_path.write_text(json.dumps({"raw": text}), encoding="utf-8")
        return None
    try:
        data = json.loads(json_match.group())
        try:
            validated = L2Result.model_validate(data)
            result = validated.model_dump()
        except ValidationError as ve:
            console.print(f"[yellow]L2 schema warning:[/yellow] {ve.error_count()} field(s) invalid — using raw")
            result = data
        output_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
        return result
    except json.JSONDecodeError:
        output_path.write_text(json.dumps({"error": "parse_failed", "raw": text}), encoding="utf-8")
        return None
