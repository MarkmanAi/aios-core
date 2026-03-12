# REPO PATH MAP — MarkmanAi/aios-core

## Mapa de Referência de Paths

> Gerado em: 2026-02-21
> Validado contra: repositório real (scan direto com ls/find)
> Uso: Consultar ANTES de escrever qualquer path em documentos, agents ou tasks

---

## 1. RAIZ DO REPOSITÓRIO

**Diretórios visíveis:**

| Path | Propósito |
|------|-----------|
| `apps/` | Aplicações (dashboard Next.js) |
| `bin/` | CLI executables (aios-init.js, aios.js) |
| `docs/` | Documentação, stories, architecture |
| `packages/` | Shared packages |
| `scripts/` | Utilitários e scripts de build |
| `squads/` | Expansion packs (mmos-squad, squad-creator) |
| `tests/` | Testes |

**Diretórios ocultos (camadas do sistema):**

| Path | Camada | Propósito |
|------|--------|-----------|
| `.aios-core/` | Framework | Kernel, agents core, tasks, workflows, scripts, core modules |
| `.claude/` | Integração | Agents Claude Code, hooks, skills, commands, agent-memory, rules |
| `.aios/` | Runtime | Estado, cache, feedback, gotchas, project-status |
| `.antigravity/` | Config | Configuração antigravity |
| `.cursor/` | IDE | Configuração Cursor IDE |
| `.docker/` | Docker | Configuração Docker MCP |
| `.git/` | VCS | Repositório Git |
| `.github/` | CI/CD | GitHub Actions, templates |

**Arquivos de configuração na raiz:**

| Arquivo | Propósito |
|---------|-----------|
| `package.json` | Dependências e scripts npm |
| `package-lock.json` | Lock de dependências |
| `tsconfig.json` | Configuração TypeScript |
| `eslint.config.js` | Configuração ESLint |
| `jest.config.js` | Configuração Jest |
| `.prettierrc` | Configuração Prettier |
| `.gitattributes` | Git attributes |
| `.gitignore` | Git ignore |
| `.coderabbit.yaml` | CodeRabbit config |
| `.releaserc.json` | Semantic release config |
| `.tsbuildinfo` | TypeScript build info |
| `CHANGELOG.md` | Changelog |
| `CODE_OF_CONDUCT.md` | Código de conduta |
| `CONTRIBUTING.md` | Guia de contribuição |
| `LICENSE` | Licença MIT |
| `README.md` | README principal |

---

## 2. AGENTES — Paths Canônicos

### 2.1 Core Agents (CLT)

**Path:** `.aios-core/development/agents/`

| Arquivo | Name | ID |
|---------|------|----|
| `aios-master.md` | Orion | aios-master |
| `analyst.md` | Atlas | analyst |
| `architect.md` | Aria | architect |
| `data-engineer.md` | Dara | data-engineer |
| `dev.md` | Dex | dev |
| `devops.md` | Gage | devops |
| `pm.md` | Morgan | pm |
| `po.md` | Pax | po |
| `qa.md` | Quinn | qa |
| `sm.md` | River | sm |
| `squad-creator.md` | Craft | squad-creator |
| `ux-design-expert.md` | Uma | ux-design-expert |

### 2.2 Claude Code Agents (PJ)

**Path:** `.claude/agents/`

| Arquivo | Model | permissionMode |
|---------|-------|----------------|
| `aios-analyst.md` | opus | bypassPermissions |
| `aios-architect.md` | opus | bypassPermissions |
| `aios-data-engineer.md` | opus | bypassPermissions |
| `aios-dev.md` | opus | bypassPermissions |
| `aios-devops.md` | opus | bypassPermissions |
| `aios-pm.md` | opus | bypassPermissions |
| `aios-po.md` | opus | bypassPermissions |
| `aios-qa.md` | opus | bypassPermissions |
| `aios-sm.md` | sonnet | bypassPermissions |
| `aios-ux.md` | opus | bypassPermissions |
| `copy-chief.md` | opus | bypassPermissions |
| `cyber-chief.md` | opus | bypassPermissions |
| `data-chief.md` | opus | bypassPermissions |
| `db-sage.md` | opus | bypassPermissions |
| `design-chief.md` | opus | bypassPermissions |
| `design-system.md` | opus | bypassPermissions |
| `legal-chief.md` | opus | bypassPermissions |
| `oalanicolas.md` | opus | acceptEdits |
| `pedro-valerio.md` | opus | default |
| `sop-extractor.md` | sonnet | acceptEdits |
| `squad.md` | opus | acceptEdits |
| `story-chief.md` | opus | bypassPermissions |
| `tools-orchestrator.md` | opus | bypassPermissions |
| `traffic-masters-chief.md` | opus | bypassPermissions |

### 2.3 MMOS Agents (Departamentais)

**Path:** `squads/mmos-squad/agents/`

| Arquivo | Função |
|---------|--------|
| `charlie-synthesis-expert.md` | Síntese final do mind clone |
| `cognitive-analyst.md` | Análise cognitiva |
| `data-importer.md` | Importação de dados/fontes |
| `debate.md` | Debate e validação |
| `emulator.md` | Emulação de personalidade |
| `identity-analyst.md` | Análise de identidade |
| `mind-mapper.md` | Mapeamento mental |
| `mind-pm.md` | PM do processo de mind cloning |
| `research-specialist.md` | Pesquisa especializada |
| `system-prompt-architect.md` | Arquitetura de system prompts |

### 2.4 Squad-Creator Agents (Departamentais)

**Path:** `squads/squad-creator/agents/`

| Arquivo | Função |
|---------|--------|
| `oalanicolas.md` | Mind clone OalaNicolas |
| `sop-extractor.md` | Extração de SOPs |
| `squad-architect.md` | Arquitetura de squads |

---

## 3. TASKS — Paths Canônicos

| Camada | Path | Total | Padrão de nome |
|--------|------|-------|----------------|
| Core | `.aios-core/development/tasks/` | 194 arquivos | `{verbo}-{substantivo}.md` |
| MMOS | `squads/mmos-squad/tasks/` | 27 arquivos | `{substantivo}-{ação}.md` |
| Squad-Creator | `squads/squad-creator/tasks/` | 16 arquivos | `{verbo}-{substantivo}.md` |

### 3.1 Core Tasks (194) — Lista Completa

**Path:** `.aios-core/development/tasks/`

<details>
<summary>Clique para expandir lista completa</summary>

| Arquivo |
|---------|
| `add-mcp.md` |
| `advanced-elicitation.md` |
| `analyst-facilitate-brainstorming.md` |
| `analyze-brownfield.md` |
| `analyze-cross-artifact.md` |
| `analyze-framework.md` |
| `analyze-performance.md` |
| `analyze-project-structure.md` |
| `apply-qa-fixes.md` |
| `architect-analyze-impact.md` |
| `audit-codebase.md` |
| `audit-tailwind-config.md` |
| `audit-utilities.md` |
| `bootstrap-shadcn-library.md` |
| `brownfield-create-epic.md` |
| `brownfield-create-story.md` |
| `build-autonomous.md` |
| `build-component.md` |
| `build-resume.md` |
| `build-status.md` |
| `build.md` |
| `calculate-roi.md` |
| `capture-session-insights.md` |
| `check-docs-links.md` |
| `ci-cd-configuration.md` |
| `cleanup-utilities.md` |
| `cleanup-worktrees.md` |
| `collaborative-edit.md` |
| `compose-molecule.md` |
| `consolidate-patterns.md` |
| `correct-course.md` |
| `create-agent.md` |
| `create-brownfield-story.md` |
| `create-deep-research-prompt.md` |
| `create-doc.md` |
| `create-next-story.md` |
| `create-service.md` |
| `create-suite.md` |
| `create-task.md` |
| `create-workflow.md` |
| `create-worktree.md` |
| `db-analyze-hotpaths.md` |
| `db-apply-migration.md` |
| `db-bootstrap.md` |
| `db-domain-modeling.md` |
| `db-dry-run.md` |
| `db-env-check.md` |
| `db-expansion-pack-integration.md` |
| `db-explain.md` |
| `db-impersonate.md` |
| `db-load-csv.md` |
| `db-policy-apply.md` |
| `db-rls-audit.md` |
| `db-rollback.md` |
| `db-run-sql.md` |
| `db-schema-audit.md` |
| `db-seed.md` |
| `db-smoke-test.md` |
| `db-snapshot.md` |
| `db-supabase-setup.md` |
| `db-verify-order.md` |
| `deprecate-component.md` |
| `dev-apply-qa-fixes.md` |
| `dev-backlog-debt.md` |
| `dev-develop-story.md` |
| `dev-improve-code-quality.md` |
| `dev-optimize-performance.md` |
| `dev-suggest-refactoring.md` |
| `dev-validate-next-story.md` |
| `document-gotchas.md` |
| `document-project.md` |
| `environment-bootstrap.md` |
| `execute-checklist.md` |
| `execute-epic-plan.md` |
| `export-design-tokens-dtcg.md` |
| `extend-pattern.md` |
| `extract-patterns.md` |
| `extract-tokens.md` |
| `facilitate-brainstorming-session.md` |
| `generate-ai-frontend-prompt.md` |
| `generate-documentation.md` |
| `generate-migration-strategy.md` |
| `generate-shock-report.md` |
| `github-devops-github-pr-automation.md` |
| `github-devops-pre-push-quality-gate.md` |
| `github-devops-repository-cleanup.md` |
| `github-devops-version-management.md` |
| `gotcha.md` |
| `gotchas.md` |
| `health-check.yaml` |
| `improve-self.md` |
| `index-docs.md` |
| `init-project-status.md` |
| `integrate-expansion-pack.md` |
| `kb-mode-interaction.md` |
| `learn-patterns.md` |
| `list-mcps.md` |
| `list-worktrees.md` |
| `mcp-workflow.md` |
| `merge-worktree.md` |
| `modify-agent.md` |
| `modify-task.md` |
| `modify-workflow.md` |
| `next.md` |
| `orchestrate-resume.md` |
| `orchestrate-status.md` |
| `orchestrate-stop.md` |
| `orchestrate.md` |
| `patterns.md` |
| `plan-create-context.md` |
| `plan-create-implementation.md` |
| `plan-execute-subtask.md` |
| `po-backlog-add.md` |
| `po-close-story.md` |
| `po-manage-story-backlog.md` |
| `po-pull-story-from-clickup.md` |
| `po-pull-story.md` |
| `po-stories-index.md` |
| `po-sync-story-to-clickup.md` |
| `po-sync-story.md` |
| `pr-automation.md` |
| `propose-modification.md` |
| `qa-after-creation.md` |
| `qa-backlog-add-followup.md` |
| `qa-browser-console-check.md` |
| `qa-create-fix-request.md` |
| `qa-evidence-requirements.md` |
| `qa-false-positive-detection.md` |
| `qa-fix-issues.md` |
| `qa-gate.md` |
| `qa-generate-tests.md` |
| `qa-library-validation.md` |
| `qa-migration-validation.md` |
| `qa-nfr-assess.md` |
| `qa-review-build.md` |
| `qa-review-proposal.md` |
| `qa-review-story.md` |
| `qa-risk-profile.md` |
| `qa-run-tests.md` |
| `qa-security-checklist.md` |
| `qa-test-design.md` |
| `qa-trace-requirements.md` |
| `release-management.md` |
| `remove-mcp.md` |
| `remove-worktree.md` |
| `run-design-system-pipeline.md` |
| `run-workflow-engine.md` |
| `run-workflow.md` |
| `search-mcp.md` |
| `security-audit.md` |
| `security-scan.md` |
| `session-resume.md` |
| `setup-database.md` |
| `setup-design-system.md` |
| `setup-github.md` |
| `setup-llm-routing.md` |
| `setup-mcp-docker.md` |
| `setup-project-docs.md` |
| `shard-doc.md` |
| `sm-create-next-story.md` |
| `spec-assess-complexity.md` |
| `spec-critique.md` |
| `spec-gather-requirements.md` |
| `spec-research-dependencies.md` |
| `spec-write-spec.md` |
| `squad-creator-analyze.md` |
| `squad-creator-create.md` |
| `squad-creator-design.md` |
| `squad-creator-download.md` |
| `squad-creator-extend.md` |
| `squad-creator-list.md` |
| `squad-creator-migrate.md` |
| `squad-creator-publish.md` |
| `squad-creator-sync-ide-command.md` |
| `squad-creator-sync-markmanai.md` |
| `squad-creator-validate.md` |
| `story-checkpoint.md` |
| `sync-documentation.md` |
| `tailwind-upgrade.md` |
| `test-as-user.md` |
| `test-validation-task.md` |
| `undo-last.md` |
| `update-aios.md` |
| `update-manifest.md` |
| `update-source-tree.md` |
| `ux-create-wireframe.md` |
| `ux-ds-scan-artifact.md` |
| `ux-user-research.md` |
| `validate-agents.md` |
| `validate-next-story.md` |
| `validate-tech-preset.md` |
| `validate-workflow.md` |
| `verify-subtask.md` |
| `waves.md` |
| `yolo-toggle.md` |

</details>

### 3.2 MMOS Tasks (27)

**Path:** `squads/mmos-squad/tasks/`

| Arquivo |
|---------|
| `activate-clone.md` |
| `auto-detect-workflow.md` |
| `brownfield-update.md` |
| `cognitive-analysis.md` |
| `communication-templates-extraction.md` |
| `contradictions-synthesis.md` |
| `core-essence-extraction.md` |
| `detect-workflow-mode.md` |
| `execute-mmos-pipeline.md` |
| `frameworks-identifier-analysis.md` |
| `import-mind-sources.md` |
| `index.md` |
| `knowledge-base-chunking.md` |
| `map-mind.md` |
| `mind-story.md` |
| `mind-validation.md` |
| `preview-sources-import.md` |
| `reexecute-mind.md` |
| `reexecute-phase.md` |
| `research-collection.md` |
| `signature-phrases-mining.md` |
| `specialist-recommendation.md` |
| `system-prompt-creation.md` |
| `test-fidelity.md` |
| `validate-sources-import.md` |
| `values-hierarchy-analysis.md` |
| `viability-assessment.md` |

### 3.3 Squad-Creator Tasks (16)

**Path:** `squads/squad-creator/tasks/`

| Arquivo |
|---------|
| `create-agent.md` |
| `create-squad.md` |
| `create-task.md` |
| `create-template.md` |
| `create-workflow.md` |
| `deep-research-pre-agent.md` |
| `extract-sop.md` |
| `extract-thinking-dna.md` |
| `extract-voice-dna.md` |
| `install-commands.md` |
| `qa-after-creation.md` |
| `refresh-registry.md` |
| `squad-analytics.md` |
| `sync-ide-command.md` |
| `update-mind.md` |
| `validate-squad.md` |

---

## 4. WORKFLOWS — Paths Canônicos

**Path:** `.aios-core/development/workflows/`

| Arquivo | Propósito |
|---------|-----------|
| `auto-worktree.yaml` | Automação de worktrees |
| `brownfield-discovery.yaml` | Descoberta em projetos existentes |
| `brownfield-fullstack.yaml` | Brownfield fullstack workflow |
| `brownfield-service.yaml` | Brownfield service workflow |
| `brownfield-ui.yaml` | Brownfield UI workflow |
| `design-system-build-quality.yaml` | Build quality para design system |
| `development-cycle.yaml` | Ciclo de desenvolvimento |
| `epic-orchestration.yaml` | Orquestração de epics |
| `greenfield-fullstack.yaml` | Greenfield fullstack workflow |
| `greenfield-service.yaml` | Greenfield service workflow |
| `greenfield-ui.yaml` | Greenfield UI workflow |
| `qa-loop.yaml` | Loop de QA |
| `spec-pipeline.yaml` | Pipeline de especificação |
| `story-development-cycle.yaml` | Ciclo de desenvolvimento de story |
| `README.md` | Documentação dos workflows |

---

## 5. HOOKS — Paths Canônicos

**Path:** `.claude/hooks/`

| Arquivo | Tipo | Propósito |
|---------|------|-----------|
| `enforce-architecture-first.py` | .py | Garante architecture-first approach |
| `install-hooks.sh` | .sh | Instalação de hooks |
| `mind-clone-governance.py` | .py | Governança de mind clones |
| `pre-commit-mmos-guard.sh` | .sh | Guard de pre-commit MMOS |
| `pre-commit-version-check.sh` | .sh | Verificação de versão pre-commit |
| `read-protection.py` | .py | Proteção de leitura |
| `slug-validation.py` | .py | Validação de slugs |
| `sql-governance.py` | .py | Governança SQL |
| `write-path-validation.py` | .py | Validação de paths de escrita |
| `README.md` | .md | Documentação |

---

## 6. SKILLS — Paths Canônicos

**Path:** `.claude/skills/`

| Nome | Tipo | Ativação |
|------|------|----------|
| `architect-first/` | Diretório (SKILL.md dentro) | `/architect-first` |
| `mcp-builder/` | Diretório (SKILL.md dentro) | `/mcp-builder` |
| `skill-creator/` | Diretório (SKILL.md dentro) | `/skill-creator` |
| `clone-mind.md` | Arquivo .md | `/clone-mind` |
| `course-generation-workflow.md` | Arquivo .md | `/course-generation-workflow` |
| `enhance-workflow.md` | Arquivo .md | `/enhance-workflow` |
| `ralph.md` | Arquivo .md | `/ralph` |
| `squad.md` | Arquivo .md | `/squad` |

---

## 7. MINDS — Estrutura Canônica

**Path raiz:** `squads/mmos-squad/minds/`

**Slugs existentes (28):**

| Slug |
|------|
| `adriano_de_marqui` |
| `alan_nicolas` |
| `alex_hormozi` |
| `andrej_karpathy` |
| `brad_frost` |
| `cagan_patton` |
| `daniel_kahneman` |
| `don_norman` |
| `elon_musk` |
| `eugene_schwartz` |
| `guillermo_rauch` |
| `jeff_patton` |
| `jesus_cristo` |
| `joao_lozano` |
| `jose_amorim` |
| `kapil_gupta` |
| `kent_beck` |
| `marty_cagan` |
| `mitchell_hashimoto` |
| `napoleon_hill` |
| `paul_graham` |
| `pedro_valerio` |
| `ray_kurzweil` |
| `sam_altman` |
| `seth_godin` |
| `steve_jobs` |
| `thiago_finch` |

**Arquivos de controle:** `MIGRATION_MANIFEST.yaml`, `ROLLBACK.md`

**Estrutura interna de cada mind:**

```
squads/mmos-squad/minds/{slug}/
├── artifacts/          ← Análises das 8 camadas (DNA Mental)
├── docs/               ← config.json, logs, status
├── sources/            ← Material bruto organizado
│   ├── articles/
│   ├── books/
│   │   └── {book_name}/
│   ├── courses/
│   ├── metadata/
│   ├── newsletters/
│   ├── podcasts/
│   │   ├── guest_appearances/
│   │   └── own_podcast/
│   ├── raw/
│   ├── social/
│   │   ├── instagram/
│   │   ├── linkedin/
│   │   ├── tiktok/
│   │   └── twitter/
│   ├── transcripts/
│   └── videos/
│       ├── acquisition_com/
│       ├── youtube_main/
│       └── youtube_shorts/
└── system_prompts/     ← Prompts de produção
```

---

## 8. AGENT-MEMORY — Paths Canônicos

**Path:** `.claude/agent-memory/`

| Agente | Path completo | Tem MEMORY.md? |
|--------|---------------|----------------|
| aios-architect | `.claude/agent-memory/aios-architect/MEMORY.md` | sim |
| aios-dev | `.claude/agent-memory/aios-dev/MEMORY.md` | sim |
| oalanicolas | `.claude/agent-memory/oalanicolas/MEMORY.md` | sim |
| pedro-valerio | `.claude/agent-memory/pedro-valerio/MEMORY.md` | sim |
| sop-extractor | `.claude/agent-memory/sop-extractor/MEMORY.md` | sim |
| squad | `.claude/agent-memory/squad/MEMORY.md` | sim |

---

## 9. COMMANDS — Estrutura Canônica

**Path:** `.claude/commands/`

**Estrutura de diretórios:**

```
.claude/commands/
├── greet.md                           ← Comando global
├── AIOS/                              ← Comandos dos agents core
│   ├── agents/                        ← Ativação de agents (12 arquivos + _README.md)
│   │   ├── aios-master.md
│   │   ├── analyst.md
│   │   ├── architect.md
│   │   ├── data-engineer.md
│   │   ├── dev.md
│   │   ├── devops.md
│   │   ├── pm.md
│   │   ├── po.md
│   │   ├── qa.md
│   │   ├── sm.md
│   │   ├── squad-creator.md
│   │   ├── ux-design-expert.md
│   │   └── _README.md
│   ├── scripts/                       ← Scripts AIOS
│   └── stories/                       ← Stories específicas
│       └── story-6.1.4.md
├── mmos-squad/                        ← Comandos MMOS (10 arquivos)
│   ├── charlie-synthesis-expert.md
│   ├── cognitive-analyst.md
│   ├── data-importer.md
│   ├── debate.md
│   ├── emulator.md
│   ├── identity-analyst.md
│   ├── mind-mapper.md
│   ├── mind-pm.md
│   ├── research-specialist.md
│   └── system-prompt-architect.md
├── mmosMapper/                        ← Mapper commands (10 arquivos + README)
│   ├── charlie-synthesis-expert.md
│   ├── cognitive-analyst.md
│   ├── debate.md
│   ├── emulator.md
│   ├── identity-analyst.md
│   ├── mind-mapper.md
│   ├── mind-pm.md
│   ├── README.md
│   ├── research-specialist.md
│   └── system-prompt-architect.md
└── Ralph/                             ← Ralph commands
    └── agents/
        └── ralph.md
```

**Padrão de arquivo:** `{comando}.md` dentro de cada diretório

---

## 10. AGENT-TEAMS — Paths Canônicos

**Path:** `.aios-core/development/agent-teams/`

| Arquivo | Equipe |
|---------|--------|
| `team-all.yaml` | Todos os agents |
| `team-fullstack.yaml` | Time fullstack |
| `team-ide-minimal.yaml` | Configuração IDE mínima |
| `team-no-ui.yaml` | Time sem UI |
| `team-qa-focused.yaml` | Time focado em QA |

---

## 11. RUNTIME — Paths Canônicos

**Path:** `.aios/`

| Arquivo/Dir | Propósito |
|-------------|-----------|
| `audit/` | Dados de auditoria |
| `cache/` | Cache local |
| `codebase-map.json` | Mapa do codebase gerado |
| `dashboard/` | Dados do dashboard |
| `feedback.json` | Feedback coletado |
| `file-evolution/` | Rastreamento de evolução de arquivos |
| `gotchas.json` | Gotchas em JSON |
| `gotchas.md` | Gotchas em markdown |
| `merge-rules.yaml` | Regras de merge |
| `migration-inventory.json` | Inventário de migrações |
| `path-analysis-report.json` | Relatório de análise de paths |
| `patterns.md` | Padrões aprendidos |
| `project-status.yaml` | Status do projeto |
| `status.json` | Status geral |

---

## 12. CONSTITUIÇÃO E DOCS ESTRUTURAIS

| Arquivo | Path completo | Propósito |
|---------|---------------|-----------|
| `constitution.md` | `.aios-core/constitution.md` | Princípios MUST/NON-NEGOTIABLE |
| `user-guide.md` | `.aios-core/user-guide.md` | Guia do usuário |
| `working-in-the-brownfield.md` | `.aios-core/working-in-the-brownfield.md` | Guia de trabalho brownfield |

**Core modules** (`.aios-core/core/`):

| Módulo | Propósito |
|--------|-----------|
| `config/` | Configuração do sistema |
| `docs/` | Documentação interna |
| `elicitation/` | Motor de elicitação |
| `events/` | Sistema de eventos |
| `execution/` | Motor de execução |
| `health-check/` | Verificação de saúde |
| `ideation/` | Motor de ideação |
| `manifest/` | Gerenciamento de manifesto |
| `mcp/` | Integração MCP |
| `memory/` | Camada de memória |
| `migration/` | Sistema de migração |
| `orchestration/` | Orquestração de agents |
| `permissions/` | Sistema de permissões |
| `quality-gates/` | Gates de qualidade |
| `registry/` | Registry de componentes |
| `session/` | Gerenciamento de sessão |
| `ui/` | Componentes UI do CLI |
| `utils/` | Utilitários |

**Scripts** (`.aios-core/development/scripts/`): 58 scripts JS de automação.

**Docs de arquitetura** (`docs/architecture/`): 40+ documentos de referência técnica.

---

## 13. ONDE O NEO VAI MORAR (a criar)

> Estes paths NÃO existem ainda. São o destino da implementação.

```
.neo/                          ← NOVO — raiz do Neo (mesmo nível de .aios-core/)
├── NEO.md                     ← Definição completa
├── CONSTITUICAO_MATRIX.md     ← Constituição organizacional
├── ORGANOGRAMA.md             ← Organograma vivo
├── tasks/                     ← SOPs do Neo
├── memory/
│   └── MEMORY.md
├── data/
│   ├── inventory.yaml
│   ├── gaps.yaml
│   └── principles.md
└── templates/

.claude/agents/neo.md          ← Bridge file (apontar para .neo/NEO.md)
.claude/commands/neo/neo.md    ← Slash command
.claude/agent-memory/neo/
    └── MEMORY.md              ← Espelho de .neo/memory/MEMORY.md
docs/architecture/
    └── matrix-vision.md       ← Doc público da visão organizacional
```

---

## 14. REGRAS DE NOMENCLATURA

> Extraídas do padrão real do repositório.

| Componente | Padrão | Exemplo |
|------------|--------|---------|
| Agent core | `{nome}.md` | `dev.md`, `qa.md` |
| Agent Claude Code | `{nome}.md` ou `aios-{nome}.md` | `aios-dev.md`, `copy-chief.md` |
| Task | `{verbo}-{substantivo}.md` | `build-component.md` |
| Workflow | `{tipo}-{escopo}.yaml` | `greenfield-fullstack.yaml` |
| Hook | `{funcao}.py` ou `{trigger}.sh` | `enforce-architecture-first.py` |
| Skill (arquivo) | `{nome}.md` | `clone-mind.md` |
| Skill (diretório) | `{nome}/SKILL.md` | `skill-creator/SKILL.md` |
| Mind slug | `{primeiro}_{sobrenome}` | `alex_hormozi`, `pedro_valerio` |
| Agent-memory | `.claude/agent-memory/{agent-name}/MEMORY.md` | |
| Command | `.claude/commands/{grupo}/{comando}.md` | |
| Agent-team | `team-{escopo}.yaml` | `team-fullstack.yaml` |

---

## 15. ERROS COMUNS DE PATH (EVITAR)

| Errado | Correto | Por quê |
|--------|---------|---------|
| `agents/dev.md` | `.aios-core/development/agents/dev.md` | Path incompleto |
| `minds/alex_hormozi/` | `squads/mmos-squad/minds/alex_hormozi/` | Falta o squad prefix |
| `hooks/enforce-architecture-first.py` | `.claude/hooks/enforce-architecture-first.py` | Falta `.claude/` |
| `tasks/build-component.md` | `.aios-core/development/tasks/build-component.md` | Path incompleto |
| `workflows/greenfield-fullstack.yaml` | `.aios-core/development/workflows/greenfield-fullstack.yaml` | Path incompleto |
| `core/orchestration/` | `.aios-core/core/orchestration/` | Falta `.aios-core/` |
| `agent-memory/squad/` | `.claude/agent-memory/squad/` | Falta `.claude/` |
| `commands/AIOS/agents/dev.md` | `.claude/commands/AIOS/agents/dev.md` | Falta `.claude/` |
| `scripts/greeting-builder.js` | `.aios-core/development/scripts/greeting-builder.js` | Path incompleto |

---

> **Versão:** 1.0
> **Gerado em:** 2026-02-21
> **Gerado por:** Aria (Opus 4.6) via scan direto do repositório
> **Próxima atualização:** Após qualquer mudança estrutural no repo
> **Usado por:** Neo, Squad Chief, Squad Creator, e qualquer desenvolvimento futuro
