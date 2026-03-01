"""Tests for l3_place.py — P2 chunking (Story 8.2)."""

from __future__ import annotations

from pathlib import Path
from unittest.mock import patch

import pytest
import yaml

from knowledge_etl.load.l3_place import (
    _chunk_dna_content,
    _chunk_text,
    _contradictions_to_markdown,
    _count_tokens_approx,
    _json_to_markdown,
    _thinking_dna_to_markdown,
    _voice_dna_to_markdown,
    _write_chunk,
)


# ─── _count_tokens_approx ────────────────────────────────────────────────────


class TestCountTokensApprox:
    def test_empty_string(self):
        assert _count_tokens_approx("") == 0

    def test_known_length(self):
        # 35 chars → int(35 / 3.5) = 10
        assert _count_tokens_approx("a" * 35) == 10

    def test_typical_paragraph(self):
        text = "The quick brown fox jumps over the lazy dog. " * 10
        result = _count_tokens_approx(text)
        assert result > 0
        assert isinstance(result, int)


# ─── _json_to_markdown ───────────────────────────────────────────────────────


class TestJsonToMarkdown:
    def test_voice_dna_contains_sections(self):
        dna = {
            "voice_dna": {
                "signature_vocabulary": ["collision", "friction"],
                "sentence_pattern": "Short declarative",
                "rhetorical_devices": ["contrast: X vs Y"],
                "tone": "Provocative",
                "exemplar_quotes": ["Quote one here."],
            },
            "chapter_observations": "More combative than usual.",
        }
        md = _json_to_markdown(dna, "voice_dna")
        assert "# Voice DNA" in md
        assert "## Signature Vocabulary" in md
        assert "- collision" in md
        assert "## Sentence Pattern" in md
        assert "## Rhetorical Devices" in md
        assert "## Tone" in md
        assert "## Exemplar Quotes" in md
        assert "> Quote one here." in md
        assert "## Chapter Observations" in md

    def test_thinking_dna_contains_sections(self):
        dna = {
            "thinking_dna": {
                "primary_reasoning_pattern": "Dialectical inversion",
                "favorite_argumentative_move": "Shift level of analysis",
                "mental_models": ["Collision model: creativity as friction"],
                "epistemic_style": "Assertive with empirical grounding",
                "favorite_analogies": ["physics", "military history"],
                "exemplar_reasoning_quote": "You cannot collide without material.",
            },
            "chapter_observations": "More polemical than observational.",
        }
        md = _json_to_markdown(dna, "thinking_dna")
        assert "# Thinking DNA" in md
        assert "## Primary Reasoning Pattern" in md
        assert "## Mental Models" in md
        assert "- Collision model" in md
        assert "## Epistemic Style" in md
        assert "## Favorite Analogies" in md
        assert "## Exemplar Reasoning Quote" in md
        assert "> You cannot collide without material." in md

    def test_contradictions_contains_tensions(self):
        dna = {
            "productive_contradictions": [
                {
                    "tension": "Breadth vs depth tension",
                    "pole_a": {
                        "claim": "Read widely without agenda.",
                        "supporting_quote": "Cross-domain collision is a posture.",
                    },
                    "pole_b": {
                        "claim": "Focus on one domain.",
                        "supporting_quote": "Choose your domain. Dig deep.",
                    },
                    "generative_insight": "Sequential alternation between phases.",
                    "authenticity_signal": "Holds both in tension openly.",
                }
            ]
        }
        md = _json_to_markdown(dna, "contradictions")
        assert "# Productive Contradictions" in md
        assert "Contradiction 1:" in md
        assert "Breadth vs depth tension" in md
        assert "Pole A" in md
        assert "Pole B" in md
        assert "Generative Insight:" in md
        assert "Authenticity Signal:" in md

    def test_empty_contradictions(self):
        md = _json_to_markdown({"productive_contradictions": []}, "contradictions")
        assert "No productive contradictions identified" in md

    def test_unknown_source_type_fallback(self):
        md = _json_to_markdown({"key": "value"}, "unknown_type")
        assert "```json" in md

    def test_pole_as_string_fallback(self):
        """Handle old-format pole_a/pole_b as plain strings."""
        dna = {
            "productive_contradictions": [
                {
                    "tension": "Some tension",
                    "pole_a": "Plain string pole A",
                    "pole_b": "Plain string pole B",
                    "generative_insight": "Insight here.",
                }
            ]
        }
        md = _json_to_markdown(dna, "contradictions")
        assert "Plain string pole A" in md
        assert "Plain string pole B" in md


# ─── _chunk_text ─────────────────────────────────────────────────────────────


class TestChunkText:
    def test_empty_text_returns_empty(self):
        assert _chunk_text("", 2000, 4000, 300) == []

    def test_whitespace_only_returns_empty(self):
        assert _chunk_text("   \n\n  ", 2000, 4000, 300) == []

    def test_small_text_returns_single_chunk(self):
        text = "Short paragraph.\n\nAnother short paragraph."
        result = _chunk_text(text, 2000, 4000, 300)
        assert len(result) == 1
        assert result[0] == text

    def test_large_text_splits_into_multiple_chunks(self):
        # Create text that definitely exceeds 4000 tokens (4000 * 3.5 = 14000 chars)
        paragraph = "x" * 1400 + " end of paragraph."
        large_text = "\n\n".join([paragraph] * 20)
        result = _chunk_text(large_text, 2000, 4000, 300)
        assert len(result) > 1

    def test_each_chunk_within_max_tokens(self):
        paragraph = "w" * 700  # ~200 tokens each
        large_text = "\n\n".join([paragraph] * 30)
        result = _chunk_text(large_text, 2000, 4000, 300)
        for chunk in result:
            assert _count_tokens_approx(chunk) <= 4500  # slight tolerance for overlap

    def test_overlap_content_present(self):
        """Chunks after first should start with content from end of previous."""
        paragraph = "a" * 1400  # ~400 tokens
        large_text = "\n\n".join([paragraph] * 20)
        result = _chunk_text(large_text, 2000, 4000, 300)
        if len(result) >= 2:
            # Second chunk should not start from zero (overlap applied)
            # Both chunks share at least one paragraph
            first_paras = set(result[0].split("\n\n"))
            second_paras = set(result[1].split("\n\n"))
            assert first_paras & second_paras  # overlap exists


# ─── _write_chunk ─────────────────────────────────────────────────────────────


class TestWriteChunk:
    def test_creates_file_with_frontmatter(self, tmp_path):
        metadata = {
            "book_title": "Thinking in Systems",
            "author": "Donella Meadows",
            "book_slug": "thinking-in-systems",
        }
        path = _write_chunk(tmp_path, "voice_dna", 1, 3, "Some content here.", metadata)

        assert path.exists()
        assert path.name == "voice_dna_001.md"

        content = path.read_text(encoding="utf-8")
        assert content.startswith("---\n")
        assert 'book_title: "Thinking in Systems"' in content
        assert 'author: "Donella Meadows"' in content
        assert 'book_slug: "thinking-in-systems"' in content
        assert 'source_type: "voice_dna"' in content
        assert "chunk_index: 1" in content
        assert "total_chunks: 3" in content
        assert 'pipeline: "knowledge-etl"' in content
        assert "---\n\nSome content here." in content

    def test_naming_uses_zero_padded_index(self, tmp_path):
        metadata = {"book_title": "T", "author": "A", "book_slug": "t"}
        path = _write_chunk(tmp_path, "contradictions", 7, 10, "Content.", metadata)
        assert path.name == "contradictions_007.md"


# ─── _chunk_dna_content ──────────────────────────────────────────────────────


class TestChunkDnaContent:
    def test_creates_at_least_one_chunk(self, tmp_path):
        dna_dict = {
            "voice_dna": {
                "signature_vocabulary": ["word1", "word2"],
                "sentence_pattern": "Short declarative.",
                "rhetorical_devices": ["contrast"],
                "tone": "Provocative",
                "exemplar_quotes": ["Quote here."],
            },
            "chapter_observations": "Distinct chapter.",
        }
        metadata = {
            "book_title": "Test",
            "author": "Author",
            "book_slug": "test-book",
        }
        paths = _chunk_dna_content(dna_dict, "voice_dna", tmp_path, metadata)
        assert len(paths) >= 1
        for p in paths:
            assert p.exists()
            assert p.suffix == ".md"
            assert "voice_dna_" in p.name

    def test_empty_dict_returns_no_chunks(self, tmp_path):
        paths = _chunk_dna_content({}, "voice_dna", tmp_path, {})
        assert paths == []

    def test_chunk_content_is_not_empty(self, tmp_path):
        dna_dict = {
            "productive_contradictions": [
                {
                    "tension": "Breadth vs depth",
                    "pole_a": {"claim": "Read wide.", "supporting_quote": "Quote A."},
                    "pole_b": {"claim": "Focus deep.", "supporting_quote": "Quote B."},
                    "generative_insight": "Sequential alternation.",
                    "authenticity_signal": "Real tension.",
                }
            ]
        }
        metadata = {"book_title": "T", "author": "A", "book_slug": "t"}
        paths = _chunk_dna_content(dna_dict, "contradictions", tmp_path, metadata)
        assert len(paths) >= 1
        for p in paths:
            content = p.read_text(encoding="utf-8")
            # Must have frontmatter and real content
            assert "---" in content
            assert len(content) > 50


# ─── place_l3 integration ─────────────────────────────────────────────────────


class TestPlaceL3Integration:
    def test_creates_json_files_and_chunks_dir(self, tmp_path):
        from knowledge_etl.load.l3_place import place_l3

        l3_results = {
            "voice_dna": {
                "voice_dna": {
                    "signature_vocabulary": ["test"],
                    "sentence_pattern": "Short.",
                    "rhetorical_devices": [],
                    "tone": "direct",
                    "exemplar_quotes": [],
                },
                "chapter_observations": "ch1",
            },
            "thinking_dna": {
                "thinking_dna": {
                    "primary_reasoning_pattern": "dialectical",
                    "favorite_argumentative_move": "reframe",
                    "mental_models": [],
                    "epistemic_style": "assertive",
                    "favorite_analogies": [],
                    "exemplar_reasoning_quote": "test quote",
                },
                "chapter_observations": "",
            },
            "contradictions": {
                "productive_contradictions": []
            },
        }
        metadata = {
            "title": "Test Book",
            "author": "Test Author",
            "source_file": "test.pdf",
        }

        with patch("knowledge_etl.load.l3_place.MMOS_MINDS", tmp_path):
            target = place_l3(l3_results, metadata, "test-book")

        # Original JSON files must exist (compatibility)
        assert (target / "voice_dna.json").exists()
        assert (target / "thinking_dna.json").exists()
        assert (target / "contradictions.json").exists()

        # chunks/ directory must exist
        assert (target / "chunks").is_dir()

        # metadata.yaml must have chunks info
        meta = yaml.safe_load((target / "metadata.yaml").read_text(encoding="utf-8"))
        assert meta["chunks_dir"] == "chunks/"
        assert "total_chunks" in meta
        assert meta["chunk_size_range"] == "2000-4000 tokens"

    def test_chunk_files_have_yaml_frontmatter(self, tmp_path):
        from knowledge_etl.load.l3_place import place_l3

        l3_results = {
            "voice_dna": {
                "voice_dna": {
                    "signature_vocabulary": ["word"],
                    "sentence_pattern": "pattern",
                    "rhetorical_devices": ["contrast"],
                    "tone": "direct",
                    "exemplar_quotes": ["quote"],
                },
                "chapter_observations": "note",
            },
            "thinking_dna": {},
            "contradictions": {},
        }
        metadata = {"title": "My Book", "author": "Jane Doe", "source_file": "book.pdf"}

        with patch("knowledge_etl.load.l3_place.MMOS_MINDS", tmp_path):
            target = place_l3(l3_results, metadata, "my-book")

        chunk_files = list((target / "chunks").glob("*.md"))
        assert len(chunk_files) >= 1
        for chunk_path in chunk_files:
            content = chunk_path.read_text(encoding="utf-8")
            assert content.startswith("---\n"), f"{chunk_path.name} missing frontmatter"
            assert "book_title:" in content
            assert "author:" in content
            assert "source_type:" in content
            assert "chunk_index:" in content
            assert "total_chunks:" in content
