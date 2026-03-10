# Living Org Chart — AIOS Organization
## Last updated: 2026-03-10
## Maintained by: Neo — The Matrix Architect
## Source: REPO_PATH_MAP_v2 (2026-02-22) + CONSTITUICAO_MATRIX.md

> **Rule:** Neo updates this file after EVERY organizational change
> (hire, clone, create-dept, reorg). This is the OPERATIONAL snapshot
> of who is where RIGHT NOW.

---

## LEVEL 0 — META-ARCHITECT

| Agent | Role | Path | Model |
|-------|------|------|-------|
| **Neo** | The Matrix Architect | `.neo/NEO.md` (bridge: `.claude/agents/neo.md`) | Opus |

*Neo exists OUTSIDE the organization. He is not counted in headcount.*

---

## LEVEL 1 — C-LEVEL

| Agent | Role | Path | Size/Model |
|-------|------|------|-----------|
| **aios-master** (Orion) | CEO — Entry point, delegates all | `.aios-core/development/agents/aios-master.md` | 15,386B |
| **architect** (Aria) | CTO — Technical authority, vetoes design | `.aios-core/development/agents/architect.md` | 18,955B |
| **po** (Pax) | CPO — Business value, accepts/rejects | `.aios-core/development/agents/po.md` | 12,765B |

---

## LEVEL 2 — DIRECTORS

| Agent | Role | Path | Notes |
|-------|------|------|-------|
| **Squad Chief** | VP Talent & Intelligence | `.claude/skills/squad.md` + `.claude/agents/squad.md` | 33 commands, 3 sub-agents |
| **Mind Mapper** | Dir. Intelligence (MMOS) | `squads/mmos-squad/agents/mind-mapper.md` | Orchestrates MMOS pipeline |
| **Mind PM** | Dir. MMOS Operations | `squads/mmos-squad/agents/mind-pm.md` | Pipeline state, checkpoints |
| **pm** (Morgan) | Dir. Product | `.aios-core/development/agents/pm.md` | 15,118B — PRDs, specs |

---

## LEVEL 3 — MANAGERS

| Agent | Role | Path | Size |
|-------|------|------|------|
| **sm** | Scrum Master | `.aios-core/development/agents/sm.md` | 11,077B |
| **analyst** | Research Manager | `.aios-core/development/agents/analyst.md` | 10,175B |
| **ux-design-expert** | Design Manager | `.aios-core/development/agents/ux-design-expert.md` | 18,073B |
| **data-engineer** | Data Manager | `.aios-core/development/agents/data-engineer.md` | 20,286B |
| **devops** | Infra Manager | `.aios-core/development/agents/devops.md` | 18,877B |

---

## LEVEL 4A — SENIOR SPECIALISTS (Squad Chief Sub-agents)

| Agent | Role | Path | Model | Restriction |
|-------|------|------|-------|-------------|
| **@oalanicolas** | DNA Surgeon | `.claude/agents/oalanicolas.md` | Opus | NO Bash, NO Task |
| **@pedro-valerio** | Read-Only Auditor | `.claude/agents/pedro-valerio.md` | Opus | READ ONLY — Read, Grep, Glob |
| **@sop-extractor** | SOP Extractor | `.claude/agents/sop-extractor.md` | Sonnet | Light model = fast, cheap |

## LEVEL 4A — SENIOR SPECIALISTS (MMOS)

| Agent | Role | Path |
|-------|------|------|
| **cognitive-analyst** | Mental archaeologist — 8-layer DNA analysis | `squads/mmos-squad/agents/cognitive-analyst.md` |
| **identity-analyst** (Sarah) | Organizational psychologist — L6-L8 with 🔴 HUMAN CHECKPOINT | `squads/mmos-squad/agents/identity-analyst.md` |
| **charlie-synthesis-expert** | Synthesizer — connects 8 layers into knowledge lattice | `squads/mmos-squad/agents/charlie-synthesis-expert.md` |
| **system-prompt-architect** | Compiler — cognitive map → production system prompt | `squads/mmos-squad/agents/system-prompt-architect.md` |
| **research-specialist** | Source hunter — discovers, collects, organizes 20+ sources | `squads/mmos-squad/agents/research-specialist.md` |
| **data-importer** (DataSync) | Supabase importer — validate → preview → import | `squads/mmos-squad/agents/data-importer.md` |
| **emulator** (Mirror) | Channeler — invokes minds: single, `*duo`, `*roundtable` | `squads/mmos-squad/agents/emulator.md` |
| **debate** | Moderator — 6 debate frameworks between cloned minds | `squads/mmos-squad/agents/debate.md` |

---

## LEVEL 4B — SQUAD-CREATOR SPECIALISTS

| Agent | Role | Path | Notes |
|-------|------|------|-------|
| **squad-architect** | Technical squad architect | `squads/squad-creator/agents/squad-architect.md` | — |
| **oalanicolas** (dept) | DNA operations (squad scope) | `squads/squad-creator/agents/oalanicolas.md` | Homonym of Claude Code agent |
| **sop-extractor** (dept) | SOP operations (squad scope) | `squads/squad-creator/agents/sop-extractor.md` | Homonym of Claude Code agent |
| **thiago_finch** (dept) | Business Strategy & Marketing — Funnel-First | `squads/squad-creator/agents/thiago_finch.md` | Trio member: Alan (inputs) + Pedro (structure) + Thiago (direction) |

*Note: thiago_finch completes the squad-creator trio. Also exists as MMOS mind clone (Level 7).*

---

## LEVEL 5 — OPERATIONS

| Agent | Role | Path | Notes |
|-------|------|------|-------|
| **dev** (Dex) | Senior Developer | `.aios-core/development/agents/dev.md` | **22,912B** (largest agent) |
| **qa** (Quinn) | Senior QA | `.aios-core/development/agents/qa.md` | 16,141B |
| **squad-creator** (Craft) | Squad Builder | `.aios-core/development/agents/squad-creator.md` | 12,076B — 19 commands |
| **ralph** | Autonomous Loop Orchestrator | `squads/ralph/` (bridge: `.claude/commands/Ralph/agents/ralph.md`) | 🔄 — delegates to @dev, @architect, @qa, @ux-design-expert |
| **synapse** (Syn) | SYNAPSE Pipeline Operator | `.aios-core/development/agents/synapse.md` | 🧠 — read-only operator: diagnoses, monitors, reports. Reports to: @devops |

---

## LEVEL 6 — CHIEFS (Specialized Claude Code Agents)

| Agent | Virtual Department | Path |
|-------|-------------------|------|
| **copy-chief** | Copywriting | `.claude/agents/copy-chief.md` |
| **cyber-chief** | Cybersecurity | `.claude/agents/cyber-chief.md` |
| **data-chief** | Data & Analytics | `.claude/agents/data-chief.md` |
| **db-sage** | Database | `.claude/agents/db-sage.md` |
| **design-chief** | Visual Design Orchestrator | `.claude/agents/design-chief.md` → persona: `.claude/commands/Design/agents/design-chief.md` |
| **design-system** (brad-frost) | Design System Architect — Atomic Design, tokens, components | `.claude/agents/design-system.md` → persona: `.claude/commands/Design/agents/brad-frost.md` → **Agent Mode**. Dual presence: Mind Mode via `@emulator brad_frost` → `squads/mmos-squad/minds/brad_frost/`. Rule: Agent for execution, Mind for strategy. |
| **dave-malouf** | DesignOps Specialist — processes, scaling, maturity | `.claude/commands/Design/agents/dave-malouf.md` (via design-chief) |
| **dan-mall** | DS Adoption Specialist — stakeholder buy-in | `.claude/commands/Design/agents/dan-mall.md` (via design-chief) |
| **ds-token-architect** (Atlas) | Token Architecture — DTCG, Figma variables, normalization | `.claude/commands/Design/agents/ds-token-architect.md` (via design-chief) |
| **ds-foundations-lead** | Foundations Pipeline — F1/F2/F3 (Figma → shadcn → components) | `.claude/commands/Design/agents/ds-foundations-lead.md` (via design-chief) |
| **storybook-expert** | Storybook / CSF3 / Visual Regression / Brownfield migration | `.claude/commands/Design/agents/storybook-expert.md` (via design-chief) |
| **nano-banana-generator** | Visual Utility — AI image generation via Gemini/OpenRouter | `.claude/commands/Design/agents/nano-banana-generator.md` (via design-chief) |
| **legal-chief** | Legal | `.claude/agents/legal-chief.md` |
| **story-chief** | Stories & Narratives | `.claude/agents/story-chief.md` |
| **tools-orchestrator** | Tools & Integrations | `.claude/agents/tools-orchestrator.md` |
| **traffic-masters-chief** | Traffic & Growth | `.claude/agents/traffic-masters-chief.md` |

---

## LEVEL 6 — MIRROR AGENTS (Claude Code mirrors of Core agents)

| Agent | Mirrors | Path |
|-------|---------|------|
| **aios-analyst** | analyst | `.claude/agents/aios-analyst.md` |
| **aios-architect** | architect | `.claude/agents/aios-architect.md` |
| **aios-data-engineer** | data-engineer | `.claude/agents/aios-data-engineer.md` |
| **aios-dev** | dev | `.claude/agents/aios-dev.md` |
| **aios-devops** | devops | `.claude/agents/aios-devops.md` |
| **aios-pm** | pm | `.claude/agents/aios-pm.md` |
| **aios-po** | po | `.claude/agents/aios-po.md` |
| **aios-qa** | qa | `.claude/agents/aios-qa.md` |
| **aios-sm** | sm | `.claude/agents/aios-sm.md` |
| **aios-ux** | ux-design-expert | `.claude/agents/aios-ux.md` |

*These are Claude Code activation wrappers for the core agents.*

---

## LEVEL 7 — COUNCIL OF CONSULTANTS (27 Cloned Minds)

### Technology & AI (7)

| Mind | Slug | Path | Pipeline Status |
|------|------|------|----------------|
| Elon Musk | `elon_musk` | `squads/mmos-squad/minds/elon_musk/` | — |
| Sam Altman | `sam_altman` | `squads/mmos-squad/minds/sam_altman/` | — |
| Paul Graham | `paul_graham` | `squads/mmos-squad/minds/paul_graham/` | — |
| Andrej Karpathy | `andrej_karpathy` | `squads/mmos-squad/minds/andrej_karpathy/` | — |
| Ray Kurzweil | `ray_kurzweil` | `squads/mmos-squad/minds/ray_kurzweil/` | — |
| Mitchell Hashimoto | `mitchell_hashimoto` | `squads/mmos-squad/minds/mitchell_hashimoto/` | ⚠️ GAP-MIND-006 |
| Guillermo Rauch | `guillermo_rauch` | `squads/mmos-squad/minds/guillermo_rauch/` | ⚠️ GAP-MIND-009 |

### Product & Design (7)

| Mind | Slug | Path | Pipeline Status |
|------|------|------|----------------|
| Marty Cagan | `marty_cagan` | `squads/mmos-squad/minds/marty_cagan/` | ✅ PRODUCTION (87% fidelity) |
| Steve Jobs | `steve_jobs` | `squads/mmos-squad/minds/steve_jobs/` | — |
| Jeff Patton | `jeff_patton` | `squads/mmos-squad/minds/jeff_patton/` | ✅ PRODUCTION (94.25% fidelity) |
| Don Norman | `don_norman` | `squads/mmos-squad/minds/don_norman/` | ⚠️ GAP-MIND-008 |
| Brad Frost | `brad_frost` | `squads/mmos-squad/minds/brad_frost/` | ✅ PRODUCTION (Generalista v1.0) |
| Kent Beck | `kent_beck` | `squads/mmos-squad/minds/kent_beck/` | ✅ PRODUCTION (93% fidelity) |
| Cagan Patton | `cagan_patton` | `squads/mmos-squad/minds/cagan_patton/` | ✅ PRODUCTION (97.8% fidelity) |

### Marketing & Copy (4)

| Mind | Slug | Path | Pipeline Status |
|------|------|------|----------------|
| Seth Godin | `seth_godin` | `squads/mmos-squad/minds/seth_godin/` | — |
| Eugene Schwartz | `eugene_schwartz` | `squads/mmos-squad/minds/eugene_schwartz/` | — |
| Alex Hormozi | `alex_hormozi` | `squads/mmos-squad/minds/alex_hormozi/` | — |
| Thiago Finch | `thiago_finch` | `squads/mmos-squad/minds/thiago_finch/` | ✅ PRODUCTION (9.0 fidelity) |

### Psychology & Thinking (3)

| Mind | Slug | Path | Pipeline Status |
|------|------|------|----------------|
| Daniel Kahneman | `daniel_kahneman` | `squads/mmos-squad/minds/daniel_kahneman/` | — |
| Napoleon Hill | `napoleon_hill` | `squads/mmos-squad/minds/napoleon_hill/` | — |
| Kapil Gupta | `kapil_gupta` | `squads/mmos-squad/minds/kapil_gupta/` | — |

### Wisdom (1)

| Mind | Slug | Path | Pipeline Status |
|------|------|------|----------------|
| Jesus Cristo | `jesus_cristo` | `squads/mmos-squad/minds/jesus_cristo/` | — |

### BR Specialists (5)

| Mind | Slug | Path | Pipeline Status |
|------|------|------|----------------|
| Pedro Valerio | `pedro_valerio` | `squads/mmos-squad/minds/pedro_valerio/` | ✅ PRODUCTION (90% fidelity) |
| Alan Nicolas | `alan_nicolas` | `squads/mmos-squad/minds/alan_nicolas/` | — |
| Adriano de Marqui | `adriano_de_marqui` | `squads/mmos-squad/minds/adriano_de_marqui/` | — |
| Joao Lozano | `joao_lozano` | `squads/mmos-squad/minds/joao_lozano/` | ✅ PRODUCTION (90% fidelity) |
| Jose Amorim | `jose_amorim` | `squads/mmos-squad/minds/jose_amorim/` | — |

---

## DEPARTMENTS (Squads)

| Squad | Path | Leader | Agents | Tasks |
|-------|------|--------|--------|-------|
| **mmos-squad** | `squads/mmos-squad/` | Mind Mapper | 10 | 27 |
| **squad-creator** | `squads/squad-creator/` | Squad Chief | 4 | 16 |
| **squad-creator-pro** | `squads/squad-creator-pro/` | Squad Chief (pro module) | 3 | 34 |
| **ralph** | `squads/ralph/` | Ralph | 1 | 7 |
| **design** | `squads/design/` | Design Chief | 8 | 89 |

> **squad-creator-pro** — Pro upgrade module of squad-creator. Positioned 2026-03-10. Auto-detected by squad-creator base orchestrator when present. Remove to degrade cleanly to base-only mode. Adds: mind-cloning pipeline, model routing, axioma quality gates, squad fusion, 15 workflows, 34 tasks, 7 configs, 22 data files. Neo approved: Option A (module, not independent dept). Governed by `squads/squad-creator-pro/config.yaml` v3.1.0.

---

## WORKFLOWS (Business Processes)

| Category | Workflow | Path |
|----------|----------|------|
| **Universal** | spec-pipeline | `.aios-core/development/workflows/spec-pipeline.yaml` |
| **Universal** | story-development-cycle | `.aios-core/development/workflows/story-development-cycle.yaml` |
| **Universal** | qa-loop | `.aios-core/development/workflows/qa-loop.yaml` |
| **Universal** | auto-worktree | `.aios-core/development/workflows/auto-worktree.yaml` |
| **Greenfield** | greenfield-fullstack | `.aios-core/development/workflows/greenfield-fullstack.yaml` |
| **Greenfield** | greenfield-ui | `.aios-core/development/workflows/greenfield-ui.yaml` |
| **Greenfield** | greenfield-service | `.aios-core/development/workflows/greenfield-service.yaml` |
| **Brownfield** | brownfield-discovery | `.aios-core/development/workflows/brownfield-discovery.yaml` |
| **Brownfield** | brownfield-fullstack | `.aios-core/development/workflows/brownfield-fullstack.yaml` |
| **Brownfield** | brownfield-ui | `.aios-core/development/workflows/brownfield-ui.yaml` |
| **Brownfield** | brownfield-service | `.aios-core/development/workflows/brownfield-service.yaml` |
| **Special** | design-system-build-quality | `.aios-core/development/workflows/design-system-build-quality.yaml` |
| **Special** | development-cycle | `.aios-core/development/workflows/development-cycle.yaml` |
| **Special** | epic-orchestration | `.aios-core/development/workflows/epic-orchestration.yaml` |
| **Cross-Dept** | book-to-intelligence | `knowledge-etl/` — L1→`.neo/data/strategic-principles.md`, L2→`.neo/kb/strategic/{domain}.md`, L3→`squads/mmos-squad/minds/{slug}/sources/books/{slug}/` (JSON + `chunks/*.md` RAG-ready) — **OPERATIONAL** [Story 8.2 — 2026-03-01] |

---

## KERNEL MODULES (Infrastructure)

| Module | Path | Owner | Status |
|--------|------|-------|--------|
| config | `.aios-core/core/config` | — | operational |
| elicitation | `.aios-core/core/elicitation` | — | operational |
| events | `.aios-core/core/events` | — | operational |
| execution | `.aios-core/core/execution` | — | operational |
| health-check | `.aios-core/core/health-check` | — | operational |
| ideation | `.aios-core/core/ideation` | — | operational |
| manifest | `.aios-core/core/manifest` | — | operational |
| mcp | `.aios-core/core/mcp` | — | operational |
| memory | `.aios-core/core/memory` | — | operational |
| migration | `.aios-core/core/migration` | — | operational |
| orchestration | `.aios-core/core/orchestration` | — | operational |
| permissions | `.aios-core/core/permissions` | — | operational |
| quality-gates | `.aios-core/core/quality-gates` | — | operational |
| registry | `.aios-core/core/registry` | — | operational |
| session | `.aios-core/core/session` | — | operational |
| ui | `.aios-core/core/ui` | — | operational |
| utils | `.aios-core/core/utils` | — | operational |
| docs | `.aios-core/core/docs` | — | operational |
| **synapse** | `.aios-core/core/synapse` | **@devops** | **positioned — pending story** |

*19th kernel module. Context injection engine. Design validator: @architect. Positioned by Neo 2026-03-02.*

---

## NEO GOVERNANCE COMMANDS

| Command | Task File | Description | Wraps |
|---------|-----------|-------------|-------|
| `*import-asset` | `.neo/tasks/neo-import-asset.md` | Import external asset with governance — technical diagnostic + 7-principle validation + board positioning before any execution | `import-asset` skill |
| `*fusion` | `.neo/tasks/neo-fusion.md` | Fuse two organizational assets into result C — A + B → C (irreversible). Governance: 7 principles + rollback path + board positioning of C before execution. Scope v1: squads. | `wf-squad-fusion.yaml` |

> **Import vs Fusion:** Import = A + B remain (coexistence). Fusion = A + B → C (replacement — A and B cease to exist). Fusion requires rollback path definition before execution begins.

---

## HEADCOUNT SUMMARY

| Category | Count |
|----------|-------|
| Core Agents | 13 |
| Claude Code Agents | 25 |
| MMOS Agents | 10 |
| Squad-Creator Agents | 4 |
| **Total Agents** | **52** |
| Cloned Minds | 27 |
| Departments | 4 + 1 module (mmos-squad, squad-creator, ralph, design + squad-creator-pro) |
| Pro-module context agents | 3 (scoped to squad-creator-pro/ — not standalone deployable) |
| Workflows | 15 (1 OPERATIONAL: book-to-intelligence) |
| Kernel Modules | 19 (18 operational + 1 positioned: synapse) |

*Source: `.neo/data/inventory.yaml` — cross-validated with REPO_PATH_MAP_v2*
*synapse (Syn) added 2026-03-09 — Level 5 Operations, P1-P3 validated by Neo*
*design squad formally positioned 2026-03-09 — 4th department, 8 agents, 89 tasks, 11 workflows. GAP-ORG-002 resolved.*
