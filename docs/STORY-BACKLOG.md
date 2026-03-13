# STORY-BACKLOG.md

Centralized backlog for follow-ups, technical debt, and optimizations identified during story reviews, development, and QA processes.

---

## Statistics

| Priority | TODO | In Progress | Blocked | Done | Total |
|----------|------|-------------|---------|------|-------|
| 🔴 HIGH   | 0    | 0           | 0       | 0    | 0     |
| 🟡 MEDIUM | 0    | 0           | 0       | 0    | 0     |
| 🟢 LOW    | 3    | 0           | 0       | 2    | 5     |
| **Total** | **3** | **0**      | **0**   | **2** | **5** |

*Last updated: 2026-03-12 — +3 LOW items from QA review Story 21.5*

---

## 🔴 HIGH Priority

*No items.*

---

## 🟡 MEDIUM Priority

*No items.*

---

## 🟢 LOW Priority

#### [21.5-QA-1] Remove unused `Path` import in gap_detector.py

- **Source**: QA Review — Story 21.5 (gate: `docs/qa/gates/21.5-pkb-gap-detector.yml`)
- **Priority**: 🟢 LOW
- **Effort**: ~2 min
- **Status**: 🔵 TODO
- **Assignee**: Dev
- **File**: `knowledge-etl/src/knowledge_etl/kb/gap_detector.py:8`
- **Description**: `from pathlib import Path` imported but `Path` never referenced directly. All path operations derive from `PEOPLE_KB` (already a `Path` object). Remove to keep imports clean.

---

#### [21.5-QA-2] Remove unused `gd` alias in test_noop_when_metadata_absent

- **Source**: QA Review — Story 21.5 (gate: `docs/qa/gates/21.5-pkb-gap-detector.yml`)
- **Priority**: 🟢 LOW
- **Effort**: ~2 min
- **Status**: 🔵 TODO
- **Assignee**: Dev
- **File**: `knowledge-etl/tests/test_gap_detector.py` — `test_noop_when_metadata_absent`
- **Description**: `import knowledge_etl.kb.gap_detector as gd` inside test function but `gd` never used. Dead import — remove the line.

---

#### [21.5-QA-3] Move inline detect_and_write imports in cli.py to block-level

- **Source**: QA Review — Story 21.5 (gate: `docs/qa/gates/21.5-pkb-gap-detector.yml`)
- **Priority**: 🟢 LOW
- **Effort**: ~10 min
- **Status**: 🔵 TODO
- **Assignee**: Dev
- **Files**: `knowledge-etl/src/knowledge_etl/cli.py` — `process()` e `load()` commands
- **Description**: `detect_and_write` é importado inline dentro do bloco `if l3_results:`. Consistente com o padrão existente do arquivo, mas mover para top-level melhoraria legibilidade. Não urgente.

---

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
