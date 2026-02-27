# 🔴 A VISÃO MATRIX — CONSTITUIÇÃO DA ORGANIZAÇÃO AIOS
## Documento Permanente de Referência Organizacional

> **Este documento é a pílula vermelha.**
> Descreve o AIOS não como software, mas como o que ele realmente é:
> uma organização autônoma completa — com departamentos, funcionários,
> hierarquias, processos, cultura e governança.
>
> **Todo novo agente, squad, mind ou workflow DEVE ser posicionado
> dentro desta estrutura organizacional antes de ser criado.**
>
> **O Agente Neo é o guardião e executor desta visão.**
>
> Validado contra: 6.315 arquivos do repositório MarkmanAi/aios-core (REPO_PATH_MAP_v2)
> Última validação: 2026-02-22

---

# PARTE I — A MATRIX

## 1.1 O Que É o AIOS

O AIOS é uma realidade simulada de uma empresa. Uma empresa completa, com departamentos, funcionários, hierarquias, processos, cultura, e até política interna. Nenhum deles é humano.

Quando o AIOS é inicializado, não se está instalando software. Está se fundando uma organização. Ela nasce com C-Level, diretores, gerentes, especialistas seniores, operários, auditores, e um programa de recrutamento que clona os maiores especialistas da história humana.

## 1.2 A Anatomia Vista Por Fora

Cada arquivo `.md` de agente é um job description. Cada task é um SOP (Standard Operating Procedure). Cada workflow é um business process. Cada quality gate é um compliance check. Cada hook é uma política de governança. Cada squad é um departamento. Cada mind clonado é um consultor externo contratado.

O kernel (`.aios-core/core/` com 18 módulos funcionais) é o sistema nervoso central. Os workflows são o sistema circulatório — sangue fluindo entre órgãos. Os adapters são os sentidos — como a organização percebe o mundo externo. A memória institucional (5 módulos) é o que garante que a organização aprende.

## 1.3 Dicionário Permanente: Mundo Real ↔ AIOS

| Mundo Real | No AIOS | Localização no Código |
|------------|---------|----------------------|
| A empresa inteira | O repositório | `/` (raiz, 6.315 arquivos) |
| Sistema nervoso central | Kernel | `.aios-core/core/` (18 módulos) |
| Cérebro operacional | Orchestration | `.aios-core/core/orchestration/` (32 módulos) |
| Constituição corporativa | CLAUDE.md + aios-master | `.claude/CLAUDE.md` + `.aios-core/development/agents/aios-master.md` |
| Departamento | Squad | `squads/{nome}/` |
| Funcionário efetivo | Agente Core | `.aios-core/development/agents/{nome}.md` |
| Funcionário contratado | Agente Claude Code | `.claude/agents/{nome}.md` |
| Consultor externo | Mente Clonada | `squads/mmos-squad/minds/{slug}/` |
| Job Description | Arquivo do agente | `.aios-core/development/agents/{nome}.md` ou `.claude/agents/{nome}.md` |
| SOP (procedimento) | Task file | `.aios-core/development/tasks/{nome}.md` |
| Business Process | Workflow | `workflows/{nome}.yaml` |
| Compliance check | Quality Gate | `.aios-core/core/quality-gates/` |
| Política de governança | Hook | `.claude/hooks/{nome}.py` |
| Organograma | Agent Teams | `.aios-core/development/agent-teams/` |
| Manual do funcionário | Data/KB | `squads/{nome}/data/` |
| Escritório do consultor | Mind directory | `squads/mmos-squad/minds/{slug}/` |
| Memória institucional | Memory modules | `.aios-core/core/memory/` |
| Máquina de produção | Execution engine | `.aios-core/core/execution/` (11 módulos) |

---

# PARTE II — ORGANOGRAMA COMPLETO DA ORGANIZAÇÃO

## Inventário Validado (contra código real)

```
ORGANIZAÇÃO AIOS — MarkmanAi/aios-core
│
├── 12 Agentes Core            (.aios-core/development/agents/)
├── 25 Agentes Claude Code     (.claude/agents/)  ← inclui neo.md bridge
├── 10 Agentes MMOS            (squads/mmos-squad/agents/)
├──  4 Agentes Squad-Creator   (squads/squad-creator/agents/)  ← inclui thiago_finch
├── TOTAL: 51 agentes ativos
│
├── 27 Mentes Clonadas         (squads/mmos-squad/minds/)
├── 195 Tasks Core             (.aios-core/development/tasks/)
├──  27 Tasks MMOS              (squads/mmos-squad/tasks/)
├──  16 Tasks Squad-Creator     (squads/squad-creator/tasks/)
├──   7 Tasks Neo               (.neo/tasks/)
├── TOTAL: 245 procedures
│
├── 14 Workflows               (.aios-core/development/workflows/)
├── 9 Hooks de governança      (.claude/hooks/)
├── 8 Skills                   (.claude/skills/)
├── 5 Team presets             (.aios-core/development/agent-teams/)
├── 5 Adapters                 (squads/mmos-squad/adapters/)
├── 2 Squads                   (squads/)
│
├── KERNEL: 18 módulos         (.aios-core/core/)
│   ├── 32 módulos orchestration
│   ├── 11 módulos execution
│   ├── 10 módulos quality-gates
│   └──  5 módulos memory
│
└── 6.315 arquivos TOTAL
```

---

## NÍVEL 0 — META-ARQUITETO (Fora da Hierarquia)

| Cargo | Agente | Onde Vive | O Que Faz |
|-------|--------|-----------|-----------|
| **Matrix Architect** | neo | `.neo/NEO.md` (bridge: `.claude/agents/neo.md`) | Vê o AIOS de FORA. Não opera dentro da organização — projeta a organização. Posiciona todo novo agente, mind, squad e workflow no organograma ANTES de criá-los. Guardião desta Constituição. Ativa: `@neo`. |

> **Por que Nível 0?** Neo não está na hierarquia operacional. Ele é o arquiteto que define a hierarquia. Posicioná-lo em qualquer nível operacional contradiz sua função.

---

## NÍVEL 1 — C-LEVEL (Liderança Executiva)

| Cargo | Agente | Size | O Que Faz na Organização |
|-------|--------|------|--------------------------|
| **CEO** | aios-master (Orion) | 15.386B | Conhece toda a operação. Ponto de entrada. Delega para todos. Mantém contexto global. Ativa agentes via `@` syntax. |
| **CTO** | architect (Aria) | 18.955B | Maior autoridade técnica. Define arquitetura. Valida viabilidade. Tem memory própria. Veta decisões técnicas. |
| **CPO** | po (Pax) | 12.765B | Decide o que tem valor de negócio. Valida stories. Prioriza backlog. Aceita ou rejeita entregas. |

---

## NÍVEL 2 — DIRETORIA

| Cargo | Agente/Entidade | Onde Vive | O Que Faz |
|-------|----------------|-----------|-----------|
| **VP de Talento & Inteligência** | Squad Chief (skill: squad) | `.claude/skills/squad.md` + `.claude/agents/squad.md` | 33 comandos. Cria squads inteiros. Clona mentes. Comanda 3 subagentes: @oalanicolas, @pedro-valerio, @sop-extractor. |
| **Director de Inteligência** | Mind Mapper (MMOS) | `squads/mmos-squad/agents/mind-mapper.md` | Orquestrador do pipeline MMOS. `*map {nome}` auto-detecta tudo. Coordena 10 agentes. |
| **Director de Operações MMOS** | Mind PM (MMOS) | `squads/mmos-squad/agents/mind-pm.md` | Pipeline state, checkpoints, rollbacks, quality validation. |
| **Director de Produto** | pm (Morgan) | `.aios-core/development/agents/pm.md` (15.118B) | Cria PRDs. Traduz necessidade de negócio em especificação. |

---

## NÍVEL 3 — GERÊNCIA

| Cargo | Agente | Size | Função |
|-------|--------|------|--------|
| **Scrum Master** | sm | 11.077B | Cria stories, gerencia sprint, fragmenta épicos em unidades executáveis. |
| **Research Manager** | analyst | 10.175B | Análise de mercado, competidores, requisitos. Primeiro a atuar nos greenfield. |
| **Design Manager** | ux-design-expert | 18.073B | UX research, wireframes, design system, acessibilidade. |
| **Data Manager** | data-engineer | 20.286B | Banco de dados, schemas, migrações, ETL, data pipelines. |
| **Infra Manager** | devops | 18.877B | CI/CD, deploy, ambiente, infraestrutura, monitoring. |

---

## NÍVEL 4 — ESPECIALISTAS SENIORES

### Os 3 Subagentes do VP de Talento

| Agente | Modelo | Ferramentas | Restrição Chave | Função |
|--------|--------|-------------|-----------------|--------|
| **@oalanicolas** (Cirurgião de DNA) | Opus | Read, Grep, WebSearch, WebFetch, Write, Edit | SEM Bash, SEM Task | Extrai Voice DNA + Thinking DNA. Operação mais delicada do sistema. Conclusão: `<promise>COMPLETE</promise>` |
| **@pedro-valerio** (Auditor Supremo) | Opus | Read, Grep, Glob | **SOMENTE LEITURA** — não pode escrever NADA | "Se o executor CONSEGUE fazer errado → processo está errado." Read-only por design de governança. |
| **@sop-extractor** (Extrator de SOPs) | Sonnet | Read, Grep, Write | Modelo mais leve (custo) | Extrai procedimentos de vídeos, livros, entrevistas. |

### Agentes MMOS Especializados

| Agente | Função na Organização |
|--------|----------------------|
| **Cognitive Analyst** | Arqueólogo mental — executa análise de 8 camadas DNA Mental™ (6-8h) |
| **Identity Analyst (Sarah)** | Psicóloga organizacional — Camadas 6-8 com 🔴 CHECKPOINT HUMANO |
| **Charlie Synthesis Expert** | Sintetizador — conecta 8 camadas em lattice de conhecimento |
| **System Prompt Architect** | Compilador — transforma mapa cognitivo em system prompt de produção (4-6h) |
| **Research Specialist** | Caçador de fontes — descobre, coleta, organiza 20+ fontes por mind |
| **Data Importer (DataSync)** | Importador para Supabase — validate → preview → import |
| **Emulator (Mirror)** | Channeler — invoca mentes: single, `*duo`, `*roundtable` |
| **Debate Orchestrator** | Moderador — 6 frameworks de debate entre mentes clonadas |

---

## NÍVEL 4B — ESPECIALISTAS SQUAD-CREATOR

> **Path:** `squads/squad-creator/agents/` — ausentes do organograma original (GAP-ORG-001 resolvido)

| Agente | Modelo | Ferramentas | Função |
|--------|--------|-------------|--------|
| **@oalanicolas** (squad-creator) | Opus | Read, Grep, WebSearch, WebFetch, Write, Edit | Versão departamental do cirurgião de DNA. Extrai Voice DNA + Thinking DNA para o squad-creator. |
| **@sop-extractor** (squad-creator) | Sonnet | Read, Grep, Write | Versão departamental do extrator de SOPs. |
| **@squad-architect** | Opus | Read, Write, Edit, Bash, Grep, Glob | Arquiteto de squads — projeta estrutura, define agentes, tasks e workflows de novos squads. |

> **Reporta para:** Squad Chief (VP de Talento)
> **Diferença dos homônimos em `.claude/agents/`:** Os agentes acima são versões especializadas que vivem dentro do squad-creator e operam em contexto departamental.

---

## NÍVEL 5 — OPERAÇÕES

| Cargo | Agente | Size | Função |
|-------|--------|------|--------|
| **Desenvolvedor Sênior** | dev (Dex) | **22.912B** (MAIOR agente) | Operário mais produtivo. Implementa código, testes, docs. Maior porque precisa de mais instruções. |
| **QA Sênior** | qa (Quinn) | 16.141B | Fiscal. QA Loop com até 3 iterações antes de escalar para humano. |
| **Squad Builder** | squad-creator (Craft) | 12.076B | Construtor técnico de squads. 19 comandos: design, create, validate, analyze, extend, migrate. |

---

## NÍVEL 6 — CHIEFS ESPECIALIZADOS (Agentes Claude Code)

| Agente | Departamento Virtual |
|--------|---------------------|
| copy-chief | Copywriting |
| cyber-chief | Cybersegurança |
| data-chief | Dados & Analytics |
| db-sage | Banco de Dados |
| design-chief | Design Visual |
| design-system | Design System |
| legal-chief | Jurídico |
| story-chief | Stories & Narrativas |
| tools-orchestrator | Ferramentas & Integrações |
| traffic-masters-chief | Tráfego & Growth |

---

## NÍVEL 7 — CONSELHO DE CONSULTORES (27 Mentes Clonadas)

| Domínio | Consultores | Quantidade |
|---------|------------|------------|
| **Tecnologia & IA** | Elon Musk, Sam Altman, Paul Graham, Andrej Karpathy, Ray Kurzweil, Mitchell Hashimoto, Guillermo Rauch | 7 |
| **Produto & Design** | Marty Cagan, Steve Jobs, Jeff Patton, Don Norman, Brad Frost, Kent Beck, Cagan Patton | 7 |
| **Marketing & Copy** | Seth Godin, Eugene Schwartz, Alex Hormozi, Thiago Finch | 4 |
| **Psicologia & Pensamento** | Daniel Kahneman, Napoleon Hill, Kapil Gupta | 3 |
| **Sabedoria** | Jesus Cristo | 1 |
| **Especialistas BR** | Pedro Valério, Alan Nicolas, Adriano de Marqui, João Lozano, Jose Amorim | 5 |

Cada consultor tem seu escritório padronizado:
```
minds/{slug}/
├── sources/           → Material bruto (livros, transcrições, artigos)
├── artifacts/         → Análises das 8 camadas
├── system_prompts/    → Prompts de produção (generalista + especialistas)
├── kb/                → Knowledge base em chunks otimizados
├── docs/              → Documentação, logs, status
└── metadata.yaml      → Estado do pipeline
```

---

# PARTE III — O CORPO INTERNO DA ORGANIZAÇÃO

## O Sistema Nervoso Central — Kernel (18 módulos funcionais)

```
.aios-core/core/
├── config              DNA da organização (loader, resolver, cache)
├── elicitation         Como a organização faz perguntas (engine, session)
├── events              Comunicação interna (dashboard emitter)
├── execution           Máquina de produção — 11 módulos:
│   ├── autonomous-build-loop.js
│   ├── build-orchestrator.js      ← Orquestra builds
│   ├── parallel-executor.js       ← Execução paralela
│   ├── wave-executor.js           ← Execução em ondas
│   ├── subagent-dispatcher.js     ← Despacha para subagentes
│   ├── rate-limit-manager.js      ← Controle de limites
│   ├── semantic-merge-engine.js   ← Merge inteligente
│   ├── context-injector.js        ← Injeta contexto
│   ├── build-state-manager.js     ← Estado do build
│   ├── parallel-monitor.js        ← Monitora paralelos
│   └── result-aggregator.js       ← Agrega resultados
├── health-check        Check-up organizacional (5 categorias, 30+ checks)
├── ideation            Brainstorming assistido
├── manifest            Identidade da organização
├── mcp                 Portas para o mundo externo
├── memory              Memória institucional — 5 módulos:
│   ├── context-snapshot.js        ← Foto do momento
│   ├── file-evolution-tracker.js  ← Evolução de arquivos
│   ├── gotchas-memory.js          ← Armadilhas aprendidas
│   └── timeline-manager.js        ← Linha do tempo
├── migration           Evolução estrutural
├── orchestration       Cérebro operacional (32 módulos)
├── permissions         Controle de acesso
├── quality-gates       Compliance em 3 camadas:
│   ├── layer1-precommit.js        ← Antes de commitar
│   ├── layer2-pr-automation.js    ← No Pull Request
│   ├── layer3-human-review.js     ← Revisão humana
│   └── quality-gate-manager.js    ← Orquestra as 3 camadas
├── registry            Registro central de serviços
├── session             Estado da sessão
├── ui                  Interface
└── utils               Utilitários
```

## O Sistema Circulatório — 14 Workflows

### Workflows Universais (usados diariamente)
| Workflow | O Que Conecta |
|----------|---------------|
| **spec-pipeline** | Ideia → Especificação formal (6 fases, "No Invention") |
| **story-development-cycle** | Story: criar → validar → implementar → QA (3 modos: YOLO, Interactive, Pre-Flight) |
| **qa-loop** | Review → Fix → Review (até 3x, depois escala para humano) |
| **auto-worktree** | Cria branch isolada Git para cada story |

### Workflows Greenfield (construir do zero)
| Workflow | O Que Constrói |
|----------|---------------|
| **greenfield-fullstack** | App completa do zero (4 fases) |
| **greenfield-ui** | Frontend do zero |
| **greenfield-service** | Backend/API do zero |

### Workflows Brownfield (melhorar existente)
| Workflow | O Que Melhora |
|----------|---------------|
| **brownfield-discovery** | Auditoria completa (usa TODOS os agentes, 4-8h) |
| **brownfield-fullstack** | App existente (18 steps) |
| **brownfield-ui** | Frontend existente |
| **brownfield-service** | Backend existente |

### Workflows Especiais
| Workflow | Propósito |
|----------|-----------|
| **design-system-build-quality** | Validação Design System: Build → Docs → A11y → ROI |
| **development-cycle** | Ciclo genérico de desenvolvimento |
| **epic-orchestration** | Orquestração de épicos |

**O fluxo sanguíneo universal:** Spec Pipeline → Greenfield/Brownfield → Auto-Worktree → Story Dev Cycle → QA Loop

## Os Sentidos — 5 Adapters

| Adapter | O Que Percebe |
|---------|--------------|
| **source-adapter.js** | YouTube, PDFs, Word, Excel, CSV, blogs, TikTok. Hub central (323 linhas). Chunking semântico. Batch paralelo. |
| **storage-adapter.js** | Google Drive — upload/download de fontes na nuvem |
| **mcp-adapter.js** | EXA (web search), Context7 (docs), Playwright (browser automation) |
| **project-adapter.js** | ClickUp — tracking de projeto |
| **index.js** | Exporta todos os adapters como módulo unificado |

## As Políticas de Governança — 9 Hooks

| Hook | Política que Aplica |
|------|-------------------|
| **enforce-architecture-first.py** | Zero código sem arquitetura aprovada |
| **mind-clone-governance.py** | Regras de clonagem de mentes |
| **write-path-validation.py** | Arquivos nos paths corretos |
| **sql-governance.py** | Queries SQL seguras |
| **slug-validation.py** | Formato de slugs padronizado |
| **read-protection.py** | Proteção de arquivos sensíveis |
| **pre-commit-mmos-guard.sh** | Integridade do MMOS no commit |
| **pre-commit-version-check.sh** | Versão correta no commit |
| **install-hooks.sh** | Instalador dos hooks |

## Configurações de Equipe — 5 Presets

| Preset | Para Que Serve |
|--------|---------------|
| **team-all.yaml** | Todos os 12 agentes core ativos |
| **team-fullstack.yaml** | Front + Back (sem UX, sem Data) |
| **team-ide-minimal.yaml** | Mínimo para IDE funcionar |
| **team-no-ui.yaml** | Backend only (sem agentes de UI) |
| **team-qa-focused.yaml** | Foco em qualidade (QA + Dev + Architect) |

---

# PARTE IV — PRINCÍPIOS INVIOLÁVEIS

Estes princípios são a cultura da organização. Não são sugestões — são leis.

## 1. Separation of Concerns
Quem faz NÃO é quem valida. @oalanicolas extrai DNA, @pedro-valerio audita. @dev implementa, @qa testa. Sempre. Sem exceção.

## 2. Process > People
"Se o executor CONSEGUE fazer errado → o processo está errado." Qualidade depende do processo, não do agente ser competente.

## 3. No Invention
Zero informação inventada. No Spec Pipeline, todo statement rastreia para requisito. Na clonagem, tudo vem de fontes com triangulação (3+ fontes independentes).

## 4. Human Checkpoint
Camadas 6-8 do DNA Mental (valores, obsessões, contradições) PARAM para validação humana. A organização conhece seus limites.

## 5. Read-Only Auditor
@pedro-valerio não pode escrever. Ferramentas: Read, Grep, Glob. NADA MAIS. Auditor que pode editar é conflito de interesse.

## 6. Skin in the Game
Mentes clonadas são de pessoas que arriscaram reputação, dinheiro ou carreira. Teóricos puros sem consequências não entram no conselho.

## 7. The Gold Layer
Camada 8 (Contradições Produtivas) é inegociável no pipeline de clonagem. É o que separa clones autênticos (94% fidelidade) de bots genéricos (30%).

---

# PARTE V — COMO POSICIONAR NOVOS MEMBROS

## Regra: Nada Entra Sem Posição Definida

Antes de criar qualquer coisa nova na organização, Neo (ou quem estiver criando) DEVE responder:

### Para Novo Agente
```
1. Cargo no organograma: ___
2. Nível (C-Level/Director/Manager/Specialist/Operations): ___
3. Departamento (squad): ___
4. Reporta para: ___
5. Comanda: ___
6. Modelo LLM (opus/sonnet/haiku): ___
7. Ferramentas permitidas: ___
8. Task principal (.md): ___
9. Quem valida seu trabalho: ___
10. Gap que preenche: "Por que a organização PRECISA deste membro?"
11. Valor único: "O que ele faz que NINGUÉM mais faz?"
```

### Para Novo Consultor (Mind Clone)
```
1. Nome real da pessoa: ___
2. Slug (snake_case): ___
3. Domínio (tecnologia/produto/marketing/etc): ___
4. APEX Score (0-100): ___
5. ICP Match (0-100%): ___
6. Decisão (GO/NO-GO): ___
7. Área no conselho: ___
8. Consultores que complementa: ___
9. Gap que preenche: "Por que precisamos desta mente?"
```

### Para Novo Squad (Departamento)
```
1. Nome do squad: ___
2. Propósito: "Por que este departamento existe?"
3. Reporta para: aios-master (CEO)
4. Interage com: [squads existentes]
5. Agente líder (orchestrator): ___
6. Agentes membros: ___
7. Tasks que vai precisar: ___
8. Quem audita: ___
9. Quality gate aplicável: ___
```

---

# PARTE VI — NÚMEROS DEFINITIVOS DA ORGANIZAÇÃO

| Componente | Quantidade Validada |
|------------|-------------------|
| Arquivos totais | **6.315** |
| Agentes Core | **12** |
| Agentes Claude Code | **25** ← inclui neo.md bridge |
| Agentes MMOS | **10** |
| Agentes Squad-Creator | **4** ← inclui thiago_finch |
| **TOTAL AGENTES** | **51** |
| Mentes clonadas | **27** |
| Tasks (Core + MMOS + Squad-Creator + Neo) | **245** (195 + 27 + 16 + 7) |
| Workflows | **14** |
| Hooks de governança | **9** |
| Skills | **8** |
| Team presets | **5** |
| Adapters | **5** |
| Módulos do kernel | **18** |
| Módulos de orchestration | **32** |
| Módulos de execution | **11** |
| Módulos de quality-gates | **10** |
| Módulos de memory | **5** |
| Squads (departamentos) | **2** |

---

> **Este documento é a constituição permanente. O Agente Neo é seu guardião.**
> **Validado contra 6.315 arquivos reais do repositório MarkmanAi/aios-core (REPO_PATH_MAP_v2 — 2026-02-22).**
