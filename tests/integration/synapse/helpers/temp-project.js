'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const FIXTURES_DIR = path.join(process.cwd(), 'tests', 'fixtures', 'synapse', 'digests');

/**
 * Create an isolated temp project directory with fixture digests loaded.
 * SelfLearner reads from {projectDir}/.aios/session-digests/
 *
 * @returns {string} tempDir path
 */
function createTempProject() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-memory-cycle-test-'));
  const digestsDir = path.join(tempDir, '.aios', 'session-digests');
  fs.mkdirSync(digestsDir, { recursive: true });

  const files = fs.readdirSync(FIXTURES_DIR).filter(f => f.endsWith('.yaml'));
  for (const file of files) {
    fs.copyFileSync(path.join(FIXTURES_DIR, file), path.join(digestsDir, file));
  }

  return tempDir;
}

/**
 * Remove temp project directory recursively.
 *
 * @param {string} tempDir
 */
function cleanupTempProject(tempDir) {
  if (tempDir && fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

module.exports = { createTempProject, cleanupTempProject };
