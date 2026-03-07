/**
 * Tests for BobStatusWriter
 *
 * Story 13.3: BobStatusWriter — Dashboard Bridge
 *
 * Tests:
 * - Schema correctness
 * - Atomic file writes
 * - Dir creation failure (AC-1)
 * - Concurrent write serialization (AC-1)
 * - Schema validation TypeError (AC-2)
 * - Dashboard event emission (AC-3)
 * - Emitter failure isolation (AC-3)
 * - ObservabilityPanel integration (AC-4)
 * - Incremental updates
 * - Single source of truth
 * - Edge cases
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// AC-3: Mock dashboard emitter before requiring bob-status-writer
jest.mock('../../../.aios-core/core/events/dashboard-emitter', () => ({
  getDashboardEmitter: jest.fn(),
}));
const { getDashboardEmitter } = require('../../../.aios-core/core/events/dashboard-emitter');

// AC-4: Mock observability panel to avoid terminal renderer
jest.mock('../../../.aios-core/core/ui/observability-panel', () => ({
  ObservabilityPanel: jest.fn(),
  PanelMode: { MINIMAL: 'minimal', DETAILED: 'detailed' },
}));

const {
  BobStatusWriter,
  BOB_STATUS_SCHEMA,
  BOB_STATUS_VERSION,
  DEFAULT_PIPELINE_STAGES,
  createDefaultBobStatus,
} = require('../../../.aios-core/core/orchestration/bob-status-writer');
const { BobEventTypes } = require('../../../.aios-core/core/events/types');

describe('BobStatusWriter', () => {
  let tempDir;
  let writer;
  let mockEmit;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bob-status-test-'));
    // AC-3: Provide mock emitter for all tests
    mockEmit = jest.fn().mockResolvedValue(undefined);
    getDashboardEmitter.mockReturnValue({ emit: mockEmit });
    writer = new BobStatusWriter(tempDir, { debug: false });
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw if projectRoot is not provided', () => {
      expect(() => new BobStatusWriter()).toThrow('projectRoot is required');
    });

    it('should throw if projectRoot is not a string', () => {
      expect(() => new BobStatusWriter(123)).toThrow('projectRoot is required and must be a string');
    });

    it('should set correct paths', () => {
      expect(writer.projectRoot).toBe(tempDir);
      expect(writer.dashboardDir).toBe(path.join(tempDir, '.aios', 'dashboard'));
      expect(writer.statusPath).toBe(path.join(tempDir, '.aios', 'dashboard', 'bob-status.json'));
    });
  });

  describe('initialize', () => {
    it('should create dashboard directory', async () => {
      await writer.initialize();
      const exists = await fs.pathExists(writer.dashboardDir);
      expect(exists).toBe(true);
    });

    it('should create bob-status.json file', async () => {
      await writer.initialize();
      const exists = await fs.pathExists(writer.statusPath);
      expect(exists).toBe(true);
    });

    it('should set orchestration.active to true', async () => {
      await writer.initialize();
      const status = await fs.readJson(writer.statusPath);
      expect(status.orchestration.active).toBe(true);
    });

    it('should include correct schema version', async () => {
      await writer.initialize();
      const status = await fs.readJson(writer.statusPath);
      expect(status.version).toBe(BOB_STATUS_VERSION);
    });
  });

  describe('writeBobStatus', () => {
    it('should write status atomically', async () => {
      await writer.initialize();
      const status = createDefaultBobStatus();
      status.pipeline.current_stage = 'development';

      await writer.writeBobStatus(status);

      const written = await fs.readJson(writer.statusPath);
      expect(written.pipeline.current_stage).toBe('development');
    });

    it('should update timestamp on each write', async () => {
      await writer.initialize();
      const status1 = await fs.readJson(writer.statusPath);

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      await writer.writeBobStatus(writer._status);
      const status2 = await fs.readJson(writer.statusPath);

      expect(new Date(status2.timestamp).getTime()).toBeGreaterThan(
        new Date(status1.timestamp).getTime(),
      );
    });

    it('should update elapsed times', async () => {
      await writer.initialize();
      await writer.startStory('13.3');

      // Wait a bit to accumulate time
      await new Promise((resolve) => setTimeout(resolve, 50));

      await writer.writeBobStatus(writer._status);
      const status = await fs.readJson(writer.statusPath);

      expect(status.elapsed.session_seconds).toBeGreaterThanOrEqual(0);
    });
  });

  describe('updatePhase', () => {
    it('should update current_stage', async () => {
      await writer.initialize();
      await writer.updatePhase('development');

      const status = await fs.readJson(writer.statusPath);
      expect(status.pipeline.current_stage).toBe('development');
    });

    it('should update story_progress when provided', async () => {
      await writer.initialize();
      await writer.updatePhase('development', '3/8');

      const status = await fs.readJson(writer.statusPath);
      expect(status.pipeline.story_progress).toBe('3/8');
    });
  });

  describe('completePhase', () => {
    it('should add phase to completed_stages', async () => {
      await writer.initialize();
      await writer.completePhase('validation');

      const status = await fs.readJson(writer.statusPath);
      expect(status.pipeline.completed_stages).toContain('validation');
    });

    it('should not duplicate completed phases', async () => {
      await writer.initialize();
      await writer.completePhase('validation');
      await writer.completePhase('validation');

      const status = await fs.readJson(writer.statusPath);
      const count = status.pipeline.completed_stages.filter(
        (s) => s === 'validation',
      ).length;
      expect(count).toBe(1);
    });
  });

  describe('updateAgent', () => {
    it('should update current_agent fields', async () => {
      await writer.initialize();
      await writer.updateAgent('@dev', 'Dex', 'development', 'Story type: code_general');

      const status = await fs.readJson(writer.statusPath);
      expect(status.current_agent.id).toBe('@dev');
      expect(status.current_agent.name).toBe('Dex');
      expect(status.current_agent.task).toBe('development');
      expect(status.current_agent.reason).toBe('Story type: code_general');
      expect(status.current_agent.started_at).toBeTruthy();
    });
  });

  describe('clearAgent', () => {
    it('should clear current_agent fields', async () => {
      await writer.initialize();
      await writer.updateAgent('@dev', 'Dex', 'development', 'reason');
      await writer.clearAgent();

      const status = await fs.readJson(writer.statusPath);
      expect(status.current_agent.id).toBeNull();
      expect(status.current_agent.name).toBeNull();
      expect(status.current_agent.task).toBeNull();
    });
  });

  describe('addTerminal', () => {
    it('should add terminal to active_terminals', async () => {
      await writer.initialize();
      await writer.addTerminal('@dev', 12345, 'development');

      const status = await fs.readJson(writer.statusPath);
      expect(status.active_terminals).toHaveLength(1);
      expect(status.active_terminals[0].agent).toBe('@dev');
      expect(status.active_terminals[0].pid).toBe(12345);
      expect(status.active_terminals[0].task).toBe('development');
    });
  });

  describe('removeTerminal', () => {
    it('should remove terminal by pid', async () => {
      await writer.initialize();
      await writer.addTerminal('@dev', 12345, 'development');
      await writer.addTerminal('@qa', 67890, 'quality_gate');
      await writer.removeTerminal(12345);

      const status = await fs.readJson(writer.statusPath);
      expect(status.active_terminals).toHaveLength(1);
      expect(status.active_terminals[0].pid).toBe(67890);
    });
  });

  describe('recordSurfaceDecision', () => {
    it('should add surface decision', async () => {
      await writer.initialize();
      await writer.recordSurfaceDecision('C003', 'present_options', { foo: 'bar' });

      const status = await fs.readJson(writer.statusPath);
      expect(status.surface_decisions).toHaveLength(1);
      expect(status.surface_decisions[0].criteria).toBe('C003');
      expect(status.surface_decisions[0].action).toBe('present_options');
      expect(status.surface_decisions[0].resolved).toBe(false);
    });
  });

  describe('resolveSurfaceDecision', () => {
    it('should mark decision as resolved', async () => {
      await writer.initialize();
      await writer.recordSurfaceDecision('C003', 'present_options', {});
      await writer.resolveSurfaceDecision('C003');

      const status = await fs.readJson(writer.statusPath);
      expect(status.surface_decisions[0].resolved).toBe(true);
      expect(status.surface_decisions[0].resolved_at).toBeTruthy();
    });
  });

  describe('addError', () => {
    it('should add error to errors array', async () => {
      await writer.initialize();
      await writer.addError('development', 'Test error', true);

      const status = await fs.readJson(writer.statusPath);
      expect(status.errors).toHaveLength(1);
      expect(status.errors[0].phase).toBe('development');
      expect(status.errors[0].message).toBe('Test error');
      expect(status.errors[0].recoverable).toBe(true);
    });
  });

  describe('clearErrors', () => {
    it('should clear all errors', async () => {
      await writer.initialize();
      await writer.addError('development', 'Error 1', true);
      await writer.addError('qa', 'Error 2', false);
      await writer.clearErrors();

      const status = await fs.readJson(writer.statusPath);
      expect(status.errors).toHaveLength(0);
    });
  });

  describe('educational mode', () => {
    it('should update educational mode data', async () => {
      await writer.initialize();
      await writer.updateEducational({ enabled: true });

      const status = await fs.readJson(writer.statusPath);
      expect(status.educational.enabled).toBe(true);
    });

    it('should add trade-offs', async () => {
      await writer.initialize();
      await writer.addTradeoff('JWT vs Session', 'JWT', 'Better for microservices');

      const status = await fs.readJson(writer.statusPath);
      expect(status.educational.tradeoffs).toHaveLength(1);
      expect(status.educational.tradeoffs[0].choice).toBe('JWT vs Session');
      expect(status.educational.tradeoffs[0].selected).toBe('JWT');
    });
  });

  describe('startStory', () => {
    it('should set current_story and reset progress', async () => {
      await writer.initialize();
      await writer.completePhase('validation');
      await writer.startStory('13.3');

      const status = await fs.readJson(writer.statusPath);
      expect(status.orchestration.current_story).toBe('13.3');
      expect(status.pipeline.completed_stages).toHaveLength(0);
      expect(status.elapsed.story_seconds).toBe(0);
    });
  });

  describe('complete', () => {
    it('should set orchestration.active to false', async () => {
      await writer.initialize();
      await writer.complete();

      const status = await fs.readJson(writer.statusPath);
      expect(status.orchestration.active).toBe(false);
    });
  });

  describe('getStatus', () => {
    it('should return copy of current status', async () => {
      await writer.initialize();
      const status = writer.getStatus();

      expect(status.version).toBe(BOB_STATUS_VERSION);
      expect(status).not.toBe(writer._status); // Should be a copy
    });
  });

  describe('readStatus', () => {
    it('should read status from file', async () => {
      await writer.initialize();
      await writer.updatePhase('development');

      const status = await writer.readStatus();
      expect(status.pipeline.current_stage).toBe('development');
    });

    it('should return null if file does not exist', async () => {
      const status = await writer.readStatus();
      expect(status).toBeNull();
    });
  });
});

describe('BOB_STATUS_SCHEMA', () => {
  it('should have correct version', () => {
    expect(BOB_STATUS_SCHEMA.version).toBe(BOB_STATUS_VERSION);
  });

  it('should have correct stages', () => {
    expect(BOB_STATUS_SCHEMA.stages).toEqual(DEFAULT_PIPELINE_STAGES);
  });

  it('should have createDefault function', () => {
    const defaultStatus = BOB_STATUS_SCHEMA.createDefault();
    expect(defaultStatus.version).toBe(BOB_STATUS_VERSION);
    expect(defaultStatus.pipeline.stages).toEqual(DEFAULT_PIPELINE_STAGES);
  });
});

describe('createDefaultBobStatus', () => {
  it('should create valid default status', () => {
    const status = createDefaultBobStatus();

    expect(status.version).toBe(BOB_STATUS_VERSION);
    expect(status.orchestration.active).toBe(false);
    expect(status.orchestration.mode).toBe('bob');
    expect(status.pipeline.stages).toEqual(DEFAULT_PIPELINE_STAGES);
    expect(status.pipeline.current_stage).toBeNull();
    expect(status.current_agent.id).toBeNull();
    expect(status.active_terminals).toEqual([]);
    expect(status.surface_decisions).toEqual([]);
    expect(status.errors).toEqual([]);
    expect(status.educational.enabled).toBe(false);
  });
});

describe('Edge Cases', () => {
  let tempDir;
  let writer;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bob-status-edge-'));
    getDashboardEmitter.mockReturnValue({ emit: jest.fn().mockResolvedValue(undefined) });
    writer = new BobStatusWriter(tempDir, { debug: false });
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    jest.clearAllMocks();
  });

  it('should handle concurrent writes gracefully', async () => {
    await writer.initialize();

    // True concurrent writes — all queued simultaneously
    await Promise.all(
      Array.from({ length: 5 }, (_, i) => writer.updatePhase(`phase_${i}`)),
    );

    // File should still be valid JSON after all concurrent writes settle
    const status = await fs.readJson(writer.statusPath);
    expect(status.version).toBe(BOB_STATUS_VERSION);
  });

  it('should handle missing dashboard directory', async () => {
    // Don't initialize, just try to write
    const status = createDefaultBobStatus();
    await writer.writeBobStatus(status);

    // Should create directory and file
    const exists = await fs.pathExists(writer.statusPath);
    expect(exists).toBe(true);
  });

  it('should handle partial status updates', async () => {
    await writer.initialize();

    // Update only phase, agent should remain null
    await writer.updatePhase('development');

    const status = await fs.readJson(writer.statusPath);
    expect(status.pipeline.current_stage).toBe('development');
    expect(status.current_agent.id).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC-1 Gap Tests: dir creation failure + concurrent serialization
// ─────────────────────────────────────────────────────────────────────────────
describe('AC-1: dir creation failure throws', () => {
  let tempDir;
  let writer;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bob-ac1-'));
    getDashboardEmitter.mockReturnValue({ emit: jest.fn().mockResolvedValue(undefined) });
    writer = new BobStatusWriter(tempDir, { debug: false });
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    jest.clearAllMocks();
  });

  it('should throw a descriptive Error when ensureDir fails', async () => {
    jest.spyOn(fs, 'ensureDir').mockRejectedValueOnce(new Error('EACCES: permission denied'));

    const status = createDefaultBobStatus();
    await expect(writer.writeBobStatus(status)).rejects.toThrow(
      /failed to create dashboard directory/,
    );
  });

  it('should not write a partial file when dir creation fails', async () => {
    jest.spyOn(fs, 'ensureDir').mockRejectedValueOnce(new Error('EACCES'));

    const status = createDefaultBobStatus();
    await expect(writer.writeBobStatus(status)).rejects.toThrow();

    const exists = await fs.pathExists(writer.statusPath);
    expect(exists).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC-2: Schema validation — TypeError on invalid input, no partial write
// ─────────────────────────────────────────────────────────────────────────────
describe('AC-2: schema validation', () => {
  let tempDir;
  let writer;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bob-ac2-'));
    getDashboardEmitter.mockReturnValue({ emit: jest.fn().mockResolvedValue(undefined) });
    writer = new BobStatusWriter(tempDir, { debug: false });
    await writer.initialize();
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    jest.clearAllMocks();
  });

  it('should throw TypeError when status is null', async () => {
    await expect(writer.writeBobStatus(null)).rejects.toThrow(TypeError);
  });

  it('should throw TypeError naming "version" when missing', async () => {
    const bad = createDefaultBobStatus();
    delete bad.version;
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(/version/);
  });

  it('should throw TypeError naming "orchestration" when missing', async () => {
    const bad = createDefaultBobStatus();
    delete bad.orchestration;
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(TypeError);
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(/orchestration/);
  });

  it('should throw TypeError naming "pipeline" when missing', async () => {
    const bad = createDefaultBobStatus();
    delete bad.pipeline;
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(TypeError);
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(/pipeline/);
  });

  it('should throw TypeError naming "current_agent" when missing', async () => {
    const bad = createDefaultBobStatus();
    delete bad.current_agent;
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(TypeError);
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(/current_agent/);
  });

  it('should throw TypeError naming "elapsed" when missing', async () => {
    const bad = createDefaultBobStatus();
    delete bad.elapsed;
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(TypeError);
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(/elapsed/);
  });

  it('should throw TypeError naming "educational" when missing', async () => {
    const bad = createDefaultBobStatus();
    delete bad.educational;
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(TypeError);
    await expect(writer.writeBobStatus(bad)).rejects.toThrow(/educational/);
  });

  it('should not write partial file when schema validation fails', async () => {
    // Capture last-written content
    const before = await fs.readJson(writer.statusPath);
    const bad = createDefaultBobStatus();
    delete bad.version;

    await expect(writer.writeBobStatus(bad)).rejects.toThrow(TypeError);

    // File must be unchanged (no partial write)
    const after = await fs.readJson(writer.statusPath);
    expect(after.version).toBe(before.version);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC-3: Dashboard event emission + emitter failure isolation
// ─────────────────────────────────────────────────────────────────────────────
describe('AC-3: dashboard event emission', () => {
  let tempDir;
  let writer;
  let mockEmit;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bob-ac3-'));
    mockEmit = jest.fn().mockResolvedValue(undefined);
    getDashboardEmitter.mockReturnValue({ emit: mockEmit });
    writer = new BobStatusWriter(tempDir, { debug: false });
    await writer.initialize();
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    jest.clearAllMocks();
  });

  it('should emit an event on each successful write', async () => {
    await writer.updatePhase('development');
    expect(mockEmit).toHaveBeenCalled();
  });

  it('should emit event with type BobEventTypes.STATUS_UPDATE', async () => {
    await writer.updatePhase('development');
    const [eventType] = mockEmit.mock.calls[mockEmit.mock.calls.length - 1];
    expect(eventType).toBe(BobEventTypes.STATUS_UPDATE);
  });

  it('should emit event payload containing the full written status', async () => {
    await writer.updatePhase('quality_gate');
    const [, payload] = mockEmit.mock.calls[mockEmit.mock.calls.length - 1];
    expect(payload.pipeline.current_stage).toBe('quality_gate');
    expect(payload.version).toBe(BOB_STATUS_VERSION);
  });

  it('should NOT propagate emitter failure to write() caller (AC-3)', async () => {
    mockEmit.mockRejectedValueOnce(new Error('Emitter exploded'));

    // write() must succeed despite emitter throwing
    await expect(writer.updatePhase('push')).resolves.not.toThrow();

    // File was still written successfully
    const status = await fs.readJson(writer.statusPath);
    expect(status.pipeline.current_stage).toBe('push');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC-4: ObservabilityPanel integration
// ─────────────────────────────────────────────────────────────────────────────
describe('AC-4: observability panel integration', () => {
  let tempDir;
  let mockPanel;
  let writer;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bob-ac4-'));
    getDashboardEmitter.mockReturnValue({ emit: jest.fn().mockResolvedValue(undefined) });
    mockPanel = {
      setPipelineStage: jest.fn(),
      setMode: jest.fn(),
    };
    writer = new BobStatusWriter(tempDir, { debug: false, panel: mockPanel });
    await writer.initialize();
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    jest.clearAllMocks();
  });

  it('should call setPipelineStage on each phase change', async () => {
    await writer.updatePhase('development');
    expect(mockPanel.setPipelineStage).toHaveBeenCalledWith('development', undefined);
  });

  it('should pass storyProgress to setPipelineStage when provided', async () => {
    await writer.updatePhase('development', '3/8');
    expect(mockPanel.setPipelineStage).toHaveBeenCalledWith('development', '3/8');
  });

  it('should set panel mode to MINIMAL when educational mode is OFF', async () => {
    await writer.updateEducational({ enabled: false });
    await writer.updatePhase('validation');
    expect(mockPanel.setMode).toHaveBeenCalledWith('minimal');
  });

  it('should set panel mode to DETAILED when educational mode is ON', async () => {
    await writer.updateEducational({ enabled: true });
    await writer.updatePhase('validation');
    expect(mockPanel.setMode).toHaveBeenCalledWith('detailed');
  });

  it('should not call panel methods when no panel is injected', async () => {
    const writerNoPanelTempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bob-nopanel-'));
    const writerNoPanel = new BobStatusWriter(writerNoPanelTempDir, { debug: false });
    await writerNoPanel.initialize();
    // Should not throw even without a panel
    await expect(writerNoPanel.updatePhase('development')).resolves.not.toThrow();
    await fs.remove(writerNoPanelTempDir);
  });
});
