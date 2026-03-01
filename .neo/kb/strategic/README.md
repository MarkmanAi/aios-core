# Strategic Knowledge Base

This directory contains domain-specific knowledge frameworks extracted from books
by the `knowledge-etl` pipeline.

## Structure

Each file is named by domain (e.g., `software-engineering.md`, `systems-thinking.md`)
and contains XML `<knowledge_base>` blocks — one per book processed.

## Contents per block

- **Frameworks**: Named and implicit decision-making frameworks
- **Decision Heuristics**: WHEN/DO/BECAUSE rules
- **Anti-patterns**: Common mistakes with explanations
- **Trigger Questions**: Self-diagnostic questions

## How it works

1. Books are processed through the knowledge-etl pipeline (L2 pass)
2. Frameworks are extracted per chapter, then unified via cross-chapter Reduce
3. New items are deduplicated against existing content before merging
4. Each book adds a new `<knowledge_base>` block to the domain file

## Usage

Neo references these files for strategic decision-making and organizational guidance.
Agents can query specific domains for relevant frameworks and heuristics.
