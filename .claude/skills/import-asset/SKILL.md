---
name: import-asset
description: This skill should be used when the user wants to import assets (agents, squads, skills, code modules) from an external repository into the current project. It performs dependency analysis, diagnostic checks, and generates a complete import checklist to ensure 100% functional transfer. Triggers on requests like "import agent", "bring from repo", "trazer do fork", "importar asset", "copy from another repo".
---

# Import Asset — Cross-Repository Asset Transfer

This skill analyzes, diagnoses, and imports assets from external repositories into the current project with full dependency resolution.

## When This Skill Activates

- User wants to bring an agent, squad, skill, or code module from another repo
- User says "trazer do fork", "importar", "import from repo", "bring asset"
- User wants to copy functional components between repositories

## Workflow

### Phase 1: SOURCE IDENTIFICATION

Ask the user (if not provided):

1. **Source repo path** — Where to import FROM
   - Example: `/c/Users/markm/OneDrive/Documentos/GitHub/aios-atualiza`
   - Can also be a GitHub URL (will need to clone first)
2. **Asset to import** — What specifically to bring
   - Example: "the analyst agent", "the mmos squad", "the synapse skill"
3. **Target repo** — Where to import TO (defaults to current working directory)

### Phase 2: ASSET DISCOVERY

Based on the asset type, locate the primary file:

| Asset Type | Typical Location | Primary File |
|------------|-----------------|--------------|
| Agent | `.aios-core/development/agents/` or `.aiox-core/development/agents/` | `{name}.md` |
| Squad | `squads/` or `.claude/skills/` | Squad config file |
| Skill | `.claude/skills/` | `SKILL.md` |
| Script | `.aios-core/development/scripts/` or `.aiox-core/development/scripts/` | `{name}.js` |
| Task | `.aios-core/development/tasks/` or `.aiox-core/development/tasks/` | `{name}.md` |
| Template | `.aios-core/development/templates/` | `{name}.md` |
| Code module | `src/` or `packages/` | Entry file |

**IMPORTANT:** The source repo may use `.aios-core/` OR `.aiox-core/` as its core directory. Check BOTH paths during discovery.

### Phase 3: DEPENDENCY ANALYSIS

Read the primary file and extract ALL dependencies recursively:

#### For Agents (.md with YAML block):
1. Parse the `dependencies:` section in the YAML block
2. Map each dependency type to its file path:
   - `tasks:` → `{core-dir}/development/tasks/{name}`
   - `templates:` → `{core-dir}/development/templates/{name}`
   - `checklists:` → `{core-dir}/development/checklists/{name}`
   - `scripts:` → `{core-dir}/development/scripts/{name}`
   - `utils:` → `{core-dir}/development/utils/{name}`
   - `workflows:` → `{core-dir}/development/workflows/{name}`
   - `data:` → `{core-dir}/development/data/{name}`
   - `tools:` → External tools (note if they need installation)
3. For each dependency file found, check if IT has sub-dependencies
4. Build the complete dependency tree

#### For Squads:
1. List all agent files in the squad
2. For each agent, run the agent dependency analysis above
3. Check for shared configs, data files, templates

#### For Skills:
1. Check `scripts/` subdirectory
2. Check `references/` subdirectory
3. Check `assets/` subdirectory
4. Check for any file references in the SKILL.md content

#### For Code Modules (JS/TS):
1. Parse `import` and `require` statements
2. Identify local imports vs npm packages
3. For local imports, trace the full dependency chain
4. Check `package.json` for npm dependencies not in target repo

### Phase 4: DIAGNOSTIC REPORT

Generate a structured report with this EXACT format:

```
═══════════════════════════════════════════════════
  IMPORT DIAGNOSTIC — {Asset Name}
═══════════════════════════════════════════════════

SOURCE: {source_repo_path}
TARGET: {target_repo_path}
ASSET TYPE: {Agent | Squad | Skill | Script | Code Module}
PRIMARY FILE: {path_to_main_file}

───────────────────────────────────────────────────
  DEPENDENCY TREE
───────────────────────────────────────────────────

{primary_file}
├── {dependency_1} ........... {EXISTS | MISSING | DIFFERENT}
│   ├── {sub_dep_1} ......... {EXISTS | MISSING | DIFFERENT}
│   └── {sub_dep_2} ......... {EXISTS | MISSING | DIFFERENT}
├── {dependency_2} ........... {EXISTS | MISSING | DIFFERENT}
└── {dependency_3} ........... {EXISTS | MISSING | DIFFERENT}

───────────────────────────────────────────────────
  FILES TO TRANSFER
───────────────────────────────────────────────────

  # | Source Path                          → Target Path                          | Status
 ---|--------------------------------------|---------------------------------------|--------
  1 | {source/path/file}                   → {target/path/file}                   | NEW
  2 | {source/path/file2}                  → {target/path/file2}                  | OVERWRITE
  3 | {source/path/file3}                  → {target/path/file3}                  | SKIP (identical)

───────────────────────────────────────────────────
  NPM PACKAGES
───────────────────────────────────────────────────

  Package          | Source Version | Target Version | Action
 ------------------|---------------|----------------|--------
  {package-name}   | ^1.2.3        | (not installed)| INSTALL
  {package-name}   | ^2.0.0        | ^2.0.0         | OK

───────────────────────────────────────────────────
  EXTERNAL TOOLS
───────────────────────────────────────────────────

  Tool             | Required By    | Available? | Action
 ------------------|---------------|------------|--------
  {tool-name}      | {agent.md}    | YES / NO   | {note}

───────────────────────────────────────────────────
  ORGANIZATIONAL REGISTRY
───────────────────────────────────────────────────

  Registry              | Needs Update?
 -----------------------|---------------
  ORGANOGRAMA.md        | YES — new agent must be registered
  entity-registry.yaml  | YES — new entity entry needed
  CLAUDE.md             | NO

───────────────────────────────────────────────────
  PATH ADJUSTMENTS
───────────────────────────────────────────────────

  If the source uses a different core directory name (e.g., .aiox-core vs .aios-core),
  list all path references that need rewriting:

  File                  | Old Path             | New Path
 -----------------------|---------------------|---------------------
  {file}                | .aiox-core/...      | .aios-core/...

───────────────────────────────────────────────────
  RISK ASSESSMENT
───────────────────────────────────────────────────

  CRITICAL: {count} — Must resolve before import
  WARNING:  {count} — Should review after import
  INFO:     {count} — No action needed

  [CRITICAL] {description of critical issue}
  [WARNING]  {description of warning}
  [INFO]     {description of info item}

═══════════════════════════════════════════════════
  VERDICT: {READY TO IMPORT | NEEDS FIXES | BLOCKED}
═══════════════════════════════════════════════════
```

### Phase 5: IMPORT CHECKLIST

Present an interactive checklist:

```
IMPORT CHECKLIST — {Asset Name}

[ ] 1. Copy primary file to target
[ ] 2. Copy dependency files ({count} files)
[ ] 3. Rewrite paths (.aiox-core → .aios-core if needed)
[ ] 4. Install npm packages ({count} packages)
[ ] 5. Register in ORGANOGRAMA.md (if agent/squad)
[ ] 6. Register in entity-registry (if applicable)
[ ] 7. Validate all imports resolve correctly
[ ] 8. Test asset activation

Proceed with import? (Y/n)
```

### Phase 6: EXECUTION

If user confirms:

1. **Copy files** — Use `cp` commands, preserving directory structure
2. **Rewrite paths** — If source uses different core dir name, sed/replace all references
3. **Install packages** — Run `npm install {packages}` if needed
4. **Update registries** — Add entries to ORGANOGRAMA.md and entity-registry
5. **Validate** — Try to read/parse each copied file to confirm integrity
6. **Report** — Show final status of each checklist item

### Phase 7: POST-IMPORT VALIDATION

After import completes:

1. **File integrity** — Verify all files exist at target paths
2. **Reference resolution** — Check that all internal references point to existing files
3. **Syntax check** — For YAML/JSON files, verify they parse correctly
4. **Activation test** — For agents/skills, suggest user test activation

## Rules

- **NEVER modify the source repository** — read-only access
- **NEVER modify files in target that are not part of the import** — surgical precision
- **Always show diagnostic BEFORE executing** — user must confirm
- **If source and target use different directory names** (e.g., `.aiox-core` vs `.aios-core`), automatically detect and offer path rewriting
- **If a file already exists in target**, show diff summary and ask before overwriting
- **Track every file copied** for rollback capability
- **All YAML and code must remain in English** per project convention
