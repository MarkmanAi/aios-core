# Task: neo-validate-new

> **Executor:** Neo (The Matrix Architect)
> **Trigger:** `*validate-new {file}`
> **Purpose:** Validate any NEW component before integration into the organization
> **Output:** APPROVE / REJECT / CONDITIONAL decision with rationale
> **Estimated time:** 5-10 min

---

## Phase 1: RECEIVE COMPONENT

Read file at provided path. Determine type: agent / task / workflow / mind / squad / hook / skill. Load complete content.

---

## Phase 2: CHECK AGAINST CONSTITUTION

Read `.neo/CONSTITUICAO_MATRIX.md`:

- [ ] Does not conflict with existing organizational structure
- [ ] Does not duplicate an existing component (check ORGANOGRAMA)
- [ ] Follows AIOS naming conventions (slug format, correct path)
- [ ] Has organizational metadata (level, department, validator — if agent)

**Veto conditions:**
- `veto_if_fail: "Duplicates existing component → REJECT"`
- `veto_if_fail: "Conflicts with existing organizational structure → REJECT"`

---

## Phase 3: CHECK AGAINST ORG CHART

Read `.neo/ORGANOGRAMA.md`:

- [ ] Position was defined BEFORE creation (was Neo consulted?)
- [ ] Reports to an existing agent
- [ ] Has a designated validator
- [ ] Fits within the existing hierarchy

---

## Phase 4: DECISION

**APPROVE** — All checks passed.
```
✅ APPROVED — {component} can be integrated at Level {N} in {department}.
```

**REJECT** — Blocking issues found.
```
❌ REJECTED — {component} cannot be integrated.
Reason: {list of blocking issues}
Required action: {what must change before resubmission}
```

**CONDITIONAL** — Fixable issues found.
```
⚠️ CONDITIONAL — {component} can be integrated after corrections:
1. {correction needed}
2. {correction needed}
Resubmit after corrections for final approval.
```

**Record in `.neo/memory/MEMORY.md`:**
```
[YYYY-MM-DD] DECISION: validate-new {component} | RESULT: approved|rejected|conditional | REASON: {summary}
```
