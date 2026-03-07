'use strict';

const { Command } = require('commander');

const stopCommand = new Command('stop')
  .description('Stop Bob\'s current operation')
  .option('--force', 'Immediate stop (may leave partial state)');

// Implementation: Story 13.10
stopCommand.action(() => {
  console.log('aios bob stop — coming in Story 13.10');
});

module.exports = stopCommand;
