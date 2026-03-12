"""
Anthropic API wrapper with prompt caching, retry, and cost tracking.
This is the single point of contact with the Claude API across the pipeline.
"""

from __future__ import annotations

import logging
import os
from typing import Any

import anthropic
from anthropic import RateLimitError
from dotenv import load_dotenv
from tenacity import (
    before_sleep_log,
    retry,
    retry_if_exception,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from knowledge_etl.config import MODELS

logger = logging.getLogger(__name__)

load_dotenv()


class UsageStats:
    """Tracks token usage and estimated cost for a single API call."""

    # Prices per million tokens (USD) — as of Claude 4.x pricing
    PRICES: dict[str, dict[str, float]] = {
        "claude-opus-4-6": {
            "input": 15.00,
            "output": 75.00,
            "cache_write": 18.75,
            "cache_read": 1.50,
        },
        "claude-sonnet-4-6": {
            "input": 3.00,
            "output": 15.00,
            "cache_write": 3.75,
            "cache_read": 0.30,
        },
        "claude-haiku-4-5-20251001": {
            "input": 0.80,
            "output": 4.00,
            "cache_write": 1.00,
            "cache_read": 0.08,
        },
    }

    def __init__(
        self,
        model_id: str,
        input_tokens: int,
        output_tokens: int,
        cache_creation_tokens: int = 0,
        cache_read_tokens: int = 0,
    ) -> None:
        self.model_id = model_id
        self.input_tokens = input_tokens
        self.output_tokens = output_tokens
        self.cache_creation_tokens = cache_creation_tokens
        self.cache_read_tokens = cache_read_tokens
        self.cost_usd = self._calculate_cost()

    def _calculate_cost(self) -> float:
        p = self.PRICES.get(self.model_id, self.PRICES["claude-sonnet-4-6"])
        m = 1_000_000
        return (
            (self.input_tokens / m) * p["input"]
            + (self.output_tokens / m) * p["output"]
            + (self.cache_creation_tokens / m) * p["cache_write"]
            + (self.cache_read_tokens / m) * p["cache_read"]
        )

    def __repr__(self) -> str:
        return (
            f"UsageStats(in={self.input_tokens}, out={self.output_tokens}, "
            f"cache_write={self.cache_creation_tokens}, cache_read={self.cache_read_tokens}, "
            f"cost=${self.cost_usd:.4f})"
        )


class LLMClient:
    """
    Thin wrapper over the Anthropic SDK.

    Key feature: prompt caching for book content.
    When `book_content` is provided to a call, it's injected as a cached
    block in the user message — subsequent calls with the SAME book content
    reuse the cache at 10% of the input cost.

    Usage:
        client = LLMClient()
        text, usage = client.call(
            model="sonnet",
            system_prompt="You are an expert...",
            task_prompt="Extract L1 principles...",
            book_content=full_book_text,   # Cached across L1/L2/L3 passes
            max_tokens=4096,
        )
    """

    def __init__(self) -> None:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise EnvironmentError(
                "ANTHROPIC_API_KEY not found. Copy .env.example to .env and set it."
            )
        self.client = anthropic.Anthropic(api_key=api_key)

    @retry(
        retry=retry_if_exception_type(RateLimitError),
        wait=wait_exponential(multiplier=2, min=15, max=120),
        stop=stop_after_attempt(8),
        before_sleep=before_sleep_log(logger, logging.WARNING),
    )
    @retry(
        retry=retry_if_exception(lambda e: not isinstance(e, RateLimitError)),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=30),
        reraise=True,
    )
    def call(
        self,
        model: str,
        system_prompt: str,
        task_prompt: str,
        book_content: str | None = None,
        max_tokens: int = 4096,
        extra_messages: list[dict[str, Any]] | None = None,
    ) -> tuple[str, UsageStats]:
        """
        Call Claude with optional prompt caching for book content.

        Args:
            model: Key from MODELS dict ('opus', 'sonnet', 'haiku')
            system_prompt: System instructions (cached if large)
            task_prompt: The specific extraction task for this call
            book_content: Full book text — cached across passes
            max_tokens: Max output tokens
            extra_messages: Additional message history for multi-turn

        Returns:
            (response_text, usage_stats)
        """
        model_id = MODELS[model]

        # System with cache_control for large system prompts
        system: list[dict[str, Any]] = [
            {
                "type": "text",
                "text": system_prompt,
                "cache_control": {"type": "ephemeral"},
            }
        ]

        # Build user message content
        user_content: list[dict[str, Any]] = []

        if book_content:
            # Book content is the cache target — mark with cache_control
            user_content.append(
                {
                    "type": "text",
                    "text": f"<book>\n{book_content}\n</book>",
                    "cache_control": {"type": "ephemeral"},
                }
            )

        # Task prompt goes after the cached content (varies per pass)
        user_content.append({"type": "text", "text": task_prompt})

        messages: list[dict[str, Any]] = []
        if extra_messages:
            messages.extend(extra_messages)
        messages.append({"role": "user", "content": user_content})

        response = self.client.messages.create(
            model=model_id,
            max_tokens=max_tokens,
            system=system,
            messages=messages,
        )

        text = response.content[0].text
        usage = UsageStats(
            model_id=model_id,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
            cache_creation_tokens=getattr(
                response.usage, "cache_creation_input_tokens", 0
            ),
            cache_read_tokens=getattr(response.usage, "cache_read_input_tokens", 0),
        )
        return text, usage

    @retry(
        retry=retry_if_exception_type(RateLimitError),
        wait=wait_exponential(multiplier=2, min=15, max=120),
        stop=stop_after_attempt(8),
        before_sleep=before_sleep_log(logger, logging.WARNING),
    )
    @retry(
        retry=retry_if_exception(lambda e: not isinstance(e, RateLimitError)),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=30),
        reraise=True,
    )
    def call_structured(
        self,
        model: str,
        system_prompt: str,
        task_prompt: str,
        output_schema: dict,
        tool_name: str,
        book_content: str | None = None,
        max_tokens: int = 4096,
    ) -> tuple[dict, UsageStats]:
        """
        Calls Claude with forced tool_use — returns structured dict, never raises json.JSONDecodeError.
        Uses tool_choice={"type": "tool", "name": tool_name} to force structured response.

        Args:
            model: Key from MODELS dict ('opus', 'sonnet', 'haiku')
            system_prompt: System instructions
            task_prompt: The specific extraction task for this call
            output_schema: JSON Schema dict (from a Pydantic model's .model_json_schema())
            tool_name: Tool name (e.g. "extract_principles")
            book_content: Full book text — cached across passes with cache_control
            max_tokens: Max output tokens

        Returns:
            (result_dict, usage_stats) — result_dict is already parsed, no json.loads needed
        """
        model_id = MODELS[model]

        system: list[dict[str, Any]] = [
            {
                "type": "text",
                "text": system_prompt,
                "cache_control": {"type": "ephemeral"},
            }
        ]

        user_content: list[dict[str, Any]] = []
        if book_content:
            user_content.append(
                {
                    "type": "text",
                    "text": f"<book>\n{book_content}\n</book>",
                    "cache_control": {"type": "ephemeral"},
                }
            )
        user_content.append({"type": "text", "text": task_prompt})

        messages: list[dict[str, Any]] = [{"role": "user", "content": user_content}]

        response = self.client.messages.create(
            model=model_id,
            max_tokens=max_tokens,
            system=system,
            tools=[
                {
                    "name": tool_name,
                    "description": "Extract structured data from the provided content.",
                    "input_schema": output_schema,
                }
            ],
            tool_choice={"type": "tool", "name": tool_name},
            messages=messages,
        )

        tool_block = next((b for b in response.content if b.type == "tool_use"), None)
        if tool_block is None:
            raise ValueError(
                f"call_structured: expected tool_use block in response, "
                f"got: {[b.type for b in response.content]}"
            )

        result: dict = tool_block.input

        required_keys = output_schema.get("required", [])
        missing = [k for k in required_keys if k not in result]
        if missing:
            raise ValueError(
                f"call_structured: tool response missing required keys {missing}. "
                f"Got keys: {list(result.keys())}"
            )

        usage = UsageStats(
            model_id=model_id,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
            cache_creation_tokens=getattr(
                response.usage, "cache_creation_input_tokens", 0
            ),
            cache_read_tokens=getattr(response.usage, "cache_read_input_tokens", 0),
        )
        return result, usage

    def count_tokens(
        self,
        model: str,
        system_prompt: str,
        content: str,
    ) -> int:
        """Count tokens for a message without sending it (free API call)."""
        model_id = MODELS[model]
        response = self.client.messages.count_tokens(
            model=model_id,
            system=system_prompt,
            messages=[{"role": "user", "content": content}],
        )
        return response.input_tokens
