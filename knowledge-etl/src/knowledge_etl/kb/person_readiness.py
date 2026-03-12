"""
Person Knowledge Base — Readiness Gate
Evaluates tiers and maintains knowledge-etl/data/people/{slug}/readiness.yaml
"""
from __future__ import annotations

import yaml

from knowledge_etl.config import PEOPLE_KB


def update_readiness(slug: str) -> None:
    """
    Read metadata.yaml, evaluate each tier, write readiness.yaml.
    mmos_cleared = True when current_tier >= 2.

    No-op if metadata.yaml does not exist for the slug.
    """
    person_dir = PEOPLE_KB / slug
    meta_path = person_dir / "metadata.yaml"

    if not meta_path.exists():
        return

    with open(meta_path, encoding="utf-8") as f:
        meta = yaml.safe_load(f)

    current_tier = meta.get("tier", 0)

    tiers = [
        {
            "tier": 0,
            "name": "raw",
            "condition": "At least 1 source collected in sources/",
            "passed": current_tier >= 0,
        },
        {
            "tier": 1,
            "name": "extracted",
            "condition": "ETL ran on at least 1 source — extracted.json exists",
            "passed": current_tier >= 1,
        },
        {
            "tier": 2,
            "name": "profile_ready",
            "condition": "profile/ exists + apex_score_estimated >= threshold by clone_type",
            "threshold": {"mind_clone": 70, "governance_advisor": 55},
            "passed": current_tier >= 2,
        },
        {
            "tier": 3,
            "name": "production_ready",
            "condition": "sources_count >= 3 AND tier_2 passed",
            "passed": current_tier >= 3,
        },
    ]

    readiness = {
        "current_tier": current_tier,
        "tiers": tiers,
        "mmos_cleared": current_tier >= 2,
    }

    readiness_path = person_dir / "readiness.yaml"
    with open(readiness_path, "w", encoding="utf-8") as f:
        yaml.dump(readiness, f, allow_unicode=True, sort_keys=False)


def is_mmos_cleared(slug: str) -> bool:
    """
    Return True if the Person KB is ready for MMOS consumption (tier >= 2).
    Return False if the readiness.yaml file does not exist.
    Never raises an exception for missing or unknown slugs.
    """
    readiness_path = PEOPLE_KB / slug / "readiness.yaml"
    if not readiness_path.exists():
        return False
    with open(readiness_path, encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("mmos_cleared", False)
