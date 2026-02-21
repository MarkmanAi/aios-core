# Análise Completa: Auto-Claude Framework

> **Documento de Análise Arquitetural para Evolução do AIOS**
>
> **Preparado por:** Aria (Architect Agent)
> **Data:** 2026-01-28
> **Versão:** 1.0
> **Para:** Pedro Valério, Alan

---

## Sumário Executivo

Este documento apresenta uma análise profunda do framework **Auto-Claude** (https://github.com/AndyMik90/Auto-Claude), identificando padrões, arquiteturas e práticas que podem ser incorporadas ao **MarkmanAi AIOS** para evolução do nosso sistema de orquestração de agentes.

### Principais Descobertas

| Área                 | Auto-Claude                 | AIOS Atual           | Oportunidade |
| -------------------- | --------------------------- | -------------------- | ------------ |
| **Spec Pipeline**    | 6-8 fases estruturadas      | Stories MD informais | 🔴 Alta      |
| **Isolamento Git**   | Worktrees por spec          | Branch tradicional   | 🔴 Alta      |
| **Plano Executável** | JSON com subtasks           | Checkboxes manuais   | 🔴 Alta      |
| **Self-Critique**    | Obrigatório antes de commit | Inexistente          | 🟡 Média     |
| **Recovery System**  | Tracking de tentativas      | Inexistente          | 🟡 Média     |
| **Memory Layer**     | Graph semântico (Graphiti)  | YAML básico          | 🟡 Média     |
| **Security**         | 16 validators dinâmicos     | 2 hooks estáticos    | 🟢 Baixa     |

### Recomendação Principal

**Implementar o Spec Pipeline + Worktree Isolation** como fundação, seguido de Implementation Plan executável. Estes três componentes transformariam o AIOS de um sistema de orquestração de agentes para um **sistema de execução autônoma de desenvolvimento**.

---

## Índice

1. [Visão Geral do Auto-Claude](#1-visão-geral-do-auto-claude)
2. [Arquitetura de Agentes](#2-arquitetura-de-agentes)
3. [Pipeline de Especificações](#3-pipeline-de-especificações)
4. [Sistema de Planos Executáveis](#4-sistema-de-planos-executáveis)
5. [Worktree Isolation](#5-worktree-isolation)
6. [Sistema de Recovery](#6-sistema-de-recovery)
7. [Quality Assurance Pipeline](#7-quality-assurance-pipeline)
8. [Memory Layer (Graphiti)](#8-memory-layer-graphiti)
9. [Sistema de Segurança](#9-sistema-de-segurança)
10. [Ideation System](#10-ideation-system)
11. [Análise Comparativa AIOS vs Auto-Claude](#11-análise-comparativa-aios-vs-auto-claude)
12. [Proposta de Implementação](#12-proposta-de-implementação)
13. [Roadmap Sugerido](#13-roadmap-sugerido)
14. [Anexos](#14-anexos)

---

## 1. Visão Geral do Auto-Claude

### 1.1 O que é

Auto-Claude é um **framework de codificação autônoma multi-agente** que planeja, constrói e valida software automaticamente. Utiliza o Claude Code CLI como engine de execução.

### 1.2 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    AUTO-CLAUDE                          │
├─────────────────────────────────────────────────────────┤
│  Frontend: Electron Desktop App (TypeScript 58%)        │
│  Backend:  Python Agents & Orchestration (Python 40%)   │
│  CLI:      Claude Code (@anthropic-ai/claude-code)      │
│  Memory:   Graphiti (Knowledge Graph)                   │
│  Auth:     OAuth (Claude Pro/Max required)              │
└─────────────────────────────────────────────────────────┘
```

### 1.3 Estrutura de Diretórios

```
Auto-Claude/
├── apps/
│   ├── backend/           # Python - Agentes e orquestração
│   │   ├── agents/        # Execução de agentes IA
│   │   ├── analysis/      # Análise de código
│   │   ├── cli/           # Interface de linha de comando
│   │   ├── core/          # Utilitários centralizados
│   │   ├── integrations/  # Linear, Graphiti
│   │   ├── merge/         # Manipulação de merge Git
│   │   ├── project/       # Detecção de projeto
│   │   ├── prompts/       # 25 templates de prompts
│   │   ├── qa/            # Pipeline de QA
│   │   ├── review/        # Revisão de código
│   │   ├── runners/       # Executores de tarefa
│   │   ├── security/      # 16 validators de segurança
│   │   ├── services/      # Serviços gerais
│   │   ├── spec/          # Gerenciamento de specs
│   │   ├── task_logger/   # Logging de tarefas
│   │   └── ui/            # Interface de terminal
│   │
│   └── frontend/          # Electron desktop application
│
├── .claude/
│   └── commands/          # Comandos Claude CLI
│
├── guides/                # Documentação estendida
├── tests/                 # Suite de testes
└── scripts/               # Utilitários de build
```

### 1.4 Princípios de Design

1. **SOLID, DRY, KISS** - Código modular com fachadas para importações limpas
2. **Isolamento Total** - Toda modificação em git worktrees separados
3. **Spec-Driven** - Tarefas formalizadas como especificações executáveis
4. **Self-Validating** - Loops de QA automático antes de merge
5. **Memory Persistence** - Conhecimento acumulado entre sessões

---

## 2. Arquitetura de Agentes

### 2.1 Visão Geral dos Agentes

O Auto-Claude opera com **4 agentes principais** em pipeline sequencial:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AGENT PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    │
│   │ PLANNER  │───▶│  CODER   │───▶│ REVIEWER │───▶│  FIXER   │    │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘    │
│        │               │               │               │           │
│        ▼               ▼               ▼               ▼           │
│   project_index    implementa      valida AC       corrige        │
│   context.json     subtasks        QA report       bugs           │
│   impl_plan.json   commits         approve/reject  re-validate    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Planner Agent

**Responsabilidade:** Criar plano de implementação SEM implementar código.

**Outputs Gerados:**

- `project_index.json` - Mapa estrutural do projeto
- `context.json` - Arquivos afetados e patterns
- `implementation_plan.json` - Subtasks executáveis
- `init.sh` - Script de inicialização
- `build-progress.txt` - Resumo de progresso

**Workflow Types Suportados:**

| Tipo            | Fases                                     | Exemplo             |
| --------------- | ----------------------------------------- | ------------------- |
| `feature`       | Backend → Worker → Frontend → Integration | Nova funcionalidade |
| `refactor`      | Add New → Migrate → Remove Old → Cleanup  | Refatoração         |
| `investigation` | Reproduce → Investigate → Fix → Harden    | Bug fix             |
| `migration`     | Prepare → Test → Execute → Cleanup        | Migração de dados   |
| `simple`        | Direct subtasks only                      | Mudança simples     |

**Regras de Subtask:**

- 1 serviço por subtask
- 1-3 arquivos máximo
- Verificação explícita obrigatória (command, api, browser, e2e)

**Prompt Completo (Resumo):**

```markdown
# Planner Agent Role

You are the FIRST step in autonomous development. Your job is to create
a subtask-based implementation plan, NOT tests or test-focused specs.

## Critical Rules

- Do NOT implement code—planning only
- Do NOT commit spec files (gitignored, locally managed)
- Do NOT skip Phase 0 investigation
- Must use Write tool to create JSON/script files
- Stop after planning—a separate coder agent handles implementation

## Output Files Required

1. project_index.json - Project structure, services, tech stack, ports
2. context.json - Files to modify/reference, observed patterns
3. implementation_plan.json - Complete subtask breakdown
4. init.sh - Startup script for all services
5. build-progress.txt - Session summary
```

### 2.3 Coder Agent (13 Steps)

**Responsabilidade:** Executar subtasks do plano, uma por vez.

**Workflow Completo:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CODER AGENT - 13 STEPS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: Get Bearings                                               │
│  └── pwd, spec location, read implementation_plan.json              │
│                                                                     │
│  Step 2: Understand Plan                                            │
│  └── Phases, subtasks, dependencies, service assignments            │
│                                                                     │
│  Step 3: Find Next Subtask                                          │
│  └── First pending where phase dependencies satisfied               │
│                                                                     │
│  Step 4: Start Development                                          │
│  └── Run init.sh, verify services via project_index.json            │
│                                                                     │
│  Step 5: Read Context                                               │
│  └── Files to modify, pattern references, external docs             │
│                                                                     │
│  ╔═══════════════════════════════════════════════════════════════╗ │
│  ║ Step 5.5: Pre-Implementation Checklist ⭐ NOVO                 ║ │
│  ║ └── Predict likely bugs                                        ║ │
│  ║ └── Identify edge cases                                        ║ │
│  ║ └── Plan error handling                                        ║ │
│  ╚═══════════════════════════════════════════════════════════════╝ │
│                                                                     │
│  Step 6: Implement                                                  │
│  └── Code following established patterns                            │
│                                                                     │
│  ╔═══════════════════════════════════════════════════════════════╗ │
│  ║ Step 6.5: Self-Critique ⭐ NOVO                                ║ │
│  ║ └── Pattern adherence verified?                                ║ │
│  ║ └── Error handling complete?                                   ║ │
│  ║ └── No hardcoded values?                                       ║ │
│  ║ └── Tests added?                                               ║ │
│  ║ └── Documentation updated?                                     ║ │
│  ╚═══════════════════════════════════════════════════════════════╝ │
│                                                                     │
│  Step 7: Verify                                                     │
│  └── Run verification commands, fix failures immediately            │
│                                                                     │
│  Step 8: Update Plan                                                │
│  └── Mark subtask as completed in implementation_plan.json          │
│                                                                     │
│  Step 9: Commit                                                     │
│  └── Path verification + secret scanning                            │
│                                                                     │
│  Step 10: Progress Tracking                                         │
│  └── Append to build-progress.txt                                   │
│                                                                     │
│  Step 11: Check Completion                                          │
│  └── Next subtask or declare build complete                         │
│                                                                     │
│  ╔═══════════════════════════════════════════════════════════════╗ │
│  ║ Step 12: Document Insights ⭐ NOVO                             ║ │
│  ║ └── Write session_*.json with discoveries for future sessions  ║ │
│  ╚═══════════════════════════════════════════════════════════════╝ │
│                                                                     │
│  Step 13: End Cleanly                                               │
│  └── No uncommitted changes, no half-finished work                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Safety Rules Críticas:**

```yaml
Path Management:
  - Always use relative paths
  - Verify current directory before git operations
  - Prevents doubled paths in monorepos

Secret Scanning:
  - Automatic blocking of commits containing secrets
  - Move credentials to environment variables

Scope Control:
  - Modify only listed files
  - Create only specified files

Quality Gate:
  - Self-critique checklist must pass before verification
  - Immediate bug fixes (resolve failures before proceeding)

No Remote Push:
  - All work stays local for user review
```

### 2.4 QA Reviewer Agent (10 Phases)

**Responsabilidade:** Validar build completo antes de aprovação.

```
┌─────────────────────────────────────────────────────────────────────┐
│                   QA REVIEWER - 10 PHASES                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Phase 0-1: Load Context                                            │
│  └── Verify all subtasks completed before proceeding                │
│                                                                     │
│  Phase 2: Initialize Environment                                    │
│  └── Services running and healthy                                   │
│                                                                     │
│  Phase 3: Automated Testing                                         │
│  └── Unit, integration, E2E - document pass/fail                    │
│                                                                     │
│  Phase 4: Browser Verification                                      │
│  └── Console errors, interaction functionality                      │
│                                                                     │
│  Phase 5: Database Validation                                       │
│  └── Migrations present, schemas match specs                        │
│                                                                     │
│  Phase 6: Code Review                                               │
│  └── Security checks, Context7 validation, pattern compliance       │
│                                                                     │
│  Phase 7: Regression Testing                                        │
│  └── Existing functionality remains unbroken                        │
│                                                                     │
│  Phase 8: QA Report Generation                                      │
│  └── Critical/Major/Minor issue categorization                      │
│                                                                     │
│  Phase 9: Update Implementation Plan                                │
│  └── Approval status OR create QA_FIX_REQUEST.md                    │
│                                                                     │
│  Phase 10: Signal Completion                                        │
│  └── Clear approval or rejection messaging                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Princípio Chave:**

> _"You are the last line of defense. If you approve, the feature ships. Be thorough."_

### 2.5 QA Fixer Agent (8 Phases)

**Responsabilidade:** Corrigir issues reportados pelo QA Reviewer.

```yaml
Loop até aprovação (max 5 iterações):

  Phase 0: Load Context
    - Read QA_FIX_REQUEST.md, qa_report.md, spec.md
    - Read implementation_plan.json
    - Check git status

  Phase 1: Parse Requirements
    - Extract specific issues with locations
    - Create mental checklist

  Phase 2: Start Development
    - Run init.sh
    - Verify services

  Phase 3: Fix Issues Sequentially
    - For each issue: read → understand → fix minimal → verify → document

  Phase 4: Run Tests
    - Full test suite
    - Specific failing tests

  Phase 5: Self-Verification
    - Checkbox: every issue from QA_FIX_REQUEST.md addressed?

  Phase 6: Commit Fixes
    - CRITICAL: verify pwd before git operations (monorepo safety)
    - Add files (excluding .auto-claude)
    - Commit with descriptive messages

  Phase 7: Update Implementation Plan
    - Mark qa_signoff status as "fixes_applied"
    - Add timestamps and commit hashes

  Phase 8: Signal Completion
    - Report all fixed issues
    - Indicate readiness for QA re-validation
```

**Critical Safety Rules:**

- Never modify git user configuration
- Always check `pwd` before file operations in monorepos
- Minimal changes only—fix reported issues without refactoring
- Run full test suite to catch regressions
- Don't commit .auto-claude directory

---

## 3. Pipeline de Especificações

### 3.1 Visão Geral

O Auto-Claude usa um **pipeline de 6-8 fases** para criar especificações, adaptando-se à complexidade da tarefa.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SPEC CREATION PIPELINE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SIMPLE (3 fases)     STANDARD (6 fases)      COMPLEX (8 fases)    │
│  ─────────────────    ──────────────────      ─────────────────    │
│                                                                     │
│  1. Discovery         1. Discovery            1. Discovery          │
│  2. Quick Spec        2. Requirements         2. Requirements       │
│  3. Validate          3. Context              3. Research ←────┐   │
│                       4. Spec                 4. Context        │   │
│                       5. Plan                 5. Spec           │   │
│                       6. Validate             6. Self-Critique ←┘   │
│                                               7. Plan               │
│                                               8. Validate           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Classificação de Complexidade

O sistema avalia 5 dimensões para classificar a tarefa:

```yaml
Dimensões de Avaliação:
  scope:
    description: Quantos arquivos e serviços afetados
    criteria:
      - Localizado vs cross-cutting
      - Single service vs multiple services

  integration:
    description: Dependências externas
    criteria:
      - Serviços externos necessários
      - Novas dependências a adicionar
      - Research necessário para tecnologias desconhecidas

  infrastructure:
    description: Mudanças de infraestrutura
    criteria:
      - Docker changes
      - Database modifications
      - Configuration needs

  knowledge:
    description: Conhecimento necessário
    criteria:
      - Patterns existentes aplicáveis?
      - Research externo necessário?

  risk:
    description: Avaliação de riscos
    criteria:
      - Potential failure points
      - Security implications
      - Impact on existing functionality

Classificação Final:
  SIMPLE:
    files: 1-2
    services: single
    integrations: none
    examples: 'typo fixes, color changes, small UI tweaks'
    phases: 3

  STANDARD:
    files: 3-10
    services: 1-2
    integrations: minimal
    examples: 'new API endpoints, new components, feature additions'
    phases: 6

  COMPLEX:
    files: 10+
    services: multiple
    integrations: 2+
    infrastructure: changes required
    examples: 'new service integrations, major migrations, new systems'
    phases: 8
```

### 3.3 Agentes do Pipeline de Specs

#### 3.3.1 Spec Gatherer (Requirements)

**Output:** `requirements.json`

```json
{
  "task_description": "Add user authentication with JWT",
  "workflow_type": "feature",
  "affected_services": ["api", "web"],
  "requirements": [
    "Users can register with email/password",
    "Users can login and receive JWT token",
    "Protected routes require valid token"
  ],
  "acceptance_criteria": [
    "Registration endpoint returns 201 on success",
    "Login returns JWT token in response",
    "Invalid token returns 401"
  ],
  "constraints": ["Must use existing User model", "JWT expiry: 24 hours"],
  "timestamp": "2026-01-28T10:00:00Z"
}
```

**Regra Crítica:**

> _"You MUST create requirements.json. The orchestrator will fail if you don't."_

#### 3.3.2 Spec Researcher

**Output:** `research.json`

**Responsabilidade:** Validar todas as dependências externas mencionadas.

```yaml
Research Workflow:

  Phase 0: Load Requirements
    - Extract libraries, services, infrastructure from requirements.json

  Phase 1: Research Each Integration
    - Primary tool: Context7 MCP (resolve library ID → fetch docs)
    - Secondary: Web search for verification
    - Answer 5 key questions:
      1. Correct package names?
      2. API patterns?
      3. Configuration requirements?
      4. Infrastructure needs?
      5. Known issues/gotchas?

  Phase 2: Validate Assumptions
    - Verify package existence
    - Verify API patterns
    - Verify configuration options
    - Flag unverified claims

  Phase 3: Create research.json
    - Verified packages with versions
    - API patterns with examples
    - Configuration requirements
    - Infrastructure needs
    - Gotchas and sources

  Phase 4: Summarize
    - Count of researched integrations
    - Verification status
    - Unverified claims flagged
    - Key findings and recommendations
```

**Tool Priority:**

1. **Context7 MCP** - Documentação estruturada
2. **Web Search** - Verificação e info recente
3. **Web Fetch** - Páginas específicas de docs

#### 3.3.3 Spec Writer

**Output:** `spec.md`

**Input:** `project_index.json` + `requirements.json` + `context.json`

**Template Structure:**

```markdown
# Spec: [Task Name]

## Overview

What's being built and rationale

## Workflow Type

feature | refactor | investigation | migration | simple

## Task Scope

- Services involved
- Specific changes
- Out-of-scope items

## Service Context

| Service | Tech Stack | Entry Point | Port |
| ------- | ---------- | ----------- | ---- |
| api     | NestJS     | src/main.ts | 3000 |

## Files to Modify

| File             | Changes Required        |
| ---------------- | ----------------------- |
| src/api/users.ts | Add createUser endpoint |

## Files to Reference

| File                | Pattern to Follow    |
| ------------------- | -------------------- |
| src/api/products.ts | Controller structure |

## Patterns to Follow

[Detailed pattern examples from codebase]

## Requirements

- Functional requirements
- Edge cases to handle

## Implementation Notes

### DO

- Follow existing patterns
- Add error handling

### DON'T

- Change existing behavior
- Add unnecessary dependencies

## Development Environment

- Startup: `npm run dev`
- API URL: http://localhost:3000
- Required env vars: DATABASE_URL

## Success Criteria

- [ ] All endpoints working
- [ ] Tests passing
- [ ] No console errors

## QA Acceptance Criteria

- Unit tests: [requirements]
- Integration tests: [requirements]
- E2E tests: [requirements]
- Browser tests: [requirements]
- Database tests: [requirements]
```

**Regra Crítica:**

> _"All sections must exist. Content derives exclusively from input files—no invention."_

#### 3.3.4 Spec Critic

**Output:** `critique_report.json`

**Responsabilidade:** Identificar e corrigir problemas na spec ANTES da implementação.

```yaml
Evaluation Dimensions:
  accuracy:
    - Package names correct?
    - API signatures valid?
    - Configuration correct?

  completeness:
    - All requirements addressed?
    - Edge cases handled?
    - Testability ensured?

  consistency:
    - Terminology standardized?
    - Naming conventions unified?

  feasibility:
    - Dependencies available?
    - Infrastructure viable?
    - Implementation sequence logical?

  alignment:
    - Adheres to research findings?
    - No unsubstantiated claims?

Severity Levels:
  high: Must fix before implementation
  medium: Should fix, may cause issues
  low: Cosmetic, nice to have
```

### 3.4 Artefatos Gerados por Spec

```
.auto-claude/specs/001-feature-auth/
│
├── requirements.json          # Spec Gatherer output
├── research.json              # Spec Researcher output
├── complexity_assessment.json # Complexity Assessor output
├── project_index.json         # Planner output
├── context.json               # Planner output
├── spec.md                    # Spec Writer output
├── critique_report.json       # Spec Critic output
├── implementation_plan.json   # Planner output
├── attempt_history.json       # Recovery tracking
├── current_approach.txt       # Current strategy
├── build_commits.json         # Commits per subtask
├── init.sh                    # Startup script
├── build-progress.txt         # Progress tracking
├── qa_report.md               # QA Reviewer output
├── QA_FIX_REQUEST.md          # QA Fixer input
│
└── graphiti/                  # Knowledge graph
    └── session_*.json         # Session insights
```

---

## 4. Sistema de Planos Executáveis

### 4.1 Implementation Plan Structure

```json
{
  "spec_id": "001-feature-auth",
  "workflow_type": "feature",
  "status": "in_progress",
  "created_at": "2026-01-28T10:00:00Z",
  "updated_at": "2026-01-28T12:30:00Z",

  "phases": [
    {
      "id": "phase_1",
      "name": "Backend",
      "status": "completed",
      "subtasks": [
        {
          "id": "1.1",
          "description": "Create User model and migration",
          "service": "api",
          "files": ["src/api/models/user.model.ts", "src/api/migrations/001_create_users.ts"],
          "patterns_to_follow": ["src/api/models/product.model.ts"],
          "verification": {
            "type": "command",
            "command": "npm run migrate && npm test -- --grep User"
          },
          "risk_level": "medium",
          "status": "completed",
          "completed_at": "2026-01-28T11:00:00Z",
          "commit_hash": "abc123"
        },
        {
          "id": "1.2",
          "description": "Create auth endpoints",
          "service": "api",
          "files": ["src/api/controllers/auth.controller.ts", "src/api/services/auth.service.ts"],
          "patterns_to_follow": ["src/api/controllers/product.controller.ts"],
          "verification": {
            "type": "api",
            "endpoint": "POST /api/auth/register",
            "expected_status": 201
          },
          "risk_level": "high",
          "status": "completed",
          "completed_at": "2026-01-28T11:30:00Z",
          "commit_hash": "def456"
        }
      ]
    },
    {
      "id": "phase_2",
      "name": "Frontend",
      "depends_on": ["phase_1"],
      "status": "in_progress",
      "subtasks": [
        {
          "id": "2.1",
          "description": "Create login form component",
          "service": "web",
          "files": ["src/web/components/LoginForm.tsx"],
          "patterns_to_follow": ["src/web/components/ContactForm.tsx"],
          "verification": {
            "type": "browser",
            "url": "/login",
            "check": "form visible and interactive"
          },
          "risk_level": "low",
          "status": "in_progress"
        }
      ]
    }
  ],

  "parallelism": {
    "max_workers_needed": 2,
    "parallel_phases": []
  },

  "qa_signoff": {
    "status": "pending",
    "reviewer": null,
    "approved_at": null
  }
}
```

### 4.2 Project Index Structure

```json
{
  "project_name": "my-app",
  "root_directory": "/Users/dev/my-app",

  "services": [
    {
      "name": "api",
      "type": "backend",
      "framework": "NestJS",
      "language": "TypeScript",
      "entry_point": "src/main.ts",
      "port": 3000,
      "start_command": "npm run start:dev",
      "test_command": "npm test"
    },
    {
      "name": "web",
      "type": "frontend",
      "framework": "Next.js",
      "language": "TypeScript",
      "entry_point": "src/pages/_app.tsx",
      "port": 3001,
      "start_command": "npm run dev",
      "test_command": "npm run test"
    }
  ],

  "tech_stack": {
    "database": "PostgreSQL",
    "orm": "Prisma",
    "auth": "JWT",
    "state_management": "React Query + Zustand",
    "styling": "Tailwind CSS"
  },

  "commands": {
    "install": "npm install",
    "dev": "npm run dev",
    "build": "npm run build",
    "test": "npm test",
    "lint": "npm run lint",
    "migrate": "npx prisma migrate dev"
  },

  "environment_variables": ["DATABASE_URL", "JWT_SECRET", "API_URL"]
}
```

### 4.3 Context Structure

```json
{
  "spec_id": "001-feature-auth",

  "files_to_modify": [
    {
      "path": "src/api/controllers/auth.controller.ts",
      "action": "create",
      "purpose": "Auth endpoints"
    },
    {
      "path": "src/api/services/auth.service.ts",
      "action": "create",
      "purpose": "Auth business logic"
    },
    {
      "path": "src/web/pages/login.tsx",
      "action": "create",
      "purpose": "Login page"
    }
  ],

  "files_to_reference": [
    {
      "path": "src/api/controllers/product.controller.ts",
      "pattern": "Controller structure with decorators"
    },
    {
      "path": "src/api/services/product.service.ts",
      "pattern": "Service with repository injection"
    },
    {
      "path": "src/web/pages/products.tsx",
      "pattern": "Page with React Query data fetching"
    }
  ],

  "patterns_observed": [
    {
      "name": "Repository Pattern",
      "description": "All data access through repository classes",
      "example": "src/api/repositories/product.repository.ts"
    },
    {
      "name": "React Query Hooks",
      "description": "Custom hooks wrapping React Query",
      "example": "src/web/hooks/useProducts.ts"
    }
  ],

  "existing_implementations": [
    {
      "feature": "Product CRUD",
      "location": "src/api/controllers/product.controller.ts",
      "relevance": "Similar endpoint structure needed"
    }
  ]
}
```

### 4.4 Verification Types

```yaml
Verification Types:
  command:
    description: Run a shell command and check exit code
    example:
      type: 'command'
      command: "npm test -- --grep 'Auth'"
      expected_exit_code: 0

  api:
    description: Make HTTP request and validate response
    example:
      type: 'api'
      method: 'POST'
      endpoint: '/api/auth/register'
      body: { 'email': 'test@test.com', 'password': 'test123' }
      expected_status: 201

  browser:
    description: Visual/interaction check in browser
    example:
      type: 'browser'
      url: '/login'
      checks:
        - 'form is visible'
        - 'submit button is clickable'
        - 'no console errors'

  e2e:
    description: End-to-end test execution
    example:
      type: 'e2e'
      test_file: 'tests/e2e/auth.spec.ts'
      expected_pass: true

  database:
    description: Verify database state
    example:
      type: 'database'
      query: 'SELECT COUNT(*) FROM users'
      expected: '> 0'
```

---

## 5. Worktree Isolation

### 5.1 Conceito

Todo trabalho acontece em **git worktrees isolados**, protegendo a branch principal.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WORKTREE ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  main branch (protected)                                            │
│  │                                                                  │
│  ├── .auto-claude/                                                  │
│  │   └── worktrees/                                                 │
│  │       └── tasks/                                                 │
│  │           ├── 001-feature-auth/    ← Worktree isolado           │
│  │           │   └── (cópia completa do projeto)                   │
│  │           │                                                      │
│  │           ├── 002-fix-bug-123/     ← Outro worktree             │
│  │           │   └── (cópia completa do projeto)                   │
│  │           │                                                      │
│  │           └── 003-refactor-api/    ← Outro worktree             │
│  │               └── (cópia completa do projeto)                   │
│  │                                                                  │
│  └── specs/                                                         │
│      └── (spec files - não commitados)                              │
│                                                                     │
│  Branches:                                                          │
│  ├── main                                                           │
│  ├── auto-claude/001-feature-auth                                   │
│  ├── auto-claude/002-fix-bug-123                                    │
│  └── auto-claude/003-refactor-api                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Regras de Isolamento

```yaml
Mapping 1:1:1:
  spec → worktree → branch

  Exemplo:
    spec: 001-feature-auth
    worktree: .auto-claude/worktrees/tasks/001-feature-auth/
    branch: auto-claude/001-feature-auth

Branch Naming:
  pattern: "auto-claude/{spec-name}"

Remote Policy:
  - Branches permanecem locais até push explícito
  - Usuário decide quando sincronizar
  - Nenhuma sincronização automática
```

### 5.3 WorktreeManager API

```python
class WorktreeManager:
    """Gerenciador de worktrees per-spec"""

    def __init__(self, project_root: str):
        self.root = project_root
        self.worktrees_dir = ".auto-claude/worktrees/tasks"

    # === Lifecycle ===

    def create(self, spec_name: str) -> WorktreeInfo:
        """Cria worktree isolado para spec"""
        branch = f"auto-claude/{spec_name}"
        path = f"{self.worktrees_dir}/{spec_name}"
        # git worktree add {path} -b {branch}
        return WorktreeInfo(path=path, branch=branch)

    def remove(self, spec_name: str) -> bool:
        """Remove worktree e branch"""
        # git worktree remove {path}
        # git branch -d {branch}
        pass

    # === Merge Operations ===

    def merge_to_base(
        self,
        spec_name: str,
        staged: bool = True
    ) -> MergeResult:
        """
        Merge worktree branch para base.

        staged=True: merge --no-commit (permite review)
        staged=False: merge completo
        """
        pass

    def detect_conflicts(self, spec_name: str) -> List[str]:
        """Detecta conflitos potenciais antes do merge"""
        pass

    # === Remote Operations ===

    def push_branch(
        self,
        spec_name: str,
        retry: bool = True
    ) -> PushResult:
        """
        Push branch com retry logic.

        Exponential backoff: 2^(attempt-1) seconds
        Retryable: connection timeout, HTTP 5xx
        Non-retryable: auth failure, 404
        """
        pass

    def create_pr(
        self,
        spec_name: str,
        title: str,
        body: str
    ) -> PRResult:
        """Cria PR via gh CLI"""
        pass

    def push_and_create_pr(self, spec_name: str) -> CombinedResult:
        """Operação combinada: push + create PR"""
        pass

    # === Cleanup & Monitoring ===

    def find_stale(self, days: int = 30) -> List[WorktreeInfo]:
        """Identifica worktrees inativos > N dias"""
        pass

    def cleanup_stale(self, days: int = 30) -> int:
        """Remove worktrees antigos"""
        pass

    def get_stats(self, spec_name: str) -> WorktreeStats:
        """
        Estatísticas do worktree:
        - commits count
        - files changed
        - last activity date
        """
        pass

    def list_all(self) -> List[WorktreeInfo]:
        """Lista todos os worktrees ativos"""
        pass

    def print_summary(self) -> None:
        """Imprime resumo agrupado por idade de atividade"""
        pass
```

### 5.4 Benefícios

| Benefício                 | Descrição                        |
| ------------------------- | -------------------------------- |
| **Rollback Instantâneo**  | Deletar worktree = desfazer tudo |
| **Experimentação Segura** | main nunca é afetada             |
| **Trabalho Paralelo**     | Múltiplas specs simultaneamente  |
| **Review Facilitado**     | Merge staged permite inspeção    |
| **Cleanup Automático**    | Worktrees antigos são removidos  |

---

## 6. Sistema de Recovery

### 6.1 Conceito

O sistema rastreia tentativas de implementação para evitar **loops circulares** e permitir **rollback inteligente**.

### 6.2 Arquivos de Recovery

```
.auto-claude/specs/001-feature-auth/
├── attempt_history.json    # Histórico de tentativas
├── current_approach.txt    # Estratégia atual
└── build_commits.json      # Commits por subtask
```

### 6.3 Attempt History Structure

```json
{
  "subtask_1.1": {
    "attempts": [
      {
        "attempt_number": 1,
        "timestamp": "2026-01-28T10:00:00Z",
        "approach": "Tried using bcrypt directly for password hashing",
        "success": false,
        "error": "bcrypt native module failed to compile on M1 Mac",
        "files_modified": ["src/api/services/auth.service.ts"],
        "duration_minutes": 15
      },
      {
        "attempt_number": 2,
        "timestamp": "2026-01-28T10:20:00Z",
        "approach": "Switched to bcryptjs (pure JS implementation)",
        "success": true,
        "error": null,
        "files_modified": ["src/api/services/auth.service.ts", "package.json"],
        "duration_minutes": 10,
        "commit_hash": "abc123"
      }
    ],
    "status": "completed",
    "total_attempts": 2
  },
  "subtask_1.2": {
    "attempts": [
      {
        "attempt_number": 1,
        "timestamp": "2026-01-28T10:35:00Z",
        "approach": "Using passport-jwt strategy",
        "success": false,
        "error": "Type mismatch between passport types and NestJS",
        "files_modified": ["src/api/auth/jwt.strategy.ts"],
        "duration_minutes": 20
      },
      {
        "attempt_number": 2,
        "timestamp": "2026-01-28T11:00:00Z",
        "approach": "Using @nestjs/jwt native module instead",
        "success": false,
        "error": "Missing JwtModule.register() in imports",
        "files_modified": ["src/api/auth/jwt.strategy.ts", "src/api/app.module.ts"],
        "duration_minutes": 15
      },
      {
        "attempt_number": 3,
        "timestamp": "2026-01-28T11:20:00Z",
        "approach": "Added JwtModule.register() with proper config",
        "success": true,
        "error": null,
        "files_modified": ["src/api/auth/jwt.strategy.ts", "src/api/app.module.ts"],
        "duration_minutes": 10,
        "commit_hash": "def456"
      }
    ],
    "status": "completed",
    "total_attempts": 3
  }
}
```

### 6.4 Current Approach

```markdown
# Current Approach for Subtask 2.1

Using React Hook Form with Zod validation for the login form,
following the pattern established in src/web/components/ContactForm.tsx.

Key decisions:

- Form state managed by useForm hook
- Validation schema defined with Zod
- Error display using FormMessage component from shadcn/ui
- Submit handler calls useLogin mutation from React Query

Files being modified:

- src/web/components/LoginForm.tsx (creating)
- src/web/hooks/useAuth.ts (creating)
```

### 6.5 Build Commits

```json
{
  "subtask_1.1": {
    "commit_hash": "abc123",
    "message": "feat(auth): add User model and migration",
    "timestamp": "2026-01-28T11:00:00Z"
  },
  "subtask_1.2": {
    "commit_hash": "def456",
    "message": "feat(auth): add JWT authentication strategy",
    "timestamp": "2026-01-28T11:30:00Z"
  },
  "subtask_2.1": null
}
```

### 6.6 Recovery Rules

```yaml
Stuck Detection:
  conditions:
    - 3+ different approaches all failed
    - Same approach repeated (circular detection)
    - Requirements appear infeasible
    - External blockers exist (missing dependencies)

  action: Mark subtask as "stuck", escalate to user

Circular Detection:
  trigger: Current approach matches previous failed approach
  action: Block execution, require different approach

Rollback Reference:
  - Last good commit stored per subtask
  - Enables targeted rollback without losing other work

Recovery Workflow: 1. Check attempt_history.json for previous tries
  2. Read what approaches failed and why
  3. MUST try DIFFERENT approach
  4. Document current approach BEFORE coding
  5. Execute and record outcome
```

---

## 7. Quality Assurance Pipeline

### 7.1 QA Loop Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      QA FEEDBACK LOOP                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────┐                              │
│                    │   Coder Agent   │                              │
│                    │  (implements)   │                              │
│                    └────────┬────────┘                              │
│                             │                                       │
│                             ▼                                       │
│                    ┌─────────────────┐                              │
│               ┌───▶│  QA Reviewer    │                              │
│               │    │  (10 phases)    │                              │
│               │    └────────┬────────┘                              │
│               │             │                                       │
│               │             ▼                                       │
│               │    ┌─────────────────┐                              │
│               │    │   Approved?     │                              │
│               │    └────────┬────────┘                              │
│               │             │                                       │
│               │     ┌───────┴───────┐                               │
│               │     │               │                               │
│               │    YES              NO                              │
│               │     │               │                               │
│               │     ▼               ▼                               │
│               │  ┌──────┐    ┌─────────────────┐                    │
│               │  │ DONE │    │  QA Fixer       │                    │
│               │  └──────┘    │  (8 phases)     │                    │
│               │              └────────┬────────┘                    │
│               │                       │                             │
│               └───────────────────────┘                             │
│                                                                     │
│              Max 5 iterations before escalation                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 QA Report Structure

```markdown
# QA Report: 001-feature-auth

## Summary

- **Status:** REJECTED
- **Date:** 2026-01-28T14:00:00Z
- **Reviewer:** QA Agent
- **Build Progress:** 80% (4/5 subtasks verified)

## Test Results

### Unit Tests

- **Status:** PASS
- **Coverage:** 85%
- **Details:** All 24 unit tests passing

### Integration Tests

- **Status:** FAIL
- **Details:** 2 failures
  - `auth.integration.spec.ts:45` - Token refresh not working
  - `auth.integration.spec.ts:78` - Session invalidation missing

### E2E Tests

- **Status:** PASS
- **Details:** All 8 E2E tests passing

### Browser Verification

- **Status:** FAIL
- **Details:**
  - Console error on /login page: "Cannot read property 'email' of undefined"
  - Form submit button disabled incorrectly

## Issues Found

### Critical (Must Fix)

1. **Token refresh endpoint returns 500**
   - Location: `src/api/controllers/auth.controller.ts:89`
   - Problem: Missing null check on refreshToken
   - Fix Required: Add validation before processing

### Major (Should Fix)

2. **Console error on login page**
   - Location: `src/web/components/LoginForm.tsx:23`
   - Problem: Accessing user.email before user is loaded
   - Fix Required: Add optional chaining or loading state

### Minor (Nice to Have)

3. **Missing loading indicator**
   - Location: `src/web/components/LoginForm.tsx`
   - Problem: No feedback during form submission
   - Suggestion: Add isLoading state to button

## Regression Check

- **Status:** PASS
- **Details:** No regressions detected in existing functionality

## Security Check

- **Status:** PASS
- **Details:** No hardcoded secrets, proper input validation

## Recommendation

**REJECT** - Fix Critical and Major issues before re-review
```

### 7.3 QA Fix Request Structure

````markdown
# QA Fix Request: 001-feature-auth

## Overview

- **QA Report Date:** 2026-01-28T14:00:00Z
- **Issues to Fix:** 2 (1 Critical, 1 Major)
- **Iteration:** 1 of 5

## Issues to Address

### Issue 1: Token refresh endpoint returns 500 [CRITICAL]

- **Location:** `src/api/controllers/auth.controller.ts:89`
- **Problem:** Missing null check on refreshToken parameter
- **Expected Behavior:** Return 400 Bad Request if refreshToken is missing
- **Verification:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/refresh \
    -H "Content-Type: application/json" \
    -d '{}'
  # Should return 400, not 500
  ```
````

### Issue 2: Console error on login page [MAJOR]

- **Location:** `src/web/components/LoginForm.tsx:23`
- **Problem:** Accessing `user.email` before user object exists
- **Expected Behavior:** No console errors on page load
- **Verification:**
  1. Open http://localhost:3001/login
  2. Open browser DevTools Console
  3. Should see no errors

## Constraints

- Fix ONLY the issues listed above
- Do NOT refactor or add features
- Do NOT change unrelated code
- Run full test suite after fixes

## Re-validation

After fixes, QA Reviewer will:

1. Re-run failed tests
2. Verify browser console
3. Check for regressions

```

---

## 8. Memory Layer (Graphiti)

### 8.1 Arquitetura

```

┌─────────────────────────────────────────────────────────────────────┐
│ GRAPHITI MEMORY SYSTEM │
├─────────────────────────────────────────────────────────────────────┤
│ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Knowledge Graph │ │
│ │ │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │ │
│ │ │ Session │───▶│ Pattern │───▶│ Project │ │ │
│ │ │ Insight │ │ Node │ │ Node │ │ │
│ │ └─────────┘ └─────────┘ └─────────┘ │ │
│ │ │ │ │ │ │
│ │ ▼ ▼ ▼ │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │ │
│ │ │ Gotcha │ │ File │ │ Service │ │ │
│ │ │ Node │ │ Node │ │ Node │ │ │
│ │ └─────────┘ └─────────┘ └─────────┘ │ │
│ │ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Providers │ │
│ │ │ │
│ │ ┌───────────┐ ┌───────────┐ ┌───────────┐ │ │
│ │ │ Anthropic │ │ OpenAI │ │ Ollama │ │ │
│ │ └───────────┘ └───────────┘ └───────────┘ │ │
│ │ │ │
│ │ ┌───────────┐ ┌───────────┐ │ │
│ │ │ Azure │ │ Google AI │ │ │
│ │ └───────────┘ └───────────┘ │ │
│ │ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
│ Features: │
│ • Semantic search across sessions │
│ • Graph-based knowledge storage │
│ • Multi-provider embedding support │
│ • Embedding migration tools │
│ │
└─────────────────────────────────────────────────────────────────────┘

```

### 8.2 Arquivos de Memória

```

.auto-claude/specs/001-feature-auth/graphiti/
│
├── session_001.json # Insights da sessão 1
├── session_002.json # Insights da sessão 2
└── ...

# Arquivos globais do projeto

.auto-claude/
├── codebase_map.json # Mapa estrutural do projeto
├── patterns.md # Patterns descobertos
└── gotchas.md # Armadilhas conhecidas

````

### 8.3 Session Insight Structure

```json
{
  "session_id": "session_001",
  "spec_id": "001-feature-auth",
  "timestamp": "2026-01-28T12:00:00Z",
  "duration_minutes": 45,

  "discoveries": [
    "API uses rate limiting of 100 req/min via express-rate-limit",
    "Database connection pooling is configured for max 20 connections",
    "JWT tokens are stored in httpOnly cookies, not localStorage"
  ],

  "patterns_learned": [
    {
      "name": "Auth Middleware Pattern",
      "description": "All protected routes use @UseGuards(JwtAuthGuard)",
      "example": "src/api/controllers/user.controller.ts:15",
      "applicable_to": ["api"]
    },
    {
      "name": "Form Validation Pattern",
      "description": "Forms use react-hook-form with Zod schemas",
      "example": "src/web/components/ContactForm.tsx",
      "applicable_to": ["web"]
    }
  ],

  "gotchas_found": [
    {
      "description": "Don't use fetch directly, use apiClient wrapper",
      "reason": "apiClient handles token refresh and error formatting",
      "example": "src/web/lib/api-client.ts"
    },
    {
      "description": "Database migrations need explicit down() method",
      "reason": "Rollback fails silently without down()",
      "example": "src/api/migrations/001_create_users.ts"
    }
  ],

  "files_modified": [
    "src/api/controllers/auth.controller.ts",
    "src/api/services/auth.service.ts",
    "src/web/components/LoginForm.tsx"
  ],

  "decisions_made": [
    {
      "decision": "Use bcryptjs instead of bcrypt",
      "reason": "Native bcrypt fails to compile on M1 Macs",
      "alternatives_considered": ["bcrypt", "argon2"]
    }
  ],

  "external_docs_referenced": [
    {
      "library": "@nestjs/jwt",
      "url": "https://docs.nestjs.com/security/authentication",
      "relevant_sections": ["JWT functionality", "Guards"]
    }
  ]
}
````

### 8.4 Codebase Map Structure

```json
{
  "project_name": "my-app",
  "generated_at": "2026-01-28T10:00:00Z",
  "last_updated": "2026-01-28T14:00:00Z",

  "services": [
    {
      "name": "api",
      "type": "backend",
      "framework": "NestJS",
      "language": "TypeScript",
      "directories": {
        "controllers": "src/api/controllers/",
        "services": "src/api/services/",
        "models": "src/api/models/",
        "migrations": "src/api/migrations/",
        "guards": "src/api/guards/",
        "decorators": "src/api/decorators/"
      }
    },
    {
      "name": "web",
      "type": "frontend",
      "framework": "Next.js",
      "language": "TypeScript",
      "directories": {
        "pages": "src/web/pages/",
        "components": "src/web/components/",
        "hooks": "src/web/hooks/",
        "lib": "src/web/lib/",
        "styles": "src/web/styles/"
      }
    }
  ],

  "patterns": [
    {
      "name": "Repository Pattern",
      "description": "All data access through repository classes",
      "location": "src/api/repositories/",
      "example": "src/api/repositories/user.repository.ts",
      "usage": "Inject via constructor, call methods for CRUD"
    },
    {
      "name": "React Query Hooks",
      "description": "Custom hooks wrapping React Query for data fetching",
      "location": "src/web/hooks/",
      "example": "src/web/hooks/useUsers.ts",
      "usage": "const { data, isLoading } = useUsers()"
    },
    {
      "name": "Zod Validation",
      "description": "All API inputs validated with Zod schemas",
      "location": "src/api/schemas/",
      "example": "src/api/schemas/user.schema.ts",
      "usage": "Pipe schema to controller method"
    }
  ],

  "conventions": {
    "naming": {
      "files": "kebab-case",
      "classes": "PascalCase",
      "functions": "camelCase",
      "constants": "SCREAMING_SNAKE_CASE"
    },
    "imports": {
      "order": ["react", "next", "external", "internal", "relative"],
      "aliases": {
        "@/": "src/",
        "@components/": "src/web/components/",
        "@hooks/": "src/web/hooks/"
      }
    }
  },

  "dependencies": {
    "critical": [
      { "name": "prisma", "version": "5.x", "purpose": "ORM" },
      { "name": "@nestjs/jwt", "version": "10.x", "purpose": "Auth" },
      { "name": "react-query", "version": "5.x", "purpose": "Data fetching" }
    ]
  }
}
```

### 8.5 Patterns.md Example

````markdown
# Discovered Patterns

## API Patterns

### Controller Structure

All controllers follow this pattern:

```typescript
@Controller('resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateResourceDto) {
    return this.service.create(dto);
  }
}
```
````

### Service with Repository

Services always inject repositories:

```typescript
@Injectable()
export class ResourceService {
  constructor(private readonly repo: ResourceRepository) {}
}
```

### Error Handling

All errors use custom exceptions:

```typescript
throw new NotFoundException(`Resource ${id} not found`);
throw new BadRequestException('Invalid input');
```

## Frontend Patterns

### Data Fetching

Always use React Query hooks:

```typescript
// hooks/useResources.ts
export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => apiClient.get('/resources'),
  });
}

// Usage in component
const { data, isLoading, error } = useResources();
```

### Form Handling

Forms use react-hook-form with Zod:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### State Management

- Server state: React Query
- Client state: Zustand
- Form state: react-hook-form

````

### 8.6 Gotchas.md Example

```markdown
# Known Gotchas

## API

### Don't use raw SQL
❌ Wrong:
```typescript
await prisma.$queryRaw`SELECT * FROM users WHERE id = ${id}`;
````

✅ Right:

```typescript
await prisma.user.findUnique({ where: { id } });
```

**Reason:** Raw SQL bypasses Prisma's type safety and query optimization.

### Always add down() to migrations

❌ Wrong:

```typescript
export async function up(prisma) {
  await prisma.$executeRaw`CREATE TABLE users (...)`;
}
// Missing down()
```

✅ Right:

```typescript
export async function up(prisma) {
  await prisma.$executeRaw`CREATE TABLE users (...)`;
}

export async function down(prisma) {
  await prisma.$executeRaw`DROP TABLE users`;
}
```

**Reason:** Rollback fails silently without down().

## Frontend

### Don't use fetch directly

❌ Wrong:

```typescript
const data = await fetch('/api/users').then((r) => r.json());
```

✅ Right:

```typescript
const data = await apiClient.get('/users');
```

**Reason:** apiClient handles token refresh, error formatting, and base URL.

### Check for undefined before accessing nested properties

❌ Wrong:

```typescript
<p>{user.profile.name}</p>
```

✅ Right:

```typescript
<p>{user?.profile?.name}</p>
```

**Reason:** Data may not be loaded yet, causing runtime errors.

## Database

### Connection pool limit

The database is configured for max 20 connections. Long-running operations should use transactions to avoid exhausting the pool.

### Rate limiting

API has rate limiting of 100 req/min. Tests that make many requests should add delays or use mocking.

```

---

## 9. Sistema de Segurança

### 9.1 Arquitetura de 3 Camadas

```

┌─────────────────────────────────────────────────────────────────────┐
│ SECURITY ARCHITECTURE │
├─────────────────────────────────────────────────────────────────────┤
│ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Layer 1: OS Sandbox │ │
│ │ │ │
│ │ • Bash command isolation at OS level │ │
│ │ • Process sandboxing │ │
│ │ • Resource limits │ │
│ │ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Layer 2: Filesystem Permissions │ │
│ │ │ │
│ │ • Operations restricted to project directory │ │
│ │ • No access to system files │ │
│ │ • No access to other projects │ │
│ │ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Layer 3: Command Allowlist │ │
│ │ │ │
│ │ • Dynamic allowlist based on detected tech stack │ │
│ │ • Project-specific permissions │ │
│ │ • Cached in .auto-claude-security.json (5 min TTL) │ │
│ │ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
└─────────────────────────────────────────────────────────────────────┘

```

### 9.2 Validators (16 Componentes)

```

apps/backend/security/
│
├── **init**.py # Inicialização do módulo
├── constants.py # Constantes de segurança
├── main.py # Ponto de entrada
├── parser.py # Parser de configurações
├── profile.py # Perfis de segurança
├── hooks.py # Pre/post hooks
│
├── validator.py # Core de validação
├── validator_registry.py # Registro centralizado
├── validation_models.py # Modelos de validação
│
├── shell_validators.py # Validação de comandos shell
├── filesystem_validators.py # Validação de acessos a arquivos
├── git_validators.py # Validação de operações Git
├── database_validators.py # Validação de queries SQL
├── process_validators.py # Validação de processos
├── tool_input_validator.py # Validação de inputs de tools
│
└── scan_secrets.py # Detecção de credenciais

````

### 9.3 Validação de Comandos Shell

```python
# Conceito do shell_validators.py

BLOCKED_COMMANDS = [
    "rm -rf /",
    "sudo",
    "chmod 777",
    "curl | bash",
    "wget -O - | sh",
    # ...
]

ALLOWED_BY_STACK = {
    "node": ["npm", "npx", "yarn", "pnpm", "node"],
    "python": ["pip", "python", "pytest", "poetry"],
    "docker": ["docker", "docker-compose"],
    "git": ["git"],
    # ...
}

def validate_shell_command(command: str, project_stack: List[str]) -> ValidationResult:
    """
    Valida comando shell contra allowlist dinâmico.

    1. Check blocked commands
    2. Check if command is in stack-specific allowlist
    3. Check for dangerous patterns
    4. Return validation result
    """
    pass
````

### 9.4 Secret Scanner

```python
# Conceito do scan_secrets.py

SECRET_PATTERNS = [
    r"(?i)(api[_-]?key|apikey)\s*[:=]\s*['\"][^'\"]{20,}['\"]",
    r"(?i)(secret|password|passwd|pwd)\s*[:=]\s*['\"][^'\"]+['\"]",
    r"(?i)bearer\s+[a-zA-Z0-9\-_.~+/]+=*",
    r"-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----",
    r"(?i)aws[_-]?access[_-]?key[_-]?id\s*[:=]\s*['\"]?[A-Z0-9]{20}",
    r"(?i)aws[_-]?secret[_-]?access[_-]?key\s*[:=]\s*['\"]?[A-Za-z0-9/+=]{40}",
    # ...
]

def scan_for_secrets(content: str) -> List[SecretFinding]:
    """
    Escaneia conteúdo em busca de segredos.

    Retorna lista de findings com:
    - Tipo do segredo
    - Linha onde foi encontrado
    - Trecho (ofuscado) para referência
    """
    pass

def block_commit_with_secrets(files: List[str]) -> CommitBlockResult:
    """
    Bloqueia commit se algum arquivo contiver segredos.

    Usado como pre-commit hook.
    """
    pass
```

### 9.5 MCP Server Validation

```python
# Validação de MCP servers customizados

BLOCKED_MCP_PATTERNS = [
    # Shell commands
    "bash", "sh", "cmd", "powershell",
    # Eval flags
    "-e", "-c", "--eval",
    # Path traversal
    "../", "..\\",
]

def validate_custom_mcp_server(config: MCPConfig) -> ValidationResult:
    """
    Rejeita configurações MCP perigosas.

    Bloqueia:
    - Comandos shell diretos
    - Flags de execução de código
    - Path traversal
    """
    pass
```

### 9.6 Security Profile Cache

```json
// .auto-claude-security.json
{
  "project_path": "/Users/dev/my-app",
  "generated_at": "2026-01-28T10:00:00Z",
  "ttl_minutes": 5,

  "detected_stack": ["node", "typescript", "react", "postgres"],

  "allowed_commands": [
    "npm",
    "npx",
    "node",
    "tsc",
    "git",
    "gh",
    "psql",
    "docker",
    "docker-compose"
  ],

  "blocked_paths": ["/etc/", "/usr/", "~/.ssh/", "~/.aws/"],

  "mcp_servers_allowed": ["context7", "puppeteer"]
}
```

---

## 10. Ideation System

### 10.1 Visão Geral

Sistema de 6 prompts especializados para descoberta de melhorias baseadas em análise de código.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     IDEATION SYSTEM                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │    Code     │  │    Code     │  │   Docs      │                │
│  │ Improvements│  │   Quality   │  │             │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │ Performance │  │  Security   │  │   UI/UX     │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                     │
│  Output: {type}_ideas.json com 3-7 ideias concretas                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 Prompts Disponíveis

| Prompt                          | Foco                             | Output                         |
| ------------------------------- | -------------------------------- | ------------------------------ |
| `ideation_code_improvements.md` | Pattern extensions, architecture | `code_improvements_ideas.json` |
| `ideation_code_quality.md`      | Clean code, maintainability      | `code_quality_ideas.json`      |
| `ideation_documentation.md`     | Missing docs, outdated content   | `documentation_ideas.json`     |
| `ideation_performance.md`       | Bottlenecks, optimization        | `performance_ideas.json`       |
| `ideation_security.md`          | Vulnerabilities, hardening       | `security_ideas.json`          |
| `ideation_ui_ux.md`             | User experience improvements     | `ui_ux_ideas.json`             |

### 10.3 Effort Spectrum

```yaml
Effort Levels:
  trivial:
    time: '1-2 hours'
    description: 'Direct copy with minor changes'
    example: 'Add similar validation to another form'

  small:
    time: 'half day'
    description: 'Clear pattern to follow'
    example: 'Create new hook following existing pattern'

  medium:
    time: '1-3 days'
    description: 'Pattern exists but needs adaptation'
    example: 'Extend authentication to support OAuth'

  large:
    time: '3-7 days'
    description: 'Architectural pattern enables capability'
    example: 'Add caching layer using existing infrastructure'

  complex:
    time: '1-2 weeks'
    description: 'Foundation supports major addition'
    example: 'Implement real-time notifications system'
```

### 10.4 Ideation Output Structure

```json
{
  "type": "code_improvements",
  "generated_at": "2026-01-28T10:00:00Z",
  "project": "my-app",

  "ideas": [
    {
      "id": "idea_001",
      "title": "Add optimistic updates to mutations",
      "description": "Implement optimistic updates for better UX on form submissions",
      "effort": "small",
      "category": "pattern_extension",

      "existing_pattern": {
        "location": "src/web/hooks/useUpdateUser.ts",
        "description": "Current mutation without optimistic update"
      },

      "implementation_approach": [
        "Add onMutate callback to invalidate and update cache",
        "Add onError callback to rollback",
        "Add onSettled to refetch"
      ],

      "files_affected": ["src/web/hooks/useUpdateUser.ts", "src/web/hooks/useCreatePost.ts"],

      "benefits": [
        "Instant UI feedback",
        "Better perceived performance",
        "Follows React Query best practices"
      ],

      "risks": ["Need to handle rollback on error", "Cache invalidation complexity"]
    },
    {
      "id": "idea_002",
      "title": "Extract common form validation schemas",
      "description": "Create shared Zod schemas for common field validations",
      "effort": "trivial",
      "category": "code_quality",

      "existing_pattern": {
        "location": "src/web/components/ContactForm.tsx",
        "description": "Inline email validation schema"
      },

      "implementation_approach": [
        "Create src/web/lib/validations.ts",
        "Extract email, phone, password schemas",
        "Update existing forms to use shared schemas"
      ],

      "files_affected": [
        "src/web/lib/validations.ts (new)",
        "src/web/components/ContactForm.tsx",
        "src/web/components/RegisterForm.tsx"
      ],

      "benefits": ["DRY validation logic", "Consistent error messages", "Easier maintenance"],

      "risks": []
    }
  ],

  "excluded_ideas": [
    {
      "title": "Add WebSocket support",
      "reason": "Requires new infrastructure not present in codebase"
    },
    {
      "title": "Implement ML-based recommendations",
      "reason": "Strategic product decision, not code-revealed"
    }
  ]
}
```

### 10.5 Regras Críticas

```yaml
Rules:

  DO:
    - Only suggest ideas where patterns EXIST in code
    - Be specific about affected files
    - Reference REAL patterns with file paths
    - Justify effort estimates with implementation approach
    - Focus on code-revealed opportunities

  DON'T:
    - Suggest features requiring new infrastructure
    - Make strategic product decisions
    - Duplicate items already in roadmap
    - Suggest vague improvements without specifics
    - Invent patterns that don't exist

Bad Suggestions (Examples):
  - "Add WebSocket support" → Requires new infrastructure
  - "Implement i18n" → Major feature, not code-revealed
  - "Add ML recommendations" → Strategic decision
  - "Improve performance" → Too vague
```

---

## 11. Análise Comparativa AIOS vs Auto-Claude

### 11.1 Tabela Comparativa Completa

| Aspecto                   | Auto-Claude                  | AIOS Atual           | Gap   | Prioridade |
| ------------------------- | ---------------------------- | -------------------- | ----- | ---------- |
| **Spec Pipeline**         | 6-8 fases estruturadas       | Stories MD informais | Alto  | 🔴         |
| **Complexity Assessment** | Automático (5 dimensões)     | Manual               | Alto  | 🔴         |
| **Worktree Isolation**    | Obrigatório por spec         | Branch tradicional   | Alto  | 🔴         |
| **Implementation Plan**   | JSON executável com subtasks | Checkboxes MD        | Alto  | 🔴         |
| **Self-Critique Steps**   | Obrigatório (5.5, 6.5)       | Inexistente          | Médio | 🟡         |
| **Recovery System**       | Tracking completo            | Inexistente          | Médio | 🟡         |
| **QA Loop**               | 10 fases + fixer automático  | Manual via @qa       | Médio | 🟡         |
| **Memory Layer**          | Graph semântico (Graphiti)   | YAML básico          | Médio | 🟡         |
| **Security Validators**   | 16 validators dinâmicos      | 2 hooks estáticos    | Baixo | 🟢         |
| **Ideation System**       | 6 prompts especializados     | Inexistente          | Baixo | 🟢         |
| **Research Phase**        | Context7 + Web Search        | Manual               | Médio | 🟡         |
| **Spec Critic**           | Automático antes de impl     | Inexistente          | Médio | 🟡         |

### 11.2 Mapeamento de Agentes

| Auto-Claude           | AIOS Atual          | Proposta                        |
| --------------------- | ------------------- | ------------------------------- |
| `complexity_assessor` | -                   | `@architect *assess-complexity` |
| `spec_gatherer`       | `@pm`               | `@pm *gather-requirements`      |
| `spec_researcher`     | -                   | `@analyst *research-deps`       |
| `spec_writer`         | `@pm *create-story` | `@pm *write-spec`               |
| `spec_critic`         | -                   | `@qa *critique-spec`            |
| `planner`             | `@architect`        | `@architect *create-plan`       |
| `coder`               | `@dev`              | `@dev *execute-plan`            |
| `qa_reviewer`         | `@qa`               | `@qa *review-build`             |
| `qa_fixer`            | `@dev`              | `@dev *fix-qa-issues`           |

### 11.3 Pontos Fortes do AIOS

| Aspecto                     | AIOS             | Auto-Claude        |
| --------------------------- | ---------------- | ------------------ |
| **Agentes com Persona**     | ✅ Completo      | ❌ Básico          |
| **Workflows Configuráveis** | ✅ YAML flexível | ❌ Hardcoded       |
| **Integração IDE**          | ✅ Multi-IDE     | ❌ Apenas Electron |
| **Checklists**              | ✅ Extensivos    | ❌ Limitados       |
| **Templates**               | ✅ Variados      | ❌ Fixos           |
| **Documentação**            | ✅ Completa      | 🟡 Básica          |

### 11.4 Oportunidades de Sinergia

```yaml
Combinar o melhor dos dois:
  AIOS Foundation:
    - Sistema de agentes com personas
    - Workflows configuráveis em YAML
    - Templates e checklists extensivos
    - Multi-IDE support

  Auto-Claude Additions:
    - Spec pipeline estruturado
    - Worktree isolation
    - Implementation plan executável
    - Self-critique steps
    - Recovery system
    - Memory layer avançado

  Result:
    - Framework completo de desenvolvimento autônomo
    - Flexibilidade do AIOS + Rigor do Auto-Claude
    - Personas + Execução estruturada
```

---

## 12. Proposta de Implementação

### 12.1 Nova Estrutura de Story

```
docs/stories/
└── STORY-042/
    ├── story.md                    # Story atual (mantém)
    │
    ├── spec/                       # NOVO: Pipeline de specs
    │   ├── requirements.json       # Output de @pm *gather
    │   ├── research.json           # Output de @analyst *research
    │   ├── complexity.json         # Output de @architect *assess
    │   ├── spec.md                 # Output de @pm *write-spec
    │   └── critique.json           # Output de @qa *critique
    │
    ├── plan/                       # NOVO: Plano executável
    │   ├── project-context.yaml    # Mapa do projeto
    │   ├── files-context.yaml      # Arquivos afetados
    │   └── implementation.yaml     # Subtasks executáveis
    │
    ├── recovery/                   # NOVO: Sistema de recovery
    │   ├── attempts.json           # Histórico de tentativas
    │   ├── current-approach.md     # Estratégia atual
    │   └── commits.json            # Commits por subtask
    │
    └── insights/                   # NOVO: Session insights
        └── session-*.json          # Descobertas por sessão
```

### 12.2 Novos Tasks

```
.aios-core/development/tasks/

# Spec Pipeline
├── spec-gather-requirements.md     # @pm: Coleta requirements.json
├── spec-research-dependencies.md   # @analyst: Valida deps → research.json
├── spec-assess-complexity.md       # @architect: Classifica → complexity.json
├── spec-write-spec.md              # @pm: Escreve spec.md completo
├── spec-critique.md                # @qa: Critica → critique.json

# Plan Pipeline
├── plan-create-context.md          # @architect: project/files context
├── plan-create-implementation.md   # @architect: implementation.yaml
├── plan-execute-subtask.md         # @dev: Executa 1 subtask

# Recovery System
├── recovery-track-attempt.md       # @dev: Registra tentativa
├── recovery-find-alternative.md    # @dev: Busca abordagem diferente
├── recovery-rollback.md            # @dev: Volta para último commit bom

# QA Pipeline
├── qa-review-build.md              # @qa: Review completo (10 fases)
├── qa-create-fix-request.md        # @qa: Cria QA_FIX_REQUEST.md
├── qa-fix-issues.md                # @dev: Corrige issues (8 fases)

# Ideation
├── ideation-code-improvements.md
├── ideation-code-quality.md
├── ideation-documentation.md
├── ideation-performance.md
├── ideation-security.md
└── ideation-ui-ux.md
```

### 12.3 Novo Workflow

```yaml
# .aios-core/development/workflows/story-execution-v2.yaml

name: Story Execution Pipeline v2
description: Pipeline completo inspirado no Auto-Claude
version: '2.0'

triggers:
  - '@aios-master *execute-story {id}'
  - '@pm *start-story {id}'

complexity_assessment:
  agent: '@architect'
  task: spec-assess-complexity
  output: docs/stories/{id}/spec/complexity.json
  classification:
    simple:
      phases: [gather, spec, plan, execute, review]
    standard:
      phases: [gather, research, spec, critique, plan, execute, review]
    complex:
      phases: [gather, research, spec, critique, plan, execute, review, insights]

phases:
  gather:
    name: 'Gather Requirements'
    agent: '@pm'
    task: spec-gather-requirements
    elicit: true
    output: docs/stories/{id}/spec/requirements.json

  research:
    name: 'Research Dependencies'
    agent: '@analyst'
    task: spec-research-dependencies
    tools: [context7, exa]
    output: docs/stories/{id}/spec/research.json
    skip_if: "complexity == 'simple'"

  spec:
    name: 'Write Specification'
    agent: '@pm'
    task: spec-write-spec
    inputs:
      - docs/stories/{id}/spec/requirements.json
      - docs/stories/{id}/spec/research.json
    output: docs/stories/{id}/spec/spec.md

  critique:
    name: 'Critique Specification'
    agent: '@qa'
    task: spec-critique
    output: docs/stories/{id}/spec/critique.json
    skip_if: "complexity == 'simple'"

  plan:
    name: 'Create Implementation Plan'
    agent: '@architect'
    tasks:
      - plan-create-context
      - plan-create-implementation
    outputs:
      - docs/stories/{id}/plan/project-context.yaml
      - docs/stories/{id}/plan/files-context.yaml
      - docs/stories/{id}/plan/implementation.yaml

  execute:
    name: 'Execute Implementation'
    agent: '@dev'
    task: plan-execute-subtask
    loop: true
    loop_until: 'all_subtasks_completed'
    with_recovery: true
    with_self_critique: true

  review:
    name: 'QA Review'
    agent: '@qa'
    task: qa-review-build
    on_success:
      - mark_story_complete
    on_failure:
      - qa-create-fix-request
      - goto: execute
    max_iterations: 5

  insights:
    name: 'Capture Insights'
    agent: '@dev'
    task: capture-session-insights
    output: docs/stories/{id}/insights/session-*.json
    skip_if: "complexity != 'complex'"

worktree:
  enabled: true
  create_on: plan
  merge_on: review.success
  cleanup_after: 30_days
```

### 12.4 Scripts de Infraestrutura

```javascript
// .aios-core/infrastructure/scripts/

// Worktree Management
├── worktree-manager.js           // Core worktree operations
├── worktree-create.js            // Create worktree for story
├── worktree-merge.js             // Merge worktree to base
├── worktree-cleanup.js           // Cleanup stale worktrees

// Plan Execution
├── plan-executor.js              // Execute implementation plan
├── plan-tracker.js               // Track subtask progress
├── subtask-verifier.js           // Run subtask verifications

// Recovery
├── recovery-tracker.js           // Track attempt history
├── recovery-analyzer.js          // Detect stuck subtasks
├── rollback-manager.js           // Manage rollbacks

// Memory
├── memory-manager.js             // Session insights management
├── codebase-mapper.js            // Generate codebase map
├── pattern-extractor.js          // Extract patterns from code

// Security (Evolution)
├── security/
│   ├── shell-validator.js
│   ├── filesystem-validator.js
│   ├── secret-scanner.js
│   └── allowlist-generator.js
```

### 12.5 Modificações em Agentes

```yaml
# Modificações necessárias nos agentes existentes

@dev:
  additions:
    - self_critique_checklist (steps 5.5, 6.5)
    - recovery_tracking
    - session_insights_capture
  new_commands:
    - "*execute-subtask"
    - "*track-attempt"
    - "*rollback"

@qa:
  additions:
    - critique_phase (pre-implementation)
    - fix_request_generation
    - 10_phase_review
  new_commands:
    - "*critique-spec"
    - "*review-build"
    - "*create-fix-request"

@architect:
  additions:
    - complexity_assessment
    - implementation_plan_creation
    - context_generation
  new_commands:
    - "*assess-complexity"
    - "*create-plan"
    - "*create-context"

@pm:
  additions:
    - requirements_gathering
    - spec_writing
  new_commands:
    - "*gather-requirements"
    - "*write-spec"

@analyst:
  additions:
    - dependency_research
    - validation_via_context7
  new_commands:
    - "*research-deps"
```

---

## 13. Roadmap Sugerido

### 13.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ROADMAP DE IMPLEMENTAÇÃO                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  FASE 1: Foundation (2-3 semanas)                                   │
│  ├── Worktree Manager                                               │
│  ├── Implementation Plan Structure                                  │
│  └── Basic Plan Executor                                            │
│                                                                     │
│  FASE 2: Spec Pipeline (2-3 semanas)                                │
│  ├── Requirements Gathering                                         │
│  ├── Complexity Assessment                                          │
│  ├── Spec Writing                                                   │
│  └── Spec Critique                                                  │
│                                                                     │
│  FASE 3: Execution (2 semanas)                                      │
│  ├── Self-Critique Steps                                            │
│  ├── Recovery System                                                │
│  └── Subtask Verification                                           │
│                                                                     │
│  FASE 4: QA Evolution (1-2 semanas)                                 │
│  ├── 10-Phase Review                                                │
│  ├── Fix Request System                                             │
│  └── QA Loop Integration                                            │
│                                                                     │
│  FASE 5: Memory & Polish (1-2 semanas)                              │
│  ├── Session Insights                                               │
│  ├── Codebase Mapping                                               │
│  └── Pattern Extraction                                             │
│                                                                     │
│  FASE 6: Advanced (Opcional)                                        │
│  ├── Security Validators                                            │
│  ├── Ideation System                                                │
│  └── Research Phase (Context7)                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 13.2 Fase 1: Foundation

```yaml
Objetivo: Estabelecer base para execução estruturada

Entregas:
  1. Worktree Manager:
     - worktree-manager.js
     - Comandos: create, merge, cleanup, list
     - Integração com @devops

  2. Implementation Plan Structure:
     - Template YAML para implementation.yaml
     - Schema de validação
     - Documentação

  3. Basic Plan Executor:
     - plan-executor.js
     - Execução sequencial de subtasks
     - Tracking básico de progresso

Critérios de Sucesso:
  - [ ] Worktree criado automaticamente ao iniciar story
  - [ ] Plano YAML carregado e validado
  - [ ] Subtasks executadas em sequência
  - [ ] Merge funcional ao finalizar

Estimativa: 2-3 semanas
```

### 13.3 Fase 2: Spec Pipeline

```yaml
Objetivo: Pipeline estruturado de especificações

Entregas:
  1. Requirements Gathering:
     - spec-gather-requirements.md task
     - requirements.json schema
     - Elicitation workflow

  2. Complexity Assessment:
     - spec-assess-complexity.md task
     - complexity.json schema
     - Classificação automática (simple/standard/complex)

  3. Spec Writing:
     - spec-write-spec.md task
     - spec.md template
     - Geração automática de seções

  4. Spec Critique:
     - spec-critique.md task
     - critique.json schema
     - Validação via Context7

Critérios de Sucesso:
  - [ ] Requirements coletados via elicitation
  - [ ] Complexidade avaliada automaticamente
  - [ ] Spec.md gerado com todas seções
  - [ ] Critique identifica issues antes de implementação

Estimativa: 2-3 semanas
```

### 13.4 Fase 3: Execution

```yaml
Objetivo: Execução robusta com self-critique e recovery

Entregas:
  1. Self-Critique Steps:
     - Modificar @dev para incluir steps 5.5 e 6.5
     - Checklist de self-critique
     - Bloqueio se checklist falhar

  2. Recovery System:
     - recovery-tracker.js
     - attempts.json schema
     - Detecção de stuck subtasks
     - Sugestão de abordagens alternativas

  3. Subtask Verification:
     - subtask-verifier.js
     - Suporte a: command, api, browser, e2e
     - Retry automático em falhas transientes

Critérios de Sucesso:
  - [ ] Self-critique executado antes de cada commit
  - [ ] Tentativas rastreadas com approaches
  - [ ] Stuck detection após 3 falhas
  - [ ] Verificações executadas por tipo

Estimativa: 2 semanas
```

### 13.5 Fase 4: QA Evolution

```yaml
Objetivo: QA automatizado com loop de correção

Entregas:
  1. 10-Phase Review:
     - qa-review-build.md com 10 fases
     - qa_report.md template
     - Categorização Critical/Major/Minor

  2. Fix Request System:
     - qa-create-fix-request.md task
     - QA_FIX_REQUEST.md template
     - Tracking de issues

  3. QA Loop Integration:
     - Loop automático review → fix → re-review
     - Max 5 iterações
     - Escalation para humano

Critérios de Sucesso:
  - [ ] Review completo em 10 fases
  - [ ] Fix request gerado automaticamente
  - [ ] Loop funcional até aprovação
  - [ ] Escalation após 5 iterações

Estimativa: 1-2 semanas
```

### 13.6 Fase 5: Memory & Polish

```yaml
Objetivo: Aprendizado persistente entre sessões

Entregas:
  1. Session Insights:
     - capture-session-insights.md task
     - session-*.json schema
     - Capture de discoveries, patterns, gotchas

  2. Codebase Mapping:
     - codebase-mapper.js
     - codebase-map.json schema
     - Atualização automática

  3. Pattern Extraction:
     - pattern-extractor.js
     - patterns.md geração
     - gotchas.md geração

Critérios de Sucesso:
  - [ ] Insights capturados ao final de cada sessão
  - [ ] Codebase map atualizado automaticamente
  - [ ] Patterns/gotchas disponíveis para agentes

Estimativa: 1-2 semanas
```

### 13.7 Fase 6: Advanced (Opcional)

```yaml
Objetivo: Features avançadas para casos específicos

Entregas:
  1. Security Validators:
     - shell-validator.js
     - secret-scanner.js
     - Allowlist dinâmico

  2. Ideation System:
     - 6 tasks de ideation
     - ideas.json schemas
     - Integração com backlog

  3. Research Phase:
     - spec-research-dependencies.md
     - Integração Context7
     - research.json schema

Critérios de Sucesso:
  - [ ] Comandos shell validados
  - [ ] Segredos detectados antes de commit
  - [ ] Ideas geradas por área
  - [ ] Research validado automaticamente

Estimativa: 2-3 semanas (opcional)
```

### 13.8 Estimativa Total

| Fase               | Duração     | Prioridade | Dependências |
| ------------------ | ----------- | ---------- | ------------ |
| 1. Foundation      | 2-3 semanas | 🔴 Crítica | -            |
| 2. Spec Pipeline   | 2-3 semanas | 🔴 Crítica | Fase 1       |
| 3. Execution       | 2 semanas   | 🟡 Alta    | Fase 1, 2    |
| 4. QA Evolution    | 1-2 semanas | 🟡 Alta    | Fase 3       |
| 5. Memory & Polish | 1-2 semanas | 🟡 Média   | Fase 3       |
| 6. Advanced        | 2-3 semanas | 🟢 Baixa   | Todas        |

**Total Estimado:** 10-15 semanas (sem Fase 6)

---

## 14. Anexos

### 14.1 Links e Referências

- **Auto-Claude Repository:** https://github.com/AndyMik90/Auto-Claude
- **Claude Code CLI:** https://www.npmjs.com/package/@anthropic-ai/claude-code
- **Context7 MCP:** Documentação de bibliotecas em tempo real
- **Graphiti:** Sistema de knowledge graph para memória

### 14.2 Glossário

| Termo             | Definição                                             |
| ----------------- | ----------------------------------------------------- |
| **Spec**          | Especificação formal de uma tarefa de desenvolvimento |
| **Worktree**      | Cópia de trabalho isolada do repositório git          |
| **Subtask**       | Unidade atômica de trabalho dentro de um plano        |
| **Self-Critique** | Auto-avaliação obrigatória antes de commit            |
| **Recovery**      | Sistema de rastreamento de tentativas e rollback      |
| **Graphiti**      | Sistema de knowledge graph para memória persistente   |

### 14.3 Decisões Arquiteturais Pendentes

1. **YAML vs JSON para planos?** - YAML recomendado (mais legível)
2. **Worktrees obrigatórios ou opcionais?** - Recomendado obrigatório
3. **Integração com Linear/ClickUp?** - Avaliar após Fase 2
4. **Multi-provider para memory?** - Iniciar com local, expandir depois

### 14.4 Riscos Identificados

| Risco                     | Probabilidade | Impacto | Mitigação                           |
| ------------------------- | ------------- | ------- | ----------------------------------- |
| Complexidade de worktrees | Média         | Alto    | POC antes de implementação completa |
| Overhead de spec pipeline | Média         | Médio   | Skip para tasks "simple"            |
| Curva de aprendizado      | Alta          | Baixo   | Documentação detalhada              |
| Integração com IDEs       | Baixa         | Médio   | Manter compatibilidade existente    |

---

## Conclusão

A análise do Auto-Claude revela um sistema maduro de desenvolvimento autônomo com foco em:

1. **Estruturação** - Specs e planos formais executáveis
2. **Isolamento** - Worktrees para segurança e experimentação
3. **Qualidade** - Self-critique e QA loops automáticos
4. **Aprendizado** - Memory layer para conhecimento persistente

A incorporação destes padrões ao AIOS transformaria o framework de um **sistema de orquestração de agentes** para um **sistema completo de desenvolvimento autônomo**, mantendo os pontos fortes existentes (personas, workflows configuráveis, multi-IDE).

**Recomendação:** Iniciar pela Fase 1 (Foundation) para validar a abordagem antes de investir nas fases seguintes.

---

_Documento gerado por Aria (Architect Agent) - AIOS Framework_
_Data: 2026-01-28_
