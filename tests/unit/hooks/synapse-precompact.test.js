'use strict';

/**
 * Story 24.1 — SelfLearner Trigger
 *
 * Unit tests for synapse-precompact.js hook after chaining SelfLearner.run().
 * Verifies: call sequence, error swallowing, and chain-stop on extractor failure.
 *
 * Strategy: spy on setImmediate to capture the async callback, then invoke it
 * directly — avoids timer flakiness and gives full control over execution order.
 */

const path = require('path');

// Project root (tests/unit/hooks/ → up 3 levels)
const ROOT = path.resolve(__dirname, '../../..');

// Match the exact absolute paths the hook resolves via path.resolve(__dirname, rel)
const EXTRACTOR_PATH = path.join(ROOT, '.aios-core', 'core', 'synapse', 'memory', 'session-digest', 'extractor');
const SELF_LEARNER_PATH = path.join(ROOT, '.aios-core', 'core', 'synapse', 'memory', 'self-learner');

describe('synapse-precompact.js — SelfLearner chaining (Story 24.1)', () => {
  let mockExtractSessionDigest;
  let mockSelfLearnerRun;
  let capturedCallback;

  beforeEach(() => {
    jest.resetModules();

    mockExtractSessionDigest = jest.fn().mockResolvedValue(undefined);
    mockSelfLearnerRun = jest.fn().mockResolvedValue(undefined);

    // doMock (not mock) — must be called AFTER resetModules, not hoisted
    jest.doMock(EXTRACTOR_PATH, () => ({
      extractSessionDigest: mockExtractSessionDigest,
    }));
    jest.doMock(SELF_LEARNER_PATH, () => ({
      run: mockSelfLearnerRun,
    }));

    // Capture the setImmediate callback to control execution timing in tests
    capturedCallback = null;
    jest.spyOn(global, 'setImmediate').mockImplementation((fn) => {
      capturedCallback = fn;
    });

    // Ensure no env pollution between tests
    delete process.env.CLAUDE_HOOK_INPUT;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function requireHook() {
    // Fresh require after resetModules — doMock factories are active
    require('../../../.claude/hooks/synapse-precompact');
  }

  // ─── T2.2: sequence ─────────────────────────────────────────────────────────

  it('calls extractSessionDigest and SelfLearner.run in sequence', async () => {
    requireHook();
    expect(capturedCallback).not.toBeNull();

    await capturedCallback();

    expect(mockExtractSessionDigest).toHaveBeenCalledTimes(1);
    expect(mockSelfLearnerRun).toHaveBeenCalledTimes(1);

    // extractSessionDigest must fire before SelfLearner.run
    const [extractOrder] = mockExtractSessionDigest.mock.invocationCallOrder;
    const [selfLearnerOrder] = mockSelfLearnerRun.mock.invocationCallOrder;
    expect(extractOrder).toBeLessThan(selfLearnerOrder);
  });

  it('passes projectDir to SelfLearner.run', async () => {
    requireHook();
    await capturedCallback();

    // With no CLAUDE_HOOK_INPUT, hookContext.projectDir is undefined → falls back to process.cwd()
    expect(mockSelfLearnerRun).toHaveBeenCalledWith(process.cwd());
  });

  // ─── T2.3: SelfLearner error swallowed ──────────────────────────────────────

  it('swallows SelfLearner errors — compact is never blocked', async () => {
    mockSelfLearnerRun.mockRejectedValue(new Error('SelfLearner failure'));
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});

    requireHook();

    // Must resolve (not throw) even when SelfLearner fails
    await expect(capturedCallback()).resolves.toBeUndefined();

    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining('[SYNAPSE] Pipeline error: SelfLearner failure'),
    );
  });

  // ─── T2.4: extractor error stops chain ──────────────────────────────────────

  it('does not call SelfLearner when extractSessionDigest fails', async () => {
    mockExtractSessionDigest.mockRejectedValue(new Error('Digest failure'));
    jest.spyOn(process.stderr, 'write').mockImplementation(() => {});

    requireHook();
    await capturedCallback();

    expect(mockExtractSessionDigest).toHaveBeenCalledTimes(1);
    expect(mockSelfLearnerRun).not.toHaveBeenCalled();
  });
});
