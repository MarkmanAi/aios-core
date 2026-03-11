# Session Digest - Memory Intelligence

**Module:** `pro/memory/session-digest`
**Story:** MIS-3 - Session Digest (PreCompact Hook)
**Architecture:** Open Core (AIOS Pro)

---

## Overview

Session Digest extrae aprendizados, correções e heurísticas da sessão atual antes do context compact. Captura conhecimento institucional que seria perdido após compactação de contexto.

### Captured Intelligence

1. **User Corrections** - Quando usuário corrige suposições do agente
2. **Patterns Observed** - Padrões recorrentes na conversação
3. **Axioms Learned** - Verdades fundamentais descobertas
4. **Context Snapshot** - Estado de alto nível da sessão

---

## Architecture

```
Claude Code PreCompact Hook
         ↓
.aios-core/hooks/unified/runners/precompact-runner.js
         ↓ (pro-detector)
pro/memory/session-digest/extractor.js
         ↓
.aios/session-digests/{session-id}-{timestamp}.yaml
```

**Flow:**
1. PreCompact hook fires (Claude Code native event)
2. Hook runner detects aios-pro availability
3. If available: fire-and-forget async digest extraction
4. If not available: graceful no-op (log and return)
5. **Never blocks compact** (< 5s timeout)

---

## Module API

### `extractSessionDigest(context)`

Main entry point called by hook runner.

**Parameters:**
```javascript
{
  sessionId: string,        // Unique session identifier
  projectDir: string,       // Project root directory
  conversation: {
    messages: Array<{
      role: 'user' | 'assistant',
      content: string
    }>
  },
  metadata: {
    sessionStart: number,   // Timestamp
    compactTrigger: string, // Reason for compact
    activeAgent: string,    // e.g., '@dev'
    activeStory: string,    // e.g., 'MIS-3'
    filesModified: string[],
    commandsExecuted: string[]
  }
}
```

**Returns:** `Promise<string>` - Path to created digest file

**Throws:** `Error` if extraction or storage fails

---

## Extraction Algorithms

### User Corrections Detection

**Keywords:**
- "Actually, ..."
- "No, that's wrong ..."
- "The correct way is ..."

**Example:**
```
User: "Actually, the path should be `.aios/sessions/` not `.aios-sessions/`"
→ Captured as correction
```

### Pattern Identification

**Heuristics:**
- Question types (how-to, what-is, why)
- Tool usage frequency
- Repeated workflows

**Example:**
```
User asks "how do I..." 3+ times
→ Pattern: "User frequently asks how-to questions"
```

### Axiom Extraction

**Keywords:**
- "Always use ..."
- "Never do ..."
- "Must be ..."
- "Required: ..."

**Example:**
```
Assistant: "Always use ESLint for code quality."
→ Axiom: "Always use ESLint for code quality"
```

---

## Output Format

### YAML Schema (v1.0)

```yaml
---
schema_version: "1.0"
session_id: "session-abc123"
timestamp: "2026-02-09T18:00:00.000Z"
duration_minutes: 45
agent_context: "@dev implementing Story MIS-3"
compact_trigger: "context_limit_90%"
---

## User Corrections

- "Actually, the path should be `.aios/sessions/` not `.aios-sessions/`"
- "Tests should expect `null`, not objects"

## Patterns Observed

- Pattern: "Test expectations must match implementation changes"
- Pattern: "Always verify consumer count before removing modules"

## Axioms Learned

- Axiom: "Hooks unified require runners/ directory to function"
- Axiom: "CodeRabbit integration catches regressions early"

## Context Snapshot

**Active Agent:** @dev
**Active Story:** MIS-3
**Files Modified:** hook-interface.js, precompact-runner.js
**Commands Executed:** npm test, git add
```

---

## Performance

**Requirements (Story MIS-3):**
- Digest extraction: **< 5 seconds**
- Hook return time: **< 50ms** (fire-and-forget)

**Optimizations:**
- Async execution via `setImmediate`
- Limited to 10 corrections, 5 patterns, 10 axioms per digest
- No deep analysis of raw message content (patterns only)

---

## Error Handling

**Strategy:** Silent failures (never block user)

```javascript
try {
  await extractSessionDigest(context);
} catch (error) {
  console.error('[SessionDigest] Failed (silent):', error.message);
  // Don't propagate - compact continues
}
```

**Graceful Degradation:**
- If aios-pro not available: no-op
- If extraction fails: log error, return
- If write fails: throw (caller handles)

---

## Testing

### Unit Tests

```bash
npm test -- tests/pro/memory/session-digest/extractor.test.js
```

**Coverage:**
- Correction extraction
- Pattern identification
- Axiom extraction
- Context snapshot
- YAML generation
- File writing

### Integration Tests

```bash
npm test -- tests/integration/hooks/precompact-flow.integration.test.js
```

**Coverage:**
- End-to-end flow (hook → extractor → file)
- Performance benchmarking (< 5s requirement)
- Schema validation (v1.0 structure)
- Graceful degradation (no aios-pro)

---

## Future Evolution

### Schema Versioning

**v1.0:** Initial schema (current)
**v1.1:** Add `tools_used` field (planned MIS-4)
**v2.0:** Add semantic embeddings (planned MIS-5)

**Backward Compatibility:**

Readers MUST handle all versions:

```javascript
function readDigest(filePath) {
  const digest = parseYAML(filePath);
  const version = digest.schema_version || "1.0";

  switch (version) {
    case "1.0": return parseV1(digest);
    case "1.1": return parseV1_1(digest);
    case "2.0": return parseV2(digest);
    default: throw new Error(`Unsupported: ${version}`);
  }
}
```

### Planned Enhancements (MIS-4+)

- **MIS-4:** Progressive retrieval (index → context → detail)
- **MIS-5:** Self-learning engine (pattern reinforcement)
- **MIS-6:** Pipeline integration (auto-inject relevant digests)
- **MIS-7:** Auto-evolution (CLAUDE.md updates)

---

## Dependencies

```json
{
  "yaml": "^2.8.2"
}
```

---

## Related Stories

- **MIS-1:** Investigation & Architecture Design
- **MIS-2:** Dead Code Cleanup (cleaned hooks foundation)
- **MIS-3:** Session Digest (PreCompact Hook) ← **THIS MODULE**
- **MIS-4:** Progressive Memory Retrieval (consumer)
- **MIS-5:** Self-Learning Engine (consumer)

---

*Session Digest Module - AIOS Pro*
*Created: 2026-02-09 - Story MIS-3*
