# Task: neo-health-check

> **Executor:** Neo (The Matrix Architect)
> **Trigger:** `*health`
> **Purpose:** Comprehensive organizational health check
> **Output:** Health report with inventory comparison, gap analysis, compliance score
> **Estimated time:** 10-20 min (includes filesystem scanning)

---

## Phase 1: CURRENT INVENTORY

**Scan these paths and compare with inventory.yaml:**

```
.aios-core/development/agents/*.md          → count core agents
.claude/agents/*.md                          → count claude code agents
squads/mmos-squad/agents/*.md                → count MMOS agents
squads/squad-creator/agents/*.md             → count squad-creator agents
squads/mmos-squad/minds/*/                   → count minds (directories only)
.aios-core/development/workflows/*.yaml      → count workflows
.aios-core/development/tasks/*.md            → count core tasks
squads/mmos-squad/tasks/*.md                 → count MMOS tasks
squads/squad-creator/tasks/*.md              → count squad-creator tasks
.claude/hooks/*.py                           → count hooks (excl. .sh and README)
```

**Compare each count with `.neo/data/inventory.yaml`.**
**FLAG any differences** — new agents found, missing agents, count mismatches.

---

## Phase 2: ORGANIZATIONAL GAPS

**For each agent:** Does it have a position in `.neo/ORGANOGRAMA.md`?
**For each squad:** Does it have a leader? Minimum members?
**For each mind:** Positioned in council? Pipeline status?
**For each workflow:** Connects to existing departments?

**Update `.neo/data/gaps.yaml`:**
- Add any new gaps discovered
- Mark resolved gaps that were fixed since last check
- Recalculate compliance score: `100 - (critical×10) - (high×5) - (medium×2) - (low×1)`

---

## Phase 3: PRINCIPLE COMPLIANCE (Sampling)

**Sample 5 random components:** 3 agents + 1 mind + 1 workflow.
**For each:** Run applicable checks from `.neo/data/principles.md`.
**Record pass/fail results.**

---

## Phase 4: GENERATE HEALTH REPORT

**Output format:**

```
🔴 ORGANIZATIONAL HEALTH REPORT
════════════════════════════════════
Date: {today}

HEADCOUNT:
  Agents:     {real} / {inventory} {✅ or ⚠️}
  Minds:      {real} / {inventory} {✅ or ⚠️}
  Workflows:  {real} / {inventory} {✅ or ⚠️}
  Tasks:      {real} / {inventory} {✅ or ⚠️}

GAPS:
  Open:       {count} ({critical} critical, {high} high, {medium} medium, {low} low)
  Resolved:   {count} since last check
  New:        {count} found in this check

COMPLIANCE SCORE: {score}/100

PRINCIPLE SAMPLING: {pass_count}/5 sampled components fully compliant

TOP 3 RECOMMENDATIONS:
  1. {highest impact action}
  2. {second highest}
  3. {third highest}
```

**Post-health updates:**
1. Update `.neo/data/gaps.yaml` with all findings
2. Update `.neo/data/inventory.yaml` if real counts differ from recorded
3. Record in `.neo/memory/MEMORY.md`:
   ```
   [YYYY-MM-DD] COMPONENT: organization | TYPE: health_check | STATUS: {score}/100 | FINDINGS: {summary}
   ```
