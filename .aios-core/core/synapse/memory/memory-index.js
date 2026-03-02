/**
 * Memory Index Builder - MIS-4
 *
 * Builds and maintains searchable index of session digests.
 * Enables fast retrieval with < 50ms scan time for 500 memories.
 *
 * @module core/synapse/memory/memory-index
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

/**
 * Memory Index Manager
 * Builds, updates, and searches memory indexes
 */
class MemoryIndexManager {
  constructor(projectDir) {
    this.projectDir = projectDir || process.cwd();
    this.digestsDir = path.join(this.projectDir, '.aios', 'session-digests');
    this.indexDir = path.join(this.digestsDir, 'index');

    // Index structures
    this.indexes = {
      byAgent: {},      // agent → [memoryIds]
      byDate: {},       // date → [memoryIds]
      byTag: {},        // tag → [memoryIds]
      byTier: {         // tier → [memoryIds]
        hot: [],
        warm: [],
        cold: [],
      },
    };

    // Master index: id → metadata
    this.masterIndex = {};
  }

  /**
   * Build complete index from all session digests
   * Performance: < 2 seconds for 100 digests
   *
   * @returns {Promise<Object>} Index statistics
   */
  async buildIndex() {
    const startTime = Date.now();

    // Reset indexes
    this.indexes = {
      byAgent: {},
      byDate: {},
      byTag: {},
      byTier: { hot: [], warm: [], cold: [] },
    };
    this.masterIndex = {};

    try {
      // Ensure digests directory exists
      await fs.mkdir(this.digestsDir, { recursive: true });

      // Read all digest files
      const files = await fs.readdir(this.digestsDir);
      const digestFiles = files.filter(f => f.endsWith('.yaml') && !f.startsWith('example'));

      // Process each digest
      for (const file of digestFiles) {
        const filePath = path.join(this.digestsDir, file);
        await this._indexDigestFile(filePath);
      }

      // Persist indexes
      await this._persistIndexes();

      const duration = Date.now() - startTime;

      return {
        totalMemories: Object.keys(this.masterIndex).length,
        byAgent: Object.keys(this.indexes.byAgent).length,
        byDate: Object.keys(this.indexes.byDate).length,
        byTag: Object.keys(this.indexes.byTag).length,
        hot: this.indexes.byTier.hot.length,
        warm: this.indexes.byTier.warm.length,
        cold: this.indexes.byTier.cold.length,
        duration: `${duration}ms`,
      };
    } catch (error) {
      console.error('[MemoryIndex] Build failed:', error.message);
      throw error;
    }
  }

  /**
   * Index a single digest file
   * @private
   */
  async _indexDigestFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');

      // Extract frontmatter (metadata)
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
      if (!frontmatterMatch) {
        console.warn(`[MemoryIndex] No frontmatter in ${path.basename(filePath)}`);
        return;
      }

      const metadata = yaml.load(frontmatterMatch[1]);

      // Create memory entry
      const memoryId = metadata.session_id || path.basename(filePath, '.yaml');

      // js-yaml parses ISO timestamps as Date objects; normalize to string
      const rawTimestamp = metadata.timestamp;
      const timestamp = rawTimestamp instanceof Date
        ? rawTimestamp.toISOString()
        : (rawTimestamp || new Date().toISOString());

      const memoryEntry = {
        id: memoryId,
        timestamp,
        agent: metadata.agent_context || 'unknown',
        tags: this._extractTags(content),
        attention_score: this._calculateAttentionScore(metadata),
        sector: this._detectSector(content),
        tier: this._classifyTier(metadata),
        filePath: filePath,
        compact_trigger: metadata.compact_trigger,
        duration_minutes: metadata.duration_minutes || 0,
      };

      // Add to master index
      this.masterIndex[memoryId] = memoryEntry;

      // Index by agent
      const agent = memoryEntry.agent;
      if (!this.indexes.byAgent[agent]) {
        this.indexes.byAgent[agent] = [];
      }
      this.indexes.byAgent[agent].push(memoryId);

      // Index by date
      const date = memoryEntry.timestamp.split('T')[0];
      if (!this.indexes.byDate[date]) {
        this.indexes.byDate[date] = [];
      }
      this.indexes.byDate[date].push(memoryId);

      // Index by tags
      for (const tag of memoryEntry.tags) {
        if (!this.indexes.byTag[tag]) {
          this.indexes.byTag[tag] = [];
        }
        this.indexes.byTag[tag].push(memoryId);
      }

      // Index by attention tier
      const tier = memoryEntry.tier;
      if (this.indexes.byTier[tier]) {
        this.indexes.byTier[tier].push(memoryId);
      }

    } catch (error) {
      console.warn(`[MemoryIndex] Failed to index ${path.basename(filePath)}:`, error.message);
    }
  }

  /**
   * Extract tags from digest content
   * @private
   */
  _extractTags(content) {
    const tags = new Set();

    // Extract from patterns
    const patternMatches = content.match(/Pattern: "([^"]+)"/g);
    if (patternMatches) {
      patternMatches.forEach(match => {
        const tag = match.match(/Pattern: "([^"]+)"/)[1]
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .substring(0, 30);
        tags.add(tag);
      });
    }

    // Extract from corrections
    const correctionMatches = content.match(/Actually[^.]+/gi);
    if (correctionMatches && correctionMatches.length > 0) {
      tags.add('corrections');
    }

    // Extract from axioms
    const axiomMatches = content.match(/Axiom:/gi);
    if (axiomMatches && axiomMatches.length > 0) {
      tags.add('axioms');
    }

    return Array.from(tags);
  }

  /**
   * Calculate attention score for memory
   * Formula: base_relevance * recency_factor * access_modifier * confidence
   * @private
   */
  _calculateAttentionScore(metadata) {
    const now = Date.now();
    // js-yaml may parse ISO timestamps as Date objects — handle both
    const rawTs = metadata.timestamp;
    const timestamp = rawTs instanceof Date ? rawTs.getTime() : new Date(rawTs || Date.now()).getTime();
    const ageInDays = (now - timestamp) / (1000 * 60 * 60 * 24);

    // Base relevance (0.6 default, boosted by duration/trigger)
    let baseRelevance = 0.6;
    if (metadata.compact_trigger === 'context_limit_90%') baseRelevance = 0.85;
    if (metadata.duration_minutes > 30) baseRelevance += 0.15;

    // Recency factor (exponential decay)
    const decayRate = 0.1; // moderate decay
    const recencyFactor = Math.exp(-ageInDays * decayRate);

    // Access modifier (1.0 for new memories)
    const accessModifier = 1.0;

    // Confidence (0.95 default for system-generated digests)
    const confidence = metadata.confidence || 0.95;

    const score = baseRelevance * recencyFactor * accessModifier * confidence;
    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Detect cognitive sector from content
   * @private
   */
  _detectSector(content) {
    const lowerContent = content.toLowerCase();

    // Procedural: "how to", workflow, steps
    if (lowerContent.includes('how to') || lowerContent.includes('workflow') || lowerContent.includes('step')) {
      return 'procedural';
    }

    // Semantic: facts, concepts, definitions
    if (lowerContent.includes('definition') || lowerContent.includes('concept') || lowerContent.includes('fact')) {
      return 'semantic';
    }

    // Reflective: learned, discovered, realized
    if (lowerContent.includes('learned') || lowerContent.includes('discovered') || lowerContent.includes('realized')) {
      return 'reflective';
    }

    // Episodic: happened, event, session (default)
    return 'episodic';
  }

  /**
   * Classify memory into attention tier
   * HOT (>0.7), WARM (0.3-0.7), COLD (<0.3)
   * @private
   */
  _classifyTier(metadata) {
    const score = this._calculateAttentionScore(metadata);

    if (score > 0.7) return 'hot';
    if (score >= 0.3) return 'warm';
    return 'cold';
  }

  /**
   * Persist indexes to disk
   * @private
   */
  async _persistIndexes() {
    await fs.mkdir(this.indexDir, { recursive: true });

    // Persist by-agent indexes
    const byAgentDir = path.join(this.indexDir, 'by-agent');
    await fs.mkdir(byAgentDir, { recursive: true });
    for (const [agent, memoryIds] of Object.entries(this.indexes.byAgent)) {
      const filename = `${agent.replace(/[^a-z0-9]/gi, '-')}.json`;
      await fs.writeFile(
        path.join(byAgentDir, filename),
        JSON.stringify(memoryIds, null, 2),
        'utf8',
      );
    }

    // Persist by-date indexes
    const byDateDir = path.join(this.indexDir, 'by-date');
    await fs.mkdir(byDateDir, { recursive: true });
    for (const [date, memoryIds] of Object.entries(this.indexes.byDate)) {
      await fs.writeFile(
        path.join(byDateDir, `${date}.json`),
        JSON.stringify(memoryIds, null, 2),
        'utf8',
      );
    }

    // Persist by-tag indexes
    const byTagDir = path.join(this.indexDir, 'by-tag');
    await fs.mkdir(byTagDir, { recursive: true });
    for (const [tag, memoryIds] of Object.entries(this.indexes.byTag)) {
      const filename = `${tag}.json`;
      await fs.writeFile(
        path.join(byTagDir, filename),
        JSON.stringify(memoryIds, null, 2),
        'utf8',
      );
    }

    // Persist by-tier indexes
    const byTierDir = path.join(this.indexDir, 'by-tier');
    await fs.mkdir(byTierDir, { recursive: true });
    for (const [tier, memoryIds] of Object.entries(this.indexes.byTier)) {
      await fs.writeFile(
        path.join(byTierDir, `${tier}.json`),
        JSON.stringify(memoryIds, null, 2),
        'utf8',
      );
    }

    // Persist master index
    await fs.writeFile(
      path.join(this.indexDir, 'master.json'),
      JSON.stringify(this.masterIndex, null, 2),
      'utf8',
    );
  }

  /**
   * Search index by query
   * Performance: < 50ms for 500 memories
   *
   * @param {Object} query - Search query
   * @param {string} [query.agent] - Filter by agent
   * @param {string} [query.date] - Filter by date (YYYY-MM-DD)
   * @param {string[]} [query.tags] - Filter by tags
   * @param {string} [query.tier] - Filter by tier (hot/warm/cold)
   * @param {number} [query.limit] - Max results
   * @returns {Promise<Array>} Matching memory metadata
   */
  async search(query = {}) {
    const startTime = Date.now();

    // Load indexes if not in memory
    if (Object.keys(this.masterIndex).length === 0) {
      await this._loadIndexes();
    }

    let candidateIds = new Set(Object.keys(this.masterIndex));

    // Filter by agent
    if (query.agent) {
      const agentIds = this.indexes.byAgent[query.agent] || [];
      candidateIds = new Set(agentIds.filter(id => candidateIds.has(id)));
    }

    // Filter by date
    if (query.date) {
      const dateIds = this.indexes.byDate[query.date] || [];
      candidateIds = new Set(dateIds.filter(id => candidateIds.has(id)));
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      for (const tag of query.tags) {
        const tagIds = this.indexes.byTag[tag] || [];
        candidateIds = new Set(tagIds.filter(id => candidateIds.has(id)));
      }
    }

    // Filter by tier
    if (query.tier) {
      const tierIds = this.indexes.byTier[query.tier] || [];
      candidateIds = new Set(tierIds.filter(id => candidateIds.has(id)));
    }

    // Get memory metadata
    let results = Array.from(candidateIds).map(id => this.masterIndex[id]);

    // Sort by attention_score descending
    results.sort((a, b) => b.attention_score - a.attention_score);

    // Apply limit
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    const duration = Date.now() - startTime;

    return {
      results,
      count: results.length,
      duration: `${duration}ms`,
    };
  }

  /**
   * Load indexes from disk
   * @private
   */
  async _loadIndexes() {
    try {
      const masterPath = path.join(this.indexDir, 'master.json');
      const masterContent = await fs.readFile(masterPath, 'utf8');
      this.masterIndex = JSON.parse(masterContent);

      // Load by-agent
      const byAgentDir = path.join(this.indexDir, 'by-agent');
      const agentFiles = await fs.readdir(byAgentDir).catch(() => []);
      for (const file of agentFiles) {
        const agent = path.basename(file, '.json');
        const content = await fs.readFile(path.join(byAgentDir, file), 'utf8');
        this.indexes.byAgent[agent] = JSON.parse(content);
      }

      // Load by-date
      const byDateDir = path.join(this.indexDir, 'by-date');
      const dateFiles = await fs.readdir(byDateDir).catch(() => []);
      for (const file of dateFiles) {
        const date = path.basename(file, '.json');
        const content = await fs.readFile(path.join(byDateDir, file), 'utf8');
        this.indexes.byDate[date] = JSON.parse(content);
      }

      // Load by-tag
      const byTagDir = path.join(this.indexDir, 'by-tag');
      const tagFiles = await fs.readdir(byTagDir).catch(() => []);
      for (const file of tagFiles) {
        const tag = path.basename(file, '.json');
        const content = await fs.readFile(path.join(byTagDir, file), 'utf8');
        this.indexes.byTag[tag] = JSON.parse(content);
      }

      // Load by-tier
      const byTierDir = path.join(this.indexDir, 'by-tier');
      const tierFiles = await fs.readdir(byTierDir).catch(() => []);
      for (const file of tierFiles) {
        const tier = path.basename(file, '.json');
        const content = await fs.readFile(path.join(byTierDir, file), 'utf8');
        this.indexes.byTier[tier] = JSON.parse(content);
      }

    } catch (error) {
      console.warn('[MemoryIndex] Index load failed, will rebuild:', error.message);
      await this.buildIndex();
    }
  }

  /**
   * Update index with new digest (incremental)
   *
   * @param {string} digestPath - Path to new digest file
   * @returns {Promise<void>}
   */
  async updateIndex(digestPath) {
    // Load current indexes if not in memory
    if (Object.keys(this.masterIndex).length === 0) {
      await this._loadIndexes();
    }

    // Index new digest
    await this._indexDigestFile(digestPath);

    // Persist updated indexes
    await this._persistIndexes();
  }

  /**
   * Rebuild index from scratch
   * Use when index is corrupted or missing
   *
   * @returns {Promise<Object>} Index statistics
   */
  async rebuildIndex() {
    console.log('[MemoryIndex] Rebuilding index from source digests...');
    return await this.buildIndex();
  }
}

module.exports = {
  MemoryIndexManager,
};
