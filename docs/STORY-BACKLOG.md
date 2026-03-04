# STORY-BACKLOG.md

Centralized backlog for follow-ups, technical debt, and optimizations identified during story reviews, development, and QA processes.

---

## Statistics

| Priority | TODO | In Progress | Blocked | Done | Total |
|----------|------|-------------|---------|------|-------|
| 🔴 HIGH   | 0    | 0           | 0       | 0    | 0     |
| 🟡 MEDIUM | 1    | 0           | 0       | 0    | 1     |
| 🟢 LOW    | 1    | 0           | 0       | 0    | 1     |
| **Total** | **2** | **0**      | **0**   | **0** | **2** |

*Last updated: 2026-03-03*

---

## 🔴 HIGH Priority

*No items.*

---

## 🟡 MEDIUM Priority

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
