"""
Tests for kb/person_readiness.py — PKB Readiness Gate (Story 21.3)
"""
from __future__ import annotations

from pathlib import Path
from unittest.mock import patch

import pytest
import yaml


# ─── Helpers ─────────────────────────────────────────────────────────────────


def _write_metadata(people_kb: Path, slug: str, tier: int) -> None:
    person_dir = people_kb / slug
    person_dir.mkdir(parents=True, exist_ok=True)
    meta = {
        "slug": slug,
        "name": slug,
        "tier": tier,
        "clone_type": "undecided",
        "sources_count": tier + 1,
        "apex_score_estimated": 0,
    }
    (person_dir / "metadata.yaml").write_text(
        yaml.dump(meta, allow_unicode=True, sort_keys=False),
        encoding="utf-8",
    )


def _read_readiness(people_kb: Path, slug: str) -> dict:
    return yaml.safe_load((people_kb / slug / "readiness.yaml").read_text(encoding="utf-8"))


# ─── AC-3: readiness.yaml created / updated after each run ───────────────────


def test_readiness_yaml_created_for_tier_1(tmp_path):
    """AC-3: readiness.yaml created when tier = 1."""
    from knowledge_etl.kb.person_readiness import update_readiness

    _write_metadata(tmp_path, "donella-h-meadows", tier=1)

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        update_readiness("donella-h-meadows")

    assert (tmp_path / "donella-h-meadows" / "readiness.yaml").exists()


def test_readiness_current_tier_matches_metadata(tmp_path):
    """AC-3: current_tier in readiness.yaml matches tier from metadata.yaml."""
    from knowledge_etl.kb.person_readiness import update_readiness

    _write_metadata(tmp_path, "kent-beck", tier=1)

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        update_readiness("kent-beck")

    readiness = _read_readiness(tmp_path, "kent-beck")
    assert readiness["current_tier"] == 1


def test_readiness_tier_1_tiers_passed_correctly(tmp_path):
    """AC-3: for tier 1, tiers[0] and tiers[1] passed=True, rest False."""
    from knowledge_etl.kb.person_readiness import update_readiness

    _write_metadata(tmp_path, "donella-h-meadows", tier=1)

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        update_readiness("donella-h-meadows")

    readiness = _read_readiness(tmp_path, "donella-h-meadows")
    tiers = readiness["tiers"]
    assert tiers[0]["passed"] is True   # tier 0 always True
    assert tiers[1]["passed"] is True   # tier 1 achieved
    assert tiers[2]["passed"] is False  # tier 2 not achieved
    assert tiers[3]["passed"] is False  # tier 3 not achieved


def test_mmos_cleared_false_for_tier_1(tmp_path):
    """AC-3: mmos_cleared = False when current_tier < 2."""
    from knowledge_etl.kb.person_readiness import update_readiness

    _write_metadata(tmp_path, "donella-h-meadows", tier=1)

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        update_readiness("donella-h-meadows")

    readiness = _read_readiness(tmp_path, "donella-h-meadows")
    assert readiness["mmos_cleared"] is False


def test_mmos_cleared_true_for_tier_2(tmp_path):
    """AC-3: mmos_cleared = True when current_tier >= 2."""
    from knowledge_etl.kb.person_readiness import update_readiness

    _write_metadata(tmp_path, "kent-beck", tier=2)

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        update_readiness("kent-beck")

    readiness = _read_readiness(tmp_path, "kent-beck")
    assert readiness["mmos_cleared"] is True


def test_readiness_noop_when_no_metadata(tmp_path):
    """AC-3: update_readiness is a no-op when metadata.yaml does not exist."""
    from knowledge_etl.kb.person_readiness import update_readiness

    (tmp_path / "nobody").mkdir()

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        update_readiness("nobody")  # Must not raise

    assert not (tmp_path / "nobody" / "readiness.yaml").exists()


# ─── AC-4: is_mmos_cleared() ─────────────────────────────────────────────────


def test_is_mmos_cleared_false_for_tier_1(tmp_path):
    """AC-4: is_mmos_cleared returns False for tier 1."""
    from knowledge_etl.kb.person_readiness import is_mmos_cleared, update_readiness

    _write_metadata(tmp_path, "donella-h-meadows", tier=1)

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        update_readiness("donella-h-meadows")
        result = is_mmos_cleared("donella-h-meadows")

    assert result is False


def test_is_mmos_cleared_true_for_tier_2(tmp_path):
    """AC-4: is_mmos_cleared returns True for tier >= 2."""
    from knowledge_etl.kb.person_readiness import is_mmos_cleared, update_readiness

    _write_metadata(tmp_path, "kent-beck", tier=2)

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        update_readiness("kent-beck")
        result = is_mmos_cleared("kent-beck")

    assert result is True


def test_is_mmos_cleared_false_for_nonexistent_slug(tmp_path):
    """AC-4 + VETO: is_mmos_cleared must return False (not raise) for unknown slug."""
    from knowledge_etl.kb.person_readiness import is_mmos_cleared

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        result = is_mmos_cleared("person-who-does-not-exist")

    assert result is False


def test_is_mmos_cleared_no_exception_for_empty_dir(tmp_path):
    """VETO: is_mmos_cleared does not raise even if person dir exists but has no readiness.yaml."""
    from knowledge_etl.kb.person_readiness import is_mmos_cleared

    (tmp_path / "empty-person").mkdir()

    with patch("knowledge_etl.kb.person_readiness.PEOPLE_KB", tmp_path):
        result = is_mmos_cleared("empty-person")

    assert result is False
