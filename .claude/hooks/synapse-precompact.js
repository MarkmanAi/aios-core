#!/usr/bin/env node
/**
 * Hook: SYNAPSE PreCompact Session Digest
 *
 * Fires before Claude Code compacts context. Extracts session knowledge
 * (corrections, patterns, axioms) and writes a YAML digest to
 * .aios/session-digests/ for future retrieval.
 *
 * Fire-and-forget pattern: hook returns to Claude Code immediately (< 50ms).
 * The actual digest extraction runs async via setImmediate.
 *
 * Graceful degradation: any error is caught and logged — compact is NEVER blocked.
 *
 * Registration: handled by @devops in Story 10.7 (.claude/settings.json PreCompact)
 *
 * @see Story 10.5 — SYNAPSE: Session Digest: PreCompact Hook Migration
 */

'use strict';

const path = require('path');

// Resolve extractor relative to this hook file location
// hooks/ → .claude/ → project root → .aios-core/core/synapse/...
const EXTRACTOR_REL = '../../.aios-core/core/synapse/memory/session-digest/extractor';
const EXTRACTOR_PATH = path.resolve(__dirname, EXTRACTOR_REL);

const SELF_LEARNER_REL = '../../.aios-core/core/synapse/memory/self-learner';
const SELF_LEARNER_PATH = path.resolve(__dirname, SELF_LEARNER_REL);

// Fire-and-forget: setImmediate defers execution until AFTER this script returns.
// Claude Code receives control back well within the 50ms budget.
setImmediate(async () => {
  try {
    const { extractSessionDigest } = require(EXTRACTOR_PATH);
    const SelfLearner = require(SELF_LEARNER_PATH);

    // Claude Code passes hook context via stdin (JSON) for PreCompact hooks
    let hookContext = {};
    try {
      const raw = process.env.CLAUDE_HOOK_INPUT || '{}';
      hookContext = JSON.parse(raw);
    } catch (_parseErr) {
      // If parsing fails, proceed with empty context — graceful degradation
      hookContext = {};
    }

    // Validate projectDir stays within the known project root (prevent path traversal)
    const requestedDir = hookContext.projectDir || process.cwd();
    const resolvedDir = path.resolve(requestedDir);
    const safeProjectDir = resolvedDir.startsWith(process.cwd()) ? resolvedDir : process.cwd();

    const context = {
      sessionId: hookContext.sessionId || `session-${Date.now()}`,
      projectDir: safeProjectDir,
      conversation: hookContext.conversation || { messages: [] },
      metadata: hookContext.metadata || {},
    };

    await extractSessionDigest(context);       // writes digest to .aios/session-digests/
    await SelfLearner.run(context.projectDir); // reads digest → MemoryWriter.write()
  } catch (err) {
    // Silent failure — never block compact
    process.stderr.write(`[SYNAPSE] Pipeline error: ${err.message}\n`);
  }
});

// Hook returns here immediately — well within 50ms
