"""
Validate phase: Quote verification using Haiku.
Checks that extracted knowledge items are faithfully grounded in source text.
Items scoring below FAITHFULNESS_THRESHOLD are flagged for human review.
"""

from __future__ import annotations

import json
import re
import time
from pathlib import Path

from rich.console import Console

from knowledge_etl.config import (
    DEFAULT_MODEL_VALIDATE,
    FAITHFULNESS_THRESHOLD,
    MAX_OUTPUT_VALIDATE,
    PROMPTS_DIR,
    STAGING,
)
from knowledge_etl.utils.cost import CostTracker
from knowledge_etl.utils.llm import LLMClient

console = Console()


def validate_faithfulness(
    book_slug: str,
    full_text_path: Path,
    l1_results: list[dict],
    l2_results: dict,
    l3_results: dict | None = None,
    llm: LLMClient | None = None,
    cost_tracker: CostTracker | None = None,
    model: str = DEFAULT_MODEL_VALIDATE,
) -> dict:
    """
    Verify extracted knowledge against source text using Haiku.

    Checks:
      1. Quote accuracy (verbatim match in source)
      2. Faithfulness (claim represents author's argument)
      3. Source provenance (from this text, not hallucinated)

    Returns:
        {
          "l1_verification": {...},
          "l2_verification": {...},
          "l3_verification": {...},  # if l3_results provided
          "overall_score": 0.92,
          "flagged_items": [...],
        }
    """
    assert llm is not None, "LLMClient is required for validation"
    assert cost_tracker is not None, "CostTracker is required for validation"

    validate_dir = STAGING / book_slug / "validation"
    validate_dir.mkdir(parents=True, exist_ok=True)

    prompt_template = (PROMPTS_DIR / "verify_faithfulness.xml").read_text(encoding="utf-8")
    system = _get_system_prompt(prompt_template)

    source_text = full_text_path.read_text(encoding="utf-8")

    all_verifications: list[dict] = []
    all_flagged: list[dict] = []

    # Verify L1 principles
    if l1_results:
        console.print(f"[cyan]Validate L1:[/cyan] {len(l1_results)} principles")
        l1_verify = _verify_batch(
            items=l1_results,
            label="l1",
            source_text=source_text,
            system=system,
            prompt_template=prompt_template,
            llm=llm,
            cost_tracker=cost_tracker,
            model=model,
            output_dir=validate_dir,
        )
        all_verifications.append(l1_verify)
        all_flagged.extend(l1_verify.get("flagged", []))

    # Verify L2 frameworks
    l2_items = _flatten_l2(l2_results)
    if l2_items:
        console.print(f"[cyan]Validate L2:[/cyan] {len(l2_items)} items")
        l2_verify = _verify_batch(
            items=l2_items,
            label="l2",
            source_text=source_text,
            system=system,
            prompt_template=prompt_template,
            llm=llm,
            cost_tracker=cost_tracker,
            model=model,
            output_dir=validate_dir,
        )
        all_verifications.append(l2_verify)
        all_flagged.extend(l2_verify.get("flagged", []))

    # Verify L3 if present
    l3_verify = None
    if l3_results:
        l3_items = _flatten_l3(l3_results)
        if l3_items:
            console.print(f"[cyan]Validate L3:[/cyan] {len(l3_items)} items")
            l3_verify = _verify_batch(
                items=l3_items,
                label="l3",
                source_text=source_text,
                system=system,
                prompt_template=prompt_template,
                llm=llm,
                cost_tracker=cost_tracker,
                model=model,
                output_dir=validate_dir,
            )
            all_flagged.extend(l3_verify.get("flagged", []))

    # Calculate overall score
    total_items = sum(v.get("total_items", 0) for v in all_verifications)
    total_passed = sum(v.get("passed_items", 0) for v in all_verifications)
    overall_score = total_passed / total_items if total_items > 0 else 1.0

    # Flag low-scoring items
    low_score_items = [f for f in all_flagged if f.get("status") == "FAIL"]

    result = {
        "overall_score": round(overall_score, 4),
        "total_items": total_items,
        "passed": total_passed,
        "flagged_items": all_flagged,
        "below_threshold": len(low_score_items),
        "threshold": FAITHFULNESS_THRESHOLD,
    }

    # Save validation report
    report_path = validate_dir / "faithfulness_report.json"
    report_path.write_text(
        json.dumps(result, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    status = "[green]PASS[/green]" if overall_score >= FAITHFULNESS_THRESHOLD else "[red]BELOW THRESHOLD[/red]"
    console.print(f"[bold]Faithfulness:[/bold] {overall_score:.1%} {status} ({len(all_flagged)} flagged)")

    return result


def _verify_batch(
    items: list[dict],
    label: str,
    source_text: str,
    system: str,
    prompt_template: str,
    llm: LLMClient,
    cost_tracker: CostTracker,
    model: str,
    output_dir: Path,
) -> dict:
    """Verify a batch of items against source text."""
    # Build the JSON to verify
    items_json = json.dumps(items, indent=2, ensure_ascii=False)

    task_prompt = (
        prompt_template
        .replace("{{CHAPTER_TEXT}}", "[See cached source content]")
        .replace("{{JSON_OUTPUT}}", items_json)
    )

    console.print(f"  [dim]Validate {label}: waiting 120s for rate limit...[/dim]")
    time.sleep(120)
    text, usage = llm.call(
        model=model,
        system_prompt=system,
        task_prompt=task_prompt,
        book_content=source_text,
        max_tokens=MAX_OUTPUT_VALIDATE,
    )
    cost_tracker.record(f"validate_{label}", usage)

    parsed = _parse_json(text)
    if not parsed:
        parsed = {"verified": [], "flagged": [], "faithfulness_score": 0.0}

    # Enrich flagged items with level label
    for item in parsed.get("flagged", []):
        item["level"] = label

    # Count pass/fail
    verified_count = len(parsed.get("verified", []))
    flagged_count = len(parsed.get("flagged", []))

    result = {
        "level": label,
        "total_items": verified_count + flagged_count,
        "passed_items": verified_count,
        "flagged": parsed.get("flagged", []),
        "faithfulness_score": parsed.get("faithfulness_score", 0.0),
    }

    # Save per-level results
    output_path = output_dir / f"{label}_verification.json"
    output_path.write_text(
        json.dumps(result, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    return result


def _flatten_l2(l2_results: dict) -> list[dict]:
    """Flatten L2 results into a list of items with source_quote for verification."""
    items: list[dict] = []
    for key in ("unified_frameworks", "core_frameworks", "decision_heuristics",
                "unified_heuristics", "anti_patterns", "trigger_questions"):
        for item in l2_results.get(key, []):
            if isinstance(item, dict) and item.get("source_quote"):
                items.append(item)
    return items


def _flatten_l3(l3_results: dict) -> list[dict]:
    """Flatten L3 results into verifiable items."""
    items: list[dict] = []

    # Voice DNA exemplar quotes
    voice = l3_results.get("voice_dna", {})
    if isinstance(voice, dict):
        for quote in voice.get("exemplar_quotes", []):
            items.append({"type": "voice_exemplar", "source_quote": quote})
        for device in voice.get("rhetorical_devices", []):
            if ":" in str(device):
                items.append({"type": "rhetorical_device", "source_quote": str(device).split(":", 1)[1].strip()})

    # Thinking DNA exemplar
    thinking = l3_results.get("thinking_dna", {})
    if isinstance(thinking, dict):
        exemplar = thinking.get("exemplar_reasoning_quote")
        if exemplar:
            items.append({"type": "thinking_exemplar", "source_quote": exemplar})

    # Contradictions quotes
    contradictions = l3_results.get("contradictions", {})
    if isinstance(contradictions, dict):
        for c in contradictions.get("productive_contradictions", []):
            if isinstance(c, dict):
                pole_a = c.get("pole_a", {})
                pole_b = c.get("pole_b", {})
                if isinstance(pole_a, dict) and pole_a.get("supporting_quote"):
                    items.append({"type": "contradiction_pole_a", "source_quote": pole_a["supporting_quote"]})
                if isinstance(pole_b, dict) and pole_b.get("supporting_quote"):
                    items.append({"type": "contradiction_pole_b", "source_quote": pole_b["supporting_quote"]})

    return items


def _get_system_prompt(template: str) -> str:
    """Extract system prompt from XML template."""
    match = re.search(r"<system_prompt>(.*?)</system_prompt>", template, re.DOTALL)
    return match.group(1).strip() if match else "You are a fact-checker."


def _parse_json(text: str) -> dict | None:
    """Parse JSON from LLM response."""
    json_match = re.search(r"\{.*\}", text, re.DOTALL)
    if not json_match:
        return None
    try:
        return json.loads(json_match.group())
    except json.JSONDecodeError:
        return None
