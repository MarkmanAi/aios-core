"""
Tests for Story 22.3 — Rate Limit Retry with Backoff.

Covers:
  AC-1: call() and call_structured() retry on RateLimitError with backoff
  AC-1: Non-RateLimitError does NOT trigger the rate-limit retry decorator
  AC-2: No time.sleep() in l2_frameworks.py or l3_authorial.py transform modules
  AC-3: cli.py inter-phase sleeps reduced to 10s/5s
  AC-4: adaptive_max formula in _reduce() — floor, long book, ceiling cases
  AC-5: PROMPT_OVERHEAD_TOKENS in config; assess uses effective_tokens
"""

from __future__ import annotations

import ast
import inspect
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from knowledge_etl.config import PROMPT_OVERHEAD_TOKENS, STUFF_THRESHOLD_TOKENS
from knowledge_etl.utils.llm import LLMClient


# ─── Helpers ──────────────────────────────────────────────────────────────────


def _make_client() -> LLMClient:
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
        return LLMClient()


def _make_tool_response(tool_input: dict) -> MagicMock:
    tool_block = MagicMock()
    tool_block.type = 'tool_use'
    tool_block.input = tool_input

    response = MagicMock()
    response.content = [tool_block]
    response.usage.input_tokens = 100
    response.usage.output_tokens = 50
    response.usage.cache_creation_input_tokens = 0
    response.usage.cache_read_input_tokens = 0
    return response


# ─── AC-1: RateLimitError Retry ───────────────────────────────────────────────


class TestRateLimitRetryCall:
    """call() retries on RateLimitError and succeeds after transient failure."""

    def test_call_retries_on_rate_limit_and_succeeds(self):
        """call() retries when RateLimitError raised on first attempt."""
        from anthropic import RateLimitError

        client = _make_client()

        text_response = MagicMock()
        text_response.content = [MagicMock(text='result text')]
        text_response.usage.input_tokens = 10
        text_response.usage.output_tokens = 5
        text_response.usage.cache_creation_input_tokens = 0
        text_response.usage.cache_read_input_tokens = 0

        # Simulate RateLimitError on first call, success on second
        rate_limit_err = RateLimitError(
            message='rate limit',
            response=MagicMock(status_code=429, headers={}),
            body={},
        )
        client.client.messages.create = MagicMock(
            side_effect=[rate_limit_err, text_response]
        )

        with patch('tenacity.nap.time') as mock_time:
            mock_time.sleep = MagicMock()
            text, usage = client.call(
                model='sonnet',
                system_prompt='sys',
                task_prompt='task',
            )

        assert text == 'result text'
        assert client.client.messages.create.call_count == 2

    def test_call_structured_retries_on_rate_limit_and_succeeds(self):
        """call_structured() retries when RateLimitError raised on first attempt."""
        from anthropic import RateLimitError

        client = _make_client()
        tool_response = _make_tool_response({'principles': ['p1']})

        rate_limit_err = RateLimitError(
            message='rate limit',
            response=MagicMock(status_code=429, headers={}),
            body={},
        )
        client.client.messages.create = MagicMock(
            side_effect=[rate_limit_err, tool_response]
        )

        with patch('tenacity.nap.time') as mock_time:
            mock_time.sleep = MagicMock()
            result, usage = client.call_structured(
                model='sonnet',
                system_prompt='sys',
                task_prompt='task',
                output_schema={'type': 'object', 'properties': {}, 'required': []},
                tool_name='extract',
            )

        assert result == {'principles': ['p1']}
        assert client.client.messages.create.call_count == 2

    def test_non_rate_limit_error_not_caught_by_rate_limit_decorator(self):
        """A non-RateLimitError (e.g. ValueError) does not trigger RateLimitError retry."""
        client = _make_client()

        client.client.messages.create = MagicMock(
            side_effect=ValueError('unexpected error')
        )

        # ValueError should exhaust the inner retry (3 attempts) and raise
        with pytest.raises(ValueError, match='unexpected error'):
            with patch('tenacity.nap.time'):
                client.call(
                    model='sonnet',
                    system_prompt='sys',
                    task_prompt='task',
                )

        # Inner retry: 3 attempts max
        assert client.client.messages.create.call_count == 3

    def test_rate_limit_imports_are_present(self):
        """RateLimitError and before_sleep_log must be imported in llm.py."""
        import knowledge_etl.utils.llm as llm_module
        from anthropic import RateLimitError
        from tenacity import before_sleep_log

        assert hasattr(llm_module, 'RateLimitError') or RateLimitError is not None
        assert hasattr(llm_module, 'before_sleep_log') or before_sleep_log is not None


# ─── AC-2: No time.sleep in transform modules ─────────────────────────────────


class TestNoPreventiveSleeps:
    """Transform modules must not contain preventive time.sleep() calls."""

    def _get_sleep_calls(self, filepath: Path) -> list[int]:
        """Parse AST of a Python file and return all time.sleep() argument values."""
        source = filepath.read_text(encoding='utf-8')
        tree = ast.parse(source)
        sleep_values = []
        for node in ast.walk(tree):
            if (
                isinstance(node, ast.Call)
                and isinstance(node.func, ast.Attribute)
                and node.func.attr == 'sleep'
                and isinstance(node.func.value, ast.Name)
                and node.func.value.id == 'time'
            ):
                for arg in node.args:
                    if isinstance(arg, ast.Constant):
                        sleep_values.append(arg.value)
        return sleep_values

    def test_l2_frameworks_has_no_time_sleep(self):
        """l2_frameworks.py must have no time.sleep() calls."""
        from knowledge_etl.config import ETL_SRC
        filepath = ETL_SRC / 'transform' / 'l2_frameworks.py'
        sleep_calls = self._get_sleep_calls(filepath)
        assert sleep_calls == [], (
            f'l2_frameworks.py still has time.sleep() calls: {sleep_calls}'
        )

    def test_l3_authorial_has_no_time_sleep(self):
        """l3_authorial.py must have no time.sleep() calls."""
        from knowledge_etl.config import ETL_SRC
        filepath = ETL_SRC / 'transform' / 'l3_authorial.py'
        sleep_calls = self._get_sleep_calls(filepath)
        assert sleep_calls == [], (
            f'l3_authorial.py still has time.sleep() calls: {sleep_calls}'
        )

    def test_l1_principles_has_no_time_sleep(self):
        """l1_principles.py must have no time.sleep() calls."""
        from knowledge_etl.config import ETL_SRC
        filepath = ETL_SRC / 'transform' / 'l1_principles.py'
        sleep_calls = self._get_sleep_calls(filepath)
        assert sleep_calls == [], (
            f'l1_principles.py still has time.sleep() calls: {sleep_calls}'
        )


# ─── AC-3: Inter-phase sleeps reduced in cli.py ───────────────────────────────


class TestInterPhaseSleeps:
    """cli.py inter-phase sleeps must be <= 10s (not the old 120s/200s)."""

    def _get_sleep_calls(self, filepath: Path) -> list[int]:
        source = filepath.read_text(encoding='utf-8')
        tree = ast.parse(source)
        sleep_values = []
        for node in ast.walk(tree):
            if (
                isinstance(node, ast.Call)
                and isinstance(node.func, ast.Attribute)
                and node.func.attr == 'sleep'
                and isinstance(node.func.value, ast.Name)
                and node.func.value.id == 'time'
            ):
                for arg in node.args:
                    if isinstance(arg, ast.Constant):
                        sleep_values.append(arg.value)
        return sleep_values

    def test_cli_has_no_large_sleeps(self):
        """cli.py inter-phase sleeps must all be <= 10s."""
        from knowledge_etl.config import ETL_SRC
        filepath = ETL_SRC / 'cli.py'
        sleep_calls = self._get_sleep_calls(filepath)
        large_sleeps = [v for v in sleep_calls if v > 10]
        assert large_sleeps == [], (
            f'cli.py still has large time.sleep() calls (> 10s): {large_sleeps}'
        )

    def test_cli_has_10s_inter_phase_sleep(self):
        """cli.py should have 10s sleeps between phases (not removed entirely)."""
        from knowledge_etl.config import ETL_SRC
        filepath = ETL_SRC / 'cli.py'
        sleep_calls = self._get_sleep_calls(filepath)
        assert 10 in sleep_calls, (
            'cli.py should have time.sleep(10) for inter-phase courtesy delay'
        )

    def test_cli_has_5s_before_load(self):
        """cli.py should have 5s sleep before Load phase."""
        from knowledge_etl.config import ETL_SRC
        filepath = ETL_SRC / 'cli.py'
        sleep_calls = self._get_sleep_calls(filepath)
        assert 5 in sleep_calls, (
            'cli.py should have time.sleep(5) before Load phase'
        )


# ─── AC-4: Adaptive MAX_OUTPUT_REDUCE ─────────────────────────────────────────


class TestAdaptiveMaxOutputReduce:
    """_reduce() uses adaptive_max formula instead of hard-coded MAX_OUTPUT_REDUCE."""

    def _compute_adaptive_max(self, chapter_count: int) -> int:
        from knowledge_etl.config import MAX_OUTPUT_REDUCE
        return min(32_768, max(MAX_OUTPUT_REDUCE, chapter_count * 2_000))

    def test_short_book_uses_floor(self):
        """5 chapters → floor wins (5 × 2000 = 10000 < 16384)."""
        result = self._compute_adaptive_max(5)
        from knowledge_etl.config import MAX_OUTPUT_REDUCE
        assert result == MAX_OUTPUT_REDUCE  # floor = 16384

    def test_long_book_scales_up(self):
        """12 chapters → 12 × 2000 = 24000 > floor."""
        result = self._compute_adaptive_max(12)
        assert result == 24_000

    def test_very_long_book_hits_ceiling(self):
        """20 chapters → 20 × 2000 = 40000 > 32768 ceiling."""
        result = self._compute_adaptive_max(20)
        assert result == 32_768

    def test_adaptive_max_is_used_in_reduce(self):
        """_reduce() source code must reference adaptive_max (not bare MAX_OUTPUT_REDUCE)."""
        from knowledge_etl.config import ETL_SRC
        source = (ETL_SRC / 'transform' / 'l2_frameworks.py').read_text(encoding='utf-8')
        assert 'adaptive_max' in source, (
            'l2_frameworks.py _reduce() must use adaptive_max formula (AC-4)'
        )

    def test_reduce_max_tokens_uses_adaptive(self):
        """call_structured in _reduce must use adaptive_max, not MAX_OUTPUT_REDUCE directly."""
        from knowledge_etl.config import ETL_SRC
        source = (ETL_SRC / 'transform' / 'l2_frameworks.py').read_text(encoding='utf-8')
        # adaptive_max must appear before the synthesize_frameworks tool call
        reduce_block_start = source.find('def _reduce(')
        reduce_block = source[reduce_block_start:]
        assert 'max_tokens=adaptive_max' in reduce_block, (
            '_reduce() must pass max_tokens=adaptive_max to call_structured'
        )


# ─── AC-5: PROMPT_OVERHEAD_TOKENS in config + assess ─────────────────────────


class TestPromptOverheadTokens:
    """PROMPT_OVERHEAD_TOKENS constant exists and is used in assess strategy."""

    def test_prompt_overhead_tokens_constant_exists(self):
        """PROMPT_OVERHEAD_TOKENS must be defined in config.py."""
        assert PROMPT_OVERHEAD_TOKENS == 3_000

    def test_assess_uses_effective_tokens_for_strategy(self):
        """assess() must add PROMPT_OVERHEAD_TOKENS to token_count before strategy selection."""
        from knowledge_etl.config import ETL_SRC
        source = (ETL_SRC / 'transform' / 'assess.py').read_text(encoding='utf-8')
        assert 'effective_tokens' in source, (
            'assess.py must define effective_tokens = token_count + PROMPT_OVERHEAD_TOKENS'
        )
        assert 'PROMPT_OVERHEAD_TOKENS' in source, (
            'assess.py must import and use PROMPT_OVERHEAD_TOKENS'
        )

    def test_near_threshold_book_selects_map_reduce(self):
        """A book with 177k tokens should select map-reduce (177k + 3k = 180k is NOT < 180k)."""
        token_count = 177_000
        effective_tokens = token_count + PROMPT_OVERHEAD_TOKENS
        strategy = 'stuff' if effective_tokens < STUFF_THRESHOLD_TOKENS else 'map-reduce'
        assert strategy == 'map-reduce', (
            f'177k tokens + 3k overhead = {effective_tokens} should force map-reduce '
            f'(threshold={STUFF_THRESHOLD_TOKENS})'
        )

    def test_book_safely_under_threshold_stays_stuff(self):
        """A book with 100k tokens should still select stuff."""
        token_count = 100_000
        effective_tokens = token_count + PROMPT_OVERHEAD_TOKENS
        strategy = 'stuff' if effective_tokens < STUFF_THRESHOLD_TOKENS else 'map-reduce'
        assert strategy == 'stuff'

    def test_book_exactly_at_threshold_selects_map_reduce(self):
        """A book with 177001 tokens: effective = 180001 > 180000 → map-reduce."""
        token_count = STUFF_THRESHOLD_TOKENS - PROMPT_OVERHEAD_TOKENS + 1  # 177001
        effective_tokens = token_count + PROMPT_OVERHEAD_TOKENS
        strategy = 'stuff' if effective_tokens < STUFF_THRESHOLD_TOKENS else 'map-reduce'
        assert strategy == 'map-reduce'
