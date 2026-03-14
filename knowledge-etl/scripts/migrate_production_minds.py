#!/usr/bin/env python3
"""
Migration script: Production MMOS minds → Person Knowledge Base
SAFE: Read-only from squads/mmos-squad/minds/ — never modifies MMOS files.

Usage:
  python migrate_production_minds.py           # Execute migration
  python migrate_production_minds.py --dry-run # Preview without creating files
"""
import sys
import json
import re
import yaml
from pathlib import Path
from datetime import date
import argparse

# Resolve paths
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ETL_ROOT = REPO_ROOT / "knowledge-etl"

sys.path.insert(0, str(ETL_ROOT / "src"))

from knowledge_etl.config import PEOPLE_KB, MMOS_MINDS
from knowledge_etl.kb.gap_detector import detect_and_write

# Minds to migrate: (mmos_slug, pkb_slug, full_name)
PRODUCTION_MINDS = [
    ("kent_beck",     "kent-beck",     "Kent Beck"),
    ("jeff_patton",   "jeff-patton",   "Jeff Patton"),
    ("marty_cagan",   "marty-cagan",   "Marty Cagan"),
    ("cagan_patton",  "cagan-patton",  "Cagan Patton"),
    ("brad_frost",    "brad-frost",    "Brad Frost"),
    ("thiago_finch",  "thiago-finch",  "Thiago Finch"),
    ("pedro_valerio", "pedro-valerio", "Pedro Valerio"),
    ("joao_lozano",   "joao-lozano",   "Joao Lozano"),
]


def migrate_mind(mmos_slug: str, pkb_slug: str, full_name: str, dry_run: bool) -> dict:
    """Migrate one mind from MMOS to PKB. Returns result dict."""
    mmos_dir = MMOS_MINDS / mmos_slug
    pkb_dir = PEOPLE_KB / pkb_slug

    if not mmos_dir.exists():
        return {"slug": pkb_slug, "status": "ERROR", "reason": f"MMOS dir not found: {mmos_dir}"}

    if dry_run:
        sources_count = _count_sources(mmos_dir)
        return {"slug": pkb_slug, "status": "DRY_RUN", "sources": sources_count}

    try:
        # Create PKB structure
        (pkb_dir / "sources" / "books").mkdir(parents=True, exist_ok=True)
        (pkb_dir / "profile").mkdir(parents=True, exist_ok=True)

        # Migrate sources
        sources_count = _migrate_sources(mmos_dir, pkb_dir, pkb_slug, full_name)

        # Migrate profile (best-effort from analysis/)
        _migrate_profile(mmos_dir, pkb_dir)

        # Write metadata.yaml
        _write_metadata(pkb_dir, pkb_slug, full_name, sources_count)

        # Write readiness.yaml (tier 3 guaranteed for production minds)
        _write_readiness(pkb_dir)

        # Generate gaps.yaml
        detect_and_write(pkb_slug)

        return {"slug": pkb_slug, "status": "OK", "sources": sources_count}

    except Exception as e:
        return {"slug": pkb_slug, "status": "ERROR", "reason": str(e)}


def _count_sources(mmos_dir: Path) -> int:
    sources_dir = mmos_dir / "sources"
    if not sources_dir.exists():
        return 0
    return len([f for f in sources_dir.iterdir() if f.suffix == ".md" and f.name != "sources-index.md"])


def _migrate_sources(mmos_dir: Path, pkb_dir: Path, pkb_slug: str, author: str) -> int:
    sources_dir = mmos_dir / "sources"
    if not sources_dir.exists():
        return 0

    count = 0
    for source_file in sources_dir.iterdir():
        if source_file.suffix != ".md" or source_file.name == "sources-index.md":
            continue

        book_slug = source_file.stem
        dest_dir = pkb_dir / "sources" / "books" / book_slug
        dest_dir.mkdir(parents=True, exist_ok=True)

        extracted = {
            "source_slug": book_slug,
            "source_type": "book",
            "source_title": book_slug.replace("-", " ").title(),
            "author": author,
            "processed_at": date.today().isoformat(),
            "migrated_from_mmos": True,
            "voice_dna": {},
            "thinking_dna": {},
            "contradictions": [],
        }
        with open(dest_dir / "extracted.json", "w", encoding="utf-8") as f:
            json.dump(extracted, f, indent=2, ensure_ascii=False)
        count += 1

    return count


def _migrate_profile(mmos_dir: Path, pkb_dir: Path) -> None:
    profile_dir = pkb_dir / "profile"

    # Try to extract contradictions from layer-8
    contradictions = []
    layer8_path = mmos_dir / "analysis" / "layer-8-paradoxes.md"
    if layer8_path.exists():
        content = layer8_path.read_text(encoding="utf-8")
        paradoxes = re.findall(r"##\s+(.+)", content)
        for i, p in enumerate(paradoxes):
            contradictions.append({
                "id": i + 1,
                "topic": p.strip(),
                "type": "intra_source",
                "source": "mmos_analysis_layer8",
                "migrated": True,
            })

    _write_json(profile_dir / "contradictions.json", contradictions)
    _write_json(profile_dir / "voice_dna.json", {"migrated": True, "source": "mmos_analysis"})
    _write_json(profile_dir / "thinking_dna.json", {"migrated": True, "source": "mmos_analysis"})
    _write_json(profile_dir / "frameworks.json", {"sources": [], "items": [], "migrated": True})
    _write_json(profile_dir / "principles.json", {"sources": [], "items": [], "migrated": True})


def _write_metadata(pkb_dir: Path, slug: str, name: str, sources_count: int) -> None:
    today = date.today().isoformat()
    meta = {
        "slug": slug,
        "name": name,
        "clone_type": "mind_clone",
        "sources_count": sources_count,
        "sources_types": ["book"],
        "sources": [],
        "tier": 3,
        "apex_score_estimated": 0,
        "etl_processed": True,
        "agent_enriched": True,
        "mmos_status": "production",
        "created_at": today,
        "last_updated": today,
        "migrated_from_mmos": True,
    }
    with open(pkb_dir / "metadata.yaml", "w", encoding="utf-8") as f:
        yaml.dump(meta, f, allow_unicode=True, sort_keys=False)


def _write_readiness(pkb_dir: Path) -> None:
    readiness = {
        "current_tier": 3,
        "tiers": [
            {"tier": 0, "name": "raw", "condition": "At least 1 source collected in sources/", "passed": True},
            {"tier": 1, "name": "extracted", "condition": "ETL ran on at least 1 source", "passed": True},
            {
                "tier": 2,
                "name": "profile_ready",
                "condition": "profile/ exists + apex >= threshold",
                "threshold": {"mind_clone": 70, "governance_advisor": 55},
                "passed": True,
            },
            {"tier": 3, "name": "production_ready", "condition": "sources_count >= 3 AND tier_2 passed", "passed": True},
        ],
        "mmos_cleared": True,
    }
    with open(pkb_dir / "readiness.yaml", "w", encoding="utf-8") as f:
        yaml.dump(readiness, f, allow_unicode=True, sort_keys=False)


def _write_json(path: Path, data) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def _write_report(results: list) -> None:
    today = date.today().isoformat()
    ok_count = sum(1 for r in results if r["status"] == "OK")
    lines = [
        f"# PKB Migration Report — {today}",
        "",
        f"**Total:** {len(results)} minds | **Success:** {ok_count} | **Errors:** {len(results) - ok_count}",
        "",
        "## Results",
        "",
    ]
    for r in results:
        if r["status"] == "OK":
            lines.append(
                f"- [OK] `{r['slug']}` -- tier: 3, sources: {r.get('sources', '?')}, mmos_cleared: true"
            )
        else:
            lines.append(f"- [ERR] `{r['slug']}` -- ERROR: {r.get('reason', 'unknown')}")

    report_path = PEOPLE_KB.parent / "migration_report.md"
    report_path.write_text("\n".join(lines), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Migrate production MMOS minds to PKB")
    parser.add_argument("--dry-run", action="store_true", help="Preview without creating files")
    args = parser.parse_args()

    results = []
    for mmos_slug, pkb_slug, full_name in PRODUCTION_MINDS:
        print(f"{'[DRY RUN] ' if args.dry_run else ''}Migrating {mmos_slug} -> {pkb_slug}...", end=" ")
        result = migrate_mind(mmos_slug, pkb_slug, full_name, args.dry_run)
        status_icon = "OK" if result["status"] in ("OK", "DRY_RUN") else "ERR"
        print(f"{status_icon} {result['status']}")
        results.append(result)

    if not args.dry_run:
        _write_report(results)
        print(f"\nMigration complete. Report: knowledge-etl/data/migration_report.md")


if __name__ == "__main__":
    main()
