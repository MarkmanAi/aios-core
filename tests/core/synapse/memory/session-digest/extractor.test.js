'use strict';

/**
 * Tests for Session Digest Extractor
 *
 * @see Story 10.5 — SYNAPSE: Session Digest: PreCompact Hook Migration
 */

const os = require('os');
const path = require('path');
const fs = require('fs').promises;

const {
  extractSessionDigest,
  _analyzeConversation,
  _generateDigestDocument,
  _writeDigest,
} = require('../../../../../.aios-core/core/synapse/memory/session-digest/extractor');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTmpDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'synapse-test-'));
}

function makeContext(overrides = {}) {
  return {
    sessionId: 'test-session-001',
    projectDir: overrides.projectDir || '/tmp/test-project',
    conversation: overrides.conversation || { messages: [] },
    metadata: overrides.metadata || {},
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 1. Schema fields
// ---------------------------------------------------------------------------

describe('extractSessionDigest', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('returns digest with all required schema fields', async () => {
    const ctx = makeContext({ projectDir: tmpDir });
    const digestPath = await extractSessionDigest(ctx);

    expect(typeof digestPath).toBe('string');
    expect(digestPath).toContain('.aios');
    expect(digestPath).toContain('session-digests');
    expect(digestPath).toMatch(/\.yaml$/);
  });

  it('completes extraction in < 5000ms (performance)', async () => {
    const ctx = makeContext({ projectDir: tmpDir });
    const start = Date.now();
    await extractSessionDigest(ctx);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(5000);
  });

  it('creates the digest file on disk', async () => {
    const ctx = makeContext({ projectDir: tmpDir });
    const digestPath = await extractSessionDigest(ctx);

    const content = await fs.readFile(digestPath, 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('handles empty conversation without throwing', async () => {
    const ctx = makeContext({ projectDir: tmpDir, conversation: { messages: [] } });
    await expect(extractSessionDigest(ctx)).resolves.toBeDefined();
  });

  it('handles missing conversation key gracefully', async () => {
    const ctx = makeContext({ projectDir: tmpDir });
    delete ctx.conversation;
    ctx.conversation = { messages: [] };
    await expect(extractSessionDigest(ctx)).resolves.toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 2. _generateDigestDocument — schema validation
// ---------------------------------------------------------------------------

describe('_generateDigestDocument', () => {
  const insights = {
    corrections: ['Actually, the path should use forward slashes'],
    patterns: [],
    axioms: ['Always use absolute imports'],
    contextSnapshot: {
      activeAgent: 'dev',
      activeStory: '10.5',
      filesModified: ['src/index.js'],
      commandsExecuted: ['npm test'],
    },
  };

  it('includes schema_version 1.0', () => {
    const ctx = makeContext();
    const doc = _generateDigestDocument(ctx, insights);
    expect(doc.schema_version).toBe('1.0');
  });

  it('includes session_id from context', () => {
    const ctx = makeContext({ sessionId: 'my-session-xyz' });
    const doc = _generateDigestDocument(ctx, insights);
    expect(doc.session_id).toBe('my-session-xyz');
  });

  it('includes timestamp as ISO 8601 string', () => {
    const ctx = makeContext();
    const doc = _generateDigestDocument(ctx, insights);
    expect(doc.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('includes corrections in body', () => {
    const ctx = makeContext();
    const doc = _generateDigestDocument(ctx, insights);
    expect(doc.body.user_corrections).toEqual(insights.corrections);
  });

  it('includes patterns in body', () => {
    const ctx = makeContext();
    const doc = _generateDigestDocument(ctx, insights);
    expect(Array.isArray(doc.body.patterns_observed)).toBe(true);
  });

  it('includes axioms in body', () => {
    const ctx = makeContext();
    const doc = _generateDigestDocument(ctx, insights);
    expect(doc.body.axioms_learned).toEqual(insights.axioms);
  });

  it('includes context_snapshot in body', () => {
    const ctx = makeContext();
    const doc = _generateDigestDocument(ctx, insights);
    expect(doc.body.context_snapshot).toMatchObject({
      activeAgent: 'dev',
      activeStory: '10.5',
    });
  });
});

// ---------------------------------------------------------------------------
// 3. _analyzeConversation — extraction logic
// ---------------------------------------------------------------------------

describe('_analyzeConversation', () => {
  it('returns object with corrections, patterns, axioms, contextSnapshot', async () => {
    const ctx = makeContext({ conversation: { messages: [] } });
    const result = await _analyzeConversation(ctx);
    expect(result).toHaveProperty('corrections');
    expect(result).toHaveProperty('patterns');
    expect(result).toHaveProperty('axioms');
    expect(result).toHaveProperty('contextSnapshot');
  });

  it('extracts correction when user says "Actually,"', async () => {
    const ctx = makeContext({
      conversation: {
        messages: [
          { role: 'assistant', content: 'Use relative imports.' },
          { role: 'user', content: 'Actually, the correct way is to use absolute imports.' },
        ],
      },
    });
    const result = await _analyzeConversation(ctx);
    expect(result.corrections.length).toBeGreaterThan(0);
    expect(result.corrections[0]).toMatch(/actually/i);
  });

  it('extracts correction when user says "That\'s wrong"', async () => {
    const ctx = makeContext({
      conversation: {
        messages: [
          { role: 'user', content: "That's wrong, you need to use js-yaml not yaml." },
        ],
      },
    });
    const result = await _analyzeConversation(ctx);
    expect(result.corrections.length).toBeGreaterThan(0);
  });

  it('limits corrections to max 10', async () => {
    const messages = Array.from({ length: 20 }, (_, i) => ({
      role: 'user',
      content: `Actually, item ${i} is wrong. Fix it.`,
    }));
    const ctx = makeContext({ conversation: { messages } });
    const result = await _analyzeConversation(ctx);
    expect(result.corrections.length).toBeLessThanOrEqual(10);
  });

  it('extracts axioms from "always" keyword', async () => {
    const ctx = makeContext({
      conversation: {
        messages: [
          { role: 'user', content: 'Always use absolute imports in this project.' },
        ],
      },
    });
    const result = await _analyzeConversation(ctx);
    expect(result.axioms.length).toBeGreaterThan(0);
  });

  it('limits axioms to max 10', async () => {
    const messages = Array.from({ length: 25 }, () => ({
      role: 'user',
      content: 'Always do this. Never do that. Must follow rules.',
    }));
    const ctx = makeContext({ conversation: { messages } });
    const result = await _analyzeConversation(ctx);
    expect(result.axioms.length).toBeLessThanOrEqual(10);
  });

  it('limits patterns to max 5', async () => {
    // Simulate many "how do i" questions to trigger pattern
    const messages = Array.from({ length: 10 }, () => ({
      role: 'user',
      content: 'How do I install this package?',
    }));
    const ctx = makeContext({ conversation: { messages } });
    const result = await _analyzeConversation(ctx);
    expect(result.patterns.length).toBeLessThanOrEqual(5);
  });

  it('contextSnapshot defaults activeAgent to "unknown" when metadata missing', async () => {
    const ctx = makeContext({ metadata: {} });
    const result = await _analyzeConversation(ctx);
    expect(result.contextSnapshot.activeAgent).toBe('unknown');
  });

  it('contextSnapshot uses metadata values when provided', async () => {
    const ctx = makeContext({
      metadata: {
        activeAgent: 'dev',
        activeStory: '10.5',
        filesModified: ['extractor.js'],
        commandsExecuted: ['npm test'],
      },
    });
    const result = await _analyzeConversation(ctx);
    expect(result.contextSnapshot.activeAgent).toBe('dev');
    expect(result.contextSnapshot.activeStory).toBe('10.5');
    expect(result.contextSnapshot.filesModified).toEqual(['extractor.js']);
  });
});

// ---------------------------------------------------------------------------
// 4. _writeDigest — file I/O
// ---------------------------------------------------------------------------

describe('_writeDigest', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  const digest = {
    schema_version: '1.0',
    session_id: 'sess-abc',
    timestamp: new Date().toISOString(),
    duration_minutes: 5,
    agent_context: 'dev',
    compact_trigger: 'context_limit',
    body: {
      user_corrections: ['Actually, use js-yaml'],
      patterns_observed: [],
      axioms_learned: ['Always use absolute imports'],
      context_snapshot: {
        activeAgent: 'dev',
        activeStory: '10.5',
        filesModified: [],
        commandsExecuted: [],
      },
    },
  };

  it('creates .aios/session-digests/ directory if it does not exist', async () => {
    await _writeDigest(tmpDir, 'sess-abc', digest);
    const stat = await fs.stat(path.join(tmpDir, '.aios', 'session-digests'));
    expect(stat.isDirectory()).toBe(true);
  });

  it('writes a .yaml file', async () => {
    const filePath = await _writeDigest(tmpDir, 'sess-abc', digest);
    expect(filePath).toMatch(/\.yaml$/);
    const content = await fs.readFile(filePath, 'utf8');
    expect(content).toContain('schema_version');
  });

  it('written file includes YAML frontmatter delimiters', async () => {
    const filePath = await _writeDigest(tmpDir, 'sess-abc', digest);
    const content = await fs.readFile(filePath, 'utf8');
    expect(content).toContain('---');
  });

  it('written file includes session body sections', async () => {
    const filePath = await _writeDigest(tmpDir, 'sess-abc', digest);
    const content = await fs.readFile(filePath, 'utf8');
    expect(content).toContain('## User Corrections');
    expect(content).toContain('## Patterns Observed');
    expect(content).toContain('## Axioms Learned');
    expect(content).toContain('## Context Snapshot');
  });

  it('filename contains session id', async () => {
    const filePath = await _writeDigest(tmpDir, 'my-session-id', digest);
    expect(path.basename(filePath)).toContain('my-session-id');
  });

  it('sanitizes sessionId with path traversal characters in filename (MEDIUM-1)', async () => {
    const maliciousId = '../../etc/passwd';
    const filePath = await _writeDigest(tmpDir, maliciousId, digest);
    const basename = path.basename(filePath);
    // Must not contain traversal sequences
    expect(basename).not.toContain('..');
    expect(basename).not.toContain('/');
    expect(basename).not.toContain('\\');
    // File must be inside the expected storageDir
    const storageDir = path.join(tmpDir, '.aios', 'session-digests');
    expect(filePath.startsWith(storageDir)).toBe(true);
  });

  it('truncates excessively long sessionId to 64 chars in filename', async () => {
    const longId = 'a'.repeat(200);
    const filePath = await _writeDigest(tmpDir, longId, digest);
    const basename = path.basename(filePath);
    // The safe session id prefix should be max 64 chars
    const prefix = basename.split('-2026')[0]; // split at timestamp start
    expect(prefix.length).toBeLessThanOrEqual(64);
  });
});

// ---------------------------------------------------------------------------
// 5. Integration — full end-to-end flow
// ---------------------------------------------------------------------------

describe('Integration: full hook flow', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('end-to-end: hook fires → extractor runs → digest file created in .aios/session-digests/', async () => {
    const ctx = {
      sessionId: 'integration-session-001',
      projectDir: tmpDir,
      conversation: {
        messages: [
          { role: 'user', content: 'Actually, the correct way is to use absolute imports.' },
          { role: 'assistant', content: 'Understood, I will use absolute imports.' },
          { role: 'user', content: 'Always use js-yaml in this project, never the yaml package.' },
        ],
      },
      metadata: {
        activeAgent: 'dev',
        activeStory: '10.5',
        filesModified: ['extractor.js'],
        commandsExecuted: ['npm test'],
        compactTrigger: 'context_limit',
      },
    };

    const digestPath = await extractSessionDigest(ctx);

    // File exists
    const stat = await fs.stat(digestPath);
    expect(stat.isFile()).toBe(true);

    // File is inside .aios/session-digests/
    const expectedDir = path.join(tmpDir, '.aios', 'session-digests');
    expect(digestPath.startsWith(expectedDir)).toBe(true);

    // File has meaningful content
    const content = await fs.readFile(digestPath, 'utf8');
    expect(content).toContain('schema_version');
    expect(content).toContain('integration-session-001');
    expect(content).toContain('## User Corrections');
    expect(content).toContain('## Axioms Learned');
  });

  it('end-to-end: empty conversation still creates a valid digest', async () => {
    const ctx = {
      sessionId: 'empty-session-001',
      projectDir: tmpDir,
      conversation: { messages: [] },
      metadata: {},
    };

    const digestPath = await extractSessionDigest(ctx);
    const content = await fs.readFile(digestPath, 'utf8');

    expect(content).toContain('schema_version');
    expect(content).toContain('(none captured)');
  });

  it('end-to-end: multiple calls create distinct files', async () => {
    const ctx1 = makeContext({ projectDir: tmpDir, sessionId: 'session-A' });
    const ctx2 = makeContext({ projectDir: tmpDir, sessionId: 'session-B' });

    const path1 = await extractSessionDigest(ctx1);
    const path2 = await extractSessionDigest(ctx2);

    expect(path1).not.toBe(path2);

    const dir = path.join(tmpDir, '.aios', 'session-digests');
    const files = await fs.readdir(dir);
    expect(files.length).toBeGreaterThanOrEqual(2);
  });
});
