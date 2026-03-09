# QA Fix Request: Design Squad Import — Brand Parametrization

**Generated:** 2026-03-09
**Reviewer:** Quinn (Test Architect)
**Scope:** `squads/design/scripts/design-system/`
**Origin:** Security check post-import — findings LOW-1 e LOW-2

---

## Instructions for @dev

Fix ONLY the issues listed below. Dois scripts têm o nome da brand `clickmax` hardcoded.
O objetivo é tornar ambos configuráveis via argumento CLI ou variável de ambiente.

**Process:**
1. Ler cada issue com atenção
2. Aplicar o fix exato descrito
3. Verificar usando os steps de verificação
4. Marcar o issue como fixed neste documento
5. Rodar os scripts com `--brand test-brand` para validar que funcionam

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| LOW | 2 | Não bloqueante — fix recomendado antes de uso |

---

## Context: Como o workspace funciona

Os scripts operam sobre uma estrutura de diretórios chamada `workspace/`:

```
{cwd}/
└── workspace/
    ├── domains/
    │   └── design-system/
    │       └── extraction/
    │           ├── curated/          ← input dos scripts generate_*
    │           └── images/
    └── ui/
        └── {brand}/                  ← OUTPUT: onde os tokens CSS são gerados
            ├── brand.json
            ├── tokens/
            └── themes/
```

O `{brand}` é o nome do projeto/produto cujo design system está sendo gerado.
Atualmente está fixo como `clickmax` (projeto de origem do squad).

---

## Issues to Fix

---

### 1. [LOW] Hardcoded brand name no output path — `generate_tokens.cjs`

**Issue ID:** FIX-DS-001

**Location:** `squads/design/scripts/design-system/generate_tokens.cjs:24`

**Problem:**
```javascript
const ROOT = process.cwd();
const EXTRACTION_DIR = path.join(ROOT, 'workspace', 'domains', 'design-system', 'extraction');
const CURATED_DIR = path.join(EXTRACTION_DIR, 'curated');
const OUTPUT_DIR = path.join(ROOT, 'workspace', 'ui', 'clickmax');  // ← hardcoded
```

O script sempre gera os tokens CSS em `workspace/ui/clickmax/`, independente do projeto atual.

**Expected — aceitar `--brand` CLI arg com fallback para env var:**
```javascript
const ROOT = process.cwd();
const EXTRACTION_DIR = path.join(ROOT, 'workspace', 'domains', 'design-system', 'extraction');
const CURATED_DIR = path.join(EXTRACTION_DIR, 'curated');

// Resolve brand: --brand arg > DS_BRAND env > default 'my-brand'
const brandArg = process.argv.find(a => a.startsWith('--brand='));
const BRAND = brandArg
  ? brandArg.split('=')[1]
  : (process.env.DS_BRAND || 'my-brand');

const OUTPUT_DIR = path.join(ROOT, 'workspace', 'ui', BRAND);
```

**Usage após o fix:**
```bash
# Via CLI arg (recomendado)
node squads/design/scripts/design-system/generate_tokens.cjs --brand=aios-core

# Via env var
DS_BRAND=aios-core node squads/design/scripts/design-system/generate_tokens.cjs

# Fallback default (gera em workspace/ui/my-brand/)
node squads/design/scripts/design-system/generate_tokens.cjs
```

**Verification:**
- [ ] Rodar com `--brand=test-project` → confirmar que output vai para `workspace/ui/test-project/`
- [ ] Rodar sem argumento → confirmar que usa fallback `my-brand` (não `clickmax`)
- [ ] Rodar com `DS_BRAND=test-env` → confirmar que env var funciona

**Status:** [ ] Fixed

---

### 2. [LOW] Hardcoded brand name no relatório de curadoria — `generate_curation_report.cjs`

**Issue ID:** FIX-DS-002

**Location:** `squads/design/scripts/design-system/generate_curation_report.cjs:64`

**Problem:**
```javascript
const report = {
  timestamp: new Date().toISOString(),
  brand: 'clickmax',         // ← hardcoded
  pipeline_version: '2.0',
  // ...
};
```

O relatório JSON/MD gerado sempre identifica a brand como `clickmax`, mesmo quando usado em outros projetos.

**Expected — mesma lógica de resolução do FIX-DS-001:**
```javascript
// Resolve brand: --brand arg > DS_BRAND env > default 'my-brand'
// (adicionar junto às outras constantes no topo do arquivo, após os imports)
const brandArg = process.argv.find(a => a.startsWith('--brand='));
const BRAND = brandArg
  ? brandArg.split('=')[1]
  : (process.env.DS_BRAND || 'my-brand');

// Substituir na definição do report:
const report = {
  timestamp: new Date().toISOString(),
  brand: BRAND,              // ← dinâmico
  pipeline_version: '2.0',
  // ...
};
```

**Verification:**
- [ ] Rodar com `--brand=aios-core` → confirmar que `report.brand === 'aios-core'` no JSON gerado
- [ ] Rodar sem argumento → confirmar que `report.brand === 'my-brand'` (não `clickmax`)
- [ ] Output markdown do relatório deve mostrar o brand correto no header

**Status:** [ ] Fixed

---

## Constraints

**@dev deve seguir estas restrições:**

- [ ] Modificar APENAS as 2 linhas/blocos identificados acima em cada arquivo
- [ ] NÃO alterar a lógica de curadoria, outputs CSS, ou qualquer outro script
- [ ] NÃO adicionar dependências externas (solução deve usar apenas `process.argv` e `process.env`)
- [ ] NÃO criar arquivos novos
- [ ] Manter compatibilidade retroativa: se `DS_BRAND=clickmax` for setado, deve funcionar igual a antes

---

## Arquivos a modificar

| # | Arquivo | Linha | Mudança |
|---|---------|-------|---------|
| 1 | `squads/design/scripts/design-system/generate_tokens.cjs` | 24 | Substituir `'clickmax'` por resolução dinâmica via `--brand` / `DS_BRAND` |
| 2 | `squads/design/scripts/design-system/generate_curation_report.cjs` | 64 | Idem |

**Total: 2 arquivos, ~6 linhas adicionadas por arquivo.**

---

## Arquivos que NÃO precisam de alteração

Todos os outros scripts usam `workspace/domains/design-system/` (path genérico, não brand-specific):

| Script | Path usado | Status |
|--------|-----------|--------|
| `curate_colors.cjs` | `workspace/domains/design-system/extraction/` | OK |
| `curate_components.cjs` | `workspace/domains/design-system/extraction/` | OK |
| `curate_radius.cjs` | `workspace/domains/design-system/extraction/` | OK |
| `curate_shadows.cjs` | `workspace/domains/design-system/extraction/` | OK |
| `curate_spacing.cjs` | `workspace/domains/design-system/extraction/` | OK |
| `curate_typography.cjs` | `workspace/domains/design-system/extraction/` | OK |
| `fetch_page_images.cjs` | `workspace/domains/design-system/extraction/` | OK |
| `generate_components_metadata.cjs` | `workspace/ui/registry.json` (genérico) | OK |
| `validate_*.cjs` | `workspace/domains/` (genérico) | OK |
| `validate-design-squad.py` | Sem path hardcoded | OK |
| `dissect-artifact.cjs` | Sem workspace refs | OK |

---

## After Fixing

1. Marcar cada issue como fixed (`[x]`) neste documento
2. Rodar verificação manual: `node generate_tokens.cjs --brand=test && ls workspace/ui/test/`
3. Solicitar re-review: `@qa *review` para confirmar que LOW-1 e LOW-2 estão resolvidos

---

_Generated by Quinn (Test Architect) — AIOS QA System_
_Design Squad Import Review — 2026-03-09_

---

## Fix Results

**Fixed By:** @dev (Dex)
**Commit:** `0d15dc4`
**Date:** 2026-03-09

| Issue | Status | Notes |
|-------|--------|-------|
| FIX-DS-001 — generate_tokens.cjs | ✅ Fixed | `--brand` arg / `DS_BRAND` env / fallback `my-brand` |
| FIX-DS-002 — generate_curation_report.cjs | ✅ Fixed | `report.brand` agora dinâmico |
| FIX-001 — ux-design-expert.md (x2) | ✅ Fixed | Aponta para `squads/design/checklists/ds-accessibility-wcag-checklist.md` |
| FIX-002 — macOS artifacts | ✅ Fixed | 2 arquivos deletados |
| FIX-003 — .gitignore | ✅ Fixed | bob-status.json + events.jsonl adicionados |

**Ready for QA re-review:** `@qa *review`
