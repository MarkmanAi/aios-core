# REPO PATH MAP — MarkmanAi/aios-core
## v2 — Com Counts Validados + Pipeline Status

> **Versão:** 2.0
> **Gerado em:** 2026-02-22T01:44:45Z
> **Gerado por:** Aria (architect) via scan direto do repositório — Claude Opus 4.6
> **Atualização anterior:** v1.0 — 2026-02-21 (Aria, Opus 4.6) — `docs/architecture/REPO_PATH_MAP.md`
> **Próxima atualização:** Após qualquer mudança estrutural no repo
> **Usado por:** Neo (*health, *audit), Squad Chief, Squad Creator, e qualquer desenvolvimento futuro

---

## SUMÁRIO EXECUTIVO

| Componente | Count | Last Validated |
|------------|-------|----------------|
| Total arquivos (find -type f) | 6315 | 2026-02-22T01:44:45Z |
| Core Agents | 12 | 2026-02-22T01:44:45Z |
| Claude Code Agents | 24 | 2026-02-22T01:44:45Z |
| MMOS Agents | 10 | 2026-02-22T01:44:45Z |
| Squad-Creator Agents | 3 | 2026-02-22T01:44:45Z |
| **TOTAL AGENTS** | **49** | 2026-02-22T01:44:45Z |
| Minds Clonadas | 27 | 2026-02-22T01:44:45Z |
| Core Tasks | 195 | 2026-02-22T01:44:45Z |
| MMOS Tasks | 27 | 2026-02-22T01:44:45Z |
| Squad-Creator Tasks | 16 | 2026-02-22T01:44:45Z |
| Neo Tasks | 0 | 2026-02-22T01:44:45Z |
| **TOTAL TASKS** | **238** | 2026-02-22T01:44:45Z |
| Workflows (yaml) | 14 | 2026-02-22T01:44:45Z |
| Hooks (funcionais) | 9 | 2026-02-22T01:44:45Z |
| Skills | 8 | 2026-02-22T01:44:45Z |
| Team Presets | 5 | 2026-02-22T01:44:45Z |
| Kernel Module Dirs | 18 | 2026-02-22T01:44:45Z |
| Orchestration Modules | 32 | 2026-02-22T01:44:45Z |
| Execution Modules | 11 | 2026-02-22T01:44:45Z |
| Quality-Gate Modules | 10 | 2026-02-22T01:44:45Z |
| Memory Modules | 5 | 2026-02-22T01:44:45Z |
| Scripts (.aios-core) | 57 | 2026-02-22T01:44:45Z |
| Templates | 6 | 2026-02-22T01:44:45Z |
| Checklists | 2 | 2026-02-22T01:44:45Z |
| Docs/Architecture | 48 | 2026-02-22T01:44:45Z |
| Commands (files) | 40 | 2026-02-22T01:44:45Z |
| Agent Memory dirs | 6 | 2026-02-22T01:44:45Z |
| Squads | 2 | 2026-02-22T01:44:45Z |

---

## 1. RAIZ DO REPOSITÓRIO
> **Last validated:** 2026-02-22T01:44:45Z

### Diretórios visíveis
| Diretório | Propósito |
|-----------|-----------|
| `apps/` | Aplicações (dashboard, monitor-server) |
| `bin/` | CLI executables (aios.js, aios-init.js, aios-minimal.js) |
| `docs/` | Documentação completa |
| `packages/` | Shared packages (aios-install, gemini-aios-extension, installer) |
| `scripts/` | Scripts utilitários raiz (9 files) |
| `squads/` | Expansion packs (mmos-squad, squad-creator) |
| `tests/` | Testes automatizados |

### Diretórios ocultos
| Diretório | Propósito |
|-----------|-----------|
| `.aios/` | Runtime data (logs, state) |
| `.aios-core/` | Core do framework |
| `.antigravity/` | Rules (cursor/antigravity integration) |
| `.claude/` | Claude Code config (agents, hooks, skills, commands) |
| `.cursor/` | Cursor IDE rules |
| `.docker/` | Docker configs (llm-routing) |
| `.git/` | Git repository |
| `.github/` | GitHub config (workflows, templates, CODEOWNERS) |

### Arquivos raiz
| Arquivo | Tamanho |
|---------|---------|
| `CHANGELOG.md` | 9937B |
| `CODE_OF_CONDUCT.md` | 5220B |
| `CONTRIBUTING.md` | 12134B |
| `eslint.config.js` | 4595B |
| `jest.config.js` | 4859B |
| `LICENSE` | 2108B |
| `package.json` | 3869B |
| `package-lock.json` | 471005B |
| `README.md` | 26292B |
| `tsconfig.json` | 1160B |

---

## 2. AGENTES — Paths Canônicos
> **Last validated:** 2026-02-22T01:44:45Z | **Total agents across all paths: 49**

### 2.1 Core Agents (CLT)
> **Path:** `.aios-core/development/agents/` | **Count: 12**

| Arquivo | ID | Size |
|---------|----|------|
| `aios-master.md` | aios-master | 15014B |
| `analyst.md` | analyst | 10126B |
| `architect.md` | architect | 18906B |
| `data-engineer.md` | data-engineer | 20235B |
| `dev.md` | dev | 23130B |
| `devops.md` | devops | 18787B |
| `pm.md` | pm | 10749B |
| `po.md` | po | 12321B |
| `qa.md` | qa | 16051B |
| `sm.md` | sm | 10942B |
| `squad-creator.md` | squad-creator | 11942B |
| `ux-design-expert.md` | ux-design-expert | 17985B |

### 2.2 Claude Code Agents (PJ)
> **Path:** `.claude/agents/` | **Count: 24**

| Arquivo | Model | PermissionMode | Size |
|---------|-------|----------------|------|
| `aios-analyst.md` | opus | bypassPermissions | 3123B |
| `aios-architect.md` | opus | bypassPermissions | 2980B |
| `aios-data-engineer.md` | opus | bypassPermissions | 4592B |
| `aios-dev.md` | opus | bypassPermissions | 3582B |
| `aios-devops.md` | opus | bypassPermissions | 3406B |
| `aios-pm.md` | opus | bypassPermissions | 2746B |
| `aios-po.md` | opus | bypassPermissions | 2810B |
| `aios-qa.md` | opus | bypassPermissions | 3375B |
| `aios-sm.md` | sonnet | bypassPermissions | 2522B |
| `aios-ux.md` | opus | bypassPermissions | 5115B |
| `copy-chief.md` | opus | bypassPermissions | 6377B |
| `cyber-chief.md` | opus | bypassPermissions | 6279B |
| `data-chief.md` | opus | bypassPermissions | 7817B |
| `db-sage.md` | opus | bypassPermissions | 6508B |
| `design-chief.md` | opus | bypassPermissions | 7530B |
| `design-system.md` | opus | bypassPermissions | 7872B |
| `legal-chief.md` | opus | bypassPermissions | 7396B |
| `oalanicolas.md` | opus | acceptEdits | 1276B |
| `pedro-valerio.md` | opus | default | 1131B |
| `sop-extractor.md` | sonnet | acceptEdits | 1137B |
| `squad.md` | opus | acceptEdits | 1632B |
| `story-chief.md` | opus | bypassPermissions | 6953B |
| `tools-orchestrator.md` | opus | bypassPermissions | 7341B |
| `traffic-masters-chief.md` | opus | bypassPermissions | 7515B |

### 2.3 MMOS Agents (Departamentais)
> **Path:** `squads/mmos-squad/agents/` | **Count: 10**

| Arquivo | Size |
|---------|------|
| `charlie-synthesis-expert.md` | 7093B |
| `cognitive-analyst.md` | 4545B |
| `data-importer.md` | 6293B |
| `debate.md` | 11043B |
| `emulator.md` | 11045B |
| `identity-analyst.md` | 4696B |
| `mind-mapper.md` | 8617B |
| `mind-pm.md` | 4215B |
| `research-specialist.md` | 6914B |
| `system-prompt-architect.md` | 4510B |

### 2.4 Squad-Creator Agents (Departamentais)
> **Path:** `squads/squad-creator/agents/` | **Count: 3**

| Arquivo | Size |
|---------|------|
| `oalanicolas.md` | 31713B |
| `sop-extractor.md` | 24785B |
| `squad-architect.md` | 32032B |

---

## 3. TASKS — Paths Canônicos
> **Last validated:** 2026-02-22T01:44:45Z

| Camada | Path | Total | .md | .yaml | Padrão |
|--------|------|-------|-----|-------|--------|
| Core | `.aios-core/development/tasks/` | 195 | 194 | 1 | kebab-case |
| MMOS | `squads/mmos-squad/tasks/` | 27 | 27 | 0 | kebab-case |
| Squad-Creator | `squads/squad-creator/tasks/` | 16 | 16 | 0 | kebab-case |
| Neo | `.neo/tasks/` | 0 | 0 | 0 | N/A (não existe) |
| **TOTAL** | | **238** | **237** | **1** | |

### 3.1 Core Tasks — Lista Completa
> **Count: 195 (194 .md + 1 .yaml = 195 arquivos | blocks/ é diretório, não contado)**

<details>
<summary>Expandir lista completa (195 arquivos + 1 dir)</summary>

```
add-mcp.md
advanced-elicitation.md
analyst-facilitate-brainstorming.md
analyze-brownfield.md
analyze-cross-artifact.md
analyze-framework.md
analyze-performance.md
analyze-project-structure.md
apply-qa-fixes.md
architect-analyze-impact.md
audit-codebase.md
audit-tailwind-config.md
audit-utilities.md
blocks/
bootstrap-shadcn-library.md
brownfield-create-epic.md
brownfield-create-story.md
build.md
build-autonomous.md
build-component.md
build-resume.md
build-status.md
calculate-roi.md
capture-session-insights.md
check-docs-links.md
ci-cd-configuration.md
cleanup-utilities.md
cleanup-worktrees.md
collaborative-edit.md
compose-molecule.md
consolidate-patterns.md
correct-course.md
create-agent.md
create-brownfield-story.md
create-deep-research-prompt.md
create-doc.md
create-next-story.md
create-service.md
create-suite.md
create-task.md
create-workflow.md
create-worktree.md
db-analyze-hotpaths.md
db-apply-migration.md
db-bootstrap.md
db-domain-modeling.md
db-dry-run.md
db-env-check.md
db-expansion-pack-integration.md
db-explain.md
db-impersonate.md
db-load-csv.md
db-policy-apply.md
db-rls-audit.md
db-rollback.md
db-run-sql.md
db-schema-audit.md
db-seed.md
db-smoke-test.md
db-snapshot.md
db-supabase-setup.md
db-verify-order.md
deprecate-component.md
dev-apply-qa-fixes.md
dev-backlog-debt.md
dev-develop-story.md
dev-improve-code-quality.md
dev-optimize-performance.md
dev-suggest-refactoring.md
dev-validate-next-story.md
document-gotchas.md
document-project.md
environment-bootstrap.md
execute-checklist.md
execute-epic-plan.md
export-design-tokens-dtcg.md
extend-pattern.md
extract-patterns.md
extract-tokens.md
facilitate-brainstorming-session.md
generate-ai-frontend-prompt.md
generate-documentation.md
generate-migration-strategy.md
generate-shock-report.md
github-devops-github-pr-automation.md
github-devops-pre-push-quality-gate.md
github-devops-repository-cleanup.md
github-devops-version-management.md
gotcha.md
gotchas.md
health-check.yaml
improve-self.md
index-docs.md
init-project-status.md
integrate-expansion-pack.md
kb-mode-interaction.md
learn-patterns.md
list-mcps.md
list-worktrees.md
mcp-workflow.md
merge-worktree.md
modify-agent.md
modify-task.md
modify-workflow.md
next.md
orchestrate.md
orchestrate-resume.md
orchestrate-status.md
orchestrate-stop.md
patterns.md
plan-create-context.md
plan-create-implementation.md
plan-execute-subtask.md
po-backlog-add.md
po-close-story.md
po-manage-story-backlog.md
po-pull-story.md
po-pull-story-from-clickup.md
po-stories-index.md
po-sync-story.md
po-sync-story-to-clickup.md
pr-automation.md
propose-modification.md
qa-after-creation.md
qa-backlog-add-followup.md
qa-browser-console-check.md
qa-create-fix-request.md
qa-evidence-requirements.md
qa-false-positive-detection.md
qa-fix-issues.md
qa-gate.md
qa-generate-tests.md
qa-library-validation.md
qa-migration-validation.md
qa-nfr-assess.md
qa-review-build.md
qa-review-proposal.md
qa-review-story.md
qa-risk-profile.md
qa-run-tests.md
qa-security-checklist.md
qa-test-design.md
qa-trace-requirements.md
release-management.md
remove-mcp.md
remove-worktree.md
run-design-system-pipeline.md
run-workflow.md
run-workflow-engine.md
search-mcp.md
security-audit.md
security-scan.md
session-resume.md
setup-database.md
setup-design-system.md
setup-github.md
setup-llm-routing.md
setup-mcp-docker.md
setup-project-docs.md
shard-doc.md
sm-create-next-story.md
spec-assess-complexity.md
spec-critique.md
spec-gather-requirements.md
spec-research-dependencies.md
spec-write-spec.md
squad-creator-analyze.md
squad-creator-create.md
squad-creator-design.md
squad-creator-download.md
squad-creator-extend.md
squad-creator-list.md
squad-creator-migrate.md
squad-creator-publish.md
squad-creator-sync-ide-command.md
squad-creator-sync-synkra.md
squad-creator-validate.md
story-checkpoint.md
sync-documentation.md
tailwind-upgrade.md
test-as-user.md
test-validation-task.md
undo-last.md
update-aios.md
update-manifest.md
update-source-tree.md
ux-create-wireframe.md
ux-ds-scan-artifact.md
ux-user-research.md
validate-agents.md
validate-next-story.md
validate-tech-preset.md
validate-workflow.md
verify-subtask.md
waves.md
yolo-toggle.md
```
</details>

### 3.2 MMOS Tasks
> **Path:** `squads/mmos-squad/tasks/` | **Count: 27**

<details>
<summary>Expandir lista</summary>

```
activate-clone.md
auto-detect-workflow.md
brownfield-update.md
cognitive-analysis.md
communication-templates-extraction.md
contradictions-synthesis.md
core-essence-extraction.md
detect-workflow-mode.md
execute-mmos-pipeline.md
frameworks-identifier-analysis.md
import-mind-sources.md
index.md
knowledge-base-chunking.md
map-mind.md
mind-story.md
mind-validation.md
preview-sources-import.md
reexecute-mind.md
reexecute-phase.md
research-collection.md
signature-phrases-mining.md
specialist-recommendation.md
system-prompt-creation.md
test-fidelity.md
validate-sources-import.md
values-hierarchy-analysis.md
viability-assessment.md
```
</details>

### 3.3 Squad-Creator Tasks
> **Path:** `squads/squad-creator/tasks/` | **Count: 16**

<details>
<summary>Expandir lista</summary>

```
create-agent.md
create-squad.md
create-task.md
create-template.md
create-workflow.md
deep-research-pre-agent.md
extract-sop.md
extract-thinking-dna.md
extract-voice-dna.md
install-commands.md
qa-after-creation.md
refresh-registry.md
squad-analytics.md
sync-ide-command.md
update-mind.md
validate-squad.md
```
</details>

### 3.4 Neo Tasks
> **Path:** `.neo/tasks/` | **Count: 0** — Diretório não existe. Meta-layer pendente.

---

## 4. WORKFLOWS — Paths Canônicos
> **Last validated:** 2026-02-22T01:44:45Z | **Functional (yaml): 14 | Total files: 15**

| Arquivo | Tipo |
|---------|------|
| `auto-worktree.yaml` | Workflow |
| `brownfield-discovery.yaml` | Workflow |
| `brownfield-fullstack.yaml` | Workflow |
| `brownfield-service.yaml` | Workflow |
| `brownfield-ui.yaml` | Workflow |
| `design-system-build-quality.yaml` | Workflow |
| `development-cycle.yaml` | Workflow |
| `epic-orchestration.yaml` | Workflow |
| `greenfield-fullstack.yaml` | Workflow |
| `greenfield-service.yaml` | Workflow |
| `greenfield-ui.yaml` | Workflow |
| `qa-loop.yaml` | Workflow |
| `spec-pipeline.yaml` | Workflow |
| `story-development-cycle.yaml` | Workflow |
| `README.md` | Documentação (não workflow) |

> **Path:** `.aios-core/development/workflows/`

---

## 5. HOOKS — Paths Canônicos
> **Last validated:** 2026-02-22T01:44:45Z | **Functional (.py+.sh): 9 | Total files: 10**

| Arquivo | Tipo | Size |
|---------|------|------|
| `enforce-architecture-first.py` | Python hook | 7736B |
| `install-hooks.sh` | Shell script | 1035B |
| `mind-clone-governance.py` | Python hook | 7359B |
| `pre-commit-mmos-guard.sh` | Shell hook | 3561B |
| `pre-commit-version-check.sh` | Shell hook | 4220B |
| `read-protection.py` | Python hook | 5850B |
| `slug-validation.py` | Python hook | 6557B |
| `sql-governance.py` | Python hook | 7231B |
| `write-path-validation.py` | Python hook | 6897B |
| `README.md` | Documentação | 4431B |

> **Path:** `.claude/hooks/`

---

## 6. SKILLS — Paths Canônicos
> **Last validated:** 2026-02-22T01:44:45Z | **Total: 8 (3 dirs + 5 .md)**

| Entry | Tipo |
|-------|------|
| `architect-first/` | skill_pack_dir |
| `mcp-builder/` | skill_pack_dir |
| `skill-creator/` | skill_pack_dir |
| `clone-mind.md` | standalone_md |
| `course-generation-workflow.md` | standalone_md |
| `enhance-workflow.md` | standalone_md |
| `ralph.md` | standalone_md |
| `squad.md` | standalone_md |

> **Path:** `.claude/skills/`

---

## 7. MINDS — Pipeline Status
> **Last validated:** 2026-02-22T01:44:45Z | **Total minds: 27 | Complete: 13 | Incomplete: 3 | Warning: 8 | Unknown: 3**

| Slug | Sources | Artifacts | System Prompts | Docs | STATUS | Priority Action |
|------|---------|-----------|----------------|------|--------|-----------------|
| adriano_de_marqui | 0 | 17 | 1 | 2 | ❓ UNKNOWN | Adicionar sources originais |
| alan_nicolas | 6 | 12 | 3 | 12 | ✅ COMPLETE | — |
| alex_hormozi | 13 | 14 | 1 | 1 | ✅ COMPLETE | — |
| andrej_karpathy | 0 | 4 | 3 | 1 | ❓ UNKNOWN | Adicionar sources originais |
| brad_frost | 0 | 4 | 0 | 1 | 🔴 INCOMPLETE:falta_compilation | Compilar system_prompts |
| cagan_patton | 2 | 0 | 3 | 1 | ⚠️ WARN:prompts_sem_artifacts | Pipeline order violated — rodar analysis |
| daniel_kahneman | 4 | 8 | 1 | 2 | ✅ COMPLETE | — |
| don_norman | 1 | 0 | 1 | 0 | ⚠️ WARN:prompts_sem_artifacts | Rodar analysis phase |
| elon_musk | 4 | 18 | 3 | 4 | ✅ COMPLETE | — |
| eugene_schwartz | 0 | 6 | 2 | 2 | ❓ UNKNOWN | Adicionar sources originais |
| guillermo_rauch | 1 | 0 | 1 | 0 | ⚠️ WARN:prompts_sem_artifacts | Rodar analysis phase |
| jeff_patton | 5 | 0 | 3 | 0 | ⚠️ WARN:prompts_sem_artifacts | Rodar analysis phase |
| jesus_cristo | 7 | 20 | 1 | 4 | ✅ COMPLETE | — |
| joao_lozano | 0 | 8 | 0 | 5 | 🔴 INCOMPLETE:falta_compilation | Compilar system_prompts |
| jose_amorim | 14 | 15 | 6 | 3 | ✅ COMPLETE | — |
| kapil_gupta | 2 | 5 | 1 | 1 | ✅ COMPLETE | — |
| kent_beck | 0 | 0 | 1 | 0 | ⚠️ WARN:prompts_sem_artifacts | Adicionar sources + rodar pipeline |
| marty_cagan | 19 | 0 | 3 | 2 | ⚠️ WARN:prompts_sem_artifacts | Rodar analysis phase |
| mitchell_hashimoto | 0 | 0 | 1 | 0 | ⚠️ WARN:prompts_sem_artifacts | Adicionar sources + rodar pipeline |
| napoleon_hill | 2 | 21 | 1 | 4 | ✅ COMPLETE | — |
| paul_graham | 8 | 24 | 5 | 3 | ✅ COMPLETE | — |
| pedro_valerio | 1 | 0 | 1 | 6 | ⚠️ WARN:prompts_sem_artifacts | Rodar analysis phase |
| ray_kurzweil | 3 | 2 | 1 | 0 | ✅ COMPLETE | — |
| sam_altman | 5 | 4 | 9 | 8 | ✅ COMPLETE | — |
| seth_godin | 2 | 19 | 1 | 2 | ✅ COMPLETE | — |
| steve_jobs | 1 | 16 | 1 | 1 | ✅ COMPLETE | — |
| thiago_finch | 84 | 5 | 0 | 3 | 🔴 INCOMPLETE:falta_compilation | Compilar system_prompts (84 sources!) |

**Non-mind files in minds/:**
- `MIGRATION_MANIFEST.yaml`
- `ROLLBACK.md`

**STATUS codes:**
- ✅ COMPLETE — tem sources + artifacts + system_prompts
- ⚠️ WARN — tem system_prompts mas sem artifacts (pipeline order violated)
- 🔴 INCOMPLETE:falta_compilation — tem artifacts mas sem system_prompts
- ❓ UNKNOWN — estrutura inesperada (artifacts sem sources)

**Estrutura interna canônica por mind:**
```
squads/mmos-squad/minds/{slug}/
├── sources/          # Conteúdo original (textos, transcrições)
├── artifacts/        # Análises geradas (DNA, frameworks)
├── system_prompts/   # Prompts compilados (output final)
└── docs/             # Documentação auxiliar
```

> **Path:** `squads/mmos-squad/minds/`

---

## 8. AGENT-MEMORY — Paths Canônicos
> **Last validated:** 2026-02-22T01:44:45Z | **Total agents with memory: 6**

| Agente | Path | MEMORY.md | Size |
|--------|------|-----------|------|
| aios-architect | `.claude/agent-memory/aios-architect/` | sim | 2889B |
| aios-dev | `.claude/agent-memory/aios-dev/` | sim | 6354B |
| oalanicolas | `.claude/agent-memory/oalanicolas/` | sim | 1058B |
| pedro-valerio | `.claude/agent-memory/pedro-valerio/` | sim | 1142B |
| sop-extractor | `.claude/agent-memory/sop-extractor/` | sim | 1136B |
| squad | `.claude/agent-memory/squad/` | sim | 1327B |

---

## 9. COMMANDS — Estrutura Canônica
> **Last validated:** 2026-02-22T01:44:45Z | **Total files: 40 | Total dirs: 9**

```
.claude/commands/
├── AIOS/
│   ├── agents/
│   │   ├── _README.md
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
│   │   └── ux-design-expert.md
│   ├── scripts/
│   │   ├── agent-config-loader.js
│   │   ├── generate-greeting.js
│   │   ├── greeting-builder.js
│   │   └── session-context-loader.js
│   └── stories/
│       └── story-6.1.4.md
├── greet.md
├── mmosMapper/
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
├── mmos-squad/
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
└── Ralph/
    └── agents/
        └── ralph.md
```

---

## 10. AGENT-TEAMS — Paths Canônicos
> **Last validated:** 2026-02-22T01:44:45Z | **Count: 5**

| Arquivo | Size |
|---------|------|
| `team-all.yaml` | 317B |
| `team-fullstack.yaml` | 384B |
| `team-ide-minimal.yaml` | 167B |
| `team-no-ui.yaml` | 224B |
| `team-qa-focused.yaml` | 5012B |

> **Path:** `.aios-core/development/agent-teams/`

---

## 11. KERNEL — .aios-core/core/
> **Last validated:** 2026-02-22T01:44:45Z | **Total module dirs: 18**

| Módulo | Files | Propósito |
|--------|-------|-----------|
| `config/` | 8 | Configuration management |
| `docs/` | 5 | Core documentation |
| `elicitation/` | 5 | User elicitation engine |
| `events/` | 3 | Event system |
| `execution/` | 11 | Task execution engine |
| `health-check/` | 7 | System health checks |
| `ideation/` | 1 | Ideation support |
| `manifest/` | 2 | Manifest management |
| `mcp/` | 5 | MCP adapters |
| `memory/` | 5 | Memory layer |
| `migration/` | 2 | Migration utilities |
| `orchestration/` | 32 | Multi-agent orchestration |
| `permissions/` | 4 | Permission system |
| `quality-gates/` | 10 | Quality gate checks |
| `registry/` | 6 | Agent/resource registry |
| `session/` | 2 | Session management |
| `ui/` | 3 | UI helpers |
| `utils/` | 3 | Shared utilities |

---

## 12. DEVELOPMENT RESOURCES
> **Last validated:** 2026-02-22T01:44:45Z

### Scripts
> **Path:** `.aios-core/development/scripts/` | **Count: 57**

**Top 10 por relevância (tamanho):**

| Script | Size | Propósito |
|--------|------|-----------|
| `code-quality-improver.js` | 39827B | Melhoria automatizada de qualidade de código |
| `pattern-learner.js` | 35067B | Aprendizado e detecção de padrões |
| `refactoring-suggester.js` | 34675B | Sugestões de refatoração |
| `verify-workflow-gaps.js` | 33418B | Verificação de gaps em workflows |
| `greeting-builder.js` | 30369B | Constrói output de greeting para agentes |
| `commit-message-generator.js` | 25369B | Geração de mensagens de commit |
| `test-generator.js` | 24936B | Geração automatizada de testes |
| `performance-analyzer.js` | 23410B | Análise de performance |
| `workflow-validator.js` | 22989B | Validação de workflows |
| `metrics-tracker.js` | 21726B | Rastreamento de métricas |

> Lista completa: `ls .aios-core/development/scripts/`

### Templates
> **Path:** `.aios-core/development/templates/` | **Count: 6**

| Entry | Tipo |
|-------|------|
| `aios-doc-template.md` | Documento |
| `research-prompt-tmpl.md` | Prompt |
| `service-template/` | Diretório |
| `squad/` | Diretório |
| `squad-template/` | Diretório |
| `subagent-step-prompt.md` | Prompt |

### Checklists
> **Path:** `.aios-core/development/checklists/` | **Count: 2**

| Arquivo |
|---------|
| `agent-quality-gate.md` |
| `self-critique-checklist.md` |

### Data
> **Path:** `.aios-core/development/data/` | **Count: 3**

| Arquivo |
|---------|
| `decision-heuristics-framework.md` |
| `quality-dimensions-framework.md` |
| `tier-system-framework.md` |

---

## 13. CONSTITUIÇÃO E DOCS ESTRUTURAIS
> **Last validated:** 2026-02-22T01:44:45Z

| Recurso | Path | Count |
|---------|------|-------|
| Constitution | `.aios-core/constitution.md` | 1 |
| Architecture docs | `docs/architecture/` | 48 |
| ADR (Architecture Decision Records) | `docs/architecture/adr/` | 5 |

---

## 14. NEO META-LAYER
> **Last validated:** 2026-02-22T01:44:45Z | **Status: PENDENTE**

O diretório `.neo/` **não existe** ainda. Meta-layer não implementada.

---

## 15. REGRAS DE NOMENCLATURA
> **Last validated:** 2026-02-22T01:44:45Z

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Agents (core) | `{role}.md` | `architect.md` |
| Agents (claude code) | `aios-{role}.md` ou `{name}.md` | `aios-dev.md`, `db-sage.md` |
| Tasks | `{agent}-{action}.md` ou `{action}.md` | `qa-gate.md`, `build.md` |
| Workflows | `{type}.yaml` | `greenfield-fullstack.yaml` |
| Minds | `{first}_{last}/` (snake_case) | `paul_graham/` |
| Teams | `team-{name}.yaml` | `team-all.yaml` |
| Hooks | `{purpose}.{py\|sh}` | `slug-validation.py` |
| Skills (dir) | `kebab-case/` | `architect-first/` |
| Skills (standalone) | `kebab-case.md` | `clone-mind.md` |

---

## 16. ERROS COMUNS DE PATH (EVITAR)
> **Last validated:** 2026-02-22T01:44:45Z

| Erro | Path Errado | Path Correto |
|------|-------------|--------------|
| Agents no lugar errado | `.claude/development/agents/` | `.aios-core/development/agents/` |
| Tasks fora do core | `tasks/` (raiz) | `.aios-core/development/tasks/` |
| Minds fora do squad | `minds/` (raiz) | `squads/mmos-squad/minds/` |
| Workflows como .md | `workflows/*.md` | `workflows/*.yaml` (exceto README) |
| Hooks sem prefixo | `hooks/validate.py` | `hooks/slug-validation.py` |
| Neo antes de existir | `.neo/tasks/` | Não existe ainda |
| Agent memory path | `.claude/memory/` | `.claude/agent-memory/` |

---

## 17. DIFF — O QUE MUDOU DESDE v1

> **Comparação:** v1.0 (`docs/architecture/REPO_PATH_MAP.md`) → v2.0 (2026-02-22)

| Melhoria | v1 | v2 |
|----------|----|----|
| Counts validados por bash | Nem todos verificados | Todos via `ls \| wc -l` nesta sessão |
| `last_validated` por seção | Ausente | Presente em todas as 15+ seções |
| Pipeline status por mind | Ausente | STATUS para cada uma das 27 minds |
| Model/permissionMode de Claude agents | Copiado/estimado | Extraído via grep de cada arquivo |
| Seção de Diff | Inexistente | Seção 17 adicionada |
| Kernel module file counts | Parcial | Contagem por subdiretório (18 módulos) |

---

> **Versão:** 2.0
> **Gerado em:** 2026-02-22T01:44:45Z
> **Gerado por:** Aria (architect) — Claude Opus 4.6
> **Método:** Scan direto via bash — zero informação de memória ou docs anteriores
> **Próxima atualização:** Após qualquer mudança estrutural
> **Comando para regenerar:** Cole o prompt REPO_PATH_MAP_v2 no Claude Code e execute
