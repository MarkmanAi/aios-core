# Living Org Chart — AIOS Organization
## Last updated: 2026-03-10 (Neo KB upgrade positioned)
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
| **oalanicolas** (dept) | DNA operations (squad scope) | `squads/squad-creator/agents/oalanicolas.md` | Homonym of Claude Code agent — Pro version (B wins, 2026-03-10 fusion) |
| **sop-extractor** (dept) | SOP operations (squad scope) | `squads/squad-creator/agents/sop-extractor.md` | Homonym of Claude Code agent |
| **thiago_finch** (dept) | Business Strategy & Marketing — Funnel-First | `squads/squad-creator/agents/thiago_finch.md` | Pro version (B wins, 2026-03-10 fusion) |
| **pedro-valerio** (dept) | Process Auditor — veto conditions, workflow validation | `squads/squad-creator/agents/pedro-valerio.md` | Absorbed from squad-creator-pro (2026-03-10 fusion) |

*Note: thiago_finch also exists as MMOS mind clone (Level 7). pedro-valerio absorbed from squad-creator-pro in 2026-03-10 fusion. squad-creator-pro archived → squads/_archived/squad-creator-pro_2026-03-10/*

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

## LEVEL 7 — COUNCIL OF CONSULTANTS (27 Cloned Minds + Neo Strategic Council)

> **Two tiers of council members.** See `.neo/data/clone-standards.md` for full specification.
> **Tier A — Mind Clone** `✅ PRODUCTION`: full persona emulation (3+ sources, APEX ≥ 70, L1-L8)
> **Tier B — Governance Advisor** `📚 GOVERNANCE ADVISOR`: frameworks & reasoning only (2+ written sources, APEX ≥ 55, L1-L5+L8)

---

### 🐅 NEO STRATEGIC COUNCIL — Governance Advisors (Tier B)

> Curated exclusively for Neo's organizational architecture and governance decisions.
> Invoked via `*war-room {question}` — Neo auto-selects + injects KB context.
> Standard: Governance Advisor (`.neo/data/clone-standards.md` Tier B)
> Pipeline: MMOS Governance Adapter (Story TBD — @sm to create)

| Advisor | Domain | Book Source | ETL Status | Pipeline Status |
|---------|--------|-------------|------------|----------------|
| **Donella Meadows** | Systems Thinking — leverage points, feedback loops, stocks/flows | Thinking in Systems | ✅ L1+L2+L3 done (Story 20.1+20.2) | 📚 GOVERNANCE ADVISOR ✅ APEX 68 · `governance-advisor-v1.0.md` · checkpoint approved 2026-03-11 |
| **Matthew Skelton & Manuel Pais** | Org Design — cognitive load, Conway's Law, team topology | Team Topologies (2nd Ed.) | ✅ L1+L2+L3 done (2026-03-11) | 📚 PENDING pipeline |
| **Stephen Bungay** | Governance & Delegation — 3 gaps, Mission Command, directed opportunism | The Art of Action | ⏳ book pending | 📚 PENDING |
| **Andrew Grove** | Output Management — managerial leverage, OKRs, task-relevant maturity | High Output Management | ⏳ book pending | 📚 PENDING |

*Expansion candidates: Taleb (Antifragile), Laloux (Reinventing Organizations), Dibia (Multi-Agent Systems)*

---

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
| **squad-creator** | `squads/squad-creator/` | Squad Chief | 5 | 48 |
| **ralph** | `squads/ralph/` | Ralph | 1 | 7 |
| **design** | `squads/design/` | Design Chief | 8 | 89 |
| **sop-factory** | `squads/sop-factory/` | sop-chief (Deming) | 6 | 10 |

> **design squad** — Agent files at `.claude/commands/Design/agents/` (8 agents: design-chief, brad-frost, dave-malouf, dan-mall, ds-token-architect, ds-foundations-lead, storybook-expert, nano-banana-generator). Tasks at `squads/design/tasks/` (89 tasks). Note: `squads/design/agents/` intentionally absent — agents registered via `.claude/commands/Design/` IDE sync pattern.

> **sop-factory v1.0.0** — 5th department, imported 2026-03-15. SOP lifecycle: creation, extraction, analysis, audit, ML format conversion. Methodologies: Deming, Gawande, Juran, Toyota/TPS, ISO 9001, FDA/GMP, Six Sigma. Entry point: `.claude/agents/sop-chief.md`. Agents: sop-chief (Deming), sop-analyst, sop-creator, sop-ml-architect, sop-extractor (Ohno), sop-auditor (Crosby). P1 ✅ creator → auditor validates. Reports to: aios-master. Validates: @qa + @architect.

> **squad-creator v4.0.0** — Unified squad (2026-03-10 fusion). Absorbed squad-creator-pro capabilities: 5 agents, 48 tasks, 20 workflows, 8 configs, 31 data files, 25 scripts (with tests), minds/ heuristics, benchmarks, assessments. squad-creator-pro archived → `squads/_archived/squad-creator-pro_2026-03-10/`. Stub at `squads/squad-creator-pro/README.md`.

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
| **memory-intelligence** | `.aios-core/core/memory-intelligence` | **@devops** | **operational — imported 2026-03-10** |

*19th kernel module. Context injection engine. Design validator: @architect. Positioned by Neo 2026-03-02.*
*20th kernel module. Memory Intelligence System (MIS): session-digest extraction, progressive retrieval (3 layers), attention scoring, self-learning, rule proposals. Source: mmos-private-NEW. synapse-memory-provider.js deferred — pending SYNAPSE story.*

---

## NEO GOVERNANCE COMMANDS

| Command | Task File | Description | Wraps |
|---------|-----------|-------------|-------|
| `*import-asset` | `.neo/tasks/neo-import-asset.md` | Import external asset with governance — technical diagnostic + 7-principle validation + board positioning before any execution | `import-asset` skill |
| `*fusion` | `.neo/tasks/neo-fusion.md` | Fuse two organizational assets into result C — A + B → C (irreversible). Governance: 7 principles + rollback path + board positioning of C before execution. Scope v1: squads. | `wf-squad-fusion.yaml` |
| `*agent-fusion` | `.neo/tasks/neo-agent-fusion.md` | Fuse two agents into Agent C — A + B → C (new, unique persona+capabilities). Governance: 7 principles + rollback path + org positioning of C before execution. Scope v2: agents. | `@dev + @sm (execution protocol)` |

> **Import vs Fusion:** Import = A + B remain (coexistence). Fusion = A + B → C (replacement — A and B cease to exist). Fusion requires rollback path definition before execution begins.

---

## NEO KNOWLEDGE BASE

> Neo's strategic intelligence layer — built from curated books via `knowledge-etl/` pipeline.
> **Writer**: `knowledge-etl/` (automated Python pipeline). **Reader**: Neo. **Auditor**: @pedro-valerio (read-only).
> P1 verified: writer ≠ auditor. Content governed by faithfulness validation (Haiku gate, quote-first extraction).
> Positioned by Neo 2026-03-10. Approved by: human + Neo 7-principle validation.

### L1 — Operational Principles

| Asset | Path | Format | Status |
|-------|------|--------|--------|
| **strategic-principles.md** | `.neo/data/strategic-principles.md` | One principle per entry: principle · action · attribution · source_quote · chapter_ref | POSITIONED — pending first book |

*Neo queries this file during `*audit`, `*health`, `*create-dept`, `*reorg` to ground decisions in verified external frameworks.*

### L2 — Strategic Knowledge Base

| Domain | Path | Books feeding this domain | Status |
|--------|------|--------------------------|--------|
| **systems-thinking** | `.neo/kb/strategic/systems-thinking.md` | Thinking in Systems (Meadows), Antifragile (Taleb) | POSITIONED — pending |
| **org-design** | `.neo/kb/strategic/org-design.md` | Team Topologies (Skelton & Pais), Reinventing Organizations (Laloux) | POSITIONED — pending |
| **governance** | `.neo/kb/strategic/governance.md` | The Art of Action (Bungay), High Output Management (Grove) | POSITIONED — pending |
| **multi-agent-systems** | `.neo/kb/strategic/multi-agent-systems.md` | Designing Multi-Agent Systems (Dibia), AI Engineering (Huyen) | POSITIONED — pending |

*Format per file: XML boundaries + Markdown content. Each framework entry includes: name · description · components · when_to_use · source_quote.*

### Acquisition Tools (Knowledge Library CLI)

| Tool | Path | What it does | Destination |
|------|------|-------------|-------------|
| **zlib.py** | `tools/zlib.py` | Z-Library CLI — login, search, filter (format/lang), download with progress bar | `books/` (auto-created) |
| **list_library.py** | `tools/list_library.py` | Local catalog — lists and groups downloaded books by category | reads `books/` |

*Credentials: `ZLIB_EMAIL` + `ZLIB_PASSWORD` in root `.env`. Auth: cookie-based session. Positioned by Neo 2026-03-10.*
*Workflow: `zlib.py search + download` → `books/{file}` → `knowledge-etl process` → `.neo/kb/strategic/` + `.neo/data/strategic-principles.md`*

### Processing Queue — Pareto Tier 1 (4 books)

| # | Book | Author | L1 | L2 Domain | L3 Clone | Model Strategy |
|---|------|--------|----|-----------|----|----------------|
| 1 | **Thinking in Systems** | Donella Meadows | ✅ | systems-thinking | ✅ L3 extracted (donella-h-meadows/) | **DONE** — 2026-03-11 · 96.3% faithfulness |
| 2 | **Team Topologies** (2nd Ed.) | Skelton & Pais | ✅ | org-design | ❌ | Sonnet L1/L2 |
| 3 | **The Art of Action** | Stephen Bungay | ✅ | governance | ❌ | Sonnet L1/L2 |
| 4 | **High Output Management** | Andrew Grove | ✅ | governance | ❌ | Sonnet L1/L2 |

*Sequence approved by Neo 2026-03-10. Pareto logic: 4 books cover systems thinking (foundation), org structure (design tool), governance philosophy (delegation), output measurement (health metric) — ~80% of Neo's governance decision upgrade.*
*L3 for Meadows: future candidate. Thinking in Systems is primary source. Posthumous clone feasible — requires book + interviews/essays (P3 triangulation).*
*Princípios-milenares staging: DISCARDED (test run, not in approved queue).*

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
| Departments | 4 (mmos-squad, squad-creator v4.0.0, ralph, design) |
| Workflows | 15 (1 OPERATIONAL: book-to-intelligence) |
| Kernel Modules | 20 (19 operational + 1 positioned: synapse; memory-intelligence imported 2026-03-10) |

*Source: `.neo/data/inventory.yaml` — cross-validated with REPO_PATH_MAP_v2*
*synapse (Syn) added 2026-03-09 — Level 5 Operations, P1-P3 validated by Neo*
*design squad formally positioned 2026-03-09 — 4th department, 8 agents, 89 tasks, 11 workflows. GAP-ORG-002 resolved.*
