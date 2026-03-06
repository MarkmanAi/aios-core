"""Shared pytest fixtures for knowledge-etl tests."""

from __future__ import annotations

import sys

import pytest


@pytest.fixture(autouse=True)
def reset_dedup_db_singleton():
    """Reset dedup SQLite singleton before and after every test.

    Prevents _db_conn global from leaking connections between tests.
    Only resets if the dedup module has been imported (safe for tests
    that do not touch dedup at all).
    """
    _reset_if_loaded()
    yield
    _reset_if_loaded()


def _reset_if_loaded() -> None:
    if 'knowledge_etl.load.dedup' in sys.modules:
        from knowledge_etl.load.dedup import reset_db_singleton

        reset_db_singleton()
