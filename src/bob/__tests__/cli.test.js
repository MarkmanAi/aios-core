'use strict';

const path = require('path');

// Auto-hoisted mock — must be at top level
jest.mock('fs');

// fs is re-assigned in beforeEach after resetModules so the mock instance
// matches what cli.js receives after its own require('fs').
let fs;
let consoleErrorSpy;
let exitSpy;

beforeEach(() => {
  jest.resetModules();
  // Re-require after resetModules so this reference matches what cli.js gets
  fs = require('fs');
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called');
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

// --- requireAiosInstalled ---

describe('requireAiosInstalled', () => {
  it('exits with code 1 when .aios-core/ is missing', () => {
    fs.existsSync.mockReturnValue(false);
    const { requireAiosInstalled } = require('../cli');

    expect(() => requireAiosInstalled()).toThrow('process.exit called');
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Bob requires AIOS to be installed. Run: npx @synkra/aios-install',
    );
  });

  it('does not exit when .aios-core/ exists', () => {
    fs.existsSync.mockReturnValue(true);
    const { requireAiosInstalled } = require('../cli');

    expect(() => requireAiosInstalled()).not.toThrow();
    expect(exitSpy).not.toHaveBeenCalled();
  });
});

// --- createBobCommand ---

describe('createBobCommand', () => {
  beforeEach(() => {
    // Default: .aios-core/ exists so the guard passes
    fs.existsSync.mockReturnValue(true);
  });

  it('returns a Command named "bob"', () => {
    const { createBobCommand } = require('../cli');
    const cmd = createBobCommand();
    expect(cmd.name()).toBe('bob');
  });

  it('registers all 6 expected subcommands', () => {
    const { createBobCommand } = require('../cli');
    const cmd = createBobCommand();
    const subNames = cmd.commands.map((c) => c.name());
    expect(subNames).toContain('status');
    expect(subNames).toContain('do');
    expect(subNames).toContain('stop');
    expect(subNames).toContain('resume');
    expect(subNames).toContain('explain');
    expect(subNames).toContain('switch');
  });

  it('has a description', () => {
    const { createBobCommand } = require('../cli');
    const cmd = createBobCommand();
    expect(cmd.description()).toBeTruthy();
  });

  it('has --force-bob option', () => {
    const { createBobCommand } = require('../cli');
    const cmd = createBobCommand();
    const optionNames = cmd.options.map((o) => o.long);
    expect(optionNames).toContain('--force-bob');
  });

  it('includes usage example in help text', () => {
    const { createBobCommand } = require('../cli');
    const cmd = createBobCommand();

    let helpText = '';
    cmd.configureOutput({
      writeOut: (str) => {
        helpText += str;
      },
    });
    cmd.outputHelp();

    expect(helpText).toContain('aios bob do "implement login feature"');
  });
});

// --- aios bob with no subcommand shows help ---

describe('createBobCommand — no subcommand', () => {
  it('calls help() when invoked with no subcommand', async () => {
    fs.existsSync.mockReturnValue(true);
    const { createBobCommand } = require('../cli');
    const cmd = createBobCommand();

    const helpSpy = jest.spyOn(cmd, 'help').mockImplementation(() => {});

    // Simulate: aios bob (no subcommand, no args)
    await cmd.parseAsync(['node', 'aios']);

    expect(helpSpy).toHaveBeenCalled();
  });
});

// --- bin/aios.js routing ---

describe('bin/aios.js routing', () => {
  it('loads src/bob/cli.js for the "bob" case', () => {
    fs.existsSync.mockReturnValue(true);
    const cliPath = path.resolve(__dirname, '../cli.js');
    expect(() => require(cliPath)).not.toThrow();
  });
});
