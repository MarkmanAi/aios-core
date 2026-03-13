"""
Tests for kb/gap_detector.py — PKB Gap Detector (Story 21.5)
"""
from __future__ import annotations

import json
from pathlib import Path

import pytest
import yaml


# ─── Helpers ─────────────────────────────────────────────────────────────────


def _make_person(
    tmp_path: Path,
    slug: str,
    sources_count: int,
    sources_types: list[str],
) -> Path:
    """Create a minimal PKB person directory with metadata.yaml."""
    person_dir = tmp_path / slug
    person_dir.mkdir(parents=True)
    meta = {
        "slug": slug,
        "name": slug.replace("-", " ").title(),
        "sources_count": sources_count,
        "sources_types": sources_types,
        "tier": 1,
    }
    with open(person_dir / "metadata.yaml", "w", encoding="utf-8") as f:
        yaml.dump(meta, f, allow_unicode=True, sort_keys=False)
    return person_dir


def _write_contradictions(person_dir: Path, data: object) -> None:
    profile_dir = person_dir / "profile"
    profile_dir.mkdir(parents=True, exist_ok=True)
    with open(profile_dir / "contradictions.json", "w", encoding="utf-8") as f:
        json.dump(data, f)


def _read_gaps(person_dir: Path) -> dict:
    gaps_path = person_dir / "gaps.yaml"
    assert gaps_path.exists(), f"gaps.yaml not found at {gaps_path}"
    return yaml.safe_load(gaps_path.read_text(encoding="utf-8"))


def _gap_types(result: dict) -> list[str]:
    return [g["type"] for g in result.get("gaps", [])]


# ─── Fixture: patch PEOPLE_KB ────────────────────────────────────────────────


@pytest.fixture()
def pkb(tmp_path: Path, monkeypatch):
    """Patch PEOPLE_KB to tmp_path so tests are isolated."""
    import knowledge_etl.kb.gap_detector as gd
    monkeypatch.setattr(gd, "PEOPLE_KB", tmp_path)
    return tmp_path


# ─── AC-6b: no_sources (sources_count == 0) ──────────────────────────────────


def test_no_sources_gap(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(pkb, "empty-person", sources_count=0, sources_types=[])
    detect_and_write("empty-person")

    result = _read_gaps(person_dir)
    assert "no_sources" in _gap_types(result)
    assert result["blocks_tier_progression"] is True


# ─── AC-3: single_source_only ────────────────────────────────────────────────


def test_single_source_only_gap(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(pkb, "donella-meadows", sources_count=1, sources_types=["book"])
    detect_and_write("donella-meadows")

    result = _read_gaps(person_dir)
    assert "single_source_only" in _gap_types(result)
    assert result["blocks_tier_progression"] is True

    gap = next(g for g in result["gaps"] if g["type"] == "single_source_only")
    assert gap["priority"] == "critica"
    assert gap["id"] == "GAP-001"


# ─── AC-4: insufficient_sources ──────────────────────────────────────────────


def test_insufficient_sources_with_two(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(pkb, "two-source-person", sources_count=2, sources_types=["book", "book"])
    detect_and_write("two-source-person")

    result = _read_gaps(person_dir)
    assert "insufficient_sources" in _gap_types(result)
    assert result["blocks_tier_progression"] is True


def test_no_insufficient_sources_with_three(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(
        pkb, "three-source-person", sources_count=3, sources_types=["book", "book", "interview"]
    )
    _write_contradictions(person_dir, [{"topic": "testing"}])
    detect_and_write("three-source-person")

    result = _read_gaps(person_dir)
    assert "insufficient_sources" not in _gap_types(result)
    assert "single_source_only" not in _gap_types(result)
    assert "no_sources" not in _gap_types(result)


# ─── AC-5: missing_source_type ───────────────────────────────────────────────


def test_missing_source_type_all_books(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(
        pkb, "kent-beck", sources_count=5, sources_types=["book", "book", "book", "book", "book"]
    )
    _write_contradictions(person_dir, [{"topic": "tdd"}])
    detect_and_write("kent-beck")

    result = _read_gaps(person_dir)
    assert "missing_source_type" in _gap_types(result)

    gap = next(g for g in result["gaps"] if g["type"] == "missing_source_type")
    assert gap["priority"] == "alta"


def test_no_missing_source_type_with_interview(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(
        pkb, "mixed-sources", sources_count=3, sources_types=["book", "interview", "book"]
    )
    _write_contradictions(person_dir, [{"topic": "testing"}])
    detect_and_write("mixed-sources")

    result = _read_gaps(person_dir)
    assert "missing_source_type" not in _gap_types(result)


# ─── AC-6: no_contradiction_candidates — list format ─────────────────────────


def test_no_contradiction_candidates_empty_list(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(
        pkb, "no-contradictions", sources_count=3, sources_types=["book", "interview", "book"]
    )
    _write_contradictions(person_dir, [])
    detect_and_write("no-contradictions")

    result = _read_gaps(person_dir)
    assert "no_contradiction_candidates" in _gap_types(result)


def test_contradiction_candidates_present_list(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(
        pkb, "has-contradictions", sources_count=3, sources_types=["book", "interview", "book"]
    )
    _write_contradictions(person_dir, [{"topic": "simplicity", "type": "intra_source"}])
    detect_and_write("has-contradictions")

    result = _read_gaps(person_dir)
    assert "no_contradiction_candidates" not in _gap_types(result)


# ─── AC-6: no_contradiction_candidates — dict format ─────────────────────────


def test_no_contradiction_candidates_empty_dict(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(
        pkb, "dict-empty", sources_count=3, sources_types=["book", "interview", "book"]
    )
    _write_contradictions(person_dir, {"contradictions": []})
    detect_and_write("dict-empty")

    result = _read_gaps(person_dir)
    assert "no_contradiction_candidates" in _gap_types(result)


def test_contradiction_candidates_present_dict(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(
        pkb, "dict-has-data", sources_count=3, sources_types=["book", "interview", "book"]
    )
    _write_contradictions(person_dir, {"contradictions": [{"topic": "testing"}]})
    detect_and_write("dict-has-data")

    result = _read_gaps(person_dir)
    assert "no_contradiction_candidates" not in _gap_types(result)


# ─── AC-6: no_contradiction_candidates — file absent ─────────────────────────


def test_no_contradiction_candidates_file_absent(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(
        pkb, "no-profile", sources_count=3, sources_types=["book", "interview", "book"]
    )
    # No contradictions.json created
    detect_and_write("no-profile")

    result = _read_gaps(person_dir)
    assert "no_contradiction_candidates" in _gap_types(result)


# ─── blocks_tier_progression ─────────────────────────────────────────────────


def test_blocks_tier_true_when_critical_gap(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(pkb, "critical-only", sources_count=1, sources_types=["book"])
    detect_and_write("critical-only")

    result = _read_gaps(person_dir)
    assert result["blocks_tier_progression"] is True


def test_blocks_tier_false_when_only_alta_gaps(pkb):
    from knowledge_etl.kb.gap_detector import detect_and_write

    # 3+ sources (no critica gap), all books (missing_source_type: alta),
    # no contradictions (no_contradiction_candidates: alta)
    person_dir = _make_person(
        pkb, "alta-only", sources_count=4, sources_types=["book", "book", "book", "book"]
    )
    _write_contradictions(person_dir, [])
    detect_and_write("alta-only")

    result = _read_gaps(person_dir)
    assert result["blocks_tier_progression"] is False
    assert all(g["priority"] == "alta" for g in result["gaps"])


# ─── Edge cases ──────────────────────────────────────────────────────────────


def test_noop_when_person_dir_absent(pkb):
    """detect_and_write must not raise when slug does not exist."""
    from knowledge_etl.kb.gap_detector import detect_and_write

    detect_and_write("nonexistent-person")  # Must not raise


def test_noop_when_metadata_absent(pkb, tmp_path):
    """detect_and_write must not raise when metadata.yaml is missing."""
    import knowledge_etl.kb.gap_detector as gd
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = pkb / "no-meta"
    person_dir.mkdir(parents=True)
    detect_and_write("no-meta")  # Must not raise


def test_gaps_yaml_fully_overwritten(pkb):
    """gaps.yaml is overwritten on every call — no accumulation."""
    from knowledge_etl.kb.gap_detector import detect_and_write

    person_dir = _make_person(pkb, "overwrite-test", sources_count=1, sources_types=["book"])
    detect_and_write("overwrite-test")

    result_first = _read_gaps(person_dir)
    assert "single_source_only" in _gap_types(result_first)

    # Now update metadata to 5 sources with interviews + write contradictions
    meta = yaml.safe_load((person_dir / "metadata.yaml").read_text(encoding="utf-8"))
    meta["sources_count"] = 5
    meta["sources_types"] = ["book", "book", "interview", "book", "book"]
    with open(person_dir / "metadata.yaml", "w", encoding="utf-8") as f:
        yaml.dump(meta, f, allow_unicode=True, sort_keys=False)
    _write_contradictions(person_dir, [{"topic": "simplicity"}])

    detect_and_write("overwrite-test")

    result_second = _read_gaps(person_dir)
    assert "single_source_only" not in _gap_types(result_second)
    assert result_second["blocks_tier_progression"] is False


def test_gap_ids_sequential(pkb):
    """Gap IDs must be sequential (GAP-001, GAP-002, ...) not hardcoded per type."""
    from knowledge_etl.kb.gap_detector import detect_and_write

    # sources_count=2 → insufficient_sources (GAP-001) + missing_source_type (GAP-002)
    person_dir = _make_person(
        pkb, "sequential-ids", sources_count=2, sources_types=["book", "book"]
    )
    _write_contradictions(person_dir, [])
    detect_and_write("sequential-ids")

    result = _read_gaps(person_dir)
    ids = [g["id"] for g in result["gaps"]]
    assert ids == [f"GAP-{i:03d}" for i in range(1, len(ids) + 1)]
