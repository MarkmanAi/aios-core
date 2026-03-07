'use strict';

const { Command } = require('commander');

const explainCommand = new Command('explain')
  .description('Toggle educational mode on/off')
  .argument('[state]', 'on or off (omit to show current state)');

// Implementation: Story 13.11
explainCommand.action((_state) => {
  console.log('aios bob explain — coming in Story 13.11');
});

module.exports = explainCommand;
