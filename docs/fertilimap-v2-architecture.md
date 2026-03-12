# FertiliMap v2 — Complete Site Map + Architecture

## 1. MAPEAMENTO COMPLETO DO SITE ORIGINAL

### Stack Técnica (Original)
| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19.1.1 (SPA) |
| Build | Vite |
| CSS | Tailwind CSS v4 |
| Components | ShadCN + Radix UI |
| PDF | jsPDF |
| Fonts | Inter (body) + Poppins (headings) |
| Backend | NENHUM — 100% client-side |
| Storage | Nenhum — dados não persistidos |

---

## 2. FLUXO DA APLICAÇÃO ORIGINAL

```
Landing Page
  └── CTA: "Começar Avaliação" / "Iniciar Avaliação Agora"
        └── Questionário Multi-step (6 seções)
              └── Análise IA (client-side)
                    └── Relatório de Risco
                          └── Export PDF
```

---

## 3. SEÇÕES DO QUESTIONÁRIO — TODOS OS CAMPOS

### SEÇÃO 1: Dados Pessoais

| Campo | Tipo | Opções / Validação |
|-------|------|--------------------|
| Nome Completo | Text input | Obrigatório |
| Data de Nascimento | Date picker | Obrigatório (age auto-calculada) |
| Peso (kg) | Number input | Obrigatório |
| Altura (cm) | Number input | Obrigatório |
| IMC | Calculado automaticamente | — |
| Etnia | Select | Caucasiana/Branca · Africana/Negra · Asiática · Parda/Mista · Indígena |
| Estado Civil | Select | — |
| Escolaridade | Select | — |
| Idade da Mãe ao Nascimento | Number input | Obrigatório |
| Idade do Pai ao Nascimento | Number input | Obrigatório |

**Lógica de risco por IMC:**
- IMC < 18.5 → risco de prematuridade e baixo peso ao nascer
- IMC 25-30 → risco de diabetes gestacional e hipertensão
- IMC ≥ 30 → risco muito aumentado de malformações (2-3x), diabetes (4x), pré-eclâmpsia (3x)

**Lógica de risco por etnia:**
- Caucasiana → fibrose cística (triagem recomendada)
- Africana → anemia falciforme (triagem recomendada)
- Asiática/mediterrânea → talassemia (triagem recomendada)

---

### SEÇÃO 2: Histórico Genético Materno

| Campo | Tipo | Opções |
|-------|------|--------|
| Doenças Genéticas na Família | Checkbox group | Doença de Huntington · Fibrose Cística · Anemia Falciforme · Talassemia · Fenilcetonúria · Síndrome de Down · Síndrome do X-Frágil · Deficiência de G6PD · Cardiopatias Congênitas · Hipotireoidismo Congênito · Deficiência Intelectual · Outras |
| Condições Cromossômicas | Checkbox group | — |
| Condições Metabólicas | Checkbox group | — |
| Condições Neurológicas | Checkbox group | — |
| Distúrbios Cromossômicos na Família | Checkbox group | — |
| Distúrbios Metabólicos na Família | Checkbox group | — |
| Distúrbios Neurológicos na Família | Checkbox group | — |
| Histórico de malformações congênitas na família? | Sim/Não | Se Sim → campo texto: Especifique o tipo |
| Histórico de aborto recorrente na família? | Sim/Não | — |
| Outras condições conhecidas na família | Textarea | Descrição livre |

---

### SEÇÃO 3: Informações do Parceiro

| Campo | Tipo | Opções |
|-------|------|--------|
| Idade do Parceiro | Number input | Obrigatório |
| Etnia do Parceiro | Select | Mesmas opções da Seção 1 |
| Condições de Saúde Reprodutiva | Checkbox group | Criptorquidia · Infertilidade Masculina · Azoospermia · Esperma baixa motilidade · Obstrução dos ductos deferentes · Ejaculação precoce · Disfunção erétil |
| Doenças Genéticas do Parceiro | Checkbox group | — |
| Condições Cromossômicas do Parceiro | Checkbox group | — |
| Condições Metabólicas do Parceiro | Checkbox group | — |
| Condições Neurológicas do Parceiro | Checkbox group | — |
| História Familiar do Parceiro | Checkbox/Textarea | — |
| Consanguinidade (relação de parentesco?) | Sim/Não | Se Sim → grau (1°, 2°, 3° grau) |

**Lógica de consanguinidade:**
- Presente → risco autossômico recessivo 3-5x maior
- Risco 2-3% para doenças genéticas graves (vs 0.5-1% na população geral)

---

### SEÇÃO 4: História Reprodutiva

| Campo | Tipo | Opções |
|-------|------|--------|
| Gestações Anteriores | Number input | — |
| Partos Normais | Number input | — |
| Cesarianas | Number input | — |
| Abortos Espontâneos | Number input | — |
| Abortos Provocados | Number input | — |
| Gestações Ectópicas | Number input | — |
| Complicações Gestacionais Anteriores | Checkbox group | Pré-eclâmpsia · Diabetes Gestacional · Restrição de Crescimento Fetal · Hemorragia Pós-parto · Outros |
| Histórico de natimorto | Sim/Não | — |
| Tratamentos de Reprodução Assistida | Sim/Não | Se Sim → FIV · ICSI · IIU · Indução de Ovulação |
| Tempo tentando conceber | Select | Ainda não tentei · < 6 meses · 6-12 meses · > 12 meses · > 24 meses |

**Lógica de risco reproductivo:**
- > 12 meses → possível subfertilidade
- > 24 meses → infertilidade, TRA pode ser necessária
- Múltiplos abortos → risco cromossômico aumentado
- Gestação ectópica → possível problema tubário
- Natimorto → risco aumentado de recorrência

---

### SEÇÃO 5: Hábitos e Condições de Saúde

| Campo | Tipo | Opções |
|-------|------|--------|
| Tabagismo | Select | Não fumo · Sim, fumo · Ex-fumante |
| Consumo de Álcool | Select | Não consumo · Ocasional (1-2x/mês) · Moderado (1-2x/semana) · Diário |
| Nível de Estresse | Select | Baixo · Moderado · Alto |
| Qualidade da Alimentação | Select | Excelente (natural/orgânica) · Boa · Regular · Ruim |
| Ácido Fólico | Select | Sim, tomo · Não tomo · Não uso |
| Atividade Física | Select | Sedentária · Leve (1-2x/semana) · Moderado (1-2x/semana) · Frequente (3+x/semana) · Diário |
| Medicamentos em Uso Regular | Textarea | — |
| Sono | Select | Adequado · Inadequado |
| Condições de Saúde Atuais | Checkbox group | Diabetes · Hipertensão Arterial Sistêmica · Doença autoimune · Doenças da Tireoide · SOP · Endometriose · Depressão/Ansiedade |
| ISTs (Infecções Sexualmente Transmissíveis) | Checkbox group | HIV · Sífilis · Hepatite B · Hepatite C · HPV · Herpes Genital · Gonorreia/Clamídia |
| Exposição Ambiental | Checkbox group | Pesticidas/Agrotóxicos · Poluição Ambiental Intensa · Produtos Químicos Industriais · Radiação |

---

### SEÇÃO 6: Histórico Genético Paterno

| Campo | Tipo | Opções |
|-------|------|--------|
| Distúrbios Cromossômicos na Família Paterna | Checkbox group | — |
| Distúrbios Metabólicos na Família Paterna | Checkbox group | — |
| Distúrbios Neurológicos na Família Paterna | Checkbox group | — |
| Malformações congênitas na família paterna? | Sim/Não | — |
| Aborto recorrente na família paterna? | Sim/Não | — |
| Outras condições conhecidas na família paterna | Textarea | Descrição livre |

---

## 4. ALGORITMO DE RISCO — 4 CATEGORIAS

### Categoria 1: Risco Cromossômico
**Principais fatores (por peso):**
- Idade materna: <25 (baixo) → 25-29 (baixo-normal) → 30-34 (moderado) → 35-39 (alto) → 40-44 (muito alto) → ≥45 (extremamente alto)
- Histórico familiar de distúrbios cromossômicos (+50% de risco)
- Múltiplos abortos espontâneos
- Natimorto prévio
- Idade dos pais ao nascimento da paciente

**Níveis:** Baixo / Moderado / Alto / Muito Alto

### Categoria 2: Risco Monogênico
**Principais fatores:**
- Doenças genéticas específicas na família
- Etnia (fibrose cística, anemia falciforme, talassemia)
- Consanguinidade (3-5x multiplicador)
- Doenças genéticas do parceiro
- Histórico genético paterno

**Níveis:** Baixo / Moderado / Alto / Muito Alto

### Categoria 3: Risco Reprodutivo
**Principais fatores:**
- Tempo tentando conceber (>12m subfertilidade, >24m infertilidade)
- Histórico de abortos recorrentes
- ISTs (HIV, Sífilis, Hepatite, Gonorreia/Clamídia)
- Condições reprodutivas do parceiro (azoospermia, criptorquidia)
- Gestações ectópicas prévias
- TRA prévia sem sucesso
- SOP, Endometriose

**Níveis:** Baixo / Moderado / Alto / Muito Alto

### Categoria 4: Risco Multifatorial
**Principais fatores:**
- IMC (sobrepeso/obesidade)
- Tabagismo
- Álcool
- Stress alto
- Dieta inadequada
- Ausência de ácido fólico
- Diabetes, Hipertensão, Doença autoimune, Tireoide
- Exposição ambiental (pesticidas, produtos químicos, radiação)
- Sedentarismo
- Sono inadequado

**Níveis:** Baixo / Moderado / Alto / Muito Alto

---

## 5. RELATÓRIO DE SAÍDA — ESTRUTURA COMPLETA

### 5.1 Painel de Risco (4 gauges/scores)
- Cromossômico, Monogênico, Reprodutivo, Multifatorial
- Cada um com nível e mensagem interpretativa

### 5.2 Gráficos Comparativos
- Barras ou radar: risco da paciente vs. média da população geral
- Percentual de Risco (%) por categoria

### 5.3 Exames Recomendados (lista priorizada)
| Exame | Timing | Local | Motivo Clínico |
|-------|--------|-------|----------------|
| NIPT | 11-14 semanas | Laboratórios especializados | Triagem aneuploidias >99% sensibilidade |
| Ultrassom Translucência Nucal | 10-13 semanas | Clínicas de imagem especializadas | Rastreio morfológico precoce |
| Ultrassom morfológico | 20-24 semanas | Clínicas especializadas | Avaliação estrutural fetal |
| Triagem de Portadores Expandida | Pré-concepcional | Laboratórios de genética | 100-300 doenças recessivas |
| Histeroscopia Diagnóstica | Pré-concepcional | Clínicas de reprodução | Cavidade uterina |
| Histerossalpingografia | Pré-concepcional | Clínicas de imagem | Permeabilidade das trompas |
| Ultrassom Transvaginal + Folículos | Pré-concepcional | Clínicas especializadas | Reserva ovariana |
| AMH (Hormônio Anti-Mülleriano) | Pré-concepcional | Qualquer laboratório | Reserva ovariana |
| Glicemia de Jejum | Pré-concepcional | Qualquer laboratório | Rastrear diabetes |
| TSH/T4 | Pré-concepcional | Qualquer laboratório | Função tireoidiana |
| FSH, LH, AMH | Pré-concepcional | Qualquer laboratório | Avaliação hormonal |
| Painel trombofilias | Pré-concepcional | Laboratórios especializados | Fator V Leiden, Protrombina, Anticoagulante Lúpico, Anticardiolipina |
| Sorologias ISTs | Pré-concepcional | Qualquer laboratório | Transmissão vertical |
| Espermograma (parceiro) | Pré-concepcional | Laboratórios especializados | Fator masculino (40-50% infertilidade) |
| Cariótipo do casal | Indicado | Laboratórios de citogenética | Abortos recorrentes |
| Investigação abortos recorrentes | Indicado | Clínicas especializadas | Causas cromossômicas, uterinas, trombofilias |

### 5.4 Orientações Nutricionais
**Protocolo de Suplementação:**
- Ácido Fólico: 400-800 mcg/dia (3 meses antes → 12 semanas)
- Ferro: 27-30 mg/dia (60-120 mg se anêmica)
- Vitamina D: 1.000-2.000 UI/dia
- Ômega-3 (DHA/EPA)

**Distribuição de Macronutrientes:**
- Gorduras: 20-35% calorias totais (priorizar ômega-3, azeite, abacate, oleaginosas)

**Alimentos Recomendados:**
- Proteínas magras (frango, peixe, ovos)
- Grãos integrais (arroz integral, quinoa, aveia)
- Frutas variadas (3-4 porções/dia)
- Laticínios (leite, iogurte, queijos)
- Leguminosas (feijão, lentilha, grão-de-bico)
- Oleaginosas (castanhas, amêndoas, nozes)
- Peixes 2-3x/semana (salmão, sardinha)
- Vegetais variados
- 2-3 litros de água por dia

**Alimentos a Evitar:**
- Alimentos ultraprocessados
- Frios e embutidos (risco de listeriose)
- Leite e queijos não pasteurizados
- Peixes com alto teor de mercúrio (tubarão, peixe-espada)
- Adoçantes artificiais em excesso
- Excesso de cafeína (limitar a 200 mg/dia)

### 5.5 Plano de Ação Trimestral
- **Pré-concepcional:** Exames, suplementação, vacinas, cessação tabagismo/álcool
- **1° Trimestre:** Primeira consulta pré-natal (até 12 sem), NT ultrassom, exames laboratoriais
- **2° Trimestre:** Ultrassom morfológico (20-24 sem), avaliação crescimento fetal, cardiotocografia
- **3° Trimestre:** Ultrassom, preparação para parto, curso de preparação
- **Pós-parto:** Avaliação depressão pós-parto, apoio amamentação, retorno atividade física, avaliação assoalho pélvico

### 5.6 Reprodução Assistida (se indicada)
- FIV (Fertilização In Vitro)
- ICSI (Injeção Intracitoplasmática)
- IIU (Inseminação Intrauterina)
- PGT-A (Diagnóstico Genético Pré-implantacional)
- FIV com PGT-A ou PGT-M
- Indução de Ovulação

### 5.7 Export PDF (jsPDF)
- Relatório completo com data
- Dados da paciente
- Gráficos comparativos
- Lista de exames
- Protocolo nutricional
- Plano de ação
- Referências científicas
- Disclaimer médico

---

## 6. GAPS E LIMITAÇÕES DO ORIGINAL

| # | Gap | Impacto |
|---|-----|---------|
| 1 | Sem backend — dados não salvos | Usuária perde dados ao recarregar |
| 2 | Sem autenticação | Sem histórico de avaliações |
| 3 | Sem dashboard do médico | Não há portal profissional |
| 4 | Algoritmo de risco opaco (client-side JS) | Não auditável, não atualizável |
| 5 | Sem multi-idioma | Apenas PT-BR |
| 6 | Sem mobile-first UX | Pode ser melhorado |
| 7 | Sem comparação de avaliações ao longo do tempo | Sem longitudinalidade |
| 8 | PDF gerado no cliente (lento e frágil) | Servidor geraria PDF mais robusto |
| 9 | Sem onboarding explicativo por seção | Pode intimidar usuárias |
| 10 | Sem integração com laboratórios | Apenas recomendação manual |
| 11 | Sem telemed/encaminhamento | Sem CTA para consulta médica |
| 12 | Sem scoring de confiabilidade | Não sabe se respostas são completas |

---

## 7. ARQUITETURA DA VERSÃO V2 — MELHORADA

### 7.1 Stack Técnica Proposta

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | Next.js 15 (App Router) + React 19 | SSR, SEO, performance |
| UI Components | ShadCN + Radix UI + Tailwind CSS v4 | Same UX, mais controle |
| Charts | Recharts ou Chart.js | Gráficos reativos e animados |
| Forms | React Hook Form + Zod | Validação robusta e tipada |
| State | Zustand | Persistência de sessão |
| Backend | Next.js API Routes (ou FastAPI) | Algoritmo server-side, PDF server-side |
| Database | Supabase (PostgreSQL + Auth + RLS) | Auth, persistência, LGPD |
| PDF | React PDF (server-side) | PDFs robustos e templated |
| Email | Resend | Envio de relatório por email |
| Hosting | Vercel (frontend) + Supabase (backend) | Escala, CI/CD automático |
| Analytics | Posthog | Funil de conversão, drop-offs |

### 7.2 Funcionalidades Novas (V2)

#### Core - Mesmas do original mas melhoradas:
- [ ] Questionário multi-step com progress bar animada
- [ ] Validação em tempo real (campo a campo)
- [ ] Auto-save local (localStorage) para não perder progresso
- [ ] Onboarding por seção (tooltip educativo em cada campo)
- [ ] Resultado com 4 gauges interativos animados
- [ ] Gráficos comparativos animados (radar + barras)
- [ ] PDF profissional gerado no servidor
- [ ] Design mobile-first responsivo

#### Novas funcionalidades V2:
- [ ] **Auth (Supabase):** Cadastro/login para salvar histórico
- [ ] **Histórico de avaliações:** Comparar avaliações ao longo do tempo
- [ ] **Dashboard da paciente:** Linha do tempo, evolução de risco
- [ ] **Portal médico/geneticista:** Ver relatórios de pacientes
- [ ] **Email do relatório:** Enviar relatório em PDF por email
- [ ] **Compartilhamento seguro:** Link temporário para médico ver o relatório
- [ ] **Score de completude:** % do questionário respondido com qualidade
- [ ] **Modo "Revisão":** Antes de submeter, resume todas as respostas
- [ ] **Algoritmo server-side:** Scoring auditável, versionado, atualizável
- [ ] **Guidelines atualizadas dinamicamente:** Versão da guideline usada (ACOG 2024, ASRM 2024)
- [ ] **Modo claro/escuro**
- [ ] **Acessibilidade WCAG 2.1 AA**
- [ ] **Telemed CTA:** Botão para agendar consulta com especialista parceiro
- [ ] **Interpretação por IA (Claude API):** Narrativa personalizada dos resultados
- [ ] **Calculadora de Ovulação integrada**

### 7.3 Melhorias no Questionário V2

#### Perguntas adicionais recomendadas (não cobertas no original):
- Uso de contraceptivos hormonais (histórico e duração)
- Varicocele no parceiro (causa comum de infertilidade masculina, não coberta)
- Histórico de cirurgias abdominais/pélvicas (aderências)
- Frequência e regularidade do ciclo menstrual
- Duração do ciclo (irregular? polimenorreia? oligomenorreia?)
- Fluxo menstrual (quantidade, dor — endometriose)
- Síndrome de ovários policísticos: diagnóstico formal ou suspeita?
- Histórico de IUD (DIU) — tipo e duração
- Histórico de PID (Doença Inflamatória Pélvica)
- Vacinas em dia (rubéola, hepatite B, tétano, varicela)
- Uso de suplementos além do ácido fólico (vitamina D, ômega-3, ferro)
- Histórico de radioterapia/quimioterapia (preservação de fertilidade)
- Profissão com exposição de risco (trabalho noturno, radiação, produtos químicos)
- Saúde mental: tratamento psiquiátrico ativo? medicação?

### 7.4 Melhorias no Algoritmo de Risco V2

- **Pesos calibrados:** Cada fator tem peso relativo baseado em meta-análises
- **Score 0-100 por categoria** (não apenas Baixo/Moderado/Alto)
- **Percentil populacional:** "Você está no percentil 73% de risco para sua faixa etária"
- **Explicação de cada fator:** Para cada risco gerado, mostrar qual resposta causou
- **Versão da guideline:** Rastrear qual versão do algoritmo gerou o relatório
- **Intervalo de confiança:** Refletir incerteza quando dados incompletos

### 7.5 Melhorias no Relatório V2

- **Relatório Executivo (1 página):** Resumo para compartilhar com médico
- **Relatório Completo (PDF detalhado):** Todos os dados e recomendações
- **Relatório do Parceiro:** Seção específica com ações para o parceiro
- **Linha do tempo visual:** Plano de ação em formato de timeline interativa
- **Links para referências:** Cada recomendação com link para guideline (DOI)
- **QR Code no PDF:** Para acessar versão digital do relatório

### 7.6 Estrutura de Páginas V2

```
/ (landing)
/avaliacao
  /[step] (1-6 seções)
  /revisao
  /processando
/resultado
  /[id]
/dashboard (autenticado)
  /historico
  /comparar
/medico (portal profissional)
  /pacientes
  /relatorio/[id]
/api
  /risk-assessment
  /generate-pdf
  /send-report
```

---

## 8. COMPONENTES-CHAVE A CONSTRUIR

### Questionário
- `QuestionnaireWizard` — orquestra os steps
- `ProgressBar` — visual com % e nome da seção atual
- `SectionHeader` — título + descrição de cada seção
- `FormField` — wrapper universal com label + tooltip educativo + validação
- `CheckboxGroup` — multi-select com ícone e descrição
- `RiskAlert` — alerta inline quando uma resposta gera risco imediato
- `AutoSaveIndicator` — feedback de que o progresso está salvo
- `ReviewSummary` — resumo de todas as respostas antes de submeter

### Resultado
- `RiskGauge` — gauge animado com nível de risco
- `RiskRadar` — gráfico radar 4 categorias vs população
- `ExamList` — lista priorizada com filtro por urgência
- `NutritionProtocol` — cards de suplementação e dieta
- `ActionTimeline` — timeline trimestral interativa
- `ReportActions` — botões: PDF, email, compartilhar, agendar consulta
- `RiskExplainer` — "Por que este risco?" com fatores detalhados

---

## 9. MODELO DE DADOS (Supabase)

```sql
-- Users (via Supabase Auth)

assessments
  id uuid PK
  user_id uuid FK
  created_at timestamp
  algorithm_version text  -- "v2.0.0"
  guideline_version text  -- "ACOG-2024"
  answers jsonb           -- respostas completas
  risk_scores jsonb       -- {chromosomal, monogenic, reproductive, multifactorial}
  report_url text         -- PDF armazenado no Supabase Storage
  shared_token text       -- token para compartilhamento seguro
  shared_expires_at timestamp

-- RLS: usuário acessa apenas seus próprios assessments
```

---

## 10. PLANO DE IMPLEMENTAÇÃO

### Sprint 1 — Foundation
- Setup Next.js 15 + Supabase + ShadCN
- Questionário multi-step (seções 1-3)
- Validação com Zod

### Sprint 2 — Questionnaire Complete
- Seções 4-6 do questionário
- Auto-save localStorage
- Review summary

### Sprint 3 — Algorithm + Results
- Algoritmo de risco server-side (API route)
- 4 gauges de resultado
- Gráficos comparativos (Recharts)

### Sprint 4 — Report + Export
- PDF gerado no servidor (React PDF)
- Lista de exames priorizada
- Protocolo nutricional
- Plano de ação trimestral

### Sprint 5 — Auth + Dashboard
- Supabase Auth (email + Google)
- Dashboard da paciente
- Histórico de avaliações

### Sprint 6 — Polish + Launch
- Mobile-first refinement
- Acessibilidade WCAG 2.1
- Email de relatório (Resend)
- Landing page otimizada

---

*Mapeamento realizado por @architect (Aria) — 2026-03-06*
*Baseado em análise do bundle JS de: https://predeploy-66a26c1b-fertilimap-36oeihuh.manus.space/*
