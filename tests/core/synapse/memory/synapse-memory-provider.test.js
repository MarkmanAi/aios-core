/**
 * SynapseMemoryProvider Tests
 *
 * Tests for the Pro-gated MIS retrieval bridge consumed by the SYNAPSE engine.
 * Covers: BRACKET_CONFIG mapping, session caching, clearCache(), feature gate,
 * unknown bracket fallback, and token budget enforcement.
 *
 * @module core/synapse/memory/synapse-memory-provider.test
 */

'use strict';

const {
  SynapseMemoryProvider,
  BRACKET_CONFIG,
  DEFAULT_SECTORS,
} = require('../../../../.aios-core/core/synapse/memory/synapse-memory-provider');

// ─── MOCK SETUP ──────────────────────────────────────────────────────────────

/**
 * Build a mock MemoryLoader whose queryMemories returns a controllable result.
 */
function makeLoader(resolvedValue = []) {
  return {
    queryMemories: jest.fn().mockResolvedValue(resolvedValue),
  };
}

/**
 * Build a SynapseMemoryProvider that injects a mock loader instead of
 * instantiating a real MemoryLoader (constructor calls new MemoryLoader(dir)).
 *
 * We monkey-patch _loader after construction.
 */
function makeProvider(loader) {
  const provider = new SynapseMemoryProvider({ projectDir: '/tmp/test-synapse' });
  provider._loader = loader;
  return provider;
}

// ─── BRACKET_CONFIG ───────────────────────────────────────────────────────────

describe('BRACKET_CONFIG', () => {
  it('exports BRACKET_CONFIG with three brackets', () => {
    expect(BRACKET_CONFIG).toHaveProperty('MODERATE');
    expect(BRACKET_CONFIG).toHaveProperty('DEPLETED');
    expect(BRACKET_CONFIG).toHaveProperty('CRITICAL');
  });

  it('MODERATE maps to layer 1, limit 3, minRelevance 0.7', () => {
    expect(BRACKET_CONFIG.MODERATE).toEqual({ layer: 1, limit: 3, minRelevance: 0.7 });
  });

  it('DEPLETED maps to layer 2, limit 5, minRelevance 0.5', () => {
    expect(BRACKET_CONFIG.DEPLETED).toEqual({ layer: 2, limit: 5, minRelevance: 0.5 });
  });

  it('CRITICAL maps to layer 3, limit 10, minRelevance 0.3', () => {
    expect(BRACKET_CONFIG.CRITICAL).toEqual({ layer: 3, limit: 10, minRelevance: 0.3 });
  });
});

// ─── DEFAULT_SECTORS ─────────────────────────────────────────────────────────

describe('DEFAULT_SECTORS', () => {
  it('exports DEFAULT_SECTORS as an array', () => {
    expect(Array.isArray(DEFAULT_SECTORS)).toBe(true);
  });

  it('DEFAULT_SECTORS contains semantic', () => {
    expect(DEFAULT_SECTORS).toContain('semantic');
  });
});

// ─── CONSTRUCTOR ─────────────────────────────────────────────────────────────

describe('SynapseMemoryProvider constructor', () => {
  it('instantiates without error', () => {
    expect(() => new SynapseMemoryProvider({ projectDir: '/tmp/test-synapse' })).not.toThrow();
  });

  it('exposes clearCache method', () => {
    const provider = new SynapseMemoryProvider({ projectDir: '/tmp/test-synapse' });
    expect(typeof provider.clearCache).toBe('function');
  });

  it('exposes getMemories method', () => {
    const provider = new SynapseMemoryProvider({ projectDir: '/tmp/test-synapse' });
    expect(typeof provider.getMemories).toBe('function');
  });
});

// ─── FEATURE GATE ────────────────────────────────────────────────────────────

describe('Feature gate', () => {
  it('does not throw when feature gate is satisfied (stub always passes)', () => {
    expect(() => new SynapseMemoryProvider({ projectDir: '/tmp/test-synapse' })).not.toThrow();
  });
});

// ─── getMemories — BRACKET ROUTING ───────────────────────────────────────────

describe('SynapseMemoryProvider.getMemories — bracket routing', () => {
  it('MODERATE: calls loader with layer 1, limit 3, minRelevance 0.7', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    await provider.getMemories('dev', 'MODERATE', 500);

    expect(loader.queryMemories).toHaveBeenCalledTimes(1);
    const [agentId, opts] = loader.queryMemories.mock.calls[0];
    expect(agentId).toBe('dev');
    expect(opts.layer).toBe(1);
    expect(opts.limit).toBe(3);
    expect(opts.minRelevance).toBe(0.7);
  });

  it('DEPLETED: calls loader with layer 2, limit 5, minRelevance 0.5', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    await provider.getMemories('dev', 'DEPLETED', 1000);

    expect(loader.queryMemories).toHaveBeenCalledTimes(1);
    const [agentId, opts] = loader.queryMemories.mock.calls[0];
    expect(agentId).toBe('dev');
    expect(opts.layer).toBe(2);
    expect(opts.limit).toBe(5);
    expect(opts.minRelevance).toBe(0.5);
  });

  it('CRITICAL: calls loader with layer 3, limit 10, minRelevance 0.3', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    await provider.getMemories('qa', 'CRITICAL', 2000);

    expect(loader.queryMemories).toHaveBeenCalledTimes(1);
    const [agentId, opts] = loader.queryMemories.mock.calls[0];
    expect(agentId).toBe('qa');
    expect(opts.layer).toBe(3);
    expect(opts.limit).toBe(10);
    expect(opts.minRelevance).toBe(0.3);
  });

  it('passes tokenBudget to loader', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    await provider.getMemories('dev', 'MODERATE', 750);

    const [, opts] = loader.queryMemories.mock.calls[0];
    expect(opts.tokenBudget).toBe(750);
  });
});

// ─── getMemories — UNKNOWN BRACKET ───────────────────────────────────────────

describe('SynapseMemoryProvider.getMemories — unknown bracket', () => {
  it('returns empty array for unknown bracket without calling loader', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    const result = await provider.getMemories('dev', 'UNKNOWN_BRACKET', 500);

    expect(result).toEqual([]);
    expect(loader.queryMemories).not.toHaveBeenCalled();
  });

  it('returns empty array for undefined bracket', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    const result = await provider.getMemories('dev', undefined, 500);

    expect(result).toEqual([]);
  });
});

// ─── getMemories — SESSION CACHE ─────────────────────────────────────────────

describe('SynapseMemoryProvider.getMemories — session cache', () => {
  it('returns cached result on second call without querying loader again', async () => {
    const loader = makeLoader([{ content: 'cached memory', source: 'test', relevance: 0.8 }]);
    const provider = makeProvider(loader);

    const first = await provider.getMemories('dev', 'MODERATE', 500);
    const second = await provider.getMemories('dev', 'MODERATE', 500);

    // Loader called only once
    expect(loader.queryMemories).toHaveBeenCalledTimes(1);
    // Both results are the same (or equal)
    expect(second).toEqual(first);
  });

  it('different agentId-bracket combinations each get their own cache entry', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    await provider.getMemories('dev', 'MODERATE', 500);
    await provider.getMemories('qa', 'MODERATE', 500);
    await provider.getMemories('dev', 'CRITICAL', 2000);

    // Three distinct cache keys → three loader calls
    expect(loader.queryMemories).toHaveBeenCalledTimes(3);
  });

  it('same agentId + different bracket → separate cache entries', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    await provider.getMemories('dev', 'MODERATE', 500);
    await provider.getMemories('dev', 'DEPLETED', 1000);

    expect(loader.queryMemories).toHaveBeenCalledTimes(2);
  });
});

// ─── clearCache() ────────────────────────────────────────────────────────────

describe('SynapseMemoryProvider.clearCache()', () => {
  it('clears the cache so next call re-queries the loader', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    // First call — populates cache
    await provider.getMemories('dev', 'MODERATE', 500);
    expect(loader.queryMemories).toHaveBeenCalledTimes(1);

    // Clear cache
    provider.clearCache();

    // Second call — should re-query
    await provider.getMemories('dev', 'MODERATE', 500);
    expect(loader.queryMemories).toHaveBeenCalledTimes(2);
  });

  it('clearCache does not throw on an empty cache', () => {
    const provider = new SynapseMemoryProvider({ projectDir: '/tmp/test-synapse' });
    expect(() => provider.clearCache()).not.toThrow();
  });
});

// ─── getMemories — TOKEN BUDGET ENFORCEMENT ──────────────────────────────────

describe('SynapseMemoryProvider.getMemories — token budget', () => {
  it('stops adding hints when token budget is exceeded', async () => {
    // Each memory has content of ~400 chars → ~100 tokens each
    const memories = [
      { content: 'A'.repeat(400), source: 'test', relevance: 0.9 },
      { content: 'B'.repeat(400), source: 'test', relevance: 0.8 },
      { content: 'C'.repeat(400), source: 'test', relevance: 0.7 },
    ];
    const loader = makeLoader(memories);
    const provider = makeProvider(loader);

    // Budget of 150 tokens → should only include first hint (~100 tokens)
    const hints = await provider.getMemories('dev', 'CRITICAL', 150);

    expect(hints.length).toBe(1);
    expect(hints[0].content).toBe('A'.repeat(400));
  });

  it('returns empty array when loader returns empty array', async () => {
    const loader = makeLoader([]);
    const provider = makeProvider(loader);

    const hints = await provider.getMemories('dev', 'MODERATE', 500);

    expect(hints).toEqual([]);
  });

  it('hint objects include content, source, relevance, and tokens fields', async () => {
    const memories = [
      { content: 'test memory content', source: 'procedural', relevance: 0.85 },
    ];
    const loader = makeLoader(memories);
    const provider = makeProvider(loader);

    const hints = await provider.getMemories('dev', 'MODERATE', 500);

    expect(hints).toHaveLength(1);
    expect(hints[0]).toMatchObject({
      content: 'test memory content',
      source: 'procedural',
      relevance: 0.85,
    });
    expect(typeof hints[0].tokens).toBe('number');
    expect(hints[0].tokens).toBeGreaterThan(0);
  });
});
