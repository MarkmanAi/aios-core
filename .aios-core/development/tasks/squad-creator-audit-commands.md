---
task: Audit Commands
responsavel: "@squad-creator"
responsavel_type: agent
atomic_layer: task
Entrada: |
  - agent: Agent name to audit (default: squad-creator)
  - fix: If true, report issues only without auto-fixing (--fix flag reserved for future)
Saida: |
  - audit_result: Object with { commands, missing_tasks, missing_scripts, orphan_tasks, summary }
  - report: Formatted audit report
Checklist:
  - "[ ] Load agent definition and extract command list"
  - "[ ] Check each command has a corresponding task file in .aios-core/development/tasks/"
  - "[ ] Check each task file references a script in .aios-core/development/scripts/squad/"
  - "[ ] Detect orphan task files (task files with no mapped command)"
  - "[ ] Generate audit report with status per command"
---

# *audit-commands

Audits all commands declared in the agent definition, verifying that each has:
- A task file in `.aios-core/development/tasks/`
- A script dependency in `.aios-core/development/scripts/squad/`

Also detects orphan task files (task files that exist but are not mapped to any command).

## Usage

```
@squad-creator
*audit-commands
*audit-commands --agent squad-creator
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `--agent` | string | squad-creator | Agent to audit |

## Flow

```
1. Load agent definition
   └── Parse commands[] from YAML block

2. For each command:
   ├── Check task file exists: .aios-core/development/tasks/{command.task}
   ├── Check script exists (if referenced in task file)
   └── Classify: OK | MISSING_TASK | MISSING_SCRIPT | PLACEHOLDER

3. Detect orphan tasks
   ├── List all squad-creator-*.md in tasks/
   └── Cross-check against commands[] task references

4. Generate report
   ├── Per-command status table
   ├── Orphan task list
   └── Summary: X ok, Y missing, Z orphans
```

## Output Example

```
═══════════════════════════════════════════════════════════
           COMMAND AUDIT — @squad-creator
═══════════════════════════════════════════════════════════

Command              Task File                          Script                   Status
──────────────────── ────────────────────────────────── ──────────────────────── ──────
*help                (built-in)                         —                        ✅ OK
*design-squad        squad-creator-design.md ✅         squad-designer.js ✅     ✅ OK
*create-squad        squad-creator-create.md ✅         squad-generator.js ✅    ✅ OK
*validate-squad      squad-creator-validate.md ✅       squad-validator.js ✅    ✅ OK
*list-squads         squad-creator-list.md ✅           squad-generator.js ✅    ✅ OK
*migrate-squad       squad-creator-migrate.md ✅        squad-migrator.js ✅     ✅ OK
*analyze-squad       squad-creator-analyze.md ✅        squad-analyzer.js ✅     ✅ OK
*extend-squad        squad-creator-extend.md ✅         squad-extender.js ✅     ✅ OK
*download-squad      squad-creator-download.md ✅       squad-downloader.js ✅   ⚠️ PLACEHOLDER
*publish-squad       squad-creator-publish.md ✅        squad-publisher.js ✅    ⚠️ PLACEHOLDER
*sync-squad-synkra   squad-creator-sync-synkra.md ✅   —                        ⚠️ PLACEHOLDER
*audit-commands      squad-creator-audit-commands.md ✅ —                        ✅ OK
*guide               (built-in)                         —                        ✅ OK
*exit                (built-in)                         —                        ✅ OK

───────────────────────────────────────────────────────────
ORPHAN TASK FILES (exist but have no mapped command):
───────────────────────────────────────────────────────────
  ⚠️ squad-creator-sync-ide-command.md — not mapped to any command

───────────────────────────────────────────────────────────
SUMMARY:
───────────────────────────────────────────────────────────
  ✅ OK:          11
  ⚠️ Placeholder:  3
  ❌ Missing:      0
  🔍 Orphans:      1

Status: HEALTHY (no missing tasks or scripts)
═══════════════════════════════════════════════════════════
```

## Status Legend

| Status | Icon | Description |
|--------|------|-------------|
| OK | ✅ | Command fully wired (task + script) |
| Placeholder | ⚠️ | Declared with `status: placeholder` — intentionally incomplete |
| Missing Task | ❌ | Command declared but task file not found |
| Missing Script | ❌ | Task file exists but script dependency missing |
| Orphan | 🔍 | Task file exists but no command references it |

## Implementation

This task is executed by the agent directly using Read and Glob tools:

```
1. Glob: .aios-core/development/tasks/squad-creator-*.md
2. Glob: .aios-core/development/scripts/squad/*.js
3. Read: .aios-core/development/agents/squad-creator.md (parse commands[])
4. Cross-reference and generate report
```

No external script required — the agent performs the audit natively.

## Related

- **Agent:** @squad-creator (Craft)
- **Validate:** *validate-squad
- **Analyze:** *analyze-squad
