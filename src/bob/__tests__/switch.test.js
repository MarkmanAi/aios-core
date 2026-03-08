'use strict';

jest.mock('../../../.aios-core/core/config/config-resolver', () => ({
  setUserConfigValue: jest.fn(),
}));
jest.mock('@clack/prompts', () => ({
  confirm: jest.fn(),
}));

let setUserConfigValue;
let confirm;
let runSwitch;
let consoleLogSpy;
let consoleErrorSpy;
let exitSpy;

beforeEach(() => {
  jest.resetModules();

  setUserConfigValue = require('../../../.aios-core/core/config/config-resolver').setUserConfigValue;
  confirm = require('@clack/prompts').confirm;
  runSwitch = require('../commands/switch').runSwitch;

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

// ─── T2.1: explanation is always printed first ─────────────────────────────

describe('T2.1 — explanation is always printed first', () => {
  it('includes agent names in explanation', async () => {
    confirm.mockResolvedValue(false);

    await runSwitch({});

    const allLogs = consoleLogSpy.mock.calls.map((c) => c[0]).join(' ');
    expect(allLogs).toContain('@dev');
    expect(allLogs).toContain('@qa');
    expect(allLogs).toContain('@architect');
  });

  it('references dynamic agent count in explanation', async () => {
    confirm.mockResolvedValue(false);
    const { getAgentCount } = require('../commands/switch');

    await runSwitch({});

    const allLogs = consoleLogSpy.mock.calls.map((c) => c[0]).join(' ');
    expect(allLogs).toContain(String(getAgentCount()));
  });

  it('mentions full command palette in explanation', async () => {
    confirm.mockResolvedValue(false);

    await runSwitch({});

    const allLogs = consoleLogSpy.mock.calls.map((c) => c[0]).join(' ');
    expect(allLogs).toContain('command palette');
  });
});

// ─── T2.2: user confirms → setUserConfigValue called with 'advanced' ──────

describe('T2.2 — user confirms → setUserConfigValue called with advanced', () => {
  it('calls setUserConfigValue with user_profile=advanced on confirm', async () => {
    confirm.mockResolvedValue(true);

    await runSwitch({});

    expect(setUserConfigValue).toHaveBeenCalledWith('user_profile', 'advanced');
    expect(setUserConfigValue).toHaveBeenCalledTimes(1);
  });

  it('prints success message on confirm', async () => {
    confirm.mockResolvedValue(true);

    await runSwitch({});

    const allLogs = consoleLogSpy.mock.calls.map((c) => c[0]).join(' ');
    expect(allLogs).toContain('Done.');
    expect(allLogs).toContain('@dev');
  });
});

// ─── T2.3: user cancels (false) → setUserConfigValue NOT called ───────────

describe('T2.3 — user cancels (false) → setUserConfigValue NOT called', () => {
  it('does not call setUserConfigValue on cancel', async () => {
    confirm.mockResolvedValue(false);

    await runSwitch({});

    expect(setUserConfigValue).not.toHaveBeenCalled();
  });

  it('prints cancel message on cancel', async () => {
    confirm.mockResolvedValue(false);

    await runSwitch({});

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'No changes made. Bob is still your interface.',
    );
  });
});

// ─── T2.4: Ctrl+C (symbol) → treated as cancel ────────────────────────────

describe('T2.4 — Ctrl+C (symbol) → treated as cancel', () => {
  it('does not call setUserConfigValue when confirm returns a symbol', async () => {
    confirm.mockResolvedValue(Symbol('cancel'));

    await runSwitch({});

    expect(setUserConfigValue).not.toHaveBeenCalled();
  });

  it('prints cancel message when confirm returns a symbol', async () => {
    confirm.mockResolvedValue(Symbol('cancel'));

    await runSwitch({});

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'No changes made. Bob is still your interface.',
    );
  });
});

// ─── T2.5: --yes flag → no confirm, setUserConfigValue called ────────────

describe('T2.5 — --yes flag → skips confirm, setUserConfigValue called directly', () => {
  it('does not call confirm when --yes is set', async () => {
    await runSwitch({ yes: true });

    expect(confirm).not.toHaveBeenCalled();
  });

  it('calls setUserConfigValue with user_profile=advanced directly with --yes', async () => {
    await runSwitch({ yes: true });

    expect(setUserConfigValue).toHaveBeenCalledWith('user_profile', 'advanced');
    expect(setUserConfigValue).toHaveBeenCalledTimes(1);
  });
});

// ─── T2.6: --yes still prints explanation ─────────────────────────────────

describe('T2.6 — --yes still prints explanation before switching', () => {
  it('prints explanation even with --yes flag', async () => {
    await runSwitch({ yes: true });

    const allLogs = consoleLogSpy.mock.calls.map((c) => c[0]).join(' ');
    expect(allLogs).toContain('11');
    expect(allLogs).toContain('command palette');
  });
});

// ─── T2.7: exit code 0 on cancel — process.exit NOT called ───────────────

describe('T2.7 — exit code 0 on cancel — process.exit NOT called', () => {
  it('does not call process.exit on false cancel', async () => {
    confirm.mockResolvedValue(false);

    await runSwitch({});

    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('does not call process.exit on symbol cancel', async () => {
    confirm.mockResolvedValue(Symbol('cancel'));

    await runSwitch({});

    expect(exitSpy).not.toHaveBeenCalled();
  });
});

// ─── T2.9: confirm rejection → error handler catches it ───────────────────

describe('T2.9 — confirm rejection → error handler catches it', () => {
  it('catches confirm rejection and exits with 1', async () => {
    const switchModule = require('../commands/switch');
    const { Command } = require('commander');
    const testProg = new Command();
    testProg.exitOverride();
    testProg.addCommand(switchModule);

    confirm.mockRejectedValue(new Error('prompt error'));

    await expect(
      testProg.parseAsync(['switch'], { from: 'user' }),
    ).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Bob switch error:'),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

// ─── T2.8: .action() outer error handler ──────────────────────────────────

describe('T2.8 — .action() outer error handler catches unexpected throws', () => {
  it('catches unexpected error from runSwitch and exits with 1', async () => {
    setUserConfigValue.mockImplementation(() => {
      throw new Error('unexpected config error');
    });

    const switchModule = require('../commands/switch');
    const { Command } = require('commander');
    const testProg = new Command();
    testProg.exitOverride();
    testProg.addCommand(switchModule);

    await expect(
      testProg.parseAsync(['switch', '--yes'], { from: 'user' }),
    ).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Bob switch error:'),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
