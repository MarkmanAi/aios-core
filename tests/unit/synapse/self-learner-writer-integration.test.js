'use strict';

/**
 * Story 16.2 — SelfLearner → MemoryWriter Integration
 *
 * Verifies that SelfLearner.run() persists qualifying evidence entries to
 * SYNAPSE memory stores via MemoryWriter with correct tier routing, thresholds,
 * confidence values, dryRun guard, and error isolation.
 *
 * Pattern: MemoryWriter is mocked throughout — tests verify call args and
 * behavior (not filesystem state). MemoryWriter filesystem behavior is
 * covered by memory-writer.test.js (Story 16.1).
 */

const { SelfLearner } = require('../../../.aios-core/core/synapse/memory/self-learner');

// Mock MemoryWriter — intercepts the lazy require inside _persistToMemoryStore
jest.mock('../../../.aios-core/core/synapse/memory/memory-writer');
const { MemoryWriter } = require('../../../.aios-core/core/synapse/memory/memory-writer');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Pre-load learner._evidence cache so _loadEvidence() returns early without I/O.
 */
function stubEvidence(learner, patterns = {}, axioms = {}, corrections = {}) {
  learner._evidence = {
    patterns,
    axioms,
    corrections,
    errors: {},
    version: 1,
    created: '2026-01-01T00:00:00.000Z',
  };
}

/**
 * Stub all I/O methods on a SelfLearner instance to prevent filesystem access.
 * _loadEvidence is NOT stubbed — it returns learner._evidence from cache.
 */
function stubIO(learner) {
  jest.spyOn(learner, '_loadDigests').mockResolvedValue([]);
  jest.spyOn(learner, '_loadMemories').mockResolvedValue([]);
  jest.spyOn(learner, '_persistEvidence').mockResolvedValue();
  jest.spyOn(learner, '_persistMemoryUpdates').mockResolvedValue();
  jest.spyOn(learner, '_persistGotchas').mockResolvedValue();
}

/** Build a minimal evidence entry with controlled evidence_count. */
function makeEntry(type, text, evidenceCount) {
  const sessions = Array.from({ length: evidenceCount }, (_, i) => `session-${i + 1}`);
  return {
    type,
    text,
    evidence_count: evidenceCount,
    sessions,
    first_seen: '2026-01-01T00:00:00.000Z',
    last_seen: '2026-01-01T00:00:00.000Z',
  };
}

// ─── Setup ──────────────────────────────────────────────────────────────────

describe('SelfLearner → MemoryWriter Integration (Story 16.2)', () => {
  let learner;

  beforeEach(() => {
    jest.clearAllMocks();

    learner = new SelfLearner('/tmp/test-project');

    // Default mock: successful write for all calls
    MemoryWriter.mockImplementation(() => ({
      write: jest.fn().mockResolvedValue({
        id: 'mem-shared-2026-01-01-001',
        filePath: '/tmp/test-project/.aios/memories/shared/session/session-shared-2026-01-01-001.yaml',
        tier: 'session',
      }),
    }));
  });

  // ─── AC-1: Session Memories Written After run() ──────────────────────────

  describe('AC-1: Session Memories Written After run()', () => {
    it('calls MemoryWriter.write() with tier=session for pattern with evidence_count=2', async () => {
      stubEvidence(learner, {
        'pattern:abs-imports': makeEntry('pattern-repeat', 'use absolute imports always', 2),
      });
      stubIO(learner);

      const result = await learner.run();

      expect(result.skipped).toBe(false);
      const mockWriter = MemoryWriter.mock.results[0].value;
      const sessionCalls = mockWriter.write.mock.calls.filter(([, , tier]) => tier === 'session');
      expect(sessionCalls.length).toBeGreaterThanOrEqual(1);
      expect(sessionCalls[0][0]).toBe('shared');
      expect(sessionCalls[0][1].type).toBe('pattern');
      expect(sessionCalls[0][1].text).toBe('use absolute imports always');
      expect(sessionCalls[0][1].confidence).toBe(0.65);
    });

    it('maps axiom-confirmed entries to memory_type=axiom', async () => {
      stubEvidence(learner, {}, {
        'axiom:cli-first': makeEntry('axiom-confirmed', 'CLI always takes priority over UI', 2),
      });
      stubIO(learner);

      await learner.run();

      const mockWriter = MemoryWriter.mock.results[0].value;
      const sessionCalls = mockWriter.write.mock.calls.filter(([, , tier]) => tier === 'session');
      expect(sessionCalls.length).toBeGreaterThanOrEqual(1);
      expect(sessionCalls[0][1].type).toBe('axiom');
    });

    it('maps user-correction entries to memory_type=correction', async () => {
      stubEvidence(learner, {}, {}, {
        'correction:await': makeEntry('user-correction', 'use await instead of .then chains', 2),
      });
      stubIO(learner);

      await learner.run();

      const mockWriter = MemoryWriter.mock.results[0].value;
      const sessionCalls = mockWriter.write.mock.calls.filter(([, , tier]) => tier === 'session');
      expect(sessionCalls.length).toBeGreaterThanOrEqual(1);
      expect(sessionCalls[0][1].type).toBe('correction');
    });
  });

  // ─── AC-2: Daily Memories Written for High-Evidence Entries ─────────────

  describe('AC-2: Daily Memories Written for High-Evidence Entries', () => {
    it('calls write() for both session AND daily when pattern has evidence_count=3', async () => {
      stubEvidence(learner, {
        'pattern:const': makeEntry('pattern-repeat', 'always use const over var', 3),
      });
      stubIO(learner);

      await learner.run();

      const mockWriter = MemoryWriter.mock.results[0].value;
      const sessionCalls = mockWriter.write.mock.calls.filter(([, , tier]) => tier === 'session');
      const dailyCalls = mockWriter.write.mock.calls.filter(([, , tier]) => tier === 'daily');
      expect(sessionCalls.length).toBeGreaterThanOrEqual(1);
      expect(dailyCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('session write uses confidence=0.65 and daily write uses confidence=0.80', async () => {
      stubEvidence(learner, {
        'pattern:conf': makeEntry('pattern-repeat', 'confidence tier test', 3),
      });
      stubIO(learner);

      await learner.run();

      const mockWriter = MemoryWriter.mock.results[0].value;
      const sessionCall = mockWriter.write.mock.calls.find(([, , tier]) => tier === 'session');
      const dailyCall = mockWriter.write.mock.calls.find(([, , tier]) => tier === 'daily');
      expect(sessionCall[1].confidence).toBe(0.65);
      expect(dailyCall[1].confidence).toBe(0.80);
    });

    it('corrections with evidence_count=3 do NOT produce a daily write', async () => {
      stubEvidence(learner, {}, {}, {
        'correction:no-daily': makeEntry('user-correction', 'correction never goes daily', 3),
      });
      stubIO(learner);

      await learner.run();

      const mockWriter = MemoryWriter.mock.results[0].value;
      const dailyCalls = mockWriter.write.mock.calls.filter(([, , tier]) => tier === 'daily');
      expect(dailyCalls.length).toBe(0);
    });
  });

  // ─── AC-3: Evidence Thresholds Enforced ─────────────────────────────────

  describe('AC-3: Evidence Thresholds Enforced', () => {
    it('does NOT call write() for evidence_count=1', async () => {
      stubEvidence(learner, {
        'pattern:single': makeEntry('pattern-repeat', 'single observation only', 1),
      });
      stubIO(learner);

      await learner.run();

      if (MemoryWriter.mock.instances.length > 0) {
        const mockWriter = MemoryWriter.mock.results[0].value;
        expect(mockWriter.write).not.toHaveBeenCalled();
      }
    });

    it('does NOT call write() for evidence_count=0', async () => {
      stubEvidence(learner, {
        'pattern:zero': makeEntry('pattern-repeat', 'zero count', 0),
      });
      stubIO(learner);

      await learner.run();

      if (MemoryWriter.mock.instances.length > 0) {
        const mockWriter = MemoryWriter.mock.results[0].value;
        expect(mockWriter.write).not.toHaveBeenCalled();
      }
    });

    it('does NOT write gotcha-repeat entries (handled by _persistGotchas)', async () => {
      // gotcha-repeat lives in evidence.errors, not in patterns/axioms/corrections
      learner._evidence = {
        patterns: {},
        axioms: {},
        corrections: {},
        errors: {
          'error:gotcha': makeEntry('gotcha-repeat', 'repeated error to gotcha', 3),
        },
        version: 1,
      };
      stubIO(learner);

      await learner.run();

      if (MemoryWriter.mock.instances.length > 0) {
        const mockWriter = MemoryWriter.mock.results[0].value;
        expect(mockWriter.write).not.toHaveBeenCalled();
      }
    });
  });

  // ─── AC-4: dryRun=true Skips MemoryWriter Calls ─────────────────────────

  describe('AC-4: dryRun=true Skips MemoryWriter Calls', () => {
    it('does not instantiate MemoryWriter when dryRun=true', async () => {
      stubEvidence(learner, {
        'pattern:dry': makeEntry('pattern-repeat', 'dry run should skip this', 3),
      });
      stubIO(learner);

      await learner.run({ dryRun: true });

      expect(MemoryWriter).not.toHaveBeenCalled();
    });

    it('does not call write() on any entry when dryRun=true', async () => {
      stubEvidence(learner, {
        'pattern:p1': makeEntry('pattern-repeat', 'pattern one', 3),
        'pattern:p2': makeEntry('pattern-repeat', 'pattern two', 2),
      }, {
        'axiom:a1': makeEntry('axiom-confirmed', 'axiom one', 2),
      });
      stubIO(learner);

      await learner.run({ dryRun: true });

      expect(MemoryWriter).not.toHaveBeenCalled();
    });
  });

  // ─── AC-5: Write Failures Do Not Abort Learning Run ─────────────────────

  describe('AC-5: Write Failures Do Not Abort Learning Run', () => {
    it('continues processing when write() returns { filePath: null }', async () => {
      MemoryWriter.mockImplementation(() => ({
        write: jest.fn()
          .mockResolvedValueOnce({ id: 'id1', filePath: null, tier: 'session', error: 'disk full' })
          .mockResolvedValue({ id: 'id2', filePath: '/some/path.yaml', tier: 'session' }),
      }));

      stubEvidence(learner, {
        'pattern:fail': makeEntry('pattern-repeat', 'first write fails', 2),
        'pattern:ok': makeEntry('pattern-repeat', 'second write succeeds', 2),
      });
      stubIO(learner);

      const result = await learner.run();

      expect(result.skipped).toBe(false);
      expect(result.error).toBeUndefined();
      // Both entries were attempted despite the first failure
      const mockWriter = MemoryWriter.mock.results[0].value;
      expect(mockWriter.write).toHaveBeenCalledTimes(2);
    });

    it('completes without throwing when MemoryWriter instantiation fails', async () => {
      MemoryWriter.mockImplementation(() => {
        throw new Error('Module instantiation failed');
      });

      stubEvidence(learner, {
        'pattern:test': makeEntry('pattern-repeat', 'test pattern', 2),
      });
      stubIO(learner);

      const result = await learner.run();

      expect(result.skipped).toBe(false);
      expect(result.error).toBeUndefined();
    });

    it('completes without throwing when a single write() call throws', async () => {
      MemoryWriter.mockImplementation(() => ({
        write: jest.fn().mockRejectedValue(new Error('Unexpected write error')),
      }));

      stubEvidence(learner, {
        'pattern:throws': makeEntry('pattern-repeat', 'write throws unexpectedly', 2),
      });
      stubIO(learner);

      const result = await learner.run();

      expect(result.skipped).toBe(false);
      expect(result.error).toBeUndefined();
    });
  });

  // ─── AC-6: Backward Compatibility — Public API Unchanged ────────────────

  describe('AC-6: Backward Compatibility — Public API Unchanged', () => {
    it('run() return shape is identical to pre-Story 16.2', async () => {
      stubEvidence(learner);
      stubIO(learner);

      const result = await learner.run();

      expect(result).toHaveProperty('skipped');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('heuristicCandidates');
      expect(result).toHaveProperty('tierChanges');
      expect(result).toHaveProperty('gotchas');
      expect(result).toHaveProperty('memoriesProcessed');
      expect(result).toHaveProperty('digestsProcessed');
    });

    it('existing stat fields are present and unchanged', async () => {
      stubEvidence(learner);
      stubIO(learner);

      const result = await learner.run();

      expect(result.stats).toHaveProperty('corrections_found');
      expect(result.stats).toHaveProperty('heuristics_extracted');
      expect(result.stats).toHaveProperty('promotions');
      expect(result.stats).toHaveProperty('demotions');
      expect(result.stats).toHaveProperty('gotchas_created');
      expect(result.stats).toHaveProperty('duration_ms');
    });
  });

  // ─── AC-7: Write Count in Stats ──────────────────────────────────────────

  describe('AC-7: Write Count in Stats', () => {
    it('stats includes memories_written_session and memories_written_daily', async () => {
      stubEvidence(learner, {
        'pattern:stat': makeEntry('pattern-repeat', 'stats fields test', 3),
      });
      stubIO(learner);

      const result = await learner.run();

      expect(result.stats).toHaveProperty('memories_written_session');
      expect(result.stats).toHaveProperty('memories_written_daily');
      expect(typeof result.stats.memories_written_session).toBe('number');
      expect(typeof result.stats.memories_written_daily).toBe('number');
    });

    it('memories_written_session >= 1 after run with qualifying evidence', async () => {
      stubEvidence(learner, {
        'pattern:count': makeEntry('pattern-repeat', 'count test pattern', 2),
      });
      stubIO(learner);

      const result = await learner.run();

      expect(result.stats.memories_written_session).toBeGreaterThanOrEqual(1);
    });

    it('memories_written_daily >= 1 when evidence_count=3 pattern present', async () => {
      stubEvidence(learner, {
        'pattern:daily': makeEntry('pattern-repeat', 'daily count test', 3),
      });
      stubIO(learner);

      const result = await learner.run();

      expect(result.stats.memories_written_daily).toBeGreaterThanOrEqual(1);
    });

    it('both stats default to 0 when no writes occur (dryRun=true)', async () => {
      stubEvidence(learner, {
        'pattern:dry': makeEntry('pattern-repeat', 'dry run zero stats', 3),
      });
      stubIO(learner);

      const result = await learner.run({ dryRun: true });

      expect(result.stats.memories_written_session).toBe(0);
      expect(result.stats.memories_written_daily).toBe(0);
    });

    it('both stats default to 0 when no qualifying evidence (all evidence_count < 2)', async () => {
      stubEvidence(learner, {
        'pattern:low': makeEntry('pattern-repeat', 'below threshold', 1),
      });
      stubIO(learner);

      const result = await learner.run();

      expect(result.stats.memories_written_session).toBe(0);
      expect(result.stats.memories_written_daily).toBe(0);
    });
  });
});
