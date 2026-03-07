'use strict';

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

/**
 * Validates that .aios-core/ exists in process.cwd().
 * Exits with code 1 if not found.
 */
function requireAiosInstalled() {
  const aiosCoreDir = path.join(process.cwd(), '.aios-core');
  if (!fs.existsSync(aiosCoreDir)) {
    console.error('Bob requires AIOS to be installed. Run: npx @synkra/aios-install');
    process.exit(1);
  }
}

/**
 * Creates and returns the root `bob` commander command.
 * @returns {Command}
 */
function createBobCommand() {
  const bob = new Command('bob')
    .description('Bob — your simplified AIOS interface')
    .addHelpText('after', '\nExample:\n  aios bob do "implement login feature"')
    .option('--force-bob', 'Force bob mode (for testing/advanced users)');

  // Register subcommands (Stories 13.8–13.12)
  bob.addCommand(require('./commands/status'));
  bob.addCommand(require('./commands/do'));
  bob.addCommand(require('./commands/stop'));
  bob.addCommand(require('./commands/resume'));
  bob.addCommand(require('./commands/explain'));
  bob.addCommand(require('./commands/switch'));

  // Installation guard runs before any subcommand action
  bob.hook('preAction', () => {
    requireAiosInstalled();
  });

  // Default: show help if no subcommand given
  bob.action(() => {
    bob.help();
  });

  return bob;
}

module.exports = { createBobCommand, requireAiosInstalled };
