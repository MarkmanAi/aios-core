# Task: neo-create-dept

> **Executor:** Neo (The Matrix Architect)
> **Trigger:** `*create-dept {name}`
> **Purpose:** Create a new department (squad) in the organization
> **Output:** Squad justified, designed, created, and integrated
> **Estimated time:** 30-60 min

---

## Phase 1: JUSTIFY EXISTENCE

**Elicit:**
1. Squad name
2. Purpose: "Why does this department exist?"
3. Can this be absorbed by an existing squad? (mmos-squad or squad-creator)
4. Mass criteria: Will it have at least 3 agents AND 5 tasks?

**Veto conditions:**
- `veto_if_fail: "Can be absorbed by existing squad → no new department needed"`
- `veto_if_fail: "Fewer than 3 agents or 5 tasks planned → insufficient mass"`

---

## Phase 2: DESIGN STRUCTURE

**Template:** Load `.neo/templates/new-squad-position.md`

**Define ALL:**
- Lead agent (orchestrator)
- Member agents (with roles and levels)
- Tasks (SOPs the department needs)
- Workflows (business processes)
- Governance (who audits)
- Interfaces with existing squads

**Principle validation:**
- [ ] P1 — Maker ≠ Validator: squad has separate creators and validators
- [ ] P2 — Process > People: all tasks will have veto conditions
- [ ] P3 — No Invention: doesn't duplicate existing squad

**CHECKPOINT:** Present complete structure to human. Wait for approval.

---

## Phase 3: DELEGATE CREATION

**Delegate to Squad Chief:**

```
@squad

CONTEXT FROM NEO — SQUAD DESIGN APPROVED:
- Name: {name} | Purpose: {purpose}
- Lead: {leader} | Members: {members}
- Tasks: {tasks} | Governance: {auditor}

EXECUTE: *create-squad {name}
Each member agent will go through *hire-agent positioning separately.
```

**Neo supervises:** Each agent in the new squad goes through the full `*hire-agent` process.

---

## Phase 4: INTEGRATE

**ALL mandatory:**

1. **`.neo/ORGANOGRAMA.md`** — Add new squad section with all members
2. **`.neo/data/inventory.yaml`** — Increment `squads`, add member counts
3. **`.neo/CONSTITUICAO_MATRIX.md`** — Add full squad description
4. **`.neo/data/gaps.yaml`** — Close any gap this squad fills
5. **`.neo/memory/MEMORY.md`** — Record MEMBERS + EVOLUTION entries
