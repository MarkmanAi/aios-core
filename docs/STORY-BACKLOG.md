# STORY-BACKLOG.md

Centralized backlog for follow-ups, technical debt, and optimizations identified during story reviews, development, and QA processes.

---

## Statistics

| Priority | TODO | In Progress | Blocked | Done | Total |
|----------|------|-------------|---------|------|-------|
| 🔴 HIGH   | 0    | 0           | 0       | 0    | 0     |
| 🟡 MEDIUM | 0    | 0           | 0       | 0    | 0     |
| 🟢 LOW    | 0    | 0           | 0       | 2    | 2     |
| **Total** | **0** | **0**      | **0**   | **2** | **2** |

*Last updated: 2026-03-08 — 9 items archived to `docs/qa/backlog-archive-2026-03.md`*

---

## 🔴 HIGH Priority

*No items.*

---

## 🟡 MEDIUM Priority

*No items.*

---

## 🟢 LOW Priority

#### [13.12-N1] Add `initialValue: false` to `confirm()` in bob switch

- **Source**: CodeRabbit nitpick — PR #10, Story 13.12 (gate: `docs/qa/gates/13.12-aios-bob-switch.yml`)
- **Priority**: 🟢 LOW
- **Effort**: ~5 min
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Backlog
- **Risk**: LOW — @clack/prompts v0.11.0 defaults `confirm()` to `true` (Yes) when `initialValue` is omitted. AC-2 requires "default No". Currently works correctly via mock in tests, but the explicit default is missing in production code.
- **Description**: In `src/bob/commands/switch.js:24`, the `confirm()` call does not pass `initialValue: false`. In @clack/prompts v0.11.0 the omitted `initialValue` defaults to `true`, meaning pressing Enter without typing selects "Yes" instead of "No".
- **Fix** (one-liner):
  ```js
  // Before
  const shouldSwitch = await confirm({ message: 'Switch to advanced mode?' });

  // After
  const shouldSwitch = await confirm({ message: 'Switch to advanced mode?', initialValue: false });
  ```
- **Success Criteria**:
  - [ ] `confirm()` call includes `initialValue: false`
  - [ ] All 16 tests still pass (`npm test -- src/bob/__tests__/switch.test.js`)
  - [ ] `npm run lint` 0 errors
- **Acceptance**: Pressing Enter at the prompt cancels (no changes). AC-2 satisfied explicitly in code, not just via prompt display.

---

#### [13.12-N2] Dynamically read agent count in `ADVANCED_MODE_EXPLANATION`

- **Source**: CodeRabbit nitpick — PR #10, Story 13.12 (gate: `docs/qa/gates/13.12-aios-bob-switch.yml`)
- **Priority**: 🟢 LOW
- **Effort**: ~15 min
- **Status**: ✅ Done
- **Assignee**: Dev
- **Sprint**: Backlog
- **Risk**: LOW — `ADVANCED_MODE_EXPLANATION` in `src/bob/commands/switch.js:9` hardcodes `"11 AIOS agents"`. If agents are added or removed, the text becomes stale without any indication.
- **Description**: Replace the hardcoded count with a dynamic read from the agents source of truth (e.g., the agents array/directory). This keeps the explanation accurate as the agent roster grows.
- **Fix** (example approach):
  ```js
  // Option A — count from agents directory
  const agentFiles = require('fs').readdirSync(
    path.join(__dirname, '../../../.aios-core/development/agents')
  ).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  const agentCount = agentFiles.length;

  const ADVANCED_MODE_EXPLANATION = `
  Advanced mode gives you access to all ${agentCount} AIOS agents and the full command palette.
  ...`;
  ```
- **Success Criteria**:
  - [ ] Agent count is read dynamically (not hardcoded)
  - [ ] Explanation still renders correctly in terminal
  - [ ] All 16 tests still pass (update T1.2 assertion from `'11'` to the dynamic count)
  - [ ] `npm run lint` 0 errors
- **Acceptance**: Adding or removing an agent `.md` file automatically updates the explanation text.

---

*Created: 2026-03-03 | Format: AIOS Story Backlog v1.0*
*Archive: [2026-03](qa/backlog-archive-2026-03.md) — 9 items*
