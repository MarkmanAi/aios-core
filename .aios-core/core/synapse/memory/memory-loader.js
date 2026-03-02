/**
 * Memory Loader - MIS-6 Pipeline Integration
 *
 * High-level API for UnifiedActivationPipeline integration.
 * This is the public interface for memory retrieval in AIOS.
 *
 * Story MIS-4: Progressive Memory Retrieval (API implementation)
 * Story MIS-6: Pipeline Integration (UnifiedActivationPipeline extension point)
 *
 * @module core/synapse/memory/memory-loader
 */

const { MemoryRetriever } = require('./memory-retriever');

/**
 * Agent sector preferences for memory retrieval
 * Defines which cognitive sectors each agent prefers
 */
const AGENT_SECTOR_PREFERENCES = {
  dev: ['procedural', 'semantic'],      // HOW + WHAT
  qa: ['reflective', 'episodic'],       // LEARNED + HAPPENED
  architect: ['semantic', 'reflective'], // WHAT + LEARNED
  pm: ['episodic', 'semantic'],         // HAPPENED + FACTS
  po: ['episodic', 'semantic'],         // HAPPENED + FACTS
  sm: ['procedural', 'episodic'],       // HOW + HAPPENED
  devops: ['procedural', 'episodic'],   // HOW + HAPPENED
  analyst: ['semantic', 'reflective'],  // WHAT + LEARNED
  'data-engineer': ['procedural', 'semantic'], // HOW + WHAT
  'ux-design-expert': ['reflective', 'procedural'], // LEARNED + HOW
};

/**
 * Memory Loader
 * Public API for memory retrieval
 */
class MemoryLoader {
  constructor(projectDir) {
    this.retriever = new MemoryRetriever(projectDir);
  }

  /**
   * Load memories for agent activation (MIS-6 primary method)
   * Uses progressive disclosure: HOT tier first, then WARM if budget allows
   *
   * @param {string} agentId - Agent ID (e.g., 'dev', 'qa', 'architect')
   * @param {Object} options - Load options
   * @param {number} [options.budget=2000] - Token budget
   * @param {number[]} [options.layers=[1,2]] - Layers to retrieve (1=index, 2=context, 3=detail)
   * @returns {Promise<Object>} { memories: Array, metadata: Object }
   */
  async loadForAgent(agentId, options = {}) {
    const { budget = 2000, layers = [1, 2] } = options;

    try {
      // Get agent's sector preferences
      const sectors = AGENT_SECTOR_PREFERENCES[agentId] || [];

      // Start with HOT tier (index only - Layer 1)
      const hotResult = await this.retriever.retrieve({
        agent: agentId,
        layer: 1,
        tier: 'hot',
        sectors,
        tokenBudget: budget,
      });

      let memories = hotResult.memories;
      let tokensUsed = hotResult.metadata.tokenUsage;

      // Track which tiers were actually loaded (CR-3 fix)
      const tiersLoaded = ['hot'];

      // If budget allows, add WARM tier (context - Layer 2)
      if (tokensUsed < budget * 0.7 && layers.includes(2)) {
        const remainingBudget = budget - tokensUsed;
        const warmResult = await this.retriever.retrieve({
          agent: agentId,
          layer: 2,
          tier: 'warm',
          sectors,
          tokenBudget: remainingBudget,
          limit: 5,
        });

        memories = [...memories, ...warmResult.memories];
        tokensUsed += warmResult.metadata.tokenUsage;
        tiersLoaded.push('warm');
      }

      return {
        memories,
        metadata: {
          agent: agentId,
          count: memories.length,
          tokensUsed,
          budget,
          tiers: tiersLoaded,
        },
      };
    } catch (error) {
      console.error(`[MemoryLoader] Failed to load for ${agentId}:`, error.message);
      return { memories: [], metadata: { error: error.message } };
    }
  }

  /**
   * Query memories for agent activation
   * Primary method for UnifiedActivationPipeline integration
   *
   * @param {string} agentId - Agent ID (e.g., 'dev', 'qa', 'architect')
   * @param {Object} options - Query options
   * @param {number} [options.tokenBudget=2000] - Max tokens to return
   * @param {number} [options.attentionMin=0.3] - Min attention score (WARM+ by default)
   * @param {string[]} [options.sectors] - Override sector preferences
   * @param {string[]} [options.tags] - Filter by tags
   * @param {string} [options.tier] - Filter by tier (hot/warm/cold)
   * @param {number} [options.layer] - Force specific layer (1/2/3)
   * @param {number} [options.limit] - Max memories to return
   * @returns {Promise<Array>} Retrieved memories
   */
  async queryMemories(agentId, options = {}) {
    // Graceful degradation: return empty array if agentId not provided
    if (!agentId) {
      console.warn('[MemoryLoader] No agentId provided, returning empty memories');
      return [];
    }

    try {
      // Apply agent sector preferences if not overridden
      const sectors = options.sectors || AGENT_SECTOR_PREFERENCES[agentId] || [];

      // Default to WARM+ memories (attention_min = 0.3)
      const attentionMin = options.attentionMin !== undefined ? options.attentionMin : 0.3;

      // Use queryMemories for auto-layer selection or retrieve for explicit layer
      const result = options.layer !== undefined
        ? await this.retriever.retrieve({
          agent: agentId,
          layer: options.layer,
          tokenBudget: options.tokenBudget ?? 2000,
          attentionMin,
          sectors,
          tags: options.tags,
          tier: options.tier,
          limit: options.limit,
        })
        : await this.retriever.queryMemories(agentId, {
          tokenBudget: options.tokenBudget ?? 2000,
          attentionMin,
          sectors,
          tags: options.tags,
          tier: options.tier,
          limit: options.limit,
        });

      return result.memories;

    } catch (error) {
      console.error(`[MemoryLoader] Failed to query memories for ${agentId}:`, error.message);
      // Graceful degradation: return empty array on error
      return [];
    }
  }

  /**
   * Get memory by ID
   * Returns full memory content (Layer 3)
   *
   * @param {string} memoryId - Memory ID
   * @returns {Promise<Object|null>} Full memory or null if not found
   */
  async getMemoryById(memoryId) {
    if (!memoryId) {
      return null;
    }

    try {
      return await this.retriever.getMemoryById(memoryId);
    } catch (error) {
      console.error(`[MemoryLoader] Failed to get memory ${memoryId}:`, error.message);
      return null;
    }
  }

  /**
   * Get HOT memories for agent
   * Returns only high-attention memories (score > 0.7)
   *
   * @param {string} agentId - Agent ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} HOT memories
   */
  async getHotMemories(agentId, options = {}) {
    return this.queryMemories(agentId, {
      ...options,
      tier: 'hot',
      attentionMin: 0.7,
    });
  }

  /**
   * Get WARM memories for agent
   * Returns moderate-attention memories (0.3 <= score < 0.7)
   *
   * @param {string} agentId - Agent ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} WARM memories
   */
  async getWarmMemories(agentId, options = {}) {
    return this.queryMemories(agentId, {
      ...options,
      tier: 'warm',
      attentionMin: 0.3,
    });
  }

  /**
   * Search memories by tags
   * Convenience method for tag-based retrieval
   *
   * @param {string} agentId - Agent ID
   * @param {string[]} tags - Tags to search for
   * @param {Object} options - Additional query options
   * @returns {Promise<Array>} Matching memories
   */
  async searchByTags(agentId, tags, options = {}) {
    return this.queryMemories(agentId, {
      ...options,
      tags,
    });
  }

  /**
   * Get recent memories for agent
   * Returns memories from last N days
   *
   * @param {string} agentId - Agent ID
   * @param {number} days - Number of days to look back
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Recent memories
   */
  async getRecentMemories(agentId, days = 7, options = {}) {
    // Note: This is a simple implementation
    // In production, would filter by timestamp in index
    const memories = await this.queryMemories(agentId, options);

    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);

    return memories.filter(m => {
      const timestamp = new Date(m.timestamp).getTime();
      return timestamp >= cutoffTime;
    });
  }
}

/**
 * Create memory loader instance
 * Factory function for convenience
 *
 * @param {string} projectDir - Project directory path
 * @returns {MemoryLoader} Memory loader instance
 */
function createMemoryLoader(projectDir) {
  return new MemoryLoader(projectDir);
}

module.exports = {
  MemoryLoader,
  createMemoryLoader,
  AGENT_SECTOR_PREFERENCES,
};
