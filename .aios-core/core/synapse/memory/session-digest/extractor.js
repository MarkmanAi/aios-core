/**
 * Session Digest Extractor - Core Intelligence Logic
 *
 * Extracts session knowledge (corrections, patterns, axioms) before context compact.
 * Generates YAML digest files in .aios/session-digests/ for future retrieval.
 *
 * Architecture: Open Core (AIOS Pro)
 * - This module is part of aios-pro (proprietary memory intelligence)
 * - Called by aios-core hook runner via extension point
 *
 * @module core/synapse/memory/session-digest/extractor
 * @see Story 10.5 - Session Digest (PreCompact Hook Migration)
 * @see Story MIS-1 - Memory Intelligence System Investigation
 */

'use strict';

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

/**
 * Schema version for digest format
 * Increment when schema changes (1.0 → 1.1 → 2.0)
 */
const SCHEMA_VERSION = '1.0';

/**
 * Extract session digest from conversation context
 *
 * Analysis performed:
 * 1. User corrections - Identify when user corrects agent assumptions
 * 2. Patterns observed - Recurring patterns in conversation flow
 * 3. Axioms learned - Core truths discovered during session
 * 4. Context snapshot - High-level session state
 *
 * @param {Object} context - Hook context from Claude Code
 * @param {string} context.sessionId - Unique session identifier
 * @param {string} context.projectDir - Project root directory
 * @param {Object} context.conversation - Conversation metadata
 * @param {Array} context.conversation.messages - Conversation messages
 * @param {Object} context.metadata - Additional metadata (agent, compact trigger)
 * @returns {Promise<string>} Path to generated digest file
 */
async function extractSessionDigest(context) {
  const startTime = Date.now();

  try {
    // 1. Parse context and extract insights
    const insights = await analyzeConversation(context);

    // 2. Generate digest document
    const digest = generateDigestDocument(context, insights);

    // 3. Write to storage
    const digestPath = await writeDigest(context.projectDir, context.sessionId, digest);

    const duration = Date.now() - startTime;
    console.log(`[SessionDigest] Digest created successfully in ${duration}ms: ${digestPath}`);

    return digestPath;
  } catch (error) {
    console.error('[SessionDigest] Extraction failed:', error.message);
    throw error;
  }
}

/**
 * Analyze conversation to extract actionable insights
 *
 * @param {Object} context - Hook context
 * @returns {Promise<Object>} Extracted insights
 * @private
 */
async function analyzeConversation(context) {
  const { conversation, metadata } = context;

  // Extract user corrections (when user says "actually", "no", "wrong")
  const corrections = extractCorrections(conversation.messages || []);

  // Identify patterns (repeated behaviors, common sequences)
  const patterns = identifyPatterns(conversation.messages || []);

  // Extract axioms (fundamental truths learned)
  const axioms = extractAxioms(conversation.messages || []);

  // Capture context snapshot
  const contextSnapshot = captureContextSnapshot(metadata || {});

  return {
    corrections,
    patterns,
    axioms,
    contextSnapshot,
  };
}

/**
 * Extract user corrections from conversation messages
 *
 * Detects phrases like:
 * - "Actually, ..."
 * - "No, ..."
 * - "That's wrong, ..."
 * - "The correct way is ..."
 *
 * @param {Array} messages - Conversation messages
 * @returns {Array<string>} List of corrections
 * @private
 */
function extractCorrections(messages) {
  const correctionKeywords = [
    /actually,/i,
    /no,\s+(that's|the)/i,
    /that's\s+(wrong|incorrect)/i,
    /the\s+correct\s+(way|approach|answer)/i,
  ];

  const corrections = [];

  for (const message of messages) {
    if (message.role !== 'user') continue;

    const content = message.content || '';

    for (const regex of correctionKeywords) {
      if (regex.test(content)) {
        // Extract the correction sentence
        const sentences = content.split(/[.!?]\s+/);
        for (const sentence of sentences) {
          if (regex.test(sentence)) {
            corrections.push(sentence.trim());
            break;
          }
        }
        break;
      }
    }
  }

  return corrections.slice(0, 10); // Limit to 10 most relevant
}

/**
 * Identify recurring patterns in conversation
 *
 * @param {Array} messages - Conversation messages
 * @returns {Array<string>} List of observed patterns
 * @private
 */
function identifyPatterns(messages) {
  const patterns = [];

  // Pattern: Repeated question types
  const questionTypes = {};
  for (const message of messages) {
    if (message.role === 'user' && message.content) {
      const content = message.content.toLowerCase();
      if (content.includes('how do i')) questionTypes['how-to'] = (questionTypes['how-to'] || 0) + 1;
      if (content.includes('what is')) questionTypes['definition'] = (questionTypes['definition'] || 0) + 1;
      if (content.includes('why')) questionTypes['reason'] = (questionTypes['reason'] || 0) + 1;
    }
  }

  // Report patterns with 3+ occurrences
  for (const [type, count] of Object.entries(questionTypes)) {
    if (count >= 3) {
      patterns.push(`Pattern: User frequently asks "${type}" questions (${count} times)`);
    }
  }

  // Pattern: Tool usage frequency
  // (This would require access to tool call data from context)

  return patterns.slice(0, 5); // Limit to 5 most relevant
}

/**
 * Extract axioms (fundamental truths) from conversation
 *
 * Axioms are statements of fact or principle learned during the session.
 *
 * @param {Array} messages - Conversation messages
 * @returns {Array<string>} List of axioms
 * @private
 */
function extractAxioms(messages) {
  const axiomKeywords = [
    /\balways\s+/i,
    /\bnever\s+/i,
    /\bmust\s+/i,
    /\brequired:\s+/i,
    /\bprinciple:\s+/i,
  ];

  const axioms = [];

  for (const message of messages) {
    const content = message.content || '';

    for (const regex of axiomKeywords) {
      if (regex.test(content)) {
        const sentences = content.split(/[.!?]\s+/);
        for (const sentence of sentences) {
          if (regex.test(sentence)) {
            axioms.push(sentence.trim());
          }
        }
      }
    }
  }

  return axioms.slice(0, 10); // Limit to 10 most relevant
}

/**
 * Capture high-level context snapshot
 *
 * @param {Object} metadata - Context metadata
 * @returns {Object} Context snapshot
 * @private
 */
function captureContextSnapshot(metadata) {
  return {
    activeAgent: metadata.activeAgent || 'unknown',
    activeStory: metadata.activeStory || 'none',
    filesModified: metadata.filesModified || [],
    commandsExecuted: metadata.commandsExecuted || [],
  };
}

/**
 * Generate digest document with schema
 *
 * @param {Object} context - Hook context
 * @param {Object} insights - Extracted insights
 * @returns {Object} Digest document
 * @private
 */
function generateDigestDocument(context, insights) {
  const timestamp = new Date().toISOString();

  // Calculate session duration (approximate)
  const sessionStart = context.metadata?.sessionStart || Date.now();
  const durationMinutes = Math.round((Date.now() - sessionStart) / 60000);

  return {
    // YAML Frontmatter
    schema_version: SCHEMA_VERSION,
    session_id: context.sessionId,
    timestamp,
    duration_minutes: durationMinutes,
    agent_context: insights.contextSnapshot.activeAgent || 'unknown',
    compact_trigger: context.metadata?.compactTrigger || 'context_limit',
    // Body
    body: {
      user_corrections: insights.corrections,
      patterns_observed: insights.patterns,
      axioms_learned: insights.axioms,
      context_snapshot: insights.contextSnapshot,
    },
  };
}

/**
 * Write digest to storage
 *
 * File naming: {session-id}-{timestamp}.yaml
 * Directory: .aios/session-digests/
 *
 * @param {string} projectDir - Project root directory
 * @param {string} sessionId - Session identifier
 * @param {Object} digest - Digest document
 * @returns {Promise<string>} Path to written file
 * @private
 */
async function writeDigest(projectDir, sessionId, digest) {
  const storageDir = path.join(projectDir, '.aios', 'session-digests');

  // Ensure directory exists
  await fs.mkdir(storageDir, { recursive: true });

  // Sanitize sessionId to prevent path traversal in filename
  const safeSessionId = sessionId.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 64);

  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${safeSessionId}-${timestamp}.yaml`;
  const filePath = path.join(storageDir, filename);

  // Separate frontmatter and body
  const frontmatter = {
    schema_version: digest.schema_version,
    session_id: digest.session_id,
    timestamp: digest.timestamp,
    duration_minutes: digest.duration_minutes,
    agent_context: digest.agent_context,
    compact_trigger: digest.compact_trigger,
  };

  const body = digest.body;

  // Generate YAML with frontmatter + body
  const yamlContent = generateYAML(frontmatter, body);

  // Write file
  await fs.writeFile(filePath, yamlContent, 'utf8');

  return filePath;
}

/**
 * Generate YAML content with frontmatter and body
 *
 * Format:
 * ---
 * frontmatter fields
 * ---
 *
 * ## Body sections
 *
 * @param {Object} frontmatter - Frontmatter fields
 * @param {Object} body - Body content
 * @returns {string} YAML content
 * @private
 */
function generateYAML(frontmatter, body) {
  const parts = [];

  // Frontmatter
  parts.push('---');
  parts.push(yaml.dump(frontmatter).trim());
  parts.push('---');
  parts.push('');

  // Body - User Corrections
  parts.push('## User Corrections');
  parts.push('');
  if (body.user_corrections.length > 0) {
    for (const correction of body.user_corrections) {
      parts.push(`- "${correction}"`);
    }
  } else {
    parts.push('- (none captured)');
  }
  parts.push('');

  // Body - Patterns Observed
  parts.push('## Patterns Observed');
  parts.push('');
  if (body.patterns_observed.length > 0) {
    for (const pattern of body.patterns_observed) {
      parts.push(`- ${pattern}`);
    }
  } else {
    parts.push('- (none identified)');
  }
  parts.push('');

  // Body - Axioms Learned
  parts.push('## Axioms Learned');
  parts.push('');
  if (body.axioms_learned.length > 0) {
    for (const axiom of body.axioms_learned) {
      parts.push(`- Axiom: "${axiom}"`);
    }
  } else {
    parts.push('- (none extracted)');
  }
  parts.push('');

  // Body - Context Snapshot
  parts.push('## Context Snapshot');
  parts.push('');
  parts.push(`**Active Agent:** ${body.context_snapshot.activeAgent || 'unknown'}`);
  parts.push(`**Active Story:** ${body.context_snapshot.activeStory || 'none'}`);
  parts.push(`**Files Modified:** ${(body.context_snapshot.filesModified || []).join(', ') || 'none'}`);
  parts.push(`**Commands Executed:** ${(body.context_snapshot.commandsExecuted || []).join(', ') || 'none'}`);

  return parts.join('\n');
}

module.exports = {
  extractSessionDigest,
  // Exported for testing
  _analyzeConversation: analyzeConversation,
  _generateDigestDocument: generateDigestDocument,
  _writeDigest: writeDigest,
};
