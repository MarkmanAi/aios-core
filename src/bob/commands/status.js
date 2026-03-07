'use strict';

const { Command } = require('commander');

const statusCommand = new Command('status').description(
  'Show current project status in Bob\'s voice',
);


// Implementation: Story 13.8
statusCommand.action(() => {
  console.log('aios bob status — coming in Story 13.8');
});

module.exports = statusCommand;
