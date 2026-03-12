"""
Assess phase: count tokens and decide processing strategy.
STUFF = full book fits in 200K context → single cached session.
MAP-REDUCE = book > 200K tokens → process chapter by chapter.
"""

from __future__ import annotations

import json
from pathlib import Path

from rich.console import Console

from knowledge_etl.config import (
    CHECKPOINTS,
    DEFAULT_MODEL_L1,
    PROMPT_OVERHEAD_TOKENS,
    STUFF_THRESHOLD_TOKENS,
    MODELS,
)
from knowledge_etl.utils.llm import LLMClient

console = Console()


def assess(full_text_path: Path, llm: LLMClient) -> dict:
    """
    Count tokens in the book and select the extraction strategy.

    Returns:
        {
          "token_count": 95420,
          "strategy": "stuff" | "map-reduce",
          "model_id": "claude-sonnet-4-6",
          "estimated_cost_usd": 1.27,
        }
    """
    # Cache assessment to avoid repeated API calls on re-runs
    book_slug = full_text_path.parent.name
    cache_path = CHECKPOINTS / book_slug / "assess.json"
    cache_path.parent.mkdir(parents=True, exist_ok=True)

    if cache_path.exists():
        cached = json.loads(cache_path.read_text(encoding="utf-8"))
        console.print(f"[dim]Assess cache hit: {cached['token_count']:,} tokens[/dim]")
        return cached

    text = full_text_path.read_text(encoding="utf-8")

    console.print("[cyan]Counting tokens...[/cyan]")
    token_count = llm.count_tokens(
        model=DEFAULT_MODEL_L1,
        system_prompt="You are an expert knowledge extractor.",
        content=text,
    )

    effective_tokens = token_count + PROMPT_OVERHEAD_TOKENS
    strategy = "stuff" if effective_tokens < STUFF_THRESHOLD_TOKENS else "map-reduce"

    # Rough cost estimate (L1 + L2 + L3 with cache)
    estimated_cost = _estimate_cost(token_count, strategy)

    result = {
        "token_count": token_count,
        "strategy": strategy,
        "estimated_cost_usd": estimated_cost,
    }

    # Save to cache
    cache_path.write_text(json.dumps(result, indent=2), encoding="utf-8")

    console.print(
        f"[bold]Tokens:[/bold] {token_count:,} -> "
        f"[bold]Strategy:[/bold] {strategy.upper()} "
        f"[dim](~${estimated_cost:.2f} estimated)[/dim]"
    )
    return result


def _estimate_cost(token_count: int, strategy: str) -> float:
    """Rough cost estimate for full L1+L2+L3 pipeline with prompt caching."""
    from knowledge_etl.utils.llm import UsageStats

    # First pass: full input cost (cache creation)
    # Subsequent passes: 10% cache read cost

    sonnet_prices = UsageStats.PRICES["claude-sonnet-4-6"]
    opus_prices = UsageStats.PRICES["claude-opus-4-6"]
    haiku_prices = UsageStats.PRICES["claude-haiku-4-5-20251001"]
    m = 1_000_000

    # L1: Sonnet — cache creation on first pass
    l1_cost = (token_count / m) * sonnet_prices["cache_write"] + (3_000 / m) * sonnet_prices["output"]

    # L2: Sonnet — cache read (90% off)
    l2_cost = (token_count / m) * sonnet_prices["cache_read"] + (45_000 / m) * sonnet_prices["output"]

    # L3: Opus — cache read
    l3_cost = (token_count / m) * opus_prices["cache_read"] + (48_000 / m) * opus_prices["output"]

    # Validate + Reduce: Haiku
    validate_cost = (60_000 / m) * haiku_prices["input"] + (5_000 / m) * haiku_prices["output"]
    reduce_cost = (50_000 / m) * haiku_prices["input"] + (20_000 / m) * haiku_prices["output"]

    return l1_cost + l2_cost + l3_cost + validate_cost + reduce_cost
