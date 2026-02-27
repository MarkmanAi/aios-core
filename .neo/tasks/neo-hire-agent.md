# Task: neo-hire-agent

> **Executor:** Neo (The Matrix Architect)
> **Trigger:** `*hire-agent {name}`
> **Purpose:** Complete process to hire a new agent in the organization
> **Output:** Agent positioned, validated, created, integrated into org chart
> **Estimated time:** 15-30 min

---

## Context Loading

Before executing, Neo must have loaded:
- `.neo/ORGANOGRAMA.md` — current org chart
- `.neo/data/inventory.yaml` — current numbers
- `.neo/data/principles.md` — the 7 principles
- `.neo/data/gaps.yaml` — known gaps

---

## Phase 1: POSITION ON ORG CHART

**Action:** Collect positioning data via elicitation with the human.

**Template:** Load `.neo/templates/new-agent-position.md`

**Elicit ALL fields (do not skip):**

1. Agent name (slug format)
2. Org chart role (what this person does)
3. Level: C-Level / Director / Manager / Specialist / Operations / Chief
4. Department (squad) — or "none" for root-level
5. Reports to (which existing agent)
6. Commands (direct reports) — can be "none"
7. LLM Model: Opus / Sonnet / Haiku
8. Permitted tools (Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, Task)
9. Primary task (.md file name)
10. Who validates this agent's work (MUST be a different agent — P1)
11. Gap this agent fills ("Why does the organization NEED this member?")
12. Unique value ("What does this agent do that NOBODY else does?")

**CHECKPOINT:** Present filled template to human. Wait for explicit approval.

**Veto conditions:**
- `veto_if_fail: "Human did not approve positioning → cannot proceed"`
- `veto_if_fail: "Agent name already exists in ORGANOGRAMA.md → duplicate"`

---

## Phase 2: VALIDATE AGAINST PRINCIPLES

**Action:** Read `.neo/data/principles.md` and run applicable checks.

**Mandatory checklist:**

- [ ] **P1 — Maker ≠ Validator:** The "validates work" agent is DIFFERENT from the one being created
- [ ] **P2 — Process > People:** Primary task has at least 1 veto_condition
- [ ] **P3 — No Invention:** Does NOT duplicate an existing agent's function (check ORGANOGRAMA)
- [ ] **P4 — Human Checkpoint:** Has human gate if dealing with value decisions

**Rules:**
- BLOCK check fails → **STOP. Explain violation. Do NOT proceed.**
- WARN check fails → Flag to human, continue if acknowledged

**Veto:** `veto_if_fail: "Any BLOCK check failed → cannot create without compliance"`

---

## Phase 3: VALIDATE AGAINST CONSTITUTION

**Action:** Read `.neo/CONSTITUICAO_MATRIX.md` and verify structural fit.

- [ ] Proposed level and department exist in current org chart
- [ ] Does not conflict with existing agent roles
- [ ] Fills a real gap (cross-reference with gaps.yaml)
- [ ] "Reports to" agent exists and is at a higher level

**CHECKPOINT:** Present validation results to human. Wait for approval.

**Veto conditions:**
- `veto_if_fail: "Reports-to agent does not exist → orphan in org chart"`
- `veto_if_fail: "Role conflicts with existing agent → organizational confusion"`

---

## Phase 4: DELEGATE CREATION

**Neo does NOT create the agent file directly. Delegates to Squad Chief:**

```
@squad

CONTEXT FROM NEO — POSITIONING APPROVED:
- Name: {name} | Role: {role} | Level: {level}
- Department: {department} | Reports to: {reports_to}
- Model: {model} | Tools: {tools}
- Primary task: {task} | Validator: {validator}
- Unique value: {unique_value}

EXECUTE: *create-agent {name}
Use the positioning data above. Do NOT deviate. Report when complete.
```

**Wait for Squad Chief to confirm.**

**Veto:** `veto_if_fail: "Squad Chief reports failure → do not proceed to Phase 5"`

---

## Phase 5: UPDATE ORG CHART

**ALL mandatory after successful creation:**

1. **`.neo/ORGANOGRAMA.md`** — Add new agent at the correct level
2. **`.neo/data/inventory.yaml`** — Increment agent counter + total_agents
3. **`.neo/CONSTITUICAO_MATRIX.md`** — Add to appropriate level section
4. **`.neo/memory/MEMORY.md`** — Record:
   ```
   [YYYY-MM-DD] TYPE: agent | NAME: {name} | ROLE: {role} | DEPT: {dept} | APPROVED_BY: human
   ```

**Final:** "Agent {name} hired at Level {N} in {department}. Org chart, inventory, constitution, and memory updated."
