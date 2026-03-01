"""
Checkpoint system — save and resume pipeline progress per chapter.
Prevents re-processing chapters 1-N when failure occurs at chapter N+1.
"""

from __future__ import annotations

import json
from pathlib import Path


class Checkpoint:
    """
    Saves pipeline state to disk after each chapter.

    File: data/checkpoints/{book_slug}/{phase}.json
    Schema:
        {
          "book_slug": "thinking-in-systems",
          "phase": "l1",
          "completed_chapters": ["ch01", "ch02"],
          "results": {"ch01": {...}, "ch02": {...}},
          "total_cost_usd": 0.42
        }
    """

    def __init__(self, checkpoints_dir: Path, book_slug: str, phase: str) -> None:
        self.path = checkpoints_dir / book_slug / f"{phase}.json"
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._state = self._load()

    def _load(self) -> dict:
        if self.path.exists():
            return json.loads(self.path.read_text(encoding="utf-8"))
        return {
            "completed_chapters": [],
            "results": {},
            "total_cost_usd": 0.0,
        }

    def _save(self) -> None:
        self.path.write_text(
            json.dumps(self._state, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

    def is_done(self, chapter_key: str) -> bool:
        return chapter_key in self._state["completed_chapters"]

    def mark_done(
        self,
        chapter_key: str,
        result: dict,
        cost_usd: float = 0.0,
    ) -> None:
        self._state["completed_chapters"].append(chapter_key)
        self._state["results"][chapter_key] = result
        self._state["total_cost_usd"] += cost_usd
        self._save()

    def get_result(self, chapter_key: str) -> dict | None:
        return self._state["results"].get(chapter_key)

    def all_results(self) -> dict:
        return self._state["results"]

    def total_cost(self) -> float:
        return self._state["total_cost_usd"]

    def completed_chapters(self) -> list[str]:
        return list(self._state["completed_chapters"])

    def reset(self) -> None:
        """Wipe checkpoint — forces full reprocessing."""
        self._state = {
            "completed_chapters": [],
            "results": {},
            "total_cost_usd": 0.0,
        }
        self._save()
