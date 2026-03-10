# Neo Task: Import Asset with Governance

> **Owner:** Neo — The Matrix Architect
> **Invoked by:** `*import-asset`
> **Depends on:** `.claude/skills/import-asset/SKILL.md` (technical layer)
> **Purpose:** Import external assets into the organization with full governance validation BEFORE execution.

---

## Overview

External assets (agents, squads, skills, code modules) that arrive from outside the territory must pass TWO layers of validation before entering:

1. **Technical Layer** — `import-asset` skill handles: dependency analysis, file mapping, path conflicts, npm packages, risk assessment.
2. **Governance Layer** — Neo handles: org chart positioning, 7-principle validation, gap verification, board approval.

The skill runs FIRST. Neo validates AFTER. Execution happens ONLY if BOTH layers pass.

---

## Workflow

### PHASE 1 — INTAKE

Ask the user (elicit=true — do NOT skip):

```
ASSET INTAKE — *import-asset

1. Source path (where to import FROM):
   Example: /c/Users/markm/OneDrive/Documentos/GitHub/aios-atualiza

2. Asset to import (agent name, squad name, skill name, etc.):
   Example: "analyst agent", "mmos squad", "synapse skill"

3. Target path (defaults to current repo):
   [Enter or confirm current working directory]

4. What does this asset DO? (brief description):
   [User answers — this seeds the gap analysis]
```

---

### PHASE 2 — TECHNICAL DIAGNOSTIC

Invoke the `import-asset` skill:

```
/import-asset
```

Feed the skill the source path, asset name, and target path from Phase 1.

The skill produces a DIAGNOSTIC REPORT with:
- Dependency tree (EXISTS / MISSING / DIFFERENT)
- Files to transfer
- Path adjustments needed
- Risk assessment (CRITICAL / WARNING / INFO)
- Verdict: READY TO IMPORT | NEEDS FIXES | BLOCKED

**STOP HERE** if skill verdict is BLOCKED.
Inform user: "Technical diagnostic blocked. Resolve CRITICALs before governance can run."

---

### PHASE 3 — ASSET CLASSIFICATION

Determine what TYPE of organizational component this is:

| If asset is... | Org component | Governance applies |
|----------------|---------------|--------------------|
| An agent `.md` | AGENT | P1, P2, P3, P3-org-position, P3-gap-verified |
| A squad directory | SQUAD | P1-squad, P2-squad, P3, P3-org-position |
| A skill `.md` | SKILL | P3 (no-duplicate check only) |
| A code module | MODULE | No org chart positioning required |
| A mind directory | MIND | P3, P4, P6, P7 |

If AGENT or SQUAD → **POSITIONING REQUIRED before approval.**
If SKILL or MODULE → lighter governance path.

---

### PHASE 4 — GOVERNANCE VALIDATION (7 Principles)

Run applicable checks from `.neo/data/principles.md`:

#### For AGENTS:

```
P1 — Maker ≠ Validator
  CHECK: Does the imported agent have a designated validator different from itself?
  If YES → ✅
  If NO → ⚠️ WARN — must define validator before integration

P2 — Process > People
  CHECK: Does the agent's primary task have at least 1 veto_condition?
  Read the agent .md file — look for veto_condition or equivalent stop rule.
  If YES → ✅
  If NO → 🔴 BLOCK — cannot enter without process gate

P3 — No Invention
  CHECK: Does this agent duplicate an existing agent on the board?
  Cross-reference ORGANOGRAMA.md — same function, same scope?
  If UNIQUE → ✅
  If DUPLICATE → 🔴 BLOCK — "No position for a clone of {existing_agent}."

P3-org-position — Org Chart Positioning
  CHECK: Is there a position defined for this agent on the board?
  This must be answered NOW — read the section below.
  If DEFINED → ✅
  If NOT DEFINED → 🔴 BLOCK

P3-gap-verified — Real Gap
  CHECK: Does this agent fill a gap that was verified, or a need the user can articulate?
  Use user's Phase 1 description + cross-check gaps.yaml.
  If YES → ✅
  If NO → ⚠️ WARN — flag as potentially redundant
```

#### For SQUADS:

```
P1 — Separation of Concerns
  CHECK: Does the squad have SEPARATE creator and auditor roles defined?
  If YES → ✅
  If NO → 🔴 BLOCK

P3 — No Duplication
  CHECK: Does this squad's purpose overlap with mmos-squad, squad-creator, ralph, or design?
  If UNIQUE → ✅
  If OVERLAP → 🔴 BLOCK

P3-org-position — Positioning required before integration
  CHECK: Is the squad positioned on the board?
  If DEFINED → ✅
  If NOT → 🔴 BLOCK
```

#### For SKILLS:
```
P3 — No Duplication
  CHECK: Does a skill with the same trigger conditions already exist in .claude/skills/?
  If UNIQUE → ✅
  If DUPLICATE → ⚠️ WARN
```

---

### PHASE 5 — ORG CHART POSITIONING (required for AGENT / SQUAD)

If the asset is an agent or squad, execute full positioning BEFORE approving:

```
BOARD POSITIONING — {Asset Name}

Answer the following:

1. Level on the board (0=Meta, 1=C-Level, 2=Director, 3=Manager, 4=Senior, 5=Operations, 6=Chief, 7=Council):
2. Department / Squad:
3. Reports to:
4. Validated by (P1 check):
5. Gap this fills (P3 check):
6. Unique function — what does it do that NO other agent does?
```

Wait for user to confirm positioning before proceeding.

**Neo's checkpoint line:** *"Nothing enters the territory without a place on the board."*

---

### PHASE 6 — GOVERNANCE VERDICT

Summarize the full assessment:

```
═══════════════════════════════════════════════════
  NEO GOVERNANCE VERDICT — {Asset Name}
═══════════════════════════════════════════════════

TECHNICAL:   {READY | NEEDS FIXES | BLOCKED}
GOVERNANCE:  {APPROVED | WARN | VETOED}

Principle checks:
  P1: {✅ | ⚠️ | 🔴} {note}
  P2: {✅ | ⚠️ | 🔴} {note}
  P3 (no-dup): {✅ | ⚠️ | 🔴} {note}
  P3 (position): {✅ | ⚠️ | 🔴} {note}
  P3 (gap): {✅ | ⚠️ | 🔴} {note}

Board position:
  Level: {N}
  Dept:  {department}
  Reports to: {agent}
  Validator:  {agent}

═══════════════════════════════════════════════════
  FINAL DECISION: {APPROVED TO IMPORT | VETOED}
═══════════════════════════════════════════════════
```

**VETOED** if any 🔴 BLOCK check failed. Fix before re-running.
**APPROVED** if all BLOCKs pass (WARNs acknowledged by user).

---

### PHASE 7 — EXECUTION (only if APPROVED)

Hand back to import-asset skill for execution:
- Copy files
- Rewrite paths if needed
- Install npm packages if needed

Neo does NOT touch files directly — delegates to the skill.

---

### PHASE 8 — POST-IMPORT BOARD UPDATE

After execution confirms success:

1. **Update ORGANOGRAMA.md** — add new member at confirmed level/department
2. **Update inventory.yaml** — increment correct counter (agents_core / agents_claude_code / etc.)
3. **Update CONSTITUICAO_MATRIX.md** — add to appropriate org chart section
4. **Record in MEMORY.md**:
   ```
   [date] TYPE: {agent|mind|squad|skill} | NAME: {name} | SOURCE: {source_repo} |
   ROLE: {role} | DEPT: {dept} | APPROVED_BY: neo | PRINCIPLES: all applicable passed
   ```

---

## Veto Conditions

| Condition | Result |
|-----------|--------|
| Technical BLOCKED (unresolved CRITICALs) | HALT — no governance runs |
| P1 violation (no validator defined) | 🔴 VETO |
| P2 violation (no veto_condition in task) | 🔴 VETO |
| P3 violation (duplicates existing agent) | 🔴 VETO |
| P3-position (no board position defined) | 🔴 VETO |
| User refuses to define positioning | 🔴 VETO — "No position, no entry." |

---

## Quick Reference — Neo Lines

- On intake: *"Let me see what's coming in."*
- On positioning: *"Nothing enters the territory without a place on the board."*
- On approval: *"Position confirmed. Execute."*
- On veto: *"No position. No entry."* or *"This violates P{n}. Fix it, or it doesn't enter."*
- On success: *"The territory got stronger today."*
