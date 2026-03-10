# QA Fix Request — squad-creator v4.0.0 Post-Fusion Path Update

**Issued by:** Quinn (@qa)
**Date:** 2026-03-10
**Priority:** HIGH
**Estimated effort:** ~5 min (search-replace)
**Gate status:** CONCERNS → will become PASS after fix

---

## Context

`squad-creator` v4.0.0 was created by fusing `squad-creator` (base) + `squad-creator-pro` (pro module) on 2026-03-10. All files from `squad-creator-pro/` were absorbed into `squad-creator/`. The pro directory has been archived at `squads/_archived/squad-creator-pro_2026-03-10/`.

**Problem:** 14 task files still contain hardcoded references to `squads/squad-creator-pro/` paths. These paths no longer resolve at runtime — scripts, configs, and data files now live under `squads/squad-creator/`.

---

## Fix Required

**Single search-replace across 14 files:**

```
FIND:    squads/squad-creator-pro/
REPLACE: squads/squad-creator/
```

---

## Affected Files (14)

| File | Stale references | Type |
|------|-----------------|------|
| `squads/squad-creator/tasks/an-assess-sources.md` | `scripts/assess-sources.sh` | bash path |
| `squads/squad-creator/tasks/an-clone-review.md` | `scripts/clone-review.sh` | bash path |
| `squads/squad-creator/tasks/an-fidelity-score.md` | `scripts/fidelity-score.sh` | bash path |
| `squads/squad-creator/tasks/an-validate-clone.md` | `scripts/validate-clone.sh` | bash path |
| `squads/squad-creator/tasks/an-compare-outputs.md` | `test-cases/`, `tasks/`, script args | data + task paths |
| `squads/squad-creator/tasks/create-pipeline.md` | `templates/` | template path |
| `squads/squad-creator/tasks/migrate-workflows-to-yaml.md` | `workflows/` (source + dest) | workflow paths |
| `squads/squad-creator/tasks/optimize-workflow.md` | `workflows/wf-squad-fusion.yaml` | example path |
| `squads/squad-creator/tasks/pv-axioma-assessment.md` | `data/pv-meta-axiomas.yaml` | data path |
| `squads/squad-creator/tasks/pv-modernization-score.md` | `scripts/modernization-score.sh`, `data/pv-workflow-validation.yaml` | script + data paths |
| `squads/squad-creator/tasks/qualify-task.md` | `tasks/`, `workflows/`, `scripts/model-tier-validator.cjs` | multiple paths |
| `squads/squad-creator/tasks/smoke-test-model-routing.md` | `config/model-routing.yaml`, `scripts/model-tier-validator.cjs`, `scripts/model-usage-logger.cjs` | config + script paths |
| `squads/squad-creator/tasks/sync-chief-codex-skill.md` | `scripts/sync-chief-codex-skill.js` | script path |
| `squads/squad-creator/tasks/workspace-integration-hardening.md` | `scripts/validate-squad.sh`, `scripts/validate-workspace-contract.py` | script paths |

---

## Exact occurrences (by file)

```
an-assess-sources.md:22       → squads/squad-creator-pro/scripts/assess-sources.sh
an-clone-review.md:63         → squads/squad-creator-pro/scripts/clone-review.sh
an-fidelity-score.md:22       → squads/squad-creator-pro/scripts/fidelity-score.sh
an-validate-clone.md:22       → squads/squad-creator-pro/scripts/validate-clone.sh
an-compare-outputs.md:322     → squads/squad-creator-pro/test-cases/...
an-compare-outputs.md:332-334 → squads/squad-creator-pro/test-cases/ + tasks/
create-pipeline.md:133        → squads/squad-creator-pro/templates/
migrate-workflows-to-yaml.md:57,68,73 → squads/squad-creator-pro/workflows/
optimize-workflow.md:663,728  → squads/squad-creator-pro/workflows/wf-squad-fusion.yaml
pv-axioma-assessment.md:15,26 → squads/squad-creator-pro/data/pv-meta-axiomas.yaml
pv-modernization-score.md:21,34,45 → scripts/ + data/
qualify-task.md:41,46,59,76,132,189 → tasks/ + workflows/ + scripts/
smoke-test-model-routing.md:21,33,51,57,67,68,69,90,98,109,118 → config/ + scripts/
sync-chief-codex-skill.md:23  → squads/squad-creator-pro/scripts/sync-chief-codex-skill.js
workspace-integration-hardening.md:75,76,116,117 → scripts/
```

---

## Execution (for @dev)

Run from repo root:

```bash
# Dry-run first (verify matches)
grep -r "squads/squad-creator-pro/" squads/squad-creator/tasks/ --include="*.md" -l

# Execute replacement
find squads/squad-creator/tasks/ -name "*.md" \
  -exec sed -i 's|squads/squad-creator-pro/|squads/squad-creator/|g' {} \;

# Verify zero remaining
grep -r "squads/squad-creator-pro/" squads/squad-creator/tasks/ --include="*.md"
```

> **Note (Windows):** `sed -i` may require `sed -i ''` or use PowerShell:
> ```powershell
> Get-ChildItem squads/squad-creator/tasks/*.md | ForEach-Object {
>   (Get-Content $_.FullName) -replace 'squads/squad-creator-pro/', 'squads/squad-creator/' |
>   Set-Content $_.FullName
> }
> ```

---

## Verification after fix

```bash
# Must return zero matches
grep -r "squads/squad-creator-pro/" squads/squad-creator/tasks/ --include="*.md"
```

Expected output: (empty)

---

## Acceptance Criteria

- [ ] Zero occurrences of `squads/squad-creator-pro/` in `squads/squad-creator/tasks/`
- [ ] All 14 files updated
- [ ] No other content modified (only the path prefix)
- [ ] Verify `squads/squad-creator/scripts/` contains the scripts referenced (they do — confirmed by QA)

---

## QA Sign-off after fix

Once @dev confirms fix applied, Quinn will re-run smoke check:

```bash
grep -r "squads/squad-creator-pro/" squads/squad-creator/tasks/ --include="*.md" | wc -l
# Expected: 0
```

Gate decision will update from **CONCERNS → PASS**.

---

*QA Fix Request issued by Quinn (@qa) — squad-creator v4.0.0 post-fusion validation*
*Do NOT modify docs/ or data/ references — those are historical context, not executable paths.*
