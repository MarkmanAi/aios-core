# Squad Creator

> Unified squad for creating, cloning, optimizing, and validating AIOS squads.
> Result of fusion: squad-creator v1.2.0 + squad-creator-pro v3.1.0

## Overview

The Squad Creator is a meta-squad that automates the full lifecycle of AIOS squad development: from initial research and mind cloning through creation, optimization, and quality validation.

## What's Included

### Agents (5)

| Agent | Role | Provenance |
|-------|------|------------|
| `squad-architect` | Squad creation orchestrator | base |
| `sop-extractor` | SOP extraction from transcripts | base |
| `oalanicolas` | Knowledge Architect, DNA extraction specialist | pro |
| `pedro-valerio` | Process absolutist, axioma assessment | pro |
| `thiago_finch` | Business strategy and marketing | pro |

### Tasks (48)

**Base Creation**
- `create-squad`, `create-agent`, `create-task`, `create-template`, `create-workflow`
- `validate-squad`, `install-commands`, `sync-ide-command`, `refresh-registry`
- `squad-analytics`, `qa-after-creation`

**Mind Cloning (AN)**
- `collect-sources`, `extract-voice-dna`, `extract-thinking-dna`, `extract-sop`
- `extract-knowledge`, `extract-implicit`, `validate-extraction`, `update-mind`
- `an-extract-dna`, `an-fidelity-score`, `an-validate-clone`, `an-clone-review`
- `an-design-clone`, `an-diagnose-clone`, `an-assess-sources`, `an-extract-framework`
- `an-compare-outputs`, `auto-acquire-sources`

**Research**
- `deep-research-pre-agent`, `parallel-discovery`

**Advanced Creation**
- `squad-fusion`, `deconstruct`, `discover-tools`, `upgrade-squad`, `create-pipeline`

**Optimization (PV)**
- `optimize`, `optimize-workflow`, `find-0.8`
- `pv-axioma-assessment`, `pv-audit`, `pv-modernization-score`

**Model Routing**
- `qualify-task`, `lookup-model`, `smoke-test-model-routing`

**Maintenance**
- `sync-chief-codex-skill`, `migrate-workflows-to-yaml`, `workspace-integration-hardening`

### Workflows (20)

| Workflow | Purpose |
|----------|---------|
| `wf-create-squad` | Full squad creation pipeline |
| `wf-clone-mind` | Mind cloning pipeline |
| `wf-extraction-pipeline` | DNA extraction pipeline |
| `wf-squad-fusion` | Squad fusion (merge squads) |
| `wf-optimize-squad` | Squad optimization |
| `wf-discover-tools` | Tool discovery |
| `wf-mind-research-loop` | Research loop for mind cloning |
| `wf-research-then-create-agent` | Research-first agent creation |
| `wf-auto-acquire-sources` | Automatic source acquisition |
| `wf-context-aware-create-squad` | Context-aware creation |
| `wf-brownfield-upgrade-squad` | Upgrade existing squads |
| `wf-model-tier-qualification` | Model tier qualification |
| `wf-cross-provider-qualification` | Cross-provider testing |
| `wf-workspace-integration-hardening` | Workspace hardening |
| `validate-squad` | Squad validation |
| `research-then-create-agent` | Research-first (legacy .md) |
| `mind-research-loop` | Research loop (legacy .md) |
| `modules/module-discovery` | Discovery module |
| `modules/module-integration` | Integration module |
| `modules/module-quality-gates` | Quality gates module |

### Other Components

- **Templates (10):** agent-tmpl, task-tmpl, workflow-tmpl, config-tmpl, readme-tmpl, etc.
- **Configs (8):** quality-gates, scoring-rubric, veto-conditions, model-routing, axioma-validator, heuristics, task-anatomy, squad-config
- **Checklists (10):** quality-gate, agent-quality-gate, agent-depth, deep-research-quality, executor-matrix, mind-validation, sop-validation, squad-checklist, task-anatomy, mental-model-integration, smoke-test-agent
- **Data (30):** Knowledge bases, heuristics, frameworks, registries
- **Minds (2):** oalanicolas (10 KEs + artifacts), pedro_valerio (3 heuristics + artifacts)
- **Scripts (22+):** Quality gate, scoring, validators, benchmarks, tests
- **Benchmarks:** hormozi golden standard
- **Assessments:** axioma assessment for wf-create-squad
- **Docs (19):** Architecture, concepts, tutorials, troubleshooting

## Quick Start

```bash
# Activate the squad architect
@squad-architect

# Create a new squad
*create-squad

# Clone a mind
@oalanicolas
*extract-voice-dna

# Optimize a squad
@pedro-valerio
*pv-axioma-assessment

# Fuse two squads
*squad-fusion
```

## SOP Extractor System

The SOP Extractor transforms meeting transcripts into structured, automation-ready Standard Operating Procedures.

```bash
@sop-extractor
*extract-sop
```

Pipeline: Meeting Recording -> Transcript -> SOP (SC-PE-001) -> Validation (SC-CK-001) -> Squad Blueprint

See `docs/sop-extraction-process.md` for full documentation.

## Structure

```
squads/squad-creator/
├── agents/           # 5 specialized agents
├── assessments/      # Axioma assessments
├── benchmarks/       # Golden standards and runs
├── checklists/       # 10 quality checklists
├── config/           # 8 configuration files
├── config.yaml       # Squad manifest
├── data/             # 30 knowledge bases and frameworks
├── docs/             # 19 documentation files
├── minds/            # Expert mind heuristics and artifacts
├── scripts/          # 22 operational scripts + tests
├── tasks/            # 48 task definitions
├── templates/        # 10 generation templates
└── workflows/        # 20 workflow definitions
```

## Version History

- **v4.0.0** - Fusion of squad-creator + squad-creator-pro (2026-03-10)
- **v1.2.0** - Last base version before fusion
- **v1.1.0** - Added granular validation system
- **v1.0.0** - Initial release

See `CHANGELOG.md` for detailed version history.

---

_Version: 4.0.0_
_Compatible with: AIOS-FULLSTACK v4+_
_Fusion date: 2026-03-10_
