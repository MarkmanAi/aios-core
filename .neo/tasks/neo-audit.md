# Task: neo-audit

> **Executor:** Neo (The Matrix Architect)
> **Trigger:** `*audit {component}`
> **Purpose:** Audit any component against org chart and 7 principles
> **Output:** Compliance report with status, gaps, and recommended actions
> **Estimated time:** 5-15 min per component

---

## Phase 1: IDENTIFY COMPONENT

**Resolution logic:**
- Agent name → search: `.aios-core/development/agents/` → `.claude/agents/` → `squads/*/agents/`
- Mind slug → search: `squads/mmos-squad/minds/{slug}/`
- Squad name → search: `squads/{name}/`
- Workflow → search: `.aios-core/development/workflows/{name}.yaml`

Load the complete definition.

**Veto:** `veto_if_fail: "Component not found in any path → cannot audit"`

---

## Phase 2: VERIFY POSITIONING

- [ ] Component exists in `.neo/ORGANOGRAMA.md`
- [ ] Has defined role/level/department
- [ ] Has designated validator (different from itself — P1)
- [ ] Reports to someone (not orphaned)

If NOT positioned → flag as "organizational orphan."

---

## Phase 3: VERIFY PRINCIPLES

**For agents:** P1 (Maker ≠ Validator), P2 (Process > People), P3 (No Invention)

**For minds (additional):** P3 (Triangulation 3+ sources), P4 (Human Checkpoint L6-L8), P6 (Skin in the Game APEX ≥ 70), P7 (Gold Layer artifacts)

**For squads (additional):** Has lead agent, minimum mass (3+ agents, 5+ tasks), auditor defined

---

## Phase 4: GENERATE REPORT

**Output format:**

```
🔴 AUDIT REPORT — {component_name}
════════════════════════════════════

STATUS: COMPLIANT / NON-COMPLIANT / PARTIAL

POSITIONING:
  In org chart: YES/NO
  Level: {level} | Department: {dept} | Validator: {validator}

PRINCIPLE COMPLIANCE:
  P1 (Maker ≠ Validator): ✅/❌
  P2 (Process > People):  ✅/❌
  P3 (No Invention):      ✅/❌
  [... additional principles per component type ...]

GAPS FOUND:
  - {description}

RECOMMENDED ACTIONS:
  1. {action}
  2. {action}
```

**Post-audit:**
1. Update `.neo/data/gaps.yaml` if new gaps found
2. Record in `.neo/memory/MEMORY.md`:
   ```
   [YYYY-MM-DD] COMPONENT: {name} | TYPE: {type} | STATUS: pass|warn|fail | FINDINGS: {summary}
   ```
