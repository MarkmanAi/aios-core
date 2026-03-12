"""
Tests for kb/profile_aggregator.py — PKB Profile Aggregator (Story 21.4)
"""
from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import patch

import pytest
from typer.testing import CliRunner

from knowledge_etl.cli import app


# ─── Helpers ─────────────────────────────────────────────────────────────────

SLUG = "test-person"


def _make_extracted(
    source_slug: str,
    voice_dna: dict | None = None,
    thinking_dna: dict | None = None,
    contradictions: list | None = None,
) -> dict:
    return {
        "source_slug": source_slug,
        "voice_dna": voice_dna or {},
        "thinking_dna": thinking_dna or {},
        "contradictions": contradictions or [],
    }


def _write_extracted(people_kb: Path, person_slug: str, source_slug: str, data: dict) -> Path:
    source_dir = people_kb / person_slug / "sources" / "books" / source_slug
    source_dir.mkdir(parents=True, exist_ok=True)
    path = source_dir / "extracted.json"
    path.write_text(json.dumps(data), encoding="utf-8")
    return path


def _read_json(path: Path) -> object:
    return json.loads(path.read_text(encoding="utf-8"))


# ─── AC-2: profile/ created with 5 files ─────────────────────────────────────


def test_profile_created_with_five_files(tmp_path):
    """AC-2: aggregate creates profile/ with all 5 required files."""
    from knowledge_etl.kb.profile_aggregator import aggregate

    _write_extracted(tmp_path, SLUG, "source-a", _make_extracted("source-a"))

    with (
        patch("knowledge_etl.kb.profile_aggregator.PEOPLE_KB", tmp_path),
        patch("knowledge_etl.kb.profile_aggregator.update_readiness"),
    ):
        aggregate(SLUG)

    profile_dir = tmp_path / SLUG / "profile"
    assert profile_dir.exists()
    for fname in ("voice_dna.json", "thinking_dna.json", "contradictions.json", "frameworks.json", "principles.json"):
        assert (profile_dir / fname).exists(), f"Missing: {fname}"


# ─── AC-3: voice_dna merge from 2 sources ────────────────────────────────────


def test_voice_dna_merge_from_two_sources(tmp_path):
    """AC-3: voice_dna lists concatenated without duplicates; strings: last wins."""
    from knowledge_etl.kb.profile_aggregator import aggregate

    _write_extracted(tmp_path, SLUG, "source-a", _make_extracted(
        "source-a",
        voice_dna={"vocabulary": ["systems", "feedback"], "tone": "analytical"},
    ))
    _write_extracted(tmp_path, SLUG, "source-b", _make_extracted(
        "source-b",
        voice_dna={"vocabulary": ["feedback", "leverage"], "tone": "pragmatic"},
    ))

    with (
        patch("knowledge_etl.kb.profile_aggregator.PEOPLE_KB", tmp_path),
        patch("knowledge_etl.kb.profile_aggregator.update_readiness"),
    ):
        aggregate(SLUG)

    vdna = _read_json(tmp_path / SLUG / "profile" / "voice_dna.json")
    assert isinstance(vdna, dict)
    vocab = vdna["vocabulary"]
    # No duplicates
    assert len(vocab) == len(set(vocab))
    # All items present
    assert set(vocab) == {"systems", "feedback", "leverage"}
    # Last source wins for string field
    assert vdna["tone"] == "pragmatic"


# ─── AC-4: cross-source contradiction detected ────────────────────────────────


def test_cross_source_contradiction_detected(tmp_path):
    """AC-4: same topic in 2 distinct sources → cross_source contradiction added."""
    from knowledge_etl.kb.profile_aggregator import aggregate

    contradiction_a = {"topic": "growth", "pole_a": "growth is good", "pole_b": "growth has limits"}
    contradiction_b = {"topic": "growth", "pole_a": "growth destroys", "pole_b": "no growth needed"}

    _write_extracted(tmp_path, SLUG, "source-a", _make_extracted(
        "source-a", contradictions=[contradiction_a]
    ))
    _write_extracted(tmp_path, SLUG, "source-b", _make_extracted(
        "source-b", contradictions=[contradiction_b]
    ))

    with (
        patch("knowledge_etl.kb.profile_aggregator.PEOPLE_KB", tmp_path),
        patch("knowledge_etl.kb.profile_aggregator.update_readiness"),
    ):
        aggregate(SLUG)

    contradictions = _read_json(tmp_path / SLUG / "profile" / "contradictions.json")
    assert isinstance(contradictions, list)

    cross = [c for c in contradictions if c.get("type") == "cross_source"]
    assert len(cross) >= 1, "Expected at least 1 cross_source contradiction"

    c = cross[0]
    assert c["topic"] == "growth"
    assert c["source_a"] in ("source-a", "source-b")
    assert c["source_b"] in ("source-a", "source-b")
    assert c["source_a"] != c["source_b"]
    assert "quote_a" in c
    assert "quote_b" in c
    assert c["tension"] in ("high", "medium")


def test_single_source_no_cross_source_contradictions(tmp_path):
    """AC-4: with only 1 source, cross_source list is empty."""
    from knowledge_etl.kb.profile_aggregator import aggregate

    contradiction = {"topic": "growth", "pole_a": "good", "pole_b": "bad"}
    _write_extracted(tmp_path, SLUG, "source-a", _make_extracted(
        "source-a", contradictions=[contradiction]
    ))

    with (
        patch("knowledge_etl.kb.profile_aggregator.PEOPLE_KB", tmp_path),
        patch("knowledge_etl.kb.profile_aggregator.update_readiness"),
    ):
        aggregate(SLUG)

    contradictions = _read_json(tmp_path / SLUG / "profile" / "contradictions.json")
    cross = [c for c in contradictions if c.get("type") == "cross_source"]
    assert cross == [], "Expected no cross_source contradictions with 1 source"


# ─── AC-1: CLI error for unknown slug ────────────────────────────────────────


def test_cli_error_for_unknown_slug(tmp_path):
    """AC-1: CLI exits with error when slug does not exist in PKB."""
    runner = CliRunner()
    with patch("knowledge_etl.kb.profile_aggregator.PEOPLE_KB", tmp_path):
        result = runner.invoke(app, ["aggregate", "nobody-exists"])
    assert result.exit_code != 0
    assert "not found in PKB" in result.output or "not found in PKB" in (result.stderr or "")


def test_cli_error_for_slug_with_no_sources(tmp_path):
    """AC-1: CLI exits with error when slug exists but has no extracted.json."""
    (tmp_path / SLUG).mkdir()

    runner = CliRunner()
    with patch("knowledge_etl.kb.profile_aggregator.PEOPLE_KB", tmp_path):
        result = runner.invoke(app, ["aggregate", SLUG])
    assert result.exit_code != 0
    assert "No extracted.json found" in result.output or "No extracted.json found" in (result.stderr or "")


# ─── AC-5: frameworks.json and principles.json with empty items ───────────────


def test_frameworks_and_principles_empty_when_not_in_extracted(tmp_path):
    """AC-5: frameworks.json and principles.json created with empty items when fields absent."""
    from knowledge_etl.kb.profile_aggregator import aggregate

    _write_extracted(tmp_path, SLUG, "source-a", _make_extracted("source-a"))

    with (
        patch("knowledge_etl.kb.profile_aggregator.PEOPLE_KB", tmp_path),
        patch("knowledge_etl.kb.profile_aggregator.update_readiness"),
    ):
        aggregate(SLUG)

    frameworks = _read_json(tmp_path / SLUG / "profile" / "frameworks.json")
    principles = _read_json(tmp_path / SLUG / "profile" / "principles.json")

    assert isinstance(frameworks, dict)
    assert frameworks["items"] == []
    assert isinstance(principles, dict)
    assert principles["items"] == []
