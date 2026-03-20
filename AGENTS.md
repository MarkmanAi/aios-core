<!-- Shared conventions also in .claude/CLAUDE.md — keep in sync -->

# AGENTS.md — MarkmanAi AIOS

This file configures Codex CLI sessions in the aios-core repository.
You are one of two execution runtimes (the other is Claude Code). One active editor at a time.

---

## Section 1: Project Identity

- **Type:** Monorepo with TypeScript, Next.js dashboard, and Node.js packages
- **AIOS** is an autonomous organization with agents, not just software — every agent is an employee, every squad is a department, every workflow is a business process
- **System index:** `.aios/codebase-map.json` — consult before broad codebase changes
- **Governed by:** AIOS Constitution (`.aios-core/constitution.md` v1.1.0, including Section VII: Runtime Governance)

---

## Section 2: Validation Commands

Run all validation commands after any code change:

```bash
npm test                # Jest — must pass with no failures
npm run lint            # ESLint — must pass with no errors
npm run typecheck       # TypeScript — must pass with no errors
npm run build           # Canonical root build (monorepo) — must complete successfully
# Root build delegates to apps/dashboard build (see package.json and docs/architecture/ci-cd.md)
```

---

## Section 3: Coding Conventions

### Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `WorkflowList` |
| Hooks | `use` prefix | `useWorkflowOperations` |
| Files | kebab-case | `workflow-list.tsx` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |
| Interfaces | PascalCase + suffix | `WorkflowListProps` |

### Imports

- **Absolute imports only:** `import { x } from '@/stores/feature/store'`
- **Never relative:** `../../../` is forbidden
- Import order: React/core → External → UI → Utilities → Stores → Feature → CSS

### TypeScript

- No `any` — use `unknown` with type guards
- Define interface for all component props
- Use `as const` for constant objects/arrays

### Error Handling

```typescript
try {
  // Operation
} catch (error) {
  logger.error(`Failed to ${operation}`, { error })
  throw new Error(`Failed to ${operation}: ${error instanceof Error ? error.message : 'Unknown'}`)
}
```

---

## Section 4: Protected Paths

Do not modify these paths unless explicitly authorized by the current story:

- `.aios-core/` — Core framework (read-only)
- `.neo/` — Neo org chart and Matrix data (read-only)
- `.claude/` — Claude Code configuration (read-only)
- `.codex/config.toml` — Codex project config (read-only)
- `.codex/rules/` — Command guardrails (read-only)

---

## Section 5: Git Rules

| Operation | Status | Reason |
|-----------|--------|--------|
| `git push` | FORBIDDEN | Constitution Art. II: only @devops pushes |
| `git rebase` | FORBIDDEN | Destructive history rewrite |
| `git reset --hard` | FORBIDDEN | Uncommitted work loss |
| Force operations | FORBIDDEN | No force flags allowed |
| Commit format | REQUIRED | Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, etc.) |

Reference story ID in commits: `feat: implement feature [Story 25.1]`

---

## Section 6: Story Context

- Check `docs/stories/active/` for current story context before implementing
- All development is story-driven — no code without a story
- Update task checkboxes as you complete them: `[ ]` → `[x]`
- Maintain the File List in the story with all changed files

---

## Section 7: Done Criteria

A task is done when:

1. All validation commands pass (`npm test`, `npm run lint`, `npm run typecheck`, `npm run build`)
2. Diff reviewed — no unintended changes, no debug artifacts left behind
3. Story acceptance criteria are satisfied (all checkboxes checked)
