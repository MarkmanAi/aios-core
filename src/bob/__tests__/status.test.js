'use strict';

jest.mock('fs');
jest.mock('../../../.aios-core/infrastructure/scripts/project-status-loader');

let fs;
let loadProjectStatus;
let statusCommand;
let formatOutput;
let timeAgo;
let readBobStatus;
let consoleLogSpy;
let consoleErrorSpy;
let exitSpy;

const BASE_PROJECT_STATUS = {
  branch: 'main',
  modifiedFiles: [],
  recentCommits: [],
  currentEpic: '13',
  currentStory: '13.7',
  lastUpdate: new Date().toISOString(),
  isGitRepo: true,
};

const makeTimestamp = (minsAgo = 3) =>
  new Date(Date.now() - minsAgo * 60000).toISOString();

const BASE_BOB_STATUS = {
  version: '1.0',
  timestamp: makeTimestamp(3),
  orchestration: {
    active: true,
    mode: 'bob',
    epic_id: '13',
    current_story: '13.7',
  },
  pipeline: {
    stages: ['validation', 'development'],
    current_stage: 'development',
    story_progress: '3/7',
    completed_stages: ['validation'],
  },
  current_agent: {
    id: '@dev',
    name: 'Dex',
    task: 'T2.1 — register subcommands',
    reason: null,
    started_at: new Date().toISOString(),
  },
  elapsed: { story_seconds: 180, session_seconds: 180 },
  educational: { enabled: false, tradeoffs: [], reasoning: [] },
  errors: [],
};

beforeEach(() => {
  jest.resetModules();
  fs = require('fs');
  ({ loadProjectStatus } = require('../../../.aios-core/infrastructure/scripts/project-status-loader'));
  statusCommand = require('../commands/status');
  ({ formatOutput, timeAgo, readBobStatus } = statusCommand);
  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called');
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

// --- T2.1: active story + agent → full output (AC-1, AC-2, AC-3) ---

describe('T2.1 — active story and agent', () => {
  it('outputs Bob greeting, project, story, agent and activity', () => {
    const output = formatOutput(BASE_PROJECT_STATUS, BASE_BOB_STATUS);
    expect(output).toContain("Bob here. Here's where we are:");
    expect(output).toContain('Story:    13.7');
    expect(output).toContain('Dex is working on T2.1 — register subcommands');
    expect(output).toContain('Activity:');
  });

  it('uses friendly name from bobStatus.current_agent.name (AC-3)', () => {
    const output = formatOutput(BASE_PROJECT_STATUS, BASE_BOB_STATUS);
    expect(output).toContain('Dex');
    expect(output).not.toContain('@dev is working');
  });

  it('falls back to AGENT_NAMES map when current_agent.name is null', () => {
    const bobStatus = {
      ...BASE_BOB_STATUS,
      current_agent: { ...BASE_BOB_STATUS.current_agent, name: null },
    };
    const output = formatOutput(BASE_PROJECT_STATUS, bobStatus);
    expect(output).toContain('Dex');
  });

  it('shows agent id as name when not in AGENT_NAMES map', () => {
    const bobStatus = {
      ...BASE_BOB_STATUS,
      current_agent: { id: '@unknown', name: null, task: 'some task', reason: null, started_at: null },
    };
    const output = formatOutput(BASE_PROJECT_STATUS, bobStatus);
    expect(output).toContain('@unknown');
  });

  it('shows "Agent is active" when agent has no task', () => {
    const bobStatus = {
      ...BASE_BOB_STATUS,
      current_agent: { id: '@dev', name: 'Dex', task: null, reason: null, started_at: null },
    };
    const output = formatOutput(BASE_PROJECT_STATUS, bobStatus);
    expect(output).toContain('Dex is active');
  });
});

// --- T2.2: no story → "No active story" (AC-2) ---

describe('T2.2 — no active story', () => {
  it('shows "No active story" when both sources have no story', () => {
    const projectStatus = { ...BASE_PROJECT_STATUS, currentStory: null };
    const bobStatus = {
      ...BASE_BOB_STATUS,
      orchestration: { ...BASE_BOB_STATUS.orchestration, current_story: null },
    };
    const output = formatOutput(projectStatus, bobStatus);
    expect(output).toContain('No active story');
  });

  it('falls back to orchestration.current_story when projectStatus.currentStory is null', () => {
    const projectStatus = { ...BASE_PROJECT_STATUS, currentStory: null };
    const output = formatOutput(projectStatus, BASE_BOB_STATUS);
    // orchestration.current_story = '13.7' — should be shown
    expect(output).toContain('13.7');
  });
});

// --- T2.3: no bob-status file → "No agent active" (AC-3) ---

describe('T2.3 — no agent active', () => {
  it('shows "No agent active" when bobStatus is null (file missing)', () => {
    const output = formatOutput(BASE_PROJECT_STATUS, null);
    expect(output).toContain('No agent active');
  });

  it('shows "No agent active" when current_agent.id is null', () => {
    const bobStatus = {
      ...BASE_BOB_STATUS,
      current_agent: { id: null, name: null, task: null, reason: null, started_at: null },
    };
    const output = formatOutput(BASE_PROJECT_STATUS, bobStatus);
    expect(output).toContain('No agent active');
  });

  it('readBobStatus returns null when file does not exist', () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory');
    });
    expect(readBobStatus()).toBeNull();
  });

  it('readBobStatus returns parsed object when file exists', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify(BASE_BOB_STATUS));
    const result = readBobStatus();
    expect(result).toMatchObject({ version: '1.0' });
  });
});

// --- T2.4: educational mode ON → extended output (AC-4) ---

describe('T2.4 — educational mode ON', () => {
  it('shows State explanation and task progress', () => {
    const bobStatus = {
      ...BASE_BOB_STATUS,
      educational: { enabled: true, tradeoffs: [], reasoning: [] },
    };
    const output = formatOutput(BASE_PROJECT_STATUS, bobStatus);
    expect(output).toContain('State:');
    expect(output).toContain('Tasks completed: 3/7');
    expect(output).toContain('writes code, runs tests, marks tasks done');
    expect(output).toContain('Next:');
  });

  it('shows agent with id label in educational mode', () => {
    const bobStatus = {
      ...BASE_BOB_STATUS,
      educational: { enabled: true, tradeoffs: [], reasoning: [] },
    };
    const output = formatOutput(BASE_PROJECT_STATUS, bobStatus);
    expect(output).toContain('Dex (@dev)');
  });

  it('shows AIOS configured note for git repos', () => {
    const bobStatus = {
      ...BASE_BOB_STATUS,
      educational: { enabled: true, tradeoffs: [], reasoning: [] },
    };
    const output = formatOutput(BASE_PROJECT_STATUS, bobStatus);
    expect(output).toContain('AIOS configured');
  });

  it('shows "Project not yet initialized" for non-git repos', () => {
    const projectStatus = { ...BASE_PROJECT_STATUS, isGitRepo: false };
    const bobStatus = {
      ...BASE_BOB_STATUS,
      educational: { enabled: true, tradeoffs: [], reasoning: [] },
    };
    const output = formatOutput(projectStatus, bobStatus);
    expect(output).toContain('Project not yet initialized');
    expect(output).not.toContain('AIOS configured');
  });

  it('shows "No agent active" in educational mode when agent is idle', () => {
    const bobStatus = {
      ...BASE_BOB_STATUS,
      educational: { enabled: true, tradeoffs: [], reasoning: [] },
      current_agent: { id: null, name: null, task: null, reason: null, started_at: null },
    };
    const output = formatOutput(BASE_PROJECT_STATUS, bobStatus);
    expect(output).toContain('No agent active');
  });

  it('shows "Agent is active" (no task) in educational mode', () => {
    const bobStatus = {
      ...BASE_BOB_STATUS,
      educational: { enabled: true, tradeoffs: [], reasoning: [] },
      current_agent: { id: '@dev', name: 'Dex', task: null, reason: null, started_at: null },
    };
    const output = formatOutput(BASE_PROJECT_STATUS, bobStatus);
    expect(output).toContain('Dex is active');
  });
});

// --- T2.5: nothing active → suggestion message (AC-5) ---

describe('T2.5 — nothing active', () => {
  it('shows encouraging message when no story and no agent', () => {
    const projectStatus = { ...BASE_PROJECT_STATUS, currentStory: null };
    const bobStatus = {
      ...BASE_BOB_STATUS,
      orchestration: { ...BASE_BOB_STATUS.orchestration, current_story: null },
      current_agent: { id: null, name: null, task: null, reason: null, started_at: null },
    };
    const output = formatOutput(projectStatus, bobStatus);
    expect(output).toContain("Bob here. Nothing's running right now.");
    expect(output).toContain('aios bob do "<your request>"');
  });

  it('shows encouraging message when bobStatus is null and no story', () => {
    const projectStatus = { ...BASE_PROJECT_STATUS, currentStory: null };
    const output = formatOutput(projectStatus, null);
    expect(output).toContain("Bob here. Nothing's running right now.");
    expect(output).toContain('aios bob do "<your request>"');
  });
});

// --- timeAgo ---

describe('timeAgo', () => {
  it('returns "just now" for < 1 minute', () => {
    const ts = new Date(Date.now() - 30000).toISOString();
    expect(timeAgo(ts)).toBe('just now');
  });

  it('returns "1 minute ago" for exactly 1 minute', () => {
    const ts = new Date(Date.now() - 61000).toISOString();
    expect(timeAgo(ts)).toBe('1 minute ago');
  });

  it('returns "N minutes ago" for > 1 minute', () => {
    const ts = new Date(Date.now() - 3 * 60001).toISOString();
    expect(timeAgo(ts)).toBe('3 minutes ago');
  });
});

// --- Command action ---

describe('statusCommand action', () => {
  it('logs formatted output when both data sources are available', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify(BASE_BOB_STATUS));
    loadProjectStatus.mockResolvedValue(BASE_PROJECT_STATUS);

    await statusCommand.parseAsync(['node', 'aios']);

    expect(consoleLogSpy).toHaveBeenCalled();
    const output = consoleLogSpy.mock.calls[0][0];
    expect(output).toContain("Bob here. Here's where we are:");
  });

  it('handles loadProjectStatus failure gracefully', async () => {
    loadProjectStatus.mockRejectedValue(new Error('disk read failed'));

    await expect(statusCommand.parseAsync(['node', 'aios'])).rejects.toThrow('process.exit called');
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Bob encountered an error:')
    );
  });
});
