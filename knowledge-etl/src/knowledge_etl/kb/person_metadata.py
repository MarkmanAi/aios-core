"""
Person Knowledge Base — Metadata Manager
Creates and updates knowledge-etl/data/people/{slug}/metadata.yaml
"""
from __future__ import annotations

from datetime import date
from pathlib import Path

import yaml

from knowledge_etl.config import PEOPLE_KB


def create_or_update(
    slug: str,
    name: str,
    source_info: dict,
) -> None:
    """
    Create metadata.yaml if it does not exist.
    Update sources_count, sources_types, sources[], last_updated, tier.
    NEVER overwrites created_at.

    Args:
        slug: Person slug (kebab-case, e.g. "donella-h-meadows").
        name: Full name of the person.
        source_info: Dict with keys: slug, type, title, etl_processed, processed_at.
    """
    person_dir = PEOPLE_KB / slug
    person_dir.mkdir(parents=True, exist_ok=True)
    meta_path = person_dir / "metadata.yaml"

    if meta_path.exists():
        with open(meta_path, encoding="utf-8") as f:
            meta = yaml.safe_load(f)
    else:
        meta = _new_metadata(slug, name)

    # Update sources — deduplicate by (slug, type)
    existing_keys = {(s["slug"], s["type"]) for s in meta.get("sources", [])}
    key = (source_info["slug"], source_info["type"])
    if key not in existing_keys:
        meta["sources"].append(source_info)
        meta["sources_count"] = len(meta["sources"])
        meta["sources_types"] = list({s["type"] for s in meta["sources"]})
        if source_info.get("etl_processed"):
            meta["etl_processed"] = True

    meta["last_updated"] = date.today().isoformat()
    meta["tier"] = calculate_tier(meta, person_dir)

    with open(meta_path, "w", encoding="utf-8") as f:
        yaml.dump(meta, f, allow_unicode=True, sort_keys=False)


def calculate_tier(meta: dict, person_dir: Path) -> int:
    """
    Calculate current tier based on state of person_dir.

    tier 0: always (base)
    tier 1: sources_count >= 1 AND at least 1 extracted.json exists
    tier 2: profile/ exists AND apex_score_estimated >= threshold
    tier 3: sources_count >= 3 AND tier >= 2

    This function has NO side effects — read-only, returns int only.
    """
    sources_dir = person_dir / "sources"
    has_extraction = (
        any(sources_dir.rglob("extracted.json"))
        if sources_dir.exists()
        else False
    )

    if meta.get("sources_count", 0) < 1 or not has_extraction:
        return 0

    tier = 1

    profile_exists = (person_dir / "profile").exists()
    clone_type = meta.get("clone_type", "undecided")
    threshold = 55 if clone_type == "governance_advisor" else 70
    apex_ok = meta.get("apex_score_estimated", 0) >= threshold

    if profile_exists and apex_ok:
        tier = 2
        if meta.get("sources_count", 0) >= 3:
            tier = 3

    return tier


def _new_metadata(slug: str, name: str) -> dict:
    today = date.today().isoformat()
    return {
        "slug": slug,
        "name": name,
        "clone_type": "undecided",
        "sources_count": 0,
        "sources_types": [],
        "sources": [],
        "tier": 0,
        "apex_score_estimated": 0,
        "etl_processed": False,
        "agent_enriched": False,
        "mmos_status": "none",
        "created_at": today,
        "last_updated": today,
        "migrated_from_mmos": False,
    }
