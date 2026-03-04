/**
 * Permissions Module
 *
 * Provides permission mode management and operation guarding
 * for safe autonomous agent operations.
 *
 * @module permissions
 * @version 1.0.0
 *
 * @example
 * const { PermissionMode, OperationGuard } = require('./.aios-core/core/permissions');
 *
 * // Check current mode
 * const mode = new PermissionMode();
 * await mode.load();
 * console.log(mode.getBadge()); // [⚠️ Ask]
 *
 * // Guard an operation
 * const guard = new OperationGuard(mode);
 * const result = await guard.guard('Bash', { command: 'rm -rf node_modules' });
 * if (result.blocked) {
 *   console.log(result.message);
 * }
 */

const { PermissionMode } = require('./permission-mode');
const { OperationGuard } = require('./operation-guard');

/**
 * Create a pre-configured guard instance
 * @param {string} projectRoot - Project root path
 * @returns {Promise<{mode: PermissionMode, guard: OperationGuard}>}
 */
async function createGuard(projectRoot = process.cwd()) {
  const mode = new PermissionMode(projectRoot);
  await mode.load();
  const guard = new OperationGuard(mode);
  return { mode, guard };
}

/**
 * Quick check if an operation is allowed
 * @param {string} tool - Tool name
 * @param {Object} params - Tool parameters
 * @param {string} projectRoot - Project root path
 * @returns {Promise<Object>} Guard result
 */
async function checkOperation(tool, params, projectRoot = process.cwd()) {
  const { guard } = await createGuard(projectRoot);
  return guard.guard(tool, params);
}

/**
 * Get current mode badge
 * @param {string} projectRoot - Project root path
 * @returns {Promise<string>} Mode badge like "[⚠️ Ask]"
 */
async function getModeBadge(projectRoot = process.cwd()) {
  const mode = new PermissionMode(projectRoot);
  await mode.load();
  return mode.getBadge();
}

/**
 * Set permission mode
 * @param {string} modeName - Mode name (explore, ask, auto)
 * @param {string} projectRoot - Project root path
 * @returns {Promise<Object>} Mode info
 */
async function setMode(modeName, projectRoot = process.cwd()) {
  const mode = new PermissionMode(projectRoot);
  return mode.setMode(modeName);
}

/**
 * Cycle to the next permission mode (explore → ask → auto → explore)
 * @param {string} projectRoot - Project root path
 * @returns {Promise<{mode: string, badge: string, message: string}>} New mode info
 */
async function cycleMode(projectRoot = process.cwd()) {
  const mode = new PermissionMode(projectRoot);
  const result = await mode.cycleMode();
  const badge = mode.getBadge();
  return {
    ...result,
    badge,
    message: `Switched to ${result.name} mode ${badge}`,
  };
}

/**
 * Enforce permission check — returns action decision for a tool call
 * @param {string} tool - Tool name (Read, Write, Edit, Bash, etc.)
 * @param {Object} params - Tool parameters
 * @param {string} projectRoot - Project root path
 * @returns {Promise<{action: 'allow'|'deny'|'prompt', message?: string}>}
 */
async function enforcePermission(tool, params, projectRoot = process.cwd()) {
  const { guard } = await createGuard(projectRoot);
  const result = await guard.guard(tool, params);

  if (result.proceed) {
    return { action: 'allow' };
  }
  if (result.blocked) {
    return { action: 'deny', message: result.message };
  }
  if (result.needsConfirmation) {
    return { action: 'prompt', message: result.message };
  }
  return { action: 'deny', message: 'Unknown permission state' };
}

module.exports = {
  PermissionMode,
  OperationGuard,
  createGuard,
  checkOperation,
  getModeBadge,
  setMode,
  cycleMode,
  enforcePermission,
};
