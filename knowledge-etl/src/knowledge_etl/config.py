"""
AIOS Knowledge-ETL Configuration
Paths, models, and budgets for the book-to-intelligence pipeline.
"""

from pathlib import Path

# ─── Repository Roots ────────────────────────────────────────────────────────

# knowledge-etl package is at: repo/knowledge-etl/src/knowledge_etl/
# So repo root is 4 levels up from this file
ETL_SRC = Path(__file__).parent
ETL_ROOT = ETL_SRC.parent.parent        # knowledge-etl/
REPO_ROOT = ETL_ROOT.parent            # aios-core/

# ─── AIOS Output Paths ───────────────────────────────────────────────────────

# Neo territory — L1 and L2 outputs land here
NEO_KB_STRATEGIC = REPO_ROOT / ".neo" / "kb" / "strategic"
NEO_STRATEGIC_PRINCIPLES = REPO_ROOT / ".neo" / "data" / "strategic-principles.md"

# MMOS territory — L3 DNA sources land here
MMOS_MINDS = REPO_ROOT / "squads" / "mmos-squad" / "minds"

# PKB territory — Person Knowledge Base (pre-mind knowledge layer)
PEOPLE_KB = ETL_ROOT / "data" / "people"

# Books input — reference path only; CLI receives explicit book_path argument
BOOKS_INPUT = REPO_ROOT / "books"

# ─── ETL Working Directories ─────────────────────────────────────────────────

STAGING = ETL_ROOT / "data" / "staging"         # Intermediate outputs per book
CHECKPOINTS = ETL_ROOT / "data" / "checkpoints" # Resume points (JSON)
DEDUP_DB = ETL_ROOT / "data" / "dedup_registry.db"  # SQLite dedup registry
PROMPTS_DIR = ETL_SRC / "prompts"               # XML prompt templates

# ─── Claude Models ───────────────────────────────────────────────────────────

MODELS: dict[str, str] = {
    "opus": "claude-opus-4-6",
    "sonnet": "claude-sonnet-4-6",
    "haiku": "claude-haiku-4-5-20251001",
}

# Which model handles each extraction level (can be overridden via CLI)
DEFAULT_MODEL_L1 = "sonnet"   # Principle extraction — structured, constrained
DEFAULT_MODEL_L2 = "sonnet"   # Framework extraction — structured (REDUCE phase)
DEFAULT_MODEL_L2_MAP = "haiku"  # L2 MAP phase — mechanically simple extraction, cost-optimized
DEFAULT_MODEL_L3 = "opus"     # DNA extraction — nuanced authorial voice
DEFAULT_MODEL_VALIDATE = "haiku"   # Faithfulness check — simple verification
DEFAULT_MODEL_DEDUP = "haiku"      # Semantic dedup assist — classification only

# ─── Token Budgets ────────────────────────────────────────────────────────────

# Books under this threshold → STUFF strategy (full book in context)
# Books over → MAP-REDUCE by chapter
STUFF_THRESHOLD_TOKENS = 180_000

# Overhead from system prompt + tool schema tokens — added to raw book token count
# to avoid false STUFF classifications for large books near the threshold.
PROMPT_OVERHEAD_TOKENS = 3_000

# Max output tokens per extraction pass
MAX_OUTPUT_L1 = 4_096
MAX_OUTPUT_L2 = 8_192
MAX_OUTPUT_L3 = 8_192
MAX_OUTPUT_VALIDATE = 4_096
MAX_OUTPUT_REDUCE = 16_384

# Chunk size for output KB (L3 chunks stored in MMOS)
OUTPUT_CHUNK_MIN_TOKENS = 2_000
OUTPUT_CHUNK_MAX_TOKENS = 4_000
CHUNK_OVERLAP_TOKENS = 300

# ─── Quality Thresholds ──────────────────────────────────────────────────────

# Faithfulness: items below this score go to human review queue
FAITHFULNESS_THRESHOLD = 0.80

# Semantic dedup: cosine similarity above this → duplicate
DEDUP_SIMILARITY_BLOCK = 0.90
# Between DEDUP_SIMILARITY_REVIEW and DEDUP_SIMILARITY_BLOCK → Haiku decides
DEDUP_SIMILARITY_REVIEW = 0.80

# ─── Git ─────────────────────────────────────────────────────────────────────

GIT_AUTHOR_NAME = "knowledge-etl"
GIT_AUTHOR_EMAIL = "etl@aios-core"
