'use strict';

const { Command } = require('commander');

const doCommand = new Command('do')
  .description('Delegate a natural language task to Bob')
  .argument('<request>', 'What you want Bob to do');

// Implementation: Story 13.9
doCommand.action((_request) => {
  console.log('aios bob do — coming in Story 13.9');
});

module.exports = doCommand;
