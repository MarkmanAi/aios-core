/**
 * Codex Transformer - Skill format for squad chief agents
 * @story 25.3 - IDE Sync Codex Transformer
 *
 * Format: SKILL.md with YAML frontmatter (name, description) + commands
 * Target: .codex/skills/{agent_id}/SKILL.md (directory-based output)
 */

const { getVisibleCommands, normalizeCommands } = require('../agent-parser');

// Core AIOS agents always included in Codex skill generation
const CORE_AGENT_IDS = new Set([
  'dev',
  'qa',
  'architect',
  'sm',
  'po',
  'pm',
  'analyst',
  'data-engineer',
  'ux-design-expert',
  'devops',
  'synapse',
  'aios-master',
]);

/**
 * Determine if an agent should be included in the chiefs-only Codex target.
 * Includes: core agents, ids ending with -chief or -master, and agents with
 * explicit isChief or isOrchestrator flags in their YAML definition.
 * @param {object} agentData - Parsed agent data from agent-parser
 * @returns {boolean}
 */
function isChiefAgent(agentData) {
  const id = agentData.id || '';
  const parsed = agentData.yaml || {};
  const agent = agentData.agent || {};

  // Core agents are always entry points
  if (CORE_AGENT_IDS.has(id)) return true;

  // Chiefs and orchestrators by ID suffix
  if (id.endsWith('-chief') || id.endsWith('-master')) return true;

  // Explicit YAML flags at top level or inside agent block
  if (parsed.isChief || parsed.isOrchestrator) return true;
  if (agent.isChief || agent.isOrchestrator) return true;

  return false;
}

/**
 * Transform agent data to Codex SKILL.md format.
 * Generates YAML frontmatter (name, description) followed by structured
 * sections for when-to-use and quick commands.
 * @param {object} agentData - Parsed agent data from agent-parser
 * @returns {string} - SKILL.md content
 */
function transform(agentData) {
  const agent = agentData.agent || {};

  const name = agent.name || agentData.id;
  const title = agent.title || 'AIOS Agent';
  const icon = agent.icon || '🤖';
  const whenToUse = agent.whenToUse || 'Use this agent for specific tasks';

  const skillName = `${icon} ${name} — ${title}`;

  // YAML frontmatter required by Codex
  let content = `---\nname: "${skillName}"\ndescription: "${whenToUse}"\n---\n\n`;

  // Heading
  content += `# ${skillName} (@${agentData.id})\n\n`;

  // When to use
  content += `## When to Use\n\n${whenToUse}\n\n`;

  // Quick commands (visible: quick)
  const allCommands = normalizeCommands(agentData.commands || []);
  const quickCommands = getVisibleCommands(allCommands, 'quick');

  if (quickCommands.length > 0) {
    content += '## Quick Commands\n\n';
    for (const cmd of quickCommands) {
      content += `- \`*${cmd.name}\` — ${cmd.description || 'No description'}\n`;
    }
    content += '\n';
  }

  // Sync footer
  content += `---\n*AIOS Skill - Synced from .aios-core/development/agents/${agentData.filename}*\n`;

  return content;
}

/**
 * Get the target path for this agent.
 * Returns a directory-based path: {agent_id}/SKILL.md
 * @param {object} agentData - Parsed agent data
 * @returns {string} - Relative path (e.g. 'dev/SKILL.md')
 */
function getFilename(agentData) {
  return `${agentData.id}/SKILL.md`;
}

module.exports = {
  transform,
  getFilename,
  isChiefAgent,
  format: 'codex-skill',
};
