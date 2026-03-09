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

      const entry = index.find((e) => e.id === result.id);
      expect(entry).toBeDefined();
    });

    it('should set filePath in index entry pointing to written file', async () => {
      const result = await writer.write('dev', { type: 'pattern', text: 'filepath test' }, 'session');

      const raw = await fs.readFile(writer.masterIndexPath, 'utf8');
      const index = JSON.parse(raw);
      const entry = index.find((e) => e.id === result.id);

      expect(entry.filePath).toBe(result.filePath);
    });

    it('should set compact_trigger to "memory-writer" in index entry', async () => {
      const result = await writer.write('dev', { type: 'axiom', text: 'compact test' }, 'daily');

      const raw = await fs.readFile(writer.masterIndexPath, 'utf8');
      const index = JSON.parse(raw);
      const entry = index.find((e) => e.id === result.id);

      expect(entry.compact_trigger).toBe('memory-writer');
      expect(entry.duration_minutes).toBe(0);
    });

    it('should preserve existing entries when patching index (read-merge-write)', async () => {
      const r1 = await writer.write('dev', { type: 'pattern', text: 'first entry' }, 'session');
      const r2 = await writer.write('dev', { type: 'axiom', text: 'second entry' }, 'daily');

      const raw = await fs.readFile(writer.masterIndexPath, 'utf8');
      const index = JSON.parse(raw);

      const ids = index.map((e) => e.id);
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
  });
});
