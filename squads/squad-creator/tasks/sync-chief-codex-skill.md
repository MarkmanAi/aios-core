# /sync-chief-codex-skill Task

> **DEPRECATED (2026-03-19 — Story 25.3):** Codex skill generation for core AIOS agents
> is now handled by IDE Sync (`npm run sync:ide`). The `codex` target in
> `.aios-core/core-config.yaml` generates `.codex/skills/` automatically.
> This task remains for squad-specific chief skill generation only (squads not in
> `.aios-core/development/agents/`). It will be removed when IDE Sync supports
> squad source directories.

**Task ID:** sync-chief-codex-skill
**Version:** 1.0.0
**Execution Type:** `Worker` (deterministic file generation)
**Model:** Haiku
**Haiku Eligible:** YES
**Worker Script:** `scripts/sync-chief-codex-skill.js`

## Veto Conditions

| ID | Condition | Check | Result |
|----|-----------|-------|--------|
| VETO-SCS-001 | Squad config.yaml must exist and be parseable before generating skill file | Validate squads/{squad_name}/config.yaml exists and YAML parses without error | VETO - BLOCK. Fix or create config.yaml before attempting skill sync. |
| VETO-SCS-002 | Chief agent must be resolvable from config before writing skill file | Verify chief resolution chain (entry_agent, squad.entry_agent, tier_system.orchestrator, agents[]) returns a valid agent ID | VETO - BLOCK. Define entry_agent or orchestrator in config.yaml before proceeding. |
| VETO-SCS-003 | Existing SKILL.md at target path must be backed up before overwrite | Check if .codex/skills/{chief_id}/SKILL.md already exists | VETO - BLOCK. Create backup of existing skill file before generating new version. |

---

When this task is used, execute:

```bash
node squads/squad-creator/scripts/sync-chief-codex-skill.js --squad {squad_name}
```

## Purpose

Generate or update the Codex skill for the squad chief so the orchestrator is immediately activatable in Codex after squad creation.

## Inputs

- `squad_name` (required): Squad directory name under `squads/`.

## Deterministic Behavior

1. Read `squads/{squad_name}/config.yaml`.
2. Resolve chief id via (priority):
   - `entry_agent`
   - `squad.entry_agent`
   - `tier_system.orchestrator`
   - first `agents[].id` that is orchestrator or ends with `-chief`
3. Read chief agent file in `squads/{squad_name}/agents/`.
4. Extract command set from chief YAML block.
5. Write `.codex/skills/{chief_id}/SKILL.md`.

## Required Output

- `.codex/skills/{chief_id}/SKILL.md`

## Blocking Rule

If the chief cannot be resolved or the chief file is missing, fail the task and block final handoff.
