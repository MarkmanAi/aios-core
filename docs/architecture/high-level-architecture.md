# AIOS High-Level Architecture v2.1

> **EN** | [PT](../pt/architecture/high-level-architecture.md) | [ES](../es/architecture/high-level-architecture.md)

---

**Version:** 2.1.0
**Last Updated:** 2025-12-09
**Status:** Official Architecture Document

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Modular Architecture](#modular-architecture)
- [Multi-Repo Strategy](#multi-repo-strategy)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Key Components](#key-components)
- [Quality Gates](#quality-gates)

---

## Overview

**AIOS (AI Operating System)** is a sophisticated framework for orchestrating AI agents, workers, and humans in complex software development workflows. Version 2.1 introduces a modular architecture with 4 modules, multi-repository strategy, and 3-layer quality gates.

### Key Capabilities v2.1

| Capability                | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| **11 Specialized Agents** | Dev, QA, Architect, PM, PO, SM, Analyst, Data Engineer, DevOps, UX, Master |
| **115+ Executable Tasks** | Story creation, code generation, testing, deployment, documentation        |
| **52+ Templates**         | PRDs, stories, architecture docs, IDE rules, quality gates                 |
| **4 Module Architecture** | Core, Development, Product, Infrastructure                                 |
| **3 Quality Gate Layers** | Pre-commit, PR Automation, Human Review                                    |
| **Multi-Repo Strategy**   | 3 public + 2 private repositories                                          |
| **Squad System**          | Modular AI agent teams (ETL, Creator, MMOS)                                |

---

## Architecture Diagram

### 4-Module Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AIOS FRAMEWORK v2.1                                 │
│                     ═══════════════════                                 │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                        CLI / TOOLS                               │   │
│   │  (aios agents, aios tasks, aios squads, aios workflow)          │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                │                                        │
│          ┌────────────────────┼────────────────────┐                   │
│          │                    │                    │                   │
│          ▼                    ▼                    ▼                   │
│   ┌──────────────┐   ┌──────────────┐   ┌─────────────────┐           │
│   │ DEVELOPMENT  │   │   PRODUCT    │   │ INFRASTRUCTURE  │           │
│   │   MODULE     │   │   MODULE     │   │    MODULE       │           │
│   │ ──────────── │   │ ──────────── │   │ ─────────────── │           │
│   │ • 11 Agents  │   │ • 52+ Tmpls  │   │ • 55+ Scripts   │           │
│   │ • 115+ Tasks │   │ • 11 Chklsts │   │ • Tool Configs  │           │
│   │ • 7 Wrkflws  │   │ • PM Data    │   │ • Integrations  │           │
│   │ • Dev Scripts│   │              │   │ • PM Adapters   │           │
│   └──────┬───────┘   └──────┬───────┘   └────────┬────────┘           │
│          │                  │                    │                     │
│          └──────────────────┼────────────────────┘                     │
│                             │                                          │
│                             ▼                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      CORE MODULE                                 │   │
│   │                      ═══════════                                 │   │
│   │                                                                  │   │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│   │   │   Config    │  │  Registry   │  │    Quality Gates        │ │   │
│   │   │   System    │  │  (Service   │  │    (3 Layers)           │ │   │
│   │   │             │  │  Discovery) │  │                         │ │   │
│   │   └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│   │                                                                  │   │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│   │   │    MCP      │  │   Session   │  │     Elicitation         │ │   │
│   │   │   System    │  │   Manager   │  │       Engine            │ │   │
│   │   │             │  │             │  │                         │ │   │
│   │   └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│   │                                                                  │   │
│   │   NO INTERNAL DEPENDENCIES (Foundation Layer)                    │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Module Relationships

```
┌────────────────────────────────────────────────────────────────────────┐
│                    MODULE DEPENDENCY FLOW                               │
│                                                                         │
│                         ┌──────────────┐                                │
│                         │  CLI/Tools   │                                │
│                         └──────┬───────┘                                │
│                                │                                        │
│              ┌─────────────────┼─────────────────┐                      │
│              │                 │                 │                      │
│              ▼                 ▼                 ▼                      │
│     ┌────────────────┐ ┌────────────────┐ ┌────────────────┐           │
│     │  development/  │ │    product/    │ │infrastructure/ │           │
│     │                │ │                │ │                │           │
│     │  • Agents      │ │  • Templates   │ │  • Scripts     │           │
│     │  • Tasks       │ │  • Checklists  │ │  • Tools       │           │
│     │  • Workflows   │ │  • PM Data     │ │  • Integrations│           │
│     └───────┬────────┘ └───────┬────────┘ └───────┬────────┘           │
│             │                  │                  │                     │
│             │          depends on only            │                     │
│             └──────────────────┼──────────────────┘                     │
│                                │                                        │
│                                ▼                                        │
│                      ┌────────────────┐                                 │
│                      │     core/      │                                 │
│                      │                │                                 │
│                      │  NO INTERNAL   │                                 │
│                      │  DEPENDENCIES  │                                 │
│                      └────────────────┘                                 │
│                                                                         │
│   RULES:                                                                │
│   • core/ has no internal dependencies                                  │
│   • development/, product/, infrastructure/ depend ONLY on core/        │
│   • Circular dependencies are PROHIBITED                                │
│   • CLI/Tools can access any module                                     │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Multi-Repo Strategy

### Repository Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MARKMANAI ORGANIZATION                                  │
│                                                                         │
│   PUBLIC REPOSITORIES                                                   │
│   ═══════════════════                                                   │
│                                                                         │
│   ┌────────────────────┐     ┌────────────────────┐                    │
│   │  MarkmanAi/       │     │  MarkmanAi/       │                    │
│   │  aios-core         │     │  aios-squads       │                    │
│   │  (Commons Clause)  │◄────│  (MIT)             │                    │
│   │                    │     │                    │                    │
│   │  • Core Framework  │     │  • ETL Squad       │                    │
│   │  • 11 Base Agents  │     │  • Creator Squad   │                    │
│   │  • Quality Gates   │     │  • MMOS Squad      │                    │
│   │  • Discussions Hub │     │                    │                    │
│   └────────────────────┘     └────────────────────┘                    │
│            │                                                            │
│            │ optional dependency                                        │
│            ▼                                                            │
│   ┌────────────────────┐                                               │
│   │  MarkmanAi/       │                                               │
│   │  mcp-ecosystem     │                                               │
│   │  (Apache 2.0)      │                                               │
│   │                    │                                               │
│   │  • Docker MCP      │                                               │
│   │  • IDE Configs     │                                               │
│   │  • MCP Presets     │                                               │
│   └────────────────────┘                                               │
│                                                                         │
│   PRIVATE REPOSITORIES                                                  │
│   ════════════════════                                                  │
│                                                                         │
│   ┌────────────────────┐     ┌────────────────────┐                    │
│   │  MarkmanAi/mmos   │     │  MarkmanAi/       │                    │
│   │  (Proprietary+NDA) │     │  certified-partners│                    │
│   │                    │     │  (Proprietary)     │                    │
│   │  • MMOS Minds      │     │  • Premium Squads  │                    │
│   │  • DNA Mental™     │     │  • Partner Portal  │                    │
│   └────────────────────┘     └────────────────────┘                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### npm Package Scoping

| Package               | Registry   | License        |
| --------------------- | ---------- | -------------- |
| `@aios/core`          | npm public | Commons Clause |
| `@aios/squad-etl`     | npm public | MIT            |
| `@aios/squad-creator` | npm public | MIT            |
| `@aios/squad-mmos`    | npm public | MIT            |
| `@aios/mcp-presets`   | npm public | Apache 2.0     |

---

## Technology Stack

| Category        | Technology            | Version | Notes                    |
| --------------- | --------------------- | ------- | ------------------------ |
| Runtime         | Node.js               | ≥18.0.0 | Platform for all scripts |
| Language        | TypeScript/JavaScript | ES2022  | Primary development      |
| Definition      | Markdown + YAML       | N/A     | Agents, tasks, templates |
| Package Manager | npm                   | ≥9.0.0  | Dependency management    |
| Quality Gates   | Husky + lint-staged   | Latest  | Pre-commit hooks         |
| Code Review     | CodeRabbit            | Latest  | AI-powered review        |
| CI/CD           | GitHub Actions        | N/A     | Automation workflows     |

---

## Directory Structure

### Current Structure (v2.1)

```
@markmanai/aios-core/
├── .aios-core/                    # Framework layer
│   ├── core/                      # Core module (foundation)
│   │   ├── config/                # Configuration management
│   │   ├── registry/              # Service Discovery
│   │   ├── quality-gates/         # 3-layer QG system
│   │   ├── mcp/                   # MCP global configuration
│   │   └── session/               # Session management
│   │
│   ├── development/               # Development module
│   │   ├── agents/                # 11 agent definitions
│   │   ├── tasks/                 # 115+ task definitions
│   │   ├── workflows/             # 7 workflow definitions
│   │   └── scripts/               # Development scripts
│   │
│   ├── product/                   # Product module
│   │   ├── templates/             # 52+ templates
│   │   ├── checklists/            # 11 checklists
│   │   └── data/                  # PM knowledge base
│   │
│   ├── infrastructure/            # Infrastructure module
│   │   ├── scripts/               # 55+ infrastructure scripts
│   │   ├── tools/                 # CLI, MCP, local configs
│   │   └── integrations/          # PM adapters
│   │
│   └── docs/                      # Framework documentation
│       └── standards/             # Standards documents
│
├── docs/                          # Project documentation
│   ├── stories/                   # Development stories
│   ├── architecture/              # Architecture docs
│   └── epics/                     # Epic planning
│
├── squads/                        # Squad implementations
│   ├── etl/                       # ETL Squad
│   ├── creator/                   # Creator Squad
│   └── mmos-mapper/               # MMOS Squad
│
├── .github/                       # GitHub automation
│   ├── workflows/                 # CI/CD workflows
│   ├── ISSUE_TEMPLATE/            # Issue templates
│   └── CODEOWNERS                 # Code ownership
│
└── .husky/                        # Git hooks (Layer 1 QG)
```

---

## Key Components

### Modules Overview

| Module             | Path                         | Purpose              | Key Contents                       |
| ------------------ | ---------------------------- | -------------------- | ---------------------------------- |
| **Core**           | `.aios-core/core/`           | Framework foundation | Config, Registry, QG, MCP, Session |
| **Development**    | `.aios-core/development/`    | Dev artifacts        | Agents, Tasks, Workflows, Scripts  |
| **Product**        | `.aios-core/product/`        | PM artifacts         | Templates, Checklists, Data        |
| **Infrastructure** | `.aios-core/infrastructure/` | System config        | Scripts, Tools, Integrations       |

### Agent System

| Agent | ID              | Archetype    | Responsibility          |
| ----- | --------------- | ------------ | ----------------------- |
| Dex   | `dev`           | Builder      | Code implementation     |
| Quinn | `qa`            | Guardian     | Quality assurance       |
| Aria  | `architect`     | Architect    | Technical architecture  |
| Nova  | `po`            | Visionary    | Product backlog         |
| Kai   | `pm`            | Balancer     | Product strategy        |
| River | `sm`            | Facilitator  | Process facilitation    |
| Zara  | `analyst`       | Explorer     | Business analysis       |
| Dara  | `data-engineer` | Architect    | Data engineering        |
| Felix | `devops`        | Optimizer    | CI/CD and operations    |
| Uma   | `ux-expert`     | Creator      | User experience         |
| Pax   | `aios-master`   | Orchestrator | Framework orchestration |

---

## Quality Gates

### 3-Layer Quality Gate System

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     QUALITY GATES 3 LAYERS                              │
│                                                                         │
│   ┌───────────────────────────────────────────────────────────────────┐ │
│   │ LAYER 1: PRE-COMMIT (Local)                                       │ │
│   │ ═══════════════════════════                                       │ │
│   │ • ESLint, Prettier, TypeScript                                    │ │
│   │ • Unit tests (fast)                                               │ │
│   │ • Tool: Husky + lint-staged                                       │ │
│   │ • Blocking: Can't commit if fails                                 │ │
│   │ • Issues caught: 30%                                              │ │
│   └───────────────────────────────────────────────────────────────────┘ │
│                                │                                        │
│                                ▼                                        │
│   ┌───────────────────────────────────────────────────────────────────┐ │
│   │ LAYER 2: PR AUTOMATION (CI/CD)                                    │ │
│   │ ════════════════════════════════                                  │ │
│   │ • CodeRabbit AI review                                            │ │
│   │ • Integration tests, coverage analysis                            │ │
│   │ • Security scan, performance benchmarks                           │ │
│   │ • Tool: GitHub Actions + CodeRabbit                               │ │
│   │ • Blocking: Required checks for merge                             │ │
│   │ • Issues caught: Additional 50% (80% total)                       │ │
│   └───────────────────────────────────────────────────────────────────┘ │
│                                │                                        │
│                                ▼                                        │ │
│   ┌───────────────────────────────────────────────────────────────────┐ │
│   │ LAYER 3: HUMAN REVIEW (Strategic)                                 │ │
│   │ ══════════════════════════════════                                │ │
│   │ • Architecture alignment                                          │ │
│   │ • Business logic correctness                                      │ │
│   │ • Edge cases, documentation quality                               │ │
│   │ • Tool: Human expertise                                           │ │
│   │ • Blocking: Final approval required                               │ │
│   │ • Issues caught: Final 20% (100% total)                           │ │
│   └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│   RESULT: 80% of issues caught automatically                           │
│           Human review time: 30 min/PR (vs 2-4h in v2.0)               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Related Documents

- [Module System](./module-system.md) - Detailed module architecture
- [ARCHITECTURE-INDEX.md](./ARCHITECTURE-INDEX.md) - Full documentation index
- [AIOS-LIVRO-DE-OURO-V2.1-COMPLETE.md](../../.aios-core/docs/standards/AIOS-LIVRO-DE-OURO-V2.1-COMPLETE.md) - Complete framework guide

---

**Last Updated:** 2025-12-09
**Version:** 2.1.0
**Maintainer:** @architect (Aria)
