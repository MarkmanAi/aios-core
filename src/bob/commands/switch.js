'use strict';

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const chalk = require('chalk');
const { setUserConfigValue } = require('../../../.aios-core/core/config/config-resolver');
const { confirm } = require('@clack/prompts');

const INTERNAL_AGENTS = new Set(['aios-master.md', 'squad-creator.md']);

function getAgentCount() {
  try {
    const agentsDir = path.join(__dirname, '../../../.aios-core/development/agents');
    return fs.readdirSync(agentsDir).filter(
      (f) => f.endsWith('.md') && !f.startsWith('_') && !INTERNAL_AGENTS.has(f),
    ).length;
  } catch (_e) {
    return 11;
  }
}

const agentCount = getAgentCount();
const specialistCount = agentCount - 6;

const ADVANCED_MODE_EXPLANATION = `
Advanced mode gives you access to all ${agentCount} AIOS agents and the full command palette.

  Agents: @dev, @qa, @architect, @pm, @po, @sm + ${specialistCount} more specialists.
  Full command palette — every CLI command becomes available.

You can still use Bob at any time: aios bob do "<request>"
`;

async function runSwitch(options = {}) {
  // AC-1: Always print explanation first
  console.log(ADVANCED_MODE_EXPLANATION);

  // AC-3: --yes skips confirmation prompt
  if (!options.yes) {
    // AC-2: Confirmation prompt — default No
    const shouldSwitch = await confirm({ message: 'Switch to advanced mode?', initialValue: false });
    if (shouldSwitch !== true) {
      // AC-5: Cancel flow (false or symbol from Ctrl+C) — exit code 0
      console.log('No changes made. Bob is still your interface.');
      return;
    }
  }

  // AC-4: Always set profile to advanced (idempotent — safe if already advanced)
  setUserConfigValue('user_profile', 'advanced');
  console.log(chalk.green('Done.') + ' You now have access to all agents. Use @dev, @qa, @architect, etc.');
}

const switchCommand = new Command('switch')
  .description('Switch from Bob mode to advanced agent mode')
  .option('--yes', 'Skip confirmation prompt')
  .action(async (options) => {
    try {
      await runSwitch(options);
    } catch (err) {
      console.error(chalk.red(`Bob switch error: ${err.message}`));
      process.exit(1);
    }
  });

module.exports = switchCommand;
module.exports.runSwitch = runSwitch;
module.exports.getAgentCount = getAgentCount;
