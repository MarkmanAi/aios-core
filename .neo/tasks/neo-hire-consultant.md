# Task: neo-hire-consultant

> **Executor:** Neo (The Matrix Architect)
> **Trigger:** `*hire-consultant {name}`
> **Purpose:** Clone a new mind and integrate into the council of consultants
> **Output:** Mind positioned, APEX-validated, pipeline initiated, council updated
> **Estimated time:** 20-40 min (positioning + APEX), then pipeline runs separately

---

## Phase 1: POSITION ON COUNCIL

**Template:** Load `.neo/templates/new-mind-position.md`

**Elicit ALL fields:**

1. Real name of the person
2. Slug (snake_case format)
3. Domain: Technology & AI / Product & Design / Marketing & Copy / Psychology & Thinking / Wisdom / BR Specialists
4. Which existing consultants this mind complements
5. Gap this mind fills that no current consultant covers
6. Skin in the game? Evidence of real consequences

**CHECKPOINT:** Present to human. Wait for approval.

**Veto conditions:**
- `veto_if_fail: "Human did not approve positioning → cannot proceed"`
- `veto_if_fail: "Mind slug already exists → duplicate"`

---

## Phase 2: VIABILITY (APEX)

**Delegate to Mind Mapper:** `*viability {name}`

**Decision matrix:**
- APEX Score ≥ 70 AND ICP ≥ 70% → **GO** — proceed to Phase 3
- Below threshold → **NO-GO** — explain why, suggest alternative

**CHECKPOINT:** Present APEX results to human. Confirm GO/NO-GO.

**Veto:** `veto_if_fail: "APEX < 70 or ICP < 70% → P6 (Skin in the Game) not met"`

---

## Phase 3: EXECUTE PIPELINE

**Delegate to Mind Mapper:** `*map {name}`

**Neo's role during pipeline:**
- Monitor progress via Mind PM: `*status`
- At **CHECKPOINT L6-L8** (Principle 4): Participate in human validation
- Verify Layer 8 (Contradictions) is present and validated (Principle 7)

**Veto conditions:**
- `veto_if_fail: "Layer 8 artifacts missing → P7 (Gold Layer) violated"`
- `veto_if_fail: "L6-L8 not human-validated → P4 (Human Checkpoint) violated"`

---

## Phase 4: INTEGRATE INTO COUNCIL

**ALL mandatory after pipeline completion:**

1. **`.neo/ORGANOGRAMA.md`** — Add mind to council section under correct domain
2. **`.neo/data/inventory.yaml`** — Increment `minds_cloned`
3. **`.neo/CONSTITUICAO_MATRIX.md`** — Add to council table in correct domain
4. **`.neo/memory/MEMORY.md`** — Record:
   ```
   [YYYY-MM-DD] TYPE: mind | NAME: {name} | ROLE: {domain} consultant | DEPT: council | APPROVED_BY: human
   ```

**Final:** "Consultant {name} cloned and integrated into the {domain} council. All files updated."
