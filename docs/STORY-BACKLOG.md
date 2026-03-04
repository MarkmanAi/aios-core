# STORY-BACKLOG.md

Centralized backlog for follow-ups, technical debt, and optimizations identified during story reviews, development, and QA processes.

---

## Statistics

| Priority | TODO | In Progress | Blocked | Done | Total |
|----------|------|-------------|---------|------|-------|
| 🔴 HIGH   | 0    | 0           | 0       | 0    | 0     |
| 🟡 MEDIUM | 3    | 0           | 0       | 0    | 3     |
| 🟢 LOW    | 1    | 0           | 0       | 0    | 1     |
| **Total** | **4** | **0**      | **0**   | **0** | **4** |

*Last updated: 2026-03-04*

---

## 🔴 HIGH Priority

*No items.*

---

## 🟡 MEDIUM Priority

#### [10.7-T1] inject() no input validation — null crash + path traversal risk

- **Source**: QA Review — Story 10.7 (gate: `docs/qa/gates/10.7-synapse-domain-injector.yml`, MNT-001)
- **Priority**: 🟡 MEDIUM
- **Effort**: ~1 hour
- **Status**: 📋 TODO
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
- **Status**: 📋 TODO
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

#### [11.2-T1] Fix 7 remaining parallel flaky test suites (Class F)

- **Source**: QA Review re-assessment (Story 11.2 post-11.4/11.5)
- **Priority**: 🟡 MEDIUM
- **Effort**: ~4–8 hours
- **Status**: 📋 TODO
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

#### [11.5-O1] Rename fixture bob-surface-criteria.yaml to surface-criteria.yaml

- **Source**: QA Review (Story 11.5)
- **Priority**: 🟢 LOW
- **Effort**: ~15 min
- **Status**: 📋 TODO
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
