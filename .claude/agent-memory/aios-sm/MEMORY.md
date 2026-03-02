# SM Agent Memory — River (Facilitator)

## Story Repository Layout

- Active stories: `docs/stories/active/*.story.md`
- Completed stories: `docs/stories/completed/*.story.md`
- Backlog/PRDs: `docs/prd/*.md`
- Story numbering: epic.story format (e.g., 7.1, 8.3, 9.1)
- All story files use `.story.md` suffix pattern

## CodeRabbit Integration Section

Every story must include `## 🤖 CodeRabbit Integration` section.
As of 2026-03-02, all existing stories (active + completed) already have this section.
Reference model: `docs/stories/active/7.1.story.md` (Story 7.1 — Seedance integration).

## Project Context

- coderabbit_integration.enabled = true (core-config.yaml Section 9)
- WSL installation: `~/.local/bin/coderabbit`
- Pre-commit command: `wsl bash -c 'cd ${PROJECT_ROOT} && ~/.local/bin/coderabbit --prompt-only -t uncommitted'`
- Pre-PR command: `wsl bash -c 'cd ${PROJECT_ROOT} && ~/.local/bin/coderabbit --prompt-only --base main'`
- Self-healing: CRITICAL → auto_fix, HIGH → auto_fix, MEDIUM → document_as_debt, LOW → ignore

## Verified Patterns

- Story template location: `.aios-core/product/templates/story-tmpl.yaml`
- Story checklist: `.aios-core/product/checklists/story-draft-checklist.md`
- Task file for story creation: `.aios-core/development/tasks/create-next-story.md`
