'use strict';

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const { SessionState } = require('../../../.aios-core/core/orchestration/session-state');
const { BobOrchestrator } = require('../../../.aios-core/core/orchestration/bob-orchestrator');
const { showCurrentStatus } = require('../utils/show-current-status');

async function runResume() {
  const projectRoot = process.cwd();

  // AC-6: Show current status before resume
  await showCurrentStatus();

  // AC-5: Check if session exists on disk
  const session = new SessionState(projectRoot);
  const state = await session.loadSessionState();

  if (!state) {
    console.log('No session to resume. Start with: aios bob do "<request>"');
    return;
  }

  // Describe checkpoint for user (AC-4 output)
  const lastAction = (state.session_state && state.session_state.last_action) || {};
  const progress = (state.session_state && state.session_state.progress) || {};
  const description = `Story ${progress.current_story || 'unknown'} — phase: ${lastAction.phase || 'start'}`;
  console.log(chalk.blue(`Resuming from: ${description}`));

  const spinner = ora('Bob is resuming...').start();

  try {
    // orchestrate() auto-detects session from disk — no special context keys
    const orchestrator = new BobOrchestrator(projectRoot);
    const result = await orchestrator.orchestrate({});
    spinner.stop();

    if (result.action === 'resume_prompt') {
      // Auto-select 'continue' — user already expressed intent via `aios bob resume`
      const resumeResult = await orchestrator.handleSessionResume('continue');
      if (resumeResult.action === 'continue') {
        console.log(chalk.green('\nBob here. Resumed.'));
        console.log('Next: Run "aios bob status" to see where things stand');
      } else {
        console.log(chalk.blue(`Resume result: ${resumeResult.action}`));
      }
    } else if (result.success) {
      console.log(chalk.green('\nBob here. Done.'));
      console.log('Next: Run "aios bob status" to see where things stand');
    } else {
      console.error(chalk.red(`Bob: ${result.error || 'Resume failed'}`));
      process.exit(1);
    }
  } catch (err) {
    spinner.fail(`Bob resume error: ${err.message}`);
    process.exit(1);
  }
}

const resumeCommand = new Command('resume')
  .description("Resume Bob's last operation from checkpoint")
  .action(async () => {
    try {
      await runResume();
    } catch (err) {
      console.error(chalk.red(`Bob resume error: ${err.message}`));
      process.exit(1);
    }
  });

module.exports = resumeCommand;
module.exports.runResume = runResume;
