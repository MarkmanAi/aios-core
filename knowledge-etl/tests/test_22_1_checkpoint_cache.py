"""
Tests for Story 22.1 — Checkpoint Integrity + Cache Validation.
Updated for Story 22.4 — two-pass reduce replaces _reduce().

Covers:
  AC-1 (22.4): _reduce_pass() reads/writes per-pass checkpoint keys (__reduce_a__, __reduce_b__)
  AC-2: extract_l2() rejects zero-framework cache files
  AC-3: extract_l1() rejects zero-principle cache files
  AC-4: Valid cache hits pass through unchanged (no regression)
"""

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import MagicMock, call, patch

import pytest

from knowledge_etl.transform.l1_principles import extract_l1
from knowledge_etl.transform.l2_frameworks import (
    L2ReducePassA,
    L2ReducePassB,
    _reduce_pass,
    extract_l2,
)


# ─── Fixtures ─────────────────────────────────────────────────────────────────


@pytest.fixture
def mock_llm_reduce():
    """LLM that returns a valid reduce result."""
    llm = MagicMock()
    llm.call_structured.return_value = (
        {"unified_frameworks": [{"name": "CLD", "type": "explicit",
          "description": "Causal loop diagrams", "source_quote": "quote"}]},
        MagicMock(cost_usd=0.05),
    )
    return llm


@pytest.fixture
def mock_cost_tracker():
    return MagicMock()


@pytest.fixture
def reduce_template():
    return (
        "<system_prompt>You are a framework synthesizer.</system_prompt>\n"
        "Book: {{BOOK_TITLE}} by {{AUTHOR}}\n"
        "Chapters: {{TOTAL_CHAPTERS}}\n"
        "Data: {{JSON_ARRAY_OF_CHAPTER_RESULTS}}"
    )


@pytest.fixture
def mock_checkpoint_miss():
    """Checkpoint with no reduce result (cache miss)."""
    ckpt = MagicMock()
    ckpt.get_result.return_value = None
    return ckpt


@pytest.fixture
def mock_checkpoint_valid_hit():
    """Checkpoint with a valid reduce result (cache hit)."""
    ckpt = MagicMock()
    ckpt.get_result.return_value = {
        "unified_frameworks": [{"name": "CLD"}],
        "core_frameworks": [],
    }
    return ckpt



# ─── AC-1 (22.4): _reduce_pass() checkpoint behaviour ────────────────────────


class TestReducePass:
    def test_checkpoint_hit_skips_api_call(
        self, mock_checkpoint_valid_hit, mock_llm_reduce, mock_cost_tracker, reduce_template
    ):
        """Valid checkpoint hit: llm.call must NOT be called."""
        result = _reduce_pass(
            chapter_results=[],
            book_title="Thinking in Systems",
            author="Meadows",
            reduce_template=reduce_template,
            llm=mock_llm_reduce,
            cost_tracker=mock_cost_tracker,
            checkpoint=mock_checkpoint_valid_hit,
            checkpoint_key="__reduce_a__",
            cost_phase="l2_reduce_a",
            output_schema=L2ReducePassA.model_json_schema(),
            tool_name="synthesize_frameworks_a",
        )

        mock_llm_reduce.call_structured.assert_not_called()
        assert result["unified_frameworks"][0]["name"] == "CLD"

    def test_checkpoint_miss_calls_api(
        self, mock_checkpoint_miss, mock_llm_reduce, mock_cost_tracker, reduce_template
    ):
        """Cache miss: llm.call_structured must be invoked."""
        _reduce_pass(
            chapter_results=[],
            book_title="Test Book",
            author="Author",
            reduce_template=reduce_template,
            llm=mock_llm_reduce,
            cost_tracker=mock_cost_tracker,
            checkpoint=mock_checkpoint_miss,
            checkpoint_key="__reduce_a__",
            cost_phase="l2_reduce_a",
            output_schema=L2ReducePassA.model_json_schema(),
            tool_name="synthesize_frameworks_a",
        )

        mock_llm_reduce.call_structured.assert_called_once()

    def test_pass_a_checkpoint_key(
        self, mock_checkpoint_miss, mock_llm_reduce, mock_cost_tracker, reduce_template
    ):
        """Pass A must persist result under __reduce_a__ key."""
        _reduce_pass(
            chapter_results=[],
            book_title="Test Book",
            author="Author",
            reduce_template=reduce_template,
            llm=mock_llm_reduce,
            cost_tracker=mock_cost_tracker,
            checkpoint=mock_checkpoint_miss,
            checkpoint_key="__reduce_a__",
            cost_phase="l2_reduce_a",
            output_schema=L2ReducePassA.model_json_schema(),
            tool_name="synthesize_frameworks_a",
        )

        mock_checkpoint_miss.mark_done.assert_called_once()
        key = mock_checkpoint_miss.mark_done.call_args[0][0]
        assert key == "__reduce_a__"

    def test_pass_b_checkpoint_key(
        self, mock_checkpoint_miss, mock_llm_reduce, mock_cost_tracker, reduce_template
    ):
        """Pass B must persist result under __reduce_b__ key (distinct from Pass A)."""
        _reduce_pass(
            chapter_results=[],
            book_title="Test Book",
            author="Author",
            reduce_template=reduce_template,
            llm=mock_llm_reduce,
            cost_tracker=mock_cost_tracker,
            checkpoint=mock_checkpoint_miss,
            checkpoint_key="__reduce_b__",
            cost_phase="l2_reduce_b",
            output_schema=L2ReducePassB.model_json_schema(),
            tool_name="synthesize_frameworks_b",
        )

        key = mock_checkpoint_miss.mark_done.call_args[0][0]
        assert key == "__reduce_b__"

    def test_mark_done_uses_correct_cost(
        self, mock_checkpoint_miss, mock_cost_tracker, reduce_template
    ):
        """mark_done must pass cost_usd from usage, not a hardcoded value."""
        llm = MagicMock()
        llm.call_structured.return_value = (
            {"unified_frameworks": [{"name": "F"}]},
            MagicMock(cost_usd=0.123),
        )
        _reduce_pass(
            chapter_results=[],
            book_title="T",
            author="A",
            reduce_template=reduce_template,
            llm=llm,
            cost_tracker=mock_cost_tracker,
            checkpoint=mock_checkpoint_miss,
            checkpoint_key="__reduce_a__",
            cost_phase="l2_reduce_a",
            output_schema=L2ReducePassA.model_json_schema(),
            tool_name="synthesize_frameworks_a",
        )

        kwargs = mock_checkpoint_miss.mark_done.call_args[1]
        assert kwargs.get("cost_usd") == pytest.approx(0.123)


# ─── AC-2: L2 cache validation ────────────────────────────────────────────────


@pytest.fixture
def l2_env(tmp_path):
    """Sets up a fake L2 staging area and prompt templates."""
    # Prompt templates
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

    # Staging directory
    staging = tmp_path / "staging"
    staging.mkdir()

    return {"tmp": tmp_path, "prompts": prompts_dir, "staging": staging}


def _make_l2_cache(l2_env: dict, book_slug: str, data: dict) -> Path:
    """Write a fake l2 cache file and return its path."""
    l2_dir = l2_env["staging"] / book_slug / "l2"
    l2_dir.mkdir(parents=True, exist_ok=True)
    cache = l2_dir / "final_frameworks.json"
    cache.write_text(json.dumps(data), encoding="utf-8")
    return cache


def _patched_extract_l2(l2_env: dict, llm: MagicMock, book_slug: str = "test-book") -> dict:
    """Call extract_l2() with all filesystem paths patched to l2_env."""
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
            chapter_paths=[],  # no chapters — only tests cache/reduce path
            metadata={"title": "Test Book", "author": "Test Author"},
            strategy="map-reduce",
            llm=llm,
            cost_tracker=MagicMock(),
        )


class TestL2CacheValidation:
    def test_invalid_cache_deleted(self, l2_env, mock_llm_reduce):
        """Zero-framework cache must be deleted before re-running."""
        cache = _make_l2_cache(l2_env, "test-book", {"unified_frameworks": [], "core_frameworks": []})
        assert cache.exists()

        _patched_extract_l2(l2_env, mock_llm_reduce)

        # After detection of invalid cache, the file was deleted then re-created
        # (the reduce wrote a new one). The key check: llm.call_structured was invoked.
        mock_llm_reduce.call_structured.assert_called()

    def test_invalid_cache_triggers_rerun(self, l2_env, mock_llm_reduce):
        """Zero-framework cache must trigger a full re-run (both reduce passes called)."""
        _make_l2_cache(l2_env, "test-book", {"unified_frameworks": [], "core_frameworks": []})

        _patched_extract_l2(l2_env, mock_llm_reduce)

        # Two-pass reduce: Pass A + Pass B = 2 call_structured invocations
        assert mock_llm_reduce.call_structured.call_count == 2

    def test_valid_cache_returns_immediately(self, l2_env):
        """Valid cache (> 0 frameworks) must be returned without any API call."""
        valid_data = {"unified_frameworks": [{"name": "CLD"}], "core_frameworks": []}
        _make_l2_cache(l2_env, "test-book", valid_data)

        llm = MagicMock()
        result = _patched_extract_l2(l2_env, llm)

        llm.call_structured.assert_not_called()
        assert result["unified_frameworks"][0]["name"] == "CLD"

    def test_valid_cache_via_core_frameworks(self, l2_env):
        """Cache with core_frameworks > 0 (but no unified_frameworks) is also valid."""
        valid_data = {"unified_frameworks": [], "core_frameworks": [{"name": "System"}]}
        _make_l2_cache(l2_env, "test-book", valid_data)

        llm = MagicMock()
        _patched_extract_l2(l2_env, llm)

        llm.call_structured.assert_not_called()


# ─── AC-2 (22.4): Pass B failure behaviour ───────────────────────────────────


class TestPassBFailure:
    def test_pass_b_failure_preserves_pass_a(self, l2_env):
        """Pass B exception must not abort pipeline — Pass A result must be preserved."""
        call_count = 0

        def side_effect(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:  # Pass A succeeds
                return (
                    {"unified_frameworks": [{"name": "CLD"}], "unified_heuristics": []},
                    MagicMock(cost_usd=0.05),
                )
            raise RuntimeError("Simulated Pass B API failure")

        llm = MagicMock()
        llm.call_structured.side_effect = side_effect

        result = _patched_extract_l2(l2_env, llm)

        assert len(result["unified_frameworks"]) > 0
        assert result["unified_anti_patterns"] == []
        assert result["unified_trigger_questions"] == []

    def test_pass_b_failure_does_not_lose_pass_a_to_disk(self, l2_env):
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

        output_file = l2_env["staging"] / "test-book" / "l2" / "final_frameworks.json"
        assert output_file.exists()
        data = json.loads(output_file.read_text())
        assert len(data["unified_frameworks"]) > 0


# ─── AC-3: L1 cache validation ────────────────────────────────────────────────


@pytest.fixture
def l1_env(tmp_path):
    """Sets up a fake L1 staging area and prompt templates."""
    prompts_dir = tmp_path / "prompts"
    prompts_dir.mkdir()
    (prompts_dir / "l1_principles.xml").write_text(
        "<system_prompt>You are a principle extractor.</system_prompt>\n"
        "{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} {{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{CHAPTER_PAGES}}",
        encoding="utf-8",
    )
    staging = tmp_path / "staging"
    staging.mkdir()
    return {"tmp": tmp_path, "prompts": prompts_dir, "staging": staging}


def _make_l1_cache(l1_env: dict, book_slug: str, principles: list) -> Path:
    l1_dir = l1_env["staging"] / book_slug / "l1"
    l1_dir.mkdir(parents=True, exist_ok=True)
    cache = l1_dir / "final_principles.json"
    cache.write_text(json.dumps({"principles": principles}), encoding="utf-8")
    return cache


def _patched_extract_l1(l1_env: dict, llm: MagicMock, book_slug: str = "test-book") -> list:
    """Call extract_l1() with all filesystem paths patched to l1_env."""
    mock_ckpt = MagicMock()
    mock_ckpt.is_done.return_value = False

    with (
        patch("knowledge_etl.transform.l1_principles.STAGING", l1_env["staging"]),
        patch("knowledge_etl.transform.l1_principles.CHECKPOINTS", l1_env["tmp"] / "checkpoints"),
        patch("knowledge_etl.transform.l1_principles.PROMPTS_DIR", l1_env["prompts"]),
        patch("knowledge_etl.transform.l1_principles.Checkpoint", return_value=mock_ckpt),
    ):
        return extract_l1(
            book_slug=book_slug,
            full_text_path=l1_env["tmp"] / "full.txt",
            chapter_paths=[],  # no chapters — only tests cache path
            metadata={"title": "Test Book", "author": "Test Author"},
            strategy="map-reduce",
            llm=llm,
            cost_tracker=MagicMock(),
        )


class TestL1CacheValidation:
    def test_invalid_cache_file_deleted(self, l1_env):
        """Zero-principle cache file must be deleted (unlink called) on invalid cache."""
        _make_l1_cache(l1_env, "test-book", [])

        with patch("pathlib.Path.unlink") as mock_unlink, patch(
            "knowledge_etl.transform.l1_principles._extract_map_reduce", return_value=[]
        ):
            _patched_extract_l1(l1_env, MagicMock())

        mock_unlink.assert_called_once()

    def test_invalid_cache_triggers_rerun(self, l1_env):
        """Zero-principle cache must trigger _extract_map_reduce (not silent cache hit)."""
        _make_l1_cache(l1_env, "test-book", [])

        with patch(
            "knowledge_etl.transform.l1_principles._extract_map_reduce", return_value=[]
        ) as mock_mr:
            _patched_extract_l1(l1_env, MagicMock())

        mock_mr.assert_called_once()

    def test_valid_cache_returns_immediately(self, l1_env):
        """Cache with > 0 principles must be returned without any API call."""
        principles = [{"principle": "Think in systems", "action": "map flows", "attribution": "Meadows",
                       "source_quote": "quote", "chapter_ref": "ch01"}]
        _make_l1_cache(l1_env, "test-book", principles)

        llm = MagicMock()
        result = _patched_extract_l1(l1_env, llm)

        llm.call_structured.assert_not_called()
        assert len(result) == 1
        assert result[0]["principle"] == "Think in systems"

    def test_valid_cache_no_file_deletion(self, l1_env):
        """Valid cache file must NOT be deleted."""
        principles = [{"principle": "P", "action": "A", "attribution": "B",
                       "source_quote": "Q", "chapter_ref": "ch01"}]
        cache = _make_l1_cache(l1_env, "test-book", principles)

        _patched_extract_l1(l1_env, MagicMock())

        assert cache.exists()
