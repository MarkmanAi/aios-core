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

- [2026-03-01] CHANGE: book-to-intelligence workflow status updated to OPERATIONAL | BEFORE: positioned (2026-02-28), technically uncommitted | AFTER: Python package committed (30 files, commit 983ee3c) — pipeline fully executable. Story 8.2: L3 now produces RAG-ready `chunks/*.md` with YAML frontmatter (P2) + prompt cache for STUFF strategy ~60% cost reduction (P4). QA approved (29/29 tests). @devops pushed to main. | ORG IMPACT: ORGANOGRAMA.md workflow entry updated to OPERATIONAL. First cross-departmental workflow to reach production status.

- [2026-03-02] CHANGE: Neo upgraded v2 → v3 (Tiger Archetype) | BEFORE: Generic Matrix Architect persona (556 lines, no DNA layer, icon 🔴) | AFTER: Tiger of the Matrix persona (681 lines, 5 DNA files in .neo/dna/, icon 🐅, CliftonStrengths wiring, Voice DNA, Thinking DNA, Gold Layer, Operational Modes) | REASON: Neo v2 was a governance bot. v3 encodes authentic identity from creator's CliftonStrengths assessment — Intellection #1, Strategic #2, Achiever #3, Positivity #4, Analytical #5. Follows Neo's own standard: he requires Gold Layer from every mind clone. He now embodies it himself.

- [2026-02-28] CHANGE: Workflows count updated | BEFORE: 14 | AFTER: 15 | REASON: book-to-intelligence pipeline (knowledge-etl/) formally positioned as Cross-Departmental workflow serving Neo (L1/L2) + MMOS (L3). All 7 principle checks passed.



- [2026-02-21] CHANGE: AIOS layer architecture expanded | BEFORE: 3 layers (.aios-core/ infrastructure, .claude/ integration, squads/ departments) | AFTER: 4 layers (+ .neo/ meta-organizational) | REASON: No layer existed outside the organization to govern it.

- [2026-02-21] CHANGE: Agent headcount corrected | BEFORE: 46 (legacy documentation) | AFTER: 49 (real repo — REPO_PATH_MAP_v2) | REASON: squads/squad-creator/agents/ had 3 undocumented agents.

- [2026-02-23] CHANGE: Agent headcount corrected (2nd pass) | BEFORE: 49 | AFTER: 50 | REASON: GAP-DOC-004 — neo.md bridge added to .claude/agents/ not counted in initial scan.

- [2026-02-24] CHANGE: Agent headcount corrected (3rd pass — canonical) | BEFORE: 50 | AFTER: 51 | REASON: thiago_finch added to squad-creator (agents_squad_creator: 3→4). inventory.yaml note was stale. All 3 canonical files (inventory, constitution, organograma) now consistently show 51.

---

## Audits

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
