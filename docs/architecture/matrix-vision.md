# The Matrix Vision — AIOS as an Organization

> **Public reference document.**
> For the complete operational version, see `.neo/CONSTITUICAO_MATRIX.md`
> Validated against: 6,315 files — REPO_PATH_MAP_v2 (2026-02-22)

---

## What Is the AIOS

The AIOS is not just software. It is a complete autonomous organization:

| Component | Count | What It Is |
|-----------|-------|-----------|
| **Agents** | **49** | Employees — organized in hierarchy |
| **Cloned Minds** | **27** | External consultants — organized by domain |
| **Squads** | **2** | Departments — mmos-squad, squad-creator |
| **Tasks** | **238** | SOPs — standard operating procedures |
| **Workflows** | **14** | Business processes — connect departments |
| **Hooks** | **9** | Governance policies — enforced automatically |
| **Total files** | **6,315** | The entire organization as code |

When AIOS is initialized, you are not installing software. You are founding an organization.

---

## Organizational Hierarchy

```
LEVEL 0 — META-ARCHITECT (outside the hierarchy)
  Neo (@neo) — sees the AIOS from OUTSIDE. Designs the organization.

LEVEL 1 — C-LEVEL
  CEO: aios-master (Orion) | CTO: architect (Aria) | CPO: po (Pax)

LEVEL 2 — DIRECTORS
  VP Talent: Squad Chief | Dir. Intelligence: Mind Mapper
  Dir. MMOS Ops: Mind PM | Dir. Product: pm (Morgan)

LEVEL 3 — MANAGERS
  SM | Analyst | UX Design Expert | Data Engineer | DevOps

LEVEL 4 — SENIOR SPECIALISTS
  @oalanicolas (DNA Surgeon) | @pedro-valerio (Read-Only Auditor)
  @sop-extractor | + 8 MMOS specialists

LEVEL 4B — SQUAD-CREATOR SPECIALISTS
  @squad-architect | @oalanicolas (dept) | @sop-extractor (dept)

LEVEL 5 — OPERATIONS
  dev (Dex) | qa (Quinn) | squad-creator (Craft)

LEVEL 6 — CHIEFS (10 specialized departments)
  copy · cyber · data · db-sage · design · design-system
  legal · story · tools-orchestrator · traffic-masters

LEVEL 7 — COUNCIL OF CONSULTANTS (27 cloned minds)
  Technology & AI · Product & Design · Marketing & Copy
  Psychology & Thinking · Wisdom · BR Specialists
```

---

## The Architect

Agent Neo (`@neo`) is the Matrix Architect. He exists **outside** the organization to see it whole:

- **Positions** every new agent, mind, squad, and workflow in the org chart — BEFORE creation
- **Validates** that new components respect the 7 inviolable principles
- **Audits** organizational health (`*health`, `*audit {component}`)
- **Evolves** the organizational structure (`*reorg`, `*plan-expansion`)

**Fundamental rule:**
> Every new agent, squad, mind, or workflow MUST be positioned in the org chart BEFORE creation.
> Activate `@neo` before creating any organizational component.

---

## 7 Inviolable Principles

| # | Principle | Rule | Severity |
|---|-----------|------|----------|
| 1 | **Maker ≠ Validator** | Who executes ≠ who validates. Always. | BLOCK |
| 2 | **Process > People** | If the executor CAN do it wrong → the process is wrong | BLOCK |
| 3 | **No Invention** | Zero invented information. Everything traces to a source. | BLOCK |
| 4 | **Human Checkpoint** | L6-L8 DNA layers STOP for human validation | BLOCK |
| 5 | **Read-Only Auditor** | `@pedro-valerio` tools: Read, Grep, Glob — NOTHING else | BLOCK |
| 6 | **Skin in the Game** | Cloned minds are of people who risked something real | BLOCK |
| 7 | **The Gold Layer** | Layer 8 (Contradictions) is non-negotiable in cloning | BLOCK |

Full executable checks (BLOCK/WARN with IDs): `.neo/data/principles.md`

---

## Dictionary — Real World ↔ AIOS

| Real World | In AIOS | Location |
|------------|---------|----------|
| The entire company | The repository | `/` (root) |
| Employee (full-time) | Core Agent | `.aios-core/development/agents/{name}.md` |
| Contractor | Claude Code Agent | `.claude/agents/{name}.md` |
| Department employee | Squad Agent | `squads/{squad}/agents/{name}.md` |
| External consultant | Cloned Mind | `squads/mmos-squad/minds/{slug}/` |
| Job description | Agent file | `agents/{name}.md` |
| SOP | Task file | `.aios-core/development/tasks/{name}.md` |
| Business process | Workflow | `.aios-core/development/workflows/{name}.yaml` |
| Governance policy | Hook | `.claude/hooks/{name}.py` |
| Compliance check | Quality Gate | `.aios-core/core/quality-gates/` |
| Org chart | Organograma | `.neo/ORGANOGRAMA.md` |
| Central nervous system | Kernel | `.aios-core/core/` (18 modules) |
| Circulatory system | Workflows | 14 business processes |
| Institutional memory | Memory modules | `.aios-core/core/memory/` (5 modules) |

---

## Key Resources

| Resource | Path | Updated by |
|----------|------|-----------|
| Full Constitution | `.neo/CONSTITUICAO_MATRIX.md` | Neo |
| Live Org Chart | `.neo/ORGANOGRAMA.md` | Neo (after every hire) |
| Inventory | `.neo/data/inventory.yaml` | Neo (after every change) |
| Gap Registry | `.neo/data/gaps.yaml` | Neo (after every audit) |
| Principles (executable) | `.neo/data/principles.md` | Immutable |
| Neo's memory | `.neo/memory/MEMORY.md` | Neo (after every decision) |
| Neo's brain | `.neo/NEO.md` | Architect |
| Activation bridge | `.claude/agents/neo.md` | — |

**Activate:** `@neo` — then run `*health` for full organizational status.
