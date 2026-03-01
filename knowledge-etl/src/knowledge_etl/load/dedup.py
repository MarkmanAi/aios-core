"""
Semantic deduplication using sentence-transformers + cosine similarity.
Items above DEDUP_SIMILARITY_BLOCK are blocked as duplicates.
Items between DEDUP_SIMILARITY_REVIEW and BLOCK are sent to Haiku for classification.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from rich.console import Console

from knowledge_etl.config import (
    DEFAULT_MODEL_DEDUP,
    DEDUP_SIMILARITY_BLOCK,
    DEDUP_SIMILARITY_REVIEW,
)
from knowledge_etl.utils.cost import CostTracker
from knowledge_etl.utils.llm import LLMClient

if TYPE_CHECKING:
    import numpy as np
    from sentence_transformers import SentenceTransformer

console = Console()

# Lazy-loaded model singleton
_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    """Load the sentence-transformers model (cached after first call)."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        console.print("[dim]Loading embedding model (all-MiniLM-L6-v2)...[/dim]")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def deduplicate(
    new_items: list[dict],
    existing_items: list[dict],
    text_key: str = "principle",
    llm: LLMClient | None = None,
    cost_tracker: CostTracker | None = None,
) -> list[dict]:
    """
    Filter new_items against existing_items using semantic similarity.

    Args:
        new_items: Items to potentially add.
        existing_items: Items already in the target file.
        text_key: Key in item dict containing the text to compare.
        llm: LLMClient for Haiku classification in the gray zone.
        cost_tracker: CostTracker for recording Haiku costs.

    Returns:
        List of items from new_items that are NOT duplicates.
    """
    if not existing_items:
        return new_items

    if not new_items:
        return []

    import numpy as np

    model = _get_model()

    # Extract text for embedding
    existing_texts = [_get_text(item, text_key) for item in existing_items]
    existing_embeddings = model.encode(existing_texts, normalize_embeddings=True)

    unique_items: list[dict] = []

    for item in new_items:
        item_text = _get_text(item, text_key)
        item_embedding = model.encode([item_text], normalize_embeddings=True)

        # Compute cosine similarity against all existing
        similarities = np.dot(existing_embeddings, item_embedding.T).flatten()
        max_similarity = float(np.max(similarities)) if len(similarities) > 0 else 0.0

        if max_similarity >= DEDUP_SIMILARITY_BLOCK:
            # Clearly a duplicate — skip
            console.print(f"  [dim]Dedup SKIP (sim={max_similarity:.3f}):[/dim] {item_text[:60]}...")
            continue

        if max_similarity >= DEDUP_SIMILARITY_REVIEW:
            # Gray zone — ask Haiku to classify
            if llm and cost_tracker:
                classification = _haiku_classify(
                    new_text=item_text,
                    existing_text=existing_texts[int(np.argmax(similarities))],
                    similarity=max_similarity,
                    llm=llm,
                    cost_tracker=cost_tracker,
                )
                if classification == "DUPLICATE":
                    console.print(f"  [dim]Dedup SKIP (Haiku=DUP):[/dim] {item_text[:60]}...")
                    continue
                console.print(f"  [green]Dedup KEEP (Haiku={classification}):[/green] {item_text[:60]}...")
            else:
                # No LLM available — conservative: keep it
                console.print(f"  [yellow]Dedup KEEP (no Haiku, sim={max_similarity:.3f}):[/yellow] {item_text[:60]}...")

        # Distinct or classified as non-duplicate — keep
        unique_items.append(item)

        # Add to existing pool for subsequent comparisons within this batch
        new_embedding = model.encode([item_text], normalize_embeddings=True)
        existing_embeddings = np.vstack([existing_embeddings, new_embedding])
        existing_texts.append(item_text)

    console.print(f"[green]Dedup:[/green] {len(unique_items)}/{len(new_items)} items are unique")
    return unique_items


def _get_text(item: dict[str, Any], text_key: str) -> str:
    """Extract text from an item dict, trying text_key then common alternatives."""
    if text_key in item:
        return str(item[text_key])
    # Fallback keys
    for key in ("name", "rule", "question", "tension", "description", "claim"):
        if key in item:
            return str(item[key])
    # Last resort: serialize the whole item
    return str(item)


def _haiku_classify(
    new_text: str,
    existing_text: str,
    similarity: float,
    llm: LLMClient,
    cost_tracker: CostTracker,
) -> str:
    """Ask Haiku to classify whether two items are DUPLICATE, RELATED, or DISTINCT."""
    system = "You are a semantic similarity classifier. Respond with exactly one word: DUPLICATE, RELATED, or DISTINCT."
    task = (
        f"Compare these two knowledge items:\n\n"
        f"EXISTING: {existing_text}\n\n"
        f"NEW: {new_text}\n\n"
        f"Cosine similarity: {similarity:.3f}\n\n"
        f"Classify: Are they expressing the SAME insight (DUPLICATE), "
        f"related but distinct insights (RELATED), or completely different (DISTINCT)?\n\n"
        f"Respond with exactly one word."
    )

    text, usage = llm.call(
        model=DEFAULT_MODEL_DEDUP,
        system_prompt=system,
        task_prompt=task,
        max_tokens=10,
    )
    cost_tracker.record("dedup_classify", usage)

    result = text.strip().upper()
    if result in ("DUPLICATE", "RELATED", "DISTINCT"):
        return result
    return "RELATED"  # Default to keeping on ambiguity
