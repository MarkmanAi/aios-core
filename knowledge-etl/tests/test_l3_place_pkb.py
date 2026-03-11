"""Tests for l3_place.py — PKB output path and consolidated extracted.json (Story 21.2)."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from unittest.mock import patch

import pytest

from knowledge_etl.load.l3_place import place_l3


# ─── Fixtures ────────────────────────────────────────────────────────────────

_L3_RESULTS = {
    "voice_dna": {
        "voice_dna": {
            "signature_vocabulary": ["systems", "feedback"],
            "sentence_structure": "Medium declaratives.",
            "rhetorical_devices": ["analogy"],
            "exemplar_quotes": ["Structure drives behavior."],
        },
        "chapter_observations": "Systems thinking throughout.",
    },
    "thinking_dna": {
        "thinking_dna": {
            "primary_reasoning_pattern": "Systemic",
            "mental_models": ["Feedback loop"],
            "epistemic_style": "Empirical",
            "exemplar_reasoning_quote": "You can't change behavior without changing structure.",
        },
        "chapter_observations": "",
    },
    "contradictions": {
        "productive_contradictions": [
            {
                "tension": "Growth vs. sustainability",
                "pole_a": {"claim": "Systems grow.", "supporting_quote": "Growth is natural."},
                "pole_b": {"claim": "Systems collapse.", "supporting_quote": "Limits exist."},
                "generative_insight": "Oscillation between growth and collapse is normal.",
                "authenticity_signal": "Accepts both poles simultaneously.",
            }
        ]
    },
}

_METADATA = {
    "title": "Thinking in Systems",
    "author": "Donella H. Meadows",
    "source_file": "thinking-in-systems.pdf",
}


# ─── AC-1: PKB output path ───────────────────────────────────────────────────


class TestPKBOutputPath:
    def test_extracted_json_created_in_pkb_path(self, tmp_path):
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            result = place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")

        expected = tmp_path / "donella-h-meadows" / "sources" / "books" / "thinking-in-systems"
        assert result == expected
        assert (result / "extracted.json").exists()

    def test_intermediate_directories_created_automatically(self, tmp_path):
        """Dirs must be created even when deeply nested path does not exist."""
        nested_root = tmp_path / "nonexistent" / "deep"
        nested_root.mkdir(parents=True)

        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", nested_root):
            result = place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")

        assert result.exists()
        assert (result / "extracted.json").exists()


# ─── AC-2: extracted.json structure ─────────────────────────────────────────


class TestExtractedJsonStructure:
    def test_all_required_fields_present(self, tmp_path):
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            result = place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")

        data = json.loads((result / "extracted.json").read_text(encoding="utf-8"))

        for field in ("source_slug", "source_type", "source_title", "author",
                      "processed_at", "voice_dna", "thinking_dna", "contradictions"):
            assert field in data, f"Missing required field: {field}"

    def test_field_values_correct(self, tmp_path):
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            result = place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")

        data = json.loads((result / "extracted.json").read_text(encoding="utf-8"))

        assert data["source_slug"] == "thinking-in-systems"
        assert data["source_type"] == "book"
        assert data["source_title"] == "Thinking in Systems"
        assert data["author"] == "Donella H. Meadows"
        assert data["processed_at"] == date.today().isoformat()

    def test_dna_fields_not_empty_for_content_rich_book(self, tmp_path):
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            result = place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")

        data = json.loads((result / "extracted.json").read_text(encoding="utf-8"))

        assert data["voice_dna"], "voice_dna should not be empty"
        assert data["thinking_dna"], "thinking_dna should not be empty"
        assert data["contradictions"], "contradictions should not be empty"

    def test_source_slug_is_book_slug(self, tmp_path):
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            result = place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")

        data = json.loads((result / "extracted.json").read_text(encoding="utf-8"))
        assert data["source_slug"] == "thinking-in-systems"


# ─── AC-3: No MMOS write ─────────────────────────────────────────────────────


class TestNoMMOSWrite:
    def test_mmos_minds_directory_untouched(self, tmp_path):
        mmos_dir = tmp_path / "mmos"
        mmos_dir.mkdir()

        with (
            patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path / "pkb"),
        ):
            place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")

        # Nothing should be written under mmos_dir (it has no subdirs)
        assert list(mmos_dir.iterdir()) == []


# ─── AC-4: Author slug derivation via slugify() ──────────────────────────────


class TestAuthorSlugDerivation:
    def test_slug_donella_h_meadows(self, tmp_path):
        metadata = {**_METADATA, "author": "Donella H. Meadows"}
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            result = place_l3(_L3_RESULTS, metadata, "thinking-in-systems")

        assert "donella-h-meadows" in str(result)

    def test_slug_kent_beck(self, tmp_path):
        metadata = {**_METADATA, "author": "Kent Beck"}
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            result = place_l3(_L3_RESULTS, metadata, "extreme-programming")

        assert "kent-beck" in str(result)

    def test_slug_skelton_and_pais(self, tmp_path):
        metadata = {**_METADATA, "author": "Matthew Skelton & Manuel Pais"}
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            result = place_l3(_L3_RESULTS, metadata, "team-topologies")

        # ampersand stripped, both names present in slug
        assert "matthew-skelton" in str(result)
        assert "manuel-pais" in str(result)


# ─── VETO: Backup on overwrite ───────────────────────────────────────────────


class TestBackupOnOverwrite:
    def test_backup_created_when_extracted_json_exists(self, tmp_path):
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            # First run — creates extracted.json
            result = place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")
            assert (result / "extracted.json").exists()

            # Second run — should backup existing and write new
            place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")

        backups = list(result.glob("extracted.*.backup.json"))
        assert len(backups) == 1, f"Expected 1 backup after second run, got {len(backups)}"

    def test_new_extracted_json_written_after_backup(self, tmp_path):
        with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
            result = place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")
            place_l3(_L3_RESULTS, _METADATA, "thinking-in-systems")

        # extracted.json must still exist after second run
        assert (result / "extracted.json").exists()
        data = json.loads((result / "extracted.json").read_text(encoding="utf-8"))
        assert data["source_slug"] == "thinking-in-systems"
