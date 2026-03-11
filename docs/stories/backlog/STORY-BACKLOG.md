# Story Backlog — Tech Debt & Follow-ups

> **Last Updated**: 2026-03-11
> **Source**: PO Validation + QA Review — Epics 12, 13 (13.2 tech debt added) + QA Review PR #9 Story 13.10 + QA Review Story 20.1 + QA Review Story 21.2
> **Managed by**: @po (Pax)
> **Updated**: 2026-03-11 — [21.2-F1], [21.2-F2] registered by @qa — Story 21.2 follow-ups (LOW)

---

## Statistics

| Status | Count |
|--------|-------|
| TODO | 7 |
| IN PROGRESS | 0 |
| DONE | 14 |
| Total | 21 |

| Priority | Count |
|----------|-------|
| HIGH | 0 |
| MEDIUM | 0 |
| LOW | 7 |

---

## HIGH Priority

#### [13-BLOCKER-COV] Fix `minimatch` coverage tooling bug — blocker for Epic 13 Part A AC-5
- **Status**: ✅ DONE (2026-03-06)
- **Fix**: Added `coverageProvider: 'v8'` to `jest.config.js`. Switched from `babel` (default) to Node.js native V8 coverage, eliminating the `babel-plugin-istanbul` → `test-exclude` → `minimatch` chain entirely.
- **Result**: `npx jest tests/core/orchestration/ --coverage` → 454 tests pass, coverage report generated, no errors.

---

## MEDIUM Priority

## LOW Priority

#### [13.10-T1] Decouple hardcoded lock path in `stop.js` from LockManager internals
- **Status**: TODO
- **Source**: CodeRabbit PR #9 — Nitpick
- **File**: `src/bob/commands/stop.js:28-34`
- **Issue**: `force` stop constructs `.aios/locks/bob-orchestration.lock` directly, duplicating `LockManager._getLockPath()`. If the naming convention changes, the path will silently diverge.
- **Fix**: Expose `lockMgr.getLockFilePath('bob-orchestration')` (or a shared constant) and use it in place of the hardcoded string.

#### [16.1-T1] Fix `_extractBodyText()` correction regex for texts with internal periods
- **Status**: TODO
- **Priority**: LOW
- **Source**: QA Review — Story 16.1 re-review (2026-03-09)
- **File**: `.aios-core/core/synapse/memory/memory-writer.js` — `_extractBodyText()`
- **Epic**: 17 (deferred)
- **Issue**: The `correction` branch uses `/Actually,?\s*(.+?)\./i` — a lazy quantifier that stops at the **first** period in the text. Correction memories containing internal periods (e.g., `"use Node.js APIs"`) are partially captured (`"use Node"` instead of `"use Node.js APIs"`), causing deduplication to silently fail for that entry. A second write of the same correction text would not be recognized as a duplicate.
- **Fix**: Replace with a greedy-to-end-of-line pattern: `/Actually,?\s*(.+)\.$/im` or strip the trailing sentence period explicitly and compare against the full captured text. Alternatively, store `content.text` directly in frontmatter as a dedicated `text_hash` field for reliable dedup lookup.

#### [20.1-T1] Fix cosmetic log message in `_refine_voice` / `_refine_thinking`
- **Status**: TODO
- **Priority**: LOW
- **Source**: QA Review — Story 20.1 (2026-03-11)
- **File**: `knowledge-etl/src/knowledge_etl/transform/l3_authorial.py`
- **Issue**: Console prints "waiting 65s for rate limit..." but `time.sleep(200)` is called. Message is misleading during pipeline execution.
- **Fix**: Update log strings to say "waiting 200s for rate limit..." to match actual sleep duration.

#### [20.1-T2] Add unit test for L3 checkpoint version invalidation logic
- **Status**: TODO
- **Priority**: LOW
- **Source**: QA Review — Story 20.1 (2026-03-11)
- **File**: `knowledge-etl/tests/test_l3_authorial.py`
- **Issue**: AC-6 (prompt_version checkpoint invalidation) was verified via integration run log only. No unit test covers the `cached_version != L3_PROMPT_VERSION → checkpoint.reset()` code path.
- **Fix**: Add a test that mocks a checkpoint with `prompt_version: "1.0"` and asserts `checkpoint.reset()` is called when `extract_l3` runs with version `"2.0"`.

#### [21.2-F1] Adicionar teste de edge case para `author=None` em `place_l3()`
- **Status**: TODO
- **Priority**: LOW
- **Source**: QA Review — Story 21.2 (2026-03-11)
- **File**: `knowledge-etl/tests/test_l3_place_pkb.py`
- **Story**: 21.2 — PKB ETL Adapter
- **Issue**: O fallback `author = metadata.get("author") or "Unknown"` produz `person_slug = "unknown"` via `slugify("Unknown")`. Este caminho nunca foi testado explicitamente. Em produção, um `metadata.yaml` sem campo `author` (ou com `author: null`) criaria a pasta `people/unknown/sources/books/{book_slug}/` sem nenhum aviso ao operador — podendo acumular extrações órfãs sem atribuição correta.
- **Fix**: Adicionar um teste em `test_l3_place_pkb.py`:
  ```python
  def test_unknown_author_fallback(self, tmp_path):
      metadata = {"title": "Some Book", "author": None, "source_file": "book.pdf"}
      with patch("knowledge_etl.load.l3_place.PEOPLE_KB", tmp_path):
          result = place_l3(_L3_RESULTS, metadata, "some-book")
      assert "unknown" in str(result)
      data = json.loads((result / "extracted.json").read_text())
      assert data["author"] == "Unknown"
  ```
  Considerar também logar um `console.print("[yellow]L3 Load:[/yellow] author not found in metadata — using 'Unknown'")` em `place_l3()` para alertar o operador.
- **Esforço estimado**: 30 min

#### [21.2-F2] Implementar limpeza de backup files acumulados no Epic 22
- **Status**: TODO
- **Priority**: LOW
- **Source**: QA Review — Story 21.2 (2026-03-11)
- **File**: `knowledge-etl/src/knowledge_etl/load/l3_place.py`
- **Story**: 21.2 — PKB ETL Adapter (endereçar no Epic 22 ou Story de manutenção PKB)
- **Issue**: Cada re-execução do ETL para o mesmo livro cria um novo `extracted.{ts}.backup.json`. Em pipelines de re-processamento frequente (ex: atualização de prompts, mudança de modelo), esses backups acumulam indefinidamente em `knowledge-etl/data/people/{slug}/sources/books/{book_slug}/`. Não existe mecanismo de limpeza automática ou limite de retenção.
- **Fix**: No Epic 22 (ou em uma story de manutenção PKB), implementar um dos dois approaches:
  1. **Retenção limitada**: manter apenas os N backups mais recentes (sugestão: N=3). Exemplo:
     ```python
     backups = sorted(pkb_dir.glob("extracted.*.backup.json"))
     for old_backup in backups[:-2]:  # keep last 2 before adding new
         old_backup.unlink()
     ```
  2. **Backups em subdiretório**: mover backups para `pkb_dir / ".backups" / f"extracted.{ts}.json"` para não poluir o diretório principal.
  Qualquer approach deve ser acompanhado de teste unitário que valide o limite de retenção.
- **Esforço estimado**: 2 horas

#### [13.10-T2] Handle additional resume actions explicitly in `resume.js`
- **Status**: TODO
- **Source**: CodeRabbit PR #9 — Nitpick
- **File**: `src/bob/commands/resume.js:39-47`
- **Issue**: `handleSessionResume()` can return `'review'`, `'restart'`, `'discard'`, `'unknown'` — only `'continue'` has explicit handling; others fall through to a generic `console.log`.
- **Fix**: Add explicit branches for each action: `'review'` → prompt user to re-run with next steps; `'restart'`/`'discard'` → guidance message; `'unknown'` → diagnostic log.

## Archive — Done

#### [12.3-T1] Resolve FAISS fallback ambiguity
- **Status**: DONE
- **Resolved**: FAISS is a hard dep. No fallback implemented. pytest.importorskip used in tests.

#### [12.3-T2] Add singleton validation subtask
- **Status**: DONE
- **Resolved**: Singleton implemented and tested via autouse fixture in conftest.py.

#### [12.2-T1] Pre-decide prompt reuse for L1 Reduce
- **Status**: DONE
- **Resolved**: Dedicated l1_reduce.xml created. Decision documented in story Completion Notes.

#### [12.X-T1] Clarify knowledge-etl repository location
- **Status**: DONE
- **Resolved**: knowledge-etl/ is a subdirectory of aios-core. Push authority via @devops applies normally.

#### [13-BLOCKER-COV] Fix `minimatch` coverage tooling bug
- **Status**: DONE
- **Resolved**: Added `coverageProvider: 'v8'` to `jest.config.js`. V8 native coverage bypasses babel-plugin-istanbul/test-exclude/minimatch entirely. 454 tests pass with coverage.

#### [13.2-T1] Fix premature index entry in cleanupStaleSnapshots before fs.unlink succeeds
- **Status**: ✅ DONE (2026-03-07)
- **Resolved**: Fixed via commit `d997262` — `removedSnapshots.push()` moved to after successful `fs.unlink()`. Push-after-unlink pattern applied.
- **File**: `.aios-core/core/orchestration/data-lifecycle-manager.js`

#### [13.2-T2] Make _updateSnapshotsIndex() atomic via temp file + fs.rename
- **Status**: ✅ DONE (2026-03-07)
- **Resolved**: Fixed via commit `d997262` — `_updateSnapshotsIndex()` now writes to temp file then renames atomically.
- **File**: `.aios-core/core/orchestration/data-lifecycle-manager.js`

#### [12.3-T4] Add parameterized query guidance for SQLite
- **Status**: ✅ DONE (2026-03-07)
- **Resolved**: Dev Notes section added to Story 12.3 with parameterized `?` pattern, correct and incorrect examples. Code already follows the pattern (`_persist_embedding`, `_resolve_nearest_text`).

#### [12.1-QA-L1] _parse_json LLM response wrapping concern
- **Status**: ✅ DONE (2026-03-07)
- **Resolved**: `_parse_json` now unwraps single-key dict wrappers before Pydantic validation. `{"thinking_dna": {...}}` → `{...}` automatically. Lists not unwrapped (ContradictionsResult safe). 2 regression tests added. 14/14 tests pass.
- **File**: `knowledge-etl/src/knowledge_etl/transform/l3_authorial.py`, `knowledge-etl/tests/test_epic12_completeness.py`

#### [12.2-T2] Add concrete output format example for L1 Reduce
- **Status**: ✅ DONE (2026-03-07)
- **Resolved**: "Expected output format (AC-3)" section added to Story 12.2 Dev Notes with real `Principle` schema example (`principle`, `action`, `attribution`, `source_quote`, `chapter_ref`) and testability guidance.

#### [12.3-T3] Replace pickle with tobytes for embedding serialization
- **Status**: ✅ DONE (2026-03-07)
- **Resolved**: `pickle.dumps/loads` replaced with `numpy.tobytes()/np.frombuffer()` in `dedup.py`. `import pickle` removed. 41/41 tests pass.
- **File**: `knowledge-etl/src/knowledge_etl/load/dedup.py`

#### [12.2-QA-L1] Remove redundant inline import re in _reduce_l1
- **Status**: ✅ DONE (2026-03-07)
- **Resolved**: `import re` added to top-level imports. All 4 inline `import re` / `import re as _re` statements removed from `_reduce_l1`, `_extract_map_reduce`, `_get_system_prompt`, `_parse_principles`.
- **File**: `knowledge-etl/src/knowledge_etl/transform/l1_principles.py`

#### [12.2-QA-L2] TOTAL_CHAPTERS counting via chapter_ref set
- **Status**: ✅ DONE (2026-03-07)
- **Resolved**: Comment added: `# Note: principles with empty chapter_ref all collapse to one bucket in the set count`.
- **File**: `knowledge-etl/src/knowledge_etl/transform/l1_principles.py`

#### [12.2-QA-L3] Reduce parse failure returns raw un-reduced chapter_results
- **Status**: ✅ DONE (2026-03-07)
- **Resolved**: Warning log added via Rich console on both failure paths (no JSON match + JSONDecodeError) in `_reduce_l1`.
- **File**: `knowledge-etl/src/knowledge_etl/transform/l1_principles.py`

---

*Created: 2026-03-06 by @po — PO Validation of Epic 12*
*Updated: 2026-03-06 — Epic 13 analysis: coverage tooling bug registered as HIGH blocker*
*Updated: 2026-03-06 — 13.2 QA Review: 2 MEDIUM tech debt items registered ([13.2-T1], [13.2-T2])*
*Updated: 2026-03-06 — [13-BLOCKER-COV] DONE: coverageProvider switched to v8 by @dev*
*Updated: 2026-03-07 — [13.2-T1], [13.2-T2] DONE: resolved via commit d997262 by @dev*
*Updated: 2026-03-07 — [12.3-T4], [12.2-T2] DONE: Dev Notes enriched by @po*
*Updated: 2026-03-07 — [12.3-T3], [12.2-QA-L1], [12.2-QA-L2], [12.2-QA-L3] DONE: implemented by @dev, 41/41 tests pass*
*Updated: 2026-03-07 — [12.1-QA-L1] DONE: _parse_json unwrapping fix by @architect + @dev, 14/14 tests pass*
*Updated: 2026-03-08 — [13.10-T1], [13.10-T2] registered by @qa — CodeRabbit nitpicks from PR #9 (Story 13.10)*
*Updated: 2026-03-08 — Epic 13 CLOSED: 12/12 stories Done. All 13.x stories archived to docs/stories/completed/ by @po*
*Updated: 2026-03-11 — [20.1-T1], [20.1-T2] registered by @qa — Story 20.1 follow-ups (LOW)*
*Updated: 2026-03-11 — [21.2-F1], [21.2-F2] registered by @qa — Story 21.2 follow-ups (LOW): edge case author=None + limpeza de backups*