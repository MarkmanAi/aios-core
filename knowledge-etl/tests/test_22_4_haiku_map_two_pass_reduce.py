"""
Tests for Story 22.4 — Cost Optimization: Haiku for MAP + Two-Pass Reduce.

Covers:
  AC-1: DEFAULT_MODEL_L2_MAP = "haiku" in config; _extract_chapter() uses Haiku
  AC-2: Two-pass reduce with distinct checkpoint keys; Pass B failure graceful
  AC-3: Cost logging reads from cost_tracker (not hardcoded); 4-line summary present
"""

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from knowledge_etl.transform.l2_frameworks import (
    L2ReducePassA,
    L2ReducePassB,
    _extract_chapter,
    _reduce_pass,
    extract_l2,
)


# ─── Fixtures ─────────────────────────────────────────────────────────────────


@pytest.fixture
def reduce_template():
    return (
        "<system_prompt>You are a framework synthesizer.</system_prompt>\n"
        "Book: {{BOOK_TITLE}} by {{AUTHOR}}\n"
        "Chapters: {{TOTAL_CHAPTERS}}\n"
        "Data: {{JSON_ARRAY_OF_CHAPTER_RESULTS}}"
    )


@pytest.fixture
def prompt_template():
    return (
        "<system_prompt>You are a framework extractor.</system_prompt>\n"
        "{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} {{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{CHAPTER_PAGES}}"
    )


@pytest.fixture
def mock_checkpoint_miss():
    ckpt = MagicMock()
    ckpt.is_done.return_value = False
    ckpt.get_result.return_value = None
    return ckpt


@pytest.fixture
def l2_env(tmp_path):
    prompts_dir = tmp_path / "prompts"
    prompts_dir.mkdir()
    (prompts_dir / "l2_frameworks.xml").write_text(
        "<system_prompt>You are a framework extractor.</system_prompt>\n"
        "{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} {{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{CHAPTER_PAGES}}",
        encoding="utf-8",
    )
    (prompts_dir / "reduce_synthesis.xml").write_text(
        "<system_prompt>You are a synthesizer.</system_prompt>\n"
        "{{BOOK_TITLE}} {{AUTHOR}} {{TOTAL_CHAPTERS}} {{JSON_ARRAY_OF_CHAPTER_RESULTS}}",
        encoding="utf-8",
    )
    staging = tmp_path / "staging"
    staging.mkdir()
    return {"tmp": tmp_path, "prompts": prompts_dir, "staging": staging}


def _patched_extract_l2(l2_env: dict, llm: MagicMock, book_slug: str = "test-book") -> dict:
    mock_ckpt = MagicMock()
    mock_ckpt.is_done.return_value = False
    mock_ckpt.get_result.return_value = None

    with (
        patch("knowledge_etl.transform.l2_frameworks.STAGING", l2_env["staging"]),
        patch("knowledge_etl.transform.l2_frameworks.CHECKPOINTS", l2_env["tmp"] / "checkpoints"),
        patch("knowledge_etl.transform.l2_frameworks.PROMPTS_DIR", l2_env["prompts"]),
        patch("knowledge_etl.transform.l2_frameworks.Checkpoint", return_value=mock_ckpt),
    ):
        return extract_l2(
            book_slug=book_slug,
            full_text_path=l2_env["tmp"] / "full.txt",
            chapter_paths=[],
            metadata={"title": "Test Book", "author": "Test Author"},
            strategy="map-reduce",
            llm=llm,
            cost_tracker=MagicMock(entries=[]),
        )


# ─── AC-1: Haiku for MAP ──────────────────────────────────────────────────────


class TestHaikuForMap:
    def test_default_model_l2_map_constant_exists(self):
        """DEFAULT_MODEL_L2_MAP must be defined in config and resolve to a valid model.
        Reverted to 'sonnet' after AC-4 failure — constant retained for architectural separation.
        """
        from knowledge_etl.config import DEFAULT_MODEL_L2_MAP, MODELS
        assert DEFAULT_MODEL_L2_MAP in MODELS

    def test_default_model_l2_map_reverted_to_sonnet(self):
        """DEFAULT_MODEL_L2_MAP reverted to 'sonnet' after AC-4 quality check failed.
        Live run on thinking-in-systems: Haiku extracted 3/7 frameworks (43%) — below
        the 80% threshold (need >= 6). Stock-and-Flow, Balancing Loop, Reinforcing Loop
        were all missed. Sonnet is required for reliable MAP extraction.
        """
        from knowledge_etl.config import DEFAULT_MODEL_L2_MAP, MODELS
        assert DEFAULT_MODEL_L2_MAP == "sonnet"
        assert MODELS[DEFAULT_MODEL_L2_MAP] == "claude-sonnet-4-6"

    def test_default_model_l2_remains_sonnet(self):
        """DEFAULT_MODEL_L2 (for REDUCE) must remain 'sonnet' — unchanged by this story."""
        from knowledge_etl.config import DEFAULT_MODEL_L2
        assert DEFAULT_MODEL_L2 == "sonnet"

    def test_extract_chapter_uses_default_model_l2_map(self, tmp_path, prompt_template):
        """_extract_chapter() must call llm.call_structured with DEFAULT_MODEL_L2_MAP.
        Note: reverted to 'sonnet' after AC-4 failure — constant still used for separation of concerns.
        """
        from knowledge_etl.config import DEFAULT_MODEL_L2_MAP

        chapter_file = tmp_path / "01-intro.md"
        chapter_file.write_text("Chapter content.", encoding="utf-8")

        llm = MagicMock()
        llm.call_structured.return_value = (
            {"core_frameworks": [], "decision_heuristics": [], "anti_patterns": [], "trigger_questions": []},
            MagicMock(cost_usd=0.01),
        )
        cost_tracker = MagicMock()

        _extract_chapter(
            chapter_path=chapter_file,
            book_title="Test",
            author="Author",
            prompt_template=prompt_template,
            system="You are a framework extractor.",
            book_content=None,
            llm=llm,
            cost_tracker=cost_tracker,
        )

        call_kwargs = llm.call_structured.call_args[1]
        assert call_kwargs["model"] == DEFAULT_MODEL_L2_MAP

    def test_extract_chapter_records_l2_map_phase(self, tmp_path, prompt_template):
        """_extract_chapter() must record cost under phase 'l2_map'."""
        chapter_file = tmp_path / "01-intro.md"
        chapter_file.write_text("Chapter content.", encoding="utf-8")

        llm = MagicMock()
        llm.call_structured.return_value = (
            {"core_frameworks": [], "decision_heuristics": [], "anti_patterns": [], "trigger_questions": []},
            MagicMock(cost_usd=0.01),
        )
        cost_tracker = MagicMock()

        _extract_chapter(
            chapter_path=chapter_file,
            book_title="Test",
            author="Author",
            prompt_template=prompt_template,
            system="You are a framework extractor.",
            book_content=None,
            llm=llm,
            cost_tracker=cost_tracker,
        )

        cost_tracker.record.assert_called_once()
        phase = cost_tracker.record.call_args[0][0]
        assert phase == "l2_map"

    def test_reduce_pass_uses_sonnet(self, mock_checkpoint_miss, reduce_template):
        """_reduce_pass() must call llm with DEFAULT_MODEL_L2 (sonnet) — never haiku."""
        from knowledge_etl.config import DEFAULT_MODEL_L2

        llm = MagicMock()
        llm.call_structured.return_value = (
            {"unified_frameworks": [], "unified_heuristics": []},
            MagicMock(cost_usd=0.10),
        )
        cost_tracker = MagicMock()

        _reduce_pass(
            chapter_results=[],
            book_title="T",
            author="A",
            reduce_template=reduce_template,
            llm=llm,
            cost_tracker=cost_tracker,
            checkpoint=mock_checkpoint_miss,
            checkpoint_key="__reduce_a__",
            cost_phase="l2_reduce_a",
            output_schema=L2ReducePassA.model_json_schema(),
            tool_name="synthesize_frameworks_a",
        )

        call_kwargs = llm.call_structured.call_args[1]
        assert call_kwargs["model"] == DEFAULT_MODEL_L2


# ─── AC-2: Two-Pass Reduce ────────────────────────────────────────────────────


class TestTwoPassReduce:
    def test_pass_a_schema_has_frameworks_and_heuristics(self):
        """L2ReducePassA schema must include unified_frameworks and unified_heuristics."""
        schema = L2ReducePassA.model_json_schema()
        props = schema["properties"]
        assert "unified_frameworks" in props
        assert "unified_heuristics" in props
        assert "unified_anti_patterns" not in props
        assert "unified_trigger_questions" not in props

    def test_pass_b_schema_has_anti_patterns_and_triggers(self):
        """L2ReducePassB schema must include unified_anti_patterns and unified_trigger_questions."""
        schema = L2ReducePassB.model_json_schema()
        props = schema["properties"]
        assert "unified_anti_patterns" in props
        assert "unified_trigger_questions" in props
        assert "unified_frameworks" not in props
        assert "unified_heuristics" not in props

    def test_two_passes_produce_merged_output(self, l2_env):
        """extract_l2() must merge Pass A and Pass B into a single unified dict."""
        call_count = 0

        def side_effect(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:  # Pass A
                return (
                    {"unified_frameworks": [{"name": "CLD"}], "unified_heuristics": []},
                    MagicMock(cost_usd=0.10),
                )
            return (  # Pass B
                {"unified_anti_patterns": [{"mistake": "x"}], "unified_trigger_questions": []},
                MagicMock(cost_usd=0.08),
            )

        llm = MagicMock()
        llm.call_structured.side_effect = side_effect

        result = _patched_extract_l2(l2_env, llm)

        assert "unified_frameworks" in result
        assert "unified_anti_patterns" in result

    def test_pass_b_failure_preserves_pass_a(self, l2_env):
        """Pass B exception must not abort pipeline — Pass A frameworks must survive."""
        call_count = 0

        def side_effect(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                return (
                    {"unified_frameworks": [{"name": "CLD"}], "unified_heuristics": []},
                    MagicMock(cost_usd=0.05),
                )
            raise RuntimeError("Simulated Pass B failure")

        llm = MagicMock()
        llm.call_structured.side_effect = side_effect

        result = _patched_extract_l2(l2_env, llm)

        assert len(result["unified_frameworks"]) > 0
        assert result["unified_anti_patterns"] == []
        assert result["unified_trigger_questions"] == []

    def test_pass_b_failure_writes_output_file(self, l2_env):
        """final_frameworks.json must be written even when Pass B fails."""
        call_count = 0

        def side_effect(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                return (
                    {"unified_frameworks": [{"name": "CLD"}], "unified_heuristics": []},
                    MagicMock(cost_usd=0.05),
                )
            raise RuntimeError("Pass B down")

        llm = MagicMock()
        llm.call_structured.side_effect = side_effect

        _patched_extract_l2(l2_env, llm)

        output = l2_env["staging"] / "test-book" / "l2" / "final_frameworks.json"
        assert output.exists()
        data = json.loads(output.read_text())
        assert len(data["unified_frameworks"]) > 0

    def test_separate_checkpoint_keys_not_reduce(self, reduce_template, mock_checkpoint_miss):
        """__reduce__ (22.1 legacy key) must not be used — only __reduce_a__ and __reduce_b__."""
        llm = MagicMock()
        llm.call_structured.return_value = (
            {"unified_frameworks": [], "unified_heuristics": []},
            MagicMock(cost_usd=0.05),
        )

        _reduce_pass(
            chapter_results=[], book_title="T", author="A",
            reduce_template=reduce_template, llm=llm, cost_tracker=MagicMock(),
            checkpoint=mock_checkpoint_miss, checkpoint_key="__reduce_a__",
            cost_phase="l2_reduce_a", output_schema=L2ReducePassA.model_json_schema(),
            tool_name="synthesize_frameworks_a",
        )

        # Confirm __reduce__ (old key) was never used
        for call_args in mock_checkpoint_miss.mark_done.call_args_list:
            key = call_args[0][0]
            assert key != "__reduce__", "Legacy __reduce__ key must not be written"

    def test_each_pass_has_independent_token_budget(self, reduce_template):
        """Each _reduce_pass call must compute its own adaptive_max independently."""
        from knowledge_etl.config import ETL_SRC
        source = (ETL_SRC / "transform" / "l2_frameworks.py").read_text(encoding="utf-8")
        reduce_pass_start = source.find("def _reduce_pass(")
        reduce_pass_block = source[reduce_pass_start:]
        assert "adaptive_max" in reduce_pass_block, (
            "_reduce_pass() must compute adaptive_max independently for each pass"
        )


# ─── AC-3: Cost Logging ───────────────────────────────────────────────────────


class TestCostLogging:
    def test_cost_logging_reads_from_cost_tracker(self, l2_env, capsys):
        """Cost summary must read from cost_tracker.entries, not hardcoded values."""
        from unittest.mock import MagicMock, patch

        mock_ckpt = MagicMock()
        mock_ckpt.is_done.return_value = False
        mock_ckpt.get_result.return_value = None

        cost_tracker = MagicMock()
        cost_tracker.entries = [
            {"phase": "l2_map", "cost_usd": 0.07, "chapter": "ch01"},
            {"phase": "l2_map", "cost_usd": 0.05, "chapter": "ch02"},
            {"phase": "l2_reduce_a", "cost_usd": 0.12},
            {"phase": "l2_reduce_b", "cost_usd": 0.09},
        ]

        llm = MagicMock()
        llm.call_structured.return_value = (
            {"unified_frameworks": [{"name": "X"}], "unified_heuristics": [],
             "unified_anti_patterns": [], "unified_trigger_questions": []},
            MagicMock(cost_usd=0.0),
        )

        with (
            patch("knowledge_etl.transform.l2_frameworks.STAGING", l2_env["staging"]),
            patch("knowledge_etl.transform.l2_frameworks.CHECKPOINTS", l2_env["tmp"] / "checkpoints"),
            patch("knowledge_etl.transform.l2_frameworks.PROMPTS_DIR", l2_env["prompts"]),
            patch("knowledge_etl.transform.l2_frameworks.Checkpoint", return_value=mock_ckpt),
        ):
            extract_l2(
                book_slug="test-book",
                full_text_path=l2_env["tmp"] / "full.txt",
                chapter_paths=[],
                metadata={"title": "Test Book", "author": "Test Author"},
                strategy="map-reduce",
                llm=llm,
                cost_tracker=cost_tracker,
            )

        captured = capsys.readouterr()
        # The cost values from entries must appear in stdout
        assert "0.12" in captured.out  # map total (0.07 + 0.05)
        assert "0.12" in captured.out  # pass_a_cost
        assert "0.09" in captured.out  # pass_b_cost
        assert "vs ~$3.80 baseline" in captured.out

    def test_cost_log_labels_haiku_for_map(self, l2_env, capsys):
        """Cost log must label MAP phase as 'haiku' and REDUCE passes as 'sonnet'."""
        mock_ckpt = MagicMock()
        mock_ckpt.is_done.return_value = False
        mock_ckpt.get_result.return_value = None

        cost_tracker = MagicMock()
        cost_tracker.entries = []

        llm = MagicMock()
        llm.call_structured.return_value = (
            {"unified_frameworks": [], "unified_heuristics": [],
             "unified_anti_patterns": [], "unified_trigger_questions": []},
            MagicMock(cost_usd=0.0),
        )

        with (
            patch("knowledge_etl.transform.l2_frameworks.STAGING", l2_env["staging"]),
            patch("knowledge_etl.transform.l2_frameworks.CHECKPOINTS", l2_env["tmp"] / "checkpoints"),
            patch("knowledge_etl.transform.l2_frameworks.PROMPTS_DIR", l2_env["prompts"]),
            patch("knowledge_etl.transform.l2_frameworks.Checkpoint", return_value=mock_ckpt),
        ):
            extract_l2(
                book_slug="test-book",
                full_text_path=l2_env["tmp"] / "full.txt",
                chapter_paths=[],
                metadata={"title": "Test Book", "author": "Test Author"},
                strategy="map-reduce",
                llm=llm,
                cost_tracker=cost_tracker,
            )

        captured = capsys.readouterr()
        assert "L2 MAP (haiku)" in captured.out
        assert "L2 REDUCE Pass A (sonnet)" in captured.out
        assert "L2 REDUCE Pass B (sonnet)" in captured.out
        assert "L2 total" in captured.out
