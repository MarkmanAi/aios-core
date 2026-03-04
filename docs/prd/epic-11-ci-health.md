# Epic 11 — CI Health & Technical Debt

> **Epic:** 11
> **Title:** CI Health & Technical Debt — Test Suite Stabilization
> **Status:** Done
> **Created:** 2026-03-03
> **Owner:** @pm (Morgan)
> **Primary Agent:** @dev (Dex)
> **Validator:** @qa (Quinn)

---

## Goal

Restore and maintain a fully green, deterministic CI pipeline by eliminating all sources of
test flakiness, fixing behavioral regressions, and implementing the outstanding feature work
required to bring the test suite to 100% passage — enabling safe, reliable PR merges on `main`.

## Business Value

- **Developer Trust**: A flaky CI erodes confidence — random failures make regressions
  indistinguishable from noise. A stable suite restores signal-to-noise ratio.
- **Merge Safety**: PRs cannot be safely merged when CI is unreliable. Each story in this
  epic unblocks incremental merge confidence.
- **Technical Debt Clearance**: 17 flaky test suites and 3 unimplemented features accumulated
  since the first CI run on PR #6. This epic eliminates all of them systematically.
- **Parallel Execution Correctness**: AIOS test suite runs Jest with N-1 CPU workers by
  default. Flakiness is caused by test isolation violations — fixing them also validates
  the framework's own parallel execution assumptions.

---

## Existing System Context

- **Technology stack:** Node.js, Jest (parallel workers, N-1 CPUs), Windows 11 CI
- **Test runner:** Jest with default parallel execution
- **Root cause origin:** First CI run on PR #6 (Story 10.6) exposed 28 failing suites —
  none introduced by Story 10.6 itself (confirmed via `git stash`).
- **Diagnostic source:** `docs/plans/flaky-tests-diagnostic.md` (authored by @dev, 2026-03-03)
- **Integration points:** All test files under `tests/`, `packages/*/tests/`, `.aios-core/**/__tests__/`

---

## Root Cause Summary

| Class | Description | Suites Affected | Priority |
|-------|-------------|-----------------|----------|
| A | Fixed shared filesystem paths — parallel workers collide | 5 | P1 |
| B | Mock state leakage — `clearAllMocks()` doesn't reset implementations | 2 | P2 |
| C | Windows timing / EBUSY — `Date.now()` suffix, no retry on rmSync | 3 | P3 |
| D | Real file dependency without mock | 1 | P3 |
| E | `process.env` mutations without proper snapshot/restore | 1 | P3 |
| — | Feature work not yet implemented (always-fail) | 3 | P2 |

---

## Stories

| Story | Title | Type | Priority | Status | Agents |
|-------|-------|------|----------|--------|--------|
| 11.1 | CI Health — Quick Wins: Test Cleanup, IDE Sync & Manifest | Maintenance | P1 | Done | @dev, @qa |
| 11.2 | CI Health — Core Test Regression Fixes: Permission Mode & Greeting System | Bug Fix | P1 | Done | @dev |
| 11.3 | CI Health — Test Isolation: Shared Filesystem Path Fixes (Class A) | Bug Fix | P1 | Done | @dev |
| 11.4 | CI Health — Test Isolation: Mock State Leakage Fixes (Class B) | Bug Fix | P2 | Done | @dev |
| 11.5 | CI Health — Test Isolation: Windows Timing + Env + Real File (Class C/D/E) | Bug Fix | P3 | Done | @dev, @qa |
| 11.6 | Feature: Agent Config Enrichment (ACT-8) | Feature | P2 | Done | @dev, @architect |
| 11.7 | Feature: Bob Dashboard Event Types | Feature | P2 | Done | @dev |
| 11.8 | Feature: Workflow Navigator Integration (ACT-5) | Feature | P2 | Done | @dev, @qa, @architect |
| 11.9 | CI Health — Test Isolation: Class F Cross-Suite Contamination Fixes | Bug Fix | P2 | Done | @dev |

---

## Story Detail

### Story 11.3 — Class A: Shared Filesystem Path Isolation (P1)

**Scope:** 5 test suites write to fixed, non-unique paths — collide when Jest runs parallel workers.

**Fix pattern:** Replace all fixed paths with `fs.mkdtempSync(path.join(os.tmpdir(), 'aios-<name>-'))`.
Clean up in `afterAll`.

**Files:**
- `tests/core/orchestration/terminal-spawner.test.js`
- `tests/core/synapse/memory/self-learner.test.js`
- `tests/core/synapse/memory/memory-retriever.test.js`
- `.aios-core/workflow-intelligence/__tests__/suggestion-engine.test.js`
- `tests/unit/context-detector.test.js`

**Predicted Agents:** @dev
**Quality Gates:**
- Pre-Commit: Run `npm test -- --runInBand` then `npm test` (parallel) — both must pass
- Pre-PR: 10 consecutive `npm test` runs without flakiness on the 5 suites

**Acceptance Criteria:**
- All 5 suites pass in 10 consecutive parallel `npm test` runs
- No fixed path (outside `os.tmpdir()` + unique suffix) in any test setup

---

### Story 11.4 — Class B: Mock State Leakage (P2)

**Scope:** 2 suites use `jest.clearAllMocks()` which resets call counts but not custom `mockImplementation()`.
Implementations leak between tests.

**Fix pattern:** Replace `jest.clearAllMocks()` with `jest.resetAllMocks()`, OR explicitly
re-apply `mockImplementation()` in `beforeEach` for each mock.

**Files:**
- `tests/core/unified-activation-pipeline.test.js` (14+ mocks including `fs`)
- `tests/core/context-aware-greetings.test.js` (7 mocks)

**Predicted Agents:** @dev
**Quality Gates:**
- Pre-Commit: Verify `globalConfigCache` reset between tests
- Pre-PR: 10 consecutive parallel runs pass for both suites

**Acceptance Criteria:**
- Both suites pass in 10 consecutive parallel runs
- All `beforeEach` blocks restore mock implementations to a known state

---

### Story 11.5 — Class C/D/E: Windows Timing + Env + Real File (P3)

**Scope:** Remaining isolation issues — Windows-specific timing races, env mutation leakage,
real file dependency without mock.

**Fix patterns:**
- Class C: Use `fs.mkdtempSync()` instead of `Date.now()` suffix; add retry logic to `rmSync()`
- Class D: Add `jest.mock()` for the real file dependency or use a fixture copy
- Class E: Snapshot full `process.env` in `beforeEach`, restore exactly in `afterEach`

**Files:**
- `tests/installer/brownfield-upgrader.test.js` (Class C)
- `tests/unit/documentation-integrity/brownfield-analyzer.test.js` (Class C)
- `packages/installer/tests/integration/environment-configuration.test.js` (Class C)
- `tests/core/surface-checker.test.js` (Class D)
- `tests/core/orchestration/terminal-spawner.test.js` (Class E — env part)

**Predicted Agents:** @dev
**Quality Gates:**
- Pre-Commit: Run on Windows CI; verify no EBUSY errors in cleanup
- Pre-PR: 10 consecutive parallel runs pass on Windows

**Acceptance Criteria:**
- All 5 suites pass in 10 consecutive parallel runs on Windows CI
- No `Date.now()` used for temp dir naming anywhere in test files
- All `process.env` mutations restored in `afterEach`

---

### Story 11.6 — Feature: Agent Config Enrichment (ACT-8) (P2)

**Scope:** Implement `agent-config-requirements.yaml` enrichment for 5 agents:
`@pm`, `@ux`, `@analyst`, `@sm`, `@squad-creator`.

**Files:** `tests/core/agent-config-enrichment.test.js` (19 failing assertions)

**Predicted Agents:** @dev, @architect (review agent config contract)
**Quality Gates:**
- Pre-Commit: All 19 assertions pass
- Pre-PR: @architect validates agent config schema compatibility

**Acceptance Criteria:**
- `agent-config-enrichment.test.js` — all 19 assertions pass
- Enrichment applied to all 5 specified agents without breaking existing configs

---

### Story 11.7 — Feature: Bob Dashboard Event Types (P2)

**Scope:** Implement `DashboardEmitter` Bob-specific event methods:
`emitBobPhaseChange`, `emitBobAgentSpawned`, `emitBobAgentCompleted`,
`emitBobSurfaceDecision`, `emitBobError`.

**Files:** `tests/core/events/dashboard-emitter-bob.test.js` (11 failing assertions)

**Predicted Agents:** @dev
**Quality Gates:**
- Pre-Commit: All 11 assertions pass
- Pre-PR: Verify existing `DashboardEmitter` methods unaffected

**Acceptance Criteria:**
- `dashboard-emitter-bob.test.js` — all 11 assertions pass
- Existing DashboardEmitter event methods remain functional

---

### Story 11.8 — Feature: Workflow Navigator Integration (ACT-5) (P2)

**Scope:** Implement `bob_orchestration` and `agent_handoff` workflow patterns in
`workflow-patterns.yaml`; relax trigger conditions; integrate with `SessionState`.

**Files:** `tests/core/workflow-navigator-integration.test.js` (16 failing assertions)

**Predicted Agents:** @dev, @architect (workflow pattern design)
**Quality Gates:**
- Pre-Commit: All 16 assertions pass
- Pre-PR: @architect validates workflow pattern contract with existing navigator

**Acceptance Criteria:**
- `workflow-navigator-integration.test.js` — all 16 assertions pass
- `bob_orchestration` and `agent_handoff` patterns present in `workflow-patterns.yaml`
- `SessionState` integration working as specified in tests

---

## Impact Assessment

| Milestone | Stories Completed | `npm test` Result |
|-----------|-------------------|-------------------|
| Baseline (current) | — | 5–12 random failures per run |
| After 11.1 + 11.2 | Merged | ~17 flaky suites remain |
| After 11.3 | +1 | ~12 flaky suites remain |
| After 11.3 + 11.4 | +2 | Exactly 3 predictable failures (11.6, 11.7, 11.8) |
| After all 8 stories | Complete | 0 failures — CI fully green |

---

## Compatibility Requirements

- [ ] Existing test behavior preserved — no production code changes in 11.3/11.4/11.5
- [ ] Agent configs (11.6) backward compatible with existing agent definitions
- [ ] DashboardEmitter existing events (11.7) unaffected
- [ ] Existing workflow patterns (11.8) unaffected

---

## Risk Mitigation

- **Primary Risk:** Fixing test isolation introduces new test failures (e.g., `mkdtempSync` path
  mismatch with existing assertions)
- **Mitigation:** Run `npm test -- --runInBand` (serial) first to validate correctness,
  then run `npm test` (parallel) to validate isolation
- **Rollback Plan:** Each story is an independent commit — any story can be reverted without
  affecting others. Stories are additive, not structural.

**Quality Risk Profile:**

| Story | Risk Level | Gate |
|-------|-----------|------|
| 11.3 | MEDIUM — touches 5 test files | Pre-Commit + 10x parallel validation |
| 11.4 | MEDIUM — mock behavior change | Pre-Commit + 10x parallel validation |
| 11.5 | LOW — Windows-specific | Pre-Commit (Windows CI) |
| 11.6 | LOW — new agent config fields | Pre-PR @architect review |
| 11.7 | LOW — additive event methods | Pre-Commit assertion validation |
| 11.8 | MEDIUM — workflow pattern contract | Pre-PR @architect review |

---

## Definition of Done

- [x] All 9 stories completed with acceptance criteria met (11.1–11.9)
- [x] `npm test` passes — zero failures confirmed across all story validations
- [x] `npm run lint` passes with zero errors on all modified files
- [ ] CI pipeline fully green — PRs merge without `--admin` (pending @devops push)
- [x] `docs/plans/flaky-tests-diagnostic.md` retained as historical reference

## Closure Notes

**Closed:** 2026-03-04
**QA Gates:** All 9 stories reviewed. Gates: docs/qa/gates/11.1-*.yml, 11.5-*.yml, 11.8-*.yml
**Architect Review:** Story 11.8 — APPROVED WITH CONDITIONS (Aria, 2026-03-04)
**Bug Fixed:** SessionState(process.cwd()) — AC6 cross-terminal continuity now functional
**Tech Debt Backlog:** TD-2 (dynamic require consolidation), TD-3 (GreetingBuilder SRP monitoring)
**Pending:** IDE sync + manifest regeneration (post-11.6/11.8 drift) — to be done pre-merge

---

## Handoff to @sm

"Please develop detailed user stories for Epic 11 stories 11.3 through 11.8.

- This is bug fix + feature work on an existing test suite running Node.js + Jest (parallel, Windows)
- Integration points: Jest parallel workers, `os.tmpdir()`, `process.env`, jest mock system
- Existing patterns: see stories 11.1 and 11.2 for story format reference
- Critical constraint: Each story must be independently deployable — no cross-story dependencies
- Root cause documentation: `docs/plans/flaky-tests-diagnostic.md`
- Each story must include: 10x parallel run validation as acceptance criteria

The epic goal is CI 100% green with zero random failures."

---

*Epic created by Morgan (@pm) — 2026-03-03*
*Diagnostic source: @dev (Dex) — docs/plans/flaky-tests-diagnostic.md*
