'use strict';

const { Command } = require('commander');

const switchCommand = new Command('switch')
  .description('Switch from Bob mode to advanced agent mode')
  .option('--yes', 'Skip confirmation prompt');

// Implementation: Story 13.12
switchCommand.action(() => {
  console.log('aios bob switch — coming in Story 13.12');
});

module.exports = switchCommand;
