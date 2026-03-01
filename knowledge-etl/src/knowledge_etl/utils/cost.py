"""
Cost tracking across the full pipeline run.
Aggregates per-call UsageStats into per-book and per-run totals.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from knowledge_etl.utils.llm import UsageStats


@dataclass
class CostTracker:
    """Accumulates token usage and cost across all API calls in a run."""

    entries: list[dict] = field(default_factory=list)

    def record(self, phase: str, usage: UsageStats, chapter: str = "") -> None:
        self.entries.append(
            {
                "phase": phase,
                "chapter": chapter,
                "model": usage.model_id,
                "input_tokens": usage.input_tokens,
                "output_tokens": usage.output_tokens,
                "cache_creation": usage.cache_creation_tokens,
                "cache_read": usage.cache_read_tokens,
                "cost_usd": usage.cost_usd,
            }
        )

    @property
    def total_cost(self) -> float:
        return sum(e["cost_usd"] for e in self.entries)

    @property
    def total_input_tokens(self) -> int:
        return sum(e["input_tokens"] for e in self.entries)

    @property
    def total_output_tokens(self) -> int:
        return sum(e["output_tokens"] for e in self.entries)

    @property
    def cache_savings_usd(self) -> float:
        """Estimated cost saved by cache hits vs full price."""
        saved = 0.0
        for e in self.entries:
            # Cache read is ~10% of full input price
            # Savings = (full_price - cache_price) * cache_read_tokens
            from knowledge_etl.utils.llm import UsageStats
            prices = UsageStats.PRICES.get(e["model"], UsageStats.PRICES["claude-sonnet-4-6"])
            full_price_per_token = prices["input"] / 1_000_000
            cache_price_per_token = prices["cache_read"] / 1_000_000
            saved += e["cache_read"] * (full_price_per_token - cache_price_per_token)
        return saved

    def summary(self) -> str:
        lines = [
            "─" * 50,
            "Cost Summary",
            "─" * 50,
        ]
        by_phase: dict[str, float] = {}
        for e in self.entries:
            by_phase[e["phase"]] = by_phase.get(e["phase"], 0.0) + e["cost_usd"]

        for phase, cost in by_phase.items():
            lines.append(f"  {phase:<20} ${cost:.4f}")

        lines += [
            "─" * 50,
            f"  {'Total':<20} ${self.total_cost:.4f}",
            f"  {'Cache savings':<20} ${self.cache_savings_usd:.4f}",
            f"  {'Input tokens':<20} {self.total_input_tokens:,}",
            f"  {'Output tokens':<20} {self.total_output_tokens:,}",
            "─" * 50,
        ]
        return "\n".join(lines)
