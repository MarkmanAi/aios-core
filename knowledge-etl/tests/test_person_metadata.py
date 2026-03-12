"""
Tests for kb/person_metadata.py — PKB Metadata Manager (Story 21.3)
"""
from __future__ import annotations

from pathlib import Path
from unittest.mock import patch

import pytest
import yaml


# ─── Helpers ─────────────────────────────────────────────────────────────────


def _make_source_info(slug: str = "thinking-in-systems", title: str = "Thinking in Systems") -> dict:
    return {
        "slug": slug,
        "type": "book",
        "title": title,
        "etl_processed": True,
        "processed_at": "2026-03-12",
    }


def _read_meta(people_kb: Path, slug: str) -> dict:
    return yaml.safe_load((people_kb / slug / "metadata.yaml").read_text(encoding="utf-8"))


# ─── AC-1: metadata.yaml created on first run ────────────────────────────────


def test_metadata_created_on_first_run(tmp_path):
    """AC-1: metadata.yaml created with correct fields on first ETL run.

    In the real pipeline place_l3() writes extracted.json BEFORE create_or_update()
    is called, so we replicate that here: create the extracted.json first.
    """
    from knowledge_etl.kb.person_metadata import create_or_update

    # Simulate place_l3() having already written extracted.json (Story 21.2)
    book_dir = tmp_path / "donella-h-meadows" / "sources" / "books" / "thinking-in-systems"
    book_dir.mkdir(parents=True)
    (book_dir / "extracted.json").write_text("{}", encoding="utf-8")

    with patch("knowledge_etl.kb.person_metadata.PEOPLE_KB", tmp_path):
        create_or_update(
            slug="donella-h-meadows",
            name="Donella H. Meadows",
            source_info=_make_source_info(),
        )

    meta = _read_meta(tmp_path, "donella-h-meadows")
    assert meta["slug"] == "donella-h-meadows"
    assert meta["name"] == "Donella H. Meadows"
    assert meta["sources_count"] == 1
    assert meta["sources_types"] == ["book"]
    assert meta["tier"] == 1  # extracted.json exists → tier 1
    assert meta["etl_processed"] is True
    assert "created_at" in meta
    assert "last_updated" in meta
    assert len(meta["sources"]) == 1
    assert meta["sources"][0]["slug"] == "thinking-in-systems"
    assert meta["sources"][0]["etl_processed"] is True


def test_metadata_path_created_automatically(tmp_path):
    """AC-1: directory created automatically if not exists."""
    from knowledge_etl.kb.person_metadata import create_or_update

    with patch("knowledge_etl.kb.person_metadata.PEOPLE_KB", tmp_path):
        create_or_update(
            slug="kent-beck",
            name="Kent Beck",
            source_info=_make_source_info("tdd-by-example", "TDD By Example"),
        )

    assert (tmp_path / "kent-beck" / "metadata.yaml").exists()


# ─── AC-2: metadata.yaml updated incrementally ───────────────────────────────


def test_incremental_update_increases_sources_count(tmp_path):
    """AC-2: second run increments sources_count to 2."""
    from knowledge_etl.kb.person_metadata import create_or_update

    with patch("knowledge_etl.kb.person_metadata.PEOPLE_KB", tmp_path):
        create_or_update(
            slug="kent-beck",
            name="Kent Beck",
            source_info=_make_source_info("tdd-by-example", "TDD By Example"),
        )
        create_or_update(
            slug="kent-beck",
            name="Kent Beck",
            source_info=_make_source_info("tidy-first", "Tidy First"),
        )

    meta = _read_meta(tmp_path, "kent-beck")
    assert meta["sources_count"] == 2
    assert len(meta["sources"]) == 2


def test_incremental_update_preserves_created_at(tmp_path):
    """AC-2: created_at NEVER changes on subsequent runs."""
    from knowledge_etl.kb.person_metadata import create_or_update

    with patch("knowledge_etl.kb.person_metadata.PEOPLE_KB", tmp_path):
        create_or_update("kent-beck", "Kent Beck", _make_source_info("tdd-by-example"))
        meta_after_first = _read_meta(tmp_path, "kent-beck")
        original_created_at = meta_after_first["created_at"]

        create_or_update("kent-beck", "Kent Beck", _make_source_info("tidy-first", "Tidy First"))

    meta_after_second = _read_meta(tmp_path, "kent-beck")
    assert meta_after_second["created_at"] == original_created_at


def test_no_duplicate_sources(tmp_path):
    """AC-2: running ETL for the same book twice does not duplicate sources entry."""
    from knowledge_etl.kb.person_metadata import create_or_update

    with patch("knowledge_etl.kb.person_metadata.PEOPLE_KB", tmp_path):
        create_or_update("donella-h-meadows", "Donella H. Meadows", _make_source_info())
        create_or_update("donella-h-meadows", "Donella H. Meadows", _make_source_info())  # same source

    meta = _read_meta(tmp_path, "donella-h-meadows")
    assert meta["sources_count"] == 1
    assert len(meta["sources"]) == 1


# ─── AC-4 (via calculate_tier) ───────────────────────────────────────────────


def test_calculate_tier_returns_0_without_extraction(tmp_path):
    """Tier 0 when no extracted.json exists (sources_count = 0)."""
    from knowledge_etl.kb.person_metadata import calculate_tier

    person_dir = tmp_path / "nobody"
    person_dir.mkdir()
    meta = {"sources_count": 0, "apex_score_estimated": 0, "clone_type": "undecided"}
    assert calculate_tier(meta, person_dir) == 0


def test_calculate_tier_returns_1_with_extraction(tmp_path):
    """Tier 1 when sources_count >= 1 and extracted.json exists."""
    from knowledge_etl.kb.person_metadata import calculate_tier

    person_dir = tmp_path / "donella-h-meadows"
    book_dir = person_dir / "sources" / "books" / "thinking-in-systems"
    book_dir.mkdir(parents=True)
    (book_dir / "extracted.json").write_text("{}", encoding="utf-8")

    meta = {"sources_count": 1, "apex_score_estimated": 0, "clone_type": "undecided"}
    assert calculate_tier(meta, person_dir) == 1


def test_calculate_tier_returns_2_with_profile(tmp_path):
    """Tier 2 when profile/ exists and apex_score >= threshold."""
    from knowledge_etl.kb.person_metadata import calculate_tier

    person_dir = tmp_path / "donella-h-meadows"
    book_dir = person_dir / "sources" / "books" / "thinking-in-systems"
    book_dir.mkdir(parents=True)
    (book_dir / "extracted.json").write_text("{}", encoding="utf-8")
    (person_dir / "profile").mkdir()

    meta = {"sources_count": 2, "apex_score_estimated": 70, "clone_type": "undecided"}
    assert calculate_tier(meta, person_dir) == 2


def test_calculate_tier_returns_3_with_3_sources_and_profile(tmp_path):
    """Tier 3 when sources_count >= 3 and tier 2 conditions met."""
    from knowledge_etl.kb.person_metadata import calculate_tier

    person_dir = tmp_path / "donella-h-meadows"
    book_dir = person_dir / "sources" / "books" / "thinking-in-systems"
    book_dir.mkdir(parents=True)
    (book_dir / "extracted.json").write_text("{}", encoding="utf-8")
    (person_dir / "profile").mkdir()

    meta = {"sources_count": 3, "apex_score_estimated": 72, "clone_type": "undecided"}
    assert calculate_tier(meta, person_dir) == 3


def test_calculate_tier_governance_advisor_lower_threshold(tmp_path):
    """Governance advisors reach tier 2 at apex_score >= 55."""
    from knowledge_etl.kb.person_metadata import calculate_tier

    person_dir = tmp_path / "donella-h-meadows"
    book_dir = person_dir / "sources" / "books" / "thinking-in-systems"
    book_dir.mkdir(parents=True)
    (book_dir / "extracted.json").write_text("{}", encoding="utf-8")
    (person_dir / "profile").mkdir()

    meta = {"sources_count": 2, "apex_score_estimated": 60, "clone_type": "governance_advisor"}
    assert calculate_tier(meta, person_dir) == 2


def test_calculate_tier_has_no_side_effects(tmp_path):
    """VETO: calculate_tier must not write any files."""
    from knowledge_etl.kb.person_metadata import calculate_tier

    person_dir = tmp_path / "no-side-effects"
    person_dir.mkdir()
    meta = {"sources_count": 0, "apex_score_estimated": 0, "clone_type": "undecided"}

    files_before = list(person_dir.rglob("*"))
    calculate_tier(meta, person_dir)
    files_after = list(person_dir.rglob("*"))

    assert files_before == files_after
