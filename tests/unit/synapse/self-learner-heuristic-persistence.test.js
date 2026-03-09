'use strict';

/**
 * Story 16.3 — Heuristic Persistence Store
 *
 * Verifies that SelfLearner.run() persists qualifying heuristic candidates to
 * .aios/memories/shared/durable/heuristics/ via MemoryWriter.writeHeuristic(),
 * with correct dryRun guard, per-entry error isolation, stats tracking, and
 * full backward compatibility.
 *
 * Pattern: MemoryWriter is mocked throughout — tests verify call args and
 * behavior (not filesystem state). MemoryWriter filesystem behavior is
 * covered by memory-writer.test.js (Story 16.1).
 */

const { SelfLearner } = require('../../../.aios-core/core/synapse/memory/self-learner');

// Mock MemoryWriter — intercepts the lazy require inside _persistHeuristics
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
 */
function stubIO(learner) {
  jest.spyOn(learner, '_loadDigests').mockResolvedValue([]);
  jest.spyOn(learner, '_loadMemories').mockResolvedValue([]);
  jest.spyOn(learner, '_persistEvidence').mockResolvedValue();
  jest.spyOn(learner, '_persistMemoryUpdates').mockResolvedValue();
  jest.spyOn(learner, '_persistGotchas').mockResolvedValue();
}

/**
 * Build a pattern-repeat evidence entry guaranteed to pass HEURISTIC_THRESHOLDS
 * (confidence > 0.9, evidence_count >= 5).
 * Uses evidence_count=6 with recent dates to push confidence above threshold.
 */
function makeHighEvidenceEntry(text, evidenceCount = 6) {
  const now = new Date().toISOString();
  const sessions = Array.from({ length: evidenceCount }, (_, i) => `session-${i + 1}`);
  return {
    type: 'pattern-repeat',
    text,
    evidence_count: evidenceCount,
    sessions,
    first_seen: now,
    last_seen: now,
  };
}

/**
 * Build a heuristic candidate in the shape _extractHeuristics() produces.
 */
function makeHeuristic(id, rule) {
  return {
    id,
    type: 'rule-candidate',
    rule,
    evidence_summary: ['pattern-repeat in session session-1 (2026-03-09T10:00:00.000Z)'],
    confidence: 0.95,
    evidence_count: 6,
    proposed_action: 'add_to_claude_md',
    proposed_target: 'MEMORY.md',
    proposed_content: rule,
    source_memories: ['session-1'],
    created: '2026-03-09T10:00:00.000Z',
  };
}

// ─── Setup ──────────────────────────────────────────────────────────────────

describe('SelfLearner — Heuristic Persistence (Story 16.3)', () => {
  let learner;
  let mockWriteHeuristic;

  beforeEach(() => {
    jest.clearAllMocks();

    learner = new SelfLearner('/tmp/test-project');

    // Default mock: successful writeHeuristic for all calls
    mockWriteHeuristic = jest.fn().mockResolvedValue({
      id: 'mem-shared-2026-03-09-001',
      filePath: '/tmp/test-project/.aios/memories/shared/durable/heuristics/heur-2026-03-09-001.yaml',
      tier: 'durable',
    });

    MemoryWriter.mockImplementation(() => ({
      write: jest.fn().mockResolvedValue({ id: 'mem-id', filePath: '/fake/path', tier: 'session' }),
      writeHeuristic: mockWriteHeuristic,
    }));
  });

  // ─── AC-1: Heuristic Files Written to Canonical Path ────────────────────

  describe('AC-1: Heuristic Files Written to Canonical Path', () => {
    it('calls writeHeuristic() for each qualifying heuristic candidate after run()', async () => {
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });

      // Use controlled candidates to ensure deterministic call count
      const heuristics = [
        makeHeuristic('heur-001', 'always use absolute imports'),
        makeHeuristic('heur-002', 'prefer const over let'),
      ];
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue(heuristics);
      stubEvidence(learner);

      const result = await learner.run();

      expect(result.skipped).toBe(false);
      expect(mockWriteHeuristic).toHaveBeenCalledTimes(2);
      expect(result.stats.heuristics_persisted).toBe(2);
    });

    it('calls writeHeuristic() with agentId="shared" (canonical per architecture spec)', async () => {
      // Directly test _persistHeuristics() with a controlled candidate
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });

      const heuristics = [makeHeuristic('heur-2026-03-09-001', 'use absolute imports always')];
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue(heuristics);
      stubEvidence(learner);

      await learner.run();

      expect(mockWriteHeuristic).toHaveBeenCalledWith('shared', heuristics[0]);
    });
  });

  // ─── AC-3 + AC-5: Only Threshold-Meeting Heuristics / dryRun ────────────

  describe('AC-5: dryRun=true Skips Heuristic Persistence', () => {
    it('does NOT call writeHeuristic() when run({ dryRun: true })', async () => {
      stubEvidence(learner, {
        'pattern:test': makeHighEvidenceEntry('some pattern text'),
      });
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });

      const heuristics = [makeHeuristic('heur-2026-03-09-001', 'some pattern text')];
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue(heuristics);

      await learner.run({ dryRun: true });

      expect(mockWriteHeuristic).not.toHaveBeenCalled();
    });

    it('still returns heuristicCandidates even when dryRun=true (detection not gated)', async () => {
      stubEvidence(learner, {
        'pattern:test': makeHighEvidenceEntry('dryRun detection test'),
      });
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });

      const heuristics = [makeHeuristic('heur-2026-03-09-001', 'dryRun detection test')];
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue(heuristics);

      const result = await learner.run({ dryRun: true });

      expect(result.heuristicCandidates).toEqual(heuristics);
    });
  });

  // ─── AC-6: Write Failures Do Not Abort the Run ──────────────────────────

  describe('AC-6: Write Failures Do Not Abort the Run', () => {
    it('continues processing remaining candidates when one writeHeuristic() fails', async () => {
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });

      const heuristics = [
        makeHeuristic('heur-001', 'first rule'),
        makeHeuristic('heur-002', 'second rule'),
        makeHeuristic('heur-003', 'third rule'),
      ];
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue(heuristics);
      stubEvidence(learner);

      // First call fails (filePath: null), second and third succeed
      mockWriteHeuristic
        .mockResolvedValueOnce({ id: 'heur-001', filePath: null, error: 'duplicate found' })
        .mockResolvedValueOnce({ id: 'heur-002', filePath: '/fake/heur-002.yaml', tier: 'durable' })
        .mockResolvedValueOnce({ id: 'heur-003', filePath: '/fake/heur-003.yaml', tier: 'durable' });

      const result = await learner.run();

      // All three should have been attempted
      expect(mockWriteHeuristic).toHaveBeenCalledTimes(3);
      // Only 2 succeeded
      expect(result.stats.heuristics_persisted).toBe(2);
    });

    it('does not throw when writeHeuristic() rejects for one candidate', async () => {
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });

      const heuristics = [
        makeHeuristic('heur-001', 'failing rule'),
        makeHeuristic('heur-002', 'succeeding rule'),
      ];
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue(heuristics);
      stubEvidence(learner);

      mockWriteHeuristic
        .mockRejectedValueOnce(new Error('disk full'))
        .mockResolvedValueOnce({ id: 'heur-002', filePath: '/fake/heur-002.yaml', tier: 'durable' });

      // run() must NOT throw
      await expect(learner.run()).resolves.not.toThrow();

      expect(mockWriteHeuristic).toHaveBeenCalledTimes(2);
    });
  });

  // ─── AC-6 (cont.): MemoryWriter Module Unavailable ─────────────────────
  //
  // The lazy-require try-catch catches errors thrown while resolving MemoryWriter
  // (e.g., when 16.1 is not deployed). We simulate this by redefining the .MemoryWriter
  // export as a getter that throws — the access is inside the try block in
  // _persistHeuristics(), so the catch fires and returns { persisted: 0 }.

  describe('AC-6: MemoryWriter Module Unavailable (lazy-require catch path)', () => {
    let mockModule;
    let originalDescriptor;

    beforeEach(() => {
      mockModule = require('../../../.aios-core/core/synapse/memory/memory-writer');
      originalDescriptor = Object.getOwnPropertyDescriptor(mockModule, 'MemoryWriter');
    });

    afterEach(() => {
      // Restore original MemoryWriter property after each test in this block
      if (originalDescriptor) {
        Object.defineProperty(mockModule, 'MemoryWriter', originalDescriptor);
      }
    });

    it('logs console.warn and returns { persisted: 0 } when MemoryWriter is unavailable', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      // Redefine .MemoryWriter as a getter that throws — simulates module not deployed
      Object.defineProperty(mockModule, 'MemoryWriter', {
        get() { throw new Error("Cannot find module './memory-writer'"); },
        configurable: true,
      });

      const heuristics = [makeHeuristic('heur-001', 'test rule')];
      const result = await learner._persistHeuristics(heuristics, { dryRun: false });

      expect(result).toEqual({ persisted: 0 });
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[SelfLearner] MemoryWriter not available for heuristic persistence:'),
        expect.any(String)
      );

      warnSpy.mockRestore();
    });

    it('run() completes normally with heuristics_persisted=0 when MemoryWriter is unavailable', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      Object.defineProperty(mockModule, 'MemoryWriter', {
        get() { throw new Error("Cannot find module './memory-writer'"); },
        configurable: true,
      });

      stubEvidence(learner);
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue([
        makeHeuristic('heur-001', 'test rule'),
      ]);

      const result = await learner.run();

      expect(result.skipped).toBe(false);
      expect(result.stats.heuristics_persisted).toBe(0);

      warnSpy.mockRestore();
    });
  });

  // ─── AC-7: Heuristic Stats Tracked ──────────────────────────────────────

  describe('AC-7: Heuristic Stats Tracked', () => {
    it('stats.heuristics_persisted equals count of successfully written files', async () => {
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });

      const heuristics = [
        makeHeuristic('heur-001', 'rule one'),
        makeHeuristic('heur-002', 'rule two'),
      ];
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue(heuristics);
      stubEvidence(learner);

      mockWriteHeuristic.mockResolvedValue({
        id: 'mem-id',
        filePath: '/fake/path.yaml',
        tier: 'durable',
      });

      const result = await learner.run();

      expect(result.stats.heuristics_persisted).toBe(2);
    });

    it('stats.heuristics_extracted is unchanged (total detected, not persisted)', async () => {
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });

      const heuristics = [
        makeHeuristic('heur-001', 'rule one'),
        makeHeuristic('heur-002', 'rule two'),
        makeHeuristic('heur-003', 'rule three'),
      ];
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue(heuristics);
      stubEvidence(learner);

      // Only 2 writes succeed
      mockWriteHeuristic
        .mockResolvedValueOnce({ id: 'h1', filePath: '/fake/1.yaml', tier: 'durable' })
        .mockResolvedValueOnce({ id: 'h2', filePath: null, error: 'dup' })
        .mockResolvedValueOnce({ id: 'h3', filePath: '/fake/3.yaml', tier: 'durable' });

      const result = await learner.run();

      // Extracted = total candidates (3), persisted = successful writes (2)
      expect(result.stats.heuristics_extracted).toBe(3);
      expect(result.stats.heuristics_persisted).toBe(2);
    });

    it('stats.heuristics_persisted defaults to 0 when no candidates exist', async () => {
      stubEvidence(learner); // empty evidence → no candidates
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue([]);

      const result = await learner.run();

      expect(result.stats.heuristics_persisted).toBe(0);
    });
  });

  // ─── AC-8: Backward Compatibility ───────────────────────────────────────

  describe('AC-8: Backward Compatibility', () => {
    it('getHeuristicCandidates() returns same candidates regardless of persistence result', async () => {
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });

      const heuristics = [makeHeuristic('heur-001', 'rule one')];
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue(heuristics);
      stubEvidence(learner);

      // writeHeuristic fails for this candidate
      mockWriteHeuristic.mockResolvedValue({ id: 'heur-001', filePath: null, error: 'fail' });

      await learner.run();

      // getHeuristicCandidates() returns detected candidates, not persisted ones
      expect(learner.getHeuristicCandidates()).toEqual(heuristics);
    });

    it('_persistGotchas() is still called after _persistHeuristics() is added', async () => {
      stubEvidence(learner);
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue([]);

      await learner.run();

      expect(learner._persistGotchas).toHaveBeenCalled();
    });

    it('run() return shape is unchanged — all existing fields present', async () => {
      stubEvidence(learner);
      stubIO(learner);
      jest.spyOn(learner, '_persistToMemoryStore').mockResolvedValue({ session: 0, daily: 0 });
      jest.spyOn(learner, '_extractHeuristics').mockReturnValue([]);

      const result = await learner.run();

      expect(result).toHaveProperty('skipped');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('heuristicCandidates');
      expect(result).toHaveProperty('tierChanges');
      expect(result).toHaveProperty('gotchas');
      expect(result).toHaveProperty('memoriesProcessed');
      expect(result).toHaveProperty('digestsProcessed');
    });
  });
});
