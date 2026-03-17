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

  // Rewrite timestamps to today so confidence stays above threshold regardless of when tests run.
  // The confidence formula penalizes recency; fixtures older than ~8 days fall below 0.9.
  const baseTime = Date.now();
  const files = fs.readdirSync(FIXTURES_DIR).filter(f => f.endsWith('.yaml'));
  for (let i = 0; i < files.length; i++) {
    const src = path.join(FIXTURES_DIR, files[i]);
    const content = fs.readFileSync(src, 'utf8');
    // Each fixture gets a timestamp 1 hour apart, ending 1 hour before "now"
    const ts = new Date(baseTime - (files.length - i) * 60 * 60 * 1000).toISOString();
    const updated = content.replace(/^(timestamp:\s*")[^"]*(")/m, `$1${ts}$2`);
    fs.writeFileSync(path.join(digestsDir, files[i]), updated);
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
