/**
 * Synapse Memory Provider — Pro-gated MIS retrieval for SYNAPSE engine.
 *
 * Implements the provider interface consumed by MemoryBridge.
 * Feature-gated via featureGate.require('pro.memory.synapse').
 *
 * Responsibilities:
 * - Agent-scoped memory retrieval using AGENT_SECTOR_PREFERENCES
 * - Progressive disclosure layer selection based on bracket
 * - Session-level caching (keyed by agentId-bracket)
 * - Token budget respect
 *
 * @module core/synapse/memory/synapse-memory-provider
 * @version 1.0.0
 * @created Story SYN-10 - Pro Memory Bridge (Feature-Gated MIS Consumer)
 */

'use strict';

const { featureGate } = require('../license/feature-gate');
const { MemoryLoader, AGENT_SECTOR_PREFERENCES } = require('./memory-loader');

/** Default sectors for unknown agents. */
const DEFAULT_SECTORS = ['semantic'];

/**
 * Bracket → retrieval configuration.
 */
const BRACKET_CONFIG = {
  MODERATE: { layer: 1, limit: 3, minRelevance: 0.7 },
  DEPLETED: { layer: 2, limit: 5, minRelevance: 0.5 },
  CRITICAL: { layer: 3, limit: 10, minRelevance: 0.3 },
};

/**
 * Estimate token count from text.
 *
 * @param {string} text
 * @returns {number}
 */
function estimateTokens(text) {
  return Math.ceil((text || '').length / 4);
}

/**
 * SynapseMemoryProvider — Pro-gated memory retrieval.
 *
 * Provides memories from MIS for SYNAPSE engine injection.
 * Session-level caching avoids repeated MIS queries for
 * the same agent + bracket combination.
 */
class SynapseMemoryProvider {
  /**
   * @param {object} [options={}]
   * @param {string} [options.projectDir] - Project directory for MemoryLoader
   */
  constructor(options = {}) {
    // Require pro feature
    featureGate.require('pro.memory.synapse', 'SYNAPSE Memory Bridge');

    this._loader = new MemoryLoader(options.projectDir || process.cwd());
    /** @type {Map<string, Array>} Session-level cache keyed by `${agentId}-${bracket}` */
    this._cache = new Map();
  }

  /**
   * Get memories for SYNAPSE engine injection.
   *
   * Uses bracket to determine:
   * - Which MIS layer to query (1=metadata, 2=chunks, 3=full)
   * - How many results to return
   * - Minimum relevance threshold
   *
   * Results are cached per session (agentId + bracket).
   *
   * @param {string} agentId - Active agent ID
   * @param {string} bracket - Context bracket (MODERATE, DEPLETED, CRITICAL)
   * @param {number} tokenBudget - Max tokens for memory hints
   * @returns {Promise<Array<{content: string, source: string, relevance: number, tokens: number}>>}
   */
  async getMemories(agentId, bracket, tokenBudget) {
    // Cache lookup
    const cacheKey = `${agentId}-${bracket}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    // Get bracket config
    const config = BRACKET_CONFIG[bracket];
    if (!config) {
      return [];
    }

    // Get agent sectors (source of truth: memory-loader.js AGENT_SECTOR_PREFERENCES)
    const sectors = AGENT_SECTOR_PREFERENCES[agentId] || DEFAULT_SECTORS;

    // Query MIS via MemoryLoader
    const memories = await this._loader.queryMemories(agentId, {
      sectors,
      layer: config.layer,
      limit: config.limit,
      minRelevance: config.minRelevance,
      tokenBudget,
    });

    // Transform to hint format
    const hints = this._transformToHints(memories, tokenBudget);

    // Cache results
    this._cache.set(cacheKey, hints);

    return hints;
  }

  /**
   * Transform MIS memory results into hint format.
   *
   * @private
   * @param {Array} memories - Raw memories from MemoryLoader
   * @param {number} tokenBudget - Max tokens
   * @returns {Array<{content: string, source: string, relevance: number, tokens: number}>}
   */
  _transformToHints(memories, tokenBudget) {
    if (!Array.isArray(memories) || memories.length === 0) {
      return [];
    }

    const hints = [];
    let tokensUsed = 0;

    for (const memory of memories) {
      const content = memory.content || memory.summary || memory.title || '';
      const tokens = estimateTokens(content);

      if (tokensUsed + tokens > tokenBudget) {
        break;
      }

      hints.push({
        content,
        source: memory.source || memory.sector || 'memory',
        relevance: memory.relevance || memory.attention || 0,
        tokens,
      });

      tokensUsed += tokens;
    }

    return hints;
  }

  /**
   * Clear the session cache.
   */
  clearCache() {
    this._cache.clear();
  }
}

module.exports = {
  SynapseMemoryProvider,
  BRACKET_CONFIG,
  DEFAULT_SECTORS,
};
