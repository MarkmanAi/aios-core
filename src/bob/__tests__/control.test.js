'use strict';

jest.mock('../../../.aios-core/core/orchestration/lock-manager');
jest.mock('../../../.aios-core/core/orchestration/session-state');
jest.mock('../../../.aios-core/core/orchestration/bob-status-writer');
jest.mock('../../../.aios-core/core/orchestration/bob-orchestrator');
jest.mock('../../../.aios-core/infrastructure/scripts/project-status-loader', () => ({
  loadProjectStatus: jest.fn(),
}));
jest.mock('../commands/status', () => ({
  readBobStatus: jest.fn(),
  formatOutput: jest.fn().mockReturnValue(''),
}));
jest.mock('../utils/show-current-status', () => ({
  showCurrentStatus: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('ora');

// fs.promises.unlink spy — fs is a Node native module, unaffected by resetModules
const fs = require('fs');

let LockManager;
let SessionState;
let BobStatusWriter;
let BobOrchestrator;

let mockIsLocked;
let mockLoadSessionState;
let mockSetSessionOverride;
let mockReadStatus;
let mockWriteBobStatus;
let mockOrchestrate;
let mockHandleSessionResume;
let mockSpinner;

let mockShowCurrentStatus;

let runStop;
let runResume;

let consoleLogSpy;
let consoleErrorSpy;
let exitSpy;
let unlinkSpy;

const MOCK_SESSION_STATE = {
  session_state: {
    last_action: { phase: 'dev' },
    progress: { current_story: '13.10' },
  },
};

const MOCK_BOB_STATUS = {
  version: '1.0',
  orchestration: { active: true, current_story: '13.10' },
  pipeline: { current_stage: 'implementation', story_progress: '3/8' },
  current_agent: { id: '@dev', name: 'Dex', task: 'implementing' },
  elapsed: 120,
  educational: { enabled: false },
  timestamp: new Date().toISOString(),
};

beforeEach(() => {
  jest.resetModules();

  // Re-create all mock functions
  mockIsLocked = jest.fn().mockResolvedValue(false);
  mockLoadSessionState = jest.fn().mockResolvedValue(null);
  mockSetSessionOverride = jest.fn().mockResolvedValue({});
  mockReadStatus = jest.fn().mockResolvedValue(null);
  mockWriteBobStatus = jest.fn().mockResolvedValue(undefined);
  mockOrchestrate = jest.fn().mockResolvedValue({ success: true, action: 'story_executed' });
  mockHandleSessionResume = jest.fn().mockResolvedValue({ action: 'continue' });

  mockSpinner = {
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
  };

  // ora mock
  const oraMock = require('ora');
  oraMock.mockReturnValue(mockSpinner);

  // LockManager mock (default export)
  LockManager = require('../../../.aios-core/core/orchestration/lock-manager');
  LockManager.mockImplementation(() => ({ isLocked: mockIsLocked }));

  // SessionState mock — expose session.state via closure so it reflects loadSessionState result
  SessionState = require('../../../.aios-core/core/orchestration/session-state').SessionState;
  SessionState.mockImplementation(() => {
    let _state = null;
    return {
      get state() {
        return _state;
      },
      loadSessionState: jest.fn().mockImplementation(async () => {
        _state = await mockLoadSessionState();
        return _state;
      }),
      setSessionOverride: mockSetSessionOverride,
    };
  });

  // BobStatusWriter mock
  BobStatusWriter = require('../../../.aios-core/core/orchestration/bob-status-writer').BobStatusWriter;
  BobStatusWriter.mockImplementation(() => ({
    readStatus: mockReadStatus,
    writeBobStatus: mockWriteBobStatus,
  }));

  // BobOrchestrator mock
  BobOrchestrator = require('../../../.aios-core/core/orchestration/bob-orchestrator').BobOrchestrator;
  BobOrchestrator.mockImplementation(() => ({
    orchestrate: mockOrchestrate,
    handleSessionResume: mockHandleSessionResume,
  }));

  // project-status-loader default
  const psl = require('../../../.aios-core/infrastructure/scripts/project-status-loader');
  psl.loadProjectStatus.mockResolvedValue({ isGitRepo: true });

  // status module defaults
  const statusMod = require('../commands/status');
  statusMod.readBobStatus.mockReturnValue(null);
  statusMod.formatOutput.mockReturnValue('');

  // show-current-status util mock
  const scs = require('../utils/show-current-status');
  mockShowCurrentStatus = scs.showCurrentStatus;
  mockShowCurrentStatus.mockResolvedValue(undefined);

  // fs.promises.unlink spy (native module — not reset by resetModules)
  unlinkSpy = jest.spyOn(fs.promises, 'unlink').mockResolvedValue(undefined);

  // Load SUTs
  runStop = require('../commands/stop').runStop;
  runResume = require('../commands/resume').runResume;

  // Console and process spies
  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called');
  });
});

afterEach(() => {
  unlinkSpy.mockRestore();
  consoleLogSpy.mockRestore();
  consoleErrorSpy.mockRestore();
  exitSpy.mockRestore();
});

// ─── STOP COMMAND ─────────────────────────────────────────────────────────────

describe('stop command', () => {
  // ─── T3.3 — nothing running (AC-3) ──────────────────────────────────────

  describe('T3.3 — nothing running → friendly message, exit 0 (AC-3)', () => {
    it('prints nothing running message when Bob is not locked', async () => {
      mockIsLocked.mockResolvedValue(false);

      await runStop({ force: false });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Nothing is running'),
      );
    });

    it('does not call setSessionOverride when not running', async () => {
      mockIsLocked.mockResolvedValue(false);

      await runStop({ force: false });

      expect(mockSetSessionOverride).not.toHaveBeenCalled();
    });

    it('does not call process.exit when not running', async () => {
      mockIsLocked.mockResolvedValue(false);

      await runStop({ force: false });

      expect(exitSpy).not.toHaveBeenCalled();
    });
  });

  // ─── T3.1 — graceful stop (AC-1) ────────────────────────────────────────

  describe('T3.1 — graceful stop → stop_requested set (AC-1)', () => {
    beforeEach(() => {
      mockIsLocked.mockResolvedValue(true);
    });

    it('calls setSessionOverride("stop_requested", true) when session exists', async () => {
      mockLoadSessionState.mockResolvedValue(MOCK_SESSION_STATE);

      await runStop({ force: false });

      expect(mockSetSessionOverride).toHaveBeenCalledWith('stop_requested', true);
    });

    it('prints graceful stop message', async () => {
      mockLoadSessionState.mockResolvedValue(MOCK_SESSION_STATE);

      await runStop({ force: false });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Bob will stop after completing the current task'),
      );
    });

    it('skips setSessionOverride when session.state is null', async () => {
      mockLoadSessionState.mockResolvedValue(null);

      await runStop({ force: false });

      expect(mockSetSessionOverride).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Bob will stop after completing the current task'),
      );
    });
  });

  // ─── T3.2 — force stop (AC-2) ───────────────────────────────────────────

  describe('T3.2 — force stop → lock released + ABORTED written (AC-2)', () => {
    beforeEach(() => {
      mockIsLocked.mockResolvedValue(true);
    });

    it('calls fs.unlink on the lock file path', async () => {
      await runStop({ force: true });

      expect(unlinkSpy).toHaveBeenCalledWith(
        expect.stringContaining('bob-orchestration.lock'),
      );
    });

    it('writes ABORTED status when currentStatus exists', async () => {
      mockReadStatus.mockResolvedValue(MOCK_BOB_STATUS);

      await runStop({ force: true });

      expect(mockWriteBobStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          orchestration: expect.objectContaining({ active: false }),
          pipeline: expect.objectContaining({ current_stage: 'ABORTED' }),
        }),
      );
    });

    it('does not call writeBobStatus when currentStatus is null', async () => {
      mockReadStatus.mockResolvedValue(null);

      await runStop({ force: true });

      expect(mockWriteBobStatus).not.toHaveBeenCalled();
    });

    it('prints force stop message', async () => {
      await runStop({ force: true });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Bob stopped immediately'),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('aios bob resume'),
      );
    });

    it('continues gracefully when unlink throws (lock already gone)', async () => {
      unlinkSpy.mockRejectedValue(Object.assign(new Error('ENOENT'), { code: 'ENOENT' }));

      await expect(runStop({ force: true })).resolves.not.toThrow();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Bob stopped immediately'),
      );
    });
  });

  // ─── AC-6: status display ───────────────────────────────────────────────

  describe('AC-6 — status display before stop', () => {
    it('calls showCurrentStatus before performing stop', async () => {
      mockIsLocked.mockResolvedValue(false);

      await runStop({ force: false });

      expect(mockShowCurrentStatus).toHaveBeenCalled();
    });
  });
});

// ─── RESUME COMMAND ───────────────────────────────────────────────────────────

describe('resume command', () => {
  // ─── T3.5 — nothing to resume (AC-5) ───────────────────────────────────

  describe('T3.5 — no checkpoint → friendly message, exit 0 (AC-5)', () => {
    it('prints no session message when state is null', async () => {
      mockLoadSessionState.mockResolvedValue(null);

      await runResume();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('No session to resume'),
      );
    });

    it('does not call orchestrate when no session exists', async () => {
      mockLoadSessionState.mockResolvedValue(null);

      await runResume();

      expect(mockOrchestrate).not.toHaveBeenCalled();
    });

    it('does not exit with code 1 when no session', async () => {
      mockLoadSessionState.mockResolvedValue(null);

      await runResume();

      expect(exitSpy).not.toHaveBeenCalled();
    });
  });

  // ─── T3.4 — resume with checkpoint (AC-4) ─────────────────────────────

  describe('T3.4 — resume with checkpoint → orchestrator called (AC-4)', () => {
    beforeEach(() => {
      mockLoadSessionState.mockResolvedValue(MOCK_SESSION_STATE);
      mockOrchestrate.mockResolvedValue({ action: 'resume_prompt', success: true });
      mockHandleSessionResume.mockResolvedValue({ action: 'continue' });
    });

    it('calls orchestrate({}) when session exists', async () => {
      await runResume();

      expect(mockOrchestrate).toHaveBeenCalledWith({});
    });

    it('calls handleSessionResume("continue") on resume_prompt', async () => {
      await runResume();

      expect(mockHandleSessionResume).toHaveBeenCalledWith('continue');
    });

    it('prints "Resuming from:" message with checkpoint description', async () => {
      await runResume();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Resuming from:'),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('13.10'),
      );
    });

    it('prints "Bob here. Resumed." on successful continue', async () => {
      await runResume();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Bob here. Resumed.'),
      );
    });

    it('spinner stops after orchestrate completes', async () => {
      await runResume();

      expect(mockSpinner.stop).toHaveBeenCalled();
    });

    it('prints non-continue resume result message', async () => {
      mockHandleSessionResume.mockResolvedValue({ action: 'review' });

      await runResume();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Resume result: review'),
      );
    });
  });

  // ─── orchestrate returns success directly (no resume_prompt) ──────────

  describe('orchestrate returns success directly', () => {
    it('prints "Bob here. Done." when orchestrate succeeds without resume_prompt', async () => {
      mockLoadSessionState.mockResolvedValue(MOCK_SESSION_STATE);
      mockOrchestrate.mockResolvedValue({ success: true, action: 'story_executed' });

      await runResume();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Bob here. Done.'),
      );
    });
  });

  // ─── orchestrate returns failure ───────────────────────────────────────

  describe('orchestrate returns failure', () => {
    it('prints error and exits 1 when result.success is false', async () => {
      mockLoadSessionState.mockResolvedValue(MOCK_SESSION_STATE);
      mockOrchestrate.mockResolvedValue({ success: false, action: 'error', error: 'resume failed' });

      await expect(runResume()).rejects.toThrow('process.exit called');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('resume failed'),
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  // ─── error handling ────────────────────────────────────────────────────

  describe('error handling', () => {
    it('calls spinner.fail and exits 1 when orchestrate throws', async () => {
      mockLoadSessionState.mockResolvedValue(MOCK_SESSION_STATE);
      mockOrchestrate.mockRejectedValue(new Error('orchestrator crash'));

      await expect(runResume()).rejects.toThrow('process.exit called');

      expect(mockSpinner.fail).toHaveBeenCalledWith(
        expect.stringContaining('orchestrator crash'),
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  // ─── AC-6: status display ───────────────────────────────────────────────

  describe('AC-6 — status display before resume', () => {
    it('calls showCurrentStatus before performing resume', async () => {
      mockLoadSessionState.mockResolvedValue(null);

      await runResume();

      expect(mockShowCurrentStatus).toHaveBeenCalled();
    });
  });

  // ─── partial session state (Fix 2 — null guards) ──────────────────────

  describe('partial session state — null guards on last_action/progress', () => {
    it('handles partial session state gracefully', async () => {
      mockLoadSessionState.mockResolvedValue({ session_state: {} });
      mockOrchestrate.mockResolvedValue({ action: 'resume_prompt', success: true });
      mockHandleSessionResume.mockResolvedValue({ action: 'continue' });

      await runResume();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Resuming from: Story unknown — phase: start'),
      );
    });
  });
});
