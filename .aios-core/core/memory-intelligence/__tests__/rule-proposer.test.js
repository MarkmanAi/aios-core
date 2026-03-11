/**
 * Rule Proposer Tests - MIS-7
 *
 * Tests for the Auto-Evolution Layer of the Memory Intelligence System.
 * Target: >= 85% coverage, >= 40 tests
 *
 * @module pro/memory/__tests__/rule-proposer.test
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('yaml');
const {
  RuleProposer,
  createRuleProposer,
  FEATURE_GATE_ID,
  DEFAULTS,
  PROPOSAL_STATUSES,
  VALID_ACTIONS,
} = require('../rule-proposer');

// ─── TEST HELPERS ───────────────────────────────────────────────────

const TEST_DIR = path.join(__dirname, 'fixtures', 'test-rule-proposer');
const PROPOSALS_DIR = path.join(TEST_DIR, '.aios', 'memories', 'proposals');
const CLAUDE_MD_PATH = path.join(TEST_DIR, '.claude', 'CLAUDE.md');
const RULES_DIR = path.join(TEST_DIR, '.claude', 'rules');
const AGENT_MEMORY_DIR = path.join(TEST_DIR, '.claude', 'agent-memory');
const GOTCHAS_PATH = path.join(TEST_DIR, '.aios', 'gotchas.json');

/**
 * Create a valid heuristic candidate for testing
 */
function createCandidate(overrides = {}) {
  return {
    rule: 'Use npm not yarn',
    evidence_summary: 'User corrected yarn to npm in 5 sessions',
    confidence: 0.95,
    evidence_count: 6,
    proposed_action: 'add_to_claude_md',
    proposed_target: 'MEMORY.md',
    proposed_content: '## Package Manager\n\nAlways use `npm`. Never use `yarn`.',
    source_memories: ['session-2026-02-05', 'session-2026-02-06'],
    created: '2026-02-10T12:00:00Z',
    ...overrides,
  };
}

/**
 * Create a mock SelfLearner
 */
function createMockSelfLearner(candidates = []) {
  return {
    learn: jest.fn().mockResolvedValue({ corrections_found: 0 }),
    getHeuristicCandidates: jest.fn().mockReturnValue(candidates),
  };
}

/**
 * Clean up test directory
 */
async function cleanTestDir() {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  } catch {
    // Directory might not exist
  }
}

/**
 * Set up test directory structure
 */
async function setupTestDir() {
  await cleanTestDir();
  await fs.mkdir(path.join(TEST_DIR, '.aios', 'memories', 'proposals'), { recursive: true });
  await fs.mkdir(path.join(TEST_DIR, '.claude', 'rules'), { recursive: true });
  await fs.mkdir(path.join(TEST_DIR, '.claude', 'agent-memory'), { recursive: true });
}

// ─── TEST SUITES ────────────────────────────────────────────────────

describe('RuleProposer', () => {
  beforeEach(async () => {
    await setupTestDir();
  });

  afterAll(async () => {
    await cleanTestDir();
  });

  // ─── CONSTRUCTOR ────────────────────────────────────────────────

  describe('constructor', () => {
    it('should create instance with default options', () => {
      const proposer = new RuleProposer(TEST_DIR);
      expect(proposer.projectRoot).toBe(TEST_DIR);
      expect(proposer.confidenceThreshold).toBe(DEFAULTS.confidenceThreshold);
      expect(proposer.evidenceThreshold).toBe(DEFAULTS.evidenceThreshold);
      expect(proposer.rejectionPenalty).toBe(DEFAULTS.rejectionPenalty);
      expect(proposer.blacklistThreshold).toBe(DEFAULTS.blacklistThreshold);
      expect(proposer.timeoutMs).toBe(DEFAULTS.timeoutMs);
    });

    it('should accept custom options', () => {
      const proposer = new RuleProposer(TEST_DIR, {
        confidenceThreshold: 0.8,
        evidenceThreshold: 3,
        rejectionPenalty: 0.5,
        blacklistThreshold: 2,
        timeoutMs: 2000,
      });
      expect(proposer.confidenceThreshold).toBe(0.8);
      expect(proposer.evidenceThreshold).toBe(3);
      expect(proposer.rejectionPenalty).toBe(0.5);
      expect(proposer.blacklistThreshold).toBe(2);
      expect(proposer.timeoutMs).toBe(2000);
    });

    it('should accept selfLearner via options', () => {
      const mockLearner = createMockSelfLearner();
      const proposer = new RuleProposer(TEST_DIR, { selfLearner: mockLearner });
      expect(proposer.selfLearner).toBe(mockLearner);
    });

    it('should accept isFeatureEnabled function', () => {
      const gate = jest.fn().mockReturnValue(true);
      const proposer = new RuleProposer(TEST_DIR, { isFeatureEnabled: gate });
      expect(proposer.isFeatureEnabled).toBe(gate);
    });
  });

  // ─── FACTORY ────────────────────────────────────────────────────

  describe('createRuleProposer', () => {
    it('should create a RuleProposer instance', () => {
      const proposer = createRuleProposer(TEST_DIR);
      expect(proposer).toBeInstanceOf(RuleProposer);
    });
  });

  // ─── GENERATE PROPOSALS ─────────────────────────────────────────

  describe('generateProposals', () => {
    it('should return empty array when feature gate disabled', async () => {
      const proposer = new RuleProposer(TEST_DIR, {
        isFeatureEnabled: () => false,
      });
      const result = await proposer.generateProposals([createCandidate()]);
      expect(result).toEqual([]);
    });

    it('should return empty array when no candidates provided and no selfLearner', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const result = await proposer.generateProposals();
      expect(result).toEqual([]);
    });

    it('should return empty array for empty candidates array', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const result = await proposer.generateProposals([]);
      expect(result).toEqual([]);
    });

    it('should return empty array for non-array candidates', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const result = await proposer.generateProposals('not-an-array');
      expect(result).toEqual([]);
    });

    it('should generate proposals from qualified candidates', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = [
        createCandidate({ rule: 'Use npm', confidence: 0.95, evidence_count: 6 }),
        createCandidate({ rule: 'Low confidence', confidence: 0.5, evidence_count: 2 }),
      ];

      const proposals = await proposer.generateProposals(candidates);
      expect(proposals).toHaveLength(1);
      expect(proposals[0].title).toBe('Use npm');
    });

    it('should filter by confidence threshold', async () => {
      const proposer = new RuleProposer(TEST_DIR, { confidenceThreshold: 0.95 });
      const candidates = [
        createCandidate({ rule: 'High', confidence: 0.96, evidence_count: 6 }),
        createCandidate({ rule: 'Below', confidence: 0.94, evidence_count: 6 }),
      ];

      const proposals = await proposer.generateProposals(candidates);
      expect(proposals).toHaveLength(1);
      expect(proposals[0].title).toBe('High');
    });

    it('should filter by evidence threshold', async () => {
      const proposer = new RuleProposer(TEST_DIR, { evidenceThreshold: 10 });
      const candidates = [
        createCandidate({ rule: 'Enough', evidence_count: 11 }),
        createCandidate({ rule: 'Not enough', evidence_count: 4 }),
      ];

      const proposals = await proposer.generateProposals(candidates);
      expect(proposals).toHaveLength(1);
      expect(proposals[0].title).toBe('Enough');
    });

    it('should use selfLearner when candidates not provided', async () => {
      const mockLearner = createMockSelfLearner([
        createCandidate({ rule: 'From learner' }),
      ]);
      const proposer = new RuleProposer(TEST_DIR, { selfLearner: mockLearner });

      const proposals = await proposer.generateProposals();
      expect(mockLearner.learn).toHaveBeenCalled();
      expect(mockLearner.getHeuristicCandidates).toHaveBeenCalled();
      expect(proposals).toHaveLength(1);
      expect(proposals[0].title).toBe('From learner');
    });

    it('should skip invalid candidates', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = [
        createCandidate({ rule: 'Valid' }),
        { rule: null, confidence: 0.95, evidence_count: 6, proposed_action: 'add_to_claude_md' },
        { rule: 'No action', confidence: 0.95, evidence_count: 6, proposed_action: 'invalid' },
        null,
        'not-an-object',
      ];

      const proposals = await proposer.generateProposals(candidates);
      expect(proposals).toHaveLength(1);
      expect(proposals[0].title).toBe('Valid');
    });

    it('should apply confidence overrides from rejections', async () => {
      const proposer = new RuleProposer(TEST_DIR);

      // Write an override
      const overridesPath = path.join(PROPOSALS_DIR, 'overrides.json');
      await fs.writeFile(overridesPath, JSON.stringify({ 'Penalized rule': 0.1 }), 'utf-8');

      const candidates = [
        createCandidate({ rule: 'Penalized rule', confidence: 0.95, evidence_count: 6 }),
        createCandidate({ rule: 'Clean rule', confidence: 0.95, evidence_count: 6 }),
      ];

      const proposals = await proposer.generateProposals(candidates);
      // Penalized rule: 0.95 - 0.1 = 0.85 (below 0.9 threshold)
      expect(proposals).toHaveLength(1);
      expect(proposals[0].title).toBe('Clean rule');
    });

    it('should skip blacklisted rules', async () => {
      const proposer = new RuleProposer(TEST_DIR);

      const blacklistPath = path.join(PROPOSALS_DIR, 'blacklist.json');
      await fs.writeFile(blacklistPath, JSON.stringify(['Blacklisted rule']), 'utf-8');

      const candidates = [
        createCandidate({ rule: 'Blacklisted rule' }),
        createCandidate({ rule: 'Normal rule' }),
      ];

      const proposals = await proposer.generateProposals(candidates);
      expect(proposals).toHaveLength(1);
      expect(proposals[0].title).toBe('Normal rule');
    });

    it('should deduplicate against approved proposals', async () => {
      const proposer = new RuleProposer(TEST_DIR);

      // Create an approved proposal in history
      const dateDir = path.join(PROPOSALS_DIR, '2026-02-10');
      await fs.mkdir(dateDir, { recursive: true });
      const existingProposal = {
        id: 'prop-old-123abc',
        title: 'Already applied',
        status: 'approved',
        type: 'add_to_claude_md',
        created: '2026-02-10T10:00:00Z',
      };
      await fs.writeFile(
        path.join(dateDir, 'prop-old-123abc.yaml'),
        yaml.stringify(existingProposal),
        'utf-8',
      );

      const candidates = [
        createCandidate({ rule: 'Already applied' }),
        createCandidate({ rule: 'New rule' }),
      ];

      const proposals = await proposer.generateProposals(candidates);
      expect(proposals).toHaveLength(1);
      expect(proposals[0].title).toBe('New rule');
    });

    it('should deduplicate against rejected proposals', async () => {
      const proposer = new RuleProposer(TEST_DIR);

      const dateDir = path.join(PROPOSALS_DIR, '2026-02-10');
      await fs.mkdir(dateDir, { recursive: true });
      const existingProposal = {
        id: 'prop-old-456def',
        title: 'Already rejected',
        status: 'rejected',
        type: 'add_to_claude_md',
        created: '2026-02-10T10:00:00Z',
      };
      await fs.writeFile(
        path.join(dateDir, 'prop-old-456def.yaml'),
        yaml.stringify(existingProposal),
        'utf-8',
      );

      const candidates = [
        createCandidate({ rule: 'Already rejected' }),
        createCandidate({ rule: 'Fresh rule' }),
      ];

      const proposals = await proposer.generateProposals(candidates);
      expect(proposals).toHaveLength(1);
      expect(proposals[0].title).toBe('Fresh rule');
    });

    it('should NOT deduplicate against deferred proposals', async () => {
      const proposer = new RuleProposer(TEST_DIR);

      const dateDir = path.join(PROPOSALS_DIR, '2026-02-10');
      await fs.mkdir(dateDir, { recursive: true });
      const existingProposal = {
        id: 'prop-old-789ghi',
        title: 'Deferred rule',
        status: 'deferred',
        type: 'add_to_claude_md',
        created: '2026-02-10T10:00:00Z',
      };
      await fs.writeFile(
        path.join(dateDir, 'prop-old-789ghi.yaml'),
        yaml.stringify(existingProposal),
        'utf-8',
      );

      const candidates = [
        createCandidate({ rule: 'Deferred rule' }),
      ];

      const proposals = await proposer.generateProposals(candidates);
      expect(proposals).toHaveLength(1);
    });
  });

  // ─── PROPOSAL TYPES ────────────────────────────────────────────

  describe('proposal types', () => {
    it('should resolve target for add_to_claude_md', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = [createCandidate({ proposed_action: 'add_to_claude_md' })];
      const proposals = await proposer.generateProposals(candidates);
      expect(proposals[0].targetFile).toBe(path.join(TEST_DIR, '.claude', 'CLAUDE.md'));
    });

    it('should resolve target for add_to_rules', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = [createCandidate({
        proposed_action: 'add_to_rules',
        rule: 'Use ESLint Config',
      })];
      const proposals = await proposer.generateProposals(candidates);
      expect(proposals[0].targetFile).toContain(path.join('.claude', 'rules'));
      expect(proposals[0].targetFile).toMatch(/\.md$/);
    });

    it('should resolve target for add_to_agent_config', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = [createCandidate({
        proposed_action: 'add_to_agent_config',
        proposed_target: '.aios-core/development/agents/dev.md',
      })];
      const proposals = await proposer.generateProposals(candidates);
      expect(proposals[0].targetFile).toContain(path.join('.claude', 'agent-memory', 'dev', 'MEMORY.md'));
    });

    it('should resolve target for create_gotcha', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = [createCandidate({
        proposed_action: 'create_gotcha',
        proposed_target: '.aios/memories/shared/durable/',
      })];
      const proposals = await proposer.generateProposals(candidates);
      expect(proposals[0].targetFile).toBe(path.join(TEST_DIR, '.aios', 'gotchas.json'));
    });

    it('should use unknown for agent config without valid agent path', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = [createCandidate({
        proposed_action: 'add_to_agent_config',
        proposed_target: 'no-agent-path',
      })];
      const proposals = await proposer.generateProposals(candidates);
      expect(proposals[0].targetFile).toContain('unknown');
    });

    it('should sanitize rule name for rules filename', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = [createCandidate({
        proposed_action: 'add_to_rules',
        rule: 'Use ESLint! Config @v2',
      })];
      const proposals = await proposer.generateProposals(candidates);
      expect(proposals[0].targetFile).toMatch(/use-eslint-config-v2\.md$/);
    });
  });

  // ─── PROPOSAL BUILDING ─────────────────────────────────────────

  describe('proposal building', () => {
    it('should create proposal with all required fields', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      const p = proposals[0];

      expect(p.id).toMatch(/^prop-/);
      expect(p.type).toBe('add_to_claude_md');
      expect(p.title).toBe('Use npm not yarn');
      expect(p.summary).toBe('User corrected yarn to npm in 5 sessions');
      expect(p.confidence).toBeGreaterThan(0);
      expect(p.evidenceCount).toBe(6);
      expect(p.targetFile).toBeTruthy();
      expect(p.proposedContent).toBeTruthy();
      expect(p.diff).toContain('+');
      expect(p.sourceMemories).toHaveLength(2);
      expect(p.status).toBe('pending');
      expect(p.created).toBeTruthy();
    });

    it('should generate unique IDs for each proposal', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = [
        createCandidate({ rule: 'Rule 1' }),
        createCandidate({ rule: 'Rule 2' }),
      ];
      const proposals = await proposer.generateProposals(candidates);
      expect(proposals[0].id).not.toBe(proposals[1].id);
    });

    it('should generate diff with + prefix for each line', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate({
        proposed_content: 'Line 1\nLine 2\nLine 3',
      })]);
      expect(proposals[0].diff).toBe('+ Line 1\n+ Line 2\n+ Line 3');
    });
  });

  // ─── PRESENTATION ──────────────────────────────────────────────

  describe('presentProposals', () => {
    it('should return no-proposals message for empty array', () => {
      const proposer = new RuleProposer(TEST_DIR);
      const result = proposer.presentProposals([]);
      expect(result.text).toContain('No evolution proposals pending');
      expect(result.proposals).toEqual([]);
    });

    it('should format proposals for display', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      const result = proposer.presentProposals(proposals);

      expect(result.text).toContain('Evolution Proposal 1/1');
      expect(result.text).toContain('Use npm not yarn');
      expect(result.text).toContain('95%');
      expect(result.text).toContain('[Approve]');
      expect(result.text).toContain('[Reject]');
      expect(result.text).toContain('[Defer]');
      expect(result.proposals).toHaveLength(1);
    });

    it('should show correct numbering for multiple proposals', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([
        createCandidate({ rule: 'Rule A' }),
        createCandidate({ rule: 'Rule B' }),
      ]);
      const result = proposer.presentProposals(proposals);
      expect(result.text).toContain('1/2');
      expect(result.text).toContain('2/2');
    });
  });

  // ─── APPROVAL GATE ─────────────────────────────────────────────

  describe('approveProposal', () => {
    let proposer;
    let proposal;

    beforeEach(async () => {
      proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      proposal = proposals[0];
      await proposer._saveProposal(proposal);
    });

    it('should apply proposal to CLAUDE.md', async () => {
      // Create target file
      await fs.mkdir(path.dirname(CLAUDE_MD_PATH), { recursive: true });
      await fs.writeFile(CLAUDE_MD_PATH, '# My CLAUDE.md\n\nExisting content.\n', 'utf-8');

      const result = await proposer.approveProposal(proposal.id);
      expect(result.status).toBe('approved');
      expect(result.appliedAt).toBeDefined();

      const content = await fs.readFile(CLAUDE_MD_PATH, 'utf-8');
      expect(content).toContain('Always use `npm`');
    });

    it('should create backup before modification', async () => {
      await fs.mkdir(path.dirname(CLAUDE_MD_PATH), { recursive: true });
      await fs.writeFile(CLAUDE_MD_PATH, 'Original content', 'utf-8');

      const result = await proposer.approveProposal(proposal.id);
      expect(result.backupPath).toBeTruthy();

      const backupContent = await fs.readFile(result.backupPath, 'utf-8');
      expect(backupContent).toBe('Original content');
    });

    it('should create target file if it does not exist', async () => {
      const result = await proposer.approveProposal(proposal.id);
      expect(result.status).toBe('approved');

      const content = await fs.readFile(CLAUDE_MD_PATH, 'utf-8');
      expect(content).toContain('npm');
    });

    it('should throw for non-existent proposal', async () => {
      await expect(proposer.approveProposal('non-existent'))
        .rejects.toThrow('Proposal not found');
    });

    it('should throw for non-pending proposal', async () => {
      await proposer.approveProposal(proposal.id);
      await expect(proposer.approveProposal(proposal.id))
        .rejects.toThrow('not pending');
    });

    it('should log audit event on approval', async () => {
      await proposer.approveProposal(proposal.id);
      const audit = await proposer.getAuditTrail();
      const approvalEvent = audit.find(e => e.action === 'approved' && e.proposalId === proposal.id);
      expect(approvalEvent).toBeDefined();
    });
  });

  // ─── APPLICATION ENGINE ─────────────────────────────────────────

  describe('application engine', () => {
    let proposer;

    beforeEach(async () => {
      proposer = new RuleProposer(TEST_DIR);
    });

    it('should apply add_to_rules by creating new rule file', async () => {
      const proposals = await proposer.generateProposals([
        createCandidate({
          proposed_action: 'add_to_rules',
          rule: 'Test Rule',
          proposed_content: 'Always test your code.',
        }),
      ]);
      await proposer._saveProposal(proposals[0]);

      await proposer.approveProposal(proposals[0].id);

      const content = await fs.readFile(proposals[0].targetFile, 'utf-8');
      expect(content).toContain('# Test Rule');
      expect(content).toContain('Always test your code');
      expect(content).toContain('paths:');
    });

    it('should apply add_to_agent_config by creating memory file', async () => {
      const proposals = await proposer.generateProposals([
        createCandidate({
          proposed_action: 'add_to_agent_config',
          proposed_target: '.aios-core/development/agents/dev.md',
          proposed_content: '## Preference\n\nUse npm.',
        }),
      ]);
      await proposer._saveProposal(proposals[0]);

      await proposer.approveProposal(proposals[0].id);

      const content = await fs.readFile(proposals[0].targetFile, 'utf-8');
      expect(content).toContain('Use npm');
    });

    it('should apply create_gotcha by adding to gotchas.json', async () => {
      const proposals = await proposer.generateProposals([
        createCandidate({
          proposed_action: 'create_gotcha',
          rule: 'Windows path gotcha',
          proposed_content: 'Use path.join instead of string concatenation.',
        }),
      ]);
      await proposer._saveProposal(proposals[0]);

      await proposer.approveProposal(proposals[0].id);

      const content = await fs.readFile(GOTCHAS_PATH, 'utf-8');
      const gotchas = JSON.parse(content);
      expect(gotchas).toHaveLength(1);
      expect(gotchas[0].pattern).toBe('Windows path gotcha');
      expect(gotchas[0].source).toBe('auto-evolution');
    });

    it('should append to existing gotchas.json', async () => {
      await fs.mkdir(path.dirname(GOTCHAS_PATH), { recursive: true });
      await fs.writeFile(GOTCHAS_PATH, JSON.stringify([{ pattern: 'existing', message: 'old' }]), 'utf-8');

      const proposals = await proposer.generateProposals([
        createCandidate({
          proposed_action: 'create_gotcha',
          rule: 'New gotcha',
          proposed_content: 'New message.',
        }),
      ]);
      await proposer._saveProposal(proposals[0]);

      await proposer.approveProposal(proposals[0].id);

      const gotchas = JSON.parse(await fs.readFile(GOTCHAS_PATH, 'utf-8'));
      expect(gotchas).toHaveLength(2);
    });

    it('should append to existing CLAUDE.md content', async () => {
      await fs.mkdir(path.dirname(CLAUDE_MD_PATH), { recursive: true });
      await fs.writeFile(CLAUDE_MD_PATH, '# CLAUDE.md\n\n## Existing Section\n\nContent here.\n', 'utf-8');

      const proposals = await proposer.generateProposals([createCandidate()]);
      await proposer._saveProposal(proposals[0]);

      await proposer.approveProposal(proposals[0].id);

      const content = await fs.readFile(CLAUDE_MD_PATH, 'utf-8');
      expect(content).toContain('## Existing Section');
      expect(content).toContain('Always use `npm`');
    });
  });

  // ─── ROLLBACK ──────────────────────────────────────────────────

  describe('rollbackProposal', () => {
    it('should restore file from backup', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      await fs.mkdir(path.dirname(CLAUDE_MD_PATH), { recursive: true });
      await fs.writeFile(CLAUDE_MD_PATH, 'Original content', 'utf-8');

      const proposals = await proposer.generateProposals([createCandidate()]);
      await proposer._saveProposal(proposals[0]);
      await proposer.approveProposal(proposals[0].id);

      // Verify modification was applied
      let content = await fs.readFile(CLAUDE_MD_PATH, 'utf-8');
      expect(content).toContain('npm');

      // Rollback
      const result = await proposer.rollbackProposal(proposals[0].id);
      expect(result.status).toBe('rolled_back');
      expect(result.rolledBackAt).toBeDefined();

      // Verify original content restored
      content = await fs.readFile(CLAUDE_MD_PATH, 'utf-8');
      expect(content).toBe('Original content');
    });

    it('should delete file if no backup exists (file was created)', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      await proposer._saveProposal(proposals[0]);
      await proposer.approveProposal(proposals[0].id);

      // The file was created (no backup), rollback should remove it
      await proposer.rollbackProposal(proposals[0].id);

      await expect(fs.access(CLAUDE_MD_PATH)).rejects.toThrow();
    });

    it('should throw for non-approved proposal', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      await proposer._saveProposal(proposals[0]);

      await expect(proposer.rollbackProposal(proposals[0].id))
        .rejects.toThrow('not approved');
    });

    it('should log audit event on rollback', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      await proposer._saveProposal(proposals[0]);
      await proposer.approveProposal(proposals[0].id);
      await proposer.rollbackProposal(proposals[0].id);

      const audit = await proposer.getAuditTrail();
      expect(audit.some(e => e.action === 'rolled_back')).toBe(true);
    });
  });

  // ─── REJECTION FEEDBACK LOOP ───────────────────────────────────

  describe('rejectProposal', () => {
    let proposer;
    let proposal;

    beforeEach(async () => {
      proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      proposal = proposals[0];
      await proposer._saveProposal(proposal);
    });

    it('should mark proposal as rejected', async () => {
      const result = await proposer.rejectProposal(proposal.id, 'Not relevant');
      expect(result.status).toBe('rejected');
      expect(result.rejectionReason).toBe('Not relevant');
      expect(result.rejectedAt).toBeDefined();
    });

    it('should store confidence override on rejection', async () => {
      await proposer.rejectProposal(proposal.id, 'Not relevant');
      const overrides = await proposer._loadConfidenceOverrides();
      expect(overrides[proposal.title]).toBe(0.3);
    });

    it('should accumulate confidence penalties on multiple rejections', async () => {
      // First rejection
      await proposer.rejectProposal(proposal.id, 'R1');

      // Create second proposal with same rule
      const proposals2 = await proposer.generateProposals([
        createCandidate({ rule: proposal.title }),
      ]);
      // Since rule was just rejected, it's deduplicated. Test override accumulation directly.
      await proposer._applyConfidenceOverride(proposal.title, proposer.rejectionPenalty);

      const overrides = await proposer._loadConfidenceOverrides();
      expect(overrides[proposal.title]).toBe(0.6); // 0.3 + 0.3
    });

    it('should blacklist rule after threshold rejections', async () => {
      const proposer2 = new RuleProposer(TEST_DIR, { blacklistThreshold: 2 });

      // Manually create and save two proposals with same title, then reject both
      for (let i = 0; i < 2; i++) {
        const id = `prop-blacklist-${i}`;
        const pendingProposal = {
          id,
          type: 'add_to_claude_md',
          title: 'Persistent rule',
          summary: 'test',
          confidence: 0.95,
          originalConfidence: 0.95,
          evidenceCount: 6,
          targetFile: CLAUDE_MD_PATH,
          proposedContent: 'content',
          insertionPoint: 'end',
          diff: '+ content',
          sourceMemories: [],
          status: PROPOSAL_STATUSES.PENDING,
          created: new Date().toISOString(),
        };
        await proposer2._saveProposal(pendingProposal);
        await proposer2.rejectProposal(id, `Rejection ${i + 1}`);
      }

      const blacklist = await proposer2.getBlacklist();
      expect(blacklist).toContain('Persistent rule');
    });

    it('should throw for non-existent proposal', async () => {
      await expect(proposer.rejectProposal('non-existent', 'reason'))
        .rejects.toThrow('Proposal not found');
    });

    it('should log audit event on rejection', async () => {
      await proposer.rejectProposal(proposal.id, 'Not needed');
      const audit = await proposer.getAuditTrail();
      const event = audit.find(e => e.action === 'rejected');
      expect(event).toBeDefined();
      expect(event.reason).toBe('Not needed');
    });
  });

  // ─── DEFER ─────────────────────────────────────────────────────

  describe('deferProposal', () => {
    it('should mark proposal as deferred', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      await proposer._saveProposal(proposals[0]);

      const result = await proposer.deferProposal(proposals[0].id);
      expect(result.status).toBe('deferred');
      expect(result.deferredAt).toBeDefined();
    });

    it('should throw for non-pending proposal', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      await proposer._saveProposal(proposals[0]);
      await proposer.deferProposal(proposals[0].id);

      await expect(proposer.deferProposal(proposals[0].id))
        .rejects.toThrow('not pending');
    });
  });

  // ─── BLACKLIST ─────────────────────────────────────────────────

  describe('blacklist management', () => {
    it('should return empty blacklist initially', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const blacklist = await proposer.getBlacklist();
      expect(blacklist).toEqual([]);
    });

    it('should clear blacklist', async () => {
      const proposer = new RuleProposer(TEST_DIR);

      // Add to blacklist
      await proposer._addToBlacklist('Rule 1');
      await proposer._addToBlacklist('Rule 2');

      let blacklist = await proposer.getBlacklist();
      expect(blacklist).toHaveLength(2);

      await proposer.clearBlacklist();
      blacklist = await proposer.getBlacklist();
      expect(blacklist).toEqual([]);
    });

    it('should not duplicate entries in blacklist', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      await proposer._addToBlacklist('Rule 1');
      await proposer._addToBlacklist('Rule 1');

      const blacklist = await proposer.getBlacklist();
      expect(blacklist).toEqual(['Rule 1']);
    });
  });

  // ─── OVERRIDES ─────────────────────────────────────────────────

  describe('confidence overrides', () => {
    it('should return empty overrides initially', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const overrides = await proposer._loadConfidenceOverrides();
      expect(overrides).toEqual({});
    });

    it('should clear overrides', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      await proposer._applyConfidenceOverride('Rule A', 0.3);

      let overrides = await proposer._loadConfidenceOverrides();
      expect(overrides['Rule A']).toBe(0.3);

      await proposer.clearOverrides();
      overrides = await proposer._loadConfidenceOverrides();
      expect(overrides).toEqual({});
    });
  });

  // ─── PROPOSAL HISTORY ──────────────────────────────────────────

  describe('proposal history', () => {
    it('should return empty history when no proposals exist', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const history = await proposer.getProposalHistory();
      expect(history).toEqual([]);
    });

    it('should save and retrieve proposals', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      await proposer._saveProposal(proposals[0]);

      const retrieved = await proposer.getProposal(proposals[0].id);
      expect(retrieved).toBeTruthy();
      expect(retrieved.id).toBe(proposals[0].id);
      expect(retrieved.title).toBe(proposals[0].title);
    });

    it('should filter history by status', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([
        createCandidate({ rule: 'Rule A' }),
        createCandidate({ rule: 'Rule B' }),
      ]);

      // Save both as pending
      await proposer._saveProposal(proposals[0]);
      await proposer._saveProposal(proposals[1]);

      // Approve one
      await proposer.approveProposal(proposals[0].id);

      const approved = await proposer.getProposalHistory({ status: 'approved' });
      expect(approved).toHaveLength(1);
      expect(approved[0].title).toBe('Rule A');
    });

    it('should filter history by type', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([
        createCandidate({ rule: 'A', proposed_action: 'add_to_claude_md' }),
        createCandidate({ rule: 'B', proposed_action: 'create_gotcha' }),
      ]);

      for (const p of proposals) {
        await proposer._saveProposal(p);
      }

      const gotchaProposals = await proposer.getProposalHistory({ type: 'create_gotcha' });
      expect(gotchaProposals).toHaveLength(1);
      expect(gotchaProposals[0].type).toBe('create_gotcha');
    });

    it('should return null for non-existent proposal', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const result = await proposer.getProposal('non-existent-id');
      expect(result).toBeNull();
    });
  });

  // ─── STATISTICS ────────────────────────────────────────────────

  describe('getStats', () => {
    it('should return zero stats when no proposals exist', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const stats = await proposer.getStats();
      expect(stats.total).toBe(0);
      expect(stats.approved).toBe(0);
      expect(stats.rejected).toBe(0);
      expect(stats.acceptanceRate).toBe(0);
    });

    it('should calculate correct statistics', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([
        createCandidate({ rule: 'Approve me' }),
        createCandidate({ rule: 'Reject me' }),
        createCandidate({ rule: 'Defer me' }),
      ]);

      for (const p of proposals) {
        await proposer._saveProposal(p);
      }

      await proposer.approveProposal(proposals[0].id);
      await proposer.rejectProposal(proposals[1].id, 'nope');
      await proposer.deferProposal(proposals[2].id);

      const stats = await proposer.getStats();
      expect(stats.total).toBe(3);
      expect(stats.approved).toBe(1);
      expect(stats.rejected).toBe(1);
      expect(stats.deferred).toBe(1);
      expect(stats.acceptanceRate).toBeCloseTo(0.333, 2);
      expect(stats.rejectionRate).toBeCloseTo(0.333, 2);
    });

    it('should break down stats by type', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([
        createCandidate({ rule: 'MD rule', proposed_action: 'add_to_claude_md' }),
        createCandidate({ rule: 'Gotcha rule', proposed_action: 'create_gotcha' }),
      ]);

      for (const p of proposals) {
        await proposer._saveProposal(p);
      }

      const stats = await proposer.getStats();
      expect(stats.byType.add_to_claude_md.total).toBe(1);
      expect(stats.byType.create_gotcha.total).toBe(1);
    });
  });

  // ─── AUDIT TRAIL ──────────────────────────────────────────────

  describe('audit trail', () => {
    it('should return empty audit initially', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const audit = await proposer.getAuditTrail();
      expect(audit).toEqual([]);
    });

    it('should track all actions in chronological order', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([
        createCandidate({ rule: 'Rule A' }),
        createCandidate({ rule: 'Rule B' }),
      ]);

      for (const p of proposals) {
        await proposer._saveProposal(p);
      }

      await proposer.approveProposal(proposals[0].id);
      await proposer.rejectProposal(proposals[1].id, 'nope');

      const audit = await proposer.getAuditTrail();
      expect(audit).toHaveLength(2);
      expect(audit[0].action).toBe('approved');
      expect(audit[1].action).toBe('rejected');
      expect(audit[0].timestamp).toBeTruthy();
      expect(audit[1].timestamp).toBeTruthy();
    });
  });

  // ─── PERFORMANCE ──────────────────────────────────────────────

  describe('performance', () => {
    it('should generate proposals in < 500ms for 20 candidates', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const candidates = Array.from({ length: 20 }, (_, i) =>
        createCandidate({ rule: `Rule ${i}`, confidence: 0.95, evidence_count: 6 }),
      );

      const start = Date.now();
      const proposals = await proposer.generateProposals(candidates);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500);
      expect(proposals.length).toBe(20);
    });

    it('should apply proposal in < 200ms', async () => {
      const proposer = new RuleProposer(TEST_DIR);
      const proposals = await proposer.generateProposals([createCandidate()]);
      await proposer._saveProposal(proposals[0]);

      const start = Date.now();
      await proposer.approveProposal(proposals[0].id);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(200);
    });
  });

  // ─── EXPORTS ──────────────────────────────────────────────────

  describe('exports', () => {
    it('should export FEATURE_GATE_ID', () => {
      expect(FEATURE_GATE_ID).toBe('pro.memory.auto_evolution');
    });

    it('should export DEFAULTS', () => {
      expect(DEFAULTS.confidenceThreshold).toBe(0.9);
      expect(DEFAULTS.evidenceThreshold).toBe(5);
    });

    it('should export PROPOSAL_STATUSES', () => {
      expect(PROPOSAL_STATUSES.PENDING).toBe('pending');
      expect(PROPOSAL_STATUSES.APPROVED).toBe('approved');
      expect(PROPOSAL_STATUSES.REJECTED).toBe('rejected');
      expect(PROPOSAL_STATUSES.DEFERRED).toBe('deferred');
      expect(PROPOSAL_STATUSES.ROLLED_BACK).toBe('rolled_back');
    });

    it('should export VALID_ACTIONS', () => {
      expect(VALID_ACTIONS).toContain('add_to_claude_md');
      expect(VALID_ACTIONS).toContain('add_to_rules');
      expect(VALID_ACTIONS).toContain('add_to_agent_config');
      expect(VALID_ACTIONS).toContain('create_gotcha');
    });
  });
});
