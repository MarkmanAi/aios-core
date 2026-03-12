# FertiliMap v2 — Product Backlog

**Produto:** FertiliMap™ v2
**PO:** Pax (@po)
**Architect:** Aria (@architect)
**Criado em:** 2026-03-06
**Fonte:** `docs/fertilimap-v2-architecture.md`

---

## VISAO DO PRODUTO

> Plataforma web de avaliação de riscos genéticos e reprodutivos baseada em evidências científicas (ACOG, ASRM), com questionário inteligente de 6 seções, algoritmo de scoring server-side, relatório personalizado com gráficos interativos, export PDF profissional e dashboard de histórico para pacientes e médicos.

**Diferencial v2 vs original:**
- Backend real com persistência (Supabase)
- Algoritmo server-side auditável e versionado
- Score 0-100 com percentil populacional
- Narrativa personalizada via Claude API
- Portal médico/geneticista
- Mobile-first + WCAG 2.1 AA

---

## MAPEAMENTO DE EPICS

| Epic | Nome | Prioridade | Sprint | Complexidade |
|------|------|-----------|--------|-------------|
| E-01 | Foundation & Infrastructure | Must Have | 1 | M |
| E-02 | Landing Page | Must Have | 1 | S |
| E-03 | Questionário — Engine & Seções 1-3 | Must Have | 1 | L |
| E-04 | Questionário — Seções 4-6 & Auto-save | Must Have | 2 | L |
| E-05 | Algoritmo de Risco (server-side) | Must Have | 3 | XL |
| E-06 | Resultados & Visualizações | Must Have | 3 | L |
| E-07 | Relatório PDF & Email | Must Have | 4 | L |
| E-08 | Autenticação & Dashboard Paciente | Should Have | 5 | L |
| E-09 | Portal Médico/Geneticista | Should Have | 5 | L |
| E-10 | IA Narrativa (Claude API) | Could Have | 6 | M |
| E-11 | Polish, Acessibilidade & Launch | Must Have | 6 | M |

---

## BACKLOG DETALHADO POR EPIC

---

### EPIC E-01: Foundation & Infrastructure

**Objetivo:** Projeto configurado, stack rodando, CI/CD ativo, banco esquematizado.

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E01-S01 | Setup Next.js 15 + App Router + TypeScript | Must | 3pts | — |
| E01-S02 | Setup Tailwind CSS v4 + ShadCN UI + Radix | Must | 2pts | E01-S01 |
| E01-S03 | Setup Supabase (projeto, Auth, Storage) | Must | 3pts | E01-S01 |
| E01-S04 | Schema Supabase: tabelas `assessments`, `users`, RLS | Must | 5pts | E01-S03 |
| E01-S05 | Setup CI/CD: GitHub Actions + Vercel deploy | Must | 3pts | E01-S01 |
| E01-S06 | Setup Vitest + Testing Library + E2E Playwright | Should | 3pts | E01-S01 |
| E01-S07 | Configurar ESLint, Prettier, Husky pre-commit | Should | 2pts | E01-S01 |
| E01-S08 | Setup Zustand para estado global do questionário | Must | 2pts | E01-S01 |
| E01-S09 | Setup Zod schemas para validação de formulários | Must | 2pts | E01-S01 |
| E01-S10 | Setup React Hook Form integrado com Zod | Must | 2pts | E01-S09 |

**Total Epic E-01:** 27pts

---

### EPIC E-02: Landing Page

**Objetivo:** Página de entrada que converte visitantes em avaliações iniciadas.

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E02-S01 | Hero section: headline, subheadline, CTA "Começar Avaliação" | Must | 3pts | E01-S02 |
| E02-S02 | Seção "O que você receberá" (3 cards de benefícios) | Must | 2pts | E01-S02 |
| E02-S03 | Seção "Como funciona" (3 passos: questionário → análise → relatório) | Must | 2pts | E01-S02 |
| E02-S04 | Seção de credibilidade (baseado em ACOG, ASRM, peer-reviewed) | Should | 2pts | E01-S02 |
| E02-S05 | Seção de depoimentos/social proof | Could | 2pts | E01-S02 |
| E02-S06 | Footer com disclaimer médico e links | Must | 1pts | E01-S02 |
| E02-S07 | SEO: meta tags, Open Graph, sitemap | Should | 2pts | E02-S01 |
| E02-S08 | Analytics: Posthog page view + CTA click events | Should | 2pts | E02-S01 |
| E02-S09 | Responsividade mobile-first | Must | 2pts | E02-S01 |

**Total Epic E-02:** 18pts

---

### EPIC E-03: Questionário — Engine & Seções 1-3

**Objetivo:** Wizard multi-step funcional com as 3 primeiras seções.

**Componentes a criar:**
- `QuestionnaireWizard` — orquestra steps e navegação
- `ProgressBar` — visual animada com nome da seção
- `SectionHeader` — título + descrição + ícone
- `FormField` — wrapper universal: label, tooltip, erro, validação
- `CheckboxGroup` — multi-select com ícone, label e descrição clínica
- `RiskAlert` — alerta inline imediato quando resposta gera risco
- `AutoSaveIndicator` — feedback visual de auto-save

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E03-S01 | Componente `QuestionnaireWizard` com roteamento por step | Must | 5pts | E01-S08 |
| E03-S02 | Componente `ProgressBar` animada (% + nome da seção) | Must | 2pts | E03-S01 |
| E03-S03 | Componente `FormField` universal (label + tooltip + erro) | Must | 3pts | E01-S10 |
| E03-S04 | Componente `CheckboxGroup` com descrições clínicas | Must | 3pts | E03-S03 |
| E03-S05 | Componente `RiskAlert` inline (warning imediato) | Should | 2pts | E03-S03 |
| E03-S06 | Auto-save localStorage a cada mudança de campo | Must | 3pts | E03-S01 |
| E03-S07 | Componente `AutoSaveIndicator` | Should | 1pts | E03-S06 |
| E03-S08 | **Seção 1: Dados Pessoais** — todos os campos (nome, data nasc, peso, altura, IMC auto, etnia, estado civil, escolaridade, idade pais) | Must | 5pts | E03-S03 |
| E03-S09 | Lógica de risco inline por IMC (alerta ao preencher peso/altura) | Must | 2pts | E03-S08 |
| E03-S10 | Lógica de risco inline por etnia (alerta ao selecionar) | Must | 2pts | E03-S08 |
| E03-S11 | **Seção 2: Histórico Genético Materno** — doenças na família, condições cromossômicas/metabólicas/neurológicas, malformações, aborto recorrente | Must | 8pts | E03-S04 |
| E03-S12 | Lógica condicional Seção 2: campo texto quando "malformação = Sim" | Must | 2pts | E03-S11 |
| E03-S13 | **Seção 3: Informações do Parceiro** — idade, etnia, saúde reprodutiva, doenças genéticas, consanguinidade + grau | Must | 8pts | E03-S04 |
| E03-S14 | Lógica condicional Seção 3: campo grau quando "consanguinidade = Sim" | Must | 2pts | E03-S13 |
| E03-S15 | Alerta de risco de consanguinidade inline (3-5x) | Must | 2pts | E03-S14 |
| E03-S16 | Navegação anterior/próximo com validação por seção | Must | 3pts | E03-S01 |
| E03-S17 | Persistência do estado ao navegar entre seções | Must | 2pts | E03-S06 |
| E03-S18 | Testes unitários dos componentes core do wizard | Should | 5pts | E03-S01 |

**Total Epic E-03:** 60pts

---

### EPIC E-04: Questionário — Seções 4-6 & Revisão

**Objetivo:** Completar o questionário com seções 4-6, revisão final e submissão.

**Componente a criar:**
- `ReviewSummary` — tabela resumo de todas as respostas antes de submeter

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E04-S01 | **Seção 4: História Reprodutiva** — gestações, partos, cesarianas, abortos espontâneos/provocados, ectópicas, complicações, natimorto, TRA prévia, tempo tentando conceber | Must | 8pts | E03-S17 |
| E04-S02 | Lógica condicional Seção 4: tipo de TRA quando "TRA = Sim" | Must | 2pts | E04-S01 |
| E04-S03 | Alertas inline Seção 4: >12m (subfertilidade), >24m (infertilidade), abortos múltiplos | Must | 3pts | E04-S01 |
| E04-S04 | **Seção 5: Hábitos e Condições de Saúde** — tabagismo, álcool, estresse, alimentação, ácido fólico, atividade física, medicamentos, sono, condições atuais (Diabetes, HAS, SOP, Endometriose, Autoimune, Tireoide), ISTs, exposição ambiental | Must | 10pts | E03-S17 |
| E04-S05 | Alertas inline Seção 5: tabagismo, álcool, sem ácido fólico, IMC alto | Must | 3pts | E04-S04 |
| E04-S06 | **Seção 6: Histórico Genético Paterno** — distúrbios cromossômicos/metabólicos/neurológicos família paterna, malformações, aborto recorrente | Must | 5pts | E03-S17 |
| E04-S07 | Componente `ReviewSummary` — resumo de todas as respostas por seção | Must | 5pts | E04-S06 |
| E04-S08 | Score de completude do questionário (% respondido) | Should | 3pts | E04-S07 |
| E04-S09 | Tela de processamento animada ("Analisando seus dados...") | Must | 2pts | E04-S07 |
| E04-S10 | Submissão dos dados à API `/api/risk-assessment` | Must | 3pts | E04-S09 |
| E04-S11 | Perguntas adicionais V2: ciclo menstrual, varicocele parceiro, DIU, PID, vacinas, saúde mental, exposição profissional | Should | 8pts | E04-S04 |
| E04-S12 | Testes de integração do fluxo completo do questionário | Should | 5pts | E04-S10 |

**Total Epic E-04:** 57pts

---

### EPIC E-05: Algoritmo de Risco (Server-Side)

**Objetivo:** Motor de scoring auditável, versionado, baseado em guidelines ACOG/ASRM, rodando 100% no servidor.

**Arquitetura do algoritmo:**
- Score 0-100 por categoria com pesos calibrados
- 4 categorias: Cromossômico, Monogênico, Reprodutivo, Multifatorial
- Percentil populacional por faixa etária
- Explicação de cada fator contribuinte
- Rastreabilidade: versão do algoritmo + versão da guideline

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E05-S01 | API route `POST /api/risk-assessment` — schema de entrada com Zod | Must | 3pts | E01-S09 |
| E05-S02 | Engine: Risco Cromossômico (0-100) — pesos por idade materna, histórico familiar, abortos, natimorto | Must | 8pts | E05-S01 |
| E05-S03 | Engine: Risco Monogênico (0-100) — doenças específicas, etnia, consanguinidade (multiplicador 3-5x), genética do parceiro | Must | 8pts | E05-S01 |
| E05-S04 | Engine: Risco Reprodutivo (0-100) — tempo conceber, ISTs, saúde reprodutiva do parceiro, ectópicas, TRA prévia, SOP, endometriose | Must | 8pts | E05-S01 |
| E05-S05 | Engine: Risco Multifatorial (0-100) — IMC, tabagismo, álcool, estresse, dieta, ácido fólico, condições de saúde, exposição ambiental, sedentarismo, sono | Must | 8pts | E05-S01 |
| E05-S06 | Conversão score 0-100 → nível semântico (Baixo/Moderado/Alto/Muito Alto) | Must | 2pts | E05-S02 |
| E05-S07 | Cálculo de percentil populacional por categoria e faixa etária | Should | 5pts | E05-S02 |
| E05-S08 | Geração de `risk_factors[]`: lista dos fatores que contribuíram para cada score | Must | 5pts | E05-S05 |
| E05-S09 | Geração de lista de exames recomendados (priorizada por score e fatores) | Must | 8pts | E05-S08 |
| E05-S10 | Geração de protocolo nutricional personalizado (baseado nos fatores) | Must | 5pts | E05-S08 |
| E05-S11 | Geração de plano de ação trimestral (baseado nos scores) | Must | 5pts | E05-S08 |
| E05-S12 | Geração de recomendações de reprodução assistida (baseado no score reprodutivo) | Should | 3pts | E05-S04 |
| E05-S13 | Versionamento do algoritmo (`algorithm_version`, `guideline_version`) | Must | 2pts | E05-S01 |
| E05-S14 | Persistência do assessment no Supabase | Must | 3pts | E01-S04 |
| E05-S15 | Testes unitários do engine: 100+ casos de teste por categoria | Must | 13pts | E05-S05 |
| E05-S16 | Documentação técnica do algoritmo com referências (DOIs) | Should | 5pts | E05-S15 |

**Total Epic E-05:** 91pts

---

### EPIC E-06: Resultados & Visualizações

**Objetivo:** Página de resultado rica, interativa, com 4 gauges, gráficos comparativos e lista de exames.

**Componentes a criar:**
- `RiskGauge` — gauge animado 0-100 por categoria
- `RiskRadar` — gráfico radar 4 categorias vs população geral
- `RiskBars` — barras comparativas paciente vs população
- `RiskExplainer` — "Por que este risco?" com fatores detalhados
- `ExamList` — lista priorizada filtrável por urgência/timing
- `NutritionProtocol` — cards de suplementação e dieta
- `ActionTimeline` — timeline trimestral interativa
- `ReportActions` — botões: PDF, email, compartilhar, agendar

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E06-S01 | Página `/resultado/[id]` — layout geral e carregamento do assessment | Must | 3pts | E05-S14 |
| E06-S02 | Componente `RiskGauge` animado para cada categoria (4 total) | Must | 5pts | E06-S01 |
| E06-S03 | Componente `RiskRadar` — radar chart 4 categorias vs população | Must | 5pts | E06-S01 |
| E06-S04 | Componente `RiskBars` — barras comparativas por fator | Should | 3pts | E06-S01 |
| E06-S05 | Componente `RiskExplainer` — lista de fatores por categoria com explicação | Must | 5pts | E05-S08 |
| E06-S06 | Componente `ExamList` — lista priorizada com filtro por urgência, timing, local | Must | 5pts | E05-S09 |
| E06-S07 | Componente `NutritionProtocol` — cards de suplementação + dieta + alimentos proibidos | Must | 3pts | E05-S10 |
| E06-S08 | Componente `ActionTimeline` — timeline interativa pré-concepcional e trimestres | Must | 5pts | E05-S11 |
| E06-S09 | Seção de Reprodução Assistida (se indicada) | Should | 3pts | E05-S12 |
| E06-S10 | Componente `ReportActions` — botões PDF, email, compartilhar | Must | 2pts | E06-S01 |
| E06-S11 | Disclaimer médico no rodapé do resultado | Must | 1pts | E06-S01 |
| E06-S12 | Referências científicas (com DOIs) na seção de resultado | Should | 2pts | E06-S01 |
| E06-S13 | Score de percentil exibido ("Você está no percentil X%") | Should | 2pts | E05-S07 |
| E06-S14 | Responsividade mobile-first da página de resultado | Must | 3pts | E06-S02 |
| E06-S15 | Link de compartilhamento seguro (token temporário, expira em 7 dias) | Should | 5pts | E05-S14 |

**Total Epic E-06:** 52pts

---

### EPIC E-07: Relatório PDF & Email

**Objetivo:** PDF profissional gerado no servidor com todos os dados, exportável e enviável por email.

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E07-S01 | Setup React PDF (server-side rendering) | Must | 3pts | E01-S01 |
| E07-S02 | Template PDF: capa com nome, data, disclaimer | Must | 3pts | E07-S01 |
| E07-S03 | Template PDF: seção de scores com gauges (gráfico estático) | Must | 5pts | E07-S01 |
| E07-S04 | Template PDF: lista de exames priorizada | Must | 3pts | E07-S01 |
| E07-S05 | Template PDF: protocolo nutricional | Must | 3pts | E07-S01 |
| E07-S06 | Template PDF: plano de ação trimestral | Must | 3pts | E07-S01 |
| E07-S07 | Template PDF: referências científicas + disclaimer completo | Must | 2pts | E07-S01 |
| E07-S08 | Template PDF: QR Code para versão digital | Could | 2pts | E07-S01 |
| E07-S09 | Template PDF: Relatório Executivo (1 página resumo) | Should | 5pts | E07-S02 |
| E07-S10 | API route `GET /api/generate-pdf/[id]` — stream do PDF gerado | Must | 3pts | E07-S07 |
| E07-S11 | Armazenamento do PDF no Supabase Storage | Should | 2pts | E07-S10 |
| E07-S12 | Setup Resend para envio de email | Should | 2pts | E01-S03 |
| E07-S13 | Template email: envio do relatório com PDF anexo | Should | 3pts | E07-S12 |
| E07-S14 | API route `POST /api/send-report` — envio por email | Should | 2pts | E07-S13 |
| E07-S15 | UI: modal de envio de email (campo + botão confirmar) | Should | 2pts | E06-S10 |

**Total Epic E-07:** 43pts

---

### EPIC E-08: Autenticação & Dashboard Paciente

**Objetivo:** Usuária pode salvar conta, ver histórico de avaliações e comparar evolução de risco.

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E08-S01 | Setup Supabase Auth (email + magic link) | Should | 3pts | E01-S03 |
| E08-S02 | Setup Supabase Auth Google OAuth | Could | 2pts | E08-S01 |
| E08-S03 | Telas de cadastro, login, recuperação de senha | Should | 5pts | E08-S01 |
| E08-S04 | Guard de rotas autenticadas `/dashboard/*` | Should | 2pts | E08-S01 |
| E08-S05 | Dashboard `/dashboard` — overview com último assessment | Should | 3pts | E08-S04 |
| E08-S06 | Histórico `/dashboard/historico` — lista de avaliações anteriores | Should | 3pts | E08-S05 |
| E08-S07 | Comparação `/dashboard/comparar` — evolução dos scores ao longo do tempo | Should | 5pts | E08-S06 |
| E08-S08 | Integração: salvar assessment vinculado ao usuário autenticado | Should | 3pts | E08-S01 |
| E08-S09 | Perfil do usuário (nome, dados básicos, deletar conta LGPD) | Should | 3pts | E08-S03 |
| E08-S10 | Opção de continuar questionário como anônimo (sem cadastro) | Must | 2pts | E08-S01 |

**Total Epic E-08:** 31pts

---

### EPIC E-09: Portal Médico/Geneticista

**Objetivo:** Profissionais de saúde podem ver relatórios de pacientes, com acesso via compartilhamento seguro.

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E09-S01 | Role `medico` no Supabase Auth + RLS | Should | 3pts | E08-S01 |
| E09-S02 | Tela de login exclusiva para médicos | Should | 2pts | E09-S01 |
| E09-S03 | Dashboard médico `/medico/pacientes` — lista de pacientes | Should | 5pts | E09-S01 |
| E09-S04 | Visualização de relatório de paciente `/medico/relatorio/[id]` | Should | 5pts | E09-S03 |
| E09-S05 | Acesso via link compartilhado (token temporário sem login) | Should | 3pts | E06-S15 |
| E09-S06 | Anotações do médico no relatório do paciente | Could | 5pts | E09-S04 |
| E09-S07 | CTA "Agendar Consulta" com integração de calendário | Could | 5pts | E09-S04 |

**Total Epic E-09:** 28pts

---

### EPIC E-10: IA Narrativa (Claude API)

**Objetivo:** Interpretação narrativa personalizada dos resultados gerada por IA, explicando os riscos em linguagem acessível.

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E10-S01 | Integração Claude API (Anthropic SDK) | Could | 2pts | E05-S14 |
| E10-S02 | Prompt engineering: narrativa de risco personalizada (tom empático, não alarmista) | Could | 5pts | E10-S01 |
| E10-S03 | Streaming da narrativa na tela de resultado | Could | 3pts | E10-S02 |
| E10-S04 | Narrativa incluída no PDF | Could | 3pts | E10-S02 |
| E10-S05 | Disclaimer: "texto gerado por IA, não substitui avaliação médica" | Could | 1pts | E10-S03 |

**Total Epic E-10:** 14pts

---

### EPIC E-11: Polish, Acessibilidade & Launch

**Objetivo:** Produto pronto para produção com mobile-first, WCAG 2.1 AA, analytics e SEO.

| ID | Story | Prioridade | Estimativa | Dependências |
|----|-------|-----------|-----------|-------------|
| E11-S01 | Auditoria e correção mobile-first em todas as telas | Must | 5pts | E06-S14 |
| E11-S02 | Auditoria WCAG 2.1 AA — contraste, focus, screen reader | Must | 8pts | E11-S01 |
| E11-S03 | Modo escuro / modo claro | Could | 3pts | E01-S02 |
| E11-S04 | Setup Posthog: funil de conversão, eventos do questionário, drop-offs | Should | 3pts | E02-S01 |
| E11-S05 | Otimização de performance: Core Web Vitals (LCP, CLS, FID) | Should | 5pts | E11-S01 |
| E11-S06 | SEO: meta tags dinâmicas, robots.txt, sitemap.xml | Should | 2pts | E02-S07 |
| E11-S07 | Testes E2E: fluxo completo questionário → resultado → PDF | Must | 8pts | E04-S12 |
| E11-S08 | Política de privacidade e LGPD | Must | 3pts | E02-S06 |
| E11-S09 | Rate limiting na API de assessment | Must | 2pts | E05-S01 |
| E11-S10 | Monitoramento de erros (Sentry ou similar) | Should | 2pts | E01-S05 |

**Total Epic E-11:** 41pts

---

## RESUMO DO BACKLOG

| Epic | Stories | Total Pts | Sprint | Prioridade |
|------|---------|-----------|--------|-----------|
| E-01: Foundation | 10 | 27 | 1 | Must Have |
| E-02: Landing Page | 9 | 18 | 1 | Must Have |
| E-03: Questionário Seções 1-3 | 18 | 60 | 1 | Must Have |
| E-04: Questionário Seções 4-6 | 12 | 57 | 2 | Must Have |
| E-05: Algoritmo de Risco | 16 | 91 | 3 | Must Have |
| E-06: Resultados & Visualizações | 15 | 52 | 3 | Must Have |
| E-07: PDF & Email | 15 | 43 | 4 | Must Have |
| E-08: Auth & Dashboard | 10 | 31 | 5 | Should Have |
| E-09: Portal Médico | 7 | 28 | 5 | Should Have |
| E-10: IA Narrativa | 5 | 14 | 6 | Could Have |
| E-11: Polish & Launch | 10 | 41 | 6 | Must Have |
| **TOTAL** | **127** | **462pts** | **6 sprints** | — |

---

## PRIORIZAÇÃO MoSCoW

### Must Have (MVP — Sprints 1-4)
- Foundation completa (E-01)
- Landing Page (E-02)
- Questionário completo 6 seções (E-03, E-04)
- Algoritmo de risco server-side (E-05)
- Resultados com gauges e gráficos (E-06)
- PDF profissional + email (E-07)
- Polish mínimo e LGPD (E-11 parcial)

### Should Have (Sprints 5-6)
- Auth e dashboard da paciente (E-08)
- Portal médico básico (E-09)
- Analytics e SEO (E-11)

### Could Have (Backlog futuro)
- Narrativa IA Claude (E-10)
- Modo escuro (E-11-S03)
- Google OAuth (E-08-S02)
- Anotações do médico (E-09-S06)
- Calculadora de ovulação

### Won't Have (fora do escopo v2)
- App nativo iOS/Android
- Integração direta com laboratórios
- Telemedicina integrada (apenas CTA externo)
- Multi-idioma (apenas PT-BR)

---

## PERGUNTAS ADICIONAIS V2 (não cobertas no original)

Estas perguntas foram identificadas pelo `@architect` como lacunas clínicas importantes:

| # | Campo | Seção Sugerida | Impacto Clínico |
|---|-------|----------------|-----------------|
| P01 | Regularidade do ciclo menstrual (regular/irregular) | Seção 4 | SOP, anovulação |
| P02 | Duração do ciclo (dias) | Seção 4 | Oligomenorreia, polimenorreia |
| P03 | Intensidade do fluxo + dismenorreia | Seção 4 | Endometriose |
| P04 | Varicocele no parceiro | Seção 3 | Infertilidade masculina (15% dos casos) |
| P05 | DIU: histórico, tipo e duração | Seção 4 | PID, aderências |
| P06 | Histórico de PID | Seção 5 | Infertilidade tubária |
| P07 | Vacinas em dia (rubéola, hep B, tétano, varicela) | Seção 5 | Transmissão vertical |
| P08 | Contraceptivos hormonais: tipo, duração, quando parou | Seção 4 | Reserva ovariana |
| P09 | Saúde mental: tratamento psiquiátrico ativo + medicação | Seção 5 | Interação medicamentosa, risco fetal |
| P10 | Profissão com exposição de risco (noturno, radiação) | Seção 5 | Risco multifatorial |
| P11 | Histórico de radioterapia/quimioterapia | Seção 2 | Preservação de fertilidade |
| P12 | Uso de vitamina D, ômega-3, ferro além do ácido fólico | Seção 5 | Completude nutricional |
| P13 | SOP: diagnóstico formal ou suspeita | Seção 5 | Precisão do risco reprodutivo |
| P14 | Histórico de cirurgias abdominais/pélvicas | Seção 4 | Aderências, risco tubário |

---

## PRÓXIMOS PASSOS

1. **@pm** → Criar Epic formal no PM tool para cada E-0X
2. **@sm** → Detalhar stories do Sprint 1 (E-01 + E-02 + E-03)
3. **@architect** → Validar schema Supabase e estrutura de pastas do projeto
4. **@dev** → Setup do repositório FertiliMap v2 (Next.js 15)
5. **@qa** → Definir critérios de qualidade por seção

---

*Backlog criado por @po (Pax) — 2026-03-06*
*Fonte: `docs/fertilimap-v2-architecture.md` por @architect (Aria)*
