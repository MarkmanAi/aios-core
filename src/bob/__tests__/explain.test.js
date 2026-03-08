'use strict';

jest.mock('../../../.aios-core/core/config/config-resolver', () => ({
  setUserConfigValue: jest.fn(),
  getConfigAtLevel: jest.fn(),
}));
jest.mock('../../../.aios-core/core/orchestration/session-state');

let setUserConfigValue;
let getConfigAtLevel;
let SessionState;
let runExplain;

let mockLoadSessionState;
let mockSetSessionOverride;
let consoleLogSpy;
let consoleErrorSpy;
let exitSpy;

beforeEach(() => {
  jest.resetModules();

  const configResolver = require('../../../.aios-core/core/config/config-resolver');
  setUserConfigValue = configResolver.setUserConfigValue;
  getConfigAtLevel = configResolver.getConfigAtLevel;

  mockLoadSessionState = jest.fn().mockResolvedValue(null);
  mockSetSessionOverride = jest.fn().mockResolvedValue({});

  SessionState = require('../../../.aios-core/core/orchestration/session-state').SessionState;
  SessionState.mockImplementation(() => ({
    loadSessionState: mockLoadSessionState,
    setSessionOverride: mockSetSessionOverride,
  }));

  runExplain = require('../commands/explain').runExplain;

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

// ─── T2.1: explain on → setUserConfigValue(true) ──────────────────────────

describe('T2.1 — explain on → setUserConfigValue called with true', () => {
  it('writes educational_mode: true to user config', async () => {
    await runExplain('on');

    expect(setUserConfigValue).toHaveBeenCalledWith('educational_mode', true);
  });

  it('prints ON confirmation message', async () => {
    await runExplain('on');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Educational mode: ON'),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('explain his reasoning step-by-step'),
    );
  });
});

// ─── T2.2: explain off → setUserConfigValue(false) ────────────────────────

describe('T2.2 — explain off → setUserConfigValue called with false', () => {
  it('writes educational_mode: false to user config', async () => {
    await runExplain('off');

    expect(setUserConfigValue).toHaveBeenCalledWith('educational_mode', false);
  });

  it('prints OFF confirmation message', async () => {
    await runExplain('off');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Educational mode: OFF'),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('more concise'),
    );
  });
});

// ─── T2.3: no arg, ON ─────────────────────────────────────────────────────

describe('T2.3 — explain no arg, educational_mode: true → prints ON', () => {
  it('reads config and prints Educational mode: ON', async () => {
    getConfigAtLevel.mockReturnValue({ educational_mode: true });

    await runExplain(undefined);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Educational mode:'),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('ON'),
    );
  });
});

// ─── T2.4: no arg, absent key → OFF ───────────────────────────────────────

describe('T2.4 — explain no arg, absent key → defaults to OFF', () => {
  it('prints Educational mode: OFF when educational_mode key is absent', async () => {
    getConfigAtLevel.mockReturnValue({});

    await runExplain(undefined);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('OFF'),
    );
  });
});

// ─── T2.5: no arg, getConfigAtLevel returns null → OFF ────────────────────

describe('T2.5 — explain no arg, getConfigAtLevel returns null → defaults to OFF', () => {
  it('guards null return and prints Educational mode: OFF', async () => {
    getConfigAtLevel.mockReturnValue(null);

    await runExplain(undefined);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('OFF'),
    );
  });
});

// ─── T2.6: invalid arg → exit 1 ───────────────────────────────────────────

describe('T2.6 — invalid arg → process.exit(1)', () => {
  it('prints usage and exits with code 1', async () => {
    await expect(runExplain('maybe')).rejects.toThrow('process.exit called');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Usage: aios bob explain [on|off]'),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('exits with code 1 for any other invalid arg', async () => {
    await expect(runExplain('yes')).rejects.toThrow('process.exit called');

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

// ─── T2.7: active session → setSessionOverride called ─────────────────────

describe('T2.7 — active session → setSessionOverride called', () => {
  it('calls setSessionOverride with true when session exists and explain on', async () => {
    mockLoadSessionState.mockResolvedValue({ active: true });

    await runExplain('on');

    expect(mockSetSessionOverride).toHaveBeenCalledWith('educational_mode', true);
  });

  it('calls setSessionOverride with false when session exists and explain off', async () => {
    mockLoadSessionState.mockResolvedValue({ active: true });

    await runExplain('off');

    expect(mockSetSessionOverride).toHaveBeenCalledWith('educational_mode', false);
  });
});

// ─── T2.8: no session → setSessionOverride NOT called ─────────────────────

describe('T2.8 — no session → setSessionOverride NOT called', () => {
  it('skips setSessionOverride when loadSessionState returns null', async () => {
    mockLoadSessionState.mockResolvedValue(null);

    await runExplain('on');

    expect(mockSetSessionOverride).not.toHaveBeenCalled();
  });

  it('skips setSessionOverride for explain off when no session', async () => {
    mockLoadSessionState.mockResolvedValue(null);

    await runExplain('off');

    expect(mockSetSessionOverride).not.toHaveBeenCalled();
  });
});
