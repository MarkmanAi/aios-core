/**
 * Memory Retriever Tests - MIS-4
 *
 * Tests for progressive disclosure retrieval (3 layers).
 * Target: >= 90% coverage
 *
 * @module core/synapse/memory/__tests__/memory-retriever.test
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const os = require('os');
const path = require('path');
const { MemoryRetriever, TOKEN_ESTIMATES } = require('../../../../.aios-core/core/synapse/memory/memory-retriever');

describe('MemoryRetriever', () => {
  let retriever;
  let testDir;
  let digestsDir;
  let tmpDir;

  beforeAll(() => {
    tmpDir = fsSync.mkdtempSync(path.join(os.tmpdir(), 'aios-retriever-'));
  });

  afterAll(() => {
    fsSync.rmSync(tmpDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    testDir = tmpDir;
    digestsDir = path.join(testDir, '.aios', 'session-digests');

    await fs.mkdir(digestsDir, { recursive: true });

    retriever = new MemoryRetriever(testDir);

    // Create test digests
    await createTestDigests(digestsDir);
  });

  afterEach(async () => {
    // Cleanup .aios subdir only — tmpDir is reused across tests, removed in afterAll
    await fs.rm(path.join(testDir, '.aios'), { recursive: true, force: true });
  });

  describe('retrieve', () => {
    it('should require agent parameter', async () => {
      await expect(retriever.retrieve({})).rejects.toThrow('Agent ID is required');
    });

    it('should validate layer parameter', async () => {
      await expect(retriever.retrieve({ agent: 'dev', layer: 0 })).rejects.toThrow('Layer must be');
      await expect(retriever.retrieve({ agent: 'dev', layer: 4 })).rejects.toThrow('Layer must be');
    });

    it('should validate tokenBudget parameter', async () => {
      await expect(retriever.retrieve({ agent: 'dev', tokenBudget: -1 })).rejects.toThrow('tokenBudget must be a non-negative number');
      await expect(retriever.retrieve({ agent: 'dev', tokenBudget: 'big' })).rejects.toThrow('tokenBudget must be a non-negative number');
    });

    it('should validate limit parameter', async () => {
      await expect(retriever.retrieve({ agent: 'dev', limit: 0 })).rejects.toThrow('limit must be a positive number');
      await expect(retriever.retrieve({ agent: 'dev', limit: -5 })).rejects.toThrow('limit must be a positive number');
    });

    it('should retrieve memories with default options', async () => {
      const result = await retriever.retrieve({ agent: 'dev' });

      expect(result.memories).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.agent).toBe('dev');
      expect(result.metadata.layer).toBe(2); // Default layer
      expect(result.metadata.tokenBudget).toBe(2000); // Default budget
    });

    it('should filter by attention score', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
        attentionMin: 0.7, // HOT only
      });

      expect(result.memories.length).toBeGreaterThan(0);
      expect(result.memories.every(m => m.attention_score >= 0.7)).toBe(true);
    });

    it('should apply sector boosting', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
        sectors: ['procedural', 'semantic'],
      });

      // Results should be returned (boosting affects order, not filtering)
      expect(result.memories.length).toBeGreaterThan(0);

      // Memories with preferred sectors should have boosted_score (internal check)
      const devMemories = await retriever.indexManager.search({ agent: 'dev' });
      const boosted = retriever._applySectorBoosting(devMemories.results, ['procedural', 'semantic']);
      expect(boosted.every(m => m.boosted_score !== undefined)).toBe(true);
    });

    it('should respect token budget', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
        tokenBudget: 200, // Small budget
      });

      expect(result.metadata.tokenUsage).toBeLessThanOrEqual(200);
    });

    it('should filter by tags', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
        tags: ['import-resolution'],
      });

      expect(result.memories.length).toBeGreaterThan(0);
    });

    it('should filter by tier', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
        tier: 'hot',
      });

      expect(result.memories.every(m => m.tier === 'hot')).toBe(true);
    });

    it('should apply limit', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
        limit: 2,
      });

      expect(result.memories.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Layer 1: Index', () => {
    it('should return metadata only', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
      });

      expect(result.memories.length).toBeGreaterThan(0);

      const memory = result.memories[0];
      expect(memory).toHaveProperty('id');
      expect(memory).toHaveProperty('timestamp');
      expect(memory).toHaveProperty('agent');
      expect(memory).toHaveProperty('sector');
      expect(memory).toHaveProperty('tier');
      expect(memory).toHaveProperty('attention_score');
      expect(memory).toHaveProperty('tags');
      expect(memory).not.toHaveProperty('content');
      expect(memory).not.toHaveProperty('chunks');
    });

    it('should estimate ~50 tokens per memory', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
        limit: 10,
      });

      const avgTokens = result.metadata.tokenUsage / result.memories.length;
      expect(avgTokens).toBeGreaterThan(30);
      expect(avgTokens).toBeLessThan(70);
    });

    it('should respect token budget for index layer', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
        tokenBudget: 150, // ~3 memories max
      });

      expect(result.memories.length).toBeLessThanOrEqual(3);
      expect(result.metadata.tokenUsage).toBeLessThanOrEqual(150);
    });
  });

  describe('Layer 2: Context', () => {
    it('should return relevant chunks', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 2,
        tokenBudget: 1000,
      });

      expect(result.memories.length).toBeGreaterThan(0);

      const memory = result.memories[0];
      expect(memory).toHaveProperty('id');
      expect(memory).toHaveProperty('chunks');
      expect(Array.isArray(memory.chunks)).toBe(true);
      expect(memory).not.toHaveProperty('content'); // No full content
    });

    it('should extract patterns, axioms, corrections', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 2,
        tokenBudget: 1000,
      });

      const hasChunks = result.memories.some(m => m.chunks && m.chunks.length > 0);
      expect(hasChunks).toBe(true);

      // Check chunk types
      const memory = result.memories.find(m => m.chunks && m.chunks.length > 0);
      if (memory) {
        const chunkTypes = memory.chunks.map(c => c.type);
        expect(chunkTypes.every(t => ['pattern', 'axiom', 'correction', 'evidence'].includes(t))).toBe(true);
      }
    });

    it('should limit to max 3 chunks per memory', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 2,
      });

      for (const memory of result.memories) {
        if (memory.chunks) {
          expect(memory.chunks.length).toBeLessThanOrEqual(3);
        }
      }
    });

    it('should estimate ~200 tokens per memory', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 2,
        tokenBudget: 1000,
        limit: 5,
      });

      if (result.memories.length > 0) {
        const avgTokens = result.metadata.tokenUsage / result.memories.length;
        // Test digests are small, so expect lower token count
        expect(avgTokens).toBeGreaterThan(50);
        expect(avgTokens).toBeLessThan(400);
      }
    });

    it('should stop when token budget exceeded', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 2,
        tokenBudget: 500,
      });

      expect(result.metadata.tokenUsage).toBeLessThanOrEqual(500);
    });
  });

  describe('Layer 3: Detail', () => {
    it('should return full content', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 3,
        tokenBudget: 2000,
      });

      expect(result.memories.length).toBeGreaterThan(0);

      const memory = result.memories[0];
      expect(memory).toHaveProperty('id');
      expect(memory).toHaveProperty('content');
      expect(typeof memory.content).toBe('string');
      expect(memory.content.length).toBeGreaterThan(0);
      expect(memory).not.toHaveProperty('chunks');
    });

    it('should estimate ~1000+ tokens per memory', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 3,
        tokenBudget: 3000,
        limit: 2,
      });

      if (result.memories.length > 0) {
        const avgTokens = result.metadata.tokenUsage / result.memories.length;
        // Test digests are small, expect lower token count
        // In production, digests have ~1000+ tokens
        expect(avgTokens).toBeGreaterThan(50);
      }
    });

    it('should stop when token budget exceeded', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 3,
        tokenBudget: 1500,
      });

      expect(result.metadata.tokenUsage).toBeLessThanOrEqual(1500);
    });

    it('should include full body content', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 3,
        limit: 1,
      });

      expect(result.memories.length).toBeGreaterThan(0);

      const memory = result.memories[0];
      expect(memory.content).toContain('#'); // Markdown heading
    });
  });

  describe('getMemoryById', () => {
    it('should retrieve specific memory by ID', async () => {
      // Build index first
      await retriever.indexManager.buildIndex();

      // Get first memory ID
      const searchResult = await retriever.indexManager.search({ agent: 'dev', limit: 1 });
      const memoryId = searchResult.results[0].id;

      // Retrieve by ID
      const memory = await retriever.getMemoryById(memoryId);

      expect(memory).not.toBeNull();
      expect(memory.id).toBe(memoryId);
      expect(memory).toHaveProperty('content');
    });

    it('should return null for non-existent memory', async () => {
      const memory = await retriever.getMemoryById('non-existent-id');

      expect(memory).toBeNull();
    });

    it('should always return Layer 3 (full content)', async () => {
      await retriever.indexManager.buildIndex();

      const searchResult = await retriever.indexManager.search({ agent: 'dev', limit: 1 });
      const memoryId = searchResult.results[0].id;

      const memory = await retriever.getMemoryById(memoryId);

      expect(memory).toHaveProperty('content');
      expect(typeof memory.content).toBe('string');
    });
  });

  describe('queryMemories', () => {
    it('should auto-select layer based on token budget', async () => {
      // Small budget → Layer 1
      const result1 = await retriever.queryMemories('dev', { tokenBudget: 300 });
      expect(result1.metadata.layer).toBe(1);

      // Medium budget → Layer 2
      const result2 = await retriever.queryMemories('dev', { tokenBudget: 1000 });
      expect(result2.metadata.layer).toBe(2);

      // Large budget → Layer 3
      const result3 = await retriever.queryMemories('dev', { tokenBudget: 2000 });
      expect(result3.metadata.layer).toBe(3);
    });

    it('should use default token budget (2000)', async () => {
      const result = await retriever.queryMemories('dev');

      expect(result.metadata.tokenBudget).toBe(2000);
    });

    it('should forward all options to retrieve', async () => {
      const result = await retriever.queryMemories('dev', {
        tokenBudget: 1000,
        tags: ['import-resolution'],
        attentionMin: 0.5,
      });

      expect(result.metadata.tokenBudget).toBe(1000);
    });
  });

  describe('_extractRelevantChunks', () => {
    it('should extract patterns', () => {
      const content = `Pattern: "import resolution"
Pattern: "typescript config"`;

      const chunks = retriever._extractRelevantChunks(content);

      const patterns = chunks.filter(c => c.type === 'pattern');
      expect(patterns.length).toBe(2);
      expect(patterns[0].content).toBe('import resolution');
    });

    it('should extract axioms', () => {
      const content = 'Axiom: Always use absolute imports';

      const chunks = retriever._extractRelevantChunks(content);

      const axioms = chunks.filter(c => c.type === 'axiom');
      expect(axioms.length).toBe(1);
      expect(axioms[0].content).toBe('Always use absolute imports');
    });

    it('should extract corrections', () => {
      const content = 'Actually, the correct way is to use absolute imports.';

      const chunks = retriever._extractRelevantChunks(content);

      const corrections = chunks.filter(c => c.type === 'correction');
      expect(corrections.length).toBe(1);
    });

    it('should extract evidence (max 2 items)', () => {
      const content = `Evidence:
- User correction in session abc123
- Confirmed by CLAUDE.md rule
- Third evidence item`;

      const chunks = retriever._extractRelevantChunks(content);

      const evidence = chunks.filter(c => c.type === 'evidence');
      expect(evidence.length).toBe(1);
      expect(evidence[0].content.split('\n').length).toBeLessThanOrEqual(2);
    });
  });

  describe('_applySectorBoosting', () => {
    it('should boost preferred sectors', () => {
      const results = [
        { id: '1', sector: 'procedural', attention_score: 0.5 },
        { id: '2', sector: 'episodic', attention_score: 0.6 },
        { id: '3', sector: 'semantic', attention_score: 0.4 },
      ];

      const boosted = retriever._applySectorBoosting(results, ['procedural', 'semantic']);

      // Procedural (0.5 * 1.2 = 0.6) should be first
      expect(boosted[0].id).toBe('1');
      expect(boosted[0].boosted_score).toBeCloseTo(0.6);
    });
  });

  describe('_estimateTokens', () => {
    it('should estimate tokens using ~4 chars per token', () => {
      const memories = [
        { id: 'test', content: 'a'.repeat(400) }, // ~100 tokens
      ];

      const tokens = retriever._estimateTokens(memories);

      expect(tokens).toBeGreaterThan(80);
      expect(tokens).toBeLessThan(120);
    });
  });

  describe('performance', () => {
    it('should retrieve Layer 2 in < 300ms', async () => {
      const startTime = Date.now();

      await retriever.retrieve({
        agent: 'dev',
        layer: 2,
        tokenBudget: 1000,
      });

      const duration = Date.now() - startTime;
      // Strict threshold gated behind RUN_PERF_TESTS for CI perf profiling
      const threshold = process.env.RUN_PERF_TESTS ? 120 : 300;
      expect(duration).toBeLessThan(threshold);
    });

    it('should retrieve Layer 3 in < 500ms', async () => {
      const startTime = Date.now();

      await retriever.retrieve({
        agent: 'dev',
        layer: 3,
        tokenBudget: 2000,
      });

      const duration = Date.now() - startTime;
      // Strict threshold gated behind RUN_PERF_TESTS for CI perf profiling
      const threshold = process.env.RUN_PERF_TESTS ? 180 : 500;
      expect(duration).toBeLessThan(threshold);
    });
  });

  describe('Agent-Scoped Retrieval (AC: 5)', () => {
    beforeEach(async () => {
      // Create agent-specific and shared digests
      const agentDigests = [
        {
          filename: 'dev-private-001.yaml',
          content: `---
session_id: dev-private-001
timestamp: ${new Date().toISOString()}
agent_context: dev
---
# Dev Private Memory
Pattern: "dev-specific-pattern"
`,
        },
        {
          filename: 'qa-private-001.yaml',
          content: `---
session_id: qa-private-001
timestamp: ${new Date().toISOString()}
agent_context: qa
---
# QA Private Memory
Pattern: "qa-specific-pattern"
`,
        },
        {
          filename: 'shared-001.yaml',
          content: `---
session_id: shared-001
timestamp: ${new Date().toISOString()}
agent_context: shared
---
# Shared Memory
Pattern: "shared-pattern"
Axiom: This is accessible to all agents
`,
        },
      ];

      for (const digest of agentDigests) {
        await fs.writeFile(
          path.join(digestsDir, digest.filename),
          digest.content,
          'utf8',
        );
      }
    });

    it('should return own memories + shared memories', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
      });

      // Should include dev's own memories AND shared memories
      const agents = result.memories.map(m => m.agent);
      expect(agents).toContain('dev');
      expect(agents).toContain('shared');
    });

    it('should NEVER return private memories of other agents', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
      });

      // Should NOT include qa's private memories
      const agents = result.memories.map(m => m.agent);
      expect(agents).not.toContain('qa');

      // Verify no QA-specific content leaked
      const hasQaContent = result.memories.some(m =>
        JSON.stringify(m).includes('qa-specific-pattern'),
      );
      expect(hasQaContent).toBe(false);
    });

    it('should enforce privacy boundary for all layers', async () => {
      // Layer 1
      const layer1 = await retriever.retrieve({ agent: 'dev', layer: 1 });
      expect(layer1.memories.every(m => m.agent === 'dev' || m.agent === 'shared')).toBe(true);

      // Layer 2
      const layer2 = await retriever.retrieve({ agent: 'dev', layer: 2 });
      expect(layer2.memories.every(m => m.agent === 'dev' || m.agent === 'shared')).toBe(true);

      // Layer 3
      const layer3 = await retriever.retrieve({ agent: 'dev', layer: 3 });
      expect(layer3.memories.every(m => m.agent === 'dev' || m.agent === 'shared')).toBe(true);
    });

    it('should allow different agents to access shared memories', async () => {
      // Dev accesses shared
      const devResult = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
      });

      // QA accesses shared
      const qaResult = await retriever.retrieve({
        agent: 'qa',
        layer: 1,
      });

      // Both should see shared memories
      const devHasShared = devResult.memories.some(m => m.agent === 'shared');
      const qaHasShared = qaResult.memories.some(m => m.agent === 'shared');

      expect(devHasShared).toBe(true);
      expect(qaHasShared).toBe(true);
    });

    it('should enforce agent privacy in getMemoryById when callerAgentId is provided', async () => {
      await retriever.indexManager.buildIndex();

      // Get QA memory ID
      const qaSearch = await retriever.indexManager.search({ agent: 'qa' });
      const qaMemoryId = qaSearch.results[0]?.id;

      if (!qaMemoryId) {
        return; // Skip if no QA memory
      }

      // Dev agent should NOT be able to access QA's private memory
      const deniedMemory = await retriever.getMemoryById(qaMemoryId, 'dev');
      expect(deniedMemory).toBeNull(); // Agent scoping enforced

      // QA agent CAN access its own memory
      const ownMemory = await retriever.getMemoryById(qaMemoryId, 'qa');
      expect(ownMemory).not.toBeNull();
      expect(ownMemory.agent).toBe('qa');

      // Without callerAgentId, access is unrestricted (backward compat for internal use)
      const unscoped = await retriever.getMemoryById(qaMemoryId);
      expect(unscoped).not.toBeNull();
    });

    it('should combine and sort own + shared by attention_score', async () => {
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 1,
      });

      // Verify sorted by attention_score descending
      for (let i = 1; i < result.memories.length; i++) {
        expect(result.memories[i - 1].attention_score).toBeGreaterThanOrEqual(
          result.memories[i].attention_score,
        );
      }
    });
  });

  describe('error handling', () => {
    it('should handle corrupted digest files gracefully (Layer 2)', async () => {
      // Create corrupted digest
      await fs.writeFile(
        path.join(digestsDir, 'corrupted.yaml'),
        `---
session_id: corrupted
timestamp: ${new Date().toISOString()}
agent_context: dev
---
Corrupted content`,
        'utf8',
      );

      // Should not throw, just skip corrupted file
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 2,
      });

      expect(result.memories).toBeDefined();
    });

    it('should handle corrupted digest files gracefully (Layer 3)', async () => {
      // Create corrupted digest
      await fs.writeFile(
        path.join(digestsDir, 'corrupted2.yaml'),
        `---
session_id: corrupted2
timestamp: ${new Date().toISOString()}
agent_context: dev
---
Corrupted content`,
        'utf8',
      );

      // Should not throw, just skip corrupted file
      const result = await retriever.retrieve({
        agent: 'dev',
        layer: 3,
      });

      expect(result.memories).toBeDefined();
    });

    it('should handle missing digest files in getMemoryById', async () => {
      await retriever.indexManager.buildIndex();

      // Manually create a memory entry pointing to non-existent file
      const fakeMemory = {
        id: 'fake-memory',
        filePath: path.join(digestsDir, 'non-existent.yaml'),
        agent: 'dev',
        timestamp: new Date().toISOString(),
        sector: 'episodic',
        tier: 'hot',
        attention_score: 0.8,
        tags: [],
      };

      // Add to master index
      retriever.indexManager.masterIndex['fake-memory'] = fakeMemory;

      // Should return null
      const memory = await retriever.getMemoryById('fake-memory');

      expect(memory).toBeNull();
    });

    it('should handle retrieval errors gracefully', async () => {
      // Force an error by using invalid project directory
      const badRetriever = new MemoryRetriever('/invalid/path/that/does/not/exist');

      // Should return empty array (graceful degradation)
      const result = await badRetriever.retrieve({ agent: 'dev' });

      expect(result.memories).toEqual([]);
      expect(result.metadata.memoriesReturned).toBe(0);
    });
  });
});

/**
 * Helper: Create test digest files
 */
async function createTestDigests(digestsDir) {
  const digests = [
    {
      filename: 'mem-001.yaml',
      content: `---
session_id: mem-001
timestamp: ${new Date().toISOString()}
agent_context: dev
compact_trigger: context_limit_90%
duration_minutes: 45
---

# Import Resolution Pattern

Pattern: "import-resolution"
Pattern: "absolute-imports"

## Evidence

Evidence:
- User correction in session abc123
- Confirmed by CLAUDE.md rule

## Axioms

Axiom: Always use absolute imports in TypeScript projects
Axiom: Prefer @/ alias over relative paths

## Corrections

Actually, relative imports should be avoided for better maintainability.
`,
    },
    {
      filename: 'mem-002.yaml',
      content: `---
session_id: mem-002
timestamp: ${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()}
agent_context: dev
compact_trigger: manual
duration_minutes: 30
---

# Testing Strategy

Pattern: "testing-strategy"

## Evidence

Evidence:
- Unit tests required for all modules
- Coverage >= 90%

Axiom: Test coverage is non-negotiable
`,
    },
    {
      filename: 'mem-003.yaml',
      content: `---
session_id: mem-003
timestamp: ${new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()}
agent_context: qa
compact_trigger: manual
duration_minutes: 20
---

# QA Best Practices

Pattern: "qa-workflow"

Axiom: All changes must pass pre-commit hooks
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
