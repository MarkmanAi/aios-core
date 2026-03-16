# ADR-EPIC-24: SYNAPSE Operational Activation

**ADR ID:** ADR-EPIC-24
**Status:** Accepted
**Created:** 2026-03-15
**Author:** @architect (Aria)
**Requested by:** Neo — The Matrix Architect
**Source:** `docs/stories/briefs/epic-24-briefing.md`
**Deciders:** @architect (Aria), Neo
**Next:** @sm creates Epic 24 stories based on this document

---

## Context

Epic 16 (SYNAPSE Memory Stores: Completion) delivered correct code: `memory-writer.js`,
updated `self-learner.js`, `memory-loader.js`, `agent-neo` domain file, 395 passing tests.

**The problem:** the pipeline never ran in production. Three gaps exist:

1. `SelfLearner.run()` is never triggered — no digest is ever processed
2. `MemoryBridge` (the write→activation link) does not exist — memories never reach agent context
3. Epic 16 code was never pushed to remote — no PR, no CodeRabbit review, no merge record

Additionally, a structural observation: **two parallel module trees** exist for the same
domain, creating import ambiguity risk.

---

## Current State Diagram

```
PreCompact hook fires
  extractSessionDigest()   ← runs (when compaction occurs)
                           ← SelfLearner.run() NOT called here
                                      |
                              [digest written]
                                      |
                              SelfLearner.run()   ← NEVER CALLED
                                      |
                              MemoryWriter.write() ← NEVER CALLED
                                      |
                    .aios/memories/shared/{tier}/ ← DOES NOT EXIST
                                      |
                           MemoryRetriever.retrieve() ← returns empty
                                      |
                    UnifiedActivationPipeline     ← no memory loading step
                                      |
                         Agents activate without memory
```

---

## Problems Addressed

| ID | Problem | Type | Blocks SM? |
|----|---------|------|------------|
| P1 | `SelfLearner.run()` has no trigger | Architectural | YES |
| P2 | Memory stores do not exist yet | Operational | No — created on-demand |
| P3 | Memory injection on activation missing | Architectural | YES |
| P4 | Epic 16 never pushed to remote | Operational | YES — must precede Epic 24 |
| P5 | Syn agent has no `*learn` SOP | Organizational | Partial |
| P6 | `inventory.yaml` hook count off by 1 | Documentation | No |

---

## Structural Observation: Dual Module Trees

Code inspection revealed two parallel module trees for the same domain:

```
.aios-core/core/memory-intelligence/
  ├── self-learner.js        ← older generation
  ├── memory-loader.js
  └── memory-retriever.js

.aios-core/core/synapse/memory/
  ├── self-learner.js        ← Epic 16 canonical version
  ├── memory-loader.js       ← has MemoryWriter integration
  ├── memory-retriever.js
  ├── memory-writer.js       ← only here (Epic 16)
  └── synapse-memory-provider.js  ← only here
```

**Rule for all Epic 24 stories:** always import from `core/synapse/memory/`, never from
`core/memory-intelligence/`. The `core/memory-intelligence/` tree is the older generation
and does not include `MemoryWriter` or `SynapseMemoryProvider`.

---

## Architectural Decisions

### Decision 1 — SelfLearner Trigger (P1)

**Decision: Option A — Extend the existing `synapse-precompact.js` hook.**

**Rationale:**

The hook already uses `setImmediate` for fire-and-forget execution. Adding
`SelfLearner.run()` after `extractSessionDigest()` in the same async chain is the
natural extension — no new infrastructure, no new hook types.

- PreCompact is the only Claude Code hook type relevant here (PostCompact does not exist)
- `SelfLearner` failures are silenced via try/catch — compact is never blocked
- Options B (new hook), C (manual-only), D (queue system) are over-engineering for
  current volume

**Resulting execution sequence:**

```javascript
setImmediate(async () => {
  try {
    await extractSessionDigest(context)       // writes digest to .aios/session-digests/
    await SelfLearner.run(context.projectDir) // reads digest → MemoryWriter.write()
  } catch (err) {
    process.stderr.write(`[SYNAPSE] Pipeline error: ${err.message}\n`)
    // compact is NEVER blocked
  }
})
// hook returns here immediately — well within 50ms budget
```

**File to modify:** `.claude/hooks/synapse-precompact.js`

---

### Decision 2 — Memory Injection on Activation (P3)

**Decision: The bridge is missing. Story 24.2 must create it.**

**Evidence from code inspection:**

- `SynapseMemoryProvider` (`core/synapse/memory/synapse-memory-provider.js`) exists and
  has correct API: `.getMemories(agentId, bracket, budget)`
- `MemoryLoader.loadForAgent()` (`core/synapse/memory/memory-loader.js`) exists with
  progressive disclosure (HOT → WARM tiers)
- `MemoryBridge` — referenced in `SynapseMemoryProvider` docstring as its consumer —
  **does not exist as a file**
- `UnifiedActivationPipeline._runPipeline()` loads 5 parallel data sources (AgentConfig,
  SessionContext, ProjectStatus, GitConfig, PermissionMode). **MemoryLoader is not one
  of them.** The assembled `enrichedContext` has no `memories` field.

**Required change in `UnifiedActivationPipeline`:**

```javascript
// Phase 1: Parallel loading — ADD this loader
const [
  agentComplete,
  sessionContext,
  projectStatus,
  gitConfig,
  permissionData,
  memoryResult,          // NEW
] = await Promise.all([
  // ... existing loaders ...
  this._safeLoad('MemoryLoader', () => {
    const loader = new MemoryLoader(this.projectRoot)
    return loader.loadForAgent(agentId, { budget: 2000, layers: [1, 2] })
  }),
])

// Phase 4: Assemble enrichedContext — ADD memories field
const enrichedContext = {
  // ... existing fields ...
  memories: memoryResult?.memories || [],   // NEW
}
```

**Canonical import path:** `core/synapse/memory/memory-loader` (not `memory-intelligence/`)

**File to modify:** `.aios-core/development/scripts/unified-activation-pipeline.js`

---

### Decision 3 — Epic 16 Deploy (P4)

**Decision: Hard pre-requisite. Story 24.0 must complete before 24.1 starts.**

**Rationale:**

1. Epic 24 stories extend `synapse-precompact.js` and `UnifiedActivationPipeline`,
   both of which depend on Epic 16 modules (`memory-writer.js`, `self-learner.js`)
   being present in remote
2. CodeRabbit has not reviewed Epic 16 — architectural issues in the foundation would
   propagate into Epic 24
3. Creating Epic 24 PRs before Epic 16 is merged creates incoherent git history

**Execution:** @devops (Story 24.0): `git push` → PR → CodeRabbit review → merge.
Epic 24.1+ unlocked only after 24.0 merged.

---

### Decision 4 — Syn Agent Role (P5)

**Decision: Dual role — automated pipeline via hook (primary) + manual trigger (secondary).**

The hook (Decision 1) is the primary trigger. Syn is not the main motor — hooks are more
reliable than requiring agent invocation.

**Syn commands to implement (Story 24.3):**

| Command | Purpose |
|---------|---------|
| `*learn [digest-id?]` | Manual trigger: process pending digests or a specific one. Recovery + diagnostic use. |
| `*synapse-status` | Observability: pending digests count, memories written, last run timestamp |
| `*synapse-inject` | Already exists — force memory injection into current context |

**Syn role classification:** Operational with observability focus.
Primary trigger = automated hook. Syn = failsafe + diagnostic interface.

---

## Memory Store Initialization (P2)

**Decision: On-demand creation is sufficient. No setup story needed.**

`MemoryWriter` uses `fs.mkdir({ recursive: true })` — creates `.aios/memories/shared/{tier}/`
on first write. No infrastructure story required.

Optional: add `.aios/README.md` as part of Story 24.1 or 24.4 to document the expected
directory structure for future contributors. Not blocking.

---

## Story Map

| Story | Owner | Scope | Blocked by |
|-------|-------|-------|------------|
| 24.0 | @devops | Push Epic 16 → PR → merge | — |
| 24.1 | @dev | Extend `synapse-precompact.js`: chain `SelfLearner.run()` after digest extraction | 24.0 merged |
| 24.2 | @dev | Add `MemoryLoader` to `UnifiedActivationPipeline` Phase 1; inject `memories` into `enrichedContext` | 24.0 merged |
| 24.3 | @dev | Syn `*learn` command — SOP operacional do learning cycle | 24.1 + 24.2 |
| 24.4 | @qa | Integration test: real session → digest → SelfLearner → memories → inject | 24.1 + 24.2 |

Scope matches Neo's estimate. No structural gaps found that would expand beyond 5 stories.

---

## Consequences

### Positive

- Institutional memory becomes operational for the first time
- Agent activation context enriched with learned patterns, corrections, heuristics
- SelfLearner cycles automatically on every context compaction
- Syn gains operational role beyond monitoring

### Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| `SelfLearner.run()` slow on large digest sets, delays next session start | Fire-and-forget via `setImmediate` — runs after hook exits, cannot delay Claude Code |
| `MemoryLoader` in activation adds latency | Runs in parallel Phase 1 with 150ms per-loader timeout (`_safeLoad`); falls back to empty array on failure |
| Dual module tree causes wrong imports in stories | **Rule enforced here:** all Epic 24 code imports from `core/synapse/memory/` |
| Epic 16 CodeRabbit review reveals blocking issues | 24.0 is hard pre-requisite — issues resolved before Epic 24 code is written |

---

## Files Inventory

### Modified by Epic 24

| File | Story | Change |
|------|-------|--------|
| `.claude/hooks/synapse-precompact.js` | 24.1 | Add `SelfLearner.run()` after `extractSessionDigest()` |
| `.aios-core/development/scripts/unified-activation-pipeline.js` | 24.2 | Add `MemoryLoader` to Phase 1 parallel loaders; inject `memories` into `enrichedContext` |
| `.aios-core/development/agents/synapse.md` (or equiv) | 24.3 | Add `*learn` command definition |

### Created by Epic 24

| File | Story | Purpose |
|------|-------|---------|
| `.aios/memories/` (auto-created) | 24.1 (first run) | Memory store — created on-demand by `MemoryWriter` |
| `tests/integration/epic-24-e2e.test.js` | 24.4 | End-to-end pipeline integration test |

---

## References

| Document | Path |
|----------|------|
| Epic 24 Briefing | `docs/stories/briefs/epic-24-briefing.md` |
| Memory Writer Design | `docs/architecture/memory-writer-design.md` |
| Memory Layer Architecture | `docs/architecture/memory-layer.md` |
| PreCompact Hook | `.claude/hooks/synapse-precompact.js` |
| SelfLearner | `.aios-core/core/synapse/memory/self-learner.js` |
| MemoryWriter | `.aios-core/core/synapse/memory/memory-writer.js` |
| MemoryLoader | `.aios-core/core/synapse/memory/memory-loader.js` |
| SynapseMemoryProvider | `.aios-core/core/synapse/memory/synapse-memory-provider.js` |
| UnifiedActivationPipeline | `.aios-core/development/scripts/unified-activation-pipeline.js` |

---

*ADR-EPIC-24 — Accepted 2026-03-15*
*Author: @architect (Aria) — Holistic System Architect*
*Requested by: Neo — The Matrix Architect*
