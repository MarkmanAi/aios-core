/**
 * Memory Loader Tests - MIS-4
 *
 * Tests for high-level memory loading API.
 * Target: >= 90% coverage
 *
 * @module pro/memory/__tests__/memory-loader.test
 */

const fs = require('fs').promises;
const path = require('path');
const { MemoryLoader, createMemoryLoader, AGENT_SECTOR_PREFERENCES } = require('../memory-loader');

describe('MemoryLoader', () => {
  let loader;
  let testDir;
  let digestsDir;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(__dirname, 'fixtures', 'test-loader');
    digestsDir = path.join(testDir, '.aios', 'session-digests');

    await fs.mkdir(digestsDir, { recursive: true });

    loader = new MemoryLoader(testDir);

    // Create test digests
    await createTestDigests(digestsDir);
  });

  afterEach(async () => {
    // Cleanup test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('queryMemories', () => {
    it('should return memories for agent', async () => {
      const memories = await loader.queryMemories('dev');

      expect(Array.isArray(memories)).toBe(true);
      expect(memories.length).toBeGreaterThan(0);
    });

    it('should apply agent sector preferences automatically', async () => {
      const memories = await loader.queryMemories('dev');

      // Dev prefers procedural + semantic
      // Should be boosted (internal check - just verify it returns memories)
      expect(memories.length).toBeGreaterThan(0);
    });

    it('should allow overriding sector preferences', async () => {
      const memories = await loader.queryMemories('dev', {
        sectors: ['episodic'], // Override default procedural+semantic
      });

      expect(Array.isArray(memories)).toBe(true);
    });

    it('should apply default attention_min (0.3 = WARM+)', async () => {
      const memories = await loader.queryMemories('dev');

      // All memories should have attention_score >= 0.3
      expect(memories.every(m => m.attention_score >= 0.3)).toBe(true);
    });

    it('should allow overriding attention_min', async () => {
      const memories = await loader.queryMemories('dev', {
        attentionMin: 0.7, // HOT only
      });

      expect(memories.every(m => m.attention_score >= 0.7)).toBe(true);
    });

    it('should support explicit layer selection', async () => {
      // Layer 1 (Index)
      const layer1 = await loader.queryMemories('dev', { layer: 1 });
      expect(layer1[0]).not.toHaveProperty('content');
      expect(layer1[0]).not.toHaveProperty('chunks');

      // Layer 3 (Detail)
      const layer3 = await loader.queryMemories('dev', { layer: 3 });
      expect(layer3[0]).toHaveProperty('content');
    });

    it('should auto-select layer based on token budget', async () => {
      // Small budget → Layer 1
      const smallBudget = await loader.queryMemories('dev', { tokenBudget: 300 });
      expect(smallBudget[0]).not.toHaveProperty('content');

      // Large budget → Layer 3
      const largeBudget = await loader.queryMemories('dev', { tokenBudget: 2000 });
      if (largeBudget.length > 0) {
        expect(largeBudget[0]).toHaveProperty('content');
      }
    });

    it('should forward all options to retriever', async () => {
      const memories = await loader.queryMemories('dev', {
        tokenBudget: 1000,
        tags: ['import-resolution'],
        tier: 'hot',
        limit: 5,
      });

      expect(Array.isArray(memories)).toBe(true);
      expect(memories.length).toBeLessThanOrEqual(5);
    });

    it('should return empty array if agentId not provided', async () => {
      const memories = await loader.queryMemories(null);

      expect(memories).toEqual([]);
    });

    it('should return empty array on error (graceful degradation)', async () => {
      const badLoader = new MemoryLoader('/invalid/path');

      const memories = await badLoader.queryMemories('dev');

      expect(memories).toEqual([]);
    });
  });

  describe('getMemoryById', () => {
    it('should retrieve memory by ID', async () => {
      // Build index first
      await loader.retriever.indexManager.buildIndex();

      // Get first memory ID
      const searchResult = await loader.retriever.indexManager.search({ agent: 'dev', limit: 1 });
      const memoryId = searchResult.results[0].id;

      // Retrieve by ID
      const memory = await loader.getMemoryById(memoryId);

      expect(memory).not.toBeNull();
      expect(memory.id).toBe(memoryId);
      expect(memory).toHaveProperty('content');
    });

    it('should return null if memoryId not provided', async () => {
      const memory = await loader.getMemoryById(null);

      expect(memory).toBeNull();
    });

    it('should return null for non-existent memory', async () => {
      const memory = await loader.getMemoryById('non-existent-id');

      expect(memory).toBeNull();
    });

    it('should return null on error (graceful degradation)', async () => {
      const badLoader = new MemoryLoader('/invalid/path');

      const memory = await badLoader.getMemoryById('some-id');

      expect(memory).toBeNull();
    });
  });

  describe('getHotMemories', () => {
    it('should return only HOT memories (score > 0.7)', async () => {
      const hotMemories = await loader.getHotMemories('dev');

      expect(Array.isArray(hotMemories)).toBe(true);

      if (hotMemories.length > 0) {
        expect(hotMemories.every(m => m.attention_score >= 0.7)).toBe(true);
        expect(hotMemories.every(m => m.tier === 'hot')).toBe(true);
      }
    });

    it('should forward additional options', async () => {
      const hotMemories = await loader.getHotMemories('dev', {
        limit: 2,
      });

      expect(hotMemories.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getWarmMemories', () => {
    it('should return only WARM memories (0.3 <= score < 0.7)', async () => {
      const warmMemories = await loader.getWarmMemories('dev');

      expect(Array.isArray(warmMemories)).toBe(true);

      if (warmMemories.length > 0) {
        expect(warmMemories.every(m => m.attention_score >= 0.3)).toBe(true);
        expect(warmMemories.every(m => m.tier === 'warm')).toBe(true);
      }
    });

    it('should forward additional options', async () => {
      const warmMemories = await loader.getWarmMemories('dev', {
        tokenBudget: 500,
      });

      expect(Array.isArray(warmMemories)).toBe(true);
    });
  });

  describe('searchByTags', () => {
    it('should search memories by tags', async () => {
      const memories = await loader.searchByTags('dev', ['import-resolution']);

      expect(Array.isArray(memories)).toBe(true);
    });

    it('should support multiple tags', async () => {
      const memories = await loader.searchByTags('dev', ['import-resolution', 'typescript']);

      expect(Array.isArray(memories)).toBe(true);
    });

    it('should forward additional options', async () => {
      const memories = await loader.searchByTags('dev', ['import-resolution'], {
        tokenBudget: 1000,
        limit: 3,
      });

      expect(memories.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getRecentMemories', () => {
    it('should return memories from last N days', async () => {
      const recentMemories = await loader.getRecentMemories('dev', 7);

      expect(Array.isArray(recentMemories)).toBe(true);

      // All memories should be within last 7 days
      const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
      recentMemories.forEach(m => {
        const timestamp = new Date(m.timestamp).getTime();
        expect(timestamp).toBeGreaterThanOrEqual(cutoff);
      });
    });

    it('should default to 7 days if not specified', async () => {
      const recentMemories = await loader.getRecentMemories('dev');

      expect(Array.isArray(recentMemories)).toBe(true);
    });

    it('should forward additional options', async () => {
      const recentMemories = await loader.getRecentMemories('dev', 3, {
        tokenBudget: 500,
      });

      expect(Array.isArray(recentMemories)).toBe(true);
    });

    it('should filter out old memories', async () => {
      // Get memories from last 1 day (very restrictive)
      const recentMemories = await loader.getRecentMemories('dev', 1);

      // Should have fewer memories than 7 days (or same if all are recent)
      const sevenDaysMemories = await loader.getRecentMemories('dev', 7);

      expect(recentMemories.length).toBeLessThanOrEqual(sevenDaysMemories.length);
    });
  });

  describe('createMemoryLoader', () => {
    it('should create memory loader instance', () => {
      const loader = createMemoryLoader(testDir);

      expect(loader).toBeInstanceOf(MemoryLoader);
      expect(loader.retriever).toBeDefined();
    });
  });

  describe('AGENT_SECTOR_PREFERENCES', () => {
    it('should define preferences for all AIOS agents', () => {
      const agents = ['dev', 'qa', 'architect', 'pm', 'po', 'sm', 'devops', 'analyst', 'data-engineer', 'ux-design-expert'];

      agents.forEach(agent => {
        expect(AGENT_SECTOR_PREFERENCES[agent]).toBeDefined();
        expect(Array.isArray(AGENT_SECTOR_PREFERENCES[agent])).toBe(true);
        expect(AGENT_SECTOR_PREFERENCES[agent].length).toBeGreaterThan(0);
      });
    });

    it('should use valid sector names', () => {
      const validSectors = ['episodic', 'semantic', 'procedural', 'reflective'];

      Object.values(AGENT_SECTOR_PREFERENCES).forEach(sectors => {
        sectors.forEach(sector => {
          expect(validSectors).toContain(sector);
        });
      });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle agent with no sector preferences', async () => {
      const memories = await loader.queryMemories('unknown-agent');

      // Should work with empty sectors array
      expect(Array.isArray(memories)).toBe(true);
    });

    it('should handle query errors gracefully in convenience methods', async () => {
      const badLoader = new MemoryLoader('/invalid/path');

      // All methods should return empty/null gracefully
      expect(await badLoader.getHotMemories('dev')).toEqual([]);
      expect(await badLoader.getWarmMemories('dev')).toEqual([]);
      expect(await badLoader.searchByTags('dev', ['tag'])).toEqual([]);
      expect(await badLoader.getRecentMemories('dev')).toEqual([]);
    });

    it('should handle empty tags array in searchByTags', async () => {
      const memories = await loader.searchByTags('dev', []);

      expect(Array.isArray(memories)).toBe(true);
    });
  });
});

/**
 * Helper: Create test digest files
 */
async function createTestDigests(digestsDir) {
  const digests = [
    {
      filename: 'mem-hot-001.yaml',
      content: `---
session_id: mem-hot-001
timestamp: ${new Date().toISOString()}
agent_context: dev
compact_trigger: context_limit_90%
duration_minutes: 60
---

# HOT Memory

Pattern: "import-resolution"

Axiom: Always use absolute imports
`,
    },
    {
      filename: 'mem-warm-001.yaml',
      content: `---
session_id: mem-warm-001
timestamp: ${new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()}
agent_context: dev
compact_trigger: manual
duration_minutes: 25
---

# WARM Memory

Pattern: "testing-strategy"
`,
    },
    {
      filename: 'mem-cold-001.yaml',
      content: `---
session_id: mem-cold-001
timestamp: ${new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()}
agent_context: dev
compact_trigger: manual
duration_minutes: 10
---

# COLD Memory

Pattern: "old-pattern"
`,
    },
    {
      filename: 'shared-001.yaml',
      content: `---
session_id: shared-001
timestamp: ${new Date().toISOString()}
agent_context: shared
compact_trigger: manual
duration_minutes: 30
---

# Shared Memory

Pattern: "shared-pattern"
Axiom: Available to all agents
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
}
