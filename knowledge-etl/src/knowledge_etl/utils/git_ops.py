"""
Git operations — auto-commit after Load phase.
"""

from __future__ import annotations

import os
import subprocess
from pathlib import Path

from knowledge_etl.config import GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL, REPO_ROOT


def git_add_and_commit(paths: list[Path], message: str) -> None:
    """
    Stage specific paths and create a commit in the AIOS repo.
    Only commits if there are actual changes.
    """
    repo = str(REPO_ROOT)

    # Stage only the specified paths
    for path in paths:
        subprocess.run(
            ["git", "add", str(path)],
            cwd=repo,
            check=True,
            capture_output=True,
        )

    # Check if there's anything to commit
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        cwd=repo,
        capture_output=True,
    )
    if result.returncode == 0:
        return  # Nothing staged

    env = {
        "GIT_AUTHOR_NAME": GIT_AUTHOR_NAME,
        "GIT_AUTHOR_EMAIL": GIT_AUTHOR_EMAIL,
        "GIT_COMMITTER_NAME": GIT_AUTHOR_NAME,
        "GIT_COMMITTER_EMAIL": GIT_AUTHOR_EMAIL,
    }

    subprocess.run(
        ["git", "commit", "-m", message],
        cwd=repo,
        check=True,
        capture_output=True,
        env={**os.environ, **env},
    )
