"""
Transform L3: Authorial DNA extraction — Voice DNA, Thinking DNA, Contradictions.
Uses Opus model with REFINE strategy (iterative chapter-by-chapter refinement).
Output: {staging}/{book}/l3/{voice_dna,thinking_dna,contradictions}.json
"""

from __future__ import annotations

import json
import re
import time
from pathlib import Path
from typing import Any, Type

from pydantic import BaseModel, ValidationError
from rich.console import Console

from knowledge_etl.config import (
    CHECKPOINTS,
    DEFAULT_MODEL_L3,
    MAX_OUTPUT_L3,
    PROMPTS_DIR,
    STAGING,
)
from knowledge_etl.utils.checkpoint import Checkpoint
from knowledge_etl.utils.cost import CostTracker
from knowledge_etl.utils.llm import LLMClient

console = Console()


class VoiceDNA(BaseModel):
    # Schema v2.0 — text-extractable fields only (no conversational/speaking style)
    writing_style_patterns: list[str] = []
    signature_vocabulary: list[str] = []
    sentence_structure: str = ""
    rhetorical_devices: list[str] = []
    pedagogical_approach: str = ""
    exemplar_quotes: list[str] = []
    chapter_observations: str = ""


class ThinkingDNA(BaseModel):
    # Schema v2.0 — reasoning patterns extractable from written text
    primary_reasoning_pattern: str = ""
    favorite_argumentative_move: str = ""
    mental_models: list[str] = []
    epistemic_style: str = ""
    favorite_analogies: list[str] = []
    decision_heuristics: list[str] = []
    exemplar_reasoning_quote: str = ""


class Contradiction(BaseModel):
    tension: str
    pole_a: dict
    pole_b: dict
    generative_insight: str
    authenticity_signal: str = ""


class ContradictionsResult(BaseModel):
    productive_contradictions: list[Contradiction] = []


def extract_l3(
    book_slug: str,
    full_text_path: Path,
    chapter_paths: list[Path],
    metadata: dict,
    llm: LLMClient,
    cost_tracker: CostTracker,
    model: str = DEFAULT_MODEL_L3,
    strategy: str = "stuff",
) -> dict:
    """
    Extract authorial DNA using REFINE strategy:
      1. Process ch01-03 to build base voice + thinking profiles
      2. Add ch04+ to refine profiles additively (NEVER overwrite early observations)
      3. Final pass on full book to extract Contradictions (Gold Layer)

    Args:
        strategy: "stuff" loads full book into cache for voice+thinking passes;
                  "map-reduce" skips cache (book too large).

    Returns dict with voice_dna, thinking_dna, contradictions.
    """
    l3_dir = STAGING / book_slug / "l3"
    l3_dir.mkdir(parents=True, exist_ok=True)

    book_title = metadata.get("title") or book_slug
    author = metadata.get("author") or "Unknown"

    # Prompt version — increment when prompts change to invalidate cached extractions
    L3_PROMPT_VERSION = "2.0"

    # Load prompt templates
    voice_template = (PROMPTS_DIR / "l3_voice_dna.xml").read_text(encoding="utf-8")
    thinking_template = (PROMPTS_DIR / "l3_thinking_dna.xml").read_text(encoding="utf-8")
    contradictions_template = (PROMPTS_DIR / "l3_contradictions.xml").read_text(encoding="utf-8")

    # Checkpoint for resume support — invalidate if prompt version changed
    checkpoint = Checkpoint(CHECKPOINTS, book_slug, "l3")
    cached_version = checkpoint._state.get("prompt_version", "1.0")
    if cached_version != L3_PROMPT_VERSION:
        console.print(f"[yellow]L3 prompt version changed ({cached_version} -> {L3_PROMPT_VERSION}) — resetting checkpoint[/yellow]")
        checkpoint.reset()
    checkpoint._state["prompt_version"] = L3_PROMPT_VERSION
    checkpoint._save()

    # P4 fix: cache book content for STUFF strategy — 60% cost reduction via prompt cache
    book_content_for_cache: str | None = None
    if strategy == "stuff":
        book_content_for_cache = full_text_path.read_text(encoding="utf-8")

    # Phase 1+2: REFINE voice and thinking DNA across chapters
    console.print(f"[cyan]L3 REFINE:[/cyan] Processing {len(chapter_paths)} chapters (Opus)")

    voice_profile = _refine_voice(
        chapter_paths=chapter_paths,
        book_title=book_title,
        author=author,
        template=voice_template,
        llm=llm,
        cost_tracker=cost_tracker,
        model=model,
        checkpoint=checkpoint,
        l3_dir=l3_dir,
        book_content=book_content_for_cache,
    )

    thinking_profile = _refine_thinking(
        chapter_paths=chapter_paths,
        book_title=book_title,
        author=author,
        template=thinking_template,
        llm=llm,
        cost_tracker=cost_tracker,
        model=model,
        checkpoint=checkpoint,
        l3_dir=l3_dir,
        book_content=book_content_for_cache,
    )

    # Phase 3: Contradictions on full book (Gold Layer)
    console.print("[cyan]L3 Contradictions:[/cyan] Full-book pass (Gold Layer)")
    contradictions = _extract_contradictions(
        full_text_path=full_text_path,
        book_title=book_title,
        author=author,
        template=contradictions_template,
        llm=llm,
        cost_tracker=cost_tracker,
        model=model,
        l3_dir=l3_dir,
    )

    result = {
        "voice_dna": voice_profile,
        "thinking_dna": thinking_profile,
        "contradictions": contradictions,
    }

    console.print("[green]L3 complete:[/green] Voice DNA + Thinking DNA + Contradictions extracted")
    return result


def _refine_voice(
    chapter_paths: list[Path],
    book_title: str,
    author: str,
    template: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    model: str,
    checkpoint: Checkpoint,
    l3_dir: Path,
    book_content: str | None = None,
) -> dict:
    """Iteratively refine voice DNA profile across chapters."""
    system = _get_system_prompt(template)
    prior_profile: str = ""
    latest_voice: dict = {}

    for chapter_path in chapter_paths:
        chapter_key = chapter_path.stem
        ckpt_key = f"voice_{chapter_key}"

        if checkpoint.is_done(ckpt_key):
            console.print(f"  [dim]Skip voice (cached):[/dim] {chapter_key}")
            cached = checkpoint.get_result(ckpt_key)
            if cached:
                latest_voice = cached
                prior_profile = json.dumps(cached, ensure_ascii=False)
            continue

        chapter_text = chapter_path.read_text(encoding="utf-8")
        chapter_title = chapter_path.stem.replace("-", " ").title()
        chapter_num = chapter_path.stem.split("-")[0]

        task_prompt = _fill_l3_template(
            template,
            book_title=book_title,
            author=author,
            chapter_num=chapter_num,
            chapter_title=chapter_title,
            chapter_text=chapter_text,
            prior_profile=prior_profile,
        )

        console.print(f"  [cyan]L3 Voice:[/cyan] {chapter_key} (waiting 65s for rate limit...)")
        time.sleep(200)
        text, usage = llm.call(
            model=model,
            system_prompt=system,
            task_prompt=task_prompt,
            book_content=book_content,
            max_tokens=MAX_OUTPUT_L3,
        )
        cost_tracker.record("l3_voice", usage, chapter=chapter_key)

        parsed = _parse_json(text, VoiceDNA)
        if parsed:
            latest_voice = parsed
            prior_profile = json.dumps(parsed, ensure_ascii=False)
            checkpoint.mark_done(ckpt_key, parsed, usage.cost_usd)

    # Save final voice DNA
    output_path = l3_dir / "voice_dna.json"
    output_path.write_text(
        json.dumps(latest_voice, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return latest_voice


def _refine_thinking(
    chapter_paths: list[Path],
    book_title: str,
    author: str,
    template: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    model: str,
    checkpoint: Checkpoint,
    l3_dir: Path,
    book_content: str | None = None,
) -> dict:
    """Iteratively refine thinking DNA profile across chapters."""
    system = _get_system_prompt(template)
    prior_profile: str = ""
    latest_thinking: dict = {}

    for chapter_path in chapter_paths:
        chapter_key = chapter_path.stem
        ckpt_key = f"thinking_{chapter_key}"

        if checkpoint.is_done(ckpt_key):
            console.print(f"  [dim]Skip thinking (cached):[/dim] {chapter_key}")
            cached = checkpoint.get_result(ckpt_key)
            if cached:
                latest_thinking = cached
                prior_profile = json.dumps(cached, ensure_ascii=False)
            continue

        chapter_text = chapter_path.read_text(encoding="utf-8")
        chapter_title = chapter_path.stem.replace("-", " ").title()
        chapter_num = chapter_path.stem.split("-")[0]

        task_prompt = _fill_l3_template(
            template,
            book_title=book_title,
            author=author,
            chapter_num=chapter_num,
            chapter_title=chapter_title,
            chapter_text=chapter_text,
            prior_profile=prior_profile,
        )

        console.print(f"  [cyan]L3 Thinking:[/cyan] {chapter_key} (waiting 65s for rate limit...)")
        time.sleep(200)
        text, usage = llm.call(
            model=model,
            system_prompt=system,
            task_prompt=task_prompt,
            book_content=book_content,
            max_tokens=MAX_OUTPUT_L3,
        )
        cost_tracker.record("l3_thinking", usage, chapter=chapter_key)

        parsed = _parse_json(text, ThinkingDNA)
        if parsed:
            latest_thinking = parsed
            prior_profile = json.dumps(parsed, ensure_ascii=False)
            checkpoint.mark_done(ckpt_key, parsed, usage.cost_usd)

    # Save final thinking DNA
    output_path = l3_dir / "thinking_dna.json"
    output_path.write_text(
        json.dumps(latest_thinking, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return latest_thinking


def _extract_contradictions(
    full_text_path: Path,
    book_title: str,
    author: str,
    template: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    model: str,
    l3_dir: Path,
) -> dict:
    """Extract productive contradictions from the full book text."""
    system = _get_system_prompt(template)
    book_content = full_text_path.read_text(encoding="utf-8")

    task_prompt = (
        template
        .replace("{{BOOK_TITLE}}", book_title)
        .replace("{{AUTHOR}}", author)
        .replace("{{CHAPTER_NUM}}", "ALL")
        .replace("{{CHAPTER_TITLE}}", "Full Book")
        .replace("{{FULL_BOOK_TEXT}}", "[See cached book content]")
    )

    console.print("  [cyan]L3 Contradictions:[/cyan] full book (waiting 300s for rate limit...)")
    time.sleep(300)
    text, usage = llm.call(
        model=model,
        system_prompt=system,
        task_prompt=task_prompt,
        book_content=book_content,
        max_tokens=MAX_OUTPUT_L3,
    )
    cost_tracker.record("l3_contradictions", usage)

    parsed = _parse_json(text, ContradictionsResult)
    result = parsed if parsed else {"productive_contradictions": [], "raw": text}

    output_path = l3_dir / "contradictions.json"
    output_path.write_text(
        json.dumps(result, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return result


def _fill_l3_template(
    template: str,
    book_title: str,
    author: str,
    chapter_num: str,
    chapter_title: str,
    chapter_text: str,
    prior_profile: str,
) -> str:
    """Fill L3 template placeholders including prior profile."""
    return (
        template
        .replace("{{BOOK_TITLE}}", book_title)
        .replace("{{AUTHOR}}", author)
        .replace("{{CHAPTER_NUM}}", chapter_num)
        .replace("{{CHAPTER_TITLE}}", chapter_title)
        .replace("{{CHAPTER_TEXT}}", chapter_text)
        .replace("{{PRIOR_PROFILE}}", prior_profile)
    )


def _get_system_prompt(template: str) -> str:
    """Extract system prompt from XML template."""
    match = re.search(r"<system_prompt>(.*?)</system_prompt>", template, re.DOTALL)
    return match.group(1).strip() if match else "You are an expert authorial analyst."


def _parse_json(text: str, pydantic_model: Type[BaseModel] | None = None) -> dict | None:
    """Parse JSON from LLM response, handling markdown code blocks.

    If pydantic_model is provided, validates the parsed data against the schema.
    Handles LLM single-key wrapping: {"thinking_dna": {...}} is unwrapped to {...}
    before validation, preventing silent all-default Pydantic output.
    On ValidationError, falls back to raw parsed dict with a yellow warning.
    """
    json_match = re.search(r"\{.*\}", text, re.DOTALL)
    if not json_match:
        return None
    try:
        data = json.loads(json_match.group())
    except json.JSONDecodeError:
        return None

    if pydantic_model is None:
        return data

    # Unwrap single-key wrapper dicts: {"thinking_dna": {...}} → {...}
    # LLMs sometimes wrap the payload under a named key. If we pass the wrapper
    # directly to Pydantic, all fields silently default (no ValidationError raised).
    # Only unwrap when the single value is a dict (not a list, as in ContradictionsResult).
    payload = data
    if len(data) == 1:
        inner = next(iter(data.values()))
        if isinstance(inner, dict):
            wrapper_key = next(iter(data))
            console.print(f"[dim]L3 parse: unwrapping '{wrapper_key}' wrapper for {pydantic_model.__name__}[/dim]")
            payload = inner

    try:
        validated = pydantic_model.model_validate(payload)
        return validated.model_dump()
    except ValidationError as ve:
        console.print(f"[yellow]L3 schema warning ({pydantic_model.__name__}):[/yellow] {ve.error_count()} field(s) invalid — using raw")
        return payload
