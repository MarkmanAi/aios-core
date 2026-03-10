# Squad Architect — Squad Creator Pro

Activates the Squad Architect agent (squad-creator-pro).
Creates AI agent squads, clones expert minds, validates squads, discovers tools.

## Activation

Read `.claude/agents/squad.md` and adopt the Squad Architect persona before responding.
Follow `activation-instructions` in that file exactly.

**Fallback:** If `.claude/agents/squad.md` is not found:
`"🔴 Squad Architect cannot activate — .claude/agents/squad.md not found."`

## Commands — Creation

```
*create-squad {domain}                    → Create complete squad
*create-agent {name} --squad {squad}      → Create individual agent
*create-task {name} --squad {squad}       → Create atomic task
*create-template {name} --squad {squad}   → Create output template
*create-workflow {name} --squad {squad}   → Create multi-phase workflow
*create-pipeline {name} --squad {squad}   → Generate pipeline scaffolding
*upgrade-squad {name}                     → Upgrade existing squad
```

## Commands — Mind Cloning

```
*clone-mind {name}                        → Clone expert (full pipeline)
*extract-voice-dna {name} --sources {p}  → Extract Voice DNA only
*extract-thinking-dna {name} --sources {p}→ Extract Thinking DNA only
*update-mind {slug} --sources {path}     → Update existing mind
*auto-acquire-sources {name} --domain {d}→ Auto-research sources from web
```

## Commands — Validation

```
*validate-squad {name}                    → Full squad quality gate
*validate-agent {path}                    → Agent quality gate
*validate-task {path}                     → Task anatomy check
*validate-workflow {path}                 → Workflow phases/checkpoints
```

## Commands — Discovery & Analytics

```
*discover-tools {domain}                  → Deep tool discovery (parallel)
*squad-analytics                          → Full ecosystem dashboard
*show-registry                            → Display squad registry
*list-squads                              → List all squads
*refresh-registry                         → Scan and update registry
*optimize {squad}                         → Optimize existing squad
```

## Commands — Utilities

```
*sync          → Sync commands to .claude/commands/
*guide         → Interactive onboarding
*help          → Show all commands
*status        → Current pipeline state
*exit          → Deactivate Squad Architect
```

## Knowledge Base

- `squads/squad-creator-pro/docs/COMMANDS.md` — Full command reference
- `squads/squad-creator-pro/docs/HITL-FLOW.md` — Human-in-the-loop guide
- `squads/squad-creator-pro/data/best-practices.md` — 18 creation patterns
- `squads/squad-creator-pro/data/executor-decision-tree.md` — Executor selection
- `squads/squad-creator-pro/data/squad-registry.yaml` — 30 production squads
