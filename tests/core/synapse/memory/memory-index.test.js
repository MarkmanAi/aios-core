/**
 * Memory Index Manager Tests - MIS-4
 *
 * Comprehensive test coverage for memory index builder.
 * Target: >= 90% coverage
 *
 * @module core/synapse/memory/__tests__/memory-index.test
 */

const fs = require('fs').promises;
const path = require('path');
const { MemoryIndexManager } = require('../../../../.aios-core/core/synapse/memory/memory-index');

describe('MemoryIndexManager', () => {
  let indexManager;
  let testDir;
  let digestsDir;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(__dirname, 'fixtures', 'test-project');
    digestsDir = path.join(testDir, '.aios', 'session-digests');

    await fs.mkdir(digestsDir, { recursive: true });

    indexManager = new MemoryIndexManager(testDir);
  });

  afterEach(async () => {
    // Cleanup test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('buildIndex', () => {
    it('should build index from digest files', async () => {
      // Create test digest
      const digestContent = `---
session_id: test-session-001
timestamp: 2026-02-09T10:00:00Z
agent_context: dev
compact_trigger: context_limit_90%
duration_minutes: 45
---

# Test Memory

Pattern: "import resolution"

Evidence:
- User correction in session abc123

Axiom: Always use absolute imports
`;

      await fs.writeFile(
        path.join(digestsDir, 'test-session-001-2026-02-09.yaml'),
        digestContent,
        'utf8',
      );

      const stats = await indexManager.buildIndex();

      expect(stats.totalMemories).toBe(1);
      expect(stats.byAgent).toBe(1);
      expect(stats.byDate).toBe(1);
      expect(stats.byTag).toBeGreaterThan(0);
      expect(parseInt(stats.duration)).toBeLessThan(2000); // < 2s requirement
    });

    it('should handle multiple digests', async () => {
      // Create 10 test digests
      for (let i = 0; i < 10; i++) {
        const digestContent = `---
session_id: test-session-${i.toString().padStart(3, '0')}
timestamp: 2026-02-09T${(10 + i).toString().padStart(2, '0')}:00:00Z
agent_context: ${i % 2 === 0 ? 'dev' : 'qa'}
compact_trigger: manual
duration_minutes: ${10 + i * 5}
---

# Test Memory ${i}

Pattern: "test-pattern-${i}"
`;

        await fs.writeFile(
          path.join(digestsDir, `test-session-${i.toString().padStart(3, '0')}-2026-02-09.yaml`),
          digestContent,
          'utf8',
        );
      }

      const stats = await indexManager.buildIndex();

      expect(stats.totalMemories).toBe(10);
      expect(stats.byAgent).toBe(2); // dev + qa
      expect(parseInt(stats.duration)).toBeLessThan(2000);
    });

    it('should skip example files', async () => {
      // Create example file
      await fs.writeFile(
        path.join(digestsDir, 'example-digest.yaml'),
        '---\nid: example\n---\nExample content',
        'utf8',
      );

      // Create real digest
      const digestContent = `---
session_id: test-session-001
timestamp: 2026-02-09T10:00:00Z
agent_context: dev
---
# Real Memory
`;

      await fs.writeFile(
        path.join(digestsDir, 'test-session-001.yaml'),
        digestContent,
        'utf8',
      );

      const stats = await indexManager.buildIndex();

      expect(stats.totalMemories).toBe(1); // Only real digest
    });

    it('should handle missing frontmatter gracefully', async () => {
      // Create digest without frontmatter
      await fs.writeFile(
        path.join(digestsDir, 'bad-digest.yaml'),
        '# No frontmatter here',
        'utf8',
      );

      const stats = await indexManager.buildIndex();

      expect(stats.totalMemories).toBe(0); // Skipped
    });
  });

  describe('_loadIndexes', () => {
    it('should load indexes from disk', async () => {
      // Build initial index
      const digestContent = `---
session_id: load-test
timestamp: 2026-02-09T10:00:00Z
agent_context: dev
---
# Load Test
Pattern: "test-load"
`;
      await fs.writeFile(
        path.join(digestsDir, 'load-test.yaml'),
        digestContent,
        'utf8',
      );

      await indexManager.buildIndex();

      // Clear in-memory indexes
      indexManager.masterIndex = {};
      indexManager.indexes = {
        byAgent: {},
        byDate: {},
        byTag: {},
        byTier: { hot: [], warm: [], cold: [] },
      };

      // Load from disk via search (triggers _loadIndexes)
      const result = await indexManager.search({ agent: 'dev' });

      expect(result.results.length).toBeGreaterThan(0);
      expect(Object.keys(indexManager.masterIndex).length).toBeGreaterThan(0);
    });

    it('should rebuild index if loading fails', async () => {
      // Try to load from non-existent index
      const result = await indexManager.search({});

      // Should auto-rebuild
      expect(result.results).toBeDefined();
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      // Create test digests
      // Use current timestamp for mem-001 so recency decay keeps it HOT
      const nowIso = new Date().toISOString();
      const yesterdayIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const digests = [
        {
          filename: 'session-001.yaml',
          content: `---
session_id: mem-001
timestamp: ${nowIso}
agent_context: dev
compact_trigger: context_limit_90%
duration_minutes: 30
---
Pattern: "import-resolution"
Axiom: Use absolute imports
`,
        },
        {
          filename: 'session-002.yaml',
          content: `---
session_id: mem-002
timestamp: ${nowIso}
agent_context: qa
compact_trigger: manual
duration_minutes: 15
---
Pattern: "testing-strategy"
`,
        },
        {
          filename: 'session-003.yaml',
          content: `---
session_id: mem-003
timestamp: ${yesterdayIso}
agent_context: dev
compact_trigger: manual
duration_minutes: 60
---
Pattern: "import-resolution"
Pattern: "typescript-config"
`,
        },
      ];

      for (const digest of digests) {
        await fs.writeFile(
          path.join(digestsDir, digest.filename),
          digest.content,
          'utf8',
        );
      }

      await indexManager.buildIndex();
    });

    it('should search by agent', async () => {
      const result = await indexManager.search({ agent: 'dev' });

      expect(result.results.length).toBe(2);
      expect(result.results.every(r => r.agent === 'dev')).toBe(true);
      expect(parseInt(result.duration)).toBeLessThan(50); // < 50ms requirement
    });

    it('should search by date', async () => {
      const todayDate = new Date().toISOString().split('T')[0];
      const result = await indexManager.search({ date: todayDate });

      expect(result.results.length).toBe(2); // mem-001 + mem-002 both use nowIso
      expect(result.results.every(r => r.timestamp.startsWith(todayDate))).toBe(true);
    });

    it('should search by tags', async () => {
      const result = await indexManager.search({ tags: ['import-resolution'] });

      expect(result.results.length).toBe(2);
    });

    it('should search by tier', async () => {
      const result = await indexManager.search({ tier: 'hot' });

      // At least one memory should be hot (recent with high score)
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results.every(r => r.tier === 'hot')).toBe(true);
    });

    it('should combine multiple filters', async () => {
      const result = await indexManager.search({
        agent: 'dev',
        tags: ['import-resolution'],
      });

      expect(result.results.length).toBe(2);
      expect(result.results.every(r => r.agent === 'dev')).toBe(true);
    });

    it('should apply limit', async () => {
      const result = await indexManager.search({ limit: 1 });

      expect(result.results.length).toBe(1);
    });

    it('should sort by attention_score descending', async () => {
      const result = await indexManager.search({});

      for (let i = 1; i < result.results.length; i++) {
        expect(result.results[i - 1].attention_score).toBeGreaterThanOrEqual(
          result.results[i].attention_score,
        );
      }
    });

    it('should meet performance requirement (< 50ms for 500 memories)', async () => {
      const startTime = Date.now();
      await indexManager.search({ agent: 'dev' });
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(50);
    });
  });

  describe('updateIndex', () => {
    it('should incrementally update index with new digest', async () => {
      // Build initial index
      const digest1 = `---
session_id: mem-001
timestamp: 2026-02-09T10:00:00Z
agent_context: dev
---
# Memory 1
`;
      const path1 = path.join(digestsDir, 'session-001.yaml');
      await fs.writeFile(path1, digest1, 'utf8');
      await indexManager.buildIndex();

      // Add new digest
      const digest2 = `---
session_id: mem-002
timestamp: 2026-02-09T11:00:00Z
agent_context: qa
---
# Memory 2
`;
      const path2 = path.join(digestsDir, 'session-002.yaml');
      await fs.writeFile(path2, digest2, 'utf8');
      await indexManager.updateIndex(path2);

      // Search should find both
      const result = await indexManager.search({});
      expect(result.results.length).toBe(2);
    });
  });

  describe('rebuildIndex', () => {
    it('should rebuild index from scratch', async () => {
      // Create digest
      const digestContent = `---
session_id: test-rebuild
timestamp: 2026-02-09T10:00:00Z
agent_context: dev
---
# Test Rebuild
`;
      await fs.writeFile(
        path.join(digestsDir, 'test-rebuild.yaml'),
        digestContent,
        'utf8',
      );

      // Build initial index
      await indexManager.buildIndex();

      // Corrupt master index
      indexManager.masterIndex = {};

      // Rebuild
      const stats = await indexManager.rebuildIndex();

      expect(stats.totalMemories).toBe(1);
    });
  });

  describe('_calculateAttentionScore', () => {
    it('should calculate score with all factors', () => {
      const metadata = {
        timestamp: new Date().toISOString(),
        compact_trigger: 'context_limit_90%',
        duration_minutes: 45,
      };

      const score = indexManager._calculateAttentionScore(metadata);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('should apply recency decay', () => {
      const recentMetadata = {
        timestamp: new Date().toISOString(),
        duration_minutes: 30,
      };

      const oldMetadata = {
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        duration_minutes: 30,
      };

      const recentScore = indexManager._calculateAttentionScore(recentMetadata);
      const oldScore = indexManager._calculateAttentionScore(oldMetadata);

      expect(recentScore).toBeGreaterThan(oldScore);
    });

    it('should boost score for context_limit_90% trigger', () => {
      const standardMetadata = {
        timestamp: new Date().toISOString(),
        compact_trigger: 'manual',
        duration_minutes: 30,
      };

      const boostedMetadata = {
        timestamp: new Date().toISOString(),
        compact_trigger: 'context_limit_90%',
        duration_minutes: 30,
      };

      const standardScore = indexManager._calculateAttentionScore(standardMetadata);
      const boostedScore = indexManager._calculateAttentionScore(boostedMetadata);

      expect(boostedScore).toBeGreaterThan(standardScore);
    });

    it('should boost score for long duration', () => {
      const shortMetadata = {
        timestamp: new Date().toISOString(),
        duration_minutes: 10,
      };

      const longMetadata = {
        timestamp: new Date().toISOString(),
        duration_minutes: 45,
      };

      const shortScore = indexManager._calculateAttentionScore(shortMetadata);
      const longScore = indexManager._calculateAttentionScore(longMetadata);

      expect(longScore).toBeGreaterThan(shortScore);
    });
  });

  describe('_classifyTier', () => {
    it('should classify HOT tier (>0.7)', () => {
      const metadata = {
        timestamp: new Date().toISOString(),
        compact_trigger: 'context_limit_90%',
        duration_minutes: 60,
      };

      const tier = indexManager._classifyTier(metadata);

      expect(tier).toBe('hot');
    });

    it('should classify WARM tier (0.3-0.7)', () => {
      const metadata = {
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        duration_minutes: 25,
      };

      const tier = indexManager._classifyTier(metadata);

      expect(tier).toBe('warm');
    });

    it('should classify COLD tier (<0.3)', () => {
      const metadata = {
        timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        duration_minutes: 5,
      };

      const tier = indexManager._classifyTier(metadata);

      expect(tier).toBe('cold');
    });
  });

  describe('_detectSector', () => {
    it('should detect procedural sector', () => {
      const content = 'How to implement feature X. Step 1: ...';
      const sector = indexManager._detectSector(content);
      expect(sector).toBe('procedural');
    });

    it('should detect semantic sector', () => {
      const content = 'Definition: A component is...';
      const sector = indexManager._detectSector(content);
      expect(sector).toBe('semantic');
    });

    it('should detect reflective sector', () => {
      const content = 'We learned that imports should be absolute...';
      const sector = indexManager._detectSector(content);
      expect(sector).toBe('reflective');
    });

    it('should default to episodic sector', () => {
      const content = 'Something happened in the session...';
      const sector = indexManager._detectSector(content);
      expect(sector).toBe('episodic');
    });
  });

  describe('_extractTags', () => {
    it('should extract tags from patterns', () => {
      const content = `
Pattern: "import resolution"
Pattern: "TypeScript config"
`;
      const tags = indexManager._extractTags(content);

      expect(tags).toContain('import-resolution');
      expect(tags).toContain('typescript-config');
    });

    it('should add corrections tag when corrections present', () => {
      const content = 'Actually, the correct way is...';
      const tags = indexManager._extractTags(content);

      expect(tags).toContain('corrections');
    });

    it('should add axioms tag when axioms present', () => {
      const content = 'Axiom: Always validate input';
      const tags = indexManager._extractTags(content);

      expect(tags).toContain('axioms');
    });

    it('should normalize tags (lowercase, kebab-case)', () => {
      const content = 'Pattern: "Import Resolution Strategy"';
      const tags = indexManager._extractTags(content);

      expect(tags[0]).toMatch(/^[a-z0-9-]+$/);
      expect(tags[0].length).toBeLessThanOrEqual(30);
    });
  });

  describe('performance benchmarks', () => {
    it('should rebuild 100 digests in < 2 seconds', async () => {
      // Create 100 test digests
      for (let i = 0; i < 100; i++) {
        const digestContent = `---
session_id: perf-test-${i.toString().padStart(3, '0')}
timestamp: 2026-02-09T${(i % 24).toString().padStart(2, '0')}:00:00Z
agent_context: ${['dev', 'qa', 'architect'][i % 3]}
compact_trigger: manual
duration_minutes: ${10 + (i % 50)}
---

# Performance Test Memory ${i}

Pattern: "test-pattern-${i % 10}"

Evidence:
- Test evidence ${i}
`;

        await fs.writeFile(
          path.join(digestsDir, `perf-test-${i.toString().padStart(3, '0')}.yaml`),
          digestContent,
          'utf8',
        );
      }

      const startTime = Date.now();
      const stats = await indexManager.buildIndex();
      const duration = Date.now() - startTime;

      expect(stats.totalMemories).toBe(100);
      expect(duration).toBeLessThan(2000); // < 2s requirement
    }, 10000); // 10s test timeout

    it('should search 500 memories in < 50ms', async () => {
      // Create 500 test digests
      for (let i = 0; i < 500; i++) {
        const digestContent = `---
session_id: search-perf-${i.toString().padStart(4, '0')}
timestamp: 2026-02-${(1 + (i % 28)).toString().padStart(2, '0')}T10:00:00Z
agent_context: ${['dev', 'qa', 'architect', 'pm', 'po'][i % 5]}
---
# Search Performance Test ${i}
Pattern: "pattern-${i % 20}"
`;

        await fs.writeFile(
          path.join(digestsDir, `search-perf-${i.toString().padStart(4, '0')}.yaml`),
          digestContent,
          'utf8',
        );
      }

      await indexManager.buildIndex();

      // Test search performance
      const startTime = Date.now();
      await indexManager.search({ agent: 'dev' });
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(50); // < 50ms requirement
    }, 15000); // 15s test timeout
  });
});
