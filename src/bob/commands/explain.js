'use strict';

const { Command } = require('commander');
const chalk = require('chalk');
const { setUserConfigValue, getConfigAtLevel } = require('../../../.aios-core/core/config/config-resolver');
const { SessionState } = require('../../../.aios-core/core/orchestration/session-state');

async function runExplain(state) {
  const projectRoot = process.cwd();

  // AC-3: No argument — show current state
  if (state === undefined || state === null) {
    const userConfig = getConfigAtLevel(projectRoot, 'user') || {};
    const isOn = userConfig.educational_mode === true;
    console.log(`Educational mode: ${isOn ? chalk.green('ON') : chalk.yellow('OFF')}`);
    return;
  }

  // AC-4: Validate argument
  if (state !== 'on' && state !== 'off') {
    console.error('Usage: aios bob explain [on|off]');
    process.exit(1);
  }

  const enable = state === 'on';

  // AC-1/AC-2: Write to user config (synchronous — persists across sessions)
  setUserConfigValue('educational_mode', enable);

  // AC-1/AC-2: Also sync to session state if a session is active
  try {
    const session = new SessionState(projectRoot);
    const sessionData = await session.loadSessionState();
    if (sessionData) {
      await session.setSessionOverride('educational_mode', enable);
    }
  } catch (_e) {
    // Session sync is non-critical — swallow errors
  }

  // Confirmation message
  if (enable) {
    console.log(chalk.green('Educational mode: ON') + ' — Bob will now explain his reasoning step-by-step.');
  } else {
    console.log(chalk.yellow('Educational mode: OFF') + ' — Bob will be more concise from now on.');
  }
}

const explainCommand = new Command('explain')
  .description('Toggle educational mode on/off')
  .argument('[state]', 'on or off (omit to show current state)')
  .action(async (state) => {
    try {
      await runExplain(state);
    } catch (err) {
      console.error(chalk.red(`Bob explain error: ${err.message}`));
      process.exit(1);
    }
  });

module.exports = explainCommand;
module.exports.runExplain = runExplain;
