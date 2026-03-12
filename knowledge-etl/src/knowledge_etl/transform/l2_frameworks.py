"""
Transform L2: Extract strategic frameworks, heuristics, anti-patterns, triggers.
Output: {staging}/{book}/l2/final_frameworks.json
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Literal

from pydantic import BaseModel, ValidationError
from rich.console import Console

from knowledge_etl.config import (
    CHECKPOINTS,
    DEFAULT_MODEL_L2,
    DEFAULT_MODEL_L2_MAP,
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


class L2ReduceResult(BaseModel):
    """Expected shape of the cross-chapter synthesis (reduce_synthesis.xml output)."""
    unified_frameworks: list[dict[str, Any]] = []
    unified_heuristics: list[dict[str, Any]] = []
    unified_anti_patterns: list[dict[str, Any]] = []
    unified_trigger_questions: list[dict[str, Any]] = []


class L2ReducePassA(BaseModel):
    """Pass A: dense structural fields — frameworks and heuristics."""
    unified_frameworks: list[dict[str, Any]] = []
    unified_heuristics: list[dict[str, Any]] = []


class L2ReducePassB(BaseModel):
    """Pass B: higher-volume fields — anti-patterns and trigger questions."""
    unified_anti_patterns: list[dict[str, Any]] = []
    unified_trigger_questions: list[dict[str, Any]] = []


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

        console.print(f"  [cyan]L2:[/cyan] {chapter_key}")
        result, usage = _extract_chapter(
            chapter_path=chapter_path,
            book_title=book_title,
            author=author,
            prompt_template=prompt_template,
            system=system,
            book_content=book_content,
            llm=llm,
            cost_tracker=cost_tracker,
        )

        (l2_dir / f"{chapter_key}.json").write_text(
            json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        chapter_results.append(result)
        checkpoint.mark_done(chapter_key, result, usage.cost_usd)

    # REDUCE: Two-pass synthesis across chapters
    # Pass A: dense structural fields (frameworks + heuristics)
    console.print("[cyan]L2 Reduce Pass A:[/cyan] frameworks + heuristics")
    pass_a = _reduce_pass(
        chapter_results=chapter_results,
        book_title=book_title,
        author=author,
        reduce_template=reduce_template,
        llm=llm,
        cost_tracker=cost_tracker,
        checkpoint=checkpoint,
        checkpoint_key="__reduce_a__",
        cost_phase="l2_reduce_a",
        output_schema=L2ReducePassA.model_json_schema(),
        tool_name="synthesize_frameworks_a",
    )

    # Pass B: higher-volume fields (anti-patterns + triggers)
    # Failure here must not abort the pipeline — Pass A (frameworks) is more valuable
    console.print("[cyan]L2 Reduce Pass B:[/cyan] anti-patterns + trigger questions")
    try:
        pass_b = _reduce_pass(
            chapter_results=chapter_results,
            book_title=book_title,
            author=author,
            reduce_template=reduce_template,
            llm=llm,
            cost_tracker=cost_tracker,
            checkpoint=checkpoint,
            checkpoint_key="__reduce_b__",
            cost_phase="l2_reduce_b",
            output_schema=L2ReducePassB.model_json_schema(),
            tool_name="synthesize_frameworks_b",
        )
    except Exception as exc:
        console.print(f"[yellow]L2 Reduce Pass B failed — preserving Pass A result:[/yellow] {exc}")
        pass_b = {"unified_anti_patterns": [], "unified_trigger_questions": []}

    unified = {**pass_a, **pass_b}

    output_path = l2_dir / "final_frameworks.json"
    output_path.write_text(
        json.dumps(unified, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    # AC-3: Cost summary — aggregated from cost_tracker, not hardcoded
    map_cost = sum(e["cost_usd"] for e in cost_tracker.entries if e["phase"] == "l2_map")
    pass_a_cost = sum(e["cost_usd"] for e in cost_tracker.entries if e["phase"] == "l2_reduce_a")
    pass_b_cost = sum(e["cost_usd"] for e in cost_tracker.entries if e["phase"] == "l2_reduce_b")
    map_count = sum(1 for e in cost_tracker.entries if e["phase"] == "l2_map")
    l2_total = map_cost + pass_a_cost + pass_b_cost
    console.print(
        f"L2 MAP (haiku): {map_count} chapters — ${map_cost:.2f}\n"
        f"L2 REDUCE Pass A (sonnet): frameworks — ${pass_a_cost:.2f}\n"
        f"L2 REDUCE Pass B (sonnet): heuristics/anti_patterns — ${pass_b_cost:.2f}\n"
        f"L2 total: ${l2_total:.2f}  (vs ~$3.80 baseline)"
    )

    framework_count = len(unified.get("unified_frameworks", []))
    heuristic_count = len(unified.get("unified_heuristics", []))
    console.print(f"[green]L2 complete:[/green] {framework_count} frameworks, {heuristic_count} heuristics")
    return unified


def _extract_chapter(
    chapter_path: Path,
    book_title: str,
    author: str,
    prompt_template: str,
    system: str,
    book_content: str | None,
    llm: LLMClient,
    cost_tracker: CostTracker,
) -> tuple[dict, Any]:
    """Extract L2 frameworks from a single chapter using Haiku (DEFAULT_MODEL_L2_MAP).

    Uses Haiku instead of Sonnet because framework listing per chapter is mechanically
    simple — no deep reasoning required. Cost savings: ~73% vs Sonnet per call.
    Structured output (call_structured / tool_use) from Story 22.2 makes Haiku viable
    by eliminating parse failures due to ambiguous format.
    """
    chapter_text = chapter_path.read_text(encoding="utf-8")
    chapter_title = chapter_path.stem.replace("-", " ").title()
    chapter_num = chapter_path.stem.split("-")[0]

    pages_match = re.search(r"<!--\s*pages:\s*(\d+-\d+|unknown)\s*-->", chapter_text)
    chapter_pages = (
        f"pp. {pages_match.group(1)}"
        if (pages_match and pages_match.group(1) != "unknown")
        else ""
    )

    task_prompt = _fill_template(
        prompt_template,
        book_title=book_title,
        author=author,
        chapter_num=chapter_num,
        chapter_title=chapter_title,
        chapter_text="[See cached book content]" if book_content else chapter_text,
        chapter_pages=chapter_pages,
    )

    result, usage = llm.call_structured(
        model=DEFAULT_MODEL_L2_MAP,
        system_prompt=system,
        task_prompt=task_prompt,
        output_schema=L2Result.model_json_schema(),
        tool_name="extract_frameworks",
        book_content=book_content,
        max_tokens=MAX_OUTPUT_L2,
    )
    cost_tracker.record("l2_map", usage, chapter=chapter_path.stem)
    return result, usage


def _reduce_pass(
    chapter_results: list[dict],
    book_title: str,
    author: str,
    reduce_template: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    checkpoint: Checkpoint,
    checkpoint_key: str,
    cost_phase: str,
    output_schema: dict,
    tool_name: str,
) -> dict:
    """Run one reduce pass constrained to a specific output schema (Pass A or Pass B).

    Each pass gets its own token budget (adaptive_max) and checkpoint key.
    Pass A covers dense structural fields; Pass B covers higher-volume fields.
    Both passes use DEFAULT_MODEL_L2 (Sonnet) — only MAP uses Haiku.
    """
    from knowledge_etl.config import DEFAULT_MODEL_L2, MAX_OUTPUT_REDUCE

    cached = checkpoint.get_result(checkpoint_key)
    if cached:
        console.print(f"[dim]L2 Reduce {checkpoint_key}: cache hit[/dim]")
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

    # adaptive_max: each pass gets its own independent budget (Story 22.3 + 22.4)
    adaptive_max = min(32_768, max(MAX_OUTPUT_REDUCE, len(chapter_results) * 2_000))
    result, usage = llm.call_structured(
        model=DEFAULT_MODEL_L2,
        system_prompt=reduce_system,
        task_prompt=task_prompt,
        output_schema=output_schema,
        tool_name=tool_name,
        max_tokens=adaptive_max,
    )
    cost_tracker.record(cost_phase, usage)
    checkpoint.mark_done(checkpoint_key, result, cost_usd=usage.cost_usd)
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


# DEPRECATED (Story 22.2): replaced by call_structured() — kept for reference only.
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
