# Epic 8: Auto-Claude Absorption - Handoff Document

**Data:** 2026-01-29
**Autor:** @architect (Aria)
**Status:** 🟡 Em Progresso (Fase 1 Completa)

---

## Resumo Executivo

Absorvemos ~90% das capacidades de PR Review do Auto-Claude para o AIOS. Este documento serve como handoff para continuar as melhorias restantes.

---

## ✅ Fase 1: COMPLETA - PR Review Tasks

### Tasks Criados

| Task                     | Arquivo                          | Comando                         | Status    |
| ------------------------ | -------------------------------- | ------------------------------- | --------- |
| Library Validation       | `qa-library-validation.md`       | `*validate-libraries {story}`   | ✅ Criado |
| Security Checklist       | `qa-security-checklist.md`       | `*security-check {story}`       | ✅ Criado |
| Migration Validation     | `qa-migration-validation.md`     | `*validate-migrations {story}`  | ✅ Criado |
| Evidence Requirements    | `qa-evidence-requirements.md`    | `*evidence-check {story}`       | ✅ Criado |
| False Positive Detection | `qa-false-positive-detection.md` | `*false-positive-check {story}` | ✅ Criado |
| Browser Console Check    | `qa-browser-console-check.md`    | `*console-check {story}`        | ✅ Criado |

### Arquivos Modificados

| Arquivo                                           | Mudança                      |
| ------------------------------------------------- | ---------------------------- |
| `.aios-core/development/agents/qa.md`             | +6 comandos, +6 dependencies |
| `.aios-core/development/tasks/qa-review-build.md` | Phase 6 expandida (6.0-6.3)  |
| `docs/architecture/AUTO-CLAUDE-COMPARISON.md`     | Documentação completa        |

### Localização dos Arquivos

```
.aios-core/development/tasks/
├── qa-library-validation.md       # Context7 integration
├── qa-security-checklist.md       # 8 security patterns
├── qa-migration-validation.md     # 6 DB frameworks
├── qa-evidence-requirements.md    # 4 evidence types
├── qa-false-positive-detection.md # Confidence scoring
└── qa-browser-console-check.md    # Playwright integration
```

---

## 🟡 Fase 2: PENDENTE - Learning System Enhancements

### 2.1 Gotchas Registry

**Objetivo:** Capturar e armazenar armadilhas/pitfalls para evitar em sessões futuras.

**Arquivos a criar:**

```
.aios-core/workflow-intelligence/learning/
├── gotcha-registry.js          # Core registry class
└── gotcha-capture.js           # Capture hook
```

**Interface proposta:**

```javascript
class GotchaRegistry {
  recordGotcha(pattern, context) {
    // pattern: sequência que causou problema
    // context: { error, file, reason, alternative }
  }

  getGotchasFor(context) {
    // Retorna gotchas relevantes para contexto atual
  }

  exportToMarkdown() {
    // Exporta para .aios/gotchas.md
  }
}
```

**Integração:**

- Hook em `qa-false-positive-detection.md` quando confidence < 0.65
- Hook em `*develop` quando subtask falha 2+ vezes
- Output em `.aios/gotchas.md` para referência humana

---

### 2.2 Context Snapshots

**Objetivo:** Salvar snapshot ao fim de workflow para análise pós-sessão.

**Arquivos a criar:**

```
.aios-core/workflow-intelligence/learning/
└── context-snapshot.js
```

**Estrutura do snapshot:**

```javascript
{
  timestamp: ISO8601,
  sessionId: string,
  storyId: string,
  workflow: 'story_development' | 'bug_fix' | etc,
  duration: number,
  commands: ['develop', 'run-tests', 'review-qa'],
  errors: [],
  successRate: 1.0,
  filesModified: [],
  testsRun: { passed: 10, failed: 0 },
  qaResult: 'APPROVE' | 'REJECT'
}
```

**Integração:**

- Capturar automaticamente ao fim de `*review-build`
- Armazenar em `.aios/snapshots/{date}-{storyId}.json`
- Usar em `SuggestionEngine` para melhorar recomendações

---

### 2.3 QA Feedback Loop

**Objetivo:** Ajustar confidence de padrões baseado em resultados QA.

**Arquivos a modificar:**

```
.aios-core/workflow-intelligence/learning/
├── pattern-store.js            # Adicionar updateFromQA()
└── qa-feedback.js              # NOVO - Hook de feedback
```

**Lógica:**

```javascript
onQAResult(pattern, result) {
  if (result.issues > 0) {
    pattern.successRate *= 0.9;  // Reduz 10%

    if (pattern.failCount >= 3) {
      pattern.status = 'deprecated';
    }

    this.suggestAlternative(pattern, result);
  } else {
    pattern.successRate = Math.min(1.0, pattern.successRate * 1.05);
    pattern.occurrences++;
  }
}
```

---

## 🔴 Fase 3: PENDENTE - Memory System

### 3.1 Semantic Pattern Search

**Objetivo:** Busca por significado, não apenas string matching.

**Arquivos a modificar:**

```
.aios-core/workflow-intelligence/learning/
└── pattern-store.js            # Adicionar findSemantic()
```

**Abordagem:**

```javascript
findSimilar(sequence, options = {}) {
  const exact = this._findExactMatches(sequence);      // 1.0
  const semantic = this._findSemanticMatches(sequence); // 0.7-0.9
  const learned = this._findLearnedSubsequences(sequence); // 0.5-0.7

  return merge(exact, semantic, learned)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

_findSemanticMatches(sequence) {
  // Mapear comandos para categorias
  // 'develop' → 'implementation'
  // 'review-qa' → 'quality'
  // Buscar padrões com mesma sequência de categorias
}
```

---

### 3.2 GraphitiMemory Integration (Opcional)

**Objetivo:** Integrar memória semântica do Auto-Claude como opção.

**Decisão necessária:** Avaliar se vale a pena dado o overhead (LLM + embeddings).

**Se implementar:**

```
.aios-core/workflow-intelligence/memory/
├── graphiti-adapter.js         # Adapter para GraphitiMemory
├── hybrid-memory.js            # Orquestrador híbrido
└── memory-config.yaml          # Configuração
```

**Modo híbrido:**

- Padrões rápidos → AIOS patterns (YAML)
- Contexto profundo → GraphitiMemory (grafo)
- Fallback gracioso se GraphitiMemory indisponível

---

## 🔵 Fase 4: PENDENTE - Automated Fix Loop

### 4.1 Auto-Retry System

**Objetivo:** Retry automático até 5x como Auto-Claude.

**Arquivos a modificar:**

```
.aios-core/development/agents/dev.md        # Adicionar retry config
.aios-core/development/tasks/
└── execute-subtask.md                       # Adicionar retry logic
```

**Configuração:**

```yaml
recovery:
  max_attempts: 5
  backoff: exponential
  on_failure:
    - record_attempt
    - analyze_error
    - adjust_approach
    - retry_with_hints
```

**Integração com QA:**

- Se `*review-build` retorna REJECT
- E issues são auto-fixáveis (lint, type errors)
- Então `*apply-qa-fixes` + re-review automaticamente

---

## Referências

### Documentação Criada

| Documento           | Localização                                   |
| ------------------- | --------------------------------------------- |
| Comparação Completa | `docs/architecture/AUTO-CLAUDE-COMPARISON.md` |
| Este Handoff        | `docs/architecture/ADE-EPIC8-HANDOFF.md`      |

### Código Fonte de Referência (Auto-Claude)

| Componente        | Path no Auto-Claude                    |
| ----------------- | -------------------------------------- |
| GraphitiMemory    | `/apps/backend/integrations/graphiti/` |
| Recovery Manager  | `/apps/backend/services/recovery.py`   |
| Pattern Store     | `/apps/backend/memory/sessions.py`     |
| PR Review Prompts | `/apps/backend/prompts/pr_*.md`        |

### Tasks Existentes para Referência

| Task AIOS                  | Similar Auto-Claude        |
| -------------------------- | -------------------------- |
| `qa-library-validation.md` | `pr_reviewer.md` Phase 6.0 |
| `qa-security-checklist.md` | `pr_security.md`           |
| `qa-review-build.md`       | `qa_reviewer.md`           |

---

## Próximos Passos Recomendados

### Prioridade ALTA

1. **Testar os 6 novos tasks** em uma story real

   ```bash
   @qa *validate-libraries 6.3
   @qa *security-check 6.3
   @qa *validate-migrations 6.3
   @qa *evidence-check 6.3
   @qa *console-check 6.3
   @qa *false-positive-check 6.3
   ```

2. **Integrar ao `*review-build`** - Verificar que Phase 6.0-6.2 executam corretamente

3. **Criar testes unitários** para os novos tasks em `tests/tasks/`

### Prioridade MÉDIA

4. **Implementar Gotchas Registry** (Fase 2.1)

5. **Implementar Context Snapshots** (Fase 2.2)

6. **Implementar QA Feedback Loop** (Fase 2.3)

### Prioridade BAIXA

7. **Avaliar GraphitiMemory** - Custo/benefício

8. **Implementar Auto-Retry** - Se houver demanda

---

## Comandos Úteis para Continuar

```bash
# Ativar @qa para testar
@qa

# Testar novo comando
*validate-libraries 6.3

# Ver tasks disponíveis
*help

# Ler task específico
Read .aios-core/development/tasks/qa-library-validation.md

# Editar task
Edit .aios-core/development/tasks/qa-library-validation.md

# Ver comparação completa
Read docs/architecture/AUTO-CLAUDE-COMPARISON.md
```

---

## Métricas de Sucesso

| Métrica            | Baseline | Target       | Como Medir               |
| ------------------ | -------- | ------------ | ------------------------ |
| PR Review Coverage | 50%      | 90%          | Checklist de features    |
| Bugs pós-QA        | 100%     | -40%         | Tracking de bugs em prod |
| Security issues    | ?        | 90% detected | Security audit           |
| False positives    | ?        | <10%         | QA feedback tracking     |

---

## Contato

Para dúvidas sobre este handoff:

- **Arquitetura:** @architect (Aria)
- **QA:** @qa (Quinn)
- **Implementação:** @dev (Dex)

---

_Handoff gerado por @architect (Aria) - MarkmanAi AIOS v3.1_
