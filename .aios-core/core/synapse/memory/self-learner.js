/**
 * Self-Learning Engine - MIS-5
 *
 * Evolution Layer (Camada 4) of the Memory Intelligence System.
 * Analyzes session digests, extracts corrections/patterns/heuristics with
 * confidence scoring, promotes/demotes memories between tiers.
 *
 * Components:
 * 1. Correction Tracker - Detects and aggregates corrections from digests
 * 2. Evidence Accumulator - Persists evidence counts across sessions
 * 3. Confidence Scorer - Multi-factor formula with tier-based decay
 * 4. Tier Promoter - Promotes/demotes memories based on thresholds
 * 5. Heuristic Extractor - Identifies rule candidates for MIS-7
 * 6. Gotcha Auto-Promoter - Error 3x+ becomes auto-gotcha
 *
 * @module core/synapse/memory/self-learner
 * @see Story MIS-5 - Self-Learning Engine
 * @see docs/guides/MEMORY-INTELLIGENCE-SYSTEM.md - Camada 4: Evolution Layer
 */

'use strict';

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const { performance } = require('perf_hooks');

/**
 * Decay rates per tier (per day)
 * Session memories decay fastest, durable slowest
 */
const DECAY_RATES = {
  session: 0.5,
  daily: 0.1,
  durable: 0.01,
};

/**
 * Tier thresholds for classification
 */
const TIER_THRESHOLDS = {
  hot: 0.7,
  warm: 0.3,
  archive: 0.1,
  archiveDays: 90,
};

/**
 * Heuristic extraction thresholds
 */
const HEURISTIC_THRESHOLDS = {
  confidence: 0.9,
  evidence: 5,
};

/**
 * Gotcha auto-promotion threshold
 */
const GOTCHA_THRESHOLD = 3;

/**
 * Feature gate ID for self-learning
 */
const FEATURE_GATE_ID = 'pro.memory.self_learning';

/**
 * Self-Learning Engine
 *
 * Processes session digests to extract learnings, update memory scores,
 * promote/demote memories, and identify heuristic candidates.
 */
class SelfLearner {
  /**
   * @param {string} projectDir - Project root directory
   * @param {Object} [options] - Configuration options
   * @param {Function} [options.isFeatureEnabled] - Feature gate check function
   */
  constructor(projectDir, options = {}) {
    this.projectDir = projectDir || process.cwd();
    this.digestsDir = path.join(this.projectDir, '.aios', 'session-digests');
    this.memoriesDir = path.join(this.projectDir, '.aios', 'memories');
    this.evidencePath = path.join(this.memoriesDir, 'learning', 'evidence.json');
    this.gotchaDir = path.join(this.memoriesDir, 'shared', 'durable');
    this.isFeatureEnabled = options.isFeatureEnabled || (() => true);

    // Internal state
    this._evidence = null;
    this._stats = {
      corrections_found: 0,
      heuristics_extracted: 0,
      heuristics_persisted: 0,
      promotions: 0,
      demotions: 0,
      gotchas_created: 0,
      last_run: null,
      memories_written_session: 0,
      memories_written_daily: 0,
    };
    this._heuristicCandidates = [];
  }

  /**
   * Execute full learning cycle
   *
   * Flow:
   * 1. Load all digests
   * 2. Correction Tracker: scan for corrections
   * 3. Evidence Accumulator: persist updated evidence
   * 4. Confidence Scorer: recalculate all memory scores
   * 5. Tier Promoter: check promotion/demotion rules
   * 6. Heuristic Extractor: identify rule candidates
   * 7. Gotcha Auto-Promoter: check for repeated errors
   * 8. Return stats and heuristic candidates
   *
   * @param {Object} [options] - Run options
   * @param {boolean} [options.dryRun=false] - If true, don't write changes to disk
   * @param {boolean} [options.verbose=false] - If true, log detailed progress
   * @param {string} [options.agentFilter] - Only process memories for this agent
   * @returns {Promise<Object>} Run result with stats and heuristic candidates
   */
  async run(options = {}) {
    const { dryRun = false, verbose = false, agentFilter } = options;
    const startTime = performance.now();

    // Feature gate check
    if (!this.isFeatureEnabled(FEATURE_GATE_ID)) {
      return {
        skipped: true,
        reason: `Feature gate ${FEATURE_GATE_ID} is not enabled`,
        stats: this._stats,
      };
    }

    // Reset stats for this run
    this._stats = {
      corrections_found: 0,
      heuristics_extracted: 0,
      heuristics_persisted: 0,
      promotions: 0,
      demotions: 0,
      gotchas_created: 0,
      last_run: new Date().toISOString(),
      memories_written_session: 0,
      memories_written_daily: 0,
    };
    this._heuristicCandidates = [];

    try {
      // 1. Load evidence store
      const evidence = await this._loadEvidence();

      // 2. Load all digests
      const digests = await this._loadDigests();
      if (verbose) {
        console.log(`[SelfLearner] Loaded ${digests.length} digests`);
      }

      // 3. Correction Tracker: scan and group corrections
      const corrections = this._trackCorrections(digests, evidence);
      this._stats.corrections_found = corrections.length;
      if (verbose) {
        console.log(`[SelfLearner] Found ${corrections.length} corrections`);
      }

      // 4. Evidence Accumulator: update evidence counts
      this._accumulateEvidence(digests, evidence);

      // 5. Load all memories for score recalculation
      const memories = await this._loadMemories(agentFilter);
      if (verbose) {
        console.log(`[SelfLearner] Loaded ${memories.length} memories for recalculation`);
      }

      // 6. Confidence Scorer: recalculate all scores
      const currentTime = Date.now();
      const scoredMemories = this._recalculateAllScores(memories, evidence, currentTime);

      // 7. Tier Promoter: check promotion/demotion rules
      const tierChanges = this._applyTierChanges(scoredMemories);
      this._stats.promotions = tierChanges.filter(c => c.direction === 'promoted').length;
      this._stats.demotions = tierChanges.filter(c => c.direction === 'demoted').length;
      if (verbose && tierChanges.length > 0) {
        console.log(`[SelfLearner] Tier changes: ${this._stats.promotions} promotions, ${this._stats.demotions} demotions`);
      }

      // 8. Heuristic Extractor: identify rule candidates
      const heuristics = this._extractHeuristics(evidence);
      this._heuristicCandidates = heuristics;
      this._stats.heuristics_extracted = heuristics.length;
      if (verbose && heuristics.length > 0) {
        console.log(`[SelfLearner] Extracted ${heuristics.length} heuristic candidates`);
      }

      // 9. Gotcha Auto-Promoter: repeated errors
      const gotchas = this._detectGotchaCandidates(evidence);
      this._stats.gotchas_created = gotchas.length;

      // 10. Persist changes (unless dry run)
      if (!dryRun) {
        await this._persistEvidence(evidence);
        await this._persistMemoryUpdates(scoredMemories);
        await this._persistGotchas(gotchas);
        const memoryCounts = await this._persistToMemoryStore(evidence, { dryRun });
        this._stats.memories_written_session = memoryCounts.session;
        this._stats.memories_written_daily = memoryCounts.daily;

        // Story 16.3: Persist heuristic candidates to durable store
        const heuristicResult = await this._persistHeuristics(heuristics, { dryRun });
        this._stats.heuristics_persisted = heuristicResult.persisted;
      }

      const duration = performance.now() - startTime;

      return {
        skipped: false,
        stats: { ...this._stats, duration_ms: Math.round(duration) },
        heuristicCandidates: heuristics,
        tierChanges,
        gotchas,
        memoriesProcessed: scoredMemories.length,
        digestsProcessed: digests.length,
      };

    } catch (error) {
      console.error('[SelfLearner] Learning run failed:', error.message);
      return {
        skipped: false,
        error: error.message,
        stats: this._stats,
      };
    }
  }

  /**
   * Recalculate attention scores without learning (no digest processing)
   *
   * @param {Object} [options] - Options
   * @param {string} [options.agentFilter] - Only recalculate for this agent
   * @param {boolean} [options.dryRun=false] - If true, don't persist changes
   * @returns {Promise<Object>} Recalculation result
   */
  async recalculateScores(options = {}) {
    const { agentFilter, dryRun = false } = options;
    const startTime = performance.now();

    try {
      const evidence = await this._loadEvidence();
      const memories = await this._loadMemories(agentFilter);
      const currentTime = Date.now();

      const scoredMemories = this._recalculateAllScores(memories, evidence, currentTime);
      const tierChanges = this._applyTierChanges(scoredMemories);

      if (!dryRun) {
        await this._persistMemoryUpdates(scoredMemories);
      }

      const duration = performance.now() - startTime;

      return {
        memoriesProcessed: scoredMemories.length,
        tierChanges,
        promotions: tierChanges.filter(c => c.direction === 'promoted').length,
        demotions: tierChanges.filter(c => c.direction === 'demoted').length,
        duration_ms: Math.round(duration),
      };

    } catch (error) {
      console.error('[SelfLearner] Score recalculation failed:', error.message);
      return {
        error: error.message,
        memoriesProcessed: 0,
      };
    }
  }

  /**
   * Get pending heuristic candidates (rule proposals for MIS-7)
   *
   * @returns {Array<Object>} Heuristic candidates in MIS-7 compatible format
   */
  getHeuristicCandidates() {
    return [...this._heuristicCandidates];
  }

  /**
   * Get learning engine statistics
   *
   * @returns {Object} Stats with corrections_found, heuristics_extracted, promotions, demotions
   */
  getStats() {
    return { ...this._stats };
  }

  // ─── CORRECTION TRACKER ─────────────────────────────────────────────

  /**
   * Scan digests for corrections and group by semantic similarity
   *
   * @param {Array<Object>} digests - Loaded digest objects
   * @param {Object} evidence - Evidence store
   * @returns {Array<Object>} Grouped corrections
   * @private
   */
  _trackCorrections(digests, evidence) {
    const allCorrections = [];

    for (const digest of digests) {
      const sessionId = digest.metadata?.session_id || 'unknown';
      const corrections = digest.corrections || [];

      for (const correctionText of corrections) {
        allCorrections.push({
          text: correctionText,
          session: sessionId,
          timestamp: digest.metadata?.timestamp || new Date().toISOString(),
        });
      }
    }

    // Group similar corrections by keyword overlap
    const groups = this._groupBySimilarity(allCorrections);

    // Update evidence for each correction group
    for (const group of groups) {
      const key = `correction:${group.key}`;

      if (!evidence.corrections) {
        evidence.corrections = {};
      }

      if (!evidence.corrections[key]) {
        evidence.corrections[key] = {
          type: 'user-correction',
          text: group.representative,
          evidence_count: 0,
          sessions: [],
          first_seen: group.items[0].timestamp,
          last_seen: group.items[0].timestamp,
        };
      }

      const entry = evidence.corrections[key];
      const newSessions = group.items
        .map(i => i.session)
        .filter(s => !entry.sessions.includes(s));

      entry.sessions = [...entry.sessions, ...newSessions];
      entry.evidence_count += newSessions.length;
      entry.last_seen = group.items[group.items.length - 1].timestamp;
    }

    return groups;
  }

  /**
   * Group items by keyword overlap similarity
   *
   * @param {Array<Object>} items - Items with text property
   * @returns {Array<Object>} Groups with key, representative, and items
   * @private
   */
  _groupBySimilarity(items) {
    if (items.length === 0) return [];

    const groups = [];

    for (const item of items) {
      const keywords = this._extractKeywords(item.text);
      let matched = false;

      for (const group of groups) {
        const groupKeywords = this._extractKeywords(group.representative);
        const overlap = this._calculateKeywordOverlap(keywords, groupKeywords);

        if (overlap >= 0.5) {
          group.items.push(item);
          matched = true;
          break;
        }
      }

      if (!matched) {
        const key = keywords.slice(0, 3).join('-') || `item-${groups.length}`;
        groups.push({
          key,
          representative: item.text,
          items: [item],
        });
      }
    }

    return groups;
  }

  /**
   * Extract keywords from text (lowercase, alpha-numeric, > 3 chars)
   *
   * @param {string} text - Input text
   * @returns {Array<string>} Keywords
   * @private
   */
  _extractKeywords(text) {
    if (!text || typeof text !== 'string') return [];

    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);
  }

  /**
   * Calculate keyword overlap ratio between two keyword arrays
   *
   * @param {Array<string>} keywords1 - First set
   * @param {Array<string>} keywords2 - Second set
   * @returns {number} Overlap ratio (0-1)
   * @private
   */
  _calculateKeywordOverlap(keywords1, keywords2) {
    if (keywords1.length === 0 || keywords2.length === 0) return 0;

    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = [...set1].filter(k => set2.has(k));
    const union = new Set([...set1, ...set2]);

    return intersection.length / union.size;
  }

  // ─── EVIDENCE ACCUMULATOR ───────────────────────────────────────────

  /**
   * Accumulate evidence from digests (patterns, axioms)
   *
   * @param {Array<Object>} digests - Loaded digest objects
   * @param {Object} evidence - Evidence store (mutated)
   * @private
   */
  _accumulateEvidence(digests, evidence) {
    if (!evidence.patterns) evidence.patterns = {};
    if (!evidence.axioms) evidence.axioms = {};
    if (!evidence.errors) evidence.errors = {};

    for (const digest of digests) {
      const sessionId = digest.metadata?.session_id || 'unknown';
      const timestamp = digest.metadata?.timestamp || new Date().toISOString();

      // Process patterns
      const patterns = digest.patterns || [];
      for (const pattern of patterns) {
        const key = `pattern:${this._extractKeywords(pattern).slice(0, 3).join('-') || 'unknown'}`;

        if (!evidence.patterns[key]) {
          evidence.patterns[key] = {
            type: 'pattern-repeat',
            text: pattern,
            evidence_count: 0,
            sessions: [],
            first_seen: timestamp,
            last_seen: timestamp,
          };
        }

        const entry = evidence.patterns[key];
        if (!entry.sessions.includes(sessionId)) {
          entry.sessions.push(sessionId);
          entry.evidence_count++;
          entry.last_seen = timestamp;
        }
      }

      // Process axioms
      const axioms = digest.axioms || [];
      for (const axiom of axioms) {
        const key = `axiom:${this._extractKeywords(axiom).slice(0, 3).join('-') || 'unknown'}`;

        if (!evidence.axioms[key]) {
          evidence.axioms[key] = {
            type: 'axiom-confirmed',
            text: axiom,
            evidence_count: 0,
            sessions: [],
            first_seen: timestamp,
            last_seen: timestamp,
          };
        }

        const entry = evidence.axioms[key];
        if (!entry.sessions.includes(sessionId)) {
          entry.sessions.push(sessionId);
          entry.evidence_count++;
          entry.last_seen = timestamp;
        }
      }

      // Process corrections as potential errors (for gotcha detection)
      const corrections = digest.corrections || [];
      for (const correction of corrections) {
        const keywords = this._extractKeywords(correction);
        const key = `error:${keywords.slice(0, 3).join('-') || 'unknown'}`;

        if (!evidence.errors[key]) {
          evidence.errors[key] = {
            type: 'gotcha-repeat',
            text: correction,
            evidence_count: 0,
            sessions: [],
            first_seen: timestamp,
            last_seen: timestamp,
          };
        }

        const entry = evidence.errors[key];
        if (!entry.sessions.includes(sessionId)) {
          entry.sessions.push(sessionId);
          entry.evidence_count++;
          entry.last_seen = timestamp;
        }
      }
    }
  }

  // ─── CONFIDENCE SCORER ──────────────────────────────────────────────

  /**
   * Calculate confidence score for a memory using multi-factor formula
   *
   * Formula: score = base_relevance * recency_factor * access_modifier * confidence
   * - recency_factor: exponential decay by tier
   * - access_modifier: 1 + (access_count * 0.1), capped at 2.0
   * - base_relevance: min(evidence_count / 10, 1.0)
   * - score clamped to [0.0, 1.0]
   *
   * @param {Object} memory - Memory object
   * @param {number} currentTime - Current timestamp (ms)
   * @param {Object} [evidenceData] - Evidence data for this memory
   * @returns {number} Confidence score [0.0, 1.0]
   */
  calculateConfidence(memory, currentTime, evidenceData) {
    const tier = memory.tier || 'daily';
    const accessCount = memory.access_count ?? 0;
    const confidence = memory.confidence ?? 0.3;
    const lastAccessed = memory.last_accessed
      ? new Date(memory.last_accessed).getTime()
      : currentTime;
    const evidenceCount = evidenceData?.evidence_count ?? memory.evidence_count ?? 1;

    // Decay rate per tier
    const decayRate = DECAY_RATES[tier] || DECAY_RATES.daily;

    // Days since last access
    const daysSinceAccess = Math.max(0, (currentTime - lastAccessed) / (1000 * 60 * 60 * 24));

    // Recency factor (exponential decay)
    const recencyFactor = Math.exp(-decayRate * daysSinceAccess);

    // Access modifier (capped at 2.0)
    const accessModifier = Math.min(1 + (accessCount * 0.1), 2.0);

    // Base relevance from evidence
    const baseRelevance = Math.min(evidenceCount / 10, 1.0);

    // Final score (clamped 0-1)
    const score = baseRelevance * recencyFactor * accessModifier * confidence;

    return Math.max(0, Math.min(1.0, score));
  }

  /**
   * Batch recalculate all memory attention scores
   *
   * @param {Array<Object>} memories - All loaded memories
   * @param {Object} evidence - Evidence store
   * @param {number} currentTime - Current timestamp (ms)
   * @returns {Array<Object>} Memories with updated attention_score
   * @private
   */
  _recalculateAllScores(memories, evidence, currentTime) {
    return memories.map(memory => {
      // Find matching evidence for this memory
      const evidenceData = this._findEvidenceForMemory(memory, evidence);

      const newScore = this.calculateConfidence(memory, currentTime, evidenceData);

      return {
        ...memory,
        attention_score: newScore,
        _previousScore: memory.attention_score,
        _evidenceCount: evidenceData?.evidence_count || memory.evidence_count || 0,
      };
    });
  }

  /**
   * Find evidence data matching a memory
   *
   * @param {Object} memory - Memory object
   * @param {Object} evidence - Evidence store
   * @returns {Object|null} Matching evidence entry
   * @private
   */
  _findEvidenceForMemory(memory, evidence) {
    const memoryKeywords = this._extractKeywords(
      memory.content || memory.text || memory.id || '',
    );

    if (memoryKeywords.length === 0) return null;

    // Search all evidence categories
    const allEvidence = {
      ...evidence.corrections,
      ...evidence.patterns,
      ...evidence.axioms,
    };

    let bestMatch = null;
    let bestOverlap = 0;

    for (const [, entry] of Object.entries(allEvidence)) {
      const entryKeywords = this._extractKeywords(entry.text || '');
      const overlap = this._calculateKeywordOverlap(memoryKeywords, entryKeywords);

      if (overlap > bestOverlap && overlap >= 0.3) {
        bestOverlap = overlap;
        bestMatch = entry;
      }
    }

    return bestMatch;
  }

  // ─── TIER PROMOTER ──────────────────────────────────────────────────

  /**
   * Determine tier change for a memory based on score and rules
   *
   * Rules:
   * - HOT: score > 0.7 AND confidence > 0.7 AND evidence >= 5
   * - WARM: score >= 0.3 OR access_count >= 3 OR evidence_count >= 2
   * - COLD: score >= 0.1
   * - ARCHIVE: score < 0.1 for 90+ days
   *
   * @param {Object} memory - Memory with updated attention_score
   * @returns {Object} { newTier, changed, direction, reason }
   */
  determineTierChange(memory) {
    const currentTier = memory.tier || 'cold';
    const score = memory.attention_score;
    const confidence = memory.confidence || 0;
    const evidenceCount = memory._evidenceCount || memory.evidence_count || 0;
    const accessCount = memory.access_count || 0;

    let newTier = currentTier;
    let reason = '';

    // HOT promotion: score > 0.7 AND confidence > 0.7 AND evidence >= 5
    if (score > TIER_THRESHOLDS.hot && confidence > 0.7 && evidenceCount >= 5) {
      newTier = 'hot';
      reason = `Score ${score.toFixed(2)}, confidence ${confidence}, evidence ${evidenceCount}`;
    }
    // WARM promotion: score >= 0.3 OR access_count >= 3 OR evidence_count >= 2
    else if (score >= TIER_THRESHOLDS.warm || accessCount >= 3 || evidenceCount >= 2) {
      newTier = 'warm';
      reason = score >= TIER_THRESHOLDS.warm
        ? `Score ${score.toFixed(2)} >= 0.3`
        : `access_count=${accessCount} or evidence_count=${evidenceCount}`;
    }
    // COLD: score >= 0.1 but doesn't qualify for WARM
    else if (score >= TIER_THRESHOLDS.archive) {
      newTier = 'cold';
      reason = `Score ${score.toFixed(2)} in cold range`;
    }
    // ARCHIVE or COLD: score < 0.1
    else {
      const daysBelowThreshold = this._getDaysBelowThreshold(memory, TIER_THRESHOLDS.archive);
      if (daysBelowThreshold >= TIER_THRESHOLDS.archiveDays) {
        newTier = 'archive';
        reason = `Score < 0.1 for ${daysBelowThreshold} days`;
      } else {
        newTier = 'cold';
        reason = `Score ${score.toFixed(2)}, ${daysBelowThreshold} days below threshold`;
      }
    }

    const changed = newTier !== currentTier;
    const tierOrder = { archive: 0, cold: 1, warm: 2, hot: 3 };
    const direction = changed
      ? (tierOrder[newTier] > tierOrder[currentTier] ? 'promoted' : 'demoted')
      : 'unchanged';

    return { newTier, changed, direction, reason, previousTier: currentTier };
  }

  /**
   * Apply tier changes to all scored memories
   *
   * @param {Array<Object>} scoredMemories - Memories with updated scores
   * @returns {Array<Object>} Tier change records
   * @private
   */
  _applyTierChanges(scoredMemories) {
    const changes = [];

    for (const memory of scoredMemories) {
      const change = this.determineTierChange(memory);

      if (change.changed) {
        memory.tier = change.newTier;
        memory._tierChanged = true;
        changes.push({
          id: memory.id,
          from: change.previousTier,
          to: change.newTier,
          direction: change.direction,
          reason: change.reason,
          score: memory.attention_score,
        });
      }
    }

    return changes;
  }

  /**
   * Get days a memory has been below a score threshold
   *
   * @param {Object} memory - Memory object
   * @param {number} threshold - Score threshold
   * @returns {number} Days below threshold
   * @private
   */
  _getDaysBelowThreshold(memory, threshold) {
    // Use score_below_since if tracked, otherwise estimate from last_accessed
    if (memory.score_below_since) {
      const since = new Date(memory.score_below_since).getTime();
      return Math.floor((Date.now() - since) / (1000 * 60 * 60 * 24));
    }

    // If previous score was also below threshold, estimate based on last_accessed
    if (memory._previousScore !== undefined && memory._previousScore < threshold) {
      const lastAccessed = memory.last_accessed
        ? new Date(memory.last_accessed).getTime()
        : Date.now();
      return Math.floor((Date.now() - lastAccessed) / (1000 * 60 * 60 * 24));
    }

    return 0;
  }

  // ─── HEURISTIC EXTRACTOR ────────────────────────────────────────────

  /**
   * Extract heuristic candidates from accumulated evidence
   * Threshold: confidence > 0.9 AND evidence_count >= 5
   *
   * @param {Object} evidence - Evidence store
   * @returns {Array<Object>} Heuristic candidates in MIS-7 compatible format
   * @private
   */
  _extractHeuristics(evidence) {
    const candidates = [];
    const allEvidence = {
      ...evidence.corrections,
      ...evidence.patterns,
      ...evidence.axioms,
    };

    for (const [, entry] of Object.entries(allEvidence)) {
      if (entry.evidence_count >= HEURISTIC_THRESHOLDS.evidence) {
        // Calculate confidence for this evidence entry
        const evidenceConfidence = this._calculateEvidenceConfidence(entry);

        if (evidenceConfidence > HEURISTIC_THRESHOLDS.confidence) {
          const proposedAction = this._determineProposedAction(entry);
          const timestamp = new Date().toISOString();
          const dateStr = timestamp.split('T')[0];
          const seq = String(candidates.length + 1).padStart(3, '0');

          candidates.push({
            id: `heur-${dateStr}-${seq}`,
            type: 'rule-candidate',
            rule: entry.text,
            evidence_summary: entry.sessions.map(
              (s, i) => `${entry.type} in session ${s} (${i === 0 ? entry.first_seen : entry.last_seen})`,
            ),
            confidence: evidenceConfidence,
            evidence_count: entry.evidence_count,
            proposed_action: proposedAction,
            proposed_target: this._determineProposedTarget(proposedAction),
            proposed_content: entry.text,
            source_memories: entry.sessions.slice(0, 10),
            created: timestamp,
          });
        }
      }
    }

    return candidates;
  }

  /**
   * Calculate confidence for an evidence entry based on count and recency
   *
   * @param {Object} entry - Evidence entry
   * @returns {number} Confidence [0.0, 1.0]
   * @private
   */
  _calculateEvidenceConfidence(entry) {
    // Base confidence from evidence count (saturates at 10)
    const countFactor = Math.min(entry.evidence_count / 10, 1.0);

    // Recency boost (more recent = higher confidence)
    const lastSeen = new Date(entry.last_seen).getTime();
    const daysSince = Math.max(0, (Date.now() - lastSeen) / (1000 * 60 * 60 * 24));
    const recencyFactor = Math.exp(-0.05 * daysSince);

    // Spread factor (more sessions = more reliable)
    const spreadFactor = Math.min(entry.sessions.length / 5, 1.0);

    return Math.min(countFactor * 0.5 + recencyFactor * 0.3 + spreadFactor * 0.2, 1.0);
  }

  /**
   * Determine proposed action type based on evidence type
   *
   * @param {Object} entry - Evidence entry
   * @returns {string} Proposed action
   * @private
   */
  _determineProposedAction(entry) {
    switch (entry.type) {
      case 'user-correction':
        return 'add_to_claude_md';
      case 'axiom-confirmed':
        return 'add_to_rules';
      case 'pattern-repeat':
        return 'add_to_agent_config';
      case 'gotcha-repeat':
        return 'create_gotcha';
      default:
        return 'add_to_claude_md';
    }
  }

  /**
   * Determine proposed target file based on action
   *
   * @param {string} action - Proposed action
   * @returns {string} Target file path
   * @private
   */
  _determineProposedTarget(action) {
    switch (action) {
      case 'add_to_claude_md':
        return 'MEMORY.md';
      case 'add_to_rules':
        return '.claude/rules/';
      case 'add_to_agent_config':
        return '.aios-core/development/agents/';
      case 'create_gotcha':
        return '.aios/memories/shared/durable/';
      default:
        return 'MEMORY.md';
    }
  }

  // ─── GOTCHA AUTO-PROMOTER ───────────────────────────────────────────

  /**
   * Detect corrections that qualify as auto-gotchas (3+ occurrences across sessions)
   *
   * @param {Object} evidence - Evidence store
   * @returns {Array<Object>} Gotcha candidates
   * @private
   */
  _detectGotchaCandidates(evidence) {
    const gotchas = [];

    // Check errors (corrections tracked as errors)
    const errors = evidence.errors || {};
    for (const [key, entry] of Object.entries(errors)) {
      if (entry.sessions.length >= GOTCHA_THRESHOLD) {
        gotchas.push({
          id: `gotcha-${Date.now()}-${gotchas.length}`,
          type: 'auto-gotcha',
          text: entry.text,
          frequency: entry.sessions.length,
          sessions: entry.sessions,
          first_seen: entry.first_seen,
          last_seen: entry.last_seen,
          attention_score: this._calculateGotchaScore(entry),
          tags: ['auto-gotcha', entry.type],
          source_key: key,
        });
      }
    }

    return gotchas;
  }

  /**
   * Calculate initial attention score for auto-gotcha
   * Based on frequency and recency
   *
   * @param {Object} entry - Error evidence entry
   * @returns {number} Attention score [0.0, 1.0]
   * @private
   */
  _calculateGotchaScore(entry) {
    const frequency = Math.min(entry.sessions.length / 10, 1.0);
    const lastSeen = new Date(entry.last_seen).getTime();
    const daysSince = Math.max(0, (Date.now() - lastSeen) / (1000 * 60 * 60 * 24));
    const recency = Math.exp(-0.1 * daysSince);

    return Math.min(frequency * 0.6 + recency * 0.4, 1.0);
  }

  // ─── I/O METHODS ────────────────────────────────────────────────────

  /**
   * Load evidence store from disk
   *
   * @returns {Promise<Object>} Evidence store
   * @private
   */
  async _loadEvidence() {
    if (this._evidence) return this._evidence;

    try {
      const content = await fs.readFile(this.evidencePath, 'utf8');
      this._evidence = JSON.parse(content);
    } catch {
      // No evidence file yet, start fresh
      this._evidence = {
        corrections: {},
        patterns: {},
        axioms: {},
        errors: {},
        version: 1,
        created: new Date().toISOString(),
      };
    }

    return this._evidence;
  }

  /**
   * Persist evidence store to disk
   *
   * @param {Object} evidence - Evidence store
   * @returns {Promise<void>}
   * @private
   */
  async _persistEvidence(evidence) {
    try {
      const dir = path.dirname(this.evidencePath);
      await fs.mkdir(dir, { recursive: true });

      evidence.last_updated = new Date().toISOString();
      await fs.writeFile(this.evidencePath, JSON.stringify(evidence, null, 2), 'utf8');
    } catch (error) {
      console.error('[SelfLearner] Failed to persist evidence:', error.message);
    }
  }

  /**
   * Load all digest files from .aios/session-digests/
   *
   * @returns {Promise<Array<Object>>} Parsed digest objects
   * @private
   */
  async _loadDigests() {
    const digests = [];

    try {
      await fs.mkdir(this.digestsDir, { recursive: true });
      const files = await fs.readdir(this.digestsDir);
      const digestFiles = files.filter(f => f.endsWith('.yaml') && !f.startsWith('example'));

      for (const file of digestFiles) {
        try {
          const filePath = path.join(this.digestsDir, file);
          const content = await fs.readFile(filePath, 'utf8');

          const parsed = this._parseDigest(content);
          if (parsed) {
            digests.push(parsed);
          }
        } catch (error) {
          console.warn(`[SelfLearner] Skipping corrupted digest ${file}:`, error.message);
        }
      }
    } catch (error) {
      console.warn('[SelfLearner] Failed to load digests:', error.message);
    }

    return digests;
  }

  /**
   * Parse a digest YAML file into structured object
   *
   * @param {string} content - Raw file content
   * @returns {Object|null} Parsed digest or null on failure
   * @private
   */
  _parseDigest(content) {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
      const metadata = frontmatterMatch ? yaml.load(frontmatterMatch[1]) : {};

      // Extract corrections
      const corrections = [];
      const correctionSection = content.match(/## User Corrections\n\n([\s\S]*?)(?=\n##|\n*$)/);
      if (correctionSection) {
        const lines = correctionSection[1].split('\n');
        for (const line of lines) {
          const match = line.match(/^-\s+"(.+)"$/);
          if (match && match[1] !== '(none captured)') {
            corrections.push(match[1]);
          }
        }
      }

      // Extract patterns
      const patterns = [];
      const patternSection = content.match(/## Patterns Observed\n\n([\s\S]*?)(?=\n##|\n*$)/);
      if (patternSection) {
        const lines = patternSection[1].split('\n');
        for (const line of lines) {
          const match = line.match(/^-\s+(.+)$/);
          if (match && !match[1].includes('(none identified)')) {
            patterns.push(match[1]);
          }
        }
      }

      // Extract axioms
      const axioms = [];
      const axiomSection = content.match(/## Axioms Learned\n\n([\s\S]*?)(?=\n##|\n*$)/);
      if (axiomSection) {
        const lines = axiomSection[1].split('\n');
        for (const line of lines) {
          const match = line.match(/^-\s+Axiom:\s+"(.+)"$/);
          if (match && match[1] !== '(none extracted)') {
            axioms.push(match[1]);
          }
        }
      }

      return {
        metadata,
        corrections,
        patterns,
        axioms,
        raw: content,
      };

    } catch (error) {
      console.warn('[SelfLearner] Failed to parse digest:', error.message);
      return null;
    }
  }

  /**
   * Load memory files from .aios/memories/ and session-digests index
   *
   * @param {string} [agentFilter] - Only load memories for this agent
   * @returns {Promise<Array<Object>>} Memory objects
   * @private
   */
  async _loadMemories(agentFilter) {
    const memories = [];

    try {
      // Load from session-digests index (master.json)
      const indexPath = path.join(this.digestsDir, 'index', 'master.json');
      try {
        const indexContent = await fs.readFile(indexPath, 'utf8');
        const masterIndex = JSON.parse(indexContent);

        for (const [id, entry] of Object.entries(masterIndex)) {
          if (agentFilter && entry.agent !== agentFilter && entry.agent !== 'shared') {
            continue;
          }
          memories.push({
            id,
            ...entry,
            source: 'index',
          });
        }
      } catch {
        // No index yet, skip
      }

      // Load from memories directory (durable, shared, etc.)
      const memoryDirs = ['shared/durable', 'shared/session', 'shared/daily'];
      for (const subdir of memoryDirs) {
        const dirPath = path.join(this.memoriesDir, subdir);
        try {
          const files = await fs.readdir(dirPath);
          for (const file of files) {
            if (!file.endsWith('.yaml') && !file.endsWith('.json')) continue;
            try {
              const filePath = path.join(dirPath, file);
              const content = await fs.readFile(filePath, 'utf8');
              const parsed = file.endsWith('.json')
                ? JSON.parse(content)
                : yaml.load(content);

              if (parsed && parsed.id) {
                if (agentFilter && parsed.agent !== agentFilter && parsed.agent !== 'shared') {
                  continue;
                }
                memories.push({
                  ...parsed,
                  filePath,
                  source: 'memory-file',
                });
              }
            } catch {
              // Skip corrupted files
            }
          }
        } catch {
          // Directory doesn't exist, skip
        }
      }
    } catch (error) {
      console.warn('[SelfLearner] Failed to load memories:', error.message);
    }

    return memories;
  }

  /**
   * Persist memory score updates to disk
   *
   * @param {Array<Object>} scoredMemories - Memories with updated scores
   * @returns {Promise<void>}
   * @private
   */
  async _persistMemoryUpdates(scoredMemories) {
    // Update master index with new scores
    const indexPath = path.join(this.digestsDir, 'index', 'master.json');

    try {
      let masterIndex = {};
      try {
        const content = await fs.readFile(indexPath, 'utf8');
        masterIndex = JSON.parse(content);
      } catch {
        // No index yet
      }

      let updated = false;
      for (const memory of scoredMemories) {
        if (memory.source === 'index' && masterIndex[memory.id]) {
          masterIndex[memory.id].attention_score = memory.attention_score;
          if (memory._tierChanged) {
            masterIndex[memory.id].tier = memory.tier;
          }
          updated = true;
        }

        // Update individual memory files if they exist
        if (memory.filePath && memory.source === 'memory-file') {
          try {
            const content = await fs.readFile(memory.filePath, 'utf8');
            if (memory.filePath.endsWith('.json')) {
              const data = JSON.parse(content);
              data.attention_score = memory.attention_score;
              if (memory._tierChanged) {
                data.tier = memory.tier;
              }
              await fs.writeFile(memory.filePath, JSON.stringify(data, null, 2), 'utf8');
            }
          } catch {
            // Skip files that can't be updated
          }
        }
      }

      if (updated) {
        const indexDir = path.dirname(indexPath);
        await fs.mkdir(indexDir, { recursive: true });
        await fs.writeFile(indexPath, JSON.stringify(masterIndex, null, 2), 'utf8');
      }
    } catch (error) {
      console.error('[SelfLearner] Failed to persist memory updates:', error.message);
    }
  }

  /**
   * Persist auto-gotchas to durable storage
   *
   * @param {Array<Object>} gotchas - Gotcha candidates
   * @returns {Promise<void>}
   * @private
   */
  async _persistGotchas(gotchas) {
    if (gotchas.length === 0) return;

    try {
      await fs.mkdir(this.gotchaDir, { recursive: true });

      for (const gotcha of gotchas) {
        const filename = `${gotcha.id}.json`;
        const filePath = path.join(this.gotchaDir, filename);

        // Don't overwrite existing gotchas
        try {
          await fs.access(filePath);
          continue; // File exists, skip
        } catch {
          // File doesn't exist, create it
        }

        await fs.writeFile(filePath, JSON.stringify(gotcha, null, 2), 'utf8');
      }
    } catch (error) {
      console.error('[SelfLearner] Failed to persist gotchas:', error.message);
    }
  }

  /**
   * Persist qualifying evidence entries to SYNAPSE memory stores via MemoryWriter.
   *
   * Routes evidence to session (evidence_count >= 2) and daily (evidence_count >= 3,
   * patterns/axioms only — corrections are session-only per architecture design §9).
   * Uses lazy require so SelfLearner remains loadable if MemoryWriter is unavailable.
   *
   * @param {Object} evidence - Evidence store (same shape as this._evidence)
   * @param {Object} [options] - Options
   * @param {boolean} [options.dryRun=false] - If true, skip all writes (AC-4)
   * @returns {Promise<{session: number, daily: number}>} Count of files written per tier
   * @private
   */
  async _persistToMemoryStore(evidence, options = {}) {
    const { dryRun = false } = options;

    // AC-4: dryRun guard — MemoryWriter must never be called when dryRun=true
    if (dryRun) {
      return { session: 0, daily: 0 };
    }

    // AC-5: Lazy require wrapping constructor — keeps SelfLearner loadable if 16.1 not deployed
    let writer;
    try {
      const { MemoryWriter } = require('./memory-writer');
      writer = new MemoryWriter(this.projectDir);
    } catch (err) {
      console.warn('[SelfLearner] MemoryWriter not available:', err.message);
      return { session: 0, daily: 0 };
    }

    const counts = { session: 0, daily: 0 };

    // evidence.type → memory_type mapping (architecture design doc §11)
    // gotcha-repeat (errors) are handled by _persistGotchas() — skipped here
    const EVIDENCE_TYPE_MAP = {
      'pattern-repeat': 'pattern',
      'axiom-confirmed': 'axiom',
      'user-correction': 'correction',
    };

    // Categories with their daily-tier eligibility
    // corrections are session-only (never daily) per architecture design §9
    const categories = [
      { entries: evidence.patterns || {}, allowDaily: true },
      { entries: evidence.axioms || {}, allowDaily: true },
      { entries: evidence.corrections || {}, allowDaily: false },
    ];

    for (const { entries, allowDaily } of categories) {
      for (const [, entry] of Object.entries(entries)) {
        // AC-3: Only evidence_count >= 2 qualifies for any tier
        if (entry.evidence_count < 2) continue;

        const memoryType = EVIDENCE_TYPE_MAP[entry.type];
        // Skip types not handled here (e.g., gotcha-repeat)
        if (!memoryType) continue;

        const evidenceItems = entry.sessions.map(s => `Session: ${s}`);

        // Session tier (evidence_count >= 2): patterns, axioms, corrections
        try {
          const result = await writer.write('shared', {
            type: memoryType,
            text: entry.text,
            evidence: evidenceItems,
            evidence_count: entry.evidence_count,
            confidence: 0.65,
          }, 'session');

          // AC-5: filePath: null signals write failure — log warn and continue
          if (result.filePath === null) {
            console.warn(`[SelfLearner] MemoryWriter session write returned null: ${(entry.text || '').slice(0, 40)}`);
          } else {
            counts.session++;
          }
        } catch (err) {
          console.warn('[SelfLearner] MemoryWriter.write() failed (session):', err.message);
        }

        // Daily tier (evidence_count >= 3): patterns and axioms only — corrections excluded
        if (allowDaily && entry.evidence_count >= 3) {
          try {
            const result = await writer.write('shared', {
              type: memoryType,
              text: entry.text,
              evidence: evidenceItems,
              evidence_count: entry.evidence_count,
              confidence: 0.80,
            }, 'daily');

            if (result.filePath === null) {
              console.warn(`[SelfLearner] MemoryWriter daily write returned null: ${(entry.text || '').slice(0, 40)}`);
            } else {
              counts.daily++;
            }
          } catch (err) {
            console.warn('[SelfLearner] MemoryWriter.write() failed (daily):', err.message);
          }
        }
      }
    }

    return counts;
  }

  /**
   * Persist qualifying heuristic candidates to the durable heuristics store via MemoryWriter.
   *
   * Called from run() after _extractHeuristics(). Only candidates already filtered by
   * _extractHeuristics() (confidence > 0.9, evidence_count >= 5) are passed in — no
   * threshold re-check here (AC-3).
   *
   * Deduplication is fully delegated to MemoryWriter._findDuplicate() — no own dedup (AC-4).
   *
   * @param {Object[]} heuristics - Heuristic candidates from _extractHeuristics()
   * @param {Object} [options] - Options
   * @param {boolean} [options.dryRun=false] - If true, skip all writes (AC-5)
   * @returns {Promise<{persisted: number}>} Count of successfully written files
   * @private
   */
  async _persistHeuristics(heuristics, options = {}) {
    const { dryRun = false } = options;

    // AC-5: dryRun guard — writeHeuristic must never be called when dryRun=true
    if (dryRun) {
      return { persisted: 0 };
    }

    if (heuristics.length === 0) {
      return { persisted: 0 };
    }

    // AC-6: Lazy require — consistent with _persistToMemoryStore() pattern from Story 16.2
    let MemoryWriter;
    try {
      MemoryWriter = require('./memory-writer').MemoryWriter;
    } catch (err) {
      console.warn('[SelfLearner] MemoryWriter not available for heuristic persistence:', err.message);
      return { persisted: 0 };
    }
    const writer = new MemoryWriter(this.projectDir);

    let persisted = 0;

    for (const heuristic of heuristics) {
      try {
        // AC-2: Pass full heuristic object — writeHeuristic() handles field mapping internally
        // AC-4: Deduplication delegated to MemoryWriter._findDuplicate() — no own dedup here
        const result = await writer.writeHeuristic('shared', heuristic);
        if (result.filePath === null) {
          console.warn(`[SelfLearner] Failed to persist heuristic ${heuristic.id}`);
        } else {
          persisted++;
        }
      } catch (err) {
        // AC-6: Per-entry error isolation — failure of one does not abort remaining
        console.warn(`[SelfLearner] Failed to persist heuristic ${heuristic.id}:`, err.message);
      }
    }

    return { persisted };
  }
}

/**
 * Create SelfLearner instance
 * Factory function for convenience
 *
 * @param {string} projectDir - Project directory path
 * @param {Object} [options] - Options
 * @returns {SelfLearner} Self-learner instance
 */
function createSelfLearner(projectDir, options) {
  return new SelfLearner(projectDir, options);
}

module.exports = {
  SelfLearner,
  createSelfLearner,
  DECAY_RATES,
  TIER_THRESHOLDS,
  HEURISTIC_THRESHOLDS,
  GOTCHA_THRESHOLD,
  FEATURE_GATE_ID,
};
