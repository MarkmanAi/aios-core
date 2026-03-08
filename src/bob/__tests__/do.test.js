'use strict';

jest.mock('../../../.aios-core/core/orchestration/bob-orchestrator');
jest.mock('ora');
jest.mock('inquirer');

let BobOrchestrator;
let ora;
let inquirer;
let runBobDo;
let printCompletionSummary;
let showDelegationMessage;

let mockOrchestrate;
let mockDetectProjectState;
let mockHandleSessionResume;
let mockHandleEducationalModeToggle;
let mockSpinner;
let consoleLogSpy;
let consoleErrorSpy;
let exitSpy;

beforeEach(() => {
  jest.resetModules();

  // Mock spinner
  mockSpinner = {
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
  };

  ora = require('ora');
  ora.mockReturnValue(mockSpinner);

  // Mock BobOrchestrator methods
  mockOrchestrate = jest.fn();
  mockDetectProjectState = jest.fn().mockReturnValue('EXISTING_WITH_DOCS');
  mockHandleSessionResume = jest.fn();
  mockHandleEducationalModeToggle = jest.fn();

  BobOrchestrator = require('../../../.aios-core/core/orchestration/bob-orchestrator').BobOrchestrator;
  BobOrchestrator.mockImplementation(() => ({
    orchestrate: mockOrchestrate,
    detectProjectState: mockDetectProjectState,
    handleSessionResume: mockHandleSessionResume,
    handleEducationalModeToggle: mockHandleEducationalModeToggle,
  }));

  inquirer = require('inquirer');
  inquirer.prompt = jest.fn();

  const doModule = require('../commands/do');
  runBobDo = doModule.runBobDo;
  printCompletionSummary = doModule.printCompletionSummary;
  showDelegationMessage = doModule.showDelegationMessage;

  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called');
  });
});

afterEach(() => {
  consoleLogSpy.mockRestore();
  consoleErrorSpy.mockRestore();
  exitSpy.mockRestore();
});

// ─── T2.1: routing call ────────────────────────────────────────────────────

describe('T2.1 — routing call', () => {
  it('calls orchestrate({ userGoal: input }) with correct shape', async () => {
    mockOrchestrate.mockResolvedValue({ success: true, action: 'story_executed' });

    await runBobDo('implement login', { dryRun: false });

    expect(mockOrchestrate).toHaveBeenCalledWith({ userGoal: 'implement login' });
  });
});

// ─── T2.2: spinner lifecycle on success ───────────────────────────────────

describe('T2.2 — spinner starts and stops on story_executed success', () => {
  it('starts spinner then stops it', async () => {
    mockOrchestrate.mockResolvedValue({ success: true, action: 'story_executed' });

    await runBobDo('do something', { dryRun: false });

    expect(mockSpinner.start).toHaveBeenCalled();
    expect(mockSpinner.stop).toHaveBeenCalled();
  });
});

// ─── T2.3: spinner stops on error ─────────────────────────────────────────

describe('T2.3 — spinner stops on error', () => {
  it('calls spinner.fail when orchestrate throws', async () => {
    mockOrchestrate.mockRejectedValue(new Error('boom'));

    await expect(runBobDo('do something', { dryRun: false })).rejects.toThrow('process.exit called');

    expect(mockSpinner.fail).toHaveBeenCalledWith(expect.stringContaining('boom'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

// ─── T2.4: lock_failed ────────────────────────────────────────────────────

describe('T2.4 — lock_failed → error message + exit 1', () => {
  it('prints error and exits 1 on lock_failed', async () => {
    mockOrchestrate.mockResolvedValue({ success: false, action: 'lock_failed', error: 'locked' });

    await expect(runBobDo('do something', { dryRun: false })).rejects.toThrow('process.exit called');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Bob is already running'),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

// ─── T2.5: onboarding ─────────────────────────────────────────────────────

describe('T2.5 — onboarding → install message', () => {
  it('prints aios-install instruction', async () => {
    mockOrchestrate.mockResolvedValue({ success: true, action: 'onboarding' });

    await runBobDo('do something', { dryRun: false });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('npx @synkra/aios-install'),
    );
  });
});

// ─── T2.6: dry-run ────────────────────────────────────────────────────────

describe('T2.6 — dry-run', () => {
  it('calls detectProjectState and NOT orchestrate', async () => {
    await runBobDo('do something', { dryRun: true });

    expect(mockDetectProjectState).toHaveBeenCalled();
    expect(mockOrchestrate).not.toHaveBeenCalled();
  });

  it('prints [DRY-RUN] output', async () => {
    mockDetectProjectState.mockReturnValue('EXISTING_WITH_DOCS');

    await runBobDo('do something', { dryRun: true });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('[DRY-RUN]'),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('EXISTING_WITH_DOCS'),
    );
  });

  it('stops spinner in dry-run path', async () => {
    await runBobDo('do something', { dryRun: true });

    expect(mockSpinner.stop).toHaveBeenCalled();
  });

  it('calls spinner.fail and exits 1 when detectProjectState throws', async () => {
    mockDetectProjectState.mockImplementation(() => {
      throw new Error('bad root');
    });

    await expect(runBobDo('do something', { dryRun: true })).rejects.toThrow('process.exit called');

    expect(mockSpinner.fail).toHaveBeenCalledWith(expect.stringContaining('bad root'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

// ─── T2.7: missing request ────────────────────────────────────────────────

describe('T2.7 — missing request → usage error + exit 1', () => {
  it('exits with usage error when no request given', async () => {
    const doModule = require('../commands/do');
    const { Command } = require('commander');
    const testProg = new Command();
    testProg.exitOverride();
    testProg.addCommand(doModule);

    // Pass only the subcommand name — [request] is optional so action fires with request=undefined
    await expect(
      testProg.parseAsync(['do'], { from: 'user' }),
    ).rejects.toThrow();

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Usage: aios bob do'),
    );
  });
});

// ─── T2.8: resume_prompt ──────────────────────────────────────────────────

describe('T2.8 — resume_prompt → inquirer prompt + handleSessionResume called', () => {
  it('shows resume options and calls handleSessionResume', async () => {
    mockOrchestrate.mockResolvedValue({
      success: true,
      action: 'resume_prompt',
      data: {
        formattedMessage: 'Resume session?',
        resumeOptions: ['continue', 'review', 'restart', 'discard'],
      },
    });
    mockHandleSessionResume.mockResolvedValue({ success: true, action: 'story_executed' });
    inquirer.prompt.mockResolvedValue({ option: 'continue' });

    await runBobDo('do something', { dryRun: false });

    expect(inquirer.prompt).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          choices: expect.arrayContaining(['continue', 'review', 'restart', 'discard']),
        }),
      ]),
    );
    expect(mockHandleSessionResume).toHaveBeenCalledWith('continue');
  });
});

// ─── T2.9: completion summary ─────────────────────────────────────────────

describe('T2.9 — completion summary format on success', () => {
  it('prints Bob voice summary', async () => {
    mockOrchestrate.mockResolvedValue({ success: true, action: 'story_executed' });

    await runBobDo('do something', { dryRun: false });

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Bob here. Done.'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('aios bob status'));
  });

  it('prints error message when result.success is false', () => {
    printCompletionSummary({ success: false, error: 'something failed' });
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('something failed'));
  });
});

// ─── T2.10: educational_mode_toggle ───────────────────────────────────────

describe('T2.10 — educational_mode_toggle → inquirer prompt + handleEducationalModeToggle called', () => {
  it('shows persistence prompt and calls handleEducationalModeToggle with enable=true + session', async () => {
    mockOrchestrate.mockResolvedValue({
      success: true,
      action: 'educational_mode_toggle',
      data: {
        enable: true,
        command: 'bob explain',
        persistencePrompt: 'Save this preference?',
      },
    });
    mockHandleEducationalModeToggle.mockResolvedValue({ success: true });
    inquirer.prompt.mockResolvedValue({ persistence: 'session' });

    await runBobDo('bob explain', { dryRun: false });

    expect(inquirer.prompt).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          choices: expect.arrayContaining(['session', 'permanent']),
        }),
      ]),
    );
    expect(mockHandleEducationalModeToggle).toHaveBeenCalledWith(true, 'session');
  });

  it('calls handleEducationalModeToggle with enable=false + permanent', async () => {
    mockOrchestrate.mockResolvedValue({
      success: true,
      action: 'educational_mode_toggle',
      data: {
        enable: false,
        command: 'bob explain off',
        persistencePrompt: 'Save this preference?',
      },
    });
    mockHandleEducationalModeToggle.mockResolvedValue({ success: true });
    inquirer.prompt.mockResolvedValue({ persistence: 'permanent' });

    await runBobDo('bob explain off', { dryRun: false });

    expect(mockHandleEducationalModeToggle).toHaveBeenCalledWith(false, 'permanent');
  });
});

// ─── T2.11: ask_objective ─────────────────────────────────────────────────

describe('T2.11 — ask_objective → inquirer prompt with 4 options', () => {
  it('shows 4 objective options and prints selection', async () => {
    mockOrchestrate.mockResolvedValue({
      success: true,
      action: 'ask_objective',
      data: { options: ['feature', 'bug', 'refactor', 'debt'] },
    });
    inquirer.prompt.mockResolvedValue({ objective: 'feature' });

    await runBobDo('do something', { dryRun: false });

    expect(inquirer.prompt).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'objective',
          choices: expect.arrayContaining(['feature', 'bug', 'refactor', 'debt']),
        }),
      ]),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('feature'));
  });
});

// ─── default (unknown action, failure) ───────────────────────────────────

describe('default action — unknown action with success=false', () => {
  it('prints error and exits 1', async () => {
    mockOrchestrate.mockResolvedValue({
      success: false,
      action: 'unknown_action',
      error: 'something unknown',
    });

    await expect(runBobDo('do something', { dryRun: false })).rejects.toThrow('process.exit called');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('something unknown'),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('prints completion summary when default action succeeds (line 130)', async () => {
    mockOrchestrate.mockResolvedValue({
      success: true,
      action: 'some_other_action',
    });

    await runBobDo('do something', { dryRun: false });

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Bob here. Done.'));
  });
});

// ─── --request flag alias ─────────────────────────────────────────────────

describe('--request flag alias (AC-1)', () => {
  it('accepts request via --request flag through action handler', async () => {
    mockOrchestrate.mockResolvedValue({ success: true, action: 'story_executed' });

    const doModule = require('../commands/do');
    const { Command } = require('commander');
    const testProg = new Command();
    testProg.exitOverride();
    testProg.addCommand(doModule);

    // Pass --request flag instead of positional argument
    await testProg.parseAsync(['do', '--request', 'implement login'], { from: 'user' });

    expect(mockOrchestrate).toHaveBeenCalledWith({ userGoal: 'implement login' });
  });
});

// ─── showDelegationMessage ────────────────────────────────────────────────

describe('showDelegationMessage', () => {
  it('prints delegation message when agentName and agentId present', () => {
    showDelegationMessage({
      data: { agentName: 'Dex', agentId: '@dev' },
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Bob delegated to Dex (@dev)'),
    );
  });

  it('prints nothing when data is missing', () => {
    showDelegationMessage({ data: null });
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
