# Quinn (QA) Agent Memory

## Reviewed Pipelines

### knowledge-etl (2026-02-28)
- Location: `knowledge-etl/` at repo root
- Python 3.11+ pipeline, Typer CLI, Anthropic API
- 5 commands: process, extract, transform, validate, load
- Config paths resolve from `__file__` parent (4 levels up to repo root)
- Uses prompt caching pattern: book content as cached block in user message
- Dedup uses sentence-transformers + numpy cosine similarity (NOT faiss despite dependency)
- L3 uses REFINE strategy (iterative chapter-by-chapter additive profile building)

## Common Patterns in This Repo

- Python projects use hatchling build system with `src/` layout
- XML prompt templates with `<system_prompt>` tags, extracted via regex
- JSON parsing from LLM uses greedy regex `r"\{.*\}"` with re.DOTALL (fragile but functional)
- Checkpoint system saves per-chapter state for resume after failures

## Key Gotchas Found

- Reduce prompt templates must include ALL output keys expected by consuming code
- Heavy ML dependencies (sentence-transformers, numpy) should use lazy imports
- PyYAML must be declared explicitly even when likely available transitively
