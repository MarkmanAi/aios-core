/**
 * Rule Proposer - MIS-7
 *
 * Auto-Evolution Layer: transforms heuristic candidates from
 * SelfLearner (MIS-5) into concrete, reviewable proposals for
 * CLAUDE.md, rules, agent configs, and gotchas.
 *
 * Constitution Article IV: NEVER auto-modify user files.
 * All proposals require explicit user approval.
 *
 * Components:
 * 1. Proposal Generator - Filters, deduplicates, and builds proposals from candidates
 * 2. Proposal Presenter - Formats proposals for clear user review
 * 3. Approval Gate - Approve/reject/defer state machine
 * 4. Application Engine - Safely applies approved proposals with backup/rollback
 * 5. Rejection Feedback - Confidence penalties, blacklist management
 * 6. History & Audit - Complete traceability of all proposal actions
 *
 * @module pro/memory/rule-proposer
 * @see Story MIS-7 - CLAUDE.md & Rules Auto-Evolution
 * @see docs/guides/MEMORY-INTELLIGENCE-SYSTEM.md - Camada 4: Evolution Layer
 */

'use strict';

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const yaml = require('yaml');

// ─── CONSTANTS ──────────────────────────────────────────────────────

/**
 * Feature gate ID for auto-evolution
 */
const FEATURE_GATE_ID = 'pro.memory.auto_evolution';

/**
 * Default configuration values
 */
const DEFAULTS = {
  confidenceThreshold: 0.9,
  evidenceThreshold: 5,
  rejectionPenalty: 0.3,
  blacklistThreshold: 3,
  timeoutMs: 1000,
};

/**
 * Valid proposal statuses
 */
const PROPOSAL_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DEFERRED: 'deferred',
  ROLLED_BACK: 'rolled_back',
};

/**
 * Valid proposed_action types from SelfLearner
 */
const VALID_ACTIONS = [
  'add_to_claude_md',
  'add_to_rules',
  'add_to_agent_config',
  'create_gotcha',
];

// ─── RULE PROPOSER ─────────────────────────────────────────────────

/**
 * Rule Proposer
 *
 * Transforms heuristic candidates from SelfLearner into actionable proposals.
 * Always requires explicit user approval before modifying any files.
 */
class RuleProposer {
  /**
   * @param {string} projectRoot - Project root directory
   * @param {Object} [options] - Configuration options
   * @param {number} [options.confidenceThreshold=0.9] - Minimum confidence to propose
   * @param {number} [options.evidenceThreshold=5] - Minimum evidence count to propose
   * @param {number} [options.rejectionPenalty=0.3] - Confidence penalty per rejection
   * @param {number} [options.blacklistThreshold=3] - Rejections before blacklisting
   * @param {number} [options.timeoutMs=1000] - Max time for proposal generation
   * @param {Function} [options.isFeatureEnabled] - Feature gate check function
   * @param {Object} [options.selfLearner] - SelfLearner instance for candidate retrieval
   */
  constructor(projectRoot, options = {}) {
    this.projectRoot = projectRoot || process.cwd();
    this.confidenceThreshold = options.confidenceThreshold ?? DEFAULTS.confidenceThreshold;
    this.evidenceThreshold = options.evidenceThreshold ?? DEFAULTS.evidenceThreshold;
    this.rejectionPenalty = options.rejectionPenalty ?? DEFAULTS.rejectionPenalty;
    this.blacklistThreshold = options.blacklistThreshold ?? DEFAULTS.blacklistThreshold;
    this.timeoutMs = options.timeoutMs ?? DEFAULTS.timeoutMs;
    this.proposalsDir = path.join(this.projectRoot, '.aios', 'memories', 'proposals');
    this.isFeatureEnabled = options.isFeatureEnabled || (() => true);
    this.selfLearner = options.selfLearner || null;
  }

  // ─── PROPOSAL GENERATION ──────────────────────────────────────────

  /**
   * Generate proposals from heuristic candidates
   *
   * Flow:
   * 1. Check feature gate
   * 2. Get candidates (from parameter, injected selfLearner, or return empty)
   * 3. Validate candidate format
   * 4. Apply confidence overrides from previous rejections
   * 5. Filter by confidence and evidence thresholds
   * 6. Remove blacklisted rules
   * 7. Deduplicate against proposal history
   * 8. Build structured proposals
   *
   * @param {Array<Object>} [candidates] - Heuristic candidates (if not provided, uses selfLearner)
   * @returns {Promise<Array<Object>>} Array of proposal objects
   */
  async generateProposals(candidates = null) {
    if (!this.isFeatureEnabled(FEATURE_GATE_ID)) {
      return [];
    }

    // Get candidates from parameter, injected selfLearner, or return empty
    if (!candidates) {
      if (this.selfLearner) {
        await this.selfLearner.learn();
        candidates = this.selfLearner.getHeuristicCandidates();
      } else {
        return [];
      }
    }

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return [];
    }

    // Validate candidate format
    const valid = candidates.filter(c => this._validateCandidate(c));

    // Load confidence overrides from previous rejections
    const overrides = await this._loadConfidenceOverrides();

    // Apply confidence penalties
    const adjusted = valid.map(c => ({
      ...c,
      _adjustedConfidence: c.confidence - (overrides[c.rule] || 0),
    }));

    // Filter by thresholds (using adjusted confidence)
    const qualified = adjusted.filter(c =>
      c._adjustedConfidence >= this.confidenceThreshold &&
      c.evidence_count >= this.evidenceThreshold,
    );

    // Load blacklist
    const blacklist = await this._loadBlacklist();

    // Load history for deduplication
    const history = await this.getProposalHistory();

    // Remove blacklisted and duplicated
    const deduped = qualified.filter(c =>
      !blacklist.includes(c.rule) &&
      !this._isDuplicate(c, history),
    );

    // Build proposals
    return deduped.map(c => this._buildProposal(c));
  }

  /**
   * Validate that a candidate has the required fields
   *
   * @param {Object} candidate - Heuristic candidate from SelfLearner
   * @returns {boolean} True if candidate is valid
   * @private
   */
  _validateCandidate(candidate) {
    if (!candidate || typeof candidate !== 'object') return false;
    if (!candidate.rule || typeof candidate.rule !== 'string') return false;
    if (typeof candidate.confidence !== 'number' || isNaN(candidate.confidence)) return false;
    if (typeof candidate.evidence_count !== 'number') return false;
    if (!VALID_ACTIONS.includes(candidate.proposed_action)) return false;
    return true;
  }

  /**
   * Build a structured proposal from a heuristic candidate
   *
   * @param {Object} candidate - Validated heuristic candidate
   * @returns {Object} Structured proposal object
   * @private
   */
  _buildProposal(candidate) {
    const id = this._generateId();
    return {
      id,
      type: candidate.proposed_action,
      title: candidate.rule,
      summary: candidate.evidence_summary || '',
      confidence: candidate._adjustedConfidence ?? candidate.confidence,
      originalConfidence: candidate.confidence,
      evidenceCount: candidate.evidence_count,
      targetFile: this._resolveTargetFile(candidate),
      proposedContent: candidate.proposed_content || '',
      insertionPoint: this._determineInsertionPoint(candidate),
      diff: this._generateDiff(candidate),
      sourceMemories: candidate.source_memories || [],
      status: PROPOSAL_STATUSES.PENDING,
      created: new Date().toISOString(),
    };
  }

  /**
   * Resolve the actual target file path for a proposal
   *
   * NOTE: MIS-5's _determineProposedTarget() returns generic paths:
   *   add_to_claude_md → 'MEMORY.md'
   *   add_to_rules → '.claude/rules/'
   *   add_to_agent_config → '.aios-core/development/agents/'
   *   create_gotcha → '.aios/memories/shared/durable/'
   *
   * RuleProposer OVERRIDES these with actual user-facing file targets.
   * Decision: RuleProposer owns target resolution because it knows
   * the actual file structure that proposals will modify.
   *
   * @param {Object} candidate - Heuristic candidate
   * @returns {string} Absolute path to target file
   * @private
   */
  _resolveTargetFile(candidate) {
    switch (candidate.proposed_action) {
      case 'add_to_claude_md':
        return path.join(this.projectRoot, '.claude', 'CLAUDE.md');

      case 'add_to_rules': {
        const filename = this._sanitizeFilename(candidate.rule) || 'auto-evolved';
        return path.join(this.projectRoot, '.claude', 'rules', `${filename}.md`);
      }

      case 'add_to_agent_config': {
        const agentId = this._extractAgentId(candidate.proposed_target);
        return path.join(this.projectRoot, '.claude', 'agent-memory', agentId, 'MEMORY.md');
      }

      case 'create_gotcha':
        return path.join(this.projectRoot, '.aios', 'gotchas.json');

      default:
        throw new Error(`Unknown proposed_action: ${candidate.proposed_action}`);
    }
  }

  /**
   * Sanitize a string for use as a filename
   *
   * @param {string} name - Raw name string
   * @returns {string|null} Sanitized filename or null
   * @private
   */
  _sanitizeFilename(name) {
    if (!name || typeof name !== 'string') return null;
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50) || null;
  }

  /**
   * Extract agent ID from a target path hint
   *
   * @param {string} target - Target path from SelfLearner
   * @returns {string} Agent ID (e.g., 'dev', 'qa')
   * @private
   */
  _extractAgentId(target) {
    if (!target || typeof target !== 'string') return 'unknown';
    const match = target.match(/agents?[/\\]([a-z][\w-]*)/i);
    if (match) return match[1].replace(/\.md$/i, '').toLowerCase();
    return 'unknown';
  }

  /**
   * Determine where to insert proposed content in the target file
   *
   * @param {Object} candidate - Heuristic candidate
   * @returns {string} Insertion point descriptor
   * @private
   */
  _determineInsertionPoint(candidate) {
    // Only claude_md benefits from section-based insertion
    if (candidate.proposed_action !== 'add_to_claude_md') {
      return 'end';
    }
    // Default to end of file — user reviews diff before approving
    return 'end';
  }

  /**
   * Generate a unified diff preview of proposed changes
   *
   * @param {Object} candidate - Heuristic candidate
   * @returns {string} Diff-style preview
   * @private
   */
  _generateDiff(candidate) {
    if (!candidate.proposed_content) return '';
    const lines = candidate.proposed_content.split('\n');
    return lines.map(line => `+ ${line}`).join('\n');
  }

  /**
   * Generate a unique proposal ID
   *
   * @returns {string} Proposal ID in format prop-{timestamp36}-{random}
   * @private
   */
  _generateId() {
    const ts = Date.now().toString(36);
    const rand = crypto.randomBytes(3).toString('hex');
    return `prop-${ts}-${rand}`;
  }

  // ─── PROPOSAL PRESENTATION ───────────────────────────────────────

  /**
   * Format proposals for clear user review
   *
   * @param {Array<Object>} proposals - Array of proposals to present
   * @returns {Object} Object with formatted text and raw proposals
   */
  presentProposals(proposals) {
    if (!proposals || proposals.length === 0) {
      return { text: 'No evolution proposals pending.', proposals: [] };
    }

    const sections = proposals.map((p, i) =>
      this._formatProposal(p, i + 1, proposals.length),
    );

    return {
      text: sections.join('\n\n'),
      proposals,
    };
  }

  /**
   * Format a single proposal for display
   *
   * @param {Object} proposal - Proposal to format
   * @param {number} index - Current index (1-based)
   * @param {number} total - Total proposals
   * @returns {string} Formatted proposal text
   * @private
   */
  _formatProposal(proposal, index, total) {
    const shortId = proposal.id.split('-').pop();
    const confidencePct = Math.round(proposal.confidence * 100);
    const relativePath = path.relative(this.projectRoot, proposal.targetFile);

    const lines = [
      `Evolution Proposal ${index}/${total} [${shortId}]`,
      '\u2500'.repeat(40),
      `Rule: ${proposal.title}`,
      `Confidence: ${confidencePct}% (${proposal.evidenceCount} evidence items)`,
      `Target: ${relativePath}`,
      `Type: ${proposal.type}`,
      '',
      'Proposed addition:',
      proposal.diff,
      '',
    ];

    if (proposal.summary) {
      lines.push(`Evidence: ${proposal.summary}`);
      lines.push('');
    }

    lines.push('[Approve] [Reject] [Defer]');
    return lines.join('\n');
  }

  // ─── APPROVAL GATE ───────────────────────────────────────────────

  /**
   * Approve and apply a proposal
   *
   * Constitution Article IV: Only applies after explicit user approval.
   * Creates backup before modification for rollback safety.
   *
   * @param {string} proposalId - ID of proposal to approve
   * @returns {Promise<Object>} Updated proposal with approved status
   * @throws {Error} If proposal not found or not in pending status
   */
  async approveProposal(proposalId) {
    const proposal = await this.getProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal not found: ${proposalId}`);
    }
    if (proposal.status !== PROPOSAL_STATUSES.PENDING) {
      throw new Error(`Proposal ${proposalId} is ${proposal.status}, not pending`);
    }

    // Backup target file before modification
    const backupPath = await this._backupFile(proposal.targetFile, proposalId);
    proposal.backupPath = backupPath;

    // Apply the modification
    await this._applyModification(proposal);

    // Update status
    proposal.status = PROPOSAL_STATUSES.APPROVED;
    proposal.appliedAt = new Date().toISOString();
    await this._saveProposal(proposal);

    // Audit trail
    await this._logAuditEvent({
      action: 'approved',
      proposalId,
      title: proposal.title,
      targetFile: proposal.targetFile,
    });

    return proposal;
  }

  /**
   * Reject a proposal with reason and confidence penalty
   *
   * Stores confidence override internally (read-only consumer of SelfLearner).
   * Penalty applied during future generateProposals() filtering.
   * After blacklistThreshold rejections, rule is blacklisted.
   *
   * @param {string} proposalId - ID of proposal to reject
   * @param {string} [reason] - Rejection reason
   * @returns {Promise<Object>} Updated proposal with rejected status
   * @throws {Error} If proposal not found or not in pending status
   */
  async rejectProposal(proposalId, reason = '') {
    const proposal = await this.getProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal not found: ${proposalId}`);
    }
    if (proposal.status !== PROPOSAL_STATUSES.PENDING) {
      throw new Error(`Proposal ${proposalId} is ${proposal.status}, not pending`);
    }

    // Store confidence override internally
    await this._applyConfidenceOverride(proposal.title, this.rejectionPenalty);

    // Update proposal
    proposal.status = PROPOSAL_STATUSES.REJECTED;
    proposal.rejectionReason = reason;
    proposal.rejectedAt = new Date().toISOString();
    await this._saveProposal(proposal);

    // Check blacklist threshold
    const rejectionCount = await this._getRejectionCount(proposal.title);
    if (rejectionCount >= this.blacklistThreshold) {
      await this._addToBlacklist(proposal.title, reason);
    }

    // Audit trail
    await this._logAuditEvent({
      action: 'rejected',
      proposalId,
      title: proposal.title,
      reason,
    });

    return proposal;
  }

  /**
   * Defer a proposal for re-presentation in a future session
   *
   * @param {string} proposalId - ID of proposal to defer
   * @returns {Promise<Object>} Updated proposal with deferred status
   * @throws {Error} If proposal not found or not in pending status
   */
  async deferProposal(proposalId) {
    const proposal = await this.getProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal not found: ${proposalId}`);
    }
    if (proposal.status !== PROPOSAL_STATUSES.PENDING) {
      throw new Error(`Proposal ${proposalId} is ${proposal.status}, not pending`);
    }

    proposal.status = PROPOSAL_STATUSES.DEFERRED;
    proposal.deferredAt = new Date().toISOString();
    await this._saveProposal(proposal);

    // Audit trail
    await this._logAuditEvent({
      action: 'deferred',
      proposalId,
      title: proposal.title,
    });

    return proposal;
  }

  // ─── APPLICATION ENGINE ──────────────────────────────────────────

  /**
   * Apply a proposal's modification to its target file
   *
   * @param {Object} proposal - Proposal to apply
   * @returns {Promise<void>}
   * @private
   */
  async _applyModification(proposal) {
    await this._ensureDir(path.dirname(proposal.targetFile));

    switch (proposal.type) {
      case 'add_to_claude_md': {
        let content = '';
        try {
          content = await fs.readFile(proposal.targetFile, 'utf-8');
        } catch {
          // File doesn't exist yet
        }

        if (proposal.insertionPoint && proposal.insertionPoint !== 'end') {
          const section = this._findSection(content, proposal.insertionPoint);
          content = this._insertAtSection(content, section, proposal.proposedContent);
        } else {
          content = content
            ? content.trimEnd() + '\n\n' + proposal.proposedContent + '\n'
            : proposal.proposedContent + '\n';
        }

        await fs.writeFile(proposal.targetFile, content, 'utf-8');
        break;
      }

      case 'add_to_rules': {
        let content = '';
        try {
          content = await fs.readFile(proposal.targetFile, 'utf-8');
        } catch {
          // New file
        }

        const ruleContent = this._formatRuleFile(proposal);
        const newContent = content
          ? content.trimEnd() + '\n\n' + ruleContent + '\n'
          : ruleContent + '\n';

        await fs.writeFile(proposal.targetFile, newContent, 'utf-8');
        break;
      }

      case 'add_to_agent_config': {
        let content = '';
        try {
          content = await fs.readFile(proposal.targetFile, 'utf-8');
        } catch {
          // New file
        }

        const newContent = content
          ? content.trimEnd() + '\n\n' + proposal.proposedContent + '\n'
          : '# Agent Memory (Auto-Evolved)\n\n' + proposal.proposedContent + '\n';

        await fs.writeFile(proposal.targetFile, newContent, 'utf-8');
        break;
      }

      case 'create_gotcha': {
        let gotchas = [];
        try {
          const raw = await fs.readFile(proposal.targetFile, 'utf-8');
          gotchas = JSON.parse(raw);
          if (!Array.isArray(gotchas)) gotchas = [];
        } catch {
          // New file or invalid JSON
        }

        gotchas.push({
          pattern: proposal.title,
          message: proposal.proposedContent,
          source: 'auto-evolution',
          proposalId: proposal.id,
          created: proposal.created,
        });

        await fs.writeFile(proposal.targetFile, JSON.stringify(gotchas, null, 2), 'utf-8');
        break;
      }

      default:
        throw new Error(`Unknown proposal type: ${proposal.type}`);
    }
  }

  /**
   * Find a section in markdown content by header
   *
   * @param {string} content - File content
   * @param {string} insertionPoint - Format "after:## Section Name"
   * @returns {Object} Section position info
   * @private
   */
  _findSection(content, insertionPoint) {
    const match = insertionPoint.match(/^after:(.+)$/);
    if (!match) {
      return { position: content.length };
    }

    const sectionHeader = match[1].trim();
    const headerIndex = content.indexOf(sectionHeader);

    if (headerIndex === -1) {
      return { position: content.length };
    }

    // Find end of section (next same-level or higher header, or end of file)
    const afterHeader = content.indexOf('\n', headerIndex);
    if (afterHeader === -1) {
      return { position: content.length };
    }

    const headerLevel = (sectionHeader.match(/^#+/) || ['##'])[0].length;
    const headerPattern = new RegExp(`^#{1,${headerLevel}} `, 'm');
    const remaining = content.substring(afterHeader + 1);
    const nextSectionMatch = remaining.search(headerPattern);
    const sectionEnd = nextSectionMatch !== -1
      ? afterHeader + 1 + nextSectionMatch
      : content.length;

    return { position: sectionEnd };
  }

  /**
   * Insert content at a section position
   *
   * @param {string} content - Original file content
   * @param {Object} section - Section position from _findSection
   * @param {string} proposedContent - Content to insert
   * @returns {string} Updated content
   * @private
   */
  _insertAtSection(content, section, proposedContent) {
    const before = content.substring(0, section.position);
    const after = content.substring(section.position);
    return before.trimEnd() + '\n\n' + proposedContent + '\n\n' + after.trimStart();
  }

  /**
   * Format a rules file with Claude Code frontmatter
   *
   * @param {Object} proposal - Proposal object
   * @returns {string} Formatted rule file content
   * @private
   */
  _formatRuleFile(proposal) {
    const lines = [
      '---',
      'paths: "**/*"',
      '---',
      '',
      `# ${proposal.title}`,
      '',
      `> Auto-evolved from ${proposal.evidenceCount} evidence items (${proposal.id})`,
      '',
      proposal.proposedContent,
    ];
    return lines.join('\n');
  }

  // ─── BACKUP & ROLLBACK ───────────────────────────────────────────

  /**
   * Create a backup of a file before modification
   *
   * @param {string} filePath - Path to file to backup
   * @param {string} proposalId - Proposal ID for unique backup name
   * @returns {Promise<string|null>} Backup path or null if file doesn't exist
   * @private
   */
  async _backupFile(filePath, proposalId) {
    try {
      await fs.access(filePath);
      const backupPath = `${filePath}.bak.${proposalId}`;
      await fs.copyFile(filePath, backupPath);
      return backupPath;
    } catch {
      // File doesn't exist yet, nothing to backup
      return null;
    }
  }

  /**
   * Rollback a previously applied proposal by restoring from backup
   *
   * @param {string} proposalId - ID of proposal to rollback
   * @returns {Promise<Object>} Updated proposal with rolled_back status
   * @throws {Error} If proposal not found or not approved
   */
  async rollbackProposal(proposalId) {
    const proposal = await this.getProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal not found: ${proposalId}`);
    }
    if (proposal.status !== PROPOSAL_STATUSES.APPROVED) {
      throw new Error(`Proposal ${proposalId} is ${proposal.status}, not approved`);
    }

    // Restore from backup
    if (proposal.backupPath) {
      await this._restoreFromBackup(proposal.targetFile, proposal.backupPath);
    } else {
      // No backup means file didn't exist before — remove it
      try {
        await fs.unlink(proposal.targetFile);
      } catch {
        // File might already be gone
      }
    }

    proposal.status = PROPOSAL_STATUSES.ROLLED_BACK;
    proposal.rolledBackAt = new Date().toISOString();
    await this._saveProposal(proposal);

    // Audit trail
    await this._logAuditEvent({
      action: 'rolled_back',
      proposalId,
      title: proposal.title,
      targetFile: proposal.targetFile,
    });

    return proposal;
  }

  /**
   * Restore a file from its backup
   *
   * @param {string} filePath - Original file path
   * @param {string} backupPath - Backup file path
   * @returns {Promise<void>}
   * @private
   */
  async _restoreFromBackup(filePath, backupPath) {
    try {
      await fs.copyFile(backupPath, filePath);
      await fs.unlink(backupPath);
    } catch (error) {
      throw new Error(`Failed to restore backup ${backupPath}: ${error.message}`);
    }
  }

  // ─── REJECTION FEEDBACK LOOP ─────────────────────────────────────

  /**
   * Apply a confidence override (penalty) for a rejected rule
   *
   * @param {string} rule - Rule title
   * @param {number} penalty - Penalty to add
   * @returns {Promise<void>}
   * @private
   */
  async _applyConfidenceOverride(rule, penalty) {
    const overrides = await this._loadConfidenceOverrides();
    overrides[rule] = (overrides[rule] || 0) + penalty;
    await this._ensureDir(this.proposalsDir);
    const overridesPath = path.join(this.proposalsDir, 'overrides.json');
    await fs.writeFile(overridesPath, JSON.stringify(overrides, null, 2), 'utf-8');
  }

  /**
   * Load confidence overrides from disk
   *
   * @returns {Promise<Object>} Map of rule → penalty value
   * @private
   */
  async _loadConfidenceOverrides() {
    const overridesPath = path.join(this.proposalsDir, 'overrides.json');
    try {
      const raw = await fs.readFile(overridesPath, 'utf-8');
      const parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    } catch {
      return {};
    }
  }

  /**
   * Count how many times a rule has been rejected
   *
   * @param {string} rule - Rule title
   * @returns {Promise<number>} Rejection count
   * @private
   */
  async _getRejectionCount(rule) {
    const history = await this.getProposalHistory();
    return history.filter(p =>
      p.title === rule &&
      p.status === PROPOSAL_STATUSES.REJECTED,
    ).length;
  }

  /**
   * Add a rule to the blacklist (never re-proposed)
   *
   * @param {string} rule - Rule title
   * @param {string} [reason] - Reason for blacklisting
   * @returns {Promise<void>}
   * @private
   */
  async _addToBlacklist(rule, reason = '') {
    const blacklistPath = path.join(this.proposalsDir, 'blacklist.json');
    let blacklist = [];
    try {
      const raw = await fs.readFile(blacklistPath, 'utf-8');
      blacklist = JSON.parse(raw);
      if (!Array.isArray(blacklist)) blacklist = [];
    } catch {
      // New file
    }

    if (!blacklist.includes(rule)) {
      blacklist.push(rule);
      await this._ensureDir(this.proposalsDir);
      await fs.writeFile(blacklistPath, JSON.stringify(blacklist, null, 2), 'utf-8');

      await this._logAuditEvent({
        action: 'blacklisted',
        rule,
        reason,
      });
    }
  }

  /**
   * Load the blacklist from disk
   *
   * @returns {Promise<Array<string>>} Array of blacklisted rule titles
   * @private
   */
  async _loadBlacklist() {
    const blacklistPath = path.join(this.proposalsDir, 'blacklist.json');
    try {
      const raw = await fs.readFile(blacklistPath, 'utf-8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Get the current blacklist
   *
   * @returns {Promise<Array<string>>} Array of blacklisted rule titles
   */
  async getBlacklist() {
    return this._loadBlacklist();
  }

  /**
   * Clear the blacklist (user-initiated)
   *
   * @returns {Promise<void>}
   */
  async clearBlacklist() {
    const blacklistPath = path.join(this.proposalsDir, 'blacklist.json');
    await this._ensureDir(this.proposalsDir);
    await fs.writeFile(blacklistPath, '[]', 'utf-8');

    await this._logAuditEvent({
      action: 'blacklist_cleared',
    });
  }

  /**
   * Clear confidence overrides (user-initiated)
   *
   * @returns {Promise<void>}
   */
  async clearOverrides() {
    const overridesPath = path.join(this.proposalsDir, 'overrides.json');
    await this._ensureDir(this.proposalsDir);
    await fs.writeFile(overridesPath, '{}', 'utf-8');

    await this._logAuditEvent({
      action: 'overrides_cleared',
    });
  }

  // ─── PROPOSAL HISTORY & AUDIT ────────────────────────────────────

  /**
   * Get a single proposal by ID
   *
   * @param {string} proposalId - Proposal ID
   * @returns {Promise<Object|null>} Proposal object or null
   */
  async getProposal(proposalId) {
    try {
      const entries = await fs.readdir(this.proposalsDir, { withFileTypes: true });
      const dateDirs = entries.filter(e =>
        e.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(e.name),
      );

      for (const dir of dateDirs) {
        const filePath = path.join(this.proposalsDir, dir.name, `${proposalId}.yaml`);
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          return yaml.parse(content);
        } catch {
          // Not in this directory
        }
      }
    } catch {
      // Proposals dir doesn't exist
    }
    return null;
  }

  /**
   * Save a proposal to disk
   *
   * @param {Object} proposal - Proposal to save
   * @returns {Promise<void>}
   * @private
   */
  async _saveProposal(proposal) {
    const date = proposal.created.split('T')[0];
    const dateDir = path.join(this.proposalsDir, date);
    await this._ensureDir(dateDir);
    const filePath = path.join(dateDir, `${proposal.id}.yaml`);
    await fs.writeFile(filePath, yaml.stringify(proposal), 'utf-8');
  }

  /**
   * Get proposal history with optional filters
   *
   * @param {Object} [filters] - Optional filters
   * @param {string} [filters.status] - Filter by status
   * @param {string} [filters.type] - Filter by proposal type
   * @param {string} [filters.since] - Filter by date (ISO string)
   * @returns {Promise<Array<Object>>} Array of proposal objects
   */
  async getProposalHistory(filters = {}) {
    const allProposals = [];
    try {
      const entries = await fs.readdir(this.proposalsDir, { withFileTypes: true });
      const dateDirs = entries.filter(e =>
        e.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(e.name),
      );

      for (const dir of dateDirs) {
        const dirPath = path.join(this.proposalsDir, dir.name);
        const files = await fs.readdir(dirPath);
        const yamlFiles = files.filter(f => f.endsWith('.yaml'));

        for (const file of yamlFiles) {
          try {
            const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
            const proposal = yaml.parse(content);
            if (proposal && proposal.id) {
              allProposals.push(proposal);
            }
          } catch {
            // Skip malformed files
          }
        }
      }
    } catch {
      // Directory might not exist yet
    }

    // Apply filters
    let result = allProposals;
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.type) {
      result = result.filter(p => p.type === filters.type);
    }
    if (filters.since) {
      const since = new Date(filters.since).getTime();
      result = result.filter(p => new Date(p.created).getTime() >= since);
    }

    return result;
  }

  /**
   * Get aggregate statistics about proposals
   *
   * @returns {Promise<Object>} Statistics object
   */
  async getStats() {
    const history = await this.getProposalHistory();
    const total = history.length;
    const approved = history.filter(p => p.status === PROPOSAL_STATUSES.APPROVED).length;
    const rejected = history.filter(p => p.status === PROPOSAL_STATUSES.REJECTED).length;
    const deferred = history.filter(p => p.status === PROPOSAL_STATUSES.DEFERRED).length;
    const pending = history.filter(p => p.status === PROPOSAL_STATUSES.PENDING).length;
    const rolledBack = history.filter(p => p.status === PROPOSAL_STATUSES.ROLLED_BACK).length;

    const byType = {};
    for (const action of VALID_ACTIONS) {
      const typeProposals = history.filter(p => p.type === action);
      byType[action] = {
        total: typeProposals.length,
        approved: typeProposals.filter(p => p.status === PROPOSAL_STATUSES.APPROVED).length,
        rejected: typeProposals.filter(p => p.status === PROPOSAL_STATUSES.REJECTED).length,
      };
    }

    return {
      total,
      approved,
      rejected,
      deferred,
      pending,
      rolledBack,
      acceptanceRate: total > 0 ? +(approved / total).toFixed(3) : 0,
      rejectionRate: total > 0 ? +(rejected / total).toFixed(3) : 0,
      byType,
    };
  }

  /**
   * Log an event to the audit trail
   *
   * @param {Object} event - Event data to log
   * @returns {Promise<void>}
   * @private
   */
  async _logAuditEvent(event) {
    const auditPath = path.join(this.proposalsDir, 'audit.json');
    let audit = [];
    try {
      const raw = await fs.readFile(auditPath, 'utf-8');
      audit = JSON.parse(raw);
      if (!Array.isArray(audit)) audit = [];
    } catch {
      // New file
    }

    audit.push({
      ...event,
      timestamp: new Date().toISOString(),
    });

    await this._ensureDir(this.proposalsDir);
    await fs.writeFile(auditPath, JSON.stringify(audit, null, 2), 'utf-8');
  }

  /**
   * Get the audit trail
   *
   * @returns {Promise<Array<Object>>} Array of audit events
   */
  async getAuditTrail() {
    const auditPath = path.join(this.proposalsDir, 'audit.json');
    try {
      const raw = await fs.readFile(auditPath, 'utf-8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  // ─── UTILITIES ───────────────────────────────────────────────────

  /**
   * Check if a candidate is a duplicate of an existing proposal
   *
   * @param {Object} candidate - Heuristic candidate
   * @param {Array<Object>} history - Proposal history
   * @returns {boolean} True if candidate is a duplicate
   * @private
   */
  _isDuplicate(candidate, history) {
    return history.some(p =>
      p.title === candidate.rule &&
      (p.status === PROPOSAL_STATUSES.APPROVED || p.status === PROPOSAL_STATUSES.REJECTED),
    );
  }

  /**
   * Ensure a directory exists, creating it recursively if needed
   *
   * @param {string} dirPath - Directory path
   * @returns {Promise<void>}
   * @private
   */
  async _ensureDir(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }
}

// ─── FACTORY ───────────────────────────────────────────────────────

/**
 * Create a RuleProposer instance
 *
 * @param {string} projectRoot - Project directory path
 * @param {Object} [options] - Options
 * @returns {RuleProposer} RuleProposer instance
 */
function createRuleProposer(projectRoot, options) {
  return new RuleProposer(projectRoot, options);
}

module.exports = {
  RuleProposer,
  createRuleProposer,
  FEATURE_GATE_ID,
  DEFAULTS,
  PROPOSAL_STATUSES,
  VALID_ACTIONS,
};
