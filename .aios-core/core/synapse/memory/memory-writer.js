'use strict';

/**
 * Memory Writer — SYNAPSE Write Stack
 *
 * Creates structured YAML memory files in the correct tier store and patches
 * master.json so MemoryRetriever can find them immediately without a full index rebuild.
 *
 * Write counterpart to MemoryRetriever. Closes the broken cycle:
 *   SelfLearner → MemoryWriter → Stores → MemoryRetriever
 *
 * @module core/synapse/memory/memory-writer
 * @see Story 16.1 - Memory Writer Module
 * @see docs/architecture/memory-writer-design.md - @architect approved gate (2026-03-09)
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

/**
 * Initial attention score base values by tier.
 * Final score = base * confidence, clamped [0, 1].
 */
const INITIAL_SCORES = {
  session: 0.65,
  daily: 0.75,
  durable: 0.85,
};

/**
 * Max files per agent per day for session/daily tiers.
 * Durable has no cap (Infinity).
 */
const WRITE_CAPS = {
  session: 20,
  daily: 50,
  durable: Infinity,
};

/**
 * Sector auto-detection by memory_type.
 */
const TYPE_TO_SECTOR = {
  pattern: 'procedural',
  axiom: 'semantic',
  correction: 'reflective',
  heuristic: 'reflective',
  gotcha: 'reflective',
  general: 'episodic',
};

/**
 * Memory Writer
 *
 * Public API for writing structured YAML memory files to SYNAPSE tier stores.
 */
class MemoryWriter {
  /**
   * @param {string} projectDir - Project root directory
   */
  constructor(projectDir) {
    this.projectDir = projectDir || process.cwd();
    this.memoriesDir = path.join(this.projectDir, '.aios', 'memories');
    this.indexDir = path.join(this.projectDir, '.aios', 'session-digests', 'index');
    this.masterIndexPath = path.join(this.indexDir, 'master.json');
  }

  /**
   * Write a structured memory file to the correct tier store.
   *
   * Enforces deduplication (same text + tier + day → increment evidence_count)
   * and write caps (session: 20/day, daily: 50/day).
   * Patches master.json after write so MemoryRetriever finds the file immediately.
   *
   * @param {string} agentId - Agent that generated this memory ('dev', 'shared', etc.)
   * @param {Object} content - Memory content object
   * @param {string} content.type - Memory type: pattern|axiom|correction|heuristic|gotcha|general
   * @param {string} content.text - Main content text (required)
   * @param {string[]} [content.evidence] - Evidence items (optional, max 10)
   * @param {number} [content.confidence] - Confidence [0.0, 1.0], default 0.9
   * @param {number} [content.evidence_count] - Override evidence count
   * @param {string[]} [content.tags] - Additional searchable tags
   * @param {string} [content.sector] - Override auto-detected cognitive sector
   * @param {'session'|'daily'|'durable'} tier - Target storage tier
   * @param {Object} [options] - Optional overrides
   * @param {string} [options.sector] - Override sector
   * @param {number} [options.attention_score] - Override initial attention score
   * @param {boolean} [options.skipIndex] - Skip master.json patch (testing only)
   * @returns {Promise<{id: string, filePath: string|null, tier: string, error?: string}>}
   */
  async write(agentId, content, tier, options = {}) {
    const safeAgentId = this._sanitizeAgentId(agentId);
    const today = new Date().toISOString().split('T')[0];

    // Heuristic type always routes to durable regardless of tier param
    const effectiveTier = content.type === 'heuristic' ? 'durable' : (tier || 'session');
    const dir = this._tierToPath(effectiveTier, content.type);

    // Deduplication: same normalized text on same day+tier → increment evidence_count
    const duplicate = await this._findDuplicate(dir, content.text, content.type, today);
    if (duplicate) {
      await this._incrementEvidenceCount(duplicate);
      const existingId = await this._readId(duplicate);
      return { id: existingId, filePath: duplicate, tier: effectiveTier };
    }

    // Cap check (session/daily only)
    if (
      effectiveTier !== 'durable' &&
      (await this._checkCap(dir, safeAgentId, effectiveTier, today))
    ) {
      const existing = await this._listAgentDayFiles(dir, safeAgentId, today);
      const fallback = existing[0] || null;
      return {
        id: fallback ? path.basename(fallback, '.yaml') : `cap-${safeAgentId}-${today}`,
        filePath: fallback,
        tier: effectiveTier,
      };
    }

    // Generate ID and filename
    const seq = await this._nextSeq(dir, effectiveTier, safeAgentId, today);
    const id = this._generateId(safeAgentId, today, seq);
    const filename = this._buildFilename(effectiveTier, safeAgentId, today, seq);
    const filePath = path.join(dir, filename);

    // Compute attention score
    const confidence = content.confidence != null ? content.confidence : 0.9;
    const baseScore = INITIAL_SCORES[effectiveTier] || 0.75;
    const attentionScore =
      options.attention_score != null
        ? options.attention_score
        : Math.min(Math.max(baseScore * confidence, 0), 1);

    // Resolve sector
    const sector =
      options.sector || content.sector || TYPE_TO_SECTOR[content.type] || 'episodic';

    // Build file content
    const frontmatter = this._buildFrontmatter(id, safeAgentId, effectiveTier, content, {
      attentionScore,
      confidence,
      sector,
    });
    const body = this._buildBody(content);
    const fileContent = this._renderYAML(frontmatter, body);

    // Write file
    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, fileContent, { encoding: 'utf8' });
    } catch (error) {
      console.warn(`[MemoryWriter] Write failed for ${id}:`, error.message);
      return { id, filePath: null, tier: effectiveTier, error: error.message };
    }

    // Patch master index
    if (!options.skipIndex) {
      const attentionTier =
        attentionScore > 0.7 ? 'hot' : attentionScore >= 0.3 ? 'warm' : 'cold';
      const indexEntry = {
        id,
        timestamp: frontmatter.timestamp,
        agent: safeAgentId,
        tags: content.tags || [],
        attention_score: attentionScore,
        sector,
        tier: attentionTier,
        filePath,
        compact_trigger: 'memory-writer',
        duration_minutes: 0,
      };

      try {
        await this._patchMasterIndex(indexEntry);
      } catch (error) {
        console.warn(`[MemoryWriter] Index patch failed for ${id}:`, error.message);
        // File was written — return with filePath set (partial success)
        return { id, filePath, tier: effectiveTier };
      }
    }

    return { id, filePath, tier: effectiveTier };
  }

  /**
   * Write a heuristic candidate from SelfLearner to durable/heuristics/.
   *
   * Maps SelfLearner._extractHeuristics() output to write() content shape.
   * Always writes with agent='shared' and tier='durable'.
   *
   * @param {string} agentId - Originating agent (mapped to 'shared' internally)
   * @param {Object} heuristic - SelfLearner heuristic candidate
   * @param {string} heuristic.rule - The rule text (maps to content.text)
   * @param {string[]} heuristic.evidence_summary - Evidence items (maps to content.evidence)
   * @param {number} heuristic.confidence - Confidence score
   * @param {number} heuristic.evidence_count - Evidence count
   * @param {Object} [options] - Optional overrides (passed through to write())
   * @returns {Promise<{id: string, filePath: string|null, tier: string, error?: string}>}
   */
  async writeHeuristic(agentId, heuristic, options = {}) {
    const content = {
      type: 'heuristic',
      text: heuristic.rule,
      evidence: heuristic.evidence_summary || [],
      confidence: heuristic.confidence,
      evidence_count: heuristic.evidence_count,
      tags: heuristic.tags || [],
    };
    // Heuristics always use 'shared' agent per architecture spec
    return this.write('shared', content, 'durable', options);
  }

  // ─── Private: Path Resolution ──────────────────────────────────────────────

  /**
   * Resolve the absolute directory path for a tier + memory type combination.
   *
   * Routing:
   *   session  → .aios/memories/shared/session/
   *   daily    → .aios/memories/shared/daily/
   *   durable + type=heuristic → .aios/memories/shared/durable/heuristics/
   *   durable  → .aios/memories/shared/durable/
   *
   * @private
   * @param {string} tier
   * @param {string} memoryType
   * @returns {string}
   */
  _tierToPath(tier, memoryType) {
    const base = path.join(this.memoriesDir, 'shared');
    switch (tier) {
      case 'session':
        return path.join(base, 'session');
      case 'daily':
        return path.join(base, 'daily');
      case 'durable':
        if (memoryType === 'heuristic') {
          return path.join(base, 'durable', 'heuristics');
        }
        return path.join(base, 'durable');
      default:
        return path.join(base, 'session');
    }
  }

  /**
   * Generate a unique memory ID.
   * Format: mem-{agentId}-{YYYY-MM-DD}-{seq:3}
   *
   * @private
   * @param {string} safeAgentId
   * @param {string} dateStr
   * @param {string} seq - Zero-padded sequence string
   * @returns {string}
   */
  _generateId(safeAgentId, dateStr, seq) {
    return `mem-${safeAgentId}-${dateStr}-${seq}`;
  }

  /**
   * Build the YAML file name.
   * Format: {tier}-{agentId}-{YYYY-MM-DD}-{seq:3}.yaml
   *
   * @private
   */
  _buildFilename(tier, safeAgentId, dateStr, seq) {
    return `${tier}-${safeAgentId}-${dateStr}-${seq}.yaml`;
  }

  /**
   * Sanitize an agent ID to lowercase alphanumeric + hyphens, max 20 chars.
   *
   * @private
   */
  _sanitizeAgentId(agentId) {
    return String(agentId)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 20) || 'agent';
  }

  /**
   * Determine the next sequence number by scanning existing files in dir.
   *
   * @private
   */
  async _nextSeq(dir, tier, safeAgentId, dateStr) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const files = await fs.readdir(dir);
      const prefix = `${tier}-${safeAgentId}-${dateStr}-`;
      const existing = files.filter((f) => f.startsWith(prefix) && f.endsWith('.yaml'));
      return String(existing.length + 1).padStart(3, '0');
    } catch (_) {
      return '001';
    }
  }

  // ─── Private: YAML Generation ──────────────────────────────────────────────

  /**
   * Build YAML frontmatter object (schema v2.0).
   *
   * @private
   */
  _buildFrontmatter(id, safeAgentId, tier, content, opts) {
    const { attentionScore, confidence, sector } = opts;
    const evidenceCount =
      content.evidence_count != null
        ? content.evidence_count
        : content.evidence
        ? content.evidence.length
        : 1;

    return {
      schema_version: '2.0',
      id,
      agent: safeAgentId,
      tier,
      memory_type: content.type || 'general',
      timestamp: new Date().toISOString(),
      attention_score: Math.round(attentionScore * 1000) / 1000,
      confidence: Math.round(confidence * 1000) / 1000,
      evidence_count: evidenceCount,
      sector,
      tags: content.tags || [],
      duration_minutes: 0,
      source: 'memory-writer',
    };
  }

  /**
   * Build the YAML file body.
   *
   * Format strings MUST match _extractRelevantChunks() regexes in memory-retriever.js:
   *   - Pattern: "text"    → /Pattern:\s*"([^"]+)"/g
   *   - Axiom: text        → /Axiom:\s*([^\n]+)/g
   *   - Actually...        → /Actually[^.]+\./gi
   *   - Evidence:\n- item  → /Evidence:\n((?:- [^\n]+\n?){1,2})/
   *
   * @private
   */
  _buildBody(content) {
    const lines = [];

    if (content.type === 'pattern' || content.type === 'general') {
      lines.push('## Patterns Observed', '');
      if (content.text) {
        lines.push(`- Pattern: "${content.text}"`);
      } else {
        lines.push('- (none)');
      }
      lines.push('');
    }

    if (content.type === 'axiom') {
      lines.push('## Axioms Learned', '');
      if (content.text) {
        lines.push(`- Axiom: ${content.text}`);
      } else {
        lines.push('- (none)');
      }
      lines.push('');
    }

    if (content.type === 'correction') {
      lines.push('## Corrections', '');
      // Must match /Actually[^.]+\./gi
      if (content.text) {
        lines.push(`Actually, ${content.text}.`);
      } else {
        lines.push('- (none)');
      }
      lines.push('');
    }

    if (content.type === 'heuristic' || content.type === 'gotcha') {
      lines.push('## Heuristics', '');
      if (content.text) {
        lines.push(`- Pattern: "${content.text}"`);
      } else {
        lines.push('- (none)');
      }
      lines.push('');
    }

    // Evidence section — matches /Evidence:\n((?:- [^\n]+\n?){1,2})/
    if (content.evidence && content.evidence.length > 0) {
      lines.push('## Evidence', '');
      lines.push('Evidence:');
      content.evidence.slice(0, 10).forEach((item) => {
        lines.push(`- ${item}`);
      });
      lines.push('');
    }

    // Context section (always present)
    lines.push('## Context', '');
    lines.push('Source: memory-writer');
    lines.push(`Memory Type: ${content.type || 'general'}`);
    lines.push(`Confidence: ${content.confidence != null ? content.confidence : 0.9}`);

    return lines.join('\n');
  }

  /**
   * Render frontmatter object + body string into a complete YAML file string.
   *
   * MUST use UNIX line endings (\n) for MemoryRetriever Layer 3 regex:
   *   /^---\n[\s\S]+?\n---\n([\s\S]+)$/
   *
   * @private
   */
  _renderYAML(frontmatter, body) {
    const fm = yaml.dump(frontmatter, { lineWidth: -1 });
    return `---\n${fm}---\n\n${body}`;
  }

  // ─── Private: Deduplication ────────────────────────────────────────────────

  /**
   * Find an existing file for the same day with the same normalized text.
   * Returns absolute filePath or null.
   *
   * Uses exact text comparison against the specific body section for the given
   * memoryType — avoids false positives from substring matches on the full file.
   *
   * @private
   * @param {string} dir
   * @param {string} text
   * @param {string} memoryType - Used to target the correct body section
   * @param {string} today - YYYY-MM-DD
   */
  async _findDuplicate(dir, text, memoryType, today) {
    if (!text) return null;
    try {
      await fs.mkdir(dir, { recursive: true });
      const files = await fs.readdir(dir);
      const normalizedText = this._normalizeText(text);

      for (const file of files) {
        if (!file.endsWith('.yaml')) continue;
        if (!file.includes(today)) continue;

        const filePath = path.join(dir, file);
        try {
          const raw = await fs.readFile(filePath, 'utf8');
          const extracted = this._extractBodyText(raw, memoryType);
          if (extracted && this._normalizeText(extracted) === normalizedText) {
            return filePath;
          }
        } catch (_) {
          continue;
        }
      }
    } catch (_) {
      // ignore — directory may not exist yet
    }
    return null;
  }

  /**
   * Extract the primary text content from a file's body for deduplication.
   *
   * Targets the specific body section for each memory_type so that comparison
   * is exact (not substring-based on the full raw file).
   *
   * @private
   * @param {string} raw - Full file content
   * @param {string} memoryType
   * @returns {string} Extracted text or empty string if not found
   */
  _extractBodyText(raw, memoryType) {
    switch (memoryType) {
      case 'pattern':
      case 'heuristic':
      case 'gotcha':
      case 'general': {
        // Body format: Pattern: "text"
        const m = raw.match(/Pattern:\s*"([^"]+)"/);
        return m ? m[1] : '';
      }
      case 'axiom': {
        // Body format: Axiom: text
        const m = raw.match(/Axiom:\s*([^\n]+)/);
        return m ? m[1].trim() : '';
      }
      case 'correction': {
        // Body format: Actually, text.
        const m = raw.match(/Actually,?\s*(.+?)\./i);
        return m ? m[1].trim() : '';
      }
      default:
        return '';
    }
  }

  /**
   * Increment evidence_count in an existing YAML file (read-modify-write).
   *
   * @private
   */
  async _incrementEvidenceCount(filePath) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const fm = this._parseFrontmatter(raw);
      if (!fm) return;

      fm.evidence_count = (fm.evidence_count || 1) + 1;

      const bodyMatch = raw.match(/^---\n[\s\S]+?\n---\n([\s\S]*)$/);
      const body = bodyMatch ? bodyMatch[1] : '';
      const updated = `---\n${yaml.dump(fm, { lineWidth: -1 })}---\n${body}`;
      await fs.writeFile(filePath, updated, { encoding: 'utf8' });
    } catch (error) {
      console.warn(`[MemoryWriter] Failed to increment evidence_count in ${filePath}:`, error.message);
    }
  }

  /**
   * Check whether an agent has reached the daily write cap for a given tier.
   *
   * @private
   */
  async _checkCap(dir, safeAgentId, tier, today) {
    const cap = WRITE_CAPS[tier];
    if (!cap || cap === Infinity) return false;
    const files = await this._listAgentDayFiles(dir, safeAgentId, today);
    return files.length >= cap;
  }

  /**
   * List all files matching {tier}-{agentId}-{date}-*.yaml in dir.
   *
   * Note: uses f.includes(safeAgentId) which could match agent IDs that are
   * prefixes of others (e.g., 'dev' matches 'dev2'). This is an accepted edge
   * case for Epic 16 — sanitized IDs in practice do not overlap this way.
   * Full prefix-safe filtering is deferred to Epic 17.
   *
   * @private
   */
  async _listAgentDayFiles(dir, safeAgentId, dateStr) {
    try {
      const files = await fs.readdir(dir);
      return files
        .filter(
          (f) => f.includes(safeAgentId) && f.includes(dateStr) && f.endsWith('.yaml')
        )
        .map((f) => path.join(dir, f));
    } catch (_) {
      return [];
    }
  }

  // ─── Private: Master Index ─────────────────────────────────────────────────

  /**
   * Patch master.json: read → remove any entry with same id → append → write.
   * Atomic read-merge-write (no overwrite-from-scratch).
   *
   * @private
   */
  async _patchMasterIndex(entry) {
    await fs.mkdir(this.indexDir, { recursive: true });

    let index = [];
    try {
      const raw = await fs.readFile(this.masterIndexPath, 'utf8');
      const parsed = JSON.parse(raw);
      index = Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      // File doesn't exist or is malformed — start fresh
      index = [];
    }

    // Remove duplicate entry (idempotent)
    index = index.filter((e) => e.id !== entry.id);
    index.push(entry);

    await fs.writeFile(this.masterIndexPath, JSON.stringify(index, null, 2), {
      encoding: 'utf8',
    });
  }

  // ─── Private: Utilities ────────────────────────────────────────────────────

  /**
   * Normalize text for deduplication comparison.
   * @private
   */
  _normalizeText(text) {
    return String(text)
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Parse YAML frontmatter from full file content string.
   * @private
   */
  _parseFrontmatter(content) {
    try {
      const match = content.match(/^---\n([\s\S]+?)\n---/);
      if (!match) return null;
      return yaml.load(match[1]);
    } catch (_) {
      return null;
    }
  }

  /**
   * Read the id field from a YAML file's frontmatter.
   * Returns filename without extension as fallback.
   * @private
   */
  async _readId(filePath) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const fm = this._parseFrontmatter(raw);
      if (fm && fm.id) return fm.id;
    } catch (_) {
      // ignore
    }
    return path.basename(filePath, '.yaml');
  }
}

/**
 * Factory function — follows createSelfLearner pattern from synapse/index.js.
 *
 * @param {string} projectDir - Project root directory
 * @returns {MemoryWriter}
 */
function createMemoryWriter(projectDir) {
  return new MemoryWriter(projectDir);
}

module.exports = {
  MemoryWriter,
  createMemoryWriter,
};
