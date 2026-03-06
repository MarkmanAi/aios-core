"""
Semantic deduplication using sentence-transformers + FAISS + SQLite persistence.
Items above DEDUP_SIMILARITY_BLOCK are blocked as duplicates.
Items between DEDUP_SIMILARITY_REVIEW and BLOCK are sent to Haiku for classification.
Cross-run persistence via SQLite registry + FAISS index.
"""

from __future__ import annotations

import hashlib
import pickle
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import TYPE_CHECKING, Any

import numpy as np
from rich.console import Console

from knowledge_etl.config import (
    DEDUP_DB,
    DEFAULT_MODEL_DEDUP,
    DEDUP_SIMILARITY_BLOCK,
    DEDUP_SIMILARITY_REVIEW,
)
from knowledge_etl.utils.cost import CostTracker
from knowledge_etl.utils.llm import LLMClient

if TYPE_CHECKING:
    from sentence_transformers import SentenceTransformer

console = Console()

# Lazy-loaded singletons
_model: SentenceTransformer | None = None
_db_conn: sqlite3.Connection | None = None

# Embedding dimension for all-MiniLM-L6-v2
_EMBEDDING_DIM = 384


def _get_model() -> SentenceTransformer:
    """Load the sentence-transformers model (cached after first call)."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        console.print("[dim]Loading embedding model (all-MiniLM-L6-v2)...[/dim]")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def _init_db(db_path: Path | None = None) -> sqlite3.Connection:
    """Initialize SQLite dedup registry (singleton)."""
    global _db_conn
    if _db_conn is not None:
        return _db_conn

    path = db_path or DEDUP_DB
    path.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(str(path))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS embeddings (
            id INTEGER PRIMARY KEY,
            text_hash TEXT UNIQUE,
            text TEXT,
            embedding_blob BLOB,
            layer TEXT,
            domain TEXT,
            added_at TEXT
        )
    """)
    conn.commit()
    _db_conn = conn
    return conn


def _load_faiss_index(conn: sqlite3.Connection) -> tuple[Any, list[str]]:
    """Load all embeddings from SQLite and build a FAISS index."""
    import faiss

    rows = conn.execute(
        "SELECT text_hash, embedding_blob FROM embeddings"
    ).fetchall()

    index = faiss.IndexFlatIP(_EMBEDDING_DIM)
    hashes: list[str] = []

    if rows:
        embeddings = []
        for text_hash, blob in rows:
            emb = pickle.loads(blob)
            embeddings.append(emb)
            hashes.append(text_hash)
        embeddings_array = np.array(embeddings, dtype=np.float32)
        index.add(embeddings_array)

    return index, hashes


def _persist_embedding(
    conn: sqlite3.Connection,
    text: str,
    embedding: np.ndarray,
    layer: str = "",
    domain: str = "",
) -> None:
    """Persist an accepted item embedding to SQLite."""
    text_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
    blob = pickle.dumps(embedding.astype(np.float32))
    now = datetime.now(timezone.utc).isoformat()
    try:
        conn.execute(
            "INSERT OR IGNORE INTO embeddings (text_hash, text, embedding_blob, layer, domain, added_at) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (text_hash, text, blob, layer, domain, now),
        )
        conn.commit()
    except sqlite3.Error:
        pass


def deduplicate(
    new_items: list[dict],
    existing_items: list[dict],
    text_key: str = "principle",
    llm: LLMClient | None = None,
    cost_tracker: CostTracker | None = None,
    layer: str = "",
    domain: str = "",
    db_path: Path | None = None,
) -> list[dict]:
    """
    Filter new_items against existing_items + SQLite registry using FAISS.

    Args:
        new_items: Items to potentially add.
        existing_items: Items already in the target file.
        text_key: Key in item dict containing the text to compare.
        llm: LLMClient for Haiku classification in the gray zone.
        cost_tracker: CostTracker for recording Haiku costs.
        layer: Pipeline layer label (l1, l2, l3).
        domain: Knowledge domain.
        db_path: Override DEDUP_DB path (used by tests with tmp_path).

    Returns:
        List of items from new_items that are NOT duplicates.
    """
    if not new_items:
        return []

    model = _get_model()

    # Initialize SQLite registry + FAISS index
    conn = _init_db(db_path)
    faiss_index, registry_hashes = _load_faiss_index(conn)
    registry_count = len(registry_hashes)

    # Also encode existing in-memory items and add to FAISS
    existing_texts: list[str] = []
    if existing_items:
        existing_texts = [_get_text(item, text_key) for item in existing_items]
        existing_embeddings = model.encode(existing_texts, normalize_embeddings=True).astype(np.float32)
        faiss_index.add(existing_embeddings)

    unique_items: list[dict] = []

    for item in new_items:
        item_text = _get_text(item, text_key)
        item_embedding = model.encode([item_text], normalize_embeddings=True).astype(np.float32)

        max_similarity = 0.0

        if faiss_index.ntotal > 0:
            distances, indices = faiss_index.search(item_embedding, k=1)
            max_similarity = float(distances[0][0])
            nearest_idx = int(indices[0][0])
        else:
            nearest_idx = -1

        if max_similarity >= DEDUP_SIMILARITY_BLOCK:
            console.print(f"  [dim]Dedup SKIP (sim={max_similarity:.3f}):[/dim] {item_text[:60]}...")
            continue

        if max_similarity >= DEDUP_SIMILARITY_REVIEW:
            if llm and cost_tracker:
                nearest_text = _resolve_nearest_text(
                    nearest_idx, registry_count, registry_hashes, conn,
                    existing_texts, item_text,
                )
                classification = _haiku_classify(
                    new_text=item_text,
                    existing_text=nearest_text,
                    similarity=max_similarity,
                    llm=llm,
                    cost_tracker=cost_tracker,
                )
                if classification == "DUPLICATE":
                    console.print(f"  [dim]Dedup SKIP (Haiku=DUP):[/dim] {item_text[:60]}...")
                    continue
                console.print(f"  [green]Dedup KEEP (Haiku={classification}):[/green] {item_text[:60]}...")
            else:
                console.print(f"  [yellow]Dedup KEEP (no Haiku, sim={max_similarity:.3f}):[/yellow] {item_text[:60]}...")

        # Accepted
        unique_items.append(item)
        faiss_index.add(item_embedding)
        _persist_embedding(conn, item_text, item_embedding[0], layer=layer, domain=domain)

    console.print(f"[green]Dedup:[/green] {len(unique_items)}/{len(new_items)} items are unique")
    return unique_items


def _resolve_nearest_text(
    nearest_idx: int,
    registry_count: int,
    registry_hashes: list[str],
    conn: sqlite3.Connection,
    existing_texts: list[str],
    fallback: str,
) -> str:
    """Resolve the text of the nearest neighbor from registry or existing items."""
    if nearest_idx < 0:
        return fallback
    if nearest_idx < registry_count:
        row = conn.execute(
            "SELECT text FROM embeddings WHERE text_hash = ?",
            (registry_hashes[nearest_idx],),
        ).fetchone()
        return row[0] if row else fallback
    ei = nearest_idx - registry_count
    if ei < len(existing_texts):
        return existing_texts[ei]
    return fallback


def _get_text(item: dict[str, Any], text_key: str) -> str:
    """Extract text from an item dict, trying text_key then common alternatives."""
    if text_key in item:
        return str(item[text_key])
    for key in ("name", "rule", "question", "tension", "description", "claim"):
        if key in item:
            return str(item[key])
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
    return "RELATED"


def reset_db_singleton() -> None:
    """Reset the DB connection singleton (for testing)."""
    global _db_conn
    if _db_conn is not None:
        _db_conn.close()
    _db_conn = None
