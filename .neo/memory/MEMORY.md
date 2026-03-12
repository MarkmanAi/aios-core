# Neo Memory — Persistent Memory File

> **Maintained by:** Neo — The Matrix Architect
> **Location:** `.neo/memory/MEMORY.md` (single source of truth)
> **Rule:** Every Neo decision, finding, and organizational change MUST be recorded here.
> **On activation:** Read this file completely before responding to any command.

---

## SCHEMA — How to Write Entries

```
DECISIONS:    [YYYY-MM-DD] DECISION: ___ | REASON: ___ | ORG IMPACT: ___
MEMBERS:      [YYYY-MM-DD] TYPE: agent|mind|squad | NAME: ___ | ROLE: ___ | DEPT: ___ | APPROVED_BY: ___
PRINCIPLES:   [YYYY-MM-DD] SITUATION: ___ | PRINCIPLE: P{N} - {name} | RESULT: approved|vetoed | NOTE: ___
GAPS:         [YYYY-MM-DD] GAP: {id} | PRIORITY: critica|alta|media|baixa | STATUS: open|resolved | NOTE: ___
EVOLUTION:    [YYYY-MM-DD] CHANGE: ___ | BEFORE: ___ | AFTER: ___ | REASON: ___
AUDITS:       [YYYY-MM-DD] COMPONENT: ___ | TYPE: agent|mind|squad|workflow | STATUS: pass|warn|fail | FINDINGS: ___
DELEGATIONS:  [YYYY-MM-DD] TASK: ___ | DELEGATED_TO: ___ | STATUS: pending|complete | OUTCOME: ___
```

---

## Decisions

- [2026-03-11] DECISION: Create Epic 22 — Knowledge-ETL Pipeline Reliability | REASON: Team Topologies run (2026-03-11) expôs 4 falhas sistêmicas: reduce sem checkpoint, cache inválido aceito silenciosamente, sleeps fixos de 40min, parse failures por regex frágil. Briefing criado em docs/stories/briefs/epic-22-briefing.md. 4 stories criadas por @sm. | STORIES: 22.1 (checkpoint integrity), 22.2 (structured output), 22.3 (retry + token budget), 22.4 (haiku MAP + 2-pass reduce) | EXEC ORDER: 22.1 ∥ 22.3 → 22.2 → 22.4 | ORG IMPACT: pipeline reliability sobe de ~60% para ~99% em runs futuras. Custo L2 estimado -73%.

- [2026-03-11] DECISION: Team Topologies (Skelton & Pais) ETL pipeline complete [book 2/4] | L1: 2 principles (dedup-skipped) | L2: 25 frameworks, 37 heuristics, 46 anti_patterns, 33 triggers → .neo/kb/strategic/org-design.md | L3: voice+thinking+contradictions → matthew-skelton-manuel-pais/ sources | Pipeline fixes: EPUB chapter splitter (CHAPTER/PART regex), L3 refine context overflow, MAX_OUTPUT_REDUCE 8192→16384 | Commit: 3d9cf47 | ORG IMPACT: books_processed 1→2. GAP-KB-001 advances (2/4). org-design domain KB now populated.

- [2026-03-11] EPIC CLOSED: Epic 20 — Neo Strategic Council & Governance Advisor Pipeline | STORIES: 20.1 (ETL --advisor flag) + 20.2 (MMOS Governance Adapter) | RESULT: Tier B pipeline operational. Meadows GOVERNANCE ADVISOR ✅ (APEX 68). 4 MMOS agents updated (mind-mapper, identity-analyst, system-prompt-architect, emulator). *war-room command ready. Neo Strategic Council: 1 advisor operational, 3 pending pipeline. | ORG IMPACT: First *war-room invocation possible. GAP-KB-001 advances.

- [2026-03-11] DECISION: Donella Meadows Governance Advisor pipeline COMPLETE (Story 20.2 AC-5) | RESULT: governance-advisor-v1.0.md generated. APEX 68 [GOVERNANCE ADVISOR]. L6-L7 text-inferred (6 values, 6 obsessions — all HIGH/MEDIUM, zero fabrication). L8: ETL contradictions.json PRIMARY (7 paradoxes, verbatim quotes). <governance_frameworks> injected from .neo/kb/strategic/systems-thinking.md. Human checkpoint (P1-P4): PASS. ORGANOGRAMA updated: PENDING → GOVERNANCE ADVISOR ✅. @emulator auto-detect enabled via [GOVERNANCE ADVISOR MODE] marker. | ORG IMPACT: First Neo Strategic Council member operational. *war-room can now invoke Meadows as governance advisor. Pipeline: MMOS Governance Adapter (Story 20.2).

- [2026-03-11] DECISION: Create Neo Strategic Council + two-tier clone standard + *war-room command | REASON: MMOS treated all 27 consultants as one resource type. Two fundamentally different use cases exist: (A) personality emulation — voice, tone, persona; (B) frameworks & reasoning — mental models, decision heuristics, governance diagnosis. For organizational architecture decisions, Neo needs type-B advisors built from governance books, not type-A personality clones. Key insight: the distinction applies retroactively — even existing clones serve different purposes in different contexts. | RESULT: (1) .neo/data/clone-standards.md — Tier A Mind Clone (APEX≥70, 3+ sources) vs Tier B Governance Advisor (APEX≥55, 2+ written sources, L1-L5+L8, framework scope only). (2) ORGANOGRAMA Level 7 — Neo Strategic Council section added (4 advisors: Meadows, Skelton&Pais, Bungay, Grove). (3) NEO.md — *war-room command added (inline: reads .neo/kb/strategic/ → selects advisors → invokes @emulator with KB context). (4) Pending Stories for @sm: MMOS Governance Adapter pipeline + ETL --advisor flag + @emulator mode detection. | ORG IMPACT: council expands from 27→31 capacity (4 governance advisors pending pipeline). data_files 3→4 (clone-standards.md added). tasks_neo unchanged (war-room is inline, not task-backed).

- [2026-03-11] DECISION: First book pipeline complete — Thinking in Systems (Meadows) | RESULT: L1 (2 principles → strategic-principles.md), L2 (7 frameworks, 7 heuristics, 5 anti-patterns, 5 triggers → systems-thinking.md), L3 (Voice DNA + Thinking DNA + Contradictions → donella-h-meadows/). Faithfulness 96.3%. Commits cbed371 + 8fbb246. Pipeline fixes applied: assess cache, rate-limit sleeps (200-300s), faiss-cpu, Windows unicode. | ORG IMPACT: books_processed 0→1. donella-h-meadows positioned as potential future mind clone (L3 sources available). ORGANOGRAMA Processing Queue updated. GAP-KB-001 advances (1/4 books done).

- [2026-03-10] DECISION: Register Knowledge Library acquisition tools — `tools/zlib.py` + `tools/list_library.py` | REASON: Tools existed in repo but had no board position. They form the acquisition layer of the book-to-intelligence pipeline: zlib.py downloads books from Z-Library → books/ → knowledge-etl processes → .neo/kb/. Without these tools registered, the pipeline's input layer was invisible to organizational governance. | ORG IMPACT: inventory.yaml knowledge_assets.acquisition_tools: 2. ORGANOGRAMA NEO KNOWLEDGE BASE section updated with Acquisition Tools table. Pipeline now complete: acquire → extract → transform → validate → load.

- [2026-03-10] DECISION: Position Neo Knowledge Base upgrade — `.neo/kb/strategic/` + `strategic-principles.md` + 4-book Pareto processing queue | REASON: Neo governed entirely by intuition + 7 principles, with no systematic external framework grounding. *audit and *health commands lacked diagnostic vocabulary for leverage points, cognitive load, mission command gaps, managerial leverage. Gap identified and Pareto-analyzed by Neo using Strategic+Analytical strengths. 4 books cover ~80% of governance decision upgrade: Thinking in Systems (systems vocabulary), Team Topologies (org structure tool), The Art of Action (delegation philosophy), High Output Management (output measurement). 7-principle validation: P1 ✅ (ETL writes, @pedro-valerio audits, Neo reads — never same), P2 ✅ (faithfulness gate embedded), P3 ✅ (no duplicate of MEMORY.md), P4 ✅ (no value-laden decisions in book content), P6/P7 N/A. | ORG IMPACT: New `.neo/kb/` sub-territory created. `strategic-principles.md` registered in `.neo/data/`. inventory.yaml knowledge_assets section added. ORGANOGRAMA NEO KNOWLEDGE BASE section added. GAP-KB-001 registered and immediately positioned as in_progress. princípios-milenares test staging: DISCARDED. Execution: @dev cleans staging + runs pipeline starting with Thinking in Systems (Meadows).

- [2026-03-10] DECISION: Fuse squad-creator + squad-creator-pro → squad-creator v4.0.0 | REASON: 19 arquivos duplicados em 2 paths, squad.md atuando como translation layer, ambiguidade de path em toda contribuição futura. Coexistência era dívida, não arquitetura. Gap articulado: fonte única de autoridade para criação de squads, clonagem de mentes e fusão organizacional. | RESULT: squad-creator v4.0.0 — 5 agents, 48 tasks, 20 workflows, 8 configs, 31 data files, 25 scripts (com testes), minds/ heurísticos, benchmarks, assessments. squad-creator-pro ARCHIVED → squads/_archived/squad-creator-pro_2026-03-10/. Stub em squads/squad-creator-pro/README.md. Validation next: @qa. | ORG IMPACT: agents_squad_creator 4→5 (pedro-valerio absorbed), total_agents 52→53, pro_modules 1→0, departments 4 (squad-creator-pro deixa de existir como entidade).

- [2026-03-10] DECISION: Create missing /commands for 8 agents — squad + 7 chiefs | REASON: .claude/agents/ had 22 agents without /command entry point. Audit identified: squad (squad-creator-pro invisible), copy-chief, cyber-chief, data-chief, legal-chief, story-chief, tools-orchestrator, traffic-masters-chief. Created: .claude/commands/squad.md (Squad Architect Pro, 30 commands) + .claude/commands/chiefs/{7 files}. Pattern: activation instructions pointing to .claude/agents/{name}.md. Confirmed live in / menu. | ORG IMPACT: 8 agents now accessible via / slash command.

- [2026-03-10] DECISION: Full command surface diagnostic + sync for squad-creator v4.0.0 | REASON: Post-fusion audit revealed 3 missing commands (*quality-dashboard, *show-tools, *add-tool) and 2 specialist sections (@oalanicolas + @pedro-valerio with 8 commands total) invisible in both entry points. COMMANDS.md was source of truth. | RESULT: Both .claude/agents/squad.md and .claude/commands/squad.md updated. Total commands exposed: 30+. Specialist section added. Internal pipeline tasks (an-*, pv-*, collect-sources, etc.) confirmed as internal — not public commands. | ORG IMPACT: Squad Chief surface area complete. Zero broken paths. Zero undocumented specialists.

- [2026-03-10] DECISION: Update squad.md entry point to v4.0.0 paths | REASON: Post-fusion, .claude/agents/squad.md still referenced 13 broken paths pointing to archived squad-creator-pro/. Commands section and Knowledge Base section both corrupted. | RESULT: All paths corrected to squad-creator/. 4 new commands added (*qa-after-creation, *deep-research, *squad-fusion, *validate-workflow now backed by pv-audit.md). Workflow Location expanded from 6→12 workflows. Knowledge Base expanded from 7→10 refs (executor-decision-tree.md → executor-matrix-framework.md rename captured). | ORG IMPACT: Squad Chief entry point now 100% aligned with v4.0.0 territory.

- [2026-03-10] DECISION: Expand Squad Chief commands + import Tier B tasks | REASON: .claude/agents/squad.md exposed only 7 commands. squad-creator-pro had 11 tasks with no command entry point (extract-voice-dna, extract-thinking-dna, update-mind, auto-acquire-sources, optimize, squad-analytics, refresh-registry, create-task, create-template, create-workflow, sync). 3 missing tasks imported from squad-creator-new (discover-tools, upgrade-squad, create-pipeline). squad.md expanded: 7→30 commands. KB references added (best-practices, executor-decision-tree, squad-registry, HITL-FLOW). | ORG IMPACT: Squad Chief surface area 4x. All new commands backed by existing task files.

- [2026-03-10] DECISION: Selective merge squad-creator-new → squad-creator-pro (KB + docs + checklists) | REASON: squad-creator-new contained 34 files not present in squad-creator-pro: 11 formal frameworks in data/ (best-practices, executor-decision-tree, squad-registry, tier-system-framework, etc.), 19 documentation files in docs/ (tutorials, architecture diagrams, HITL flow, SOPs), 4 new checklists (agent-quality-gate, smoke-test-agent, squad-checklist, task-anatomy-checklist). All purely additive — no overwrites. SKIPPED: tool-registry.yaml (NEW=v2.0 outdated, CURRENT=v3.0), an-output-examples.yaml (6 bytes diff). | ORG IMPACT: squad-creator-pro data/ 22→33 files, docs/ 0→19 files (new dir), checklists/ 7→11 files. Knowledge base +625 KB.

- [2026-03-10] DECISION: Import memory-intelligence module (MIS) from mmos-private-NEW | REASON: Territory had no cross-session memory system. memory-intelligence fills GAP-INFRA real: session digest extraction, progressive 3-layer retrieval (Index 50t / Context 200t / Detail 1000t+), attention scoring (HOT/WARM/COLD), self-learning engine (MIS-5), rule auto-evolution (MIS-7). 13 files, 117 tests, 90.7% coverage. synapse-memory-provider.js deferred — depends on license/feature-gate, tied to SYNAPSE story. yaml npm package installed. | ORG IMPACT: kernel_module_dirs 19→20. New module: .aios-core/core/memory-intelligence/. ORGANOGRAMA + inventory updated.

- [2026-03-10] DECISION: Add *agent-fusion command to Neo — governance wrapper for organizational agent fusion | REASON: Agent fusion operations (A+B→C) had no organizational validation. Agents carry persona DNA, capability sets, and tool authority — merging them without governance risks persona conflicts, capability gaps, and authority violations. Created neo-agent-fusion.md extending the *fusion pattern (Story 18.1) to agents. Execution delegates to @dev + @sm (not @squad-chief). | ORG IMPACT: tasks_neo 9→10, total_tasks 247→248. *agent-fusion added to NEO.md governance commands. scope v2: agents only.

- [2026-03-10] DECISION: Add *fusion command to Neo — governance wrapper for organizational fusion | REASON: Fusion operations (A+B→C) had no organizational validation before entering the technical engine (wf-squad-fusion.yaml). The engine handles technical synthesis but lacks: board positioning of result C before execution, 7-principle validation (esp. P3-gap-verified, P3-org-position, P5-rollback), and MEMORY.md audit trail. Created neo-fusion.md task that wraps wf-squad-fusion.yaml with Neo governance layer. | ORG IMPACT: tasks_neo 8→9, total_tasks 246→247, neo_footprint.tasks corrected 7→9 (stale fix + neo-fusion). *fusion added to NEO.md governance commands. scope v1: squads only.

- [2026-03-10] DECISION: Import squad-creator-pro v3.1.0 as Option A module | REASON: Upgrade pack for squad-creator. 218 files installed at squads/squad-creator-pro/. All risks resolved: CRITICAL-1 (squad.md hooks already pointed correctly to pro path — also revealed current hooks were broken, import fixed them), WARNING-1 (incoming pedro-valerio.md is a persona document, P5 unaffected), WARNING-2 (5 overwritten tasks are improvements adding Veto Conditions + Checklist Refs — P2 compliance net positive). squad.md .claude/skills/ updated with pro version (hooks operational). 7 configs, 7 checklists, 22 data files, 20 scripts (with 17 tests), 2 mind heuristic packages (oalanicolas, pedro_valerio). sop-extractor subagent removed from squad.md (intentional — pedro-valerio takes validation role in pro). | ORG IMPACT: squads 4+1module. ORGANOGRAMA DEPARTMENTS updated with pro module entry. inventory.yaml pro_modules added.

- [2026-03-10] DECISION: Add *import-asset command to Neo — governance wrapper for import-asset skill | REASON: External assets arriving from forks/external repos had no organizational validation before entering the territory. The import-asset skill handled technical analysis only (dependencies, paths, conflicts). Neo governance layer (7 principles + board positioning) was missing. Created neo-import-asset.md task that: 1) calls import-asset skill for technical diagnostic, 2) classifies asset type (agent/squad/skill/module), 3) runs applicable principle checks, 4) forces board positioning for agents/squads, 5) approves or vetoes before execution, 6) updates ORGANOGRAMA post-import. | ORG IMPACT: tasks_neo 7→8, total_tasks 245→246. *import-asset added to NEO.md governance commands. import-asset skill formally linked as Neo dependency.

- [2026-03-09] DECISION: AC-4 NEO GATE — validated agent-neo domain file for SYNAPSE (Story 16.4) | REASON: Story 16.4 requires @neo to replace [NEO_VALIDATE] placeholders with accurate data from .neo/data/ sources. Values confirmed: compliance_score=0.82 (from gaps.yaml formula), GAP_TOP_0=GAP-MIND-006 (mitchell_hashimoto, high), GAP_TOP_1=GAP-INFRA-007 (synapse hook, medium), GAP_TOP_2=GAP-MIND-008 (don_norman, medium), DECISION_0-2 confirmed from MEMORY.md (design squad P1, brad-frost dual presence, synapse positioning). | ORG IMPACT: agent-neo domain file is now production-ready with accurate organizational state. All [NEO_VALIDATE] placeholders resolved.

- [2026-03-09] DECISION: P1 formalized for design squad — design-chief validated by @qa | REASON: design-chief (orchestrator) had no named validator. AIOS pattern: maker ≠ validator. @qa (Quinn) validates deliverables (completeness, acceptance criteria, quality gates). @architect (Aria) vetoes technical architecture decisions produced by the design squad. No new agents needed. | ORG IMPACT: squad.yaml design-chief gains validator: "@qa". P1 compliance: design-chief makes → @qa validates ✅.

- [2026-03-09] DECISION: Brad-frost dual presence approved as intentional pattern with invocation rule | REASON: brad-frost exists as Agent (Level 6, .claude/commands/Design/agents/brad-frost.md) AND as Mind (Level 7, squads/mmos-squad/minds/brad_frost/). These are structurally different interaction layers, not a conflict. Rule: tasks → @brad-frost (agent); strategy/philosophy → @emulator brad_frost (mind). | ORG IMPACT: squad.yaml brad-frost gains dual_presence: true + invocation_rule. ORGANOGRAMA Level 6 entry updated with dual presence note. Pattern can serve as precedent for other mind clones that also have agent representations.

- [2026-03-09] DECISION: Position synapse agent (Syn) at Level 5 — Operations | REASON: synapse.md exists as full agent (SYNAPSE Pipeline Operator) since 2026-03-04 but had no ORGANOGRAMA entry. Read .aios-core/development/agents/synapse.md — confirmed unique function: read-only operator for SYNAPSE context injection pipeline. P1 ✅ (@devops validates), P2 ✅ (no-modify veto in core_principles), P3 ✅ (unique: no agent operates SYNAPSE). | ORG IMPACT: agents_core 12→13, total_agents 51→52. GAP-ORG-003 resolved. Compliance 72→77.

- [2026-03-09] DECISION: Formally position squads/design/ as 4th department | REASON: Design System Squad v2.1.0 was imported via commit 781e627 (2026-03-09) with 8 agents, 89 tasks, 11 workflows, 14 checklists. Agents were already at Level 6 in ORGANOGRAMA. Department itself had no board entry (GAP-ORG-002). P3-org-position: formalization, not new creation — agents pre-validated by import QA. | ORG IMPACT: departments 3→4. ORGANOGRAMA DEPARTMENTS section updated. inventory.yaml squads 3→4. GAP-ORG-002 resolved. Compliance 77→82.

- [2026-03-08] DECISION: Position Ralph (Autonomous Loop Orchestrator) in org chart — Level 5 Operations, 3rd department (squads/ralph/) | REASON: Epic 14 requires org chart positioning FIRST per Constitution Article II. Ralph is unique — no existing agent runs autonomous bash loops with fresh Claude sessions per story. P1 ✅ P2 ⚠️ (tasks pending) P3 ✅ | ORG IMPACT: departments 2→3. inventory.yaml updated. ORGANOGRAMA.md updated. v1 skill deprecated to redirect. v2 delegation paths corrected (fictional skill names → real AIOS agents). Story 14.6 complete.

- [2026-03-02] DECISION: Position SYNAPSE as 19th kernel module | REASON: Context injection gap is real and grows with org size. No existing module manages selective rule injection. P1✅ P2✅ P3✅ P4✅. Owner: @devops. Design validator: @architect. Scope B (data + engine + hook). Path: .aios-core/core/synapse/ | ORG IMPACT: kernel_module_dirs 18→19. ORGANOGRAMA updated. Pending story creation → @pm.

- [2026-03-02] DECISION: Upgrade Neo to v3 Tiger Archetype + DNA Layer | REASON: v2 lacked authentic identity — enforced Gold Layer on mind clones but had none himself. DNA layer separates concerns correctly: operational structure in NEO.md (lean, 681 lines), deep personality in .neo/dna/ (5 files, 888 lines total). Same pattern used by MMOS minds. | ORG IMPACT: .neo/dna/ created as new sub-layer. Context Loading expanded from 5 → 10 files. Bridge file updated. Story 9.1 completed. Commit 8a6cf1b.

- [2026-02-28] DECISION: Position book-to-intelligence as Cross-Departmental workflow | REASON: Pipeline serves two departments simultaneously — Neo (L1 principles + L2 frameworks → .neo/kb/) and MMOS (L3 authorial DNA → minds/sources/). Single-department classification would misrepresent its role. | ORG IMPACT: Workflows 14→15. Resolves source gargalo for GAP-MIND-006, GAP-MIND-008, GAP-MIND-009. Accelerates mind cloning pipeline.



- [2026-02-21] DECISION: Create Neo — The Matrix Architect | REASON: AIOS lacked meta-organizational governance. No agent existed outside the org to see it whole. 49 agents operating without positioning enforcement, constitution guardian, or organizational health tracking. | ORG IMPACT: New META layer (.neo/) created at root level — 4th layer alongside .aios-core/, .claude/, and squads/.

- [2026-02-21] DECISION: Neo lives at .neo/ (root level), not inside any existing layer | REASON: .aios-core/ = infrastructure, .claude/ = integration, squads/ = departments. Neo is none of these — Neo is the architect who sees all three from outside. Placing him inside any layer would contradict his purpose. | ORG IMPACT: .neo/ established as the META layer. Precedent set: future meta-organizational tooling lives here.

- [2026-02-21] DECISION: Bridge pattern for Claude Code activation | REASON: Claude Code requires agents in .claude/agents/. Neo cannot live there (would make him a contractor, not an architect). Solution: thin bridge file at .claude/agents/neo.md points to .neo/NEO.md. Bridge is ~30 lines; full definition is in .neo/. | ORG IMPACT: Two-file pattern established. Bridge = activation mechanism. .neo/NEO.md = true identity.

- [2026-02-21] DECISION: Neo does NOT modify .aios-core/constitution.md directly | REASON: Separation of concerns. Neo proposes amendments; humans approve via PR. Prevents Meta layer from overriding the original constitution unilaterally. | ORG IMPACT: Amendment protocol established. Neo writes to .neo/CONSTITUICAO_MATRIX.md; proposes changes to .aios-core/constitution.md via human review.

- [2026-02-21] DECISION: inventory.yaml pre-populated with real repo counts, not legacy doc numbers | REASON: Legacy documentation had discrepancies vs real repo (46 vs 49 agents, etc.). Principle 3 (No Invention) requires all numbers to trace to verifiable source. | ORG IMPACT: inventory.yaml is ground truth. REPO_PATH_MAP_v2 (2026-02-22T01:44:45Z) is the authoritative reference.

- [2026-02-21] DECISION: gaps.yaml pre-populated with 20 real gaps from repo scan | REASON: Delivering an empty template when real gaps are known and verifiable violates Principle 3. Neo's first *health was executed during creation. | ORG IMPACT: Compliance score 47/100 on day one. Organization is operational but governance layer and 11 council minds are incomplete.

---

## New Members Approved

- [2026-03-09] TYPE: agent | NAME: synapse (Syn) | ROLE: SYNAPSE Pipeline Operator | DEPT: Level 5 Operations | APPROVED_BY: neo
  - Path: .aios-core/development/agents/synapse.md
  - Reports to: @devops (SYNAPSE kernel owner)
  - Validator: @devops (P1 ✅)
  - Function: diagnoses, monitors, reports on SYNAPSE context injection pipeline — read-only by design
  - P2: core_principles "Never modify pipeline files directly" = veto condition ✅
  - P3: unique — no other agent operates the SYNAPSE pipeline ✅
  - Created 2026-03-04, positioned retroactively 2026-03-09 (GAP-ORG-003 resolved)

- [2026-03-08] TYPE: agent | NAME: ralph | ROLE: Autonomous Loop Orchestrator | DEPT: ralph (Level 5 Operations) | APPROVED_BY: neo
  - Squad: squads/ralph/ — 3rd department in the organization
  - P1 ✅ @qa validates (14.5 + 14.7 owned by Quinn)
  - P2 ⚠️ tasks pending creation (Stories 14.1-14.4) — acceptable WARN, not BLOCK
  - P3 ✅ unique function: external bash loop + fresh session per story + state via files
  - gitEnabled=false default — human controls push (P4 ✅)
  - Delegation: AIOS:agents:dev/architect/qa/ux-design-expert + mmos-squad:mind-mapper

- [2026-02-23] TYPE: mind | NAME: cagan_patton | ROLE: Product & Design consultant (combo_strategic) | DEPT: council | APPROVED_BY: human
  - Pipeline: 97.8% fidelity (4 cenários, EXCEEDS TARGET). Layer 8 Gold Layer validated. L6-L8 checkpoint approved 2026-02-23.
  - Combo único: end-to-end product thinking (Cagan strategy + Patton decomposition). 3 system prompt variants.
  - GAP-MIND-007 resolved — gap estava desatualizado (pipeline completo desde 2025-10-30).

- [2026-02-24] TYPE: mind | NAME: kent_beck | ROLE: Software Engineering consultant (TDD, XP, dev philosophy) | DEPT: council — Product & Design | APPROVED_BY: human
  - Pipeline repaired 2026-02-24. Fidelity 93%. 5 primary sources. GAP-MIND-005 resolved.

- [2026-02-23] TYPE: agent | NAME: thiago_finch | ROLE: Business Strategy & Marketing Architect (Funnel-First) | DEPT: squad-creator (Level 4B) | APPROVED_BY: neo
  - Completes squad-creator trio: oalanicolas (inputs) + pedro-valerio (structure) + thiago_finch (direction)
  - Also enriched as MMOS mind clone: fidelity_score 8.7 → 9.0, pipeline_version 3.5 → 3.6
  - Principles validated: P1 ✅ P2 ✅ P3 ✅ P6 ✅

---

## Principles Applied

- [2026-02-21] SITUATION: Building inventory.yaml — legacy docs had 46 agents, real repo showed 49 | PRINCIPLE: P3 - No Invention | RESULT: approved — used real repo count (49), documented discrepancy | NOTE: squad-creator agents (oalanicolas, sop-extractor, squad-architect) were undercounted in all legacy docs.

- [2026-02-21] SITUATION: gaps.yaml originally designed as empty template | PRINCIPLE: P3 - No Invention | RESULT: approved — pre-populated with 20 verified gaps from direct repo scan | NOTE: Delivering known gaps as empty template would be omission of verified fact.

- [2026-02-21] SITUATION: kent_beck and mitchell_hashimoto have system_prompts but 0 artifacts and 0 sources | PRINCIPLE: P3 - No Invention + P7 - The Gold Layer | RESULT: vetoed (flagged as GAP-MIND-005, GAP-MIND-006) | NOTE: System prompts generated from training data without source collection or 8-layer analysis = fabricated clone. Must restart pipeline from sources.

- [2026-02-21] SITUATION: marty_cagan has system_prompts without artifacts (19 sources exist) | PRINCIPLE: P3 - No Invention | RESULT: vetoed (flagged as GAP-MIND-004) | NOTE: Pipeline order violated. System prompts must be backed by artifact analysis, not generated in parallel.

- [2026-02-21] SITUATION: pedro-valerio agent definition — verifying read-only tool enforcement | PRINCIPLE: P5 - Read-Only Auditor | RESULT: approved — .claude/agents/pedro-valerio.md confirms tools: Read, Grep, Glob only. permissionMode: default (not bypassPermissions). | NOTE: Principle 5 is correctly enforced at the tooling level.

---

## Gaps

<!-- Summary reference — full detail in .neo/data/gaps.yaml -->
<!-- On *health run: update gaps.yaml first, then sync summary here -->

- [2026-02-21] GAP: GAP-INFRA-001 | PRIORITY: critica | STATUS: **resolved 2026-02-23** | NOTE: .neo/ meta-layer deployed.
- [2026-02-21] GAP: GAP-INFRA-002 | PRIORITY: alta | STATUS: **resolved 2026-02-23** | NOTE: CLAUDE.md Matrix Vision section added.
- [2026-02-21] GAP: GAP-INFRA-003 | PRIORITY: media | STATUS: **resolved 2026-02-23** | NOTE: docs/architecture/matrix-vision.md created.
- [2026-02-21] GAP: GAP-INFRA-004 | PRIORITY: alta | STATUS: **resolved 2026-02-23** | NOTE: .claude/commands/neo/ created.
- [2026-02-21] GAP: GAP-INFRA-005 | PRIORITY: baixa | STATUS: open | NOTE: agent-memory mirror — monitoring (Decision D1).
- [2026-02-21] GAP: GAP-INFRA-006 | PRIORITY: baixa | STATUS: open | NOTE: neo-position-check.py hook deferred (Decision D4).
- [2026-02-21] GAP: GAP-DOC-001 | PRIORITY: alta | STATUS: **resolved 2026-02-23** | NOTE: total_agents corrected to 49.
- [2026-02-21] GAP: GAP-DOC-002 | PRIORITY: baixa | STATUS: open | NOTE: skills cited as 5, real = 8.
- [2026-02-21] GAP: GAP-DOC-003 | PRIORITY: baixa | STATUS: open | NOTE: kernel module counts off.
- [2026-02-23] GAP: GAP-DOC-004 | PRIORITY: media | STATUS: **resolved 2026-02-23** | NOTE: inventory.yaml corrected to agents_claude_code=25, total_agents=50.
- [2026-02-23] GAP: GAP-ORG-001 | PRIORITY: media | STATUS: **resolved 2026-02-23** | NOTE: squad-architect confirmed present in ORGANOGRAMA.md Level 4B — gap was already resolved, formally closed.
- [2026-02-21] GAP: GAP-MIND-001 through GAP-MIND-011 | STATUS: open | NOTE: 11 minds with incomplete pipelines. See gaps.yaml for detail.
- [2026-02-23] GAP: GAP-MIND-004 | PRIORITY: alta | STATUS: **resolved 2026-02-23** | NOTE: Gap was OUTDATED — marty_cagan pipeline complete since 2025-10-30. All artifacts, synthesis, system prompts, validation present. 87% fidelity. Only KB incomplete (1/55 chunks, non-blocking).
- [2026-02-23] GAP: GAP-MIND-010 | PRIORITY: media | STATUS: **resolved 2026-02-23** | NOTE: jeff_patton — human checkpoints 3+4 approved. Pipeline PRODUCTION APPROVED. Fidelity 94.25%, score 4.8/5.0.

---

## Organizational Evolution

- [2026-03-10] CHANGE: Neo Knowledge Base positioned as new sub-territory | BEFORE: `.neo/` had no strategic knowledge layer — Neo's decisions were intuition + 7 principles only | AFTER: `.neo/kb/strategic/` (4 domains: systems-thinking, org-design, governance, multi-agent-systems) + `.neo/data/strategic-principles.md` (L1 principles). Input: knowledge-etl/ pipeline (book-to-intelligence workflow). Processing queue: 4 books in Pareto Tier 1 sequence. | REASON: Pareto analysis revealed 4 books cover ~80% of Neo's governance decision upgrade. Meadows gives systems vocabulary, Skelton gives org structure framework, Bungay gives delegation philosophy, Grove gives output measurement system. Pipeline already built (book-to-intelligence, Story 8.2, OPERATIONAL since 2026-03-01). GAP-KB-001 registered, in_progress. Compliance 82→77 (recovers to 82 when KB completes).

- [2026-03-10] CHANGE: squad-creator-pro module installed | BEFORE: squad-creator (4 agents, 16 tasks, 5 workflows) | AFTER: squad-creator + squad-creator-pro module (3 context-agents, 34 tasks, 15 workflows, 7 configs, 7 checklists, 22 data files, 20 scripts, 2 mind heuristic pkgs). .claude/skills/squad.md upgraded to pro version. Hooks operational (fixed pre-existing broken hook paths). Option A: module positioning. | ORG IMPACT: pro_modules counter created (1). ORGANOGRAMA DEPARTMENTS section updated.

- [2026-03-09] CHANGE: 4th department formally positioned — design squad | BEFORE: 3 departments (mmos-squad, squad-creator, ralph) | AFTER: 4 departments (+ squads/design/) | REASON: Design System Squad v2.1.0 was imported via commit 781e627 but department was never formally registered in ORGANOGRAMA. Neo formal approval and positioning executed. 8 agents (design-chief, brad-frost, dave-malouf, dan-mall, ds-token-architect, ds-foundations-lead, storybook-expert, nano-banana-generator). GAP-ORG-002 resolved. Compliance 77→82.

- [2026-03-08] CHANGE: 3rd department created — ralph squad | BEFORE: 2 departments (mmos-squad, squad-creator) | AFTER: 3 departments (+ squads/ralph/) | REASON: Epic 14 — Ralph Autonomous Loop Full Implementation. Story 14.6 executed. Constitution Article II complied. Delegation paths corrected from fictional skills → real AIOS agent paths.

- [2026-03-01] CHANGE: book-to-intelligence workflow status updated to OPERATIONAL | BEFORE: positioned (2026-02-28), technically uncommitted | AFTER: Python package committed (30 files, commit 983ee3c) — pipeline fully executable. Story 8.2: L3 now produces RAG-ready `chunks/*.md` with YAML frontmatter (P2) + prompt cache for STUFF strategy ~60% cost reduction (P4). QA approved (29/29 tests). @devops pushed to main. | ORG IMPACT: ORGANOGRAMA.md workflow entry updated to OPERATIONAL. First cross-departmental workflow to reach production status.

- [2026-03-02] CHANGE: Neo upgraded v2 → v3 (Tiger Archetype) | BEFORE: Generic Matrix Architect persona (556 lines, no DNA layer, icon 🔴) | AFTER: Tiger of the Matrix persona (681 lines, 5 DNA files in .neo/dna/, icon 🐅, CliftonStrengths wiring, Voice DNA, Thinking DNA, Gold Layer, Operational Modes) | REASON: Neo v2 was a governance bot. v3 encodes authentic identity from creator's CliftonStrengths assessment — Intellection #1, Strategic #2, Achiever #3, Positivity #4, Analytical #5. Follows Neo's own standard: he requires Gold Layer from every mind clone. He now embodies it himself.

- [2026-02-28] CHANGE: Workflows count updated | BEFORE: 14 | AFTER: 15 | REASON: book-to-intelligence pipeline (knowledge-etl/) formally positioned as Cross-Departmental workflow serving Neo (L1/L2) + MMOS (L3). All 7 principle checks passed.



- [2026-02-21] CHANGE: AIOS layer architecture expanded | BEFORE: 3 layers (.aios-core/ infrastructure, .claude/ integration, squads/ departments) | AFTER: 4 layers (+ .neo/ meta-organizational) | REASON: No layer existed outside the organization to govern it.

- [2026-02-21] CHANGE: Agent headcount corrected | BEFORE: 46 (legacy documentation) | AFTER: 49 (real repo — REPO_PATH_MAP_v2) | REASON: squads/squad-creator/agents/ had 3 undocumented agents.

- [2026-02-23] CHANGE: Agent headcount corrected (2nd pass) | BEFORE: 49 | AFTER: 50 | REASON: GAP-DOC-004 — neo.md bridge added to .claude/agents/ not counted in initial scan.

- [2026-02-24] CHANGE: Agent headcount corrected (3rd pass — canonical) | BEFORE: 50 | AFTER: 51 | REASON: thiago_finch added to squad-creator (agents_squad_creator: 3→4). inventory.yaml note was stale. All 3 canonical files (inventory, constitution, organograma) now consistently show 51.

---

## Audits

- [2026-03-09] COMPONENT: Full organization | TYPE: health_check | STATUS: warn | FINDINGS: 5 new gaps. Compliance 72/100 (↓ from 87). New: GAP-ORG-002 squads/design/ unpositioned dept (4th dept, 8 agents, 90+ tasks, alta); GAP-ORG-003 synapse.md agent not in ORGANOGRAMA (alta); GAP-INFRA-007 synapse-precompact.js hook (media); GAP-MIND-012 napoleon_hill pipeline files complete but L6-L8 uncertified (media); GAP-MIND-013 adriano_de_marqui PIPELINE-COMPLETE predates Neo (baixa). Positive: ralph structure in place, 8 production minds confirmed, adriano_de_marqui+napoleon_hill likely 9th+10th production. 2/5 principle sample fully compliant. UPDATE: GAP-ORG-002 resolved same session → compliance 82/100.

- [2026-02-21] COMPONENT: Full organization (baseline) | TYPE: health_check | STATUS: warn | FINDINGS: 21 gaps identified. Compliance 27/100. Critical: .neo/ meta-layer missing. Council: 11/27 minds with incomplete pipeline. See gaps.yaml.

- [2026-02-23] COMPONENT: Full organization (2nd check) | TYPE: health_check | STATUS: warn | FINDINGS: 5 gaps resolved (INFRA-001,002,003,004 + DOC-001), 1 new (DOC-004: neo.md bridge makes CC agents 25/total 50). Compliance 52/100 (up from 27). Zero critical gaps. 11 minds still incomplete. Principle sampling: 5/5 pass (dev P1, qa P1, sm P2, elon_musk council position, spec-pipeline P2).

- [2026-02-23] COMPONENT: cagan_patton (mind) | TYPE: mind | STATUS: pass | FINDINGS: Pipeline complete since 2025-10-30 (97.8% fidelity). All 8 layers. Layer 8 Gold Layer validated. L6-L8 human checkpoint approved 2026-02-23. GAP-MIND-007 was OUTDATED. PRODUCTION APPROVED.

- [2026-02-23] COMPONENT: Full organization (3rd check — end of session) | TYPE: health_check | STATUS: warn | FINDINGS: 6 minds now PRODUCTION (jeff_patton, marty_cagan, thiago_finch, brad_frost, joao_lozano, pedro_valerio). Compliance 80/100 (up from 52). Open: 2 alta (kent_beck, mitchell_hashimoto — P3+P7 violations), 3 media (cagan_patton, don_norman, guillermo_rauch — source gaps), 4 baixa (infra/doc cosmetic). Next target: cagan_patton (quick win).

- [2026-02-24] COMPONENT: kent_beck (mind) | TYPE: mind | STATUS: pass | FINDINGS: Pipeline repaired. 5 primary sources (1.94MB): TDD, Tidy First, XP 1st+2nd Ed, Smalltalk Guide. 10-file analysis (L1-L8). L6-L8 human checkpoint recorded. Fidelity 93% (pre-repair: 53%). Generalista v1.0 + Dev-Workflow v1.1 delivered. P3 ✅ P4 ✅ P7 ✅. GAP-MIND-005 RESOLVED. Compliance: 87/100.

- [2026-02-21] COMPONENT: pedro-valerio (agent) | TYPE: agent | STATUS: pass | FINDINGS: P5 Read-Only Auditor confirmed. tools: [Read, Grep, Glob]. permissionMode: default. Principle 5 correctly enforced.

- [2026-02-21] COMPONENT: kent_beck (mind) | TYPE: mind | STATUS: fail | FINDINGS: system_prompt exists with 0 sources and 0 artifacts. P3 and P7 violated. Clone is fabricated.

- [2026-02-23] DECISION: Opção B (Repair) approved for kent_beck and mitchell_hashimoto | REASON: Both cover unique domains (dev philosophy + infra philosophy). Estimated 15-25h per mind. Value: roundtables with jeff_patton (kent_beck), infra debates (mitchell_hashimoto). | ORG IMPACT: When complete, council will have 9/27 consultants in production. Compliance ~86/100.

---

## Delegations

- [2026-03-02] TASK: Implement Story 9.1 — Neo v3 Tiger Archetype & DNA Layer | DELEGATED_TO: @dev (Dex) | STATUS: complete | OUTCOME: 7 files deployed. .neo/dna/ created with 5 verbatim DNA files. NEO.md v2→v3 (556→681 lines). Bridge .claude/agents/neo.md updated (hardcoded context list removed). All 6 ACs verified. Commit 8a6cf1b pushed to main 2026-03-02. @qa gate: PASS. @devops push: confirmed.


- [2026-02-23] TASK: Repair incomplete mind pipelines (GAP-MIND-004, GAP-MIND-010) | DELEGATED_TO: mind-mapper | STATUS: complete | OUTCOME: GAP-MIND-004 (marty_cagan) — pipeline was already complete since 2025-10-30, original gap flag was OUTDATED. Artifacts exist. Only KB incomplete (1/55 chunks, non-blocking). GAP-MIND-010 (jeff_patton) — checkpoints 3+4 approved by human 2026-02-23. Pipeline PRODUCTION APPROVED. Fidelity 94.25%, score 4.8/5.0.

- [2026-02-23] TASK: Repair kent_beck + mitchell_hashimoto — Opção B | DELEGATED_TO: mind-mapper (+ research-specialist, cognitive-analyst, identity-analyst, system-prompt-architect) | STATUS: complete (kent_beck) / in_progress (mitchell_hashimoto) | OUTCOME: kent_beck PRODUCTION APPROVED 2026-02-24. 93% fidelity. 5 primary sources (1.94MB). L6-L8 checkpoint recorded. GAP-MIND-005 resolved. mitchell_hashimoto pending.

- [2026-02-23] TASK: Resolve all 9 open mind pipeline gaps (GAP-MIND-001,002,003,005,006,007,008,009,011) | DELEGATED_TO: mind-mapper (+ mind-pm for pipeline state) | STATUS: in_progress | OUTCOME: partial
  - RESOLVED: thiago_finch (GAP-MIND-003) — PRODUCTION APPROVED, fidelity 9.0, enriched 2026-02-23
  - RESOLVED: brad_frost (GAP-MIND-001) — PRODUCTION APPROVED, system-prompt Generalista v1.0 confirmed 2026-02-23
  - RESOLVED: pedro_valerio (GAP-MIND-011) — PRODUCTION APPROVED 2026-02-23. Validation 9.0/10. L2+L6=10/10. All 5 paradoxes validated.
  - RESOLVED: joao_lozano (GAP-MIND-002) — PRODUCTION APPROVED 2026-02-23. Validation 9.0/10. All 8 modules preserved. Atlas Neural 10 techniques intact.
  - OPEN BATCH-B (principle risk): kent_beck, mitchell_hashimoto — fabricated system prompts, MUST restart from sources (P3+P7)
  - OPEN BATCH-C (source gaps): don_norman, guillermo_rauch — need 2+ sources before pipeline
  - NEXT TARGET: cagan_patton (GAP-MIND-007) — 3 system_prompts + 2 sources, needs artifact pipeline. Quick win.
