# Clone Standards — AIOS Council
## Maintained by: Neo — The Matrix Architect
## Created: 2026-03-11
## Purpose: Define the two tiers of council members and their emulation scope

---

## Why Two Tiers Exist

The original MMOS pipeline treated all council members as a single resource type.
In practice, two fundamentally different use cases exist:

**Use case A — Personality Emulation:**
"How would Hormozi respond to this offer?"
You want: voice, tone, persona, conversational style.
Best for: creative decisions, copy, product strategy, negotiation framing.

**Use case B — Framework & Reasoning:**
"How would Meadows diagnose this organizational gap?"
You want: mental models, decision heuristics, diagnostic frameworks.
Best for: governance decisions, structural analysis, strategic audits.

The clone file is the SAME. The invocation MODE changes what @emulator prioritizes.

---

## Tier A — Mind Clone (MMOS Standard)

**Label:** `✅ PRODUCTION`
**Icon:** No special icon — standard council member

**Requirements:**
- 3+ independent primary sources (books, podcasts, interviews, social media)
- APEX Score ≥ 70
- ICP Match ≥ 70%
- Full 8-layer pipeline (L1-L8 all complete)
- L6-L8 human checkpoint mandatory (values, obsessions, contradictions)
- Gold Layer (Layer 8) validated

**Emulation scope:** Full persona
- Voice DNA: vocabulary, sentence patterns, rhetorical devices, tone
- Thinking DNA: reasoning patterns, mental models, epistemic style
- Contradictions: productive tensions (Gold Layer)
- Conversational style: how the person speaks, argues, reacts

**Pipeline:** Standard MMOS (Research Specialist → Cognitive Analyst →
Identity Analyst → Charlie Synthesis Expert → System Prompt Architect)

**Invocation:** `@emulator {name}` — full persona mode (default)

---

## Tier B — Governance Advisor (New Standard)

**Label:** `📚 GOVERNANCE ADVISOR`
**Icon:** 📚

**When to use:**
- Author-primary profiles (books are the main source)
- Posthumous figures (limited live source material)
- Cases where frameworks matter more than personality emulation
- Authors where L6-L7 (personal values/history) are less relevant than L1-L5 (frameworks)

**Requirements:**
- Minimum 2 written sources (books, academic papers, long-form articles)
- APEX Score ≥ 55 (lower threshold — acknowledges source limitation)
- ICP Match ≥ 60%
- L1-L5 + L8 fully extracted from text
- L6-L7 inferred from writing style with EXPLICIT DISCLAIMER in system prompt
- Human checkpoint: validates FRAMEWORKS and REASONING, not persona fidelity
- Gold Layer (Layer 8 — contradictions): extracted from written work, required

**Emulation scope:** Frameworks & reasoning only
- Voice DNA: writing style patterns only (NOT conversational style)
- Thinking DNA: reasoning patterns, mental models, decision heuristics (FULL)
- Contradictions: productive tensions from written work (FULL)
- Conversational style: NOT emulated — advisor speaks in structured frameworks

**Disclaimer required in system prompt:**
```
[GOVERNANCE ADVISOR MODE]
This is a framework-based advisor, not a full personality clone.
Emulation scope: reasoning patterns, mental models, decision frameworks.
L6-L7 (personal values, biography) are inferred from written work only.
Confidence: HIGH for frameworks | MEDIUM for values | LOW for conversational style.
```

**Pipeline:** MMOS Governance Adapter (to be built — Story TBD)
- L1-L5: standard Cognitive Analyst from written sources
- L6-L7: inferred from narrative voice, prefaces, autobiographical passages
- L8: uses ETL contradictions extraction as primary input
- Human checkpoint: framework validation (not persona fidelity test)

**Invocation:** `@emulator {name}` — @emulator auto-detects tier from system prompt
**Neo invocation:** `*war-room {question}` — auto-selects relevant advisors + injects KB

---

## Invocation Mode Reference

| Command | Tier A (Mind Clone) | Tier B (Governance Advisor) |
|---------|--------------------|-----------------------------|
| `@emulator {name}` | Full persona | Framework mode (auto-detected) |
| `*roundtable {topic}` | Personality debate | Framework debate |
| `*war-room {question}` | Not primary use | PRIMARY use case |
| `*duo {a} {b}` | Personality dialogue | Framework dialogue |

---

## Neo Strategic Council — Tier B Members

The Neo Strategic Council is a sub-council within Level 7, exclusively composed of
Governance Advisors curated for organizational architecture and governance decisions.

| Advisor | Domain | Source | Status |
|---------|--------|--------|--------|
| Donella Meadows | Systems Thinking | Thinking in Systems + papers | 📚 PENDING pipeline |
| Matthew Skelton & Manuel Pais | Org Design & Team Topology | Team Topologies (2nd Ed.) | ⏳ book pending |
| Stephen Bungay | Governance & Delegation | The Art of Action | ⏳ book pending |
| Andrew Grove | Output Management | High Output Management | ⏳ book pending |

**Expansion candidates (future):**
- Nassim Taleb → Antifragility & Risk (Antifragile)
- Frederic Laloux → Organizational Evolution (Reinventing Organizations)
- Victor Dibia → Multi-Agent Systems (Designing Multi-Agent Systems)

---

## P-Check Matrix by Tier

| Principle | Tier A | Tier B |
|-----------|--------|--------|
| P3 — triangulation (3+ sources) | BLOCK if < 3 | WARN if < 2 |
| P4 — human checkpoint L6-L8 | BLOCK if missing | BLOCK (framework validation) |
| P6 — APEX ≥ 70 | BLOCK if < 70 | WARN if < 55 |
| P7 — Gold Layer (L8) | BLOCK if missing | BLOCK if missing |

---

*Document version: 1.0 — 2026-03-11*
*Next review: after first Governance Advisor pipeline completes*
