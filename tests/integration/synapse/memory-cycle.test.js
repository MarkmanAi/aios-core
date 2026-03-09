'use strict';

/**
 * Story 16.5 — Integration Test: Full Memory Cycle
 *
 * End-to-end proof that the broken SYNAPSE memory cycle is now closed:
 *   SessionDigest → SelfLearner → MemoryWriter → Stores → MemoryRetriever
 *
 * AC-1: Session + Daily files written after SelfLearner.run()
 * AC-2: Durable/Heuristics files written for confidence > 0.9
 * AC-3: MemoryRetriever Layer 1 returns index entries
 * AC-4: MemoryRetriever Layer 2 returns chunks with type: pattern|axiom
 * AC-5: MemoryRetriever Layer 3 returns full content containing fixture text
 * AC-6: Neo SYNAPSE domain activates for agentId: neo only
 * AC-7: All file I/O uses temp dir — no real project state pollution
 * AC-8: No mocks for SelfLearner, MemoryWriter, MemoryRetriever, ManifestParser
 * AC-9: All tests pass with npm test
 */

jest.setTimeout(30000);

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { ManifestParser } = require('../../../.aios-core/core/synapse/manifest-parser');
const { MemoryRetriever } = require('../../../.aios-core/core/synapse/memory/memory-retriever');
const { createSelfLearner } = require('../../../.aios-core/core/synapse');
const { createTempProject, cleanupTempProject } = require('./helpers/temp-project');

// AC-7: Snapshot real project session dir BEFORE any test runs
const REAL_SESSION_DIR = path.join(process.cwd(), '.aios', 'memories', 'shared', 'session');
const preTestRealFiles = fs.existsSync(REAL_SESSION_DIR)
  ? new Set(fs.readdirSync(REAL_SESSION_DIR))
  : new Set();

// ─── PIPELINE TESTS (AC-1 through AC-5 + AC-7 + AC-8) ─────────────────────

describe('Story 16.5 — Full Memory Cycle Integration', () => {
  let tempDir;
  let runResult;

  beforeAll(async () => {
    tempDir = createTempProject();
    const learner = createSelfLearner(tempDir);
    runResult = await learner.run({ verbose: false, dryRun: false });
  }, 30000);

  afterAll(() => {
    cleanupTempProject(tempDir);
  });

  // ── AC-1: Session and Daily tier writes ────────────────────────────────────

  describe('AC-1: Session and Daily Tier Writes', () => {
    test('session files written after SelfLearner.run()', () => {
      const sessionDir = path.join(tempDir, '.aios', 'memories', 'shared', 'session');
      const files = fs.readdirSync(sessionDir).filter(f => f.endsWith('.yaml'));
      expect(files.length).toBeGreaterThan(0);
    });

    test('daily files written for evidence_count >= 3', () => {
      const dailyDir = path.join(tempDir, '.aios', 'memories', 'shared', 'daily');
      const files = fs.readdirSync(dailyDir).filter(f => f.endsWith('.yaml'));
      expect(files.length).toBeGreaterThan(0);
    });

    test('session files have schema_version 2.0 and source memory-writer', () => {
      const sessionDir = path.join(tempDir, '.aios', 'memories', 'shared', 'session');
      const files = fs.readdirSync(sessionDir).filter(f => f.endsWith('.yaml'));
      const content = fs.readFileSync(path.join(sessionDir, files[0]), 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
      expect(frontmatterMatch).not.toBeNull();
      const fm = yaml.load(frontmatterMatch[1]);
      expect(fm.schema_version).toBe('2.0');
      expect(fm.source).toBe('memory-writer');
    });
  });

  // ── AC-2: Durable/Heuristics tier write ───────────────────────────────────

  describe('AC-2: Durable/Heuristics Tier Write', () => {
    test('heuristic files written for confidence > 0.9 and evidence_count >= 5', () => {
      const heuristicsDir = path.join(
        tempDir, '.aios', 'memories', 'shared', 'durable', 'heuristics',
      );
      const files = fs.readdirSync(heuristicsDir).filter(f => f.endsWith('.yaml'));
      expect(files.length).toBeGreaterThan(0);
    });

    test('heuristic files have memory_type: heuristic and tier: durable', () => {
      const heuristicsDir = path.join(
        tempDir, '.aios', 'memories', 'shared', 'durable', 'heuristics',
      );
      const files = fs.readdirSync(heuristicsDir).filter(f => f.endsWith('.yaml'));
      const content = fs.readFileSync(path.join(heuristicsDir, files[0]), 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
      expect(frontmatterMatch).not.toBeNull();
      const fm = yaml.load(frontmatterMatch[1]);
      expect(fm.memory_type).toBe('heuristic');
      expect(fm.tier).toBe('durable');
    });

    // Test 3.8 — Stats assertions (from story Task 3, merged from original Task 5)
    test('SelfLearner stats reflect session, daily, and heuristic writes', () => {
      expect(runResult.stats.memories_written_session).toBeGreaterThan(0);
      expect(runResult.stats.memories_written_daily).toBeGreaterThan(0);
      expect(runResult.stats.heuristics_persisted).toBeGreaterThan(0);
      expect(runResult.stats.heuristics_extracted).toBeGreaterThanOrEqual(
        runResult.stats.heuristics_persisted,
      );
    });
  });

  // ── AC-3: MemoryRetriever Layer 1 ─────────────────────────────────────────

  describe('AC-3: MemoryRetriever Layer 1 — Index', () => {
    test('retrieve({ layer: 1 }) returns memories with required index fields', async () => {
      const retriever = new MemoryRetriever(tempDir);
      const result = await retriever.retrieve({ agent: 'shared', layer: 1, tokenBudget: 2000 });
      expect(result.memories.length).toBeGreaterThan(0);
      expect(result.memories[0]).toHaveProperty('id');
      expect(result.memories[0]).toHaveProperty('timestamp');
      expect(result.memories[0]).toHaveProperty('agent');
      expect(result.memories[0]).toHaveProperty('sector');
      expect(result.memories[0]).toHaveProperty('tier');
      expect(result.memories[0]).toHaveProperty('attention_score');
      expect(result.memories[0]).toHaveProperty('tags');
    });
  });

  // ── AC-4: MemoryRetriever Layer 2 ─────────────────────────────────────────

  describe('AC-4: MemoryRetriever Layer 2 — Context Chunks', () => {
    test('retrieve({ layer: 2 }) returns memories with non-empty chunks', async () => {
      const retriever = new MemoryRetriever(tempDir);
      const result = await retriever.retrieve({ agent: 'shared', layer: 2, tokenBudget: 2000 });
      const withChunks = result.memories.filter(m => m.chunks && m.chunks.length > 0);
      expect(withChunks.length).toBeGreaterThan(0);
    });

    test('at least one chunk has type: pattern', async () => {
      const retriever = new MemoryRetriever(tempDir);
      const result = await retriever.retrieve({ agent: 'shared', layer: 2, tokenBudget: 2000 });
      const withChunks = result.memories.filter(m => m.chunks && m.chunks.length > 0);
      const chunkTypes = withChunks.flatMap(m => m.chunks.map(c => c.type));
      expect(chunkTypes).toEqual(expect.arrayContaining(['pattern']));
    });
  });

  // ── AC-5: MemoryRetriever Layer 3 ─────────────────────────────────────────

  describe('AC-5: MemoryRetriever Layer 3 — Full Content', () => {
    test('retrieve({ layer: 3 }) returns memories with non-empty content', async () => {
      const retriever = new MemoryRetriever(tempDir);
      const result = await retriever.retrieve({ agent: 'shared', layer: 3, tokenBudget: 5000 });
      const withContent = result.memories.filter(m => m.content && m.content.length > 0);
      expect(withContent.length).toBeGreaterThan(0);
    });

    test('content contains original fixture evidence text', async () => {
      const retriever = new MemoryRetriever(tempDir);
      const result = await retriever.retrieve({ agent: 'shared', layer: 3, tokenBudget: 5000 });
      const withContent = result.memories.filter(m => m.content && m.content.length > 0);
      expect(withContent.length).toBeGreaterThan(0);
      // MemoryWriter body for pattern type: Pattern: "User consistently validates work..."
      const allContent = withContent.map(m => m.content).join('\n');
      expect(allContent).toContain('User consistently validates work');
    });
  });
});

// ─── NEO DOMAIN TEST (AC-6) ────────────────────────────────────────────────

describe('Story 16.5 — Neo SYNAPSE Domain (AC-6)', () => {
  const synapseDir = path.join(process.cwd(), '.aios-core', 'core', 'synapse');

  test('agent-neo domain file exists', () => {
    const agentNeoPath = path.join(synapseDir, '.synapse', 'agent-neo');
    expect(fs.existsSync(agentNeoPath)).toBe(true);
  });

  test('ManifestParser activates agent-neo for agentId: neo', () => {
    const parser = new ManifestParser(synapseDir);
    const registry = parser.parse();
    const domains = parser.getActiveDomains(registry, { agentId: 'neo' });
    const files = domains.map(d => d.file);
    expect(files).toContain('agent-neo');
  });

  test('agent-neo NOT returned for agentId: dev', () => {
    const parser = new ManifestParser(synapseDir);
    const registry = parser.parse();
    const domains = parser.getActiveDomains(registry, { agentId: 'dev' });
    const files = domains.map(d => d.file);
    expect(files).not.toContain('agent-neo');
  });
});

// ─── ISOLATION VERIFICATION (AC-7) ────────────────────────────────────────

describe('Story 16.5 — Test Isolation Verification (AC-7)', () => {
  test('no new files added to real project session dir during test run', () => {
    if (!fs.existsSync(REAL_SESSION_DIR)) {
      return; // no dir = no pollution
    }
    const currentFiles = new Set(fs.readdirSync(REAL_SESSION_DIR));
    const newFiles = [...currentFiles].filter(f => !preTestRealFiles.has(f));
    expect(newFiles).toHaveLength(0);
  });
});
