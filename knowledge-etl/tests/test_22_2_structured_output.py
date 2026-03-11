"""
Tests for Story 22.2 — Structured Output via Tool Use.

Covers:
  AC-1: call_structured() returns (dict, UsageStats) from a forced tool_use response
  AC-1: call_structured() raises ValueError when required schema keys are missing
  AC-1: tool_choice is always {"type": "tool", "name": tool_name}
  AC-1: book_content uses cache_control: ephemeral (prompt caching preserved)
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from knowledge_etl.utils.llm import LLMClient, UsageStats


# ─── Helpers ──────────────────────────────────────────────────────────────────


def _make_client() -> LLMClient:
    """Create LLMClient bypassing API key check."""
    with patch.dict("os.environ", {"ANTHROPIC_API_KEY": "test-key"}):
        return LLMClient()


def _make_tool_response(tool_input: dict) -> MagicMock:
    """Build a mock Anthropic messages.create response with a single tool_use block."""
    tool_block = MagicMock()
    tool_block.type = "tool_use"
    tool_block.input = tool_input

    response = MagicMock()
    response.content = [tool_block]
    response.usage.input_tokens = 100
    response.usage.output_tokens = 50
    response.usage.cache_creation_input_tokens = 0
    response.usage.cache_read_input_tokens = 0
    return response


# ─── AC-1: call_structured returns correct dict + UsageStats ──────────────────


class TestCallStructuredSuccess:
    def test_returns_dict_and_usage_stats(self):
        """call_structured returns (dict, UsageStats) on a valid tool_use response."""
        expected = {"principles": [{"principle": "Think in systems", "action": "map flows"}]}
        schema = {"type": "object", "properties": {"principles": {"type": "array"}}}

        client = _make_client()
        mock_response = _make_tool_response(expected)

        with patch.object(client.client.messages, "create", return_value=mock_response):
            result, usage = client.call_structured(
                model="sonnet",
                system_prompt="You are an extractor.",
                task_prompt="Extract principles.",
                output_schema=schema,
                tool_name="extract_principles",
            )

        assert result == expected
        assert isinstance(usage, UsageStats)
        assert usage.input_tokens == 100
        assert usage.output_tokens == 50

    def test_returns_correct_dict_content(self):
        """Result dict matches exactly what the tool_use block returned."""
        payload = {"unified_frameworks": [{"name": "CLD"}, {"name": "DSRP"}]}
        schema = {"type": "object", "properties": {}}

        client = _make_client()
        with patch.object(client.client.messages, "create", return_value=_make_tool_response(payload)):
            result, _ = client.call_structured(
                model="sonnet",
                system_prompt="Sys.",
                task_prompt="Task.",
                output_schema=schema,
                tool_name="synthesize_frameworks",
            )

        assert len(result["unified_frameworks"]) == 2
        assert result["unified_frameworks"][0]["name"] == "CLD"


# ─── AC-1: ValueError on schema mismatch ──────────────────────────────────────


class TestCallStructuredSchemaValidation:
    def test_raises_value_error_when_required_key_missing(self):
        """ValueError raised when tool response is missing a required key."""
        schema = {
            "type": "object",
            "properties": {
                "principles": {"type": "array"},
                "metadata": {"type": "object"},
            },
            "required": ["principles", "metadata"],
        }
        # Response is missing "metadata"
        incomplete = {"principles": []}

        client = _make_client()
        with patch.object(client.client.messages, "create", return_value=_make_tool_response(incomplete)):
            with pytest.raises(ValueError, match="missing required keys"):
                client.call_structured(
                    model="sonnet",
                    system_prompt="Sys.",
                    task_prompt="Task.",
                    output_schema=schema,
                    tool_name="extract",
                )

    def test_error_message_names_missing_keys(self):
        """ValueError message includes the name of the missing key."""
        schema = {
            "type": "object",
            "properties": {"result": {"type": "string"}},
            "required": ["result"],
        }
        client = _make_client()
        with patch.object(client.client.messages, "create", return_value=_make_tool_response({})):
            with pytest.raises(ValueError, match="result"):
                client.call_structured(
                    model="sonnet",
                    system_prompt="Sys.",
                    task_prompt="Task.",
                    output_schema=schema,
                    tool_name="extract",
                )

    def test_no_required_keys_does_not_raise(self):
        """Schema without 'required' field never raises ValueError."""
        schema = {"type": "object", "properties": {"optional_field": {"type": "string"}}}
        client = _make_client()
        with patch.object(client.client.messages, "create", return_value=_make_tool_response({})):
            result, _ = client.call_structured(
                model="sonnet",
                system_prompt="Sys.",
                task_prompt="Task.",
                output_schema=schema,
                tool_name="extract",
            )
        assert result == {}


# ─── AC-1: tool_choice is always forced ───────────────────────────────────────


class TestCallStructuredToolChoice:
    def test_tool_choice_is_forced_by_name(self):
        """API call always uses tool_choice={"type": "tool", "name": tool_name}."""
        schema = {"type": "object", "properties": {}}
        client = _make_client()

        with patch.object(
            client.client.messages, "create", return_value=_make_tool_response({})
        ) as mock_create:
            client.call_structured(
                model="sonnet",
                system_prompt="Sys.",
                task_prompt="Task.",
                output_schema=schema,
                tool_name="my_extraction_tool",
            )

        call_kwargs = mock_create.call_args[1]
        assert call_kwargs["tool_choice"] == {"type": "tool", "name": "my_extraction_tool"}

    def test_tool_name_propagated_to_tools_list(self):
        """tool_name is used as the name in the tools array."""
        schema = {"type": "object", "properties": {}}
        client = _make_client()

        with patch.object(
            client.client.messages, "create", return_value=_make_tool_response({})
        ) as mock_create:
            client.call_structured(
                model="sonnet",
                system_prompt="Sys.",
                task_prompt="Task.",
                output_schema=schema,
                tool_name="extract_voice_dna",
            )

        call_kwargs = mock_create.call_args[1]
        tools = call_kwargs["tools"]
        assert len(tools) == 1
        assert tools[0]["name"] == "extract_voice_dna"


# ─── AC-1: prompt caching preserved ──────────────────────────────────────────


class TestCallStructuredPromptCaching:
    def test_book_content_uses_cache_control_ephemeral(self):
        """When book_content is provided, it has cache_control: {"type": "ephemeral"}."""
        schema = {"type": "object", "properties": {}}
        client = _make_client()

        with patch.object(
            client.client.messages, "create", return_value=_make_tool_response({})
        ) as mock_create:
            client.call_structured(
                model="sonnet",
                system_prompt="Sys.",
                task_prompt="Task.",
                output_schema=schema,
                tool_name="extract",
                book_content="Chapter one content here.",
            )

        call_kwargs = mock_create.call_args[1]
        user_content = call_kwargs["messages"][0]["content"]
        # First block = book content with cache_control
        book_block = user_content[0]
        assert book_block["type"] == "text"
        assert "cache_control" in book_block
        assert book_block["cache_control"] == {"type": "ephemeral"}
        assert "Chapter one content here." in book_block["text"]

    def test_task_prompt_is_second_block_when_book_content_present(self):
        """task_prompt comes after the cached book block."""
        schema = {"type": "object", "properties": {}}
        client = _make_client()

        with patch.object(
            client.client.messages, "create", return_value=_make_tool_response({})
        ) as mock_create:
            client.call_structured(
                model="sonnet",
                system_prompt="Sys.",
                task_prompt="Extract everything.",
                output_schema=schema,
                tool_name="extract",
                book_content="Book text.",
            )

        call_kwargs = mock_create.call_args[1]
        user_content = call_kwargs["messages"][0]["content"]
        assert len(user_content) == 2
        assert user_content[1]["text"] == "Extract everything."
        assert "cache_control" not in user_content[1]

    def test_no_book_content_sends_single_user_block(self):
        """Without book_content, only the task_prompt block is sent."""
        schema = {"type": "object", "properties": {}}
        client = _make_client()

        with patch.object(
            client.client.messages, "create", return_value=_make_tool_response({})
        ) as mock_create:
            client.call_structured(
                model="sonnet",
                system_prompt="Sys.",
                task_prompt="Just the task.",
                output_schema=schema,
                tool_name="extract",
            )

        call_kwargs = mock_create.call_args[1]
        user_content = call_kwargs["messages"][0]["content"]
        assert len(user_content) == 1
        assert user_content[0]["text"] == "Just the task."
