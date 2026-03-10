# Neo Task: Fusion with Governance

> **Owner:** Neo — The Matrix Architect
> **Invoked by:** `*fusion`
> **Depends on:** `squads/squad-creator-pro/tasks/squad-fusion.md` (technical layer) + `squads/squad-creator-pro/workflows/wf-squad-fusion.yaml` (execution engine)
> **Purpose:** Fuse two or more organizational assets into a single superior result (C) with full governance validation BEFORE execution.

---

## Overview

**Import:** A + B → A + B (coexistence — use `*import-asset`)
**Fusion:** A + B → C (new, superior, unique — use `*fusion`)

Fusion is irreversible. Two entities cease to exist and one new entity takes their place.
This is not a technical operation. It is an organizational surgery.

Two layers must pass before the scalpel touches anything:

1. **Technical Layer** — `squad-fusion-analysis.md` task handles: capability mapping, overlap detection, conflict scoring, rollback path definition.
2. **Governance Layer** — Neo handles: org chart positioning of result C, 7-principle validation, gap verification, board approval.

Neo validates FIRST. Technical analysis runs SECOND. Execution happens ONLY if BOTH layers pass.

> **Scope (v1):** Squads. The `wf-squad-fusion.yaml` engine already handles squad fusion robustly (6 phases, 4 veto conditions, 3 quality gates, rollback procedure). Fusion of individual agents, tasks, or workflows is a future story.

---

## Workflow

### PHASE 1 — INTAKE

Ask the user (elicit=true — do NOT skip):

```
FUSION INTAKE — *fusion

1. Source A (first squad/asset to fuse):
   Example: squad-creator

2. Source B (second squad/asset to fuse):
   Example: squad-creator-pro

3. Proposed name for result C:
   Example: squad-creator-unified

4. What does C do that neither A nor B does alone? (brief description):
   [User answers — this seeds the gap analysis and P3-gap-verified check]

5. What happens to A and B after fusion? (archive | delete | keep as alias):
   [User answers — this seeds the rollback path and P4 human checkpoint]
```

---

### PHASE 2 — PRE-FUSION ANALYSIS

Invoke the `squad-fusion-analysis.md` task from squad-creator-pro:

```
Path: squads/squad-creator-pro/tasks/squad-fusion-analysis.md
```

Feed the task: source A path, source B path, proposed C name, and user description from Phase 1.

The analysis produces a FUSION DIAGNOSTIC REPORT with:
- Capability overlap map (UNIQUE / OVERLAPPING / CONFLICTING)
- File collision assessment
- Rollback path definition (can we reconstruct A and B if C fails?)
- Risk score (CRITICAL / WARNING / INFO)
- Verdict: READY TO FUSE | NEEDS RESOLUTION | BLOCKED

**STOP HERE** if verdict is BLOCKED or < 2 valid squads identified.
Inform user: "Pre-fusion analysis blocked [VETO-NEO-FUS-001]. Resolve CRITICALs before governance can run."

---

### PHASE 3 — ASSET CLASSIFICATION

Determine what TYPE of organizational component is being fused:

| If assets are... | Org component | Governance path |
|------------------|---------------|-----------------|
| Two squad directories | SQUAD FUSION | Full: P1, P2, P3, P3-org-position, P3-gap-verified |
| Two agent `.md` files | AGENT FUSION | DEFERRED — not supported in v1 |
| Two task `.md` files | TASK FUSION | DEFERRED — not supported in v1 |
| Mixed types | MIXED | DEFERRED — not supported in v1 |

**If DEFERRED:** Inform user — "Fusion of {type} assets is not yet supported. Scope is currently squads only. Request a Story 18.x to add this capability."

**If SQUAD FUSION:** Proceed to Phase 4 with full governance path.

---

### PHASE 4 — GOVERNANCE VALIDATION (7 Principles)

Run all applicable checks from `.neo/data/principles.md`:

```
P1 — Maker ≠ Validator
  CHECK: Will @squad-chief execute the fusion AND validate result C?
  If maker ≠ validator → ✅
  If same agent does both → 🔴 BLOCK — "@qa must validate result C independently."

P2 — Process > People
  CHECK: Does wf-squad-fusion.yaml have at least 1 veto_condition?
  Answer: YES (4 veto conditions confirmed in wf-squad-fusion.yaml) → ✅ inherited
  NOTE: P2 is structurally satisfied by the existing workflow engine.

P3 — No Invention / No Duplication
  CHECK: Does result C duplicate an existing squad on the board?
  Cross-reference ORGANOGRAMA.md — same function, same scope?
  If UNIQUE → ✅
  If DUPLICATE → 🔴 BLOCK [VETO-NEO-FUS-002] — "Result C duplicates {existing_squad}. No position for a clone."

P3-gap-verified — Real Gap
  CHECK: Does result C fill a gap that A and B individually could not?
  Use user's Phase 1 description + cross-check gaps.yaml.
  If YES — articulable, verified gap → ✅
  If NO → 🔴 BLOCK [VETO-NEO-FUS-003] — "No gap justifies this fusion. Organizational surgery requires a verified wound."

P3-org-position — Org Chart Positioning of C
  CHECK: Has result C been positioned on the board BEFORE execution?
  This must be answered NOW — see Phase 5.
  If DEFINED → ✅
  If NOT DEFINED → 🔴 BLOCK [VETO-NEO-FUS-004]

P4 — Human Checkpoint
  CHECK: Is a human checkpoint defined for the cleanup phase (archiving/deleting A and B)?
  wf-squad-fusion.yaml has this as Phase 6 — CHECK: confirm it is marked as human-required.
  If YES → ✅
  If NO → ⚠️ WARN — flag for user confirmation before execution.

P5 — Rollback Path (fusion-specific)
  CHECK: Has the squad-fusion-analysis defined a rollback path BEFORE Phase 4 of wf-squad-fusion?
  If YES → ✅
  If NO → 🔴 BLOCK [VETO-NEO-FUS-005] — "No rollback path defined. Fusion cannot begin without an exit door."
```

---

### PHASE 5 — ORG CHART POSITIONING OF RESULT C

Position result C BEFORE approving execution:

```
BOARD POSITIONING — {Result C Name}

Answer the following for the entity that will REPLACE A and B:

1. Level on the board (0=Meta, 1=C-Level, 2=Director, 3=Manager, 4=Senior, 5=Operations, 6=Chief, 7=Council):
2. Department / Reports to:
3. Validated by (P1 check — must differ from @squad-chief who executes):
4. Gap this fills that neither A nor B fills alone:
5. Unique function — what does C do that NO other squad does?
6. Disposition of A after fusion (archive | delete | alias):
7. Disposition of B after fusion (archive | delete | alias):
```

Wait for user to confirm positioning before proceeding.

**Neo's checkpoint line:** *"Result C needs a position before A and B cease to exist."*

---

### PHASE 6 — GOVERNANCE VERDICT

Summarize the full assessment:

```
═══════════════════════════════════════════════════
  NEO GOVERNANCE VERDICT — FUSION {A} + {B} → {C}
═══════════════════════════════════════════════════

PRE-FUSION ANALYSIS:  {READY | NEEDS RESOLUTION | BLOCKED}
GOVERNANCE:           {APPROVED | WARN | VETOED}

Veto conditions:
  VETO-NEO-FUS-001 (< 2 valid squads):    {✅ | 🔴} {note}
  VETO-NEO-FUS-002 (C duplicates board):  {✅ | 🔴} {note}
  VETO-NEO-FUS-003 (no gap verified):     {✅ | 🔴} {note}
  VETO-NEO-FUS-004 (C not positioned):    {✅ | 🔴} {note}
  VETO-NEO-FUS-005 (no rollback path):    {✅ | 🔴} {note}

Principle checks:
  P1 (maker ≠ validator):  {✅ | ⚠️ | 🔴} {note}
  P2 (process gate):       {✅ inherited from wf-squad-fusion.yaml}
  P3 (no-dup):             {✅ | ⚠️ | 🔴} {note}
  P3 (gap-verified):       {✅ | ⚠️ | 🔴} {note}
  P3 (position):           {✅ | ⚠️ | 🔴} {note}
  P4 (human checkpoint):   {✅ | ⚠️ | 🔴} {note}
  P5 (rollback path):      {✅ | ⚠️ | 🔴} {note}

Board position for C:
  Level: {N}
  Dept / Reports to: {department}
  Validator:  {agent} (≠ @squad-chief)
  Gap filled: {description}
  Disposition A: {archive | delete | alias}
  Disposition B: {archive | delete | alias}

═══════════════════════════════════════════════════
  FINAL DECISION: {APPROVED TO FUSE | VETOED}
═══════════════════════════════════════════════════
```

**VETOED** if any 🔴 BLOCK check failed. Fix before re-running.
**APPROVED** if all BLOCKs pass (WARNs acknowledged by user).

---

### PHASE 7 — EXECUTION (only if APPROVED)

Hand off to @squad-chief for execution via wf-squad-fusion.yaml:

```
@squad

CONTEXT FROM NEO:
Governance approved. Principles validated. Rollback path confirmed.

FUSION MISSION:
- Source A: {path_A}
- Source B: {path_B}
- Result C: {name_C} at {target_path}
- Level: {level} | Reports to: {reports_to} | Validator: {validator}
- Rollback path: {rollback_definition}
- Disposition A: {archive | delete | alias}
- Disposition B: {archive | delete | alias}

EXECUTE:
*fusion {A} {B} → {C}
[wf-squad-fusion.yaml — all 6 phases]

Human checkpoint required at cleanup phase (archiving/deletion of A and B).
Report back to Neo when execution is confirmed.
```

Neo does NOT touch squad files directly — delegates to @squad-chief via wf-squad-fusion.yaml.

---

### PHASE 8 — POST-FUSION BOARD UPDATE

After @squad-chief confirms execution success:

1. **Update ORGANOGRAMA.md** — remove A and B entries, add C at confirmed position
2. **Update inventory.yaml** — update squad counts, adjust task/workflow counts if changed
3. **Update CONSTITUICAO_MATRIX.md** — replace A/B with C in org chart section
4. **Record in MEMORY.md**:
   ```
   [date] TYPE: squad_fusion | SOURCE_A: {A} | SOURCE_B: {B} | RESULT: {C} |
   ROLE: {role} | LEVEL: {level} | APPROVED_BY: neo | GAP: {gap_filled} |
   PRINCIPLES: P1-P5 all passed | ROLLBACK: {rollback_path}
   ```

---

## Veto Conditions

| Code | Condition | Result |
|------|-----------|--------|
| VETO-NEO-FUS-001 | < 2 valid squads identified | 🔴 HALT — pre-fusion analysis fails |
| VETO-NEO-FUS-002 | Result C duplicates existing squad on board | 🔴 VETO |
| VETO-NEO-FUS-003 | No verified organizational gap justifies the fusion | 🔴 VETO |
| VETO-NEO-FUS-004 | Result C has no position defined on the board | 🔴 VETO |
| VETO-NEO-FUS-005 | No rollback path defined before execution begins | 🔴 VETO |

---

## Quick Reference — Neo Lines

- On intake: *"What stops existing? What is born in its place?"*
- On positioning: *"Result C needs a position before A and B cease to exist."*
- On approval: *"Position confirmed. The surgery can begin."*
- On veto: *"No position for the result. No fusion."* or *"P{n} violated. Fix it before we touch anything."*
- On success: *"Two became one. The territory got stronger today."*
- On scope: *"Fusion of {type} is not yet supported. The scalpel has limits."*
