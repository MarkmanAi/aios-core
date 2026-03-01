"""
Load L3: Place authorial DNA files into the MMOS minds directory.
Output: squads/mmos-squad/minds/{author_slug}/sources/books/{book_slug}/
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

import yaml
from rich.console import Console

from knowledge_etl.config import (
    CHUNK_OVERLAP_TOKENS,
    MMOS_MINDS,
    OUTPUT_CHUNK_MAX_TOKENS,
    OUTPUT_CHUNK_MIN_TOKENS,
)
from knowledge_etl.extract.marker_extract import slugify

console = Console()


def place_l3(
    l3_results: dict,
    metadata: dict,
    book_slug: str,
) -> Path:
    """
    Place L3 DNA files into the MMOS minds directory structure.

    Creates:
      squads/mmos-squad/minds/{author_slug}/sources/books/{book_slug}/
        voice_dna.json          (compatibility — always generated)
        thinking_dna.json       (compatibility — always generated)
        contradictions.json     (compatibility — always generated)
        metadata.yaml           (updated with chunks info)
        chunks/                 (NEW — RAG-ready Markdown chunks)
          voice_001.md
          thinking_001.md
          contradictions_001.md
          ...

    Args:
        l3_results: Dict with voice_dna, thinking_dna, contradictions.
        metadata: Book metadata.
        book_slug: Slug identifier for the book.

    Returns:
        Path to the book directory in the minds tree.
    """
    author = metadata.get("author") or "Unknown"
    author_slug = slugify(author)

    target_dir = MMOS_MINDS / author_slug / "sources" / "books" / book_slug
    target_dir.mkdir(parents=True, exist_ok=True)

    # Write voice DNA (compatibility)
    voice_path = target_dir / "voice_dna.json"
    voice_path.write_text(
        json.dumps(l3_results.get("voice_dna", {}), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    # Write thinking DNA (compatibility)
    thinking_path = target_dir / "thinking_dna.json"
    thinking_path.write_text(
        json.dumps(l3_results.get("thinking_dna", {}), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    # Write contradictions (compatibility)
    contradictions_path = target_dir / "contradictions.json"
    contradictions_path.write_text(
        json.dumps(l3_results.get("contradictions", {}), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    # P2: Generate RAG-ready chunks
    chunk_dir = target_dir / "chunks"
    chunk_dir.mkdir(exist_ok=True)

    chunk_metadata = {
        "book_title": metadata.get("title") or book_slug,
        "author": author,
        "book_slug": book_slug,
    }

    all_chunk_paths: list[Path] = []
    for source_type, result_key in [
        ("voice_dna", "voice_dna"),
        ("thinking_dna", "thinking_dna"),
        ("contradictions", "contradictions"),
    ]:
        dna_dict = l3_results.get(result_key, {})
        if dna_dict:
            paths = _chunk_dna_content(dna_dict, source_type, chunk_dir, chunk_metadata)
            all_chunk_paths.extend(paths)

    total_chunks = len(all_chunk_paths)

    # Write metadata (with chunks info)
    meta = {
        "book_title": metadata.get("title") or book_slug,
        "author": author,
        "source_file": metadata.get("source_file", ""),
        "book_slug": book_slug,
        "pipeline": "knowledge-etl",
        "extracted_files": [
            "voice_dna.json",
            "thinking_dna.json",
            "contradictions.json",
        ],
        "chunks_dir": "chunks/",
        "total_chunks": total_chunks,
        "chunk_size_range": f"{OUTPUT_CHUNK_MIN_TOKENS}-{OUTPUT_CHUNK_MAX_TOKENS} tokens",
    }
    metadata_path = target_dir / "metadata.yaml"
    metadata_path.write_text(
        yaml.dump(meta, allow_unicode=True, default_flow_style=False),
        encoding="utf-8",
    )

    console.print(
        f"[green]L3 Load:[/green] DNA placed at "
        f"minds/{author_slug}/sources/books/{book_slug}/ "
        f"({total_chunks} chunks)"
    )

    return target_dir


# ─── Chunking helpers ────────────────────────────────────────────────────────


def _count_tokens_approx(text: str) -> int:
    """Rough token estimate: 1 token ≈ 3.5 characters for English."""
    return int(len(text) / 3.5)


def _json_to_markdown(dna_dict: dict, source_type: str) -> str:
    """Convert a DNA result dict to human-readable Markdown."""
    if source_type == "voice_dna":
        return _voice_dna_to_markdown(dna_dict)
    if source_type == "thinking_dna":
        return _thinking_dna_to_markdown(dna_dict)
    if source_type == "contradictions":
        return _contradictions_to_markdown(dna_dict)
    # Fallback: pretty-print JSON
    return f"```json\n{json.dumps(dna_dict, indent=2, ensure_ascii=False)}\n```\n"


def _voice_dna_to_markdown(dna_dict: dict) -> str:
    inner = dna_dict.get("voice_dna", dna_dict)
    lines: list[str] = ["# Voice DNA\n"]

    vocab = inner.get("signature_vocabulary", [])
    if vocab:
        lines.append("## Signature Vocabulary")
        for word in vocab:
            lines.append(f"- {word}")
        lines.append("")

    pattern = inner.get("sentence_pattern", "")
    if pattern:
        lines.append("## Sentence Pattern")
        lines.append(pattern)
        lines.append("")

    devices = inner.get("rhetorical_devices", [])
    if devices:
        lines.append("## Rhetorical Devices")
        for d in devices:
            lines.append(f"- {d}")
        lines.append("")

    tone = inner.get("tone", "")
    if tone:
        lines.append("## Tone")
        lines.append(tone)
        lines.append("")

    quotes = inner.get("exemplar_quotes", [])
    if quotes:
        lines.append("## Exemplar Quotes")
        for q in quotes:
            lines.append(f"> {q}")
            lines.append("")

    obs = dna_dict.get("chapter_observations", "")
    if obs:
        lines.append("## Chapter Observations")
        lines.append(obs)
        lines.append("")

    return "\n".join(lines)


def _thinking_dna_to_markdown(dna_dict: dict) -> str:
    inner = dna_dict.get("thinking_dna", dna_dict)
    lines: list[str] = ["# Thinking DNA\n"]

    pattern = inner.get("primary_reasoning_pattern", "")
    if pattern:
        lines.append("## Primary Reasoning Pattern")
        lines.append(pattern)
        lines.append("")

    move = inner.get("favorite_argumentative_move", "")
    if move:
        lines.append("## Favorite Argumentative Move")
        lines.append(move)
        lines.append("")

    models = inner.get("mental_models", [])
    if models:
        lines.append("## Mental Models")
        for m in models:
            lines.append(f"- {m}")
        lines.append("")

    epistemic = inner.get("epistemic_style", "")
    if epistemic:
        lines.append("## Epistemic Style")
        lines.append(epistemic)
        lines.append("")

    analogies = inner.get("favorite_analogies", [])
    if analogies:
        lines.append("## Favorite Analogies")
        for a in analogies:
            lines.append(f"- {a}")
        lines.append("")

    quote = inner.get("exemplar_reasoning_quote", "")
    if quote:
        lines.append("## Exemplar Reasoning Quote")
        lines.append(f"> {quote}")
        lines.append("")

    obs = dna_dict.get("chapter_observations", "")
    if obs:
        lines.append("## Chapter Observations")
        lines.append(obs)
        lines.append("")

    return "\n".join(lines)


def _contradictions_to_markdown(dna_dict: dict) -> str:
    contradictions = dna_dict.get("productive_contradictions", [])
    if not contradictions:
        return "# Productive Contradictions\n\n*No productive contradictions identified.*\n"

    lines: list[str] = ["# Productive Contradictions\n"]

    for i, c in enumerate(contradictions, 1):
        tension = c.get("tension", "")
        lines.append(f"---\n\n## Contradiction {i}: {tension}\n")

        pole_a = c.get("pole_a", {})
        if isinstance(pole_a, dict):
            claim_a = pole_a.get("claim", "")
            quote_a = pole_a.get("supporting_quote", "")
        else:
            claim_a = str(pole_a)
            quote_a = ""

        lines.append("### Pole A")
        if claim_a:
            lines.append(claim_a)
        if quote_a:
            lines.append(f"\n> {quote_a}")
        lines.append("")

        pole_b = c.get("pole_b", {})
        if isinstance(pole_b, dict):
            claim_b = pole_b.get("claim", "")
            quote_b = pole_b.get("supporting_quote", "")
        else:
            claim_b = str(pole_b)
            quote_b = ""

        lines.append("### Pole B")
        if claim_b:
            lines.append(claim_b)
        if quote_b:
            lines.append(f"\n> {quote_b}")
        lines.append("")

        insight = c.get("generative_insight", "")
        if insight:
            lines.append(f"**Generative Insight:** {insight}\n")

        signal = c.get("authenticity_signal", "")
        if signal:
            lines.append(f"**Authenticity Signal:** {signal}\n")

    return "\n".join(lines)


def _chunk_text(text: str, min_tokens: int, max_tokens: int, overlap: int) -> list[str]:
    """
    Split text into approximate token-sized chunks with overlap.

    Uses paragraph boundaries as natural split points. If the entire text
    fits within max_tokens, returns it as a single chunk (no minimum enforced
    for small content).
    """
    if not text.strip():
        return []

    # If whole text fits, return as single chunk
    if _count_tokens_approx(text) <= max_tokens:
        return [text]

    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    chunks: list[str] = []
    current_blocks: list[str] = []
    current_tokens = 0

    for para in paragraphs:
        para_tokens = _count_tokens_approx(para)

        # Finalize current chunk when adding this paragraph would exceed max
        if current_tokens + para_tokens > max_tokens and current_blocks:
            chunks.append("\n\n".join(current_blocks))

            # Start next chunk with overlap from tail of current
            overlap_blocks: list[str] = []
            overlap_count = 0
            for blk in reversed(current_blocks):
                blk_tokens = _count_tokens_approx(blk)
                if overlap_count + blk_tokens <= overlap:
                    overlap_blocks.insert(0, blk)
                    overlap_count += blk_tokens
                else:
                    break

            current_blocks = overlap_blocks
            current_tokens = overlap_count

        current_blocks.append(para)
        current_tokens += para_tokens

    if current_blocks:
        chunks.append("\n\n".join(current_blocks))

    return chunks


def _write_chunk(
    chunk_dir: Path,
    source_type: str,
    idx: int,
    total: int,
    content: str,
    metadata: dict,
) -> Path:
    """Write a single chunk as a Markdown file with YAML frontmatter."""
    frontmatter = (
        "---\n"
        f'book_title: "{metadata.get("book_title", "")}"\n'
        f'author: "{metadata.get("author", "")}"\n'
        f'book_slug: "{metadata.get("book_slug", "")}"\n'
        f'source_type: "{source_type}"\n'
        f"chunk_index: {idx}\n"
        f"total_chunks: {total}\n"
        f'pipeline: "knowledge-etl"\n'
        f'extracted: "{date.today().isoformat()}"\n'
        "---\n\n"
    )

    chunk_path = chunk_dir / f"{source_type}_{idx:03d}.md"
    chunk_path.write_text(frontmatter + content, encoding="utf-8")
    return chunk_path


def _chunk_dna_content(
    dna_dict: dict,
    source_type: str,
    chunk_dir: Path,
    metadata: dict,
) -> list[Path]:
    """
    Orchestrator: convert DNA dict to Markdown, split into chunks, write files.

    Returns list of Paths of chunk files created. Returns empty list if dna_dict
    has no real content (empty dict or dict with only empty/falsy values).
    """
    if not dna_dict:
        return []

    markdown_text = _json_to_markdown(dna_dict, source_type)

    raw_chunks = _chunk_text(
        markdown_text,
        min_tokens=OUTPUT_CHUNK_MIN_TOKENS,
        max_tokens=OUTPUT_CHUNK_MAX_TOKENS,
        overlap=CHUNK_OVERLAP_TOKENS,
    )

    raw_chunks = [c for c in raw_chunks if c.strip()]
    if not raw_chunks:
        return []

    total = len(raw_chunks)
    paths: list[Path] = []
    for i, content in enumerate(raw_chunks, 1):
        path = _write_chunk(chunk_dir, source_type, i, total, content, metadata)
        paths.append(path)

    return paths
