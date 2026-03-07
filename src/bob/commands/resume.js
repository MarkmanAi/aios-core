'use strict';

const { Command } = require('commander');

const resumeCommand = new Command('resume').description('Resume Bob\'s last operation from checkpoint');

// Implementation: Story 13.10
resumeCommand.action(() => {
  console.log('aios bob resume — coming in Story 13.10');
});

module.exports = resumeCommand;
