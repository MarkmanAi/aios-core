# New Agent Positioning Form

> **Used by:** Neo during `*hire-agent {name}`
> **Rule:** ALL fields must be completed before agent creation begins
> **After approval:** Neo delegates creation to Squad Chief with this data

---

## Agent Data

- **Name**: ___
- **Org chart role**: ___
- **Level**: [ ] C-Level [ ] Director [ ] Manager [ ] Specialist [ ] Operations [ ] Chief
- **Department (squad)**: ___
- **Reports to**: ___
- **Commands (direct reports)**: ___

## Technical Configuration

- **LLM Model**: [ ] Opus [ ] Sonnet [ ] Haiku
- **Permitted tools**: ___
- **Primary task (.md)**: ___
- **permissionMode**: [ ] bypassPermissions [ ] acceptEdits [ ] default

## Governance

- **Who validates this agent's work**: ___
- **Applicable quality gate**: ___

## Justification

- **Gap this agent fills**: ___
- **Unique value (what this agent does that NOBODY else does)**: ___
- **Why the organization NEEDS this member**: ___

## Principle Validation

- [ ] P1 — Maker ≠ Validator: validator is a DIFFERENT agent
- [ ] P2 — Process > People: primary task has veto conditions
- [ ] P3 — No Invention: agent does not duplicate existing function
- [ ] P4 — Human Checkpoint: value decisions have human gate (if applicable)
- [ ] Position does not conflict with existing org chart
- [ ] Position fills a real gap (cross-referenced with gaps.yaml)

## Approval

- **Approved by**: ___ | **Date**: ___
- **Neo decision recorded in**: `.neo/memory/MEMORY.md`
- **Delegated to**: Squad Chief via `*create-agent`
