# Memory Writer — Architecture Design
## Epic 16, Story 16.1 | Gate: @architect (Aria) approval

**Status:** APPROVED
**Author:** @architect (Aria)
**Date:** 2026-03-09
**Reviewed against:** `memory-retriever.js`, `memory-index.js`, `self-learner.js`, `session-digest/extractor.js`, `synapse/index.js`

---

## 1. Problem Statement

SYNAPSE has a complete **read stack** but zero **write infrastructure** for memory stores:

```
SessionDigestExtractor → .aios/session-digests/  ✓ (writes)
MemoryIndexManager     → indexes session-digests  ✓ (reads + indexes)
SelfLearner            → extracts patterns/axioms ✓ (detects, does NOT persist)
MemoryRetriever        → progressive disclosure   ✓ (reads via index)

.aios/memories/shared/session/  ← EMPTY (nothing writes here)
.aios/memories/shared/daily/    ← EMPTY (nothing writes here)
.aios/memories/shared/durable/  ← gotchas only (JSON, not indexed)
```

`MemoryWriter` closes this gap. It is the **write counterpart** to `MemoryRetriever`.

---

## 2. Architectural Constraints (Discovered from Codebase)

### 2.1 How MemoryRetriever reads files

`MemoryRetriever` is **index-driven**: it calls `MemoryIndexManager.search()` to get candidates, then reads `result.filePath` for Layer 2/3 content. This means:

> **Any file that MemoryWriter creates MUST be registered in the master index (`master.json`) for MemoryRetriever to find it.**

### 2.2 How MemoryIndexManager builds its index

`MemoryIndexManager.buildIndex()` only scans `.aios/session-digests/`. It does NOT scan `.aios/memories/shared/`. This is a known gap that MemoryWriter must work around in Epic 16 (full index federation is Epic 17 scope).

**Mitigation:** MemoryWriter patches `master.json` directly after writing each file. This makes the memory immediately findable without a full index rebuild. If a full rebuild is triggered, entries written by MemoryWriter are temporarily invisible until the next write cycle. This is acceptable for Epic 16.

### 2.3 How _extractRelevantChunks works (Layer 2 parsing)

`MemoryRetriever._extractRelevantChunks(content)` looks for these patterns in file body:

| Chunk Type  | Regex                            | Format Required            |
|-------------|----------------------------------|----------------------------|
| `pattern`   | `/Pattern: "([^"]+)"/g`          | `Pattern: "text"`          |
| `axiom`     | `/Axiom:\s*([^\n]+)/g`           | `Axiom: text`              |
| `correction`| `/Actually[^.]+\./gi`            | Sentence starting with "Actually..." |
| `evidence`  | `/Evidence:\n((?:- [^\n]+\n?){1,2})/` | `Evidence:\n- item`   |

> **MemoryWriter body MUST use these exact format strings for Layer 2 retrieval to extract meaningful chunks.**

### 2.4 How Layer 3 body extraction works

```js
const bodyMatch = content.match(/^---\n[\s\S]+?\n---\n([\s\S]+)$/);
const body = bodyMatch ? bodyMatch[1].trim() : '';
```

> **Files MUST use `---\nfrontmatter\n---\nbody` format with UNIX line endings.**

### 2.5 Master index entry shape (from MemoryIndexManager)

```js
{
  id: string,               // Required by MemoryRetriever
  timestamp: string,        // ISO 8601
  agent: string,            // 'shared' or agent ID
  tags: string[],           // Array of tag strings
  attention_score: number,  // 0.0–1.0
  sector: string,           // 'procedural'|'semantic'|'reflective'|'episodic'
  tier: string,             // 'hot'|'warm'|'cold'
  filePath: string,         // Absolute path to file (used by Layer 2/3 reads)
  compact_trigger: string,  // Optional
  duration_minutes: number, // Optional, default 0
}
```

---

## 3. File Naming Convention

Pattern: `{type}-{agentId}-{YYYY-MM-DD}-{seq:3}.yaml`

| Tier    | Directory                                    | Example filename                      |
|---------|----------------------------------------------|---------------------------------------|
| session | `.aios/memories/shared/session/`             | `session-dev-2026-03-09-001.yaml`     |
| daily   | `.aios/memories/shared/daily/`               | `daily-dev-2026-03-09-001.yaml`       |
| durable | `.aios/memories/shared/durable/`             | `durable-dev-2026-03-09-001.yaml`     |
| durable/heuristics | `.aios/memories/shared/durable/heuristics/` | `durable-shared-2026-03-09-001.yaml` |

**Rules:**
- `agentId` sanitized: lowercase alphanumeric + hyphens, max 20 chars
- `seq` is per-tier, per-day counter (001–999), derived by scanning existing files
- Heuristics always use `agent=shared` regardless of caller agentId

---

## 4. YAML Frontmatter Schema

```yaml
---
schema_version: "2.0"
id: "mem-dev-2026-03-09-001"
agent: "shared"
tier: "session"
memory_type: "pattern"
timestamp: "2026-03-09T10:00:00.000Z"
attention_score: 0.75
confidence: 0.9
evidence_count: 1
sector: "reflective"
tags: []
duration_minutes: 0
source: "memory-writer"
---
```

### Field Definitions

| Field            | Type     | Required | Description                                      |
|------------------|----------|----------|--------------------------------------------------|
| `schema_version` | string   | yes      | Always `"2.0"` for memory-writer files           |
| `id`             | string   | yes      | Unique memory ID — used by MemoryRetriever       |
| `agent`          | string   | yes      | Owner agent ID or `"shared"`                     |
| `tier`           | string   | yes      | Storage tier: `session` / `daily` / `durable`   |
| `memory_type`    | string   | yes      | Content type: `pattern` / `axiom` / `correction` / `heuristic` / `gotcha` / `general` |
| `timestamp`      | string   | yes      | ISO 8601 write timestamp                         |
| `attention_score`| number   | yes      | Initial score `[0.0, 1.0]` — managed by SelfLearner after creation |
| `confidence`     | number   | yes      | Initial confidence `[0.0, 1.0]`                  |
| `evidence_count` | number   | yes      | Number of evidence items supporting this memory  |
| `sector`         | string   | yes      | Cognitive sector (see §7)                        |
| `tags`           | string[] | yes      | Searchable tags                                  |
| `duration_minutes`| number  | no       | Default `0` — inherited from source session if known |
| `source`         | string   | yes      | Always `"memory-writer"` — distinguishes from session-digest files |

### ID Generation Formula

```
mem-{agentId}-{YYYY-MM-DD}-{seq:3}
```

Example: `mem-dev-2026-03-09-001`

---

## 5. YAML Body Schema

The body must be parseable by `_extractRelevantChunks()`. Required sections in order:

```yaml
---
[frontmatter]
---

## Patterns Observed

- Pattern: "text of the pattern"

## Axioms Learned

- Axiom: text of the axiom

## Evidence

- evidence item 1
- evidence item 2

## Context

Source: memory-writer
Memory Type: pattern
Confidence: 0.9
```

**Rules:**
- Each section is optional BUT the body must include at least the section(s) relevant to `memory_type`
- `Pattern: "..."` → must be quoted for `_extractRelevantChunks` regex to match
- `Axiom:` → text follows on same line (no quotes required)
- `Evidence:` → markdown list with 1–10 items
- Empty sections write `- (none)` placeholder

---

## 6. Public API

```js
class MemoryWriter {
  constructor(projectDir)
```

### `write(agentId, content, tier, options?)`

**Primary API — used by SelfLearner and any future writer.**

```js
/**
 * @param {string} agentId       - Agent that generated this memory ('dev', 'shared', etc.)
 * @param {MemoryContent} content - Content object (see below)
 * @param {'session'|'daily'|'durable'} tier - Target tier
 * @param {WriteOptions} [options] - Optional overrides
 * @returns {Promise<WriteResult>}
 */
async write(agentId, content, tier, options = {})
```

**MemoryContent shape:**

```js
{
  type: 'pattern' | 'axiom' | 'correction' | 'heuristic' | 'gotcha' | 'general',
  text: string,            // Main content text (required)
  evidence?: string[],     // Evidence items (optional, max 10)
  confidence?: number,     // [0.0, 1.0], default derived from tier
  evidence_count?: number, // Default: evidence.length || 1
  tags?: string[],         // Additional tags
  sector?: string,         // Override auto-detected sector
}
```

**WriteOptions:**

```js
{
  sector?: string,           // Override auto-detected cognitive sector
  attention_score?: number,  // Override initial attention score
  skipIndex?: boolean,       // Skip master.json patch (testing only)
}
```

**WriteResult:**

```js
{
  id: string,       // Memory ID
  filePath: string, // Absolute path to written file
  tier: string,     // Actual tier written to (may differ if durable+heuristic)
}
```

### `writeHeuristic(agentId, heuristic, options?)`

Convenience wrapper for heuristic candidates from SelfLearner. Always writes to `durable/heuristics/`.

```js
/**
 * @param {string} agentId
 * @param {HeuristicCandidate} heuristic - Shape matches SelfLearner._extractHeuristics() output
 * @param {WriteOptions} [options]
 * @returns {Promise<WriteResult>}
 */
async writeHeuristic(agentId, heuristic, options = {})
```

---

## 7. Tier Routing Logic

```
                      ┌─────────────────────┐
                      │    MemoryWriter      │
                      │    .write(...)       │
                      └──────────┬──────────┘
                                 │ tier param
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
               'session'     'daily'      'durable'
                    │            │            │
                    │            │     ┌──────┴──────┐
                    │            │     │  type=       │
                    │            │     │  heuristic?  │
                    │            │     └──────┬───────┘
                    │            │         yes│  no
                    │            │            ▼   ▼
          shared/   │  shared/   │  durable/  │  shared/
          session/  │  daily/    │  heuristics/│  durable/
```

### Tier Selection Rules (for SelfLearner integration)

| Source                                       | Tier      |
|----------------------------------------------|-----------|
| Single-session pattern, correction            | `session` |
| Cross-session pattern (evidence_count >= 3)   | `daily`   |
| Heuristic candidate (confidence > 0.9, ev>=5)| `durable` |
| Auto-gotcha (3+ sessions)                    | `durable` |
| Axiom (always durable by nature)             | `durable` |

---

## 8. Sector Auto-Detection

When `sector` is not provided, MemoryWriter infers it from content type:

| memory_type   | Default sector  |
|---------------|-----------------|
| `pattern`     | `procedural`    |
| `axiom`       | `semantic`      |
| `correction`  | `reflective`    |
| `heuristic`   | `reflective`    |
| `gotcha`      | `reflective`    |
| `general`     | `episodic`      |

---

## 9. Initial Attention Score Formula

MemoryWriter assigns an initial score at write time. SelfLearner will recalculate on subsequent runs.

```js
const INITIAL_SCORES = {
  session:  { base: 0.65, confidenceFactor: true },
  daily:    { base: 0.75, confidenceFactor: true },
  durable:  { base: 0.85, confidenceFactor: true },
};

// initial_score = base * confidence
// Clamped [0.0, 1.0]
```

---

## 10. Master Index Integration

After writing the file, MemoryWriter patches `.aios/session-digests/index/master.json` directly:

```js
// Entry injected into master.json:
{
  id,
  timestamp,
  agent: agentId,
  tags: content.tags || [],
  attention_score,
  sector,
  tier: attentionTier,   // 'hot' | 'warm' | 'cold' — derived from attention_score
  filePath,              // Absolute path to the written file
  compact_trigger: 'memory-writer',
  duration_minutes: 0,
}
```

**Attention tier classification (for index):**

```js
if (attention_score > 0.7) → 'hot'
if (attention_score >= 0.3) → 'warm'
else → 'cold'
```

**Index patch is atomic:** read → merge → write (with `{ recursive: true }` mkdir guard).

> **Known limitation (Epic 16 scope):** A full `MemoryIndexManager.buildIndex()` call will NOT pick up MemoryWriter files because it only scans `session-digests/`. Files remain in the store directory but disappear from the live index until the next `MemoryWriter.write()` call re-registers them. Full index federation is deferred to Epic 17.

---

## 11. Integration Contract with SelfLearner

SelfLearner calls MemoryWriter after its pipeline steps. The integration points in `self-learner.js` are:

### Pattern/Axiom persistence (Story 16.2)

After `_accumulateEvidence()`, call for entries with `evidence_count >= 2`:

```js
// In SelfLearner._persistEvidence() or new method _persistToMemoryStore():
const writer = new MemoryWriter(this.projectDir);

// Session-tier: single-session evidence
await writer.write('shared', {
  type: 'pattern',
  text: entry.text,
  evidence: entry.sessions.map(s => `Session: ${s}`),
  evidence_count: entry.evidence_count,
  confidence: 0.65,
}, 'session');

// Daily-tier: cross-session evidence (evidence_count >= 3)
if (entry.evidence_count >= 3) {
  await writer.write('shared', {
    type: 'pattern',
    text: entry.text,
    evidence: entry.sessions.map(s => `Session: ${s}`),
    evidence_count: entry.evidence_count,
    confidence: 0.80,
  }, 'daily');
}
```

### Heuristic persistence (Story 16.3)

After `_extractHeuristics()`, for each candidate:

```js
await writer.writeHeuristic('shared', heuristicCandidate);
```

Where `heuristicCandidate` matches the shape already produced by `SelfLearner._extractHeuristics()`:
```js
{
  id, type, rule, evidence_summary, confidence, evidence_count,
  proposed_action, proposed_target, proposed_content, source_memories, created
}
```

---

## 12. Integration Contract with MemoryRetriever

**No changes required to MemoryRetriever.** The retriever is already designed to:
1. Search the master index for any agent or `'shared'`
2. Read `result.filePath` for Layer 2/3 content
3. Parse the body with `_extractRelevantChunks()`

As long as MemoryWriter:
- Writes valid YAML with frontmatter + body
- Patches master.json with correct `filePath`
- Uses the body format strings that `_extractRelevantChunks` expects

...MemoryRetriever will return MemoryWriter files in Layer 1/2/3 responses **with zero changes**.

---

## 13. Write Frequency Control

To prevent store bloat, MemoryWriter enforces:

1. **Deduplication:** Before writing, check if an entry with the same `text` (normalized) already exists for the same `tier` today. If yes, update `evidence_count` in existing file rather than creating a new file.
2. **Session tier cap:** Max 20 files per session per agent in `session/` directory.
3. **Daily tier cap:** Max 50 files per day per agent in `daily/` directory.
4. **Durable tier:** No cap — durable memories are high-confidence and intentional.

---

## 14. Error Handling

```js
// MemoryWriter MUST NOT throw on write failure — it degrades gracefully:
try {
  await this._writeFile(filePath, content);
  await this._patchMasterIndex(entry);
  return { id, filePath, tier };
} catch (error) {
  console.warn(`[MemoryWriter] Write failed for ${id}:`, error.message);
  // Return partial result without filePath — caller knows write did not persist
  return { id, filePath: null, tier, error: error.message };
}
```

Rationale: SelfLearner should not abort its entire run because a memory write fails. Memory persistence is best-effort.

---

## 15. Module Location and Export

**File:** `.aios-core/core/synapse/memory/memory-writer.js`

**Export from index.js** (additive — existing exports unchanged):

```js
// .aios-core/core/synapse/index.js — add:
MemoryWriter: require('./memory/memory-writer').MemoryWriter,
createMemoryWriter: require('./memory/memory-writer').createMemoryWriter,
```

**Factory function** (follows `createSelfLearner` pattern):

```js
function createMemoryWriter(projectDir) {
  return new MemoryWriter(projectDir);
}

module.exports = {
  MemoryWriter,
  createMemoryWriter,
};
```

---

## 16. Dependencies

```js
const fs = require('fs').promises;  // async — consistent with SelfLearner, MemoryRetriever
const path = require('path');
const yaml = require('js-yaml');    // already in package.json via SelfLearner
```

**Zero new external dependencies.**

---

## 17. Test Surface (for Story 16.5)

Integration test must validate:

1. `MemoryWriter.write('dev', { type: 'pattern', text: '...', evidence: ['...'] }, 'session')` creates file at `.aios/memories/shared/session/session-dev-{date}-001.yaml`
2. File parses as valid YAML with correct frontmatter fields
3. File body contains `Pattern: "..."` parseable by `_extractRelevantChunks()`
4. `master.json` contains the new entry with correct `filePath`
5. `MemoryRetriever.retrieve({ agent: 'dev', layer: 2 })` returns the written memory in `memories` array
6. After `SelfLearner.run()`, files exist in `session/` and `daily/` directories
7. `MemoryWriter.writeHeuristic()` creates file in `durable/heuristics/`
8. Write frequency deduplication: calling write twice with same text on same day does not create duplicate file

---

## 18. Out of Scope (Epic 16)

- Agent-scoped memory paths (`.aios/memories/{agentId}/`) — Epic 17
- Index rebuild federation (MemoryIndexManager scanning `memories/shared/`) — Epic 17
- Memory deletion or archival API — future
- Memory encryption — future

---

## Gate Decision

**APPROVED — Story 16.1 may enter implementation.**

**Key implementation constraints for @dev:**
1. Use `fs.promises` (async) throughout — no sync I/O
2. Body format strings must match exactly: `Pattern: "..."`, `Axiom: text`, `Evidence:\n- item`
3. Patch `master.json` atomically (read-merge-write, not append)
4. Follow existing error handling style: `console.warn` on write failure, return partial result
5. No new external npm dependencies — `js-yaml` already available
6. Export via `index.js` as `MemoryWriter` + `createMemoryWriter` (factory pattern matching `createSelfLearner`)

---

*Design doc produced by @architect (Aria) — 2026-03-09*
*Gate unblocked: Story 16.1 ready for @sm story expansion and @dev implementation*
