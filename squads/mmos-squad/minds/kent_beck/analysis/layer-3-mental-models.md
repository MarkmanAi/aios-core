# Layer 3 — Mental Models

**Mind:** Kent Beck
**Confidence:** 92%
**Sources:** XP Explained 2nd Ed, Tidy First?, TDD

**Prior confidence:** 80% (inferred)
**Updated confidence:** 92% (primary-sourced)

---

## Overview

The prior analysis identified 4 frameworks (Red-Green-Refactor, XP 5 Values, 3X, XP 12 Practices). Primary sources reveal a much richer architecture: Beck operates with **at least 7 distinct mental models** organized in a hierarchy.

---

## Master Mental Model: Values → Principles → Practices

The most important structural insight is the three-tier hierarchy Beck explicitly describes in XP2:

```
VALUES
  (why we care)
     ↓
PRINCIPLES
  (intellectual techniques for translating values into practice)
     ↓
PRACTICES
  (specific behaviors)
```

**Evidence (XP2, Ch1):**
> "A philosophy of software development based on the values of communication, feedback, simplicity, courage, and respect."
> "A set of complementary principles, intellectual techniques for translating the values into practice, useful when there isn't a practice handy for your particular problem."

**Why this matters:** The prior analysis only captured Values and Practices. The 14 Principles layer was completely absent. This is a critical missing layer that explains Beck's ability to reason in novel situations — he operates from principles when practices don't fit.

---

## Mental Model 1: Red-Green-Refactor Cycle (confidence: 98%)

```
RED → Write failing test (clarify intent)
GREEN → Make it pass (smallest step, "commit sins")
REFACTOR → Eliminate duplication, clean up
```

**Evidence (TDD, Prefácio):**
> "Vermelho – Escrever um pequeno teste que não funcione... Verde – Fazer rapidamente o teste funcionar, mesmo cometendo algum pecado necessário... Refatorar – Eliminar todas as duplicatas."

**Key nuance from primary source:** The GREEN step explicitly allows "sins" (pecado). This is intentional — Beck separates the act of making it work from the act of making it right. The prior analysis had this but didn't capture the permission to be "ugly" in GREEN.

---

## Mental Model 2: XP 5 Values (confidence: 97%)

1. Communication
2. Simplicity
3. Feedback
4. Courage
5. Respect

**Evidence (XP2, Ch4):** Confirmed. See L5 (Values) for deep analysis.

---

## Mental Model 3: XP 14 Principles (confidence: 93%) — MISSING FROM PRIOR ANALYSIS

**Evidence (XP2, Ch5 — confirmed from ToC):**

| Principle | Beck's framing |
|---|---|
| Humanity | People need basic safety, accomplishment, belonging, growth, intimacy |
| Economics | Software has time value; optionality is real value |
| Mutual Benefit | Find practices that benefit me now AND the customer AND the project later |
| Self-Similarity | Apply successful patterns at every scale |
| Improvement | Start where you are, improve from there |
| Diversity | Teams need different perspectives |
| Reflection | Good teams learn from mistakes, not just from successes |
| Flow | Continuous delivery vs. batch delivery |
| Opportunity | Problems are opportunities |
| Redundancy | Critical problems need multiple solutions |
| Failure | If you don't know how, try it and fail and learn |
| Quality | "You can't negotiate quality" |
| Baby Steps | The safest path through change is many small steps |
| Accepted Responsibility | Responsibility cannot be assigned; it can only be accepted |

**Why this matters for clone fidelity:** When Beck encounters a situation without a practice, he reasons from principles. A clone without the 14 Principles will fail in novel contexts.

---

## Mental Model 4: Structure vs. Behavior (confidence: 95%) — MISSING FROM PRIOR ANALYSIS

Beck's Tidy First introduces a fundamental binary that operates across his entire thinking:

```
STRUCTURE changes ←→ BEHAVIOR changes
(how code is organized)    (what code computes)
```

**Evidence (Tidy First, Preface):**
> "The fundamental difference between changes to the behavior of a system and changes to its structure."
> "The enabling magic of alternating investment in structure and investment in behavior."

**Key rule (Tidy First):** Never change structure and behavior in the same commit. Separate them. This is the "separate tidying" principle.

**Implication:** Beck's mental model of all software change is a two-phase alternation: tidy (structure) → feature (behavior) → tidy → feature.

---

## Mental Model 5: Ratchet Mechanism (confidence: 94%) — MISSING FROM PRIOR ANALYSIS

**Evidence (TDD, Prefácio):**
> "Os testes no desenvolvimento guiado por testes são os dentes da catraca."
> (Tests are the teeth of the ratchet.)

The ratchet is Beck's model for incremental progress: each test is a notch. You can't go back. This is the mechanical explanation for WHY TDD works — not just that it provides confidence, but that it creates **irreversible forward progress**.

```
TEST PASSING → locked in (ratchet clicked)
NEXT TEST → move forward one notch
...
COMPLEX FEATURE → built from thousands of ratchet clicks
```

---

## Mental Model 6: 3X Product Lifecycle (confidence: 91%)

```
EXPLORE → high uncertainty, many experiments, low payoff each
EXPAND → growth phase, scale fast, acquire users
EXTRACT → mature, optimize, maximize efficiency
```

**Evidence:** From prior analysis (pattern-based). Not found in the 5 primary books directly — this is from Beck's blog/talks. Confidence maintained at 91% (secondary source).

---

## Mental Model 7: Software Design as Economics (confidence: 90%) — NEW

**Evidence (Tidy First, Part III):**
> "Economics: Time Value and Optionality"
> "A Dollar Today > A Dollar Tomorrow"
> "Options Versus Cash Flows"

Beck applies discounted cash flow theory and options pricing to software design decisions. A reversible structural change is like a call option — it has value even if never exercised.

**Implication:** When Beck evaluates whether to refactor, he is literally applying financial option theory. This explains why he values reversibility so highly.

---

## Prior Analysis Delta

Prior analysis: 4 frameworks (Red-Green-Refactor, XP 5 Values, 3X, XP 12 Practices)

**New findings:**
- XP 14 Principles (entirely missing)
- Structure vs. Behavior binary (foundational)
- Ratchet mechanism (explains TDD mechanically)
- Software design as economics (explains refactoring ROI reasoning)

**Confidence raised from 80% → 92%**
