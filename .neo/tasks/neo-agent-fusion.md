# Neo Task: Agent Fusion with Governance

> **Owner:** Neo — The Matrix Architect
> **Invoked by:** `*agent-fusion`
> **Depends on:** `@dev` (create agent file) + `@sm` (backlog update)
> **Purpose:** Fuse two agents into a single superior result (Agent C) with full governance validation BEFORE any execution.

---

## Overview

**Import:** Agent A + Agent B → Agent A + Agent B (coexistence — use `*import-asset`)
**Fusion:** Agent A + Agent B → Agent C (new, superior, unique — use `*agent-fusion`)

Agent fusion is irreversible. Two employees cease to exist and one new employee takes their place.
This is not a technical operation. It is organizational surgery on living personnel.

Agents carry persona DNA, capability sets, voice patterns, and tool authority.
Merging them without governance risks: persona conflicts, capability gaps, duplicate tool scopes, authority void.

Two layers govern this operation:

1. **Governance Layer** — Neo handles: org chart positioning of Agent C, 7-principle validation, gap verification, board approval.
2. **Execution Layer** — @dev handles: create new agent file, merge capabilities/tools/persona. @sm handles: backlog and story updates.

Neo validates FIRST. Execution happens ONLY if governance passes.

> **Scope (v2):** Agents. Fusion of tasks or workflows is a future story (18.3+).

---

## Workflow

### PHASE 1 — INTAKE

Ask the user (elicit=true — do NOT skip):

```
AGENT FUSION INTAKE — *agent-fusion

1. Source Agent A (first agent to fuse):
   Example: dev

2. Source Agent B (second agent to fuse):
   Example: architect

3. Proposed name for result Agent C:
   Example: dev-architect

4. What capability gap does C fill that neither A nor B fills alone? (brief description):
   [User answers — this seeds the gap analysis and P3-gap-verified check]

5. What happens to A and B after fusion? (archive | deprecate | keep as alias):
   [User answers — this seeds the rollback path and P4 human checkpoint]
```

---

### PHASE 2 — PRE-FUSION ANALYSIS

Read both source agent files:
- Path A: `.aios-core/development/agents/{agent_a}.md` (or `.claude/agents/{agent_a}.md`)
- Path B: `.aios-core/development/agents/{agent_b}.md` (or `.claude/agents/{agent_b}.md`)

Produce an AGENT FUSION DIAGNOSTIC REPORT with:
- Capability overlap map (UNIQUE to A / UNIQUE to B / OVERLAPPING / CONFLICTING)
- Tool authority overlap (same tools in both → potential conflicts)
- Persona conflict assessment (tone, archetype, vocabulary clashes)
- Rollback path definition (can we restore A and B if C fails? — are originals archived, not deleted?)
- Risk score: CRITICAL / WARNING / INFO
- Verdict: READY TO FUSE | NEEDS RESOLUTION | BLOCKED

**STOP HERE** if verdict is BLOCKED or < 2 valid agents identified.
Inform user: "Pre-fusion analysis blocked [VETO-NEO-AFU-001]. Resolve CRITICALs before governance can run."

---

### PHASE 3 — ASSET CLASSIFICATION

Determine what TYPE of organizational component is being fused:

| If assets are... | Org component | Governance path |
|------------------|---------------|-----------------|
| Two agent `.md` files | AGENT FUSION | Full: P1, P2, P3, P3-org-position, P3-gap-verified, P4, P5 |
| Two squad directories | SQUAD FUSION | DEFERRED — use `*fusion` (Story 18.1, scope v1) |
| Two task `.md` files | TASK FUSION | DEFERRED — not supported in v2 (Story 18.3) |
| Mixed types | MIXED | DEFERRED — not supported in v2 |

**If DEFERRED:** Inform user — "Fusion of {type} assets is not supported in *agent-fusion. Use `*fusion` for squads. Request Story 18.3+ for task/workflow fusion."

**If AGENT FUSION:** Proceed to Phase 4 with full governance path.

---

### PHASE 4 — GOVERNANCE VALIDATION (7 Principles)

Run all applicable checks from `.neo/data/principles.md`:

```
P1 — Maker ≠ Validator
  CHECK: Will @dev create Agent C AND validate it?
  If maker ≠ validator → ✅ (@qa must validate Agent C independently)
  If same agent does both → 🔴 BLOCK — "@qa must validate Agent C. P1 violated."

P2 — Process > People
  CHECK: Is there a defined process for agent creation (@dev follows story AC + dev notes)?
  Answer: YES — story-driven development + dev-develop-story.md → ✅ inherited
  NOTE: P2 is structurally satisfied by the AIOS development process.

P3 — No Invention / No Duplication
  CHECK: Does result Agent C duplicate an existing agent on the board?
  Cross-reference ORGANOGRAMA.md — same function, same scope?
  If UNIQUE → ✅
  If DUPLICATE → 🔴 BLOCK [VETO-NEO-AFU-002] — "Result C duplicates {existing_agent}. No position for a clone."

P3-gap-verified — Real Gap
  CHECK: Does result Agent C fill a capability gap that A and B individually could not?
  Use user's Phase 1 description + cross-check current board capabilities.
  If YES — articulable, verified gap → ✅
  If NO → 🔴 BLOCK [VETO-NEO-AFU-003] — "No gap justifies this fusion. Organizational surgery requires a verified wound."

P3-org-position — Org Chart Positioning of C
  CHECK: Has result Agent C been positioned on the board BEFORE execution?
  This must be answered NOW — see Phase 5.
  If DEFINED → ✅
  If NOT DEFINED → 🔴 BLOCK [VETO-NEO-AFU-004]

P4 — Human Checkpoint
  CHECK: Is a human checkpoint defined for the cleanup phase (archiving/deprecating A and B)?
  Disposition of A and B was captured in Phase 1 — CHECK: confirm user explicitly approves the final disposition.
  If YES → ✅
  If NO → ⚠️ WARN — pause before execution for explicit human confirmation of disposition.

P5 — Rollback Path (fusion-specific)
  CHECK: Has a rollback path been defined BEFORE execution begins?
  Rollback = can we restore agents A and B if C fails in production?
  Method: archive (not delete) A and B originals. Keep as `.archive/` copy.
  If YES → ✅
  If NO → 🔴 BLOCK [VETO-NEO-AFU-005] — "No rollback path defined. Agent surgery cannot begin without an exit door."
```

---

### PHASE 5 — ORG CHART POSITIONING OF RESULT AGENT C

Position Agent C BEFORE approving execution:

```
BOARD POSITIONING — {Result Agent C Name}

Answer the following for the employee that will REPLACE A and B:

1. Level on the board (1=C-Level, 2=Director, 3=Manager, 4=Senior, 5=Operations, 6=Chief):
2. Department / Reports to:
3. Validated by (P1 check — must differ from @dev who creates Agent C):
4. Tool authority (which tools does C inherit from A and B? any tools removed?):
5. Capability gap this fills that neither A nor B fills alone:
6. Unique function — what does C do that NO other agent does?
7. Disposition of Agent A after fusion (archive | deprecate | keep as alias):
8. Disposition of Agent B after fusion (archive | deprecate | keep as alias):
```

Wait for user to confirm positioning before proceeding.

**Neo's checkpoint line:** *"Agent C needs a position before A and B cease to exist."*

---

### PHASE 6 — GOVERNANCE VERDICT

Summarize the full assessment:

```
═══════════════════════════════════════════════════════
  NEO GOVERNANCE VERDICT — AGENT FUSION {A} + {B} → {C}
═══════════════════════════════════════════════════════

PRE-FUSION ANALYSIS:  {READY | NEEDS RESOLUTION | BLOCKED}
GOVERNANCE:           {APPROVED | WARN | VETOED}

Veto conditions:
  VETO-NEO-AFU-001 (< 2 valid agents):          {✅ | 🔴} {note}
  VETO-NEO-AFU-002 (C duplicates board):        {✅ | 🔴} {note}
  VETO-NEO-AFU-003 (no gap verified):           {✅ | 🔴} {note}
  VETO-NEO-AFU-004 (C not positioned):          {✅ | 🔴} {note}
  VETO-NEO-AFU-005 (no rollback path):          {✅ | 🔴} {note}

Principle checks:
  P1 (maker ≠ validator):   {✅ | ⚠️ | 🔴} {note}
  P2 (process gate):        {✅ inherited from AIOS story-driven dev process}
  P3 (no-dup):              {✅ | ⚠️ | 🔴} {note}
  P3 (gap-verified):        {✅ | ⚠️ | 🔴} {note}
  P3 (position):            {✅ | ⚠️ | 🔴} {note}
  P4 (human checkpoint):    {✅ | ⚠️ | 🔴} {note}
  P5 (rollback path):       {✅ | ⚠️ | 🔴} {note}

Board position for Agent C:
  Level: {N}
  Dept / Reports to: {department}
  Validator: {agent} (≠ @dev who creates)
  Tool authority: {inherited tools list}
  Gap filled: {description}
  Disposition A: {archive | deprecate | alias}
  Disposition B: {archive | deprecate | alias}

═══════════════════════════════════════════════════════
  FINAL DECISION: {APPROVED TO FUSE | VETOED}
═══════════════════════════════════════════════════════
```

**VETOED** if any 🔴 BLOCK check failed. Fix before re-running.
**APPROVED** if all BLOCKs pass (WARNs acknowledged by user).

---

### PHASE 7 — EXECUTION PROTOCOL (only if APPROVED)

Agent fusion is simpler than squad fusion — no external workflow engine exists. Neo delegates directly:

**Step 1 — Delegate to @dev:**

```
@dev

FROM NEO:
MISSION: Create Agent C by merging agents A and B.
GOVERNANCE: Approved. All 7 principles passed. Rollback path confirmed.

AGENT FUSION MISSION:
- Source A: {path_A} (disposition: {archive|deprecate|alias})
- Source B: {path_B} (disposition: {archive|deprecate|alias})
- Result C: {name_C}
- Target path: .aios-core/development/agents/{name_C}.md
  (or .claude/agents/{name_C}.md if Claude Code scope)
- Level: {level} | Reports to: {reports_to} | Validator: {validator}
- Rollback path: archive originals to .archive/ before modifying anything
- Tool authority: {tools_list}

EXECUTE:
1. Archive Agent A original → .archive/agents/{name_A}.md
2. Archive Agent B original → .archive/agents/{name_B}.md
3. Create {name_C}.md — merge capabilities, tools, persona from A + B
4. Apply disposition to A and B (archive/deprecate/alias per governance verdict)
5. Report back to Neo when agent file is created.

Human checkpoint required BEFORE final disposal of A and B originals.
```

**Step 2 — Delegate to @sm (if A or B are referenced in active stories):**

```
@sm

FROM NEO:
Agents {A} and {B} have been fused into Agent C ({name_C}).
Review active stories in docs/stories/active/ for any tasks referencing @{A} or @{B}.
Update story ownership fields and task assignments to @{name_C}.
Report back when complete.
```

Neo does NOT create agent files directly — delegates to @dev.

---

### PHASE 8 — POST-FUSION BOARD UPDATE

After @dev confirms execution success:

1. **Update ORGANOGRAMA.md** — remove Agent A and B entries, add Agent C at confirmed position
2. **Update inventory.yaml** — update agent counts in correct category
3. **Update MEMORY.md**:
   ```
   [date] TYPE: agent_fusion | SOURCE_A: {A} | SOURCE_B: {B} | RESULT: {C} |
   ROLE: {role} | LEVEL: {level} | APPROVED_BY: neo | GAP: {gap_filled} |
   PRINCIPLES: P1-P5 all passed | ROLLBACK: originals archived at .archive/agents/
   ```

---

## Veto Conditions

| Code | Condition | Result |
|------|-----------|--------|
| VETO-NEO-AFU-001 | < 2 valid agents identified | 🔴 HALT — pre-fusion analysis fails |
| VETO-NEO-AFU-002 | Result Agent C duplicates existing agent on board | 🔴 VETO |
| VETO-NEO-AFU-003 | No verified organizational gap justifies the fusion | 🔴 VETO |
| VETO-NEO-AFU-004 | Result Agent C has no position defined on the board | 🔴 VETO |
| VETO-NEO-AFU-005 | No rollback path defined before execution begins | 🔴 VETO |

---

## Quick Reference — Neo Lines

- On intake: *"What stops existing? What is born in its place?"*
- On positioning: *"Agent C needs a position before A and B cease to exist."*
- On approval: *"Position confirmed. The surgery can begin."*
- On veto: *"No position for the result. No fusion."* or *"P{n} violated. Fix it before we touch anything."*
- On success: *"Two became one. The territory got stronger today."*
- On scope: *"Fusion of {type} is not yet supported in *agent-fusion. The scalpel has limits."*
