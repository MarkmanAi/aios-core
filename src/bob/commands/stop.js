'use strict';

const { Command } = require('commander');
const path = require('path');
const fsPromises = require('fs').promises;
const chalk = require('chalk');
const { SessionState } = require('../../../.aios-core/core/orchestration/session-state');
const LockManager = require('../../../.aios-core/core/orchestration/lock-manager');
const { BobStatusWriter } = require('../../../.aios-core/core/orchestration/bob-status-writer');
const { loadProjectStatus } = require('../../../.aios-core/infrastructure/scripts/project-status-loader');
const { readBobStatus, formatOutput } = require('./status');

async function showCurrentStatus() {
  try {
    const projectStatus = await loadProjectStatus();
    const bobStatus = readBobStatus();
    console.log(formatOutput(projectStatus, bobStatus));
    console.log('');
  } catch {
    // Status display is non-critical — swallow errors
  }
}

async function runStop(options) {
  const projectRoot = process.cwd();

  // AC-6: Show current status before stop
  await showCurrentStatus();

  const lockMgr = new LockManager(projectRoot);

  // AC-3: Check if anything is running
  const isRunning = await lockMgr.isLocked('bob-orchestration');
  if (!isRunning) {
    console.log('Nothing is running. Start with: aios bob do "<request>"');
    return;
  }

  if (options.force) {
    // AC-2: Force stop — direct unlink bypasses PID ownership check
    const lockFilePath = path.join(projectRoot, '.aios/locks/bob-orchestration.lock');
    try {
      await fsPromises.unlink(lockFilePath);
    } catch {
      // lock already gone — that's fine
    }

    // Write ABORTED status to dashboard file
    const writer = new BobStatusWriter(projectRoot);
    const currentStatus = await writer.readStatus();
    if (currentStatus) {
      await writer.writeBobStatus({
        ...currentStatus,
        orchestration: { ...currentStatus.orchestration, active: false },
        pipeline: { ...currentStatus.pipeline, current_stage: 'ABORTED' },
      });
    }

    console.log(chalk.yellow('Bob stopped immediately. Session saved. Resume with: aios bob resume'));
  } else {
    // AC-1: Graceful stop — set override flag in session state
    const session = new SessionState(projectRoot);
    await session.loadSessionState();
    if (session.state) {
      await session.setSessionOverride('stop_requested', true);
    }
    console.log(chalk.blue('Bob will stop after completing the current task. Saving checkpoint...'));
  }
}

const stopCommand = new Command('stop')
  .description("Stop Bob's current operation")
  .option('--force', 'Immediate stop (may leave partial state)')
  .action(async (options) => {
    try {
      await runStop(options);
    } catch (err) {
      console.error(chalk.red(`Bob stop error: ${err.message}`));
      process.exit(1);
    }
  });

module.exports = stopCommand;
module.exports.runStop = runStop;
