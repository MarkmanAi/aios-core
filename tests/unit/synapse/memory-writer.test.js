'use strict';

/**
 * Unit tests for MemoryWriter — Story 16.1
 *
 * Uses a real temp directory to validate actual file I/O.
 * Integration test (full pipeline with MemoryRetriever) is covered in Story 16.5.
 */

const os = require('os');
const path = require('path');
const fs = require('fs').promises;
const yaml = require('js-yaml');

const { MemoryWriter, createMemoryWriter } = require('../../../.aios-core/core/synapse/memory/memory-writer');

// ─── Helpers ────────────────────────────────────────────────────────────────

async function makeTmpDir() {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'memory-writer-test-'));
  return tmp;
}

async function cleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) throw new Error('No frontmatter found');
  return yaml.load(match[1]);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('MemoryWriter', () => {
  let tmpDir;
  let writer;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
    writer = new MemoryWriter(tmpDir);
  });

  afterEach(async () => {
    await cleanDir(tmpDir);
  });

  // ─── AC-8: Factory + export ────────────────────────────────────────────────

  describe('createMemoryWriter()', () => {
    it('should return a MemoryWriter instance', () => {
      const w = createMemoryWriter('/some/path');
      expect(w).toBeInstanceOf(MemoryWriter);
    });

    it('should use provided projectDir', () => {
      const w = createMemoryWriter('/my/project');
      expect(w.projectDir).toBe('/my/project');
    });
  });

  // ─── AC-1: Tier path routing ───────────────────────────────────────────────

  describe('write() — tier path routing (AC-1)', () => {
    it('should create file in session/ for tier=session', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'test pattern' }, 'session', { skipIndex: true });

      expect(result.filePath).not.toBeNull();
      expect(result.tier).toBe('session');
      expect(result.filePath).toContain(path.join('.aios', 'memories', 'shared', 'session'));

      const stat = await fs.stat(result.filePath);
      expect(stat.isFile()).toBe(true);
    });

    it('should create file in daily/ for tier=daily', async () => {
      const result = await writer.write('dev', { type: 'axiom', text: 'test axiom' }, 'daily', { skipIndex: true });

      expect(result.filePath).toContain(path.join('.aios', 'memories', 'shared', 'daily'));
      expect(result.tier).toBe('daily');
    });

    it('should create file in durable/ for tier=durable (non-heuristic)', async () => {
      const result = await writer.write('dev', { type: 'correction', text: 'Correction text here' }, 'durable', { skipIndex: true });

      expect(result.filePath).toContain(path.join('.aios', 'memories', 'shared', 'durable'));
      expect(result.filePath).not.toContain('heuristics');
    });

    it('should create file in durable/heuristics/ for type=heuristic (writeHeuristic)', async () => {
      const result = await writer.writeHeuristic('dev', {
        rule: 'always validate inputs',
        evidence_summary: ['evidence 1'],
        confidence: 0.95,
        evidence_count: 6,
      }, { skipIndex: true });

      expect(result.filePath).toContain(path.join('durable', 'heuristics'));
    });

    it('should create directories recursively if they do not exist', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'dir test' }, 'daily', { skipIndex: true });

      const dir = path.dirname(result.filePath);
      const stat = await fs.stat(dir);
      expect(stat.isDirectory()).toBe(true);
    });
  });

  // ─── AC-2: YAML frontmatter schema ────────────────────────────────────────

  describe('write() — YAML frontmatter correctness (AC-2)', () => {
    it('should produce valid YAML with all required frontmatter fields', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'a pattern' }, 'session', { skipIndex: true });

      const raw = await fs.readFile(result.filePath, 'utf8');
      const fm = parseFrontmatter(raw);

      const requiredFields = [
        'schema_version', 'id', 'agent', 'tier', 'memory_type',
        'timestamp', 'attention_score', 'confidence', 'evidence_count',
        'sector', 'tags', 'source',
      ];
      for (const field of requiredFields) {
        expect(fm).toHaveProperty(field);
      }
    });

    it('should set schema_version to "2.0"', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'test' }, 'session', { skipIndex: true });
      const fm = parseFrontmatter(await fs.readFile(result.filePath, 'utf8'));
      expect(fm.schema_version).toBe('2.0');
    });

    it('should set source to "memory-writer"', async () => {
      const result = await writer.write('dev', { type: 'axiom', text: 'test axiom' }, 'daily', { skipIndex: true });
      const fm = parseFrontmatter(await fs.readFile(result.filePath, 'utf8'));
      expect(fm.source).toBe('memory-writer');
    });

    it('should generate id in format mem-{agentId}-{date}-{seq}', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'test' }, 'session', { skipIndex: true });
      expect(result.id).toMatch(/^mem-dev-\d{4}-\d{2}-\d{2}-\d{3}$/);
    });

    it('should set timestamp as ISO 8601 UTC string', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'ts test' }, 'session', { skipIndex: true });
      const fm = parseFrontmatter(await fs.readFile(result.filePath, 'utf8'));
      expect(() => new Date(fm.timestamp)).not.toThrow();
      expect(fm.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  // ─── AC-3: Body parseable by MemoryRetriever ──────────────────────────────

  describe('write() — YAML body format (AC-3)', () => {
    it('should include Pattern: "text" in body for type=pattern', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'always use async/await' }, 'session', { skipIndex: true });
      const raw = await fs.readFile(result.filePath, 'utf8');

      // Must match MemoryRetriever regex: /Pattern:\s*"([^"]+)"/g
      const match = raw.match(/Pattern:\s*"([^"]+)"/);
      expect(match).not.toBeNull();
      expect(match[1]).toBe('always use async/await');
    });

    it('should include Axiom: text in body for type=axiom', async () => {
      const result = await writer.write('dev', { type: 'axiom', text: 'immutability is good' }, 'daily', { skipIndex: true });
      const raw = await fs.readFile(result.filePath, 'utf8');

      // Must match MemoryRetriever regex: /Axiom:\s*([^\n]+)/g
      const match = raw.match(/Axiom:\s*([^\n]+)/);
      expect(match).not.toBeNull();
      expect(match[1].trim()).toContain('immutability is good');
    });

    it('should include Actually... sentence for type=correction', async () => {
      const result = await writer.write('dev', { type: 'correction', text: 'the API uses POST not GET' }, 'durable', { skipIndex: true });
      const raw = await fs.readFile(result.filePath, 'utf8');

      // Must match MemoryRetriever regex: /Actually[^.]+\./gi
      const match = raw.match(/Actually[^.]+\./i);
      expect(match).not.toBeNull();
    });

    it('should include Evidence:\\n- item section when evidence provided', async () => {
      const result = await writer.write('dev', {
        type: 'pattern',
        text: 'test',
        evidence: ['Session: abc', 'Session: xyz'],
      }, 'session', { skipIndex: true });
      const raw = await fs.readFile(result.filePath, 'utf8');

      // Must match /Evidence:\n((?:- [^\n]+\n?){1,2})/
      const match = raw.match(/Evidence:\n((?:- [^\n]+\n?)+)/);
      expect(match).not.toBeNull();
      expect(match[1]).toContain('- Session: abc');
    });

    it('should use ---\\nfrontmatter\\n---\\nbody format for Layer 3 regex', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'layer3 test' }, 'session', { skipIndex: true });
      const raw = await fs.readFile(result.filePath, 'utf8');

      // Must match MemoryRetriever regex: /^---\n[\s\S]+?\n---\n([\s\S]+)$/
      const bodyMatch = raw.match(/^---\n[\s\S]+?\n---\n([\s\S]+)$/);
      expect(bodyMatch).not.toBeNull();
      expect(bodyMatch[1].trim().length).toBeGreaterThan(0);
    });
  });

  // ─── AC-4: Master index patch ──────────────────────────────────────────────

  describe('write() — master index patch (AC-4)', () => {
    it('should add entry to master.json after write', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'index test' }, 'session');

      const raw = await fs.readFile(writer.masterIndexPath, 'utf8');
      const index = JSON.parse(raw);

      // master.json is a dict { [id]: entry } for MemoryIndexManager compatibility
      expect(index[result.id]).toBeDefined();
    });

    it('should set filePath in index entry pointing to written file', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'filepath test' }, 'session');

      const raw = await fs.readFile(writer.masterIndexPath, 'utf8');
      const index = JSON.parse(raw);
      const entry = index[result.id];

      expect(entry.filePath).toBe(result.filePath);
    });

    it('should set compact_trigger to "memory-writer" in index entry', async () => {
      const result = await writer.write('dev', { type: 'axiom', text: 'compact test' }, 'daily');

      const raw = await fs.readFile(writer.masterIndexPath, 'utf8');
      const index = JSON.parse(raw);
      const entry = index[result.id];

      expect(entry.compact_trigger).toBe('memory-writer');
      expect(entry.duration_minutes).toBe(0);
    });

    it('should preserve existing entries when patching index (read-merge-write)', async () => {
      const r1 = await writer.write('dev', { type: 'pattern', text: 'first entry' }, 'session');
      const r2 = await writer.write('dev', { type: 'axiom', text: 'second entry' }, 'daily');

      const raw = await fs.readFile(writer.masterIndexPath, 'utf8');
      const index = JSON.parse(raw);

      const ids = Object.keys(index);
      expect(ids).toContain(r1.id);
      expect(ids).toContain(r2.id);
    });
  });

  // ─── AC-6: Write frequency control ────────────────────────────────────────

  describe('write() — deduplication (AC-6)', () => {
    it('should NOT create a duplicate file for same text+tier on same day', async () => {
      const r1 = await writer.write('dev', { type: 'pattern', text: 'dedup test pattern' }, 'session', { skipIndex: true });
      const r2 = await writer.write('dev', { type: 'pattern', text: 'dedup test pattern' }, 'session', { skipIndex: true });

      expect(r1.filePath).toBe(r2.filePath);
    });

    it('should increment evidence_count on duplicate write', async () => {
      const r1 = await writer.write('dev', { type: 'pattern', text: 'evidence increment test' }, 'session', { skipIndex: true });

      const fmBefore = parseFrontmatter(await fs.readFile(r1.filePath, 'utf8'));
      const initialCount = fmBefore.evidence_count;

      await writer.write('dev', { type: 'pattern', text: 'evidence increment test' }, 'session', { skipIndex: true });

      const fmAfter = parseFrontmatter(await fs.readFile(r1.filePath, 'utf8'));
      expect(fmAfter.evidence_count).toBe(initialCount + 1);
    });

    it('should NOT false-positive dedup when text is a substring of another pattern', async () => {
      // FP-001 regression: "pattern" must NOT match a file containing "test pattern"
      const r1 = await writer.write('dev', { type: 'pattern', text: 'test pattern for regression' }, 'session', { skipIndex: true });
      const r2 = await writer.write('dev', { type: 'pattern', text: 'test' }, 'session', { skipIndex: true });

      // "test" is a substring of r1 text — must NOT be treated as duplicate
      expect(r2.filePath).not.toBe(r1.filePath);
      expect(r2.filePath).not.toBeNull();
    });

    it('should return existing file when session cap (20) is reached', async () => {
      // Write 20 files for the same agent (unique texts to avoid dedup)
      for (let i = 0; i < 20; i++) {
        await writer.write('dev', { type: 'pattern', text: `cap unique pattern ${i}` }, 'session', { skipIndex: true });
      }

      // 21st write — cap reached, should return existing file without creating a new one
      const result = await writer.write('dev', { type: 'pattern', text: 'cap overflow pattern' }, 'session', { skipIndex: true });

      expect(result.filePath).not.toBeNull();
      expect(result.tier).toBe('session');

      // Directory should still contain exactly 20 files for this agent/day
      const today = new Date().toISOString().split('T')[0];
      const sessionDir = path.join(tmpDir, '.aios', 'memories', 'shared', 'session');
      const files = await fs.readdir(sessionDir);
      const agentFiles = files.filter((f) => f.includes('dev') && f.includes(today));
      expect(agentFiles.length).toBe(20);
    });
  });

  // ─── Fix: TOCTOU race condition in _nextSeq (CodeRabbit CRITICAL) ───────────

  describe('_nextSeq() — concurrent write safety (CodeRabbit fix)', () => {
    it('should not assign the same sequence to two concurrent writes', async () => {
      // Launch two concurrent writes — without the O_EXCL fix, both would read
      // an empty dir, compute seq=1, and overwrite each other.
      const [r1, r2] = await Promise.all([
        writer.write('dev', { type: 'pattern', text: 'concurrent pattern A' }, 'session', { skipIndex: true }),
        writer.write('dev', { type: 'pattern', text: 'concurrent pattern B' }, 'session', { skipIndex: true }),
      ]);

      expect(r1.filePath).not.toBeNull();
      expect(r2.filePath).not.toBeNull();
      // Each write must land in a different file — no silent overwrite
      expect(r1.filePath).not.toBe(r2.filePath);

      // Both files must exist and have the correct content
      const raw1 = await fs.readFile(r1.filePath, 'utf8');
      const raw2 = await fs.readFile(r2.filePath, 'utf8');
      expect(raw1).toContain('concurrent pattern A');
      expect(raw2).toContain('concurrent pattern B');
    });
  });

  // ─── Fix: _findDuplicate ignores memory_type (CodeRabbit MAJOR) ──────────────

  describe('_findDuplicate() — memory_type isolation (CodeRabbit fix)', () => {
    it('should NOT treat pattern and general as duplicates even with the same text', async () => {
      const sameText = 'shared text that appears in both types';

      const r1 = await writer.write('dev', { type: 'pattern', text: sameText }, 'session', { skipIndex: true });
      const r2 = await writer.write('dev', { type: 'general', text: sameText }, 'session', { skipIndex: true });

      // Different memory_type → must NOT be treated as duplicate
      expect(r2.filePath).not.toBe(r1.filePath);
      expect(r2.filePath).not.toBeNull();

      // Verify correct types persisted
      const fm1 = parseFrontmatter(await fs.readFile(r1.filePath, 'utf8'));
      const fm2 = parseFrontmatter(await fs.readFile(r2.filePath, 'utf8'));
      expect(fm1.memory_type).toBe('pattern');
      expect(fm2.memory_type).toBe('general');
    });

    it('should still detect duplicates for same text AND same memory_type', async () => {
      const r1 = await writer.write('dev', { type: 'general', text: 'same general text' }, 'session', { skipIndex: true });
      const r2 = await writer.write('dev', { type: 'general', text: 'same general text' }, 'session', { skipIndex: true });

      // Same type + same text → duplicate detected (no new file)
      expect(r2.filePath).toBe(r1.filePath);
    });
  });

  // ─── Fix: _patchMasterIndex concurrent writes (CodeRabbit MAJOR) ─────────────

  describe('_patchMasterIndex() — concurrent serialization (CodeRabbit fix)', () => {
    it('should preserve all entries when multiple writes patch master.json concurrently', async () => {
      // Fire 5 concurrent writes — without the Promise queue fix, concurrent
      // read-modify-write would cause some entries to overwrite others.
      const texts = ['entry A', 'entry B', 'entry C', 'entry D', 'entry E'];
      const results = await Promise.all(
        texts.map((text) => writer.write('dev', { type: 'pattern', text }, 'session')),
      );

      const raw = await fs.readFile(writer.masterIndexPath, 'utf8');
      const index = JSON.parse(raw);
      const ids = Object.keys(index);

      // All 5 entries must be present — none dropped by race condition
      for (const r of results) {
        expect(ids).toContain(r.id);
      }
    });
  });

  // ─── AC-7: Error handling ──────────────────────────────────────────────────

  describe('write() — error handling (AC-7)', () => {
    it('should NOT throw when fs.writeFile fails — returns { id, filePath: null, error }', async () => {
      // Make target directory a file (unwritable path) to force write failure
      const sessionDir = path.join(tmpDir, '.aios', 'memories', 'shared', 'session');
      await fs.mkdir(path.dirname(sessionDir), { recursive: true });
      // Write a regular file at the directory path so mkdir inside write() fails
      await fs.writeFile(sessionDir, 'NOT_A_DIR');

      const badWriter = new MemoryWriter(tmpDir);

      // Should resolve (not reject) — graceful degradation
      const result = await badWriter.write('dev', { type: 'pattern', text: 'fail test' }, 'session', { skipIndex: true });

      expect(result).toBeDefined();
      expect(result.filePath).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should NOT throw when index patch fails — returns { id, filePath } with filePath set', async () => {
      // Make the index directory a file to force _patchMasterIndex to fail
      const indexDir = path.join(tmpDir, '.aios', 'session-digests', 'index');
      await fs.mkdir(path.dirname(indexDir), { recursive: true });
      await fs.writeFile(indexDir, 'NOT_A_DIR');

      const badWriter = new MemoryWriter(tmpDir);

      // File write should succeed; index patch should fail gracefully
      const result = await badWriter.write('dev', { type: 'pattern', text: 'index patch fail test' }, 'session');

      expect(result).toBeDefined();
      expect(result.filePath).not.toBeNull(); // file was written successfully
      expect(result.error).toBeUndefined();   // no top-level error (partial success)
    });
  });
});
