"""Tests for l3_authorial.py — P4 cache fix (Story 8.2)."""

from __future__ import annotations

from pathlib import Path
from unittest.mock import MagicMock, call, patch

import pytest

from knowledge_etl.transform.l3_authorial import _refine_thinking, _refine_voice


# ─── Fixtures ────────────────────────────────────────────────────────────────


@pytest.fixture
def mock_llm():
    llm = MagicMock()
    llm.call_structured.return_value = (
        {
            "writing_style_patterns": ["pattern1"],
            "signature_vocabulary": ["test"],
            "sentence_structure": "short declarative",
            "rhetorical_devices": [],
            "pedagogical_approach": "example-first",
            "exemplar_quotes": [],
            "chapter_observations": "first chapter",
        },
        MagicMock(cost_usd=0.01),
    )
    return llm


@pytest.fixture
def mock_cost_tracker():
    return MagicMock()


@pytest.fixture
def mock_checkpoint(tmp_path):
    ckpt = MagicMock()
    ckpt.is_done.return_value = False
    ckpt.get_result.return_value = None
    return ckpt


@pytest.fixture
def chapter_file(tmp_path):
    ch = tmp_path / "01-intro.md"
    ch.write_text("Chapter content here.", encoding="utf-8")
    return ch


@pytest.fixture
def voice_template():
    return (
        "<system_prompt>You are a voice analyst.</system_prompt>\n"
        "<user_prompt>{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} "
        "{{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{PRIOR_PROFILE}}</user_prompt>"
    )


@pytest.fixture
def thinking_template():
    return (
        "<system_prompt>You are a thinking analyst.</system_prompt>\n"
        "<user_prompt>{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} "
        "{{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{PRIOR_PROFILE}}</user_prompt>"
    )


# ─── P4 tests: _refine_voice ─────────────────────────────────────────────────


class TestRefineVoiceCache:
    def test_passes_book_content_when_provided(
        self,
        tmp_path,
        mock_llm,
        mock_cost_tracker,
        mock_checkpoint,
        chapter_file,
        voice_template,
    ):
        """When book_content is provided, llm.call() receives it."""
        book_content = "Full book text for caching."

        _refine_voice(
            chapter_paths=[chapter_file],
            book_title="Test Book",
            author="Test Author",
            template=voice_template,
            llm=mock_llm,
            cost_tracker=mock_cost_tracker,
            model="claude-opus-4-6",
            checkpoint=mock_checkpoint,
            l3_dir=tmp_path,
            book_content=book_content,
        )

        mock_llm.call_structured.assert_called_once()
        _, kwargs = mock_llm.call_structured.call_args
        assert kwargs["book_content"] == book_content

    def test_passes_none_when_no_book_content(
        self,
        tmp_path,
        mock_llm,
        mock_cost_tracker,
        mock_checkpoint,
        chapter_file,
        voice_template,
    ):
        """When book_content is None (map-reduce), llm.call_structured() receives None."""
        _refine_voice(
            chapter_paths=[chapter_file],
            book_title="Test Book",
            author="Test Author",
            template=voice_template,
            llm=mock_llm,
            cost_tracker=mock_cost_tracker,
            model="claude-opus-4-6",
            checkpoint=mock_checkpoint,
            l3_dir=tmp_path,
            book_content=None,
        )

        mock_llm.call_structured.assert_called_once()
        _, kwargs = mock_llm.call_structured.call_args
        assert kwargs["book_content"] is None

    def test_default_book_content_is_none(
        self,
        tmp_path,
        mock_llm,
        mock_cost_tracker,
        mock_checkpoint,
        chapter_file,
        voice_template,
    ):
        """Default signature: book_content=None preserves backward compatibility."""
        _refine_voice(
            chapter_paths=[chapter_file],
            book_title="Test Book",
            author="Test Author",
            template=voice_template,
            llm=mock_llm,
            cost_tracker=mock_cost_tracker,
            model="claude-opus-4-6",
            checkpoint=mock_checkpoint,
            l3_dir=tmp_path,
        )

        _, kwargs = mock_llm.call_structured.call_args
        assert kwargs["book_content"] is None


# ─── P4 tests: _refine_thinking ──────────────────────────────────────────────


class TestRefineThinkingCache:
    def test_passes_book_content_when_provided(
        self,
        tmp_path,
        mock_cost_tracker,
        mock_checkpoint,
        chapter_file,
        thinking_template,
    ):
        """When book_content is provided, llm.call() receives it."""
        llm = MagicMock()
        llm.call_structured.return_value = (
            {
                "primary_reasoning_pattern": "dialectical",
                "favorite_argumentative_move": "reframe",
                "mental_models": [],
                "epistemic_style": "assertive",
                "favorite_analogies": [],
                "exemplar_reasoning_quote": "test",
            },
            MagicMock(cost_usd=0.01),
        )
        book_content = "Full book text."

        _refine_thinking(
            chapter_paths=[chapter_file],
            book_title="Test Book",
            author="Test Author",
            template=thinking_template,
            llm=llm,
            cost_tracker=mock_cost_tracker,
            model="claude-opus-4-6",
            checkpoint=mock_checkpoint,
            l3_dir=tmp_path,
            book_content=book_content,
        )

        llm.call_structured.assert_called_once()
        _, kwargs = llm.call_structured.call_args
        assert kwargs["book_content"] == book_content

    def test_passes_none_for_map_reduce(
        self,
        tmp_path,
        mock_cost_tracker,
        mock_checkpoint,
        chapter_file,
        thinking_template,
    ):
        """map-reduce strategy: book_content=None."""
        llm = MagicMock()
        llm.call_structured.return_value = (
            {"primary_reasoning_pattern": "", "mental_models": []},
            MagicMock(cost_usd=0.01),
        )

        _refine_thinking(
            chapter_paths=[chapter_file],
            book_title="Test Book",
            author="Test Author",
            template=thinking_template,
            llm=llm,
            cost_tracker=mock_cost_tracker,
            model="claude-opus-4-6",
            checkpoint=mock_checkpoint,
            l3_dir=tmp_path,
            book_content=None,
        )

        _, kwargs = llm.call_structured.call_args
        assert kwargs["book_content"] is None


# ─── P4 tests: extract_l3 strategy routing ───────────────────────────────────


class TestExtractL3StrategyRouting:
    def test_stuff_strategy_loads_book_content(self, tmp_path):
        """extract_l3 with strategy='stuff' reads full_text and passes to refiners."""
        from knowledge_etl.transform.l3_authorial import extract_l3

        full_text = tmp_path / "full_text.md"
        full_text.write_text("Full book content.", encoding="utf-8")

        llm = MagicMock()
        llm.call_structured.return_value = (
            {"productive_contradictions": [], "writing_style_patterns": []},
            MagicMock(cost_usd=0.01),
        )
        cost_tracker = MagicMock()

        with patch(
            "knowledge_etl.transform.l3_authorial.STAGING", tmp_path
        ), patch(
            "knowledge_etl.transform.l3_authorial.PROMPTS_DIR", tmp_path
        ), patch(
            "knowledge_etl.transform.l3_authorial.Checkpoint"
        ) as MockCkpt:
            # Create minimal template files
            for name in ("l3_voice_dna.xml", "l3_thinking_dna.xml", "l3_contradictions.xml"):
                (tmp_path / name).write_text(
                    "<system_prompt>sys</system_prompt>"
                    "<user_prompt>{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} "
                    "{{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{PRIOR_PROFILE}} {{FULL_BOOK_TEXT}}</user_prompt>",
                    encoding="utf-8",
                )
            MockCkpt.return_value.is_done.return_value = False
            MockCkpt.return_value.get_result.return_value = None

            extract_l3(
                book_slug="test-book",
                full_text_path=full_text,
                chapter_paths=[],
                metadata={"title": "Test", "author": "Author"},
                llm=llm,
                cost_tracker=cost_tracker,
                strategy="stuff",
            )

        # With no chapters, only the contradictions call fires (which uses book_content).
        for c in llm.call_structured.call_args_list:
            _, kwargs = c
            assert kwargs.get("book_content") == "Full book content."

    def test_map_reduce_strategy_passes_none(self, tmp_path):
        """extract_l3 with strategy='map-reduce' passes book_content=None."""
        from knowledge_etl.transform.l3_authorial import extract_l3

        full_text = tmp_path / "full_text.md"
        full_text.write_text("Full book content.", encoding="utf-8")

        llm = MagicMock()
        llm.call_structured.return_value = (
            {"productive_contradictions": [], "writing_style_patterns": []},
            MagicMock(cost_usd=0.01),
        )
        cost_tracker = MagicMock()

        with patch(
            "knowledge_etl.transform.l3_authorial.STAGING", tmp_path
        ), patch(
            "knowledge_etl.transform.l3_authorial.PROMPTS_DIR", tmp_path
        ), patch(
            "knowledge_etl.transform.l3_authorial.Checkpoint"
        ) as MockCkpt:
            for name in ("l3_voice_dna.xml", "l3_thinking_dna.xml", "l3_contradictions.xml"):
                (tmp_path / name).write_text(
                    "<system_prompt>sys</system_prompt>"
                    "<user_prompt>{{BOOK_TITLE}} {{AUTHOR}} {{CHAPTER_NUM}} "
                    "{{CHAPTER_TITLE}} {{CHAPTER_TEXT}} {{PRIOR_PROFILE}} {{FULL_BOOK_TEXT}}</user_prompt>",
                    encoding="utf-8",
                )
            MockCkpt.return_value.is_done.return_value = False
            MockCkpt.return_value.get_result.return_value = None

            extract_l3(
                book_slug="test-book",
                full_text_path=full_text,
                chapter_paths=[],
                metadata={"title": "Test", "author": "Author"},
                llm=llm,
                cost_tracker=cost_tracker,
                strategy="map-reduce",
            )

        # With no chapters, only the contradictions call fires (always uses book_content).
        for c in llm.call_structured.call_args_list:
            _, kwargs = c
            assert kwargs.get("book_content") == "Full book content."  # contradictions
