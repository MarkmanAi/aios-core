# Write Tool — Windows Fallback Convention

## Status: FIXED (2026-03-06)

The `EEXIST` bug on Windows has been fixed by Anthropic. The `Write` tool now works correctly when the parent directory already exists.

**Upstream issue (resolved):** https://github.com/anthropics/claude-code/issues/31453

---

## Historical Note

Previously, `Write` failed on Windows with `EEXIST` when the parent directory already existed:

```
Error: EEXIST: file already exists, mkdir 'C:\...\docs\stories\active'
```

**Root cause (fixed):** The tool called `mkdir` internally without `{ recursive: true }`.

## Rule

Use the `Write` tool normally. The Bash fallback is no longer needed.
