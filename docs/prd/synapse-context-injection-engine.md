# SYNAPSE — Context Injection Engine & Memory Intelligence System
## Product Requirements Document

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-SYNAPSE-001 |
| **Version** | 0.2 |
| **Status** | Done — All 7 stories implemented, tested, and merged (PR #8, 2026-03-04) |
| **Author** | Morgan (PM) |
| **Date** | 2026-03-02 |
| **Positioned by** | Neo — The Matrix Architect |
| **Target** | @architect (design gate) → @po (story validation) → @sm (story creation) |

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-02 | 0.1 | Initial draft — integration + evolution scope | Morgan (PM) |
| 2026-03-02 | 0.2 | @architect gate cleared (5 decisions); @po validation (CONDITIONAL GO); source paths confirmed | Morgan (PM) |
| 2026-03-04 | 0.3 | Epic 10 closed — all 7 stories Done, QA gate PASS, merged to main via PR #8 | Pax (po) |

---

## 1. Goals

- **Integrate** the existing MIS (Memory Intelligence System) into the main repo — code is complete, tested, and sitting outside the repo
- **Activate** the PreCompact hook (Session Digest) — captures corrections, patterns, axioms before every context compact
- **Connect** the SYNAPSE Memory Provider to the domain injection engine
- **Migrate** domain data files (`.synapse/`) to the positioned path (`.aios-core/core/synapse/`)
- **Complete** MIS-6 (pipeline integration) and MIS-7 (auto-evolution) — the only pending stories
- Maintain full backward compatibility — all 51 agents work today without interruption

---

## 2. Background Context

The MIS was formally developed with stories MIS-1 through MIS-7. MIS-3 (Session Digest),
MIS-4 (Progressive Memory Retrieval), and MIS-5 (Self-Learning Engine) are **complete and
tested** — 117 tests, 90.7% coverage, all performance benchmarks exceeded by 4–28x.
The code exists in OneDrive, not committed to the repo. Story SYN-10 (Synapse Memory
Provider) is also complete.

The AIOS currently operates with 51 agents, 245 tasks, and 15 workflows. Agent rules are
loaded wholesale via CLAUDE.md and agent files — no prioritization, no selection by active
state. In sessions involving multiple agents (standard in story development cycles), rules
from already-closed agents remain in context consuming tokens. SYNAPSE solves this via
layered domain injection: L0 (Constitution — always active), L1 (Global/Context brackets),
L2 (Agent — activates only the current agent), L3 (Workflow — activates only the current
phase), L7 (Commands).

This is not a greenfield build. It is the integration of a production-ready product into the
repository, plus the completion of two pending roadmap stories.

---

## 3. Requirements

### 3.1 Functional Requirements

#### Epic 1 — Integration (code exists, connect it)

- **FR1:** The PreCompact hook MUST capture corrections, patterns, and axioms from the
  session before every context compact and persist them as YAML v1.0 in
  `.aios/session-digests/`. Limits: 10 corrections + 5 patterns + 10 axioms per digest.
  Fire-and-forget via `setImmediate` — hook returns in < 50ms and never blocks compact.

- **FR2:** The MemoryLoader MUST retrieve memories per agent using 3-layer progressive
  disclosure (L1: ~50 tokens metadata only / L2: ~200 tokens relevant chunks / L3:
  ~1000+ tokens full content). Auto-select layer: tokenBudget < 500 → L1 | < 1500 → L2
  | ≥ 1500 → L3. Agent-scoped privacy: each agent accesses only own + shared memories.

- **FR3:** The SelfLearner MUST execute the full learning cycle: scan digests → accumulate
  evidence → recalculate attention scores → promote/demote tiers → extract heuristics.
  Decay rates by tier: session 0.5/day | daily 0.1 | durable 0.01.

- **FR4:** Corrections repeated across 3+ sessions MUST be automatically promoted to
  auto-gotchas and persisted to `.aios/memories/shared/durable/{gotcha-id}.json`.
  Initial attention score calculated from frequency × recency.

- **FR5:** The SYNAPSE Memory Provider MUST select the retrieval layer based on the active
  context bracket: MODERATE → L1 (limit: 3, minRelevance: 0.7) | DEPLETED → L2
  (limit: 5, minRelevance: 0.5) | CRITICAL → L3 (limit: 10, minRelevance: 0.3).
  Results cached per session keyed by `${agentId}-${bracket}`.

- **FR6:** The manifest parser MUST read `.synapse/manifest`, activate domain files based
  on `AGENT_TRIGGER` and `WORKFLOW_TRIGGER` flags, and inject only relevant rules:
  L0 always | L2 only for the active agent | L3 only for the active workflow phase.

- **FR9:** The system MUST support `*synapse status` — display active domains, current
  bracket, loaded memories count.

- **FR10:** The system MUST support `*synapse-diagnose` — full report: manifest integrity,
  hook registration status, pipeline layer health, session state.

- **FR11:** Hook registration MUST be executed by `@devops` via `.claude/hooks/` — never
  installed manually.

- **FR12:** The migration MUST include all 117 existing tests relocated to `tests/` with
  coverage ≥ 90.7% (baseline) before merge is allowed.

#### Epic 2 — Evolution (build what's missing)

- **FR7 (MIS-6):** On agent activation, the pipeline MUST automatically inject relevant
  memories into the system prompt using `formatMemoriesForPrompt(memories)`. Triggered
  by the UnifiedActivationPipeline agent activation event.

- **FR8 (MIS-7):** The rule-proposer MUST propose CLAUDE.md/rules updates when a
  heuristic reaches confidence > 0.9 AND evidence_count ≥ 5. Proposed targets by action
  type: `add_to_claude_md` → MEMORY.md | `add_to_rules` → `.claude/rules/` |
  `add_to_agent_config` → `.aios-core/development/agents/` | `create_gotcha` →
  `shared/durable/`.

---

### 3.2 Non-Functional Requirements

| ID | Requirement | Baseline | Source |
|----|------------|---------|--------|
| NFR1 | PreCompact hook return time | < 50ms (fire-and-forget) | MIS-3 spec |
| NFR2 | Digest extraction completion | < 5 seconds | MIS-3 spec |
| NFR3 | Index build (100 digests) | < 2s (achieved: ~70ms, 28x faster) | MIS-4 benchmarks |
| NFR4 | Search (500 memories) | < 50ms (achieved: ~8-10ms, 5x faster) | MIS-4 benchmarks |
| NFR5 | L1/L2/L3 retrieval times | < 100ms / 200ms / 500ms (all exceeded) | MIS-4 benchmarks |
| NFR6 | Zero new production dependencies | `yaml` → migrate to `js-yaml` (already present) | Constitution Art. V |
| NFR7 | Backward compatibility | All 51 agents work unchanged; feature gate ensures graceful no-op | Architecture constraint |
| NFR8 | Test coverage after migration | ≥ 90.7% (maintain or exceed baseline) | MIS-4 test suite |

> **Note:** NFR3–NFR5 are confirmed achieved, not aspirational. Benchmarks are in the
> existing test suite (OneDrive) and must be migrated as automated tests.

---

## 4. Technical Assumptions

### Repository Structure
Monorepo — no change to existing structure.

### Module Paths

```
.aios-core/core/synapse/           ← 19th kernel module (positioned by Neo 2026-03-02)
├── index.js                       ← entry point
├── manifest-parser.js             ← reads .synapse/manifest, activates domains  [NEW]
├── domain-injector.js             ← injects rules into context                  [NEW]
├── memory/                        ← MIS migrated from OneDrive
│   ├── memory-index.js            ← storage, multi-filter search, attention scoring
│   ├── memory-loader.js           ← public API
│   ├── memory-retriever.js        ← 3-layer progressive disclosure engine
│   ├── self-learner.js            ← correction tracking, heuristics, tier promotion
│   ├── synapse-memory-provider.js ← bridge MIS → SYNAPSE engine
│   └── session-digest/
│       └── extractor.js           ← PreCompact hook handler
├── license/
│   └── feature-gate.js            ← stub for Epic 1; full implementation Epic 2  [NEW]
└── .synapse/                      ← domain data files (migrated from OneDrive)
    ├── manifest
    ├── constitution
    ├── global
    ├── context
    ├── commands
    ├── agent-{aios-master|analyst|architect|data-engineer|dev|devops|pm|po|qa|sm|squad-creator|ux}
    └── workflow-{story-dev|epic-create|arch-review}

.aios/                             ← runtime storage (already exists)
├── session-digests/               ← new, path confirmed free
└── memories/
    ├── shared/durable/            ← auto-gotchas
    ├── shared/daily/
    └── learning/evidence.json
```

### Integration Order (dependency chain)

```
1. feature-gate.js stub            ← all MIS files depend on this
2. yaml → js-yaml (5 files)        ← resolve before any tests can pass
3. memory-index.js                 ← storage foundation
4. memory-retriever.js             ← consumes index
5. memory-loader.js                ← public API
6. synapse-memory-provider.js      ← consumes loader
7. session-digest/extractor.js     ← independent of retriever
8. manifest-parser.js              ← new, reads .synapse/manifest    [ARCHITECT DESIGNS]
9. domain-injector.js              ← new, injects into context        [ARCHITECT DESIGNS]
10. Hook registration (@devops)    ← final step
```

### Resolved Technical Decisions

| Decision | Resolution |
|----------|-----------|
| `yaml` vs `js-yaml` | Migrate all `require('yaml')` → `require('js-yaml')` — zero new dependency |
| `feature-gate.js` missing | Epic 1 stub: `{ require: (featureId, name) => void, isEnabled: () => true, reset: () => {} }` — no-op; real gate Epic 2 |
| `.aios/` path collision | `.aios/session-digests/` confirmed free. Existing `.aios/` content unaffected |
| MIS-6 and MIS-7 scope | Epic 2 only — do not block Epic 1 delivery |
| manifest-parser format | **Flat key=value** (env-style, `#` comments). Format confirmed by inspection of actual `.synapse/manifest` file. Keys: `{DOMAIN}_AGENT_TRIGGER=agentId`, `{DOMAIN}_WORKFLOW_TRIGGER=workflowId`, `{DOMAIN}_ALWAYS_ON=true`. Zero external dependencies. |
| domain-injector mechanism | File-write injection → `.aios/active-domains.md`. Called by hook; greeting-builder reads for context. No CLAUDE.md mutation. |
| SynapseMemoryProvider cache | Session-level in-memory Map sufficient. No explicit invalidation. Expose `clearCache()` for `*synapse-diagnose`. |
| manifest-parser.js location | Root of `.aios-core/core/synapse/` confirmed — no sub-module |
| domain-injector.js location | Root of `.aios-core/core/synapse/` confirmed — no sub-module |

### @architect Gate — CLEARED (2026-03-02)

All 5 open questions answered by Aria. Integration order validated. Epic 1 unblocked.

### Migration Source — CONFIRMED (2026-03-02)

**OneDrive root:** `C:\Users\markm\OneDrive\Pesquisas e decisoes Upgrade Neo\`

Both source directories are under the same OneDrive parent:

```
C:\Users\markm\OneDrive\Pesquisas e decisoes Upgrade Neo\
├── memory\                          ← MIS source files (Stories 1.2–1.5, 2.2–2.4)
│   ├── memory-index.js              → Story 1.2
│   ├── memory-loader.js             → Story 1.3
│   ├── memory-retriever.js          → Story 1.3
│   ├── self-learner.js              → Story 1.4
│   ├── synapse-memory-provider.js   → Story 1.4
│   ├── rule-proposer.js             → Story 2.3 (MIS-7) ⚠️ not in original PRD
│   ├── session-digest\
│   │   └── extractor.js             → Story 1.5
│   └── __tests__\
│       ├── memory-index.test.js     → Story 1.2
│       ├── memory-loader.test.js    → Story 1.3
│       ├── memory-retriever.test.js → Story 1.3
│       ├── self-learner.test.js     → Story 1.4
│       └── rule-proposer.test.js   → Story 2.3
└── .synapse\                        ← Domain data files (Story 1.6)
    ├── manifest
    ├── constitution
    ├── global
    ├── context
    ├── commands
    ├── agent-{aios-master|analyst|architect|data-engineer|dev|devops|pm|po|qa|sm|squad-creator|ux}
    └── workflow-{story-dev|epic-create|arch-review}
```

**Migration gaps identified by @po:**

| Gap | Impact | Resolution |
|-----|--------|------------|
| `feature-gate.test.js` — not in OneDrive | Story 1.1 AC 4 | @dev creates this file from @architect spec |
| `synapse-memory-provider.test.js` — not found | Story 1.4 coverage | @dev writes tests during migration |
| `extractor.test.js` — not found | Story 1.5 coverage | @dev writes tests during migration |
| `license-*.test.js` — not in OneDrive | Story 2.1 | @dev writes tests from interface spec |
| `rule-proposer.js` found but not in original PRD | Story 2.3 source confirmed | Include in Story 2.3 migration |

---

## 5. Epic List

### Epic 1 — SYNAPSE Integration: MIS Core + Injection Engine
**Goal:** Integrate the existing, tested MIS codebase into the repo and build the
manifest/injection engine. Delivers session digest capture, selective context injection,
and the full MIS-3/4/5 + SYN-10 codebase running inside the repository with all tests
passing.

**Estimated complexity:** Medium (integration-heavy, not greenfield)
**Blocker:** @architect must answer the 5 open questions before stories go to @dev.

### Epic 2 — SYNAPSE Evolution: MIS-6/7 + Feature Gate Complete
**Goal:** Complete the formal MIS roadmap. Implements MIS-6 (memory injection on agent
activation via UnifiedActivationPipeline) and MIS-7 (rule-proposer → CLAUDE.md
auto-evolution). Builds the full feature gate system. Enables the self-learner to run
automatically after each compact.

**Estimated complexity:** Medium-High (new builds on validated foundation)
**Prerequisite:** Epic 1 fully merged and stable.

---

## 6. Epic 1 — Story Breakdown

### Epic 1 Goal
Integrate MIS-3/4/5/SYN-10 from OneDrive into the repo. Resolve all blockers. Build
manifest-parser and domain-injector. Register hooks via @devops. All 117 tests passing
in the repo.

---

### Story 1.1 — Blocker Resolution: Dependencies & Feature Gate Stub

As a developer,
I want all integration blockers resolved,
so that MIS files can be imported without errors.

**Acceptance Criteria:**
1. All `require('yaml')` imports in MIS files updated to `require('js-yaml')` — verified
   by running existing tests
2. `feature-gate.js` stub implemented at `.aios-core/core/synapse/license/feature-gate.js`
   with interface: `{ require: (featureId, name) => void }` — no-op for MVP
3. Stub satisfies all contracts defined in `tests/license/feature-gate.test.js`
4. `npm test` passes on the stub with zero failures

---

### Story 1.2 — MIS Storage Layer: memory-index.js Migration

As a developer,
I want the MemoryIndexManager migrated and operational in the repo,
so that session digests can be indexed and searched.

**Acceptance Criteria:**
1. `memory-index.js` migrated to `.aios-core/core/synapse/memory/memory-index.js`
2. All 33 unit tests migrated to `tests/core/synapse/memory/memory-index.test.js`
3. Index build (100 digests) completes in < 2s — performance test passes automatically
4. Search (500 memories) completes in < 50ms — performance test passes automatically
5. `npm test` passes with coverage ≥ 90.7% on this file

---

### Story 1.3 — MIS Retrieval Layer: memory-retriever.js + memory-loader.js Migration

As a developer,
I want the progressive disclosure retrieval engine migrated and operational,
so that agents can query memories by tier, tag, and token budget.

**Acceptance Criteria:**
1. `memory-retriever.js` and `memory-loader.js` migrated to
   `.aios-core/core/synapse/memory/`
2. All 76 unit tests migrated (45 retriever + 31 loader) to `tests/core/synapse/memory/`
3. 3-layer auto-selection verified: tokenBudget < 500 → L1 | < 1500 → L2 | ≥ 1500 → L3
4. Agent-scoped privacy verified: `dev` agent cannot access `qa` memories
5. All AGENT_SECTOR_PREFERENCES preserved and tested
6. `npm test` passes with coverage ≥ 90.7% on both files

---

### Story 1.4 — MIS Learning Layer: self-learner.js + synapse-memory-provider.js Migration

As a developer,
I want the self-learning engine and SYNAPSE provider migrated,
so that memory tiers evolve automatically and the SYNAPSE bridge is operational.

**Acceptance Criteria:**
1. `self-learner.js` migrated to `.aios-core/core/synapse/memory/self-learner.js`
2. `synapse-memory-provider.js` migrated to
   `.aios-core/core/synapse/memory/synapse-memory-provider.js`
3. Gotcha auto-promotion verified: error appearing in 3+ sessions creates entry in
   `.aios/memories/shared/durable/`
4. BRACKET_CONFIG verified: MODERATE → L1 | DEPLETED → L2 | CRITICAL → L3
5. Session-level cache verified: same `agentId-bracket` returns cached result
6. All remaining tests migrated to `tests/core/synapse/memory/`
7. `npm test` passes with total coverage ≥ 90.7% across all 4 MIS files

---

### Story 1.5 — Session Digest: PreCompact Hook Migration

As a developer,
I want the PreCompact hook (session-digest/extractor.js) migrated and registered,
so that every context compact captures session knowledge before it is lost.

**Acceptance Criteria:**
1. `session-digest/extractor.js` migrated to
   `.aios-core/core/synapse/memory/session-digest/extractor.js`
2. Hook registered at `.claude/hooks/` by @devops
3. PreCompact hook returns in < 50ms (fire-and-forget verified in integration test)
4. Digest extraction completes in < 5s
5. Output format matches YAML v1.0 schema (schema_version, session_id, timestamp,
   corrections, patterns, axioms, context_snapshot)
6. Graceful degradation: if feature gate disabled, hook logs and returns — compact
   never blocked
7. Integration test covers full flow: hook fires → extractor runs → digest file created

---

### Story 1.6 — Manifest Parser + Domain Data Migration

As a developer,
I want the SYNAPSE manifest parser built and domain data files migrated,
so that rules can be selectively activated by agent and workflow.

**Acceptance Criteria:**
1. All `.synapse/` domain data files migrated to `.aios-core/core/synapse/.synapse/`
   (manifest, constitution, global, context, commands, 12 agent domains, 3 workflow domains)
2. `manifest-parser.js` implemented per @architect design — reads manifest, activates
   domains by AGENT_TRIGGER and WORKFLOW_TRIGGER
3. L0 (constitution) and L1 (global + context) always active
4. L2 activates only the domain matching the current active agent
5. L3 activates only the domain matching the current active workflow phase
6. Unit tests cover: manifest parsing, domain activation, unknown agent (graceful),
   DEVMODE flag
7. `npm test` passes

---

### Story 1.7 — Domain Injector + Hook Registration

As a developer,
I want the domain injector built and all hooks registered,
so that SYNAPSE rules and memories are automatically injected into each session.

**Acceptance Criteria:**
1. `domain-injector.js` implemented per @architect design — reads activated domains,
   formats rules, injects into context
2. `*synapse status` command works: displays active domains, current bracket, memory count
3. `*synapse-diagnose` command works: runs full diagnostic report (manifest integrity,
   hook registration, pipeline layers, session state)
4. `index.js` exports all public APIs: `{ ManifestParser, DomainInjector, SynapseMemoryProvider, createMemoryLoader, createSelfLearner }`
5. All 51 agents verified working without change (integration test or manual verification)
6. @devops registers all hooks via `.claude/hooks/` — no manual installation required
7. `npm run lint` + `npm run typecheck` + `npm test` all pass

---

## 7. Epic 2 — Story Breakdown

### Epic 2 Goal
Complete the MIS roadmap. Implement MIS-6 (agent activation memory injection),
MIS-7 (rule-proposer auto-evolution), and the full feature gate system. Self-learner
runs automatically after each compact.

---

### Story 2.1 — Feature Gate: Full Implementation

As a developer,
I want a real feature gate system replacing the Epic 1 stub,
so that SYNAPSE Pro features can be gated by capability tier.

**Acceptance Criteria:**
1. `feature-gate.js` fully implemented satisfying all contracts in
   `tests/license/feature-gate.test.js` (+ `license-api.test.js`, `license-cache.test.js`,
   `license-crypto.test.js`)
2. `pro.memory.synapse` gate returns enabled/disabled based on config
3. All existing tests that used the stub continue passing
4. Graceful degradation verified: disabled gate → all MIS features no-op, log only
5. `npm test` passes with coverage ≥ 90%

---

### Story 2.2 — MIS-6: Agent Activation Memory Injection

As an active agent,
I want relevant memories injected into my system prompt on activation,
so that I have institutional memory from previous sessions without manual lookup.

**Acceptance Criteria:**
1. UnifiedActivationPipeline calls `MemoryLoader.queryMemories(agentId, { tokenBudget: 2000, attentionMin: 0.3, layer: 2 })` on each agent activation
2. Memories formatted via `formatMemoriesForPrompt(memories)` and appended to system prompt
3. HOT memories (attention > 0.7) always included within token budget
4. WARM memories included if token budget allows
5. Injection adds ≤ 2000 tokens to system prompt (budget enforced)
6. Feature gate disabled → injection skipped gracefully (no error, no impact on activation)
7. Integration test: activate @dev → verify memory section present in prompt

---

### Story 2.3 — MIS-7: Rule Proposer Auto-Evolution

As the AIOS organization,
I want recurring heuristics automatically proposed as rule updates,
so that institutional knowledge evolves the system without manual intervention.

**Acceptance Criteria:**
1. `rule-proposer.js` runs after each `SelfLearner.run()` cycle
2. Heuristics with `confidence > 0.9 AND evidence_count >= 5` trigger proposals
3. Proposals written to `.aios/memories/proposals/` as YAML files with:
   `{ id, rule, proposed_action, proposed_target, confidence, evidence_count, created }`
4. Proposed actions mapped correctly: `add_to_claude_md` → MEMORY.md |
   `add_to_rules` → `.claude/rules/` | `add_to_agent_config` → agent files |
   `create_gotcha` → `shared/durable/`
5. Proposals are suggestions only — no automatic writes to CLAUDE.md or agent files
   without human review (P4 — Human Checkpoint)
6. `*synapse status` displays count of pending proposals
7. Unit tests cover: threshold logic, action mapping, file creation, duplicate prevention

---

### Story 2.4 — Self-Learner Auto-Cycle

As the AIOS organization,
I want the self-learning engine to run automatically after each context compact,
so that session knowledge is continuously processed without manual intervention.

**Acceptance Criteria:**
1. Self-learner cycle triggered automatically after PreCompact hook completes
2. Cycle runs async — never blocks compact or next session start
3. Cycle execution logged to `.aios/memories/learning/cycle-log.json`
4. Stats persisted: corrections_found, heuristics_extracted, promotions, demotions,
   gotchas_created, duration_ms
5. Error in cycle is silent (logged, never propagated) — system continues normally
6. `*synapse diagnose` shows last cycle stats and timestamp

---

## 8. Checklist Results

*To be populated by @pm after @architect review and @po story validation.*

---

## 9. Next Steps

### Gate Status

| Gate | Agent | Status | Date |
|------|-------|--------|------|
| Architecture Review | @architect (Aria) | ✅ CLEARED | 2026-03-02 |
| Story Validation | @po (Pax) | ✅ CONDITIONAL GO | 2026-03-02 |
| Source Paths | @pm (Morgan) | ✅ CONFIRMED | 2026-03-02 |
| Story Creation | @sm (River) | ⏳ PENDING | — |
| Implementation | @dev | ⏳ PENDING | — |

### @sm Instructions (Next Step)

@sm — PRD-SYNAPSE-001 ready for story creation. All blockers cleared.

**Create stories in this order:**

1. **Story 1.1 first** — no external source files needed; can start immediately
2. **Stories 1.2–1.5** — include source path for each file (see Migration Source section above)
3. **Stories 1.6–1.7** — incorporate @architect decisions (INI-style parser, file-write injector)
4. **Epic 2 stories** — after Epic 1 is stable

**Required in every story (PO mandate):**
- `🤖 CodeRabbit Integration` section (coderabbit_integration.enabled: true in core-config.yaml)
- Self-Healing mode: `@dev: light mode (2 iterations, 15 min, CRITICAL only)`
- Pre-Commit quality gate task (required for all stories)

**@dev source paths for all migration stories:**
- MIS files: `C:\Users\markm\OneDrive\Pesquisas e decisoes Upgrade Neo\memory\`
- Domain files: `C:\Users\markm\OneDrive\Pesquisas e decisoes Upgrade Neo\.synapse\`

---

*PRD-SYNAPSE-001 — SYNAPSE Context Injection Engine*
*Morgan (PM) — 2026-03-02 (v0.2)*
*Next: @sm story creation → @dev implementation (Story 1.1 first)*
