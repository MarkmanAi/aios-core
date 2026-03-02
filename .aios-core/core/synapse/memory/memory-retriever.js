/**
 * Memory Retriever - MIS-4
 *
 * Progressive Disclosure Pattern with 3 layers:
 * - Layer 1 (Index): Metadata only (~50 tokens)
 * - Layer 2 (Context): Relevant chunks (~200 tokens)
 * - Layer 3 (Detail): Full memory content (~1000+ tokens)
 *
 * @module core/synapse/memory/memory-retriever
 */

const fs = require('fs').promises;
const path = require('path');
const { MemoryIndexManager } = require('./memory-index');

/**
 * Token budget estimates per layer
 */
const TOKEN_ESTIMATES = {
  INDEX: 50,      // Metadata only
  CONTEXT: 200,   // Relevant chunks
  DETAIL: 1000,    // Full content
};

/**
 * Memory Retriever
 * Implements progressive disclosure pattern for memory retrieval
 */
class MemoryRetriever {
  constructor(projectDir) {
    this.projectDir = projectDir || process.cwd();
    this.digestsDir = path.join(this.projectDir, '.aios', 'session-digests');
    this.indexManager = new MemoryIndexManager(projectDir);
  }

  /**
   * Retrieve memories with progressive disclosure
   *
   * @param {Object} options - Retrieval options
   * @param {string} options.agent - Agent ID (required for scoping)
   * @param {number} [options.tokenBudget=2000] - Max tokens to return
   * @param {number} [options.layer=2] - Disclosure layer (1=index, 2=context, 3=detail)
   * @param {string[]} [options.tags] - Filter by tags
   * @param {string} [options.tier] - Filter by attention tier (hot/warm/cold)
   * @param {string[]} [options.sectors] - Preferred cognitive sectors
   * @param {number} [options.attentionMin] - Min attention score (0-1)
   * @param {number} [options.limit] - Max memories to return
   * @returns {Promise<Object>} Retrieval result with memories and metadata
   */
  async retrieve(options = {}) {
    const startTime = Date.now();

    // Validate required parameters
    if (!options.agent) {
      throw new Error('Agent ID is required for memory retrieval');
    }

    // Set defaults
    const {
      agent,
      tokenBudget = 2000,
      layer = 2,
      tags,
      tier,
      sectors,
      attentionMin,
      limit,
    } = options;

    // Validate layer
    if (layer < 1 || layer > 3) {
      throw new Error('Layer must be 1 (index), 2 (context), or 3 (detail)');
    }

    try {
      // Agent-Scoped Retrieval (AC: 5)
      // Each agent accesses: own private memories + shared memories
      // NEVER returns private memories of other agents

      // Search for agent's own memories
      const ownMemoriesResult = await this.indexManager.search({
        agent,
        tags,
        tier,
        limit,
      });

      // Search for shared memories (agent='shared')
      const sharedMemoriesResult = await this.indexManager.search({
        agent: 'shared',
        tags,
        tier,
        limit,
      });

      // Combine results (own + shared)
      let results = [...ownMemoriesResult.results, ...sharedMemoriesResult.results];

      // Sort by attention_score descending
      results.sort((a, b) => b.attention_score - a.attention_score);

      // Apply limit after combining
      if (limit) {
        results = results.slice(0, limit);
      }

      // Apply attention score filter
      if (attentionMin !== undefined) {
        results = results.filter(m => m.attention_score >= attentionMin);
      }

      // Apply sector boosting if specified
      if (sectors && sectors.length > 0) {
        results = this._applySectorBoosting(results, sectors);
      }

      // Progressive disclosure by layer
      let memories;
      let tokenUsage;

      switch (layer) {
        case 1:
          // Layer 1: Index only (metadata)
          memories = this._formatIndexLayer(results, tokenBudget);
          tokenUsage = memories.length * TOKEN_ESTIMATES.INDEX;
          break;

        case 2:
          // Layer 2: Context (relevant chunks)
          memories = await this._formatContextLayer(results, tokenBudget);
          tokenUsage = this._estimateTokens(memories);
          break;

        case 3:
          // Layer 3: Detail (full content)
          memories = await this._formatDetailLayer(results, tokenBudget);
          tokenUsage = this._estimateTokens(memories);
          break;

        default:
          throw new Error(`Invalid layer: ${layer}`);
      }

      const duration = Date.now() - startTime;

      return {
        memories,
        metadata: {
          agent,
          layer,
          tokenBudget,
          tokenUsage,
          memoriesReturned: memories.length,
          memoriesAvailable: results.length,
          duration: `${duration}ms`,
        },
      };

    } catch (error) {
      console.error('[MemoryRetriever] Retrieval failed:', error.message);
      throw error;
    }
  }

  /**
   * Layer 1: Format memories as index (metadata only)
   * Target: ~50 tokens per memory
   *
   * @private
   * @param {Array} results - Search results from index
   * @param {number} tokenBudget - Max tokens
   * @returns {Array} Formatted index entries
   */
  _formatIndexLayer(results, tokenBudget) {
    const maxMemories = Math.floor(tokenBudget / TOKEN_ESTIMATES.INDEX);
    const selected = results.slice(0, maxMemories);

    return selected.map(m => ({
      id: m.id,
      timestamp: m.timestamp,
      agent: m.agent,
      sector: m.sector,
      tier: m.tier,
      attention_score: m.attention_score,
      tags: m.tags,
      duration_minutes: m.duration_minutes,
    }));
  }

  /**
   * Layer 2: Format memories as context (relevant chunks)
   * Target: ~200 tokens per memory
   *
   * @private
   * @param {Array} results - Search results from index
   * @param {number} tokenBudget - Max tokens
   * @returns {Promise<Array>} Formatted context entries
   */
  async _formatContextLayer(results, tokenBudget) {
    const memories = [];
    let tokensUsed = 0;

    for (const result of results) {
      // Stop if budget exceeded
      if (tokensUsed >= tokenBudget) {
        break;
      }

      try {
        // Read digest file
        const content = await fs.readFile(result.filePath, 'utf8');

        // Extract summary chunks (patterns, axioms, evidence snippets)
        const chunks = this._extractRelevantChunks(content);

        const memory = {
          id: result.id,
          timestamp: result.timestamp,
          agent: result.agent,
          sector: result.sector,
          tier: result.tier,
          attention_score: result.attention_score,
          tags: result.tags,
          chunks: chunks.slice(0, 3), // Max 3 chunks per memory
        };

        const estimatedTokens = this._estimateTokens([memory]);
        if (tokensUsed + estimatedTokens > tokenBudget) {
          break;
        }

        memories.push(memory);
        tokensUsed += estimatedTokens;

      } catch (error) {
        console.warn(`[MemoryRetriever] Failed to read ${result.id}:`, error.message);
        continue;
      }
    }

    return memories;
  }

  /**
   * Layer 3: Format memories as detail (full content)
   * Target: ~1000+ tokens per memory
   *
   * @private
   * @param {Array} results - Search results from index
   * @param {number} tokenBudget - Max tokens
   * @returns {Promise<Array>} Formatted detail entries
   */
  async _formatDetailLayer(results, tokenBudget) {
    const memories = [];
    let tokensUsed = 0;

    for (const result of results) {
      // Stop if budget exceeded
      if (tokensUsed >= tokenBudget) {
        break;
      }

      try {
        // Read digest file
        const content = await fs.readFile(result.filePath, 'utf8');

        // Extract body content (everything after frontmatter)
        const bodyMatch = content.match(/^---\n[\s\S]+?\n---\n([\s\S]+)$/);
        const body = bodyMatch ? bodyMatch[1].trim() : '';

        const memory = {
          id: result.id,
          timestamp: result.timestamp,
          agent: result.agent,
          sector: result.sector,
          tier: result.tier,
          attention_score: result.attention_score,
          tags: result.tags,
          duration_minutes: result.duration_minutes,
          content: body,
        };

        const estimatedTokens = this._estimateTokens([memory]);
        if (tokensUsed + estimatedTokens > tokenBudget) {
          break;
        }

        memories.push(memory);
        tokensUsed += estimatedTokens;

      } catch (error) {
        console.warn(`[MemoryRetriever] Failed to read ${result.id}:`, error.message);
        continue;
      }
    }

    return memories;
  }

  /**
   * Extract relevant chunks from memory content
   * Prioritizes: patterns, axioms, corrections, evidence
   *
   * @private
   * @param {string} content - Full digest content
   * @returns {Array<Object>} Extracted chunks
   */
  _extractRelevantChunks(content) {
    const chunks = [];

    // Extract patterns
    const patternMatches = content.matchAll(/Pattern:\s*"([^"]+)"/g);
    for (const match of patternMatches) {
      chunks.push({
        type: 'pattern',
        content: match[1],
      });
    }

    // Extract axioms
    const axiomMatches = content.matchAll(/Axiom:\s*([^\n]+)/g);
    for (const match of axiomMatches) {
      chunks.push({
        type: 'axiom',
        content: match[1].trim(),
      });
    }

    // Extract corrections
    const correctionMatches = content.matchAll(/Actually[^.]+\./gi);
    for (const match of correctionMatches) {
      chunks.push({
        type: 'correction',
        content: match[0],
      });
    }

    // Extract evidence (first 2 items)
    const evidenceMatch = content.match(/Evidence:\n((?:- [^\n]+\n?){1,2})/);
    if (evidenceMatch) {
      chunks.push({
        type: 'evidence',
        content: evidenceMatch[1].trim(),
      });
    }

    return chunks;
  }

  /**
   * Apply sector-based relevance boosting
   * Boosts memories matching preferred sectors
   *
   * @private
   * @param {Array} results - Search results
   * @param {string[]} sectors - Preferred sectors
   * @returns {Array} Re-sorted results
   */
  _applySectorBoosting(results, sectors) {
    return results.map(r => ({
      ...r,
      boosted_score: r.attention_score * (sectors.includes(r.sector) ? 1.2 : 1.0),
    })).sort((a, b) => b.boosted_score - a.boosted_score);
  }

  /**
   * Estimate token count for memories
   * Uses simple heuristic: ~4 chars per token
   *
   * @private
   * @param {Array} memories - Formatted memories
   * @returns {number} Estimated token count
   */
  _estimateTokens(memories) {
    const json = JSON.stringify(memories);
    return Math.ceil(json.length / 4);
  }

  /**
   * Get memory by ID (Layer 3 always)
   *
   * @param {string} memoryId - Memory ID
   * @returns {Promise<Object|null>} Full memory or null if not found
   */
  async getMemoryById(memoryId) {
    try {
      // Search index for memory
      const searchResult = await this.indexManager.search({});
      const memory = searchResult.results.find(m => m.id === memoryId);

      if (!memory) {
        return null;
      }

      // Read full content
      const content = await fs.readFile(memory.filePath, 'utf8');
      const bodyMatch = content.match(/^---\n[\s\S]+?\n---\n([\s\S]+)$/);
      const body = bodyMatch ? bodyMatch[1].trim() : '';

      return {
        id: memory.id,
        timestamp: memory.timestamp,
        agent: memory.agent,
        sector: memory.sector,
        tier: memory.tier,
        attention_score: memory.attention_score,
        tags: memory.tags,
        duration_minutes: memory.duration_minutes,
        content: body,
        filePath: memory.filePath,
      };

    } catch (error) {
      console.error(`[MemoryRetriever] Failed to get memory ${memoryId}:`, error.message);
      return null;
    }
  }

  /**
   * Query memories with simplified interface
   * Auto-selects layer based on token budget
   *
   * @param {string} agent - Agent ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Retrieval result
   */
  async queryMemories(agent, options = {}) {
    const { tokenBudget = 2000 } = options;

    // Auto-select layer based on budget
    let layer;
    if (tokenBudget < 500) {
      layer = 1; // Index only
    } else if (tokenBudget < 1500) {
      layer = 2; // Context
    } else {
      layer = 3; // Detail
    }

    return this.retrieve({
      agent,
      layer,
      ...options,
    });
  }
}

module.exports = {
  MemoryRetriever,
  TOKEN_ESTIMATES,
};
