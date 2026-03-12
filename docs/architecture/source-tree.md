> ⚠️ **DEPRECATED**: This file is maintained for backward compatibility only.
>
> **Official version:** [docs/framework/source-tree.md](../framework/source-tree.md)
>
> This file will be removed in Q2 2026 after full consolidation to `docs/framework/`.

---

# AIOS Source Tree Structure

> **EN** | [PT](../pt/architecture/source-tree.md) | [ES](../es/architecture/source-tree.md)

---

**Version:** 1.1
**Last Updated:** 2025-12-14
**Status:** DEPRECATED - See docs/framework/source-tree.md
**Migration Notice:** This document will migrate to `MarkmanAi/aios-core` repository in Q2 2026 (see Decision 005)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Current Structure (aios-core Brownfield)](#current-structure-aios-core-brownfield)
- [Framework Core (.aios-core/)](#framework-core-aios-core)
- [Documentation (docs/)](#documentation-docs)
- [Squads System](#squads-system)
- [Future Structure (Post-Migration Q2 2026)](#future-structure-post-migration-q2-2026)
- [File Naming Conventions](#file-naming-conventions)
- [Where to Put New Files](#where-to-put-new-files)

---

## Overview

AIOS uses a **dual-layer architecture**:

1. **Framework Core** (`.aios-core/`) - Portable framework components
2. **Project Workspace** (root) - Project-specific implementation

**Philosophy:**

- Framework components are **portable** (move between projects)
- Project files are **specific** (brownfield implementation)
- Clear **separation of concerns** (framework vs project)

---

## Current Structure (aios-core Brownfield)

```
aios-core/                             # Root (brownfield project)
├── .aios-core/                        # Framework core (portable)
│   ├── core/                          # Framework essentials (v2.1)
│   │   ├── config/                    # Configuration system
│   │   ├── data/                      # Core knowledge base
│   │   ├── docs/                      # Core documentation
│   │   ├── elicitation/               # Interactive prompting engine
│   │   ├── session/                   # Runtime state management
│   │   └── utils/                     # Core utilities
│   ├── product/                       # PM/PO assets (v2.1)
│   │   ├── templates/                 # Document templates (52+ files)
│   │   ├── checklists/                # Validation checklists (6 files)
│   │   └── data/                      # PM-specific data (6 files)
│   ├── agents/                        # Agent definitions
│   ├── tasks/                         # Task workflows
│   ├── workflows/                     # Multi-step workflows
│   ├── scripts/                       # Utility scripts
│   ├── tools/                         # Tool integrations
│   └── core-config.yaml               # Framework configuration
│
├── docs/                              # Documentation
│   ├── architecture/                  # Architecture decisions + official docs
│   ├── framework/                     # ⭐ NEW: Official framework docs
│   ├── stories/                       # Development stories
│   ├── epics/                         # Epic planning
│   ├── decisions/                     # ADRs (Architecture Decision Records)
│   ├── guides/                        # How-to guides
│   ├── qa/                            # QA reports
│   └── prd/                           # Product requirements
│
├── templates/                         # Project templates
│   └── squad/                         # Squad template for extensions (see docs/guides/squads-guide.md)
│
├── bin/                               # CLI executables
│   ├── @markmanai/aios-core.js              # Main CLI entry point
│   └── aios-minimal.js                # Minimal CLI
│
├── tools/                             # Build and utility tools
│   ├── cli.js                         # CLI builder
│   ├── package-builder.js             # Package builder
│   └── installer/                     # Installation scripts
│
├── tests/                             # Test suites
│   ├── unit/                          # Unit tests
│   ├── integration/                   # Integration tests
│   └── e2e/                           # End-to-end tests
│
├── .claude/                           # Claude Code IDE configuration
│   ├── settings.json                  # Project settings
│   ├── CLAUDE.md                      # Project instructions
│   └── commands/                      # Slash commands (agents)
│
├── outputs/                           # Runtime outputs
│   ├── minds/                         # MMOS cognitive clones
│   └── architecture-map/              # Architecture analysis
│
├── .ai/                               # ⭐ NEW: AI session artifacts
│   └── decision-log-{story-id}.md     # Yolo mode decision logs
│
├── index.js                           # Main entry point (CommonJS)
├── index.esm.js                       # ES Module entry point
├── index.d.ts                         # TypeScript type definitions
├── package.json                       # Package manifest
├── tsconfig.json                      # TypeScript configuration
├── .eslintrc.json                     # ESLint configuration
├── .prettierrc                        # Prettier configuration
└── README.md                          # Project README
```

---

## Framework Core (.aios-core/)

**Purpose:** Portable framework components that work across any AIOS project.

### Directory Structure

```
.aios-core/
├── agents/                            # 145 agent definitions
│   ├── aios-master.md                 # Master orchestrator
│   ├── dev.md                         # Developer agent
│   ├── qa.md                          # QA engineer agent
│   ├── architect.md                   # System architect agent
│   ├── po.md                          # Product Owner agent
│   ├── pm.md                          # Product Manager agent
│   ├── sm.md                          # Scrum Master agent
│   ├── analyst.md                     # Business Analyst agent
│   ├── ux-expert.md                   # UX Designer agent
│   ├── data-engineer.md               # Data Engineer agent
│   ├── devops.md                      # DevOps agent
│   ├── db-sage.md                     # Database architect agent
│   └── .deprecated/                   # Archived agents
│
├── tasks/                             # 60 task workflows
│   ├── create-next-story.md           # Story creation workflow
│   ├── develop-story.md               # Story development workflow
│   ├── validate-next-story.md         # Story validation workflow
│   ├── review-story.md                # Story review workflow
│   ├── apply-qa-fixes.md              # QA fix workflow
│   ├── execute-checklist.md           # Checklist execution
│   ├── document-project.md            # Project documentation
│   ├── create-doc.md                  # Document creation
│   ├── shard-doc.md                   # Document sharding
│   └── ...                            # 50+ more tasks
│
├── templates/                         # 20 document templates
│   ├── story-tmpl.yaml                # Story template v2.0
│   ├── design-story-tmpl.yaml         # Design story template v1.0
│   ├── prd-tmpl.yaml                  # PRD template
│   ├── epic-tmpl.md                   # Epic template
│   ├── architecture-tmpl.yaml         # Architecture template
│   ├── fullstack-architecture-tmpl.yaml  # Full-stack arch template
│   ├── brownfield-architecture-tmpl.yaml # Brownfield arch template
│   ├── schema-design-tmpl.yaml        # Database schema template
│   └── ...                            # 12+ more templates
│
├── workflows/                         # 6 multi-step workflows
│   ├── greenfield-fullstack.yaml      # Greenfield full-stack workflow
│   ├── greenfield-service.yaml        # Greenfield service workflow
│   ├── greenfield-ui.yaml             # Greenfield UI workflow
│   ├── brownfield-fullstack.yaml      # Brownfield full-stack workflow
│   ├── brownfield-service.yaml        # Brownfield service workflow
│   └── brownfield-ui.yaml             # Brownfield UI workflow
│
├── checklists/                        # 6 validation checklists
│   ├── po-master-checklist.md         # PO validation checklist
│   ├── story-draft-checklist.md       # Story draft validation
│   ├── architect-checklist.md         # Architecture review checklist
│   ├── qa-checklist.md                # QA checklist
│   ├── pm-checklist.md                # PM checklist
│   └── change-checklist.md            # Change management checklist
│
├── data/                              # 6 knowledge base files
│   ├── aios-kb.md                     # AIOS knowledge base
│   ├── technical-preferences.md       # Tech stack preferences
│   ├── elicitation-methods.md         # Elicitation techniques
│   ├── brainstorming-techniques.md    # Brainstorming methods
│   ├── test-levels-framework.md       # Testing levels
│   └── test-priorities-matrix.md      # Test prioritization
│
├── scripts/                             # 54 utility scripts
│   ├── component-generator.js         # Component scaffolding
│   ├── elicitation-engine.js          # Interactive elicitation
│   ├── story-manager.js               # Story lifecycle management
│   ├── yaml-validator.js              # YAML validation
│   ├── usage-analytics.js             # Framework usage analytics
│   └── ...                            # 49+ more utilities
│
├── tools/                             # Tool integrations
│   ├── mcp/                           # MCP server configs
│   │   ├── clickup-direct.yaml        # ClickUp integration
│   │   ├── context7.yaml              # Context7 integration
│   │   └── exa-direct.yaml            # Exa search integration
│   ├── cli/                           # CLI tool wrappers
│   │   ├── github-cli.yaml            # GitHub CLI wrapper
│   │   └── railway-cli.yaml           # Railway CLI wrapper
│   └── local/                         # Local tools
│
├── elicitation/                       # 3 elicitation engines
│   ├── agent-elicitation.js           # Agent creation elicitation
│   ├── task-elicitation.js            # Task creation elicitation
│   └── workflow-elicitation.js        # Workflow creation elicitation
│
├── agent-teams/                       # Agent team configurations
│   └── ...                            # Team definitions
│
├── core-config.yaml                   # ⭐ Framework configuration
├── install-manifest.yaml              # Installation manifest
├── user-guide.md                      # User guide
└── working-in-the-brownfield.md       # Brownfield development guide
```

### File Patterns

```yaml
Agents:
  Location: .aios-core/agents/
  Format: Markdown with YAML frontmatter
  Naming: {agent-name}.md (kebab-case)
  Example: developer.md, qa-engineer.md

Tasks:
  Location: .aios-core/tasks/
  Format: Markdown workflow
  Naming: {task-name}.md (kebab-case)
  Example: create-next-story.md, develop-story.md

Templates:
  Location: .aios-core/product/templates/
  Format: YAML or Markdown
  Naming: {template-name}-tmpl.{yaml|md}
  Example: story-tmpl.yaml, prd-tmpl.md

Workflows:
  Location: .aios-core/workflows/
  Format: YAML
  Naming: {workflow-type}-{scope}.yaml
  Example: greenfield-fullstack.yaml, brownfield-service.yaml

Checklists:
  Location: .aios-core/product/checklists/
  Format: Markdown
  Naming: {checklist-name}-checklist.md
  Example: story-draft-checklist.md, architect-checklist.md

Utilities:
  Location: .aios-core/utils/
  Format: JavaScript (CommonJS)
  Naming: {utility-name}.js (kebab-case)
  Example: component-generator.js, story-manager.js
```

---

## Documentation (docs/)

### Current Organization

```
docs/
├── architecture/                      # ⚠️ Mixed: official + project-specific
│   ├── coding-standards.md            # ✅ Official (migrates to REPO 1)
│   ├── tech-stack.md                  # ✅ Official (migrates to REPO 1)
│   ├── source-tree.md                 # ✅ Official (migrates to REPO 1)
│   ├── decision-analysis-*.md         # Project-specific decisions
│   ├── architectural-review-*.md      # Project-specific reviews
│   └── mcp-*.md                       # Framework docs (migrates to REPO 1)
│
├── framework/                         # ⭐ NEW: Official framework docs (Q2 2026)
│   ├── coding-standards.md            # Framework coding standards
│   ├── tech-stack.md                  # Framework tech stack
│   ├── source-tree.md                 # Framework source tree
│   └── README.md                      # Migration notice
│
├── stories/                           # Development stories
│   ├── aios migration/                # AIOS migration stories
│   │   ├── story-6.1.2.1.md
│   │   ├── story-6.1.2.2.md
│   │   ├── story-6.1.2.3.md
│   │   ├── story-6.1.2.4.md
│   │   └── story-6.1.2.5.md
│   └── ...                            # Other stories
│
├── epics/                             # Epic planning
│   ├── epic-6.1-agent-identity-system.md
│   └── ...                            # Other epics
│
├── decisions/                         # Architecture Decision Records
│   ├── decision-005-repository-restructuring-FINAL.md
│   └── ...                            # Other ADRs
│
├── guides/                            # How-to guides
│   ├── git-workflow-guide.md
│   ├── migration-guide.md
│   └── ...                            # Other guides
│
├── qa/                                # QA artifacts
│   └── backlog-archive/               # Archived QA items
│
├── prd/                               # Product Requirements Documents
│   └── ...                            # PRD files
│
├── planning/                          # Planning documents
│   └── ...                            # Sprint plans, roadmaps
│
├── standards/                         # Framework standards
│   └── AGENT-PERSONALIZATION-STANDARD-V1.md
│
└── STORY-BACKLOG.md                   # ⭐ Story backlog index
```

### Proposed Reorganization (Story 6.1.2.6)

```
docs/
├── framework/                         # ✅ Official framework docs
│   ├── coding-standards.md
│   ├── tech-stack.md
│   ├── source-tree.md
│   ├── agent-spec.md
│   ├── task-spec.md
│   └── workflow-spec.md
│
├── architecture/                      # Project-specific architecture
│   ├── project-decisions/             # ✅ ADRs for this project
│   │   ├── decision-005-repository-restructuring-FINAL.md
│   │   ├── architectural-review-contextual-agent-load.md
│   │   └── ...
│   └── diagrams/                      # Architecture diagrams
│
├── stories/                           # Development stories
│   ├── index.md                       # ⭐ Story index (auto-generated)
│   ├── backlog.md                     # ⭐ Story backlog (official)
│   └── ...                            # Story files
│
├── epics/
├── guides/
├── qa/
├── prd/
└── standards/
```

---

## Squads System

> **Note:** Squads replaced the legacy "Squads" system in OSR-8. See [Squads Guide](../guides/squads-guide.md) for complete documentation.

### Overview

Squads are modular extensions that add specialized capabilities to AIOS. Unlike the deprecated Squads, Squads follow a standardized template structure.

### Squad Template Location

```
templates/squad/                       # Squad template for creating extensions
├── squad.yaml                         # Squad manifest template
├── package.json                       # NPM package template
├── README.md                          # Documentation template
├── LICENSE                            # License template
├── .gitignore                         # Git ignore template
├── agents/                            # Squad-specific agents
│   └── example-agent.yaml
├── tasks/                             # Squad-specific tasks
│   └── example-task.yaml
├── workflows/                         # Squad-specific workflows
│   └── example-workflow.yaml
├── templates/                         # Squad-specific templates
│   └── example-template.md
└── tests/                             # Squad tests
    └── example-agent.test.js
```

### Creating a New Squad

```bash
# Future CLI (planned):
npx create-aios-squad my-squad-name

# Current method:
cp -r templates/squad/ squads/my-squad-name/
# Then customize squad.yaml and components
```

### Squad Manifest Structure

```yaml
# squad.yaml
name: my-custom-squad
version: 1.0.0
description: Description of what this squad does
author: Your Name
license: MIT

# Components provided by this squad
agents:
  - custom-agent-1
  - custom-agent-2

tasks:
  - custom-task-1

workflows:
  - custom-workflow-1

# Dependencies
dependencies:
  aios-core: '>=2.1.0'
```

### Migration from Squads

| Legacy (Deprecated)             | Current (Squads)                |
| ------------------------------- | ------------------------------- |
| `Squads/` directory             | `templates/squad/` template     |
| `expansionPacksLocation` config | `squadsTemplateLocation` config |
| `pack.yaml` manifest            | `squad.yaml` manifest           |
| Direct loading                  | Template-based creation         |

---

## Future Structure (Post-Migration Q2 2026)

**Decision 005 defines 5 separate repositories:**

### REPO 1: MarkmanAi/aios-core (Commons Clause)

```
aios-core/
├── src/                               # Source code
│   ├── core/                          # Core orchestration engine
│   │   ├── agent-executor.js
│   │   ├── task-runner.js
│   │   └── workflow-orchestrator.js
│   ├── integrations/                  # External integrations
│   │   ├── mcp/                       # MCP orchestration
│   │   └── ide/                       # IDE integration
│   └── cli/                           # CLI interface
│
├── .aios-core/                        # Framework assets (current structure)
│   ├── agents/
│   ├── tasks/
│   ├── templates/
│   └── ...
│
├── docs/                              # Framework documentation
│   ├── getting-started/
│   ├── core-concepts/
│   ├── integrations/
│   └── api/
│
├── examples/                          # Example projects
│   ├── basic-agent/
│   ├── vibecoder-demo/
│   └── multi-agent-workflow/
│
└── tests/                             # Test suites
    ├── unit/
    ├── integration/
    └── e2e/
```

### REPO 2: MarkmanAi/squads (MIT)

```
squads/
├── verified/                          # AIOS-curated squads
│   ├── github-devops/
│   ├── db-sage/
│   └── coderabbit-workflow/
│
├── community/                         # Community submissions
│   ├── marketing-agency/
│   ├── sales-automation/
│   └── ...
│
├── templates/                         # Squad templates
│   ├── minimal-squad/
│   └── agent-squad/
│
└── tools/                             # Squad development tools
    └── create-aios-squad/
```

### REPO 3: MarkmanAi/mcp-ecosystem (Apache 2.0)

```
mcp-ecosystem/
├── presets/                           # MCP presets (Docker MCP Toolkit)
│   ├── aios-dev/
│   ├── aios-research/
│   └── aios-docker/
│
├── mcps/                              # Base MCP configs
│   ├── exa/
│   ├── context7/
│   └── desktop-commander/
│
└── ide-configs/                       # IDE integrations
    ├── claude-code/
    ├── gemini-cli/
    └── cursor/
```

### REPO 4: MarkmanAi/certified-partners (Private)

```
certified-partners/
├── premium-packs/                     # Premium Squads
│   ├── enterprise-deployment/
│   └── advanced-devops/
│
├── partner-portal/                    # Partner Success Platform
│   ├── dashboard/
│   └── analytics/
│
└── marketplace/                       # Marketplace platform
    ├── api/
    └── web/
```

### REPO 5: MarkmanAi/mmos (Private + NDA)

```
mmos/
├── minds/                             # 34 cognitive clones
│   ├── pedro-valerio/
│   ├── paul-graham/
│   └── ...
│
├── emulator/                          # MMOS emulation engine
│   ├── mirror-agent/
│   └── dna-mental/
│
└── research/                          # Research artifacts
    └── transcripts/
```

---

## File Naming Conventions

### General Rules

```yaml
Directories: kebab-case (lowercase, hyphen-separated)
  ✅ .aios-core/
  ✅ Squads/
  ❌ .AIOS-Core/
  ❌ expansionPacks/

Files (Code): kebab-case with extension
  ✅ agent-executor.js
  ✅ task-runner.js
  ❌ AgentExecutor.js
  ❌ taskRunner.js

Files (Docs): kebab-case with .md extension
  ✅ coding-standards.md
  ✅ story-6.1.2.5.md
  ❌ CodingStandards.md
  ❌ Story_6_1_2_5.md

Files (Config): lowercase or kebab-case
  ✅ package.json
  ✅ tsconfig.json
  ✅ core-config.yaml
  ❌ PackageConfig.json
```

### Special Cases

```yaml
Stories:
  Format: story-{epic}.{story}.{substory}.md
  Example: story-6.1.2.5.md

Epics:
  Format: epic-{number}-{name}.md
  Example: epic-6.1-agent-identity-system.md

Decisions:
  Format: decision-{number}-{name}.md
  Example: decision-005-repository-restructuring-FINAL.md

Templates:
  Format: {name}-tmpl.{yaml|md}
  Example: story-tmpl.yaml, prd-tmpl.md

Checklists:
  Format: {name}-checklist.md
  Example: architect-checklist.md
```

---

## Where to Put New Files

### Decision Matrix

```yaml
# I'm creating a new agent:
Location: .aios-core/agents/{agent-name}.md
Example: .aios-core/agents/security-expert.md

# I'm creating a new task:
Location: .aios-core/tasks/{task-name}.md
Example: .aios-core/tasks/deploy-to-production.md

# I'm creating a new workflow:
Location: .aios-core/workflows/{workflow-name}.yaml
Example: .aios-core/workflows/continuous-deployment.yaml

# I'm creating a new template:
Location: .aios-core/product/templates/{template-name}-tmpl.{yaml|md}
Example: .aios-core/product/templates/deployment-plan-tmpl.yaml

# I'm writing a story:
Location: docs/stories/{epic-context}/{story-file}.md
Example: docs/stories/aios migration/story-6.1.2.6.md

# I'm documenting an architecture decision:
Location: docs/architecture/project-decisions/{decision-file}.md
Example: docs/architecture/project-decisions/decision-006-auth-strategy.md

# I'm creating official framework documentation:
Location: docs/framework/{doc-name}.md
Example: docs/framework/agent-development-guide.md

# I'm creating a utility script:
Location: .aios-core/utils/{utility-name}.js
Example: .aios-core/utils/performance-monitor.js

# I'm creating a test:
Location: tests/{type}/{test-name}.test.js
Example: tests/unit/agent-executor.test.js

# I'm creating a squad:
Location: Copy templates/squad/ to your squads directory
Example: squads/devops-automation/ (customize from template)
```

---

## Special Directories

### .ai/ Directory (NEW - Story 6.1.2.6)

```
.ai/                                   # AI session artifacts
├── decision-log-6.1.2.5.md            # Yolo mode decision log
├── decision-log-6.1.2.6.md            # Another decision log
└── session-{date}-{agent}.md          # Session transcripts (optional)
```

**Purpose:** Track AI-driven decisions during development sessions (especially yolo mode)

**Auto-generated:** Yes (when yolo mode enabled)

### outputs/ Directory

```
outputs/                               # Runtime outputs (gitignored)
├── minds/                             # MMOS cognitive clones
│   └── pedro_valerio/
│       ├── system-prompt.md
│       ├── kb/
│       └── artifacts/
│
└── architecture-map/                  # Architecture analysis
    ├── MASTER-RELATIONSHIP-MAP.json
    └── schemas/
```

**Purpose:** Runtime artifacts not committed to git

---

## Related Documents

- [Coding Standards](./coding-standards.md)
- [Tech Stack](./tech-stack.md)

---

## Version History

| Version | Date       | Changes                                                                  | Author           |
| ------- | ---------- | ------------------------------------------------------------------------ | ---------------- |
| 1.0     | 2025-01-15 | Initial source tree documentation                                        | Aria (architect) |
| 1.1     | 2025-12-14 | Updated org to MarkmanAi, replaced Squads with Squads system [Story 6.10] | Dex (dev)        |

---

_This is an official AIOS framework standard. All file placement must follow this structure._
