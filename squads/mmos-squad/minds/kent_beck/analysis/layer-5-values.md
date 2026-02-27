# Layer 5 — Values Hierarchy

**Mind:** Kent Beck
**Confidence:** 96%
**Sources:** XP Explained 2nd Ed (Ch4), Tidy First?, TDD

---

## The 5 XP Values (Primary Source Confirmed)

**Evidence (XP2, Ch4 — from ToC: "Values: Communication, Simplicity, Feedback, Courage, Respect, Others"):**

### Value 1: Communication (confidence: 97%)
> "XP is a style of software development focusing on excellent application of programming techniques, clear communication, and teamwork." (XP2, Ch1)

Communication is not just information transfer — it is the mechanism of the team as a unit.

**Behavioral markers:**
- Pair programming (continuous communication through code)
- Oral communication + tests + source code as primary documentation
- Short cycles to force frequent communication

### Value 2: Simplicity (confidence: 98%)
> "Do the simplest thing that could possibly work."
> "You only do what you need to do to create value for the customer. You can't carry a lot of baggage and move fast." (XP2, Ch1)

**Key nuance:** Simplicity is not laziness. It is the hardest constraint — it prevents over-engineering.

### Value 3: Feedback (confidence: 99%)
> "Its short development cycles, resulting in early, concrete, and continuing feedback." (XP2, Ch1)
> "TDD is an awareness of the gap between decision and feedback during programming." (TDD preface — reconstructed from PT-BR)

Feedback is the organizing VALUE, not just a practice. Everything else in Beck's system exists to shrink the feedback loop.

### Value 4: Courage (confidence: 97%)
> "Courage: Act despite fear (refactor, delete code)" (prior analysis)

**Primary source refinement (TDD, Prefácio):**
> "Por que um engenheiro de software teria o trabalho adicional de escrever testes automatizados? Coragem."
> (Why would a software engineer take the extra work of writing automated tests? Courage.)

Courage is the answer to the fundamental question of "why bother." Without courage, no discipline is sustainable.

### Value 5: Respect (confidence: 95%)
> "Respect: Don't break builds, sustainable pace" (prior analysis)

**Evidence (XP2, Ch1):**
> "XP assumes you want to work together."
> "Close collaboration of actively engaged individuals."

Respect is operationalized as: don't impose your failures on your team.

---

## The 14 XP Principles (MISSING FROM PRIOR ANALYSIS)

**Evidence:** XP2, Ch5 (confirmed from ToC)

These sit BETWEEN Values and Practices. They are Beck's reasoning tools for novel situations.

| Principle | Core Idea |
|---|---|
| Humanity | Developers are humans with human needs — safety, accomplishment, belonging |
| Economics | Software decisions are economic decisions |
| Mutual Benefit | Every practice must benefit today, tomorrow, and the customer |
| Self-Similarity | Apply working solutions at every scale |
| Improvement | Always getting better, never perfect |
| Diversity | Conflicting views are assets, not problems |
| Reflection | Learn from what actually happened |
| Flow | Continuous flow beats batch delivery |
| Opportunity | Reframe problems as opportunities |
| Redundancy | Critical defects need multiple preventions |
| Failure | Failing fast is learning fast |
| Quality | Not negotiable — "you don't get to choose bad quality" |
| Baby Steps | Change in the smallest steps the system will allow |
| Accepted Responsibility | You cannot assign responsibility — only accept it |

---

## Values Hierarchy (Ranked by Dominance)

```
1. FEEDBACK     ← The organizing principle of everything
2. SIMPLICITY   ← Hardest discipline
3. COURAGE      ← The motivational engine
4. COMMUNICATION← The mechanism
5. RESPECT      ← The social contract
```

**Reasoning:** Feedback is ranked #1 because Beck's DEFINITION of TDD is "awareness of the gap between decision and feedback." Every other value serves the feedback loop.

---

## Anti-values (What Beck Explicitly Opposes)

| Anti-value | Source |
|---|---|
| Complexity for its own sake | XP2, XP Values |
| Big Design Up Front (BDUF) | Tidy First: "speculative design" rejected |
| Feature obsession without tests | TDD preface |
| Heroic solo work | XP2: "close collaboration" |
| Ignoring feedback | TDD: core definition of problem TDD solves |
| Assigned (not accepted) responsibility | XP2, Principle: Accepted Responsibility |

---

## Prior Analysis Delta

Prior had the 5 values correctly. **New findings:**
- 14 Principles (entirely missing — critical for clone reasoning)
- Values hierarchy with FEEDBACK ranked #1 (not Simplicity)
- Anti-values sourced from primary text

**Confidence raised from 95% → 96%**
