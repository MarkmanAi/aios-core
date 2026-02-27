# Task: neo-reorg

> **Executor:** Neo (The Matrix Architect)
> **Trigger:** `*reorg {proposal}`
> **Purpose:** Propose and evaluate reorganization of part of the organization
> **Output:** Impact analysis + execution plan (Neo plans, human approves, agents execute)
> **Estimated time:** 15-30 min

---

## Phase 1: RECEIVE PROPOSAL

**Elicit:**
1. What is the proposed change? (move agent, merge squads, split department, change hierarchy)
2. Which components are affected?
3. What is the motivation? (gap, efficiency, growth, redundancy)

**Map all affected components from `.neo/ORGANOGRAMA.md`.**

---

## Phase 2: IMPACT ANALYSIS

**For each affected component:**
- Who depends on it? (has it as "reports_to" or "validator")
- What does it depend on? (its own "reports_to" and "validator")
- Which workflows pass through it?
- Which tasks does it execute?

**Generate impact map:**

```
IMPACT MAP — Proposed: {description}

DIRECTLY AFFECTED:
  - {component}: {what changes} → affects {N} dependents

INDIRECTLY AFFECTED:
  - {component}: {why affected} → risk: {low|medium|high}

WORKFLOWS AFFECTED:
  - {workflow}: {what changes in the flow}
```

---

## Phase 3: PROPOSE NEW STRUCTURE

**Design the post-reorganization state:**
- New position in org chart for each affected component
- New reporting lines
- New validators (if changed)

**Verify ALL principles still hold after reorg:**
- [ ] P1 — Maker ≠ Validator still holds
- [ ] P2 — No processes broken
- [ ] P3 — No function gaps created

**CHECKPOINT:** Present proposed structure to human. Wait for explicit approval.

**Veto conditions:**
- `veto_if_fail: "Reorganization breaks a BLOCK principle → cannot proceed"`
- `veto_if_fail: "Human did not approve → cannot proceed"`

---

## Phase 4: EXECUTION PLAN

**Create ordered list of changes:**

```
EXECUTION PLAN — Reorganization
═══════════════════════════════

Step 1: {change} → {who executes}
  Rollback: {how to undo}

Step 2: {change} → {who executes}
  Rollback: {how to undo}

[...]

Final: Neo updates ORGANOGRAMA, inventory, constitution, memory
```

**CRITICAL:** Neo does NOT execute changes. Neo plans → human approves → agents execute → Neo updates org chart AFTER execution.

**Record in `.neo/memory/MEMORY.md`:**
```
[YYYY-MM-DD] CHANGE: {description} | BEFORE: {old} | AFTER: {new} | REASON: {motivation}
```
