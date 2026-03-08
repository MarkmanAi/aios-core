# STORY-BACKLOG.md

Centralized backlog for follow-ups, technical debt, and optimizations identified during story reviews, development, and QA processes.

---

## Statistics

| Priority | TODO | In Progress | Blocked | Done | Total |
|----------|------|-------------|---------|------|-------|
| 🔴 HIGH   | 0    | 0           | 0       | 0    | 0     |
| 🟡 MEDIUM | 0    | 0           | 0       | 6    | 6     |
| 🟢 LOW    | 0    | 0           | 0       | 3    | 3     |
| **Total** | **0** | **0**      | **0**   | **9** | **9** |

*Last updated: 2026-03-08 — [13.11-T1] e [13.11-T2] agendados para Sprint atual (2026-03)*

---

## 🔴 HIGH Priority

*No items.*

---

## 🟡 MEDIUM Priority

#### [13.2-T1] cleanupStaleSnapshots: push before unlink causes false index entry on failure

- **Source**: QA Review — Story 13.2 (gate: `docs/qa/gates/13.2-data-lifecycle-manager.yml`)
- **Priority**: 🟡 MEDIUM
- **Effort**: ~30 min
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Epic 13 — before production rollout
- **Risk**: MEDIUM — if `fs.unlink` fails and is caught by inner catch, the snapshot is recorded in `index.json` as removed even though the file still exists on disk, causing index/filesystem inconsistency
- **Description**: In `cleanupStaleSnapshots()` at `.aios-core/core/orchestration/data-lifecycle-manager.js:211`, `removedSnapshots.push()` occurs before `fs.unlink()` at line 221. If `unlink` throws and is caught by the inner `catch` (line 225), the snapshot entry is added to the index as "removed" but the file persists on disk.
- **Success Criteria**:
  - [ ] `removedSnapshots.push()` moved to after `await fs.unlink(filePath)` succeeds
  - [ ] A test confirms: when `unlink` throws, the snapshot is NOT recorded in `index.json`
  - [ ] All 23 tests in `data-lifecycle-manager.test.js` still pass
  - [ ] `npm run lint` 0 errors on modified file
- **Acceptance**: Index only contains entries for snapshots whose `unlink` completed successfully.

---

#### [13.2-T2] _updateSnapshotsIndex: non-atomic fs.writeFile risks index corruption on process kill

- **Source**: QA Review — Story 13.2 (gate: `docs/qa/gates/13.2-data-lifecycle-manager.yml`)
- **Priority**: 🟡 MEDIUM
- **Effort**: ~45 min
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Epic 13 — before production rollout
- **Risk**: MEDIUM — `fs.writeFile` truncates before writing; a process kill between truncate and write completion corrupts `index.json`, permanently losing all archived snapshot history
- **Description**: `_updateSnapshotsIndex()` at `.aios-core/core/orchestration/data-lifecycle-manager.js:285` uses `fs.writeFile` which is not OS-atomic (truncate-then-write). AC-2 requires index atomicity. Fix: write to a temp file (e.g. `index.json.tmp`) then `fs.rename` to `index.json` — `rename` is atomic on the same filesystem.
- **Success Criteria**:
  - [ ] `_updateSnapshotsIndex()` writes to a `.tmp` file and renames atomically
  - [ ] A test confirms existing entries survive a simulated concurrent write scenario
  - [ ] All 23 tests in `data-lifecycle-manager.test.js` still pass
  - [ ] `npm run lint` 0 errors on modified file
- **Acceptance**: Index file is never left in a partially-written state. `fs.rename` used as the final write step.

---

#### [10.7-T1] inject() no input validation — null crash + path traversal risk

- **Source**: QA Review — Story 10.7 (gate: `docs/qa/gates/10.7-synapse-domain-injector.yml`, MNT-001)
- **Priority**: 🟡 MEDIUM
- **Effort**: ~1 hour
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Epic 11 or standalone story
- **Risk**: MEDIUM — null/undefined activeDomains causes spread crash in production; crafted `file` values in array pose theoretical path traversal risk via `path.join()`
- **Description**: `inject()` in `.aios-core/core/synapse/domain-injector.js:30` does not validate the `activeDomains` parameter. Passing `null` or `undefined` crashes on spread. Additionally, domain `file` values from the manifest are passed directly to `path.join()` without sanitization, creating a theoretical path traversal vector if manifest data is compromised.
- **Success Criteria**:
  - [ ] Add input guard: `if (!activeDomains || !Array.isArray(activeDomains)) return ''`
  - [ ] Add path sanitization: validate each `file` value does not contain `..` before `path.join()`
  - [ ] All 316 synapse suite tests still pass (`npm test -- tests/core/synapse/`)
  - [ ] `npm run lint` 0 errors on modified file
- **Acceptance**: `inject(null)`, `inject(undefined)`, and `inject([])` return `''` gracefully. No path traversal possible via crafted manifest `file` values.

---

#### [10.7-T2] getStatus() integration test order-coupled to prior test

- **Source**: QA Review — Story 10.7 (gate: `docs/qa/gates/10.7-synapse-domain-injector.yml`, TEST-001)
- **Priority**: 🟡 MEDIUM
- **Effort**: ~30 min
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Epic 11 or standalone story
- **Risk**: LOW — currently passes in sequence, but will fail if test order changes or Jest parallelism is increased
- **Description**: `getStatus()` test at `tests/core/synapse/integration.test.js:151` relies on side effects written by the preceding `writeSessionFile()` test — both share the same temp directory and the session file written by the first test is consumed by the second. If execution order changes (e.g., `--randomize`, shard), the `getStatus` test fails with `initialized: false`.
- **Success Criteria**:
  - [ ] `getStatus` test block adds its own `writeSessionFile()` call in a `beforeEach` or at test start
  - [ ] Test passes when run in isolation: `npm test -- --testNamePattern "getStatus"`
  - [ ] 316/316 synapse suite tests still pass
  - [ ] No production code modified — test-only change
- **Acceptance**: `getStatus` test is fully self-contained and passes in any execution order, including `--randomize` and `--runInBand`.

---

#### [13.3-T1] Fix writeBobStatus state mutation (M1)

- **Source**: QA Review — Story 13.3 (gate: `docs/qa/gates/13.3-bob-status-writer.yml`, M1)
- **Priority**: 🟡 MEDIUM
- **Effort**: ~30 min
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Epic 13 — address before Bob CLI (Story 13.7) consumers call `getStatus()`
- **Risk**: MEDIUM — any caller that passes a status object and later inspects it will see unexpected mutation of `timestamp` and `elapsed` fields; latent reliability risk as more consumers are added in Epic 13 Part B
- **Description**: `writeBobStatus()` in `.aios-core/core/orchestration/bob-status-writer.js:224-229` mutates the `state` argument directly by assigning `state.timestamp = new Date().toISOString()` and `state.elapsed.session_seconds = ...`. Callers do not expect their object to be modified. The fix is to clone the state before mutation (e.g. `const payload = { ...state, elapsed: { ...state.elapsed } }`) or clearly document the mutation contract in JSDoc.
- **Success Criteria**:
  - [ ] `writeBobStatus()` does not mutate the caller's `state` argument
  - [ ] Caller can inspect `state.timestamp` and `state.elapsed` after calling `writeBobStatus()` and see original values
  - [ ] All 55 tests in `bob-status-writer.test.js` still pass
  - [ ] `npm run lint` 0 errors on modified file
- **Acceptance**: A test that captures `state.timestamp` before and after calling `writeBobStatus()` confirms the value is unchanged on the caller's object.

---

#### [11.2-T1] Fix 7 remaining parallel flaky test suites (Class F)

- **Source**: QA Review re-assessment (Story 11.2 post-11.4/11.5)
- **Priority**: 🟡 MEDIUM
- **Effort**: ~4–8 hours
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Next available CI Health sprint
- **Risk**: MEDIUM — blocks Story 11.2 AC5 (≤5 failing suites) and AC7 (CI pipeline green), which in turn blocks PR #6 from merging without `--admin`
- **Description**: After Stories 11.3 (Class A), 11.4 (Class B), and 11.5 (Class C/D/E) fixed their targeted suites, 7 non-deferred suites still fail when running the full `npm test` in parallel, but pass individually. These are cross-suite contamination issues (Class F). Suites affected:
  - `tests/config/config-cli.test.js`
  - `tests/unit/greeting-builder.test.js`
  - `tests/unit/squad/squad-generator.test.js`
  - `tests/core/orchestration/session-state.test.js`
  - `tests/core/semantic-merge-engine.test.js`
  - `tests/core/synapse/memory/self-learner.test.js`
  - `tests/core/wave-executor.test.js`
- **Success Criteria**:
  - [ ] All 7 suites pass in 3 consecutive full `npm test` parallel runs
  - [ ] Total failing suites in `npm test` ≤ 3 (deferred: 11.6, 11.7, 11.8 only)
  - [ ] Story 11.2 ACs 5 and 7 are met
  - [ ] `npm run lint` passes with 0 errors on any modified files
  - [ ] No production code modified — test-only changes
- **Acceptance**: `npm test` consistently shows ≤ 3 failing suites across 3 parallel runs. PR #6 can merge without `--admin`.

---

## 🟢 LOW Priority

#### [13.11-T1] Add test for session sync error swallow (catch block coverage)

- **Source**: QA Review — Story 13.11 (gate: `docs/qa/gates/13.11-aios-bob-explain.yml`)
- **Priority**: 🟢 LOW
- **Effort**: ~15 min
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Sprint atual (2026-03)
- **Risk**: LOW — `catch (_e)` block at `src/bob/commands/explain.js:37` is uncovered; the session sync error path is defensive (non-critical), but the test would complete coverage to 100% stmts
- **Description**: The `catch (_e)` block that swallows session sync errors (line 38 of `src/bob/commands/explain.js`) is not covered by any test. Adding a test that mocks `SessionState.prototype.loadSessionState` to throw an error would verify: (1) the error is swallowed silently, (2) the config write already completed, (3) the confirmation message still prints. This requires no production code change — test-only addition.
- **Success Criteria**:
  - [ ] Test added to `src/bob/__tests__/explain.test.js`: mock `loadSessionState` to throw → verify `setUserConfigValue` was already called + confirmation message printed + no unhandled rejection
  - [ ] Coverage on `src/bob/commands/explain.js` reaches ≥ 95% stmts
  - [ ] All 13 existing tests still pass, suite total ≥ 14
  - [ ] `npm run lint` 0 errors
- **Acceptance**: `catch (_e)` line covered by test. `runExplain('on')` resolves normally when session sync throws.

---

#### [13.11-T2] Add integration test for .action() outer error handler

- **Source**: QA Review — Story 13.11 (gate: `docs/qa/gates/13.11-aios-bob-explain.yml`)
- **Priority**: 🟢 LOW
- **Effort**: ~20 min
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Sprint atual (2026-03)
- **Risk**: LOW — lines 53–58 of `src/bob/commands/explain.js` (the `.action()` outer `try/catch`) are not covered; the wrapper protects against unexpected throws not caught internally, but this path is not exercised by unit tests on `runExplain` directly
- **Description**: The outer `try/catch` in the `.action(async (state) => { ... })` handler at lines 52–59 would only trigger if `runExplain` threw an unexpected error not already handled internally. Testing via Commander's `parseAsync` (same approach as `do.test.js` T2.7) with a mocked `runExplain` that throws would cover lines 55–58. This requires a commander-level integration test, not a direct `runExplain` call.
- **Success Criteria**:
  - [ ] Test added to `src/bob/__tests__/explain.test.js`: use `Command.parseAsync` with a mock that causes an unexpected throw → verify `consoleErrorSpy` called with `"Bob explain error:"` + `exitSpy` called with 1
  - [ ] All existing tests still pass
  - [ ] `npm run lint` 0 errors
- **Acceptance**: Lines 53–58 covered. Commander-level test confirms the wrapper catches unexpected errors and exits cleanly.

---

#### [11.5-O1] Rename fixture bob-surface-criteria.yaml to surface-criteria.yaml

- **Source**: QA Review (Story 11.5)
- **Priority**: 🟢 LOW
- **Effort**: ~15 min
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Backlog (no urgency)
- **Description**: The fixture at `tests/core/fixtures/bob-surface-criteria.yaml` is a verbatim copy of the production surface criteria file and is not specific to the "bob" user profile. The name is misleading — it suggests a bob-specific fixture but is actually a generic isolation fixture. Renaming to `surface-criteria.yaml` (or `surface-criteria-fixture.yaml`) would improve discoverability and reduce confusion when other suites need the same file.
- **Success Criteria**:
  - [ ] File renamed to `tests/core/fixtures/surface-criteria.yaml`
  - [ ] `FIXTURE_PATH` constant in `tests/core/surface-checker.test.js` updated to new name
  - [ ] All 5 tests in `surface-checker.test.js` still pass after rename
  - [ ] `npm run lint` passes with 0 errors
- **Acceptance**: `tests/core/surface-checker.test.js` passes with `--runInBand` and in parallel. No other files reference the old name.

---

*Created: 2026-03-03 | Format: AIOS Story Backlog v1.0*
