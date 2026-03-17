'use strict';

/**
 * Story 24.4 — Integration Test: SYNAPSE Pipeline End-to-End
 *
 * Verifies the full institutional memory pipeline:
 *   SelfLearner.run() → MemoryWriter → .aios/memories/shared/ → MemoryLoader → enrichedContext.memories
 *
 * AC-1: Synthetic digest fixture setup and cleanup
 * AC-2: SelfLearner writes memories to testDir/.aios/memories/shared/
 * AC-3: MemoryLoader.loadForAgent() reads them back successfully
 * AC-4: UnifiedActivationPipeline enrichedContext.memories populated
 * AC-5: Graceful degradation (no files, missing dir, MemoryLoader timeout)
 * AC-6: Test isolation — no real .aios/ directory pollution
 * AC-7: Test suite integration (included in npm test, < 10s, deterministic)
 */

jest.setTimeout(30000);

const os = require('os');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { createSelfLearner } = require('../../.aios-core/core/synapse');
const { MemoryLoader } = require('../../.aios-core/core/synapse/memory/memory-loader');
const { UnifiedActivationPipeline } = require('../../.aios-core/development/scripts/unified-activation-pipeline');

// ─── HELPERS ────────────────────────────────────────────────────────────────

/**
 * Build one synthetic session digest in SYNAPSE format.
 * Timestamps are relative to now so confidence stays above threshold
 * regardless of when the test suite runs.
 *
 * @param {number} index  - Session index (1-based)
 * @param {number} baseTime - Date.now() reference
 * @returns {string} YAML+Markdown digest content
 */
function buildDigestContent(index, baseTime) {
  const ts = new Date(baseTime - (11 - index) * 60 * 60 * 1000).toISOString();
  return `---
schema_version: "1.0"
session_id: "test-epic24-session-${String(index).padStart(3, '0')}"
timestamp: "${ts}"
duration_minutes: 30
agent_context: "dev"
compact_trigger: "context_limit"
---
## User Corrections

- "Always import from core/synapse/memory/, not core/memory-intelligence/"

## Patterns Observed

- Use _safeLoad wrapper for all pipeline loaders

## Axioms Learned

- Axiom: "All memory files must use schema_version 2.0"

## Context Snapshot

**Active Agent:** dev
**Active Story:** none
**Files Modified:** none
**Commands Executed:** none
`;
}

/**
 * Create an isolated temp project with 10 synthetic digests.
 * 10 sessions with the same patterns → evidence_count = 10 → confidence > 0.9
 * → heuristic extraction qualifies (evidence_count >= 5 AND confidence > 0.9).
 *
 * @returns {string} Absolute path to temp project root
 */
function createTestProject() {
  const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-epic24-e2e-'));
  const digestsDir = path.join(testDir, '.aios', 'session-digests');
  fs.mkdirSync(digestsDir, { recursive: true });

  const baseTime = Date.now();
  for (let i = 1; i <= 10; i++) {
    fs.writeFileSync(
      path.join(digestsDir, `test-session-${String(i).padStart(3, '0')}.yaml`),
      buildDigestContent(i, baseTime)
    );
  }

  return testDir;
}

/**
 * Minimal GreetingBuilder stub.
 * Replaces the real GreetingBuilder (which reads many files from disk)
 * so UnifiedActivationPipeline completes well within its 200ms timeout.
 */
const fastGreetingBuilder = {
  buildGreeting: async () => 'test-greeting',
  loadUserProfile: () => 'advanced',
};

/**
 * Minimal GitConfigDetector stub.
 * The real detector runs `git config` commands which can take 100ms+.
 */
const fastGitConfigDetector = {
  get: async () => ({ configured: false, type: null, branch: null }),
};

// ─── ISOLATION BASELINE ─────────────────────────────────────────────────────

// AC-6: Snapshot real session dir before any test writes anything
const REAL_SESSION_DIR = path.join(process.cwd(), '.aios', 'memories', 'shared', 'session');
const preTestRealFiles = fs.existsSync(REAL_SESSION_DIR)
  ? new Set(fs.readdirSync(REAL_SESSION_DIR))
  : new Set();

// ─── MAIN PIPELINE TEST SUITE ───────────────────────────────────────────────

describe('Story 24.4 — SYNAPSE Pipeline End-to-End', () => {
  let testDir;
  let learnerResult;
  let loaderResult;
  let pipelineResult;

  beforeAll(async () => {
    // AC-1: Create isolated temp project with synthetic digest fixtures
    testDir = createTestProject();

    // AC-2: Run SelfLearner — digest → memory files
    const learner = createSelfLearner(testDir);
    learnerResult = await learner.run({ verbose: false, dryRun: false });

    // AC-3: Run MemoryLoader — read back written memories
    const loader = new MemoryLoader(testDir);
    loaderResult = await loader.loadForAgent('dev', { budget: 2000, layers: [1, 2] });

    // AC-4: Run UnifiedActivationPipeline — verify enrichedContext.memories populated
    const pipeline = new UnifiedActivationPipeline({
      projectRoot: testDir,
      greetingBuilder: fastGreetingBuilder,
      gitConfigDetector: fastGitConfigDetector,
    });
    pipelineResult = await pipeline.activate('dev', {});
  }, 30000);

  afterAll(() => {
    // AC-1 / AC-6: Clean up temp dir — no leftover files in repo
    if (testDir && fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  // ── AC-1: Digest fixture ────────────────────────────────────────────────

  describe('AC-1: Digest Fixture Setup', () => {
    test('temp directory created with session digest files', () => {
      const digestsDir = path.join(testDir, '.aios', 'session-digests');
      expect(fs.existsSync(digestsDir)).toBe(true);
      const files = fs.readdirSync(digestsDir).filter(f => f.endsWith('.yaml'));
      expect(files.length).toBeGreaterThanOrEqual(2);
    });

    test('digest files contain at least one correction and one pattern', () => {
      const digestsDir = path.join(testDir, '.aios', 'session-digests');
      const files = fs.readdirSync(digestsDir).filter(f => f.endsWith('.yaml'));
      const content = fs.readFileSync(path.join(digestsDir, files[0]), 'utf8');
      expect(content).toContain('## User Corrections');
      expect(content).toContain('## Patterns Observed');
    });

    test('digest files have valid YAML frontmatter with session_id and timestamp', () => {
      const digestsDir = path.join(testDir, '.aios', 'session-digests');
      const files = fs.readdirSync(digestsDir).filter(f => f.endsWith('.yaml'));
      const content = fs.readFileSync(path.join(digestsDir, files[0]), 'utf8');
      const match = content.match(/^---\n([\s\S]+?)\n---/);
      expect(match).not.toBeNull();
      const fm = yaml.load(match[1]);
      expect(fm.session_id).toBeDefined();
      expect(fm.timestamp).toBeDefined();
    });
  });

  // ── AC-2: SelfLearner segment ───────────────────────────────────────────

  describe('AC-2: SelfLearner Segment — digest → memories', () => {
    test('SelfLearner.run() returns without error', () => {
      expect(learnerResult).toBeDefined();
      expect(learnerResult.error).toBeUndefined();
      expect(learnerResult.skipped).toBe(false);
    });

    test('at least one memory file exists in testDir/.aios/memories/shared/ (any tier)', () => {
      const sharedDir = path.join(testDir, '.aios', 'memories', 'shared');
      expect(fs.existsSync(sharedDir)).toBe(true);
      // Walk all subdirs collecting .yaml files
      const allYaml = [];
      for (const tier of fs.readdirSync(sharedDir)) {
        const tierPath = path.join(sharedDir, tier);
        if (!fs.statSync(tierPath).isDirectory()) continue;
        // Recurse one level (durable has subdirs like heuristics/)
        for (const entry of fs.readdirSync(tierPath)) {
          const entryPath = path.join(tierPath, entry);
          if (fs.statSync(entryPath).isDirectory()) {
            for (const f of fs.readdirSync(entryPath)) {
              if (f.endsWith('.yaml')) allYaml.push(path.join(entryPath, f));
            }
          } else if (entry.endsWith('.yaml')) {
            allYaml.push(entryPath);
          }
        }
      }
      expect(allYaml.length).toBeGreaterThan(0);
    });

    test('memory file is valid YAML (parseable)', () => {
      const sessionDir = path.join(testDir, '.aios', 'memories', 'shared', 'session');
      expect(fs.existsSync(sessionDir)).toBe(true);
      const files = fs.readdirSync(sessionDir).filter(f => f.endsWith('.yaml'));
      expect(files.length).toBeGreaterThan(0);
      const content = fs.readFileSync(path.join(sessionDir, files[0]), 'utf8');
      const match = content.match(/^---\n([\s\S]+?)\n---/);
      expect(match).not.toBeNull();
      expect(() => yaml.load(match[1])).not.toThrow();
    });

    test('memory content includes at least one item from the synthetic digest', () => {
      const sessionDir = path.join(testDir, '.aios', 'memories', 'shared', 'session');
      const files = fs.readdirSync(sessionDir).filter(f => f.endsWith('.yaml'));
      const allContent = files
        .map(f => fs.readFileSync(path.join(sessionDir, f), 'utf8'))
        .join('\n');
      // Digest patterns: _safeLoad | core/synapse/memory | schema_version
      expect(
        allContent.includes('_safeLoad') ||
        allContent.includes('core/synapse/memory') ||
        allContent.includes('schema_version')
      ).toBe(true);
    });
  });

  // ── AC-3: MemoryLoader segment ──────────────────────────────────────────

  describe('AC-3: MemoryLoader Segment — memories → readable', () => {
    test('loadForAgent returns { memories: [...] } with at least 1 item', () => {
      expect(loaderResult).toBeDefined();
      expect(Array.isArray(loaderResult.memories)).toBe(true);
      expect(loaderResult.memories.length).toBeGreaterThan(0);
    });

    test('each memory item has required fields', () => {
      const m = loaderResult.memories[0];
      expect(m).toHaveProperty('id');
      expect(m).toHaveProperty('timestamp');
      expect(m).toHaveProperty('agent');
      expect(m).toHaveProperty('tier');
    });

    test('loadForAgent completes within 500ms', async () => {
      const start = Date.now();
      const loader = new MemoryLoader(testDir);
      await loader.loadForAgent('dev', { budget: 2000, layers: [1, 2] });
      expect(Date.now() - start).toBeLessThan(500);
    });
  });

  // ── AC-4: UnifiedActivationPipeline ────────────────────────────────────

  describe('AC-4: Pipeline — enrichedContext.memories populated', () => {
    test('pipeline.activate() returns result with context.memories array', () => {
      expect(pipelineResult).toBeDefined();
      expect(pipelineResult.context).toBeDefined();
      expect(Array.isArray(pipelineResult.context.memories)).toBe(true);
    });

    test('enrichedContext.memories is non-empty', () => {
      expect(pipelineResult.context.memories.length).toBeGreaterThan(0);
    });

    test('pipeline memories match MemoryLoader result (not coincidentally correct)', () => {
      const pipelineIds = pipelineResult.context.memories.map(m => m.id);
      const loaderIds = loaderResult.memories.map(m => m.id);
      const overlap = loaderIds.filter(id => pipelineIds.includes(id));
      expect(overlap.length).toBeGreaterThan(0);
    });
  });
});

// ─── GRACEFUL DEGRADATION TESTS (AC-5) ─────────────────────────────────────

describe('Story 24.4 — Graceful Degradation (AC-5)', () => {
  test('T4.1: .aios/memories/ does not exist → enrichedContext.memories = []', async () => {
    const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-epic24-empty-'));
    try {
      const pipeline = new UnifiedActivationPipeline({
        projectRoot: emptyDir,
        greetingBuilder: fastGreetingBuilder,
        gitConfigDetector: fastGitConfigDetector,
      });
      const result = await pipeline.activate('dev', {});
      expect(Array.isArray(result.context.memories)).toBe(true);
      expect(result.context.memories).toHaveLength(0);
    } finally {
      fs.rmSync(emptyDir, { recursive: true, force: true });
    }
  });

  test('T4.2: SelfLearner.run() not called (no files) → pipeline continues, memories = []', async () => {
    // Simulates SelfLearner throwing by simply not running it — no memory files exist
    const noMemoryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-epic24-nolearner-'));
    try {
      const pipeline = new UnifiedActivationPipeline({
        projectRoot: noMemoryDir,
        greetingBuilder: fastGreetingBuilder,
        gitConfigDetector: fastGitConfigDetector,
      });
      const result = await pipeline.activate('dev', {});
      expect(Array.isArray(result.context.memories)).toBe(true);
      expect(result.context.memories).toHaveLength(0);
    } finally {
      fs.rmSync(noMemoryDir, { recursive: true, force: true });
    }
  });

  test('T4.3: MemoryLoader mock-timeout → pipeline completes, memories = []', async () => {
    // Spy on loadForAgent to simulate a loader that never resolves within 150ms budget
    const spy = jest.spyOn(MemoryLoader.prototype, 'loadForAgent')
      .mockImplementation(() => new Promise(resolve => {
        // Resolve after pipeline's LOADER_TIMEOUT_MS (150ms) to trigger _safeLoad fallback
        setTimeout(() => resolve({ memories: [], metadata: {} }), 300);
      }));

    const slowDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-epic24-slow-'));
    try {
      const pipeline = new UnifiedActivationPipeline({
        projectRoot: slowDir,
        greetingBuilder: fastGreetingBuilder,
        gitConfigDetector: fastGitConfigDetector,
      });
      const result = await pipeline.activate('dev', {});
      expect(Array.isArray(result.context.memories)).toBe(true);
      // MemoryLoader timed out → _safeLoad returned null → memories: []
      expect(result.context.memories).toHaveLength(0);
    } finally {
      spy.mockRestore();
      fs.rmSync(slowDir, { recursive: true, force: true });
    }
  });
});

// ─── ISOLATION VERIFICATION (AC-6) ─────────────────────────────────────────

describe('Story 24.4 — Test Isolation Verification (AC-6)', () => {
  test('no new files added to real project session dir during test run', () => {
    if (!fs.existsSync(REAL_SESSION_DIR)) {
      return; // no dir = no pollution possible
    }
    const currentFiles = new Set(fs.readdirSync(REAL_SESSION_DIR));
    const newFiles = [...currentFiles].filter(f => !preTestRealFiles.has(f));
    expect(newFiles).toHaveLength(0);
  });
});
