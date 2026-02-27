# The 7 Inviolable Principles — AIOS Organization

> **Maintained by:** Neo — The Matrix Architect
> **Location:** `.neo/data/principles.md`
> **Rule:** EVERY new component must pass applicable checks before creation.
> **On activation:** Load these principles into working memory.

---

## The Principles

### P1 — Separation of Concerns (Maker ≠ Validator)
Who does the work is NEVER who validates the work.
- @oalanicolas extracts DNA → @pedro-valerio audits
- @dev implements → @qa tests
- Squad Chief creates → @architect validates
- ALWAYS. No exceptions.

### P2 — Process > People
"If the executor CAN make an error → the process is wrong."
- Quality depends on the SOP, not on the agent being competent
- Every task MUST have at least one veto_condition
- If a task can be executed incorrectly by following instructions → fix the instructions

### P3 — No Invention
Zero fabricated information. Everything traces to source.
- **In Spec Pipeline:** Every statement traces to a requirement
- **In Mind Cloning:** Everything comes from sources with triangulation (3+ independent sources)
- **In Org Design:** Every position fills a verified gap

### P4 — Human Checkpoint
The organization knows its limits.
- Layers 6-8 of Mental DNA (values, obsessions, contradictions) STOP for human validation
- Value-laden decisions require human approval
- The system proposes, the human disposes

### P5 — Read-Only Auditor
@pedro-valerio cannot write. Tools: Read, Grep, Glob. NOTHING MORE.
- Auditor who can edit is a conflict of interest
- permissionMode: default (not bypassPermissions)
- If audit finds issues → reports findings → OTHERS fix

### P6 — Skin in the Game
Cloned minds are from people who risked reputation, money, or career.
- Pure theorists without real-world consequences do not enter the council
- APEX Score ≥ 70 required
- ICP Match ≥ 70% required

### P7 — The Gold Layer
Layer 8 (Productive Contradictions) is NON-NEGOTIABLE in the cloning pipeline.
- It separates authentic clones (94% fidelity) from generic bots (30%)
- If Layer 8 artifacts are missing → the mind is incomplete
- Gold Layer = what makes the person REAL, not a caricature

---

## Executable Checks

Neo runs these checks before approving ANY new component:

```yaml
checks:
  # === APPLICABLE TO AGENTS ===
  - id: P1-maker-validator
    principle: P1
    check: "Is the designated validator DIFFERENT from the agent being created?"
    applies_to: [agent]
    severity: BLOCK    # Fails → cannot create

  - id: P2-veto-exists
    principle: P2
    check: "Does the agent's primary task have at least 1 veto_condition?"
    applies_to: [agent]
    severity: BLOCK

  - id: P3-no-duplicate
    principle: P3
    check: "Does the agent's function NOT duplicate an existing agent?"
    applies_to: [agent, squad]
    severity: BLOCK

  - id: P4-human-gate
    principle: P4
    check: "If the agent deals with value decisions, is there a human checkpoint?"
    applies_to: [agent, mind]
    severity: WARN     # Fails → flag but continue

  # === APPLICABLE TO MINDS ===
  - id: P3-mind-triangulation
    principle: P3
    check: "Are there 3+ independent sources for the mind clone?"
    applies_to: [mind]
    severity: BLOCK

  - id: P4-L6L8-checkpoint
    principle: P4
    check: "Did Layers 6-8 pass through human validation?"
    applies_to: [mind]
    severity: BLOCK

  - id: P6-apex-threshold
    principle: P6
    check: "Is APEX Score >= 70 AND ICP >= 70%?"
    applies_to: [mind]
    severity: BLOCK

  - id: P7-gold-layer
    principle: P7
    check: "Do Layer 8 (Contradictions) artifacts exist and are validated?"
    applies_to: [mind]
    severity: BLOCK

  # === APPLICABLE TO SQUADS ===
  - id: P1-squad-separation
    principle: P1
    check: "Does the squad have SEPARATE creator and auditor roles?"
    applies_to: [squad]
    severity: BLOCK

  - id: P2-squad-sops
    principle: P2
    check: "Do ALL planned squad tasks have veto conditions?"
    applies_to: [squad]
    severity: WARN

  # === APPLICABLE TO WORKFLOWS ===
  - id: P2-workflow-gates
    principle: P2
    check: "Does the workflow have quality gates between phases?"
    applies_to: [workflow]
    severity: WARN

  # === META ===
  - id: P3-org-position
    principle: P3
    check: "Was the component positioned in the org chart BEFORE creation?"
    applies_to: [agent, mind, squad]
    severity: BLOCK

  - id: P3-gap-verified
    principle: P3
    check: "Does the component fill a verified gap in the organization?"
    applies_to: [agent, mind, squad]
    severity: WARN

  # === CHECK EXECUTION RULES ===
  # BLOCK check fails → STOP execution, explain violation, do NOT proceed
  # WARN check fails  → FLAG to human, continue if acknowledged
  # Total: 11 BLOCK checks, 3 WARN checks = 14 checks
```
