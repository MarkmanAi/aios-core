"""Tests for Epic 12 — Knowledge-ETL Completeness (Stories 12.1, 12.2, 12.3, 12.4)."""

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import MagicMock, patch

import numpy as np
import pytest


# ─── Story 12.1: ThinkingDNA exemplar_reasoning_quote ────────────────────────


class TestThinkingDNASchema:
    """Story 12.1 — exemplar_reasoning_quote field must exist in ThinkingDNA."""

    def test_field_exists_in_schema(self):
        """AC1: ThinkingDNA model contains exemplar_reasoning_quote."""
        from knowledge_etl.transform.l3_authorial import ThinkingDNA

        dna = ThinkingDNA()
        assert hasattr(dna, "exemplar_reasoning_quote")
        assert dna.exemplar_reasoning_quote == ""

    def test_field_preserved_by_model_validate(self):
        """AC2: model_validate preserves the field (not dropped by Pydantic)."""
        from knowledge_etl.transform.l3_authorial import ThinkingDNA

        data = {
            "primary_reasoning_pattern": "dialectical",
            "favorite_argumentative_move": "reframe",
            "mental_models": [],
            "epistemic_style": "assertive",
            "favorite_analogies": [],
            "exemplar_reasoning_quote": "test quote from author",
        }
        validated = ThinkingDNA.model_validate(data)
        assert validated.exemplar_reasoning_quote == "test quote from author"

    def test_model_dump_includes_field(self):
        """AC2: model_dump() includes the field."""
        from knowledge_etl.transform.l3_authorial import ThinkingDNA

        dna = ThinkingDNA(exemplar_reasoning_quote="reasoning sample")
        dumped = dna.model_dump()
        assert "exemplar_reasoning_quote" in dumped
        assert dumped["exemplar_reasoning_quote"] == "reasoning sample"

    def test_refine_thinking_preserves_quote(self, tmp_path):
        """AC2: _refine_thinking preserves exemplar_reasoning_quote from LLM."""
        from knowledge_etl.transform.l3_authorial import _refine_thinking

        llm = MagicMock()
        llm.call_structured.return_value = (
            {
                "primary_reasoning_pattern": "dialectical",
                "favorite_argumentative_move": "reframe",
                "mental_models": [],
                "epistemic_style": "assertive",
                "favorite_analogies": [],
                "exemplar_reasoning_quote": "The map is not the territory.",
            },
            MagicMock(cost_usd=0.01),
        )
        cost_tracker = MagicMock()
        checkpoint = MagicMock()
        checkpoint.is_done.return_value = False
        checkpoint.get_result.return_value = None

        ch = tmp_path / "01-intro.md"
        ch.write_text("Chapter content.", encoding="utf-8")

        template = (
            "<system_prompt>You are a thinking analyst.</system_prompt>\n"
            "<user_prompt>{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} "
            "{{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{PRIOR_PROFILE}}</user_prompt>"
        )

        result = _refine_thinking(
            chapter_paths=[ch],
            book_title="Test",
            author="Author",
            template=template,
            llm=llm,
            cost_tracker=cost_tracker,
            model="test-model",
            checkpoint=checkpoint,
            l3_dir=tmp_path,
        )

        assert result["exemplar_reasoning_quote"] == "The map is not the territory."

    def test_parse_json_unwraps_single_key_wrapper(self):
        """[12.1-QA-L1]: _parse_json unwraps {"thinking_dna": {...}} before Pydantic validation.

        Real LLM responses may wrap fields under a named key. Without unwrapping,
        Pydantic silently produces all-default values (no ValidationError raised).
        """
        from knowledge_etl.transform.l3_authorial import ThinkingDNA, _parse_json

        wrapped_response = json.dumps({
            "thinking_dna": {
                "primary_reasoning_pattern": "dialectical",
                "favorite_argumentative_move": "reframe",
                "mental_models": ["first principles"],
                "epistemic_style": "assertive",
                "favorite_analogies": ["map vs territory"],
                "exemplar_reasoning_quote": "The map is not the territory.",
            }
        })

        result = _parse_json(wrapped_response, ThinkingDNA)

        assert result is not None
        assert result["exemplar_reasoning_quote"] == "The map is not the territory."
        assert result["primary_reasoning_pattern"] == "dialectical"

    def test_parse_json_does_not_unwrap_contradictions_list(self):
        """[12.1-QA-L1]: _parse_json does NOT unwrap when single-key value is a list.

        ContradictionsResult uses {"productive_contradictions": [...]} — a single key
        with a list value. This must NOT be unwrapped.
        """
        from knowledge_etl.transform.l3_authorial import ContradictionsResult, _parse_json

        contradictions_response = json.dumps({
            "productive_contradictions": [
                {
                    "tension": "Freedom vs Structure",
                    "pole_a": {"label": "Freedom"},
                    "pole_b": {"label": "Structure"},
                    "generative_insight": "Constraint enables creativity.",
                }
            ]
        })

        result = _parse_json(contradictions_response, ContradictionsResult)

        assert result is not None
        assert "productive_contradictions" in result
        assert len(result["productive_contradictions"]) == 1


# ─── Story 12.2: L1 MAP-REDUCE Reduce Pass ───────────────────────────────────


class TestL1ReducePass:
    """Story 12.2 — _reduce_l1 deduplicates and compresses principles."""

    def test_reduce_called_in_map_reduce(self, tmp_path):
        """AC1: _extract_map_reduce calls _reduce_l1 (not raw return)."""
        from knowledge_etl.transform.l1_principles import _extract_map_reduce

        llm = MagicMock()
        # Map call returns principles
        map_result = {
            "principles": [
                {"principle": "P1", "action": "A1", "attribution": "Author",
                 "source_quote": "Q1", "chapter_ref": "Ch1"}
            ]
        }
        # Reduce call returns curated list
        reduce_result = {
            "principles": [
                {"principle": "P1 compressed", "action": "A1", "attribution": "Author",
                 "source_quote": "Q1", "chapter_ref": "Ch1"}
            ]
        }
        llm.call_structured.side_effect = [
            (map_result, MagicMock(cost_usd=0.01)),
            (reduce_result, MagicMock(cost_usd=0.005)),
        ]
        cost_tracker = MagicMock()
        checkpoint = MagicMock()
        checkpoint.is_done.return_value = False

        ch = tmp_path / "01-intro.md"
        ch.write_text("Content.", encoding="utf-8")

        template = (
            "<system_prompt>Extract principles.</system_prompt>\n"
            "<user_prompt>{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} "
            "{{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{CHAPTER_PAGES}}</user_prompt>"
        )

        l1_dir = tmp_path / "l1"
        l1_dir.mkdir()

        with patch("knowledge_etl.transform.l1_principles.PROMPTS_DIR", tmp_path):
            # Create l1_reduce.xml template
            reduce_xml = tmp_path / "l1_reduce.xml"
            reduce_xml.write_text(
                "<system_prompt>Curator.</system_prompt>\n"
                "<user_prompt>{{BOOK_TITLE}} {{AUTHOR}} {{TOTAL_CHAPTERS}} "
                "{{JSON_ARRAY_OF_CANDIDATES}}</user_prompt>",
                encoding="utf-8",
            )

            result = _extract_map_reduce(
                chapter_paths=[ch],
                book_title="Test",
                author="Author",
                prompt_template=template,
                llm=llm,
                cost_tracker=cost_tracker,
                model="test-model",
                checkpoint=checkpoint,
                l1_dir=l1_dir,
            )

        # Should return reduce output, not raw map output
        assert len(result) == 1
        assert result[0]["principle"] == "P1 compressed"
        # Reduce cost tracked
        assert any(c.args[0] == "l1_reduce" for c in cost_tracker.record.call_args_list)

    def test_reduce_records_l1_reduce_cost(self, tmp_path):
        """AC5: cost_tracker records with label l1_reduce."""
        from knowledge_etl.transform.l1_principles import _reduce_l1

        llm = MagicMock()
        usage = MagicMock(cost_usd=0.003)
        llm.call_structured.return_value = (
            {"principles": []},
            usage,
        )
        cost_tracker = MagicMock()

        with patch("knowledge_etl.transform.l1_principles.PROMPTS_DIR", tmp_path):
            reduce_xml = tmp_path / "l1_reduce.xml"
            reduce_xml.write_text(
                "<system_prompt>sys</system_prompt><user_prompt>"
                "{{BOOK_TITLE}} {{AUTHOR}} {{TOTAL_CHAPTERS}} {{JSON_ARRAY_OF_CANDIDATES}}"
                "</user_prompt>",
                encoding="utf-8",
            )
            _reduce_l1(
                chapter_results=[{"principle": "P", "chapter_ref": "Ch1"}],
                book_title="T",
                author="A",
                llm=llm,
                cost_tracker=cost_tracker,
            )

        cost_tracker.record.assert_called_once_with("l1_reduce", usage)

    def test_reduce_empty_list_returns_empty(self):
        """AC: empty chapter_results returns empty without LLM call."""
        from knowledge_etl.transform.l1_principles import _reduce_l1

        llm = MagicMock()
        result = _reduce_l1([], "T", "A", llm, MagicMock())
        assert result == []
        llm.call_structured.assert_not_called()

    def test_stuff_strategy_unaffected(self, tmp_path):
        """AC7: STUFF strategy does NOT call _reduce_l1."""
        from knowledge_etl.transform.l1_principles import _extract_stuff

        llm = MagicMock()
        llm.call_structured.return_value = (
            {"principles": [{"principle": "P1"}]},
            MagicMock(cost_usd=0.01),
        )
        cost_tracker = MagicMock()

        full_text = tmp_path / "full.md"
        full_text.write_text("Full book.", encoding="utf-8")
        l1_dir = tmp_path / "l1"
        l1_dir.mkdir()

        template = (
            "<system_prompt>sys</system_prompt>"
            "<user_prompt>{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} "
            "{{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{CHAPTER_PAGES}}</user_prompt>"
        )

        result = _extract_stuff(
            full_text_path=full_text,
            book_title="T",
            author="A",
            prompt_template=template,
            llm=llm,
            cost_tracker=cost_tracker,
            model="test",
            l1_dir=l1_dir,
        )

        # Only 1 LLM call (stuff), no reduce
        assert llm.call_structured.call_count == 1
        cost_tracker.record.assert_called_once_with("l1_stuff", llm.call_structured.return_value[1])


# ─── Story 12.4: Config Drift ────────────────────────────────────────────────


class TestConfigDrift:
    """Story 12.4 — CHECKPOINTS imported and used, validate->validation."""

    def test_l1_imports_checkpoints(self):
        """AC1: l1_principles uses CHECKPOINTS from config."""
        import knowledge_etl.transform.l1_principles as mod
        source = Path(mod.__file__).read_text(encoding="utf-8")
        assert "from knowledge_etl.config import" in source
        assert "CHECKPOINTS" in source
        assert ".checkpoints" not in source

    def test_l2_imports_checkpoints(self):
        """AC1: l2_frameworks uses CHECKPOINTS from config."""
        import knowledge_etl.transform.l2_frameworks as mod
        source = Path(mod.__file__).read_text(encoding="utf-8")
        assert "CHECKPOINTS" in source
        assert ".checkpoints" not in source

    def test_l3_imports_checkpoints(self):
        """AC1: l3_authorial uses CHECKPOINTS from config."""
        import knowledge_etl.transform.l3_authorial as mod
        source = Path(mod.__file__).read_text(encoding="utf-8")
        assert "CHECKPOINTS" in source
        assert ".checkpoints" not in source

    def test_faithfulness_uses_validation_dir(self):
        """AC3: faithfulness.py uses 'validation' not 'validate'."""
        import knowledge_etl.validate.faithfulness as mod
        source = Path(mod.__file__).read_text(encoding="utf-8")
        # Should use "validation"
        assert '/"validation"' in source or "validation" in source
        # Should NOT use "validate" as directory name
        lines = [l for l in source.split("\n") if "book_slug" in l and "validate" in l.lower()]
        for line in lines:
            assert "validation" in line, f"Found \'validate\' without \'validation\': {line}"


# --- Story 12.3: Dedup Cross-Run via SQLite -----------------------------------


class TestDedupCrossRun:
    """Story 12.3 AC4/AC8 — cross-run blocking via SQLite registry."""

    def test_cross_run_blocks_duplicate_via_sqlite(self, tmp_path):
        """AC4/AC8: item accepted in Run 1 is blocked in Run 2 (no .md file present)."""
        pytest.importorskip('faiss')

        from knowledge_etl.load.dedup import deduplicate, reset_db_singleton

        db_path = tmp_path / 'dedup.db'
        item_x = {'principle': 'Leaders eat last.'}

        # Deterministic normalized embedding — cosine sim with itself = 1.0
        dim = 384
        raw = np.ones((1, dim), dtype=np.float32)
        fixed_emb = raw / np.linalg.norm(raw)

        with patch('knowledge_etl.load.dedup._get_model') as mock_get_model:
            mock_model = MagicMock()
            mock_model.encode.return_value = fixed_emb
            mock_get_model.return_value = mock_model

            # Run 1: item_x is unique -> accepted and persisted to SQLite
            run1 = deduplicate([item_x], [], db_path=db_path)
            assert len(run1) == 1, 'Run 1: item should be accepted'

        # Simulate a new session / new process — reset the DB singleton
        reset_db_singleton()

        with patch('knowledge_etl.load.dedup._get_model') as mock_get_model:
            mock_model = MagicMock()
            mock_model.encode.return_value = fixed_emb
            mock_get_model.return_value = mock_model

            # Run 2: same item already in SQLite -> sim = 1.0 >= DEDUP_SIMILARITY_BLOCK
            run2 = deduplicate([item_x], [], db_path=db_path)
            assert len(run2) == 0, 'Run 2: same item must be blocked via SQLite cross-run'
