"""
Person Knowledge Base — Gap Detector
Detecta lacunas na PKB e escreve people/{slug}/gaps.yaml
"""
from __future__ import annotations

import json
from pathlib import Path

import yaml

from knowledge_etl.config import PEOPLE_KB


def detect_and_write(slug: str) -> None:
    """
    Evaluate current PKB state for the slug.
    Detect applicable gaps.
    Write people/{slug}/gaps.yaml (fully overwritten each call).
    """
    person_dir = PEOPLE_KB / slug
    if not person_dir.exists():
        return

    meta_path = person_dir / "metadata.yaml"
    if not meta_path.exists():
        return

    with open(meta_path, encoding="utf-8") as f:
        meta = yaml.safe_load(f)

    gaps: list[dict] = []
    gap_counter = 1

    sources_count = meta.get("sources_count", 0)
    sources_types = meta.get("sources_types", [])

    # Gap: no_sources (sources_count == 0)
    if sources_count == 0:
        gaps.append({
            "id": f"GAP-{gap_counter:03d}",
            "type": "no_sources",
            "description": "Nenhuma fonte processada — PKB vazia",
            "impact": "BLOCKS_all_tiers — impossível avançar sem fontes",
            "priority": "critica",
            "suggestion": "Processar ao menos 1 livro ou entrevista via knowledge-etl process",
        })
        gap_counter += 1

    # Gap: single_source_only
    elif sources_count == 1:
        gaps.append({
            "id": f"GAP-{gap_counter:03d}",
            "type": "single_source_only",
            "description": "Apenas 1 fonte — P3 requer triangulação com 3+ fontes independentes",
            "impact": "P3 triangulation risk — BLOCKS tier_3",
            "priority": "critica",
            "suggestion": "Buscar ao menos 2 fontes adicionais distintas (artigos, entrevistas, etc.)",
        })
        gap_counter += 1

    # Gap: insufficient_sources (2 sources — needs at least 3)
    elif sources_count == 2:
        gaps.append({
            "id": f"GAP-{gap_counter:03d}",
            "type": "insufficient_sources",
            "description": f"Apenas {sources_count} fontes — P3 requer 3+ fontes independentes",
            "impact": "BLOCKS_tier_3",
            "priority": "critica",
            "suggestion": "Adicionar ao menos 1 fonte adicional de tipo distinto",
        })
        gap_counter += 1

    # Gap: missing_source_type (only book sources)
    non_book_types = [t for t in sources_types if t != "book"]
    if sources_types and len(non_book_types) == 0:
        gaps.append({
            "id": f"GAP-{gap_counter:03d}",
            "type": "missing_source_type",
            "description": "Apenas fontes do tipo 'book' — voice e ritmo de fala ausentes",
            "impact": "L4 (communication_patterns) — padrões de fala não capturáveis de livros",
            "priority": "alta",
            "suggestion": "Buscar entrevistas ou talks em vídeo/podcast",
        })
        gap_counter += 1

    # Gap: no_contradiction_candidates
    # contradictions.json can be a plain list OR dict {"contradictions": [...]}
    # (profile_aggregator.py produces a list; see Story 21.4 fix for dict handling)
    contradictions_path = person_dir / "profile" / "contradictions.json"
    has_contradictions = False
    if contradictions_path.exists():
        with open(contradictions_path, encoding="utf-8") as f:
            contradictions_data = json.load(f)
        if isinstance(contradictions_data, list):
            has_contradictions = len(contradictions_data) > 0
        elif isinstance(contradictions_data, dict):
            has_contradictions = len(contradictions_data.get("contradictions", [])) > 0

    if not has_contradictions:
        gaps.append({
            "id": f"GAP-{gap_counter:03d}",
            "type": "no_contradiction_candidates",
            "description": "Nenhuma contradição candidata identificada — L8 ficará empobrecido",
            "impact": "L8 (gold_layer) — camada mais crítica do pipeline MMOS",
            "priority": "alta",
            "suggestion": "Adicionar fontes de épocas distintas da carreira da pessoa",
        })
        gap_counter += 1

    has_critical = any(g["priority"] == "critica" for g in gaps)

    result = {
        "slug": slug,
        "gaps": gaps,
        "blocks_tier_progression": has_critical,
    }

    gaps_path = person_dir / "gaps.yaml"
    with open(gaps_path, "w", encoding="utf-8") as f:
        yaml.dump(result, f, allow_unicode=True, sort_keys=False)
