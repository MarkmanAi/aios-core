'use strict';

const { loadProjectStatus } = require('../../../.aios-core/infrastructure/scripts/project-status-loader');
const { readBobStatus, formatOutput } = require('../commands/status');

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

module.exports = { showCurrentStatus };
