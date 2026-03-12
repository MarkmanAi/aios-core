"""
Person Knowledge Base — Profile Aggregator
Compiles profile/ from all extracted.json files in sources/
"""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

import yaml

from knowledge_etl.config import PEOPLE_KB
from knowledge_etl.kb.person_metadata import calculate_tier
from knowledge_etl.kb.person_readiness import update_readiness


def aggregate(slug: str) -> None:
    """
    Compile profile/ for the given slug.
    Reads all extracted.json in people/{slug}/sources/**/
    Writes 5 files to people/{slug}/profile/
    Updates metadata.yaml and readiness.yaml.
    """
    person_dir = PEOPLE_KB / slug
    if not person_dir.exists():
        raise ValueError(f"Person '{slug}' not found in PKB. Run ETL first.")

    extracted_files = list((person_dir / "sources").rglob("extracted.json"))
    if not extracted_files:
        raise ValueError(f"No extracted.json found for '{slug}'. Process sources first.")

    extractions = []
    for f in extracted_files:
        with open(f, encoding="utf-8") as fp:
            data = json.load(fp)
            # Attach source_slug from directory name if not present
            if "source_slug" not in data:
                data["source_slug"] = f.parent.name
            extractions.append(data)

    profile_dir = person_dir / "profile"
    profile_dir.mkdir(parents=True, exist_ok=True)

    _write_json(profile_dir / "voice_dna.json", _merge_voice_dna(extractions))
    _write_json(profile_dir / "thinking_dna.json", _merge_thinking_dna(extractions))
    _write_json(profile_dir / "contradictions.json", _compile_contradictions(extractions))
    _write_json(profile_dir / "frameworks.json", _compile_frameworks(extractions))
    _write_json(profile_dir / "principles.json", _compile_principles(extractions))

    meta_path = person_dir / "metadata.yaml"
    if meta_path.exists():
        with open(meta_path, encoding="utf-8") as f:
            meta = yaml.safe_load(f)
        meta["tier"] = calculate_tier(meta, person_dir)
        meta["last_updated"] = date.today().isoformat()
        with open(meta_path, "w", encoding="utf-8") as f:
            yaml.dump(meta, f, allow_unicode=True, sort_keys=False)

    update_readiness(slug)


def _merge_voice_dna(extractions: list[dict]) -> dict:
    """Merge voice_dna from all sources. Lists: concat without duplicates. Strings: last wins."""
    merged: dict = {}
    for e in extractions:
        vdna = e.get("voice_dna", {})
        for key, value in vdna.items():
            if isinstance(value, list):
                existing = merged.get(key, [])
                merged[key] = list(dict.fromkeys(existing + value))
            else:
                merged[key] = value
    return merged


def _merge_thinking_dna(extractions: list[dict]) -> dict:
    """Same merge pattern as voice_dna."""
    merged: dict = {}
    for e in extractions:
        tdna = e.get("thinking_dna", {})
        for key, value in tdna.items():
            if isinstance(value, list):
                existing = merged.get(key, [])
                merged[key] = list(dict.fromkeys(existing + value))
            else:
                merged[key] = value
    return merged


def _compile_contradictions(extractions: list[dict]) -> list[dict]:
    """
    Compile intra-source contradictions and detect cross-source candidates.
    Cross-source: same topic appears in 2+ distinct sources.
    NEVER uses AI — field comparison only.
    """
    all_contradictions: list[dict] = []

    for e in extractions:
        for c in e.get("contradictions", []):
            entry = dict(c)
            entry["source"] = e.get("source_slug", "unknown")
            entry["type"] = entry.get("type", "intra_source")
            all_contradictions.append(entry)

    if len(extractions) >= 2:
        topic_map: dict[str, list[dict]] = {}
        for e in extractions:
            source_slug = e.get("source_slug", "unknown")
            for c in e.get("contradictions", []):
                topic = c.get("topic", "").lower()
                if topic:
                    topic_map.setdefault(topic, []).append({
                        "source": source_slug,
                        "contradiction": c,
                    })

        for topic, entries in topic_map.items():
            if len(entries) >= 2:
                for i in range(len(entries) - 1):
                    a = entries[i]
                    b = entries[i + 1]
                    if a["source"] != b["source"]:
                        all_contradictions.append({
                            "topic": topic,
                            "type": "cross_source",
                            "tension": "high",
                            "source_a": a["source"],
                            "quote_a": a["contradiction"].get("pole_a", ""),
                            "source_b": b["source"],
                            "quote_b": b["contradiction"].get("pole_b", ""),
                        })

    return all_contradictions


def _compile_frameworks(extractions: list[dict]) -> dict:
    items: list = []
    for e in extractions:
        items.extend(e.get("frameworks", []))
    return {"sources": [e.get("source_slug") for e in extractions], "items": items}


def _compile_principles(extractions: list[dict]) -> dict:
    items: list = []
    for e in extractions:
        items.extend(e.get("principles", []))
    return {"sources": [e.get("source_slug") for e in extractions], "items": items}


def _write_json(path: Path, data: object) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
