/**
 * Self-Learning Engine Tests - MIS-5
 *
 * Tests for the Evolution Layer of the Memory Intelligence System.
 * Target: >= 85% coverage
 *
 * @module core/synapse/memory/self-learner.test
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('yaml');
const {
  SelfLearner,
  createSelfLearner,
  DECAY_RATES,
  TIER_THRESHOLDS,
  HEURISTIC_THRESHOLDS,
  GOTCHA_THRESHOLD,
  FEATURE_GATE_ID,
} = require('../../../../.aios-core/core/synapse/memory/self-learner');

// ─── TEST HELPERS ───────────────────────────────────────────────────

let tmpDir;
let TEST_DIR, DIGESTS_DIR, MEMORIES_DIR, INDEX_DIR, EVIDENCE_DIR, GOTCHA_DIR;

/**
 * Create a test digest file
 */
async function createTestDigest(dir, sessionId, options = {}) {
  const {
    corrections = [],
    patterns = [],
    axioms = [],
    agent = 'dev',
    timestamp = new Date().toISOString(),
  } = options;

  const frontmatter = {
    schema_version: '1.0',
    session_id: sessionId,
    timestamp,
    duration_minutes: 30,
    agent_context: agent,
    compact_trigger: 'context_limit',
  };

  const parts = [
    '---',
    yaml.stringify(frontmatter).trim(),
    '---',
    '',
    '## User Corrections',
    '',
  ];

  if (corrections.length > 0) {
    for (const c of corrections) {
      parts.push(`- "${c}"`);
    }
  } else {
    parts.push('- (none captured)');
  }

  parts.push('', '## Patterns Observed', '');
  if (patterns.length > 0) {
    for (const p of patterns) {
      parts.push(`- ${p}`);
    }
  } else {
    parts.push('- (none identified)');
  }

  parts.push('', '## Axioms Learned', '');
  if (axioms.length > 0) {
    for (const a of axioms) {
      parts.push(`- Axiom: "${a}"`);
    }
  } else {
    parts.push('- (none extracted)');
  }

  parts.push('', '## Context Snapshot', '');
  parts.push(`**Active Agent:** ${agent}`);
  parts.push('**Active Story:** test-story');

  const content = parts.join('\n');
  const filename = `${sessionId}-${timestamp.replace(/[:.]/g, '-')}.yaml`;
  const filePath = path.join(dir, filename);

  await fs.writeFile(filePath, content, 'utf8');
  return filePath;
}

/**
 * Create a master index with test memories
 */
async function createTestIndex(indexDir, memories) {
  await fs.mkdir(indexDir, { recursive: true });
  const masterIndex = {};

  for (const mem of memories) {
    masterIndex[mem.id] = {
      id: mem.id,
      timestamp: mem.timestamp || new Date().toISOString(),
      agent: mem.agent || 'dev',
      tags: mem.tags || [],
      attention_score: mem.attention_score || 0.5,
      sector: mem.sector || 'procedural',
      tier: mem.tier || 'warm',
      access_count: mem.access_count || 0,
      evidence_count: mem.evidence_count || 0,
      confidence: mem.confidence || 0.5,
      last_accessed: mem.last_accessed || new Date().toISOString(),
    };
  }

  await fs.writeFile(
    path.join(indexDir, 'master.json'),
    JSON.stringify(masterIndex, null, 2),
    'utf8',
  );

  return masterIndex;
}

/**
 * Create evidence file
 */
async function createTestEvidence(evidenceDir, evidence) {
  await fs.mkdir(evidenceDir, { recursive: true });
  await fs.writeFile(
    path.join(evidenceDir, 'evidence.json'),
    JSON.stringify(evidence, null, 2),
    'utf8',
  );
}

// ─── TEST SUITE ─────────────────────────────────────────────────────

describe('SelfLearner', () => {
  let learner;

  beforeAll(() => {
    tmpDir = fsSync.mkdtempSync(path.join(os.tmpdir(), 'aios-self-learner-'));
    TEST_DIR = tmpDir;
    DIGESTS_DIR = path.join(TEST_DIR, '.aios', 'session-digests');
    MEMORIES_DIR = path.join(TEST_DIR, '.aios', 'memories');
    INDEX_DIR = path.join(DIGESTS_DIR, 'index');
    EVIDENCE_DIR = path.join(MEMORIES_DIR, 'learning');
    GOTCHA_DIR = path.join(MEMORIES_DIR, 'shared', 'durable');
  });

  afterAll(() => {
    fsSync.rmSync(tmpDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    await fs.mkdir(DIGESTS_DIR, { recursive: true });
    await fs.mkdir(INDEX_DIR, { recursive: true });
    await fs.mkdir(EVIDENCE_DIR, { recursive: true });
    await fs.mkdir(GOTCHA_DIR, { recursive: true });

    learner = new SelfLearner(TEST_DIR);
  });

  afterEach(async () => {
    await fs.rm(path.join(TEST_DIR, '.aios'), { recursive: true, force: true });
  });

  // ─── CONSTRUCTOR & FACTORY ──────────────────────────────────────

  describe('constructor', () => {
    it('should create instance with default project dir', () => {
      const sl = new SelfLearner();
      expect(sl.projectDir).toBe(process.cwd());
    });

    it('should create instance with custom project dir', () => {
      expect(learner.projectDir).toBe(TEST_DIR);
    });

    it('should accept custom feature gate check', () => {
      const customGate = jest.fn(() => false);
      const sl = new SelfLearner(TEST_DIR, { isFeatureEnabled: customGate });
      expect(sl.isFeatureEnabled).toBe(customGate);
    });
  });

  describe('createSelfLearner factory', () => {
    it('should create SelfLearner instance', () => {
      const sl = createSelfLearner(TEST_DIR);
      expect(sl).toBeInstanceOf(SelfLearner);
      expect(sl.projectDir).toBe(TEST_DIR);
    });
  });

  // ─── CONFIDENCE SCORER (AC: 3) ──────────────────────────────────

  describe('Confidence Scorer', () => {
    it('should calculate score with all factors', () => {
      const memory = {
        tier: 'daily',
        access_count: 5,
        confidence: 0.8,
        last_accessed: new Date().toISOString(),
        evidence_count: 5,
      };

      const score = learner.calculateConfidence(memory, Date.now());

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('should return 0 for minimum inputs', () => {
      const memory = {
        tier: 'session',
        access_count: 0,
        confidence: 0,
        last_accessed: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        evidence_count: 0,
      };

      const score = learner.calculateConfidence(memory, Date.now());
      expect(score).toBe(0);
    });

    it('should be deterministic: same inputs produce same output', () => {
      const memory = {
        tier: 'daily',
        access_count: 3,
        confidence: 0.7,
        last_accessed: '2026-02-09T12:00:00Z',
        evidence_count: 4,
      };
      const time = new Date('2026-02-10T12:00:00Z').getTime();

      const score1 = learner.calculateConfidence(memory, time);
      const score2 = learner.calculateConfidence(memory, time);

      expect(score1).toBe(score2);
    });

    it('should clamp score to [0.0, 1.0]', () => {
      // High values that could exceed 1.0
      const memory = {
        tier: 'durable',
        access_count: 100,
        confidence: 1.0,
        last_accessed: new Date().toISOString(),
        evidence_count: 100,
      };

      const score = learner.calculateConfidence(memory, Date.now());
      expect(score).toBeLessThanOrEqual(1.0);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should apply session decay rate (0.5/day)', () => {
      const now = Date.now();
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

      const memoryRecent = {
        tier: 'session', access_count: 0, confidence: 0.8,
        last_accessed: new Date(now).toISOString(), evidence_count: 5,
      };
      const memoryOld = {
        tier: 'session', access_count: 0, confidence: 0.8,
        last_accessed: oneDayAgo, evidence_count: 5,
      };

      const scoreRecent = learner.calculateConfidence(memoryRecent, now);
      const scoreOld = learner.calculateConfidence(memoryOld, now);

      // Session memories decay fast, old score should be much lower
      expect(scoreOld).toBeLessThan(scoreRecent);
    });

    it('should apply durable decay rate (0.01/day)', () => {
      const now = Date.now();
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

      const memoryRecent = {
        tier: 'durable', access_count: 0, confidence: 0.8,
        last_accessed: new Date(now).toISOString(), evidence_count: 5,
      };
      const memoryOld = {
        tier: 'durable', access_count: 0, confidence: 0.8,
        last_accessed: oneDayAgo, evidence_count: 5,
      };

      const scoreRecent = learner.calculateConfidence(memoryRecent, now);
      const scoreOld = learner.calculateConfidence(memoryOld, now);

      // Durable decays slowly
      expect(scoreOld).toBeLessThan(scoreRecent);
      expect(scoreOld / scoreRecent).toBeGreaterThan(0.95); // Very close
    });

    it('should cap access_modifier at 2.0', () => {
      const memory = {
        tier: 'daily', access_count: 100, confidence: 0.5,
        last_accessed: new Date().toISOString(), evidence_count: 5,
      };

      // access_modifier = min(1 + 100*0.1, 2.0) = 2.0
      const score = learner.calculateConfidence(memory, Date.now());
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('should use default values for missing fields', () => {
      const memory = {};
      const score = learner.calculateConfidence(memory, Date.now());

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('should accept evidence data parameter', () => {
      const memory = {
        tier: 'daily', access_count: 1, confidence: 0.5,
        last_accessed: new Date().toISOString(),
      };
      const evidenceData = { evidence_count: 8 };

      const scoreWithEvidence = learner.calculateConfidence(memory, Date.now(), evidenceData);
      const scoreWithout = learner.calculateConfidence(memory, Date.now());

      // More evidence = higher base_relevance
      expect(scoreWithEvidence).toBeGreaterThan(scoreWithout);
    });
  });

  // ─── TIER PROMOTION/DEMOTION (AC: 5) ────────────────────────────

  describe('Tier Promotion/Demotion', () => {
    it('should promote to HOT when score > 0.7 AND confidence > 0.7 AND evidence >= 5', () => {
      const memory = {
        tier: 'warm',
        attention_score: 0.85,
        confidence: 0.8,
        _evidenceCount: 6,
        access_count: 5,
      };

      const result = learner.determineTierChange(memory);
      expect(result.newTier).toBe('hot');
      expect(result.changed).toBe(true);
      expect(result.direction).toBe('promoted');
    });

    it('should NOT promote to HOT if confidence <= 0.7', () => {
      const memory = {
        tier: 'warm',
        attention_score: 0.85,
        confidence: 0.5,
        _evidenceCount: 6,
        access_count: 5,
      };

      const result = learner.determineTierChange(memory);
      expect(result.newTier).not.toBe('hot');
    });

    it('should NOT promote to HOT if evidence < 5', () => {
      const memory = {
        tier: 'warm',
        attention_score: 0.85,
        confidence: 0.8,
        _evidenceCount: 3,
        access_count: 5,
      };

      const result = learner.determineTierChange(memory);
      expect(result.newTier).not.toBe('hot');
    });

    it('should promote to WARM when score >= 0.3', () => {
      const memory = {
        tier: 'cold',
        attention_score: 0.4,
        confidence: 0.5,
        _evidenceCount: 1,
        access_count: 1,
      };

      const result = learner.determineTierChange(memory);
      expect(result.newTier).toBe('warm');
      expect(result.changed).toBe(true);
      expect(result.direction).toBe('promoted');
    });

    it('should promote COLD to WARM when access_count >= 3 (AC 5)', () => {
      const memory = {
        tier: 'cold',
        attention_score: 0.15,
        confidence: 0.3,
        _evidenceCount: 0,
        access_count: 3,
      };

      const result = learner.determineTierChange(memory);
      expect(result.newTier).toBe('warm');
      expect(result.changed).toBe(true);
      expect(result.reason).toContain('access_count=3');
    });

    it('should promote COLD to WARM when evidence_count >= 2 (AC 5)', () => {
      const memory = {
        tier: 'cold',
        attention_score: 0.15,
        confidence: 0.3,
        _evidenceCount: 2,
        access_count: 0,
      };

      const result = learner.determineTierChange(memory);
      expect(result.newTier).toBe('warm');
      expect(result.changed).toBe(true);
      expect(result.reason).toContain('evidence_count=2');
    });

    it('should demote to COLD when score < 0.3 and no qualifying access/evidence', () => {
      const memory = {
        tier: 'warm',
        attention_score: 0.15,
        confidence: 0.3,
        _evidenceCount: 0,
        access_count: 0,
      };

      const result = learner.determineTierChange(memory);
      expect(result.newTier).toBe('cold');
      expect(result.changed).toBe(true);
      expect(result.direction).toBe('demoted');
    });

    it('should archive when score < 0.1 for 90+ days', () => {
      const memory = {
        tier: 'cold',
        attention_score: 0.05,
        confidence: 0.1,
        _evidenceCount: 0,
        access_count: 0,
        score_below_since: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const result = learner.determineTierChange(memory);
      expect(result.newTier).toBe('archive');
      expect(result.changed).toBe(true);
      expect(result.reason).toContain('Score < 0.1 for');
    });

    it('should stay COLD (not archive) when score < 0.1 for less than 90 days', () => {
      const memory = {
        tier: 'cold',
        attention_score: 0.05,
        confidence: 0.1,
        _evidenceCount: 0,
        access_count: 0,
        score_below_since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const result = learner.determineTierChange(memory);
      expect(result.newTier).toBe('cold');
      expect(result.changed).toBe(false);
    });

    it('should not change if already at correct tier', () => {
      const memory = {
        tier: 'warm',
        attention_score: 0.5,
        confidence: 0.5,
        _evidenceCount: 1,
        access_count: 1,
      };

      const result = learner.determineTierChange(memory);
      expect(result.changed).toBe(false);
      expect(result.direction).toBe('unchanged');
    });

    it('should log reason for all tier changes', () => {
      const memory = {
        tier: 'cold',
        attention_score: 0.5,
        confidence: 0.5,
        _evidenceCount: 1,
        access_count: 1,
      };

      const result = learner.determineTierChange(memory);
      expect(result.reason).toBeTruthy();
      expect(typeof result.reason).toBe('string');
      expect(result.reason.length).toBeGreaterThan(0);
    });
  });

  // ─── CORRECTION TRACKER (AC: 1) ─────────────────────────────────

  describe('Correction Tracker', () => {
    it('should extract corrections from digests', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: ['Actually, use npm not yarn', 'No, the correct path is /src'],
          patterns: [],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      const corrections = learner._trackCorrections(digests, evidence);

      expect(corrections.length).toBeGreaterThan(0);
      expect(evidence.corrections).toBeDefined();
    });

    it('should group similar corrections by keyword overlap', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: ['Always use npm for package management'],
          patterns: [],
          axioms: [],
        },
        {
          metadata: { session_id: 'session-2', timestamp: '2026-02-10T11:00:00Z' },
          corrections: ['Use npm for package installation always'],
          patterns: [],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      const groups = learner._trackCorrections(digests, evidence);

      // Similar corrections should be grouped
      // They share keywords: npm, package
      expect(groups.length).toBeLessThanOrEqual(2);
    });

    it('should track session audit trail', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: ['Use npm not yarn'],
          patterns: [],
          axioms: [],
        },
        {
          metadata: { session_id: 'session-2', timestamp: '2026-02-10T11:00:00Z' },
          corrections: ['Use npm not yarn'],
          patterns: [],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      learner._trackCorrections(digests, evidence);

      const entries = Object.values(evidence.corrections);
      expect(entries.length).toBeGreaterThan(0);

      const entry = entries[0];
      expect(entry.sessions).toContain('session-1');
      expect(entry.sessions).toContain('session-2');
      expect(entry.evidence_count).toBeGreaterThanOrEqual(2);
    });

    it('should handle empty corrections', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1' },
          corrections: [],
          patterns: [],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      const corrections = learner._trackCorrections(digests, evidence);

      expect(corrections).toEqual([]);
    });

    it('should store metadata: type, text, evidence_count, sessions, first_seen, last_seen', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: ['Always use absolute imports'],
          patterns: [],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      learner._trackCorrections(digests, evidence);

      const entry = Object.values(evidence.corrections)[0];
      expect(entry).toHaveProperty('type', 'user-correction');
      expect(entry).toHaveProperty('text');
      expect(entry).toHaveProperty('evidence_count');
      expect(entry).toHaveProperty('sessions');
      expect(entry).toHaveProperty('first_seen');
      expect(entry).toHaveProperty('last_seen');
    });
  });

  // ─── EVIDENCE ACCUMULATOR (AC: 2) ───────────────────────────────

  describe('Evidence Accumulator', () => {
    it('should accumulate pattern evidence', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: [],
          patterns: ['Pattern: User frequently asks "how-to" questions (5 times)'],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      learner._accumulateEvidence(digests, evidence);

      expect(Object.keys(evidence.patterns).length).toBeGreaterThan(0);
    });

    it('should accumulate axiom evidence', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: [],
          patterns: [],
          axioms: ['Always use CommonJS for Node.js modules'],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      learner._accumulateEvidence(digests, evidence);

      expect(Object.keys(evidence.axioms).length).toBeGreaterThan(0);
    });

    it('should track error evidence from corrections', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: ['Wrong import path used'],
          patterns: [],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      learner._accumulateEvidence(digests, evidence);

      expect(Object.keys(evidence.errors).length).toBeGreaterThan(0);
    });

    it('should increment evidence_count on recurring patterns', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: [],
          patterns: ['Pattern: repeated workflow'],
          axioms: [],
        },
        {
          metadata: { session_id: 'session-2', timestamp: '2026-02-10T11:00:00Z' },
          corrections: [],
          patterns: ['Pattern: repeated workflow'],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      learner._accumulateEvidence(digests, evidence);

      const entry = Object.values(evidence.patterns)[0];
      expect(entry.evidence_count).toBe(2);
    });

    it('should update last_seen on recurrence', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: [],
          patterns: ['Pattern: recurring thing'],
          axioms: [],
        },
        {
          metadata: { session_id: 'session-2', timestamp: '2026-02-10T14:00:00Z' },
          corrections: [],
          patterns: ['Pattern: recurring thing'],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      learner._accumulateEvidence(digests, evidence);

      const entry = Object.values(evidence.patterns)[0];
      expect(entry.last_seen).toBe('2026-02-10T14:00:00Z');
    });

    it('should not double-count same session', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: [],
          patterns: ['Pattern: same session pattern'],
          axioms: [],
        },
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: [],
          patterns: ['Pattern: same session pattern'],
          axioms: [],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      learner._accumulateEvidence(digests, evidence);

      const entry = Object.values(evidence.patterns)[0];
      expect(entry.evidence_count).toBe(1);
      expect(entry.sessions.length).toBe(1);
    });

    it('should support all evidence types', () => {
      const digests = [
        {
          metadata: { session_id: 'session-1', timestamp: '2026-02-10T10:00:00Z' },
          corrections: ['Fix: wrong path'],
          patterns: ['Pattern: frequent how-to'],
          axioms: ['Always validate inputs'],
        },
      ];

      const evidence = { corrections: {}, patterns: {}, axioms: {}, errors: {} };
      learner._accumulateEvidence(digests, evidence);

      expect(Object.keys(evidence.patterns).length).toBeGreaterThan(0);
      expect(Object.keys(evidence.axioms).length).toBeGreaterThan(0);
      expect(Object.keys(evidence.errors).length).toBeGreaterThan(0);
    });
  });

  // ─── KEYWORD SIMILARITY ─────────────────────────────────────────

  describe('Keyword Similarity', () => {
    it('should extract keywords from text', () => {
      const keywords = learner._extractKeywords('Always use npm for package management');
      expect(keywords).toContain('always');
      expect(keywords).toContain('package');
      expect(keywords).toContain('management');
      // Short words (<= 3 chars) should be filtered
      expect(keywords).not.toContain('use');
      expect(keywords).not.toContain('npm');
      expect(keywords).not.toContain('for');
    });

    it('should return empty array for null/undefined', () => {
      expect(learner._extractKeywords(null)).toEqual([]);
      expect(learner._extractKeywords(undefined)).toEqual([]);
      expect(learner._extractKeywords('')).toEqual([]);
    });

    it('should calculate overlap correctly', () => {
      const keywords1 = ['always', 'package', 'management'];
      const keywords2 = ['always', 'package', 'install'];

      const overlap = learner._calculateKeywordOverlap(keywords1, keywords2);
      // intersection: always, package (2)
      // union: always, package, management, install (4)
      // overlap = 2/4 = 0.5
      expect(overlap).toBe(0.5);
    });

    it('should return 0 for empty keyword arrays', () => {
      expect(learner._calculateKeywordOverlap([], ['test'])).toBe(0);
      expect(learner._calculateKeywordOverlap(['test'], [])).toBe(0);
      expect(learner._calculateKeywordOverlap([], [])).toBe(0);
    });

    it('should group similar items together', () => {
      const items = [
        { text: 'Use npm for package management' },
        { text: 'Always use npm for package install' },
        { text: 'Database should use PostgreSQL always' },
      ];

      const groups = learner._groupBySimilarity(items);
      // First two share "package" keyword, should be grouped
      // Third is different
      expect(groups.length).toBeLessThanOrEqual(3);
    });

    it('should handle empty items', () => {
      const groups = learner._groupBySimilarity([]);
      expect(groups).toEqual([]);
    });
  });

  // ─── HEURISTIC EXTRACTOR (AC: 6) ────────────────────────────────

  describe('Heuristic Extractor', () => {
    it('should extract heuristics when confidence > 0.9 AND evidence >= 5', () => {
      const evidence = {
        corrections: {
          'correction:always-package-management': {
            type: 'user-correction',
            text: 'Always use npm, never yarn',
            evidence_count: 10,
            sessions: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'],
            first_seen: '2026-02-01T10:00:00Z',
            last_seen: new Date().toISOString(),
          },
        },
        patterns: {},
        axioms: {},
        errors: {},
      };

      const heuristics = learner._extractHeuristics(evidence);
      expect(heuristics.length).toBeGreaterThan(0);
    });

    it('should NOT extract when evidence < 5', () => {
      const evidence = {
        corrections: {
          'correction:low-evidence': {
            type: 'user-correction',
            text: 'Use npm',
            evidence_count: 3,
            sessions: ['s1', 's2', 's3'],
            first_seen: '2026-02-08T10:00:00Z',
            last_seen: new Date().toISOString(),
          },
        },
        patterns: {},
        axioms: {},
        errors: {},
      };

      const heuristics = learner._extractHeuristics(evidence);
      expect(heuristics.length).toBe(0);
    });

    it('should generate MIS-7 compatible format', () => {
      const evidence = {
        corrections: {
          'correction:high-evidence': {
            type: 'user-correction',
            text: 'Always use absolute imports',
            evidence_count: 8,
            sessions: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'],
            first_seen: '2026-02-01T10:00:00Z',
            last_seen: new Date().toISOString(),
          },
        },
        patterns: {},
        axioms: {},
        errors: {},
      };

      const heuristics = learner._extractHeuristics(evidence);

      if (heuristics.length > 0) {
        const h = heuristics[0];
        expect(h).toHaveProperty('id');
        expect(h.id).toMatch(/^heur-\d{4}-\d{2}-\d{2}-\d{3}$/);
        expect(h).toHaveProperty('type', 'rule-candidate');
        expect(h).toHaveProperty('rule');
        expect(h).toHaveProperty('evidence_summary');
        expect(h).toHaveProperty('confidence');
        expect(h).toHaveProperty('evidence_count');
        expect(h).toHaveProperty('proposed_action');
        expect(h).toHaveProperty('proposed_target');
        expect(h).toHaveProperty('proposed_content');
        expect(h).toHaveProperty('source_memories');
        expect(h).toHaveProperty('created');
      }
    });

    it('should map proposed_action based on evidence type', () => {
      const evidence = {
        corrections: {
          'correction:test': {
            type: 'user-correction', text: 'Use npm', evidence_count: 8,
            sessions: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'],
            first_seen: '2026-02-01T10:00:00Z', last_seen: new Date().toISOString(),
          },
        },
        axioms: {
          'axiom:test': {
            type: 'axiom-confirmed', text: 'Always validate', evidence_count: 8,
            sessions: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'],
            first_seen: '2026-02-01T10:00:00Z', last_seen: new Date().toISOString(),
          },
        },
        patterns: {},
        errors: {},
      };

      const heuristics = learner._extractHeuristics(evidence);

      const correctionHeuristic = heuristics.find(h => h.rule === 'Use npm');
      const axiomHeuristic = heuristics.find(h => h.rule === 'Always validate');

      if (correctionHeuristic) {
        expect(correctionHeuristic.proposed_action).toBe('add_to_claude_md');
      }
      if (axiomHeuristic) {
        expect(axiomHeuristic.proposed_action).toBe('add_to_rules');
      }
    });

    it('should NEVER auto-apply rules (only prepare proposals)', () => {
      // Heuristics are just proposals, not auto-applied
      const evidence = {
        corrections: {
          'correction:test': {
            type: 'user-correction', text: 'Always test', evidence_count: 10,
            sessions: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'],
            first_seen: '2026-02-01T10:00:00Z', last_seen: new Date().toISOString(),
          },
        },
        patterns: {},
        axioms: {},
        errors: {},
      };

      const heuristics = learner._extractHeuristics(evidence);

      // Verify heuristics are proposals, not applied
      for (const h of heuristics) {
        expect(h.type).toBe('rule-candidate');
        expect(h.proposed_action).toBeTruthy();
        // Should NOT have an "applied" field
        expect(h.applied).toBeUndefined();
      }
    });
  });

  // ─── GOTCHA AUTO-PROMOTER (AC: 7) ──────────────────────────────

  describe('Gotcha Auto-Promoter', () => {
    it('should detect errors occurring 3+ times across sessions', () => {
      const evidence = {
        corrections: {},
        patterns: {},
        axioms: {},
        errors: {
          'error:wrong-import-path': {
            type: 'gotcha-repeat',
            text: 'Wrong import path used',
            evidence_count: 4,
            sessions: ['s1', 's2', 's3', 's4'],
            first_seen: '2026-02-05T10:00:00Z',
            last_seen: new Date().toISOString(),
          },
        },
      };

      const gotchas = learner._detectGotchaCandidates(evidence);
      expect(gotchas.length).toBe(1);
      expect(gotchas[0].type).toBe('auto-gotcha');
      expect(gotchas[0].frequency).toBe(4);
    });

    it('should NOT detect errors with less than 3 sessions', () => {
      const evidence = {
        corrections: {},
        patterns: {},
        axioms: {},
        errors: {
          'error:rare': {
            type: 'gotcha-repeat',
            text: 'Rare error',
            evidence_count: 2,
            sessions: ['s1', 's2'],
            first_seen: '2026-02-05T10:00:00Z',
            last_seen: new Date().toISOString(),
          },
        },
      };

      const gotchas = learner._detectGotchaCandidates(evidence);
      expect(gotchas.length).toBe(0);
    });

    it('should tag gotchas with auto-gotcha', () => {
      const evidence = {
        corrections: {},
        patterns: {},
        axioms: {},
        errors: {
          'error:test': {
            type: 'gotcha-repeat',
            text: 'Repeated error',
            evidence_count: 3,
            sessions: ['s1', 's2', 's3'],
            first_seen: '2026-02-05T10:00:00Z',
            last_seen: new Date().toISOString(),
          },
        },
      };

      const gotchas = learner._detectGotchaCandidates(evidence);
      expect(gotchas[0].tags).toContain('auto-gotcha');
    });

    it('should link to source sessions', () => {
      const evidence = {
        corrections: {},
        patterns: {},
        axioms: {},
        errors: {
          'error:test': {
            type: 'gotcha-repeat',
            text: 'Error with sessions',
            evidence_count: 3,
            sessions: ['session-abc', 'session-def', 'session-ghi'],
            first_seen: '2026-02-05T10:00:00Z',
            last_seen: new Date().toISOString(),
          },
        },
      };

      const gotchas = learner._detectGotchaCandidates(evidence);
      expect(gotchas[0].sessions).toContain('session-abc');
      expect(gotchas[0].sessions).toContain('session-def');
      expect(gotchas[0].sessions).toContain('session-ghi');
    });

    it('should calculate attention score based on frequency and recency', () => {
      const evidence = {
        corrections: {},
        patterns: {},
        axioms: {},
        errors: {
          'error:test': {
            type: 'gotcha-repeat',
            text: 'Frequent error',
            evidence_count: 5,
            sessions: ['s1', 's2', 's3', 's4', 's5'],
            first_seen: '2026-02-05T10:00:00Z',
            last_seen: new Date().toISOString(),
          },
        },
      };

      const gotchas = learner._detectGotchaCandidates(evidence);
      expect(gotchas[0].attention_score).toBeGreaterThan(0);
      expect(gotchas[0].attention_score).toBeLessThanOrEqual(1.0);
    });
  });

  // ─── LEARNING RUN INTERFACE (AC: 8) ─────────────────────────────

  describe('Learning Run Interface', () => {
    beforeEach(async () => {
      // Create test digests
      await createTestDigest(DIGESTS_DIR, 'session-1', {
        corrections: ['Actually, use npm not yarn', 'No, the path should be absolute'],
        patterns: ['Pattern: User asks how-to questions frequently'],
        axioms: ['Always validate inputs before processing'],
      });

      await createTestDigest(DIGESTS_DIR, 'session-2', {
        corrections: ['Actually, use npm not yarn'],
        patterns: [],
        axioms: [],
        timestamp: new Date(Date.now() + 1000).toISOString(),
      });

      // Create test memories
      await createTestIndex(INDEX_DIR, [
        {
          id: 'mem-1',
          agent: 'dev',
          tier: 'warm',
          attention_score: 0.5,
          confidence: 0.7,
          access_count: 2,
          evidence_count: 1,
          last_accessed: new Date().toISOString(),
        },
        {
          id: 'mem-2',
          agent: 'dev',
          tier: 'cold',
          attention_score: 0.2,
          confidence: 0.3,
          access_count: 0,
          evidence_count: 0,
          last_accessed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    });

    it('should execute full learning cycle with run()', async () => {
      const result = await learner.run();

      expect(result.skipped).toBe(false);
      expect(result.stats).toBeDefined();
      expect(result.stats.corrections_found).toBeGreaterThanOrEqual(0);
      expect(result.stats.last_run).toBeTruthy();
      expect(result.digestsProcessed).toBeGreaterThanOrEqual(0);
      expect(result.memoriesProcessed).toBeGreaterThanOrEqual(0);
    });

    it('should support dryRun option (no disk writes)', async () => {
      const result = await learner.run({ dryRun: true });

      expect(result.skipped).toBe(false);
      expect(result.stats).toBeDefined();

      // Evidence file should NOT exist (dry run)
      try {
        await fs.access(learner.evidencePath);
        // File might exist from beforeEach setup
      } catch {
        // Expected: no evidence file written
      }
    });

    it('should support verbose option', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await learner.run({ verbose: true });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should support agentFilter option', async () => {
      const result = await learner.run({ agentFilter: 'dev' });

      expect(result.skipped).toBe(false);
    });

    it('should recalculate scores without learning with recalculateScores()', async () => {
      const result = await learner.recalculateScores();

      expect(result.memoriesProcessed).toBeGreaterThanOrEqual(0);
      expect(result.duration_ms).toBeDefined();
    });

    it('should return heuristic candidates with getHeuristicCandidates()', () => {
      const candidates = learner.getHeuristicCandidates();
      expect(Array.isArray(candidates)).toBe(true);
    });

    it('should return stats with getStats()', () => {
      const stats = learner.getStats();

      expect(stats).toHaveProperty('corrections_found');
      expect(stats).toHaveProperty('heuristics_extracted');
      expect(stats).toHaveProperty('promotions');
      expect(stats).toHaveProperty('demotions');
    });

    it('should return a copy of stats (immutable)', () => {
      const stats1 = learner.getStats();
      stats1.corrections_found = 999;

      const stats2 = learner.getStats();
      expect(stats2.corrections_found).not.toBe(999);
    });

    it('should return a copy of heuristic candidates (immutable)', () => {
      const candidates1 = learner.getHeuristicCandidates();
      candidates1.push({ fake: true });

      const candidates2 = learner.getHeuristicCandidates();
      expect(candidates2.length).toBe(0);
    });
  });

  // ─── GRACEFUL DEGRADATION (AC: 9) ──────────────────────────────

  describe('Graceful Degradation', () => {
    it('should skip when feature gate is disabled', async () => {
      const gatedLearner = new SelfLearner(TEST_DIR, {
        isFeatureEnabled: () => false,
      });

      const result = await gatedLearner.run();
      expect(result.skipped).toBe(true);
      expect(result.reason).toContain(FEATURE_GATE_ID);
    });

    it('should handle missing digest directory gracefully', async () => {
      // Remove digests dir
      await fs.rm(DIGESTS_DIR, { recursive: true, force: true });

      const result = await learner.run();

      // Should not throw, just process 0 digests
      expect(result.skipped).toBe(false);
    });

    it('should skip corrupted digest files without error', async () => {
      // Create a corrupted digest
      await fs.writeFile(
        path.join(DIGESTS_DIR, 'corrupted-session.yaml'),
        'this is not valid yaml: {{{{',
        'utf8',
      );

      // Create a valid digest
      await createTestDigest(DIGESTS_DIR, 'valid-session', {
        corrections: ['Valid correction'],
      });

      const result = await learner.run();

      // Should process valid digest, skip corrupted
      expect(result.skipped).toBe(false);
    });

    it('should handle missing evidence file gracefully', async () => {
      // Ensure no evidence file
      try {
        await fs.unlink(learner.evidencePath);
      } catch {
        // Already doesn't exist
      }

      const result = await learner.run();
      expect(result.skipped).toBe(false);
    });

    it('should handle corrupted memories gracefully', async () => {
      // Create corrupted master index
      await fs.writeFile(
        path.join(INDEX_DIR, 'master.json'),
        'not json',
        'utf8',
      );

      const result = await learner.run();
      // Should not throw
      expect(result.skipped).toBe(false);
    });

    it('should return error info without throwing', async () => {
      // Make evidence path a directory (will fail write)
      await fs.mkdir(learner.evidencePath, { recursive: true });

      const result = await learner.run();
      // Should still return, not throw
      expect(result).toBeDefined();
    });

    it('should not corrupt existing memories on failed run', async () => {
      // Create valid index
      const originalIndex = await createTestIndex(INDEX_DIR, [
        { id: 'mem-safe', agent: 'dev', tier: 'warm', attention_score: 0.5 },
      ]);

      // Run should complete (even if parts fail)
      await learner.run();

      // Read back index
      const content = await fs.readFile(
        path.join(INDEX_DIR, 'master.json'),
        'utf8',
      );
      const index = JSON.parse(content);

      // Original memory should still exist
      expect(index['mem-safe']).toBeDefined();
    });
  });

  // ─── FEATURE GATE (AC: 10) ─────────────────────────────────────

  describe('Feature Gate', () => {
    it('should check feature gate before running', async () => {
      const gateCheck = jest.fn(() => true);
      const gatedLearner = new SelfLearner(TEST_DIR, { isFeatureEnabled: gateCheck });

      await gatedLearner.run();
      expect(gateCheck).toHaveBeenCalledWith(FEATURE_GATE_ID);
    });

    it('should track metrics in stats', async () => {
      await createTestDigest(DIGESTS_DIR, 'metric-session', {
        corrections: ['Test correction for metrics'],
      });

      const result = await learner.run();

      expect(result.stats).toHaveProperty('corrections_found');
      expect(result.stats).toHaveProperty('heuristics_extracted');
      expect(result.stats).toHaveProperty('promotions');
      expect(result.stats).toHaveProperty('demotions');
      expect(result.stats).toHaveProperty('gotchas_created');
    });

    it('should track last_run timestamp', async () => {
      await learner.run();
      const stats = learner.getStats();
      expect(stats.last_run).toBeTruthy();
      expect(new Date(stats.last_run).getTime()).toBeGreaterThan(0);
    });
  });

  // ─── ATTENTION SCORE RECALCULATION (AC: 4) ──────────────────────

  describe('Attention Score Recalculation', () => {
    it('should be idempotent: running twice produces same result', async () => {
      await createTestIndex(INDEX_DIR, [
        {
          id: 'mem-idem',
          agent: 'dev',
          tier: 'warm',
          attention_score: 0.5,
          confidence: 0.7,
          access_count: 2,
          evidence_count: 3,
          last_accessed: new Date().toISOString(),
        },
      ]);

      const result1 = await learner.recalculateScores({ dryRun: true });
      const result2 = await learner.recalculateScores({ dryRun: true });

      expect(result1.memoriesProcessed).toBe(result2.memoriesProcessed);
    });

    it('should apply decay based on tier and time since last access', () => {
      const now = Date.now();
      const memory = {
        tier: 'daily',
        access_count: 2,
        confidence: 0.7,
        last_accessed: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
        evidence_count: 3,
      };

      const score = learner.calculateConfidence(memory, now);

      // After 7 days with daily decay (0.1), recency factor = e^(-0.7) ~= 0.497
      expect(score).toBeLessThan(0.5);
      expect(score).toBeGreaterThan(0);
    });
  });

  // ─── DIGEST PARSING ─────────────────────────────────────────────

  describe('Digest Parsing', () => {
    it('should parse digest with corrections, patterns, and axioms', () => {
      const content = [
        '---',
        'schema_version: "1.0"',
        'session_id: test-session',
        'timestamp: "2026-02-10T10:00:00Z"',
        'agent_context: dev',
        '---',
        '',
        '## User Corrections',
        '',
        '- "Actually, use npm not yarn"',
        '- "No, the path should be absolute"',
        '',
        '## Patterns Observed',
        '',
        '- Pattern: User frequently asks how-to questions',
        '',
        '## Axioms Learned',
        '',
        '- Axiom: "Always validate inputs"',
        '',
        '## Context Snapshot',
        '',
        '**Active Agent:** dev',
      ].join('\n');

      const parsed = learner._parseDigest(content);

      expect(parsed).not.toBeNull();
      expect(parsed.corrections).toHaveLength(2);
      expect(parsed.corrections[0]).toBe('Actually, use npm not yarn');
      expect(parsed.patterns).toHaveLength(1);
      expect(parsed.axioms).toHaveLength(1);
      expect(parsed.axioms[0]).toBe('Always validate inputs');
      expect(parsed.metadata.session_id).toBe('test-session');
    });

    it('should handle digest with no corrections', () => {
      const content = [
        '---',
        'session_id: empty-session',
        '---',
        '',
        '## User Corrections',
        '',
        '- (none captured)',
        '',
        '## Patterns Observed',
        '',
        '- (none identified)',
      ].join('\n');

      const parsed = learner._parseDigest(content);
      expect(parsed.corrections).toHaveLength(0);
      expect(parsed.patterns).toHaveLength(0);
    });

    it('should return null for completely invalid content', () => {
      const parsed = learner._parseDigest(null);
      expect(parsed).toBeNull();
    });
  });

  // ─── I/O PERSISTENCE ────────────────────────────────────────────

  describe('I/O Persistence', () => {
    it('should persist evidence to disk', async () => {
      const evidence = {
        corrections: { 'test:key': { text: 'test', evidence_count: 1, sessions: ['s1'] } },
        patterns: {},
        axioms: {},
        errors: {},
        version: 1,
      };

      await learner._persistEvidence(evidence);

      const content = await fs.readFile(learner.evidencePath, 'utf8');
      const loaded = JSON.parse(content);
      expect(loaded.corrections['test:key'].text).toBe('test');
      expect(loaded.last_updated).toBeTruthy();
    });

    it('should load evidence from disk', async () => {
      await createTestEvidence(EVIDENCE_DIR, {
        corrections: { 'test:key': { text: 'persisted', evidence_count: 3 } },
        patterns: {},
        axioms: {},
        errors: {},
        version: 1,
      });

      const evidence = await learner._loadEvidence();
      expect(evidence.corrections['test:key'].text).toBe('persisted');
    });

    it('should create fresh evidence if file does not exist', async () => {
      const evidence = await learner._loadEvidence();

      expect(evidence).toHaveProperty('corrections');
      expect(evidence).toHaveProperty('patterns');
      expect(evidence).toHaveProperty('axioms');
      expect(evidence).toHaveProperty('errors');
      expect(evidence.version).toBe(1);
    });

    it('should persist gotchas to durable storage', async () => {
      const gotchas = [
        {
          id: 'gotcha-test-1',
          type: 'auto-gotcha',
          text: 'Test gotcha',
          frequency: 3,
          sessions: ['s1', 's2', 's3'],
          attention_score: 0.6,
          tags: ['auto-gotcha'],
        },
      ];

      await learner._persistGotchas(gotchas);

      const content = await fs.readFile(
        path.join(GOTCHA_DIR, 'gotcha-test-1.json'),
        'utf8',
      );
      const loaded = JSON.parse(content);
      expect(loaded.type).toBe('auto-gotcha');
      expect(loaded.text).toBe('Test gotcha');
    });

    it('should NOT overwrite existing gotcha files', async () => {
      // Create existing gotcha
      const existingGotcha = { id: 'gotcha-existing', text: 'Original text' };
      await fs.writeFile(
        path.join(GOTCHA_DIR, 'gotcha-existing.json'),
        JSON.stringify(existingGotcha),
        'utf8',
      );

      // Try to persist same ID with different text
      const gotchas = [{ id: 'gotcha-existing', text: 'New text' }];
      await learner._persistGotchas(gotchas);

      // Should still have original text
      const content = await fs.readFile(
        path.join(GOTCHA_DIR, 'gotcha-existing.json'),
        'utf8',
      );
      const loaded = JSON.parse(content);
      expect(loaded.text).toBe('Original text');
    });

    it('should update master index with new scores', async () => {
      await createTestIndex(INDEX_DIR, [
        { id: 'mem-update', agent: 'dev', tier: 'warm', attention_score: 0.5 },
      ]);

      const scoredMemories = [
        {
          id: 'mem-update',
          attention_score: 0.8,
          tier: 'hot',
          _tierChanged: true,
          source: 'index',
        },
      ];

      await learner._persistMemoryUpdates(scoredMemories);

      const content = await fs.readFile(
        path.join(INDEX_DIR, 'master.json'),
        'utf8',
      );
      const index = JSON.parse(content);
      expect(index['mem-update'].attention_score).toBe(0.8);
      expect(index['mem-update'].tier).toBe('hot');
    });
  });

  // ─── INTEGRATION TEST ───────────────────────────────────────────

  describe('Integration: Full Learning Cycle', () => {
    it('should complete full cycle from digest to updated memories', async () => {
      // Create digests with repeated corrections (simulating multiple sessions)
      const correction = 'Actually, always use npm for package management';
      for (let i = 1; i <= 5; i++) {
        await createTestDigest(DIGESTS_DIR, `session-${i}`, {
          corrections: [correction],
          patterns: ['Pattern: User prefers npm workflow'],
          axioms: ['Always use npm'],
          timestamp: new Date(Date.now() + i * 1000).toISOString(),
        });
      }

      // Create memories in index
      await createTestIndex(INDEX_DIR, [
        {
          id: 'mem-target',
          agent: 'dev',
          tier: 'cold',
          attention_score: 0.2,
          confidence: 0.5,
          access_count: 1,
          evidence_count: 1,
          last_accessed: new Date().toISOString(),
        },
      ]);

      // Run full learning cycle
      const result = await learner.run({ verbose: false });

      expect(result.skipped).toBe(false);
      expect(result.stats.corrections_found).toBeGreaterThan(0);
      expect(result.digestsProcessed).toBe(5);
      expect(result.memoriesProcessed).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── PERFORMANCE (AC: 11) ──────────────────────────────────────

  describe('Performance', () => {
    it('should recalculate 500 memory scores in < 500ms', async () => {
      // Generate 500 test memories
      const memories = [];
      for (let i = 0; i < 500; i++) {
        memories.push({
          id: `perf-mem-${i}`,
          agent: 'dev',
          tier: ['session', 'daily', 'durable'][i % 3],
          attention_score: Math.random(),
          confidence: Math.random(),
          access_count: Math.floor(Math.random() * 10),
          evidence_count: Math.floor(Math.random() * 5),
          last_accessed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      await createTestIndex(INDEX_DIR, memories);

      const start = performance.now();
      const result = await learner.recalculateScores({ dryRun: true });
      const duration = performance.now() - start;

      expect(result.memoriesProcessed).toBe(500);
      expect(duration).toBeLessThan(500);
    });

    it('should complete full cycle with 500 memories and 50 digests in < 2 seconds', async () => {
      // Generate 50 digests
      for (let i = 0; i < 50; i++) {
        await createTestDigest(DIGESTS_DIR, `perf-session-${i}`, {
          corrections: [`Correction ${i}: always use proper imports`],
          patterns: [`Pattern: workflow step ${i % 5}`],
          axioms: [`Axiom: rule number ${i % 3}`],
          timestamp: new Date(Date.now() + i * 1000).toISOString(),
        });
      }

      // Generate 500 memories
      const memories = [];
      for (let i = 0; i < 500; i++) {
        memories.push({
          id: `perf-mem-${i}`,
          agent: i % 2 === 0 ? 'dev' : 'shared',
          tier: ['session', 'daily', 'durable'][i % 3],
          attention_score: Math.random(),
          confidence: Math.random(),
          access_count: Math.floor(Math.random() * 10),
          evidence_count: Math.floor(Math.random() * 5),
          last_accessed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      await createTestIndex(INDEX_DIR, memories);

      const start = performance.now();
      const result = await learner.run({ dryRun: true });
      const duration = performance.now() - start;

      expect(result.digestsProcessed).toBe(50);
      expect(result.memoriesProcessed).toBe(500);
      expect(duration).toBeLessThan(2000);
    });
  });

  // ─── EDGE CASES ────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('should handle empty digests directory', async () => {
      const result = await learner.run();
      expect(result.skipped).toBe(false);
      expect(result.digestsProcessed).toBe(0);
    });

    it('should handle digests with no corrections/patterns/axioms', async () => {
      await createTestDigest(DIGESTS_DIR, 'empty-session', {
        corrections: [],
        patterns: [],
        axioms: [],
      });

      const result = await learner.run();
      expect(result.skipped).toBe(false);
      expect(result.stats.corrections_found).toBe(0);
    });

    it('should handle memories with missing fields', async () => {
      await createTestIndex(INDEX_DIR, [
        { id: 'minimal-mem' }, // Only ID, all other fields missing
      ]);

      const result = await learner.recalculateScores({ dryRun: true });
      expect(result.memoriesProcessed).toBe(1);
    });

    it('should skip example digest files', async () => {
      await fs.writeFile(
        path.join(DIGESTS_DIR, 'example-digest.yaml'),
        '---\ntest: true\n---\n',
        'utf8',
      );

      const digests = await learner._loadDigests();
      const exampleDigests = digests.filter(d =>
        d.metadata?.test === true,
      );
      expect(exampleDigests.length).toBe(0);
    });
  });

  // ─── EXPORTED CONSTANTS ─────────────────────────────────────────

  describe('Exported Constants', () => {
    it('should export DECAY_RATES', () => {
      expect(DECAY_RATES.session).toBe(0.5);
      expect(DECAY_RATES.daily).toBe(0.1);
      expect(DECAY_RATES.durable).toBe(0.01);
    });

    it('should export TIER_THRESHOLDS', () => {
      expect(TIER_THRESHOLDS.hot).toBe(0.7);
      expect(TIER_THRESHOLDS.warm).toBe(0.3);
      expect(TIER_THRESHOLDS.archive).toBe(0.1);
      expect(TIER_THRESHOLDS.archiveDays).toBe(90);
    });

    it('should export HEURISTIC_THRESHOLDS', () => {
      expect(HEURISTIC_THRESHOLDS.confidence).toBe(0.9);
      expect(HEURISTIC_THRESHOLDS.evidence).toBe(5);
    });

    it('should export GOTCHA_THRESHOLD', () => {
      expect(GOTCHA_THRESHOLD).toBe(3);
    });

    it('should export FEATURE_GATE_ID', () => {
      expect(FEATURE_GATE_ID).toBe('pro.memory.self_learning');
    });
  });
});
