# QA Fix Request: import-asset skill

**Generated:** 2026-03-08T00:00:00Z
**QA Report Source:** QA review session (inline)
**Reviewer:** Quinn (Test Architect)

---

## Instructions for @dev

Fix ONLY the issues listed below. Do not add features or refactor unrelated code.

**Process:**

1. Read each issue carefully
2. Fix the specific problem described
3. Verify using the verification steps provided
4. Mark the issue as fixed in this document
5. Run the test command after each fix to validate

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| HIGH | 2 | FIXED |
| MEDIUM | 2 | FIXED |
| LOW | 2 | FIXED |

---

## Issues to Fix

### 1. [HIGH] YAML parser not scoped to dependencies: block

**Issue ID:** FIX-IMPORT-001

**Location:** `.claude/skills/import-asset/scripts/analyze-dependencies.js:58`

**Problem:**
The regex `^(tasks|templates|checklists|scripts|utils|workflows|tools):$` matches ANY section in the YAML with those key names, not just children of the `dependencies:` block. For example, `coderabbit_integration:` has a nested `tools:` or `severity_handling:` that could produce false dependency entries.

```javascript
// Current: matches ANY section named tasks/templates/etc
const sectionMatch = trimmed.match(/^(tasks|templates|checklists|scripts|utils|workflows|tools):$/);
```

**Expected:**
Track when the parser enters the `dependencies:` block and only parse sections inside it. Use indentation level to detect scope.

```javascript
let inDependencies = false;
let depsIndent = -1;

for (const line of yamlContent.split('\n')) {
  const trimmed = line.trim();
  const indent = line.search(/\S/);

  // Detect dependencies: block entry
  if (trimmed === 'dependencies:') {
    inDependencies = true;
    depsIndent = indent;
    continue;
  }

  // Detect exit from dependencies block (same or lower indent, non-empty)
  if (inDependencies && indent <= depsIndent && trimmed && !trimmed.startsWith('#')) {
    inDependencies = false;
    currentSection = null;
    continue;
  }

  if (!inDependencies) continue;

  // Now parse section headers and list items as before
  const sectionMatch = trimmed.match(/^(tasks|templates|checklists|scripts|utils|workflows|tools|data):$/);
  // ... rest of logic
}
```

**Verification:**

- [ ] Test with `qa.md` agent — should NOT pick up tools from `coderabbit_integration.tools`
- [ ] Test with `devops.md` agent — should NOT pick up items from `coderabbit_integration`, `pr_automation`, etc.
- [ ] Test with `analyst.md` agent — should still correctly parse all 6 tasks, 4 templates, 1 script, 3 tools

**Status:** [x] Fixed

---

### 2. [HIGH] Missing `data:` dependency type

**Issue ID:** FIX-IMPORT-002

**Location:** `.claude/skills/import-asset/scripts/analyze-dependencies.js:42-49` and `:90-97`

**Problem:**
The `parseDependenciesFromYaml` deps map and `resolveDepPath` typeMap do not include the `data` dependency type. Agents like `@qa` declare `data: [technical-preferences.md]` which will be completely invisible to the analyzer.

```javascript
// parseDependenciesFromYaml - missing data:
const deps = {
  tasks: [],
  templates: [],
  checklists: [],
  scripts: [],
  utils: [],
  workflows: [],
  tools: [],
  // data: [] ← MISSING
};

// resolveDepPath - missing data mapping
const typeMap = {
  tasks: 'development/tasks',
  templates: 'development/templates',
  // data: 'development/data' ← MISSING
};
```

**Expected:**

```javascript
// In parseDependenciesFromYaml:
const deps = {
  tasks: [],
  templates: [],
  checklists: [],
  scripts: [],
  utils: [],
  workflows: [],
  tools: [],
  data: [],
};

// In resolveDepPath:
const typeMap = {
  tasks: 'development/tasks',
  templates: 'development/templates',
  checklists: 'development/checklists',
  scripts: 'development/scripts',
  utils: 'development/utils',
  workflows: 'development/workflows',
  data: 'development/data',
};
```

Also update the section regex in `parseDependenciesFromYaml` (line 58):

```javascript
// Add data to the regex
const sectionMatch = trimmed.match(/^(tasks|templates|checklists|scripts|utils|workflows|tools|data):$/);
```

**Verification:**

- [ ] Test with `qa.md` agent — should detect `data: [technical-preferences.md]`
- [ ] Verify `technical-preferences.md` appears in `filesToTransfer` with correct status
- [ ] Confirm `data` type maps to `development/data/` path

**Status:** [x] Fixed

---

### 3. [MEDIUM] Skill resource target path calculation incorrect

**Issue ID:** FIX-IMPORT-003

**Location:** `.claude/skills/import-asset/scripts/analyze-dependencies.js:275`

**Problem:**
The target path for skill sub-resources is computed with a no-op replace:

```javascript
const targetRel = targetRepoPath
  ? path.join(path.relative(sourceRepoPath, skillDir).replace(sourceRepoPath, ''), res.relativePath)
  : sourceRel;
```

`path.relative(sourceRepoPath, skillDir)` already returns a relative path, so `.replace(sourceRepoPath, '')` does nothing. The target path doesn't account for different base paths between repos.

**Expected:**

```javascript
const skillRelDir = path.relative(sourceRepoPath, skillDir);
const targetRel = targetRepoPath
  ? path.join(skillRelDir, res.relativePath)
  : sourceRel;
```

And check file status against the target repo:

```javascript
const targetFullPath = targetRepoPath ? path.join(targetRepoPath, skillRelDir, res.relativePath) : null;
report.filesToTransfer.push({
  source: sourceRel,
  target: path.join(skillRelDir, res.relativePath),
  status: checkFileStatus(res.fullPath, targetFullPath),
  depType: res.type,
});
```

**Verification:**

- [ ] Test importing a skill that has `scripts/` and `references/` subdirectories
- [ ] Verify target paths resolve correctly relative to target repo
- [ ] Verify status is not hardcoded 'NEW' but actually checks target existence

**Status:** [x] Fixed

---

### 4. [MEDIUM] Code module imports always marked 'NEW'

**Issue ID:** FIX-IMPORT-004

**Location:** `.claude/skills/import-asset/scripts/analyze-dependencies.js:296-302`

**Problem:**
When analyzing code module local imports, the status is hardcoded to `'NEW'` without checking if the file already exists in the target repo:

```javascript
report.filesToTransfer.push({
  source: path.relative(sourceRepoPath, resolved + ext),
  target: path.relative(sourceRepoPath, resolved + ext),
  status: 'NEW',  // ← Always NEW, never checks target
  depType: 'local-import',
});
```

**Expected:**

```javascript
const sourceRelPath = path.relative(sourceRepoPath, resolved + ext);
const targetFullPath = targetRepoPath ? path.join(targetRepoPath, sourceRelPath) : null;

report.filesToTransfer.push({
  source: sourceRelPath,
  target: sourceRelPath,
  status: checkFileStatus(resolved + ext, targetFullPath),
  depType: 'local-import',
});
```

**Verification:**

- [ ] Test with a JS file that imports a module existing in both repos
- [ ] Verify status shows IDENTICAL or DIFFERENT instead of always NEW

**Status:** [x] Fixed

---

### 5. [LOW] Windows path separators inconsistent in output

**Issue ID:** FIX-IMPORT-005

**Location:** `.claude/skills/import-asset/scripts/analyze-dependencies.js` (multiple locations)

**Problem:**
On Windows, `path.join` produces backslash separators (`\`), causing inconsistent output:
```
".aiox-core\\development\\tasks\\create-doc.md"
```
Mixed with forward-slash paths from the source input.

**Expected:**
Normalize all output paths to forward slashes for consistency:

```javascript
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}
```

Apply to all `source` and `target` fields in `filesToTransfer` before adding to report.

**Verification:**

- [ ] Run on Windows — all paths in JSON output use `/`
- [ ] No `\\` in any output path

**Status:** [x] Fixed

---

### 6. [LOW] No deduplication of filesToTransfer entries

**Issue ID:** FIX-IMPORT-006

**Location:** `.claude/skills/import-asset/scripts/analyze-dependencies.js:216-264`

**Problem:**
If the same file is referenced by multiple dependency paths, it appears multiple times in `filesToTransfer`. This creates confusing diagnostic output.

**Expected:**
Before pushing to `filesToTransfer`, check if a file with the same `source` path already exists:

```javascript
function addFileToTransfer(report, entry) {
  const exists = report.filesToTransfer.some(f => f.source === entry.source);
  if (!exists) {
    report.filesToTransfer.push(entry);
  }
}
```

**Verification:**

- [ ] Test with an agent that references the same file in multiple dependency types
- [ ] Verify no duplicate entries in output

**Status:** [x] Fixed

---

## SKILL.md Updates Required

In addition to the script fixes, update `SKILL.md`:

### S1. Add `data:` to Phase 3 dependency mapping

Add this line to the mapping list in Phase 3:
```
- `data:` → `.aios-core/development/data/{name}`
```

### S2. Use dynamic path in Phase 3 examples

Change hardcoded `.aios-core/` to `{core-dir}/` in the mapping list.

### S3. Add Phase 8: ROLLBACK (optional)

Brief section describing how to undo an import if something goes wrong.

---

## Constraints

**CRITICAL: @dev must follow these constraints:**

- [ ] Fix ONLY the issues listed above
- [ ] Do NOT add new features beyond what's specified
- [ ] Do NOT refactor unrelated code
- [ ] Test each fix with the analyst.md agent from aios-atualiza fork
- [ ] Verify the script still produces valid JSON output
- [ ] Update SKILL.md for items S1 and S2

---

## After Fixing

1. Mark each issue as fixed in this document
2. Run test: `node .claude/skills/import-asset/scripts/analyze-dependencies.js "/c/Users/markm/OneDrive/Documentos/GitHub/aios-atualiza" ".aiox-core/development/agents/analyst.md" "/c/Users/markm/OneDrive/Documentos/GitHub/aios-core"`
3. Verify H1 fix: run against `qa.md` — should NOT show coderabbit tools as dependencies
4. Verify H2 fix: run against `qa.md` — should show `data/technical-preferences.md`
5. Request QA re-review: `@qa *review import-asset`

---

_Generated by Quinn (Test Architect) - AIOS QA System_
