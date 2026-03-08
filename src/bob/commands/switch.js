'use strict';

const { Command } = require('commander');
const chalk = require('chalk');
const { toggleUserProfile } = require('../../../.aios-core/core/config/config-resolver');
const { confirm } = require('@clack/prompts');

const ADVANCED_MODE_EXPLANATION = `
Advanced mode gives you access to all 11 AIOS agents and the full command palette.

  Agents: @dev, @qa, @architect, @pm, @po, @sm + 5 more specialists.
  Full command palette — every CLI command becomes available.

You can still use Bob at any time: aios bob do "<request>"
`;

async function runSwitch(options = {}) {
  // AC-1: Always print explanation first
  console.log(ADVANCED_MODE_EXPLANATION);

  // AC-3: --yes skips confirmation prompt
  if (!options.yes) {
    // AC-2: Confirmation prompt — default No
    const shouldSwitch = await confirm({ message: 'Switch to advanced mode?' });
    if (shouldSwitch !== true) {
      // AC-5: Cancel flow (false or symbol from Ctrl+C) — exit code 0
      console.log('No changes made. Bob is still your interface.');
      return;
    }
  }

  // AC-4: Toggle profile bob→advanced (no argument — toggles deterministically)
  toggleUserProfile();
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
