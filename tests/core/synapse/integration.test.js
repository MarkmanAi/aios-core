'use strict';

/**
 * Integration test for SYNAPSE pipeline — Story 10.7
 *
 * Verifies: ManifestParser → getActiveDomains → DomainInjector → .aios/active-domains.md
 * Verifies: public API barrel (index.js) exports all 5 required items
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const SYNAPSE_DIR = path.resolve(__dirname, '../../../.aios-core/core/synapse');

// ──────────────────────────────────────────────────────────────────────────────
// Public API barrel
// ──────────────────────────────────────────────────────────────────────────────

describe('SYNAPSE public API (index.js)', () => {
  let api;

  beforeAll(() => {
    api = require(SYNAPSE_DIR);
  });

  it('exports ManifestParser', () => {
    expect(typeof api.ManifestParser).toBe('function');
  });

  it('exports DomainInjector', () => {
    expect(typeof api.DomainInjector).toBe('function');
  });

  it('exports SynapseMemoryProvider', () => {
    expect(typeof api.SynapseMemoryProvider).toBe('function');
  });

  it('exports createMemoryLoader', () => {
    expect(typeof api.createMemoryLoader).toBe('function');
  });

  it('exports createSelfLearner', () => {
    expect(typeof api.createSelfLearner).toBe('function');
  });

  it('exports exactly 5 items', () => {
    expect(Object.keys(api)).toHaveLength(5);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Full pipeline smoke test
// ──────────────────────────────────────────────────────────────────────────────

describe('SYNAPSE full pipeline smoke test', () => {
  let tmpDir;
  let ManifestParser;
  let DomainInjector;

  beforeAll(() => {
    ({ ManifestParser, DomainInjector } = require(SYNAPSE_DIR));
    // Use a temp directory so tests never pollute the real .aios/
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'synapse-test-'));
  });

  afterAll(() => {
    // Clean up temp directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('ManifestParser instantiates without error', () => {
    const parser = new ManifestParser(SYNAPSE_DIR);
    expect(parser).toBeDefined();
  });

  it('parse() returns a non-empty registry', () => {
    const parser = new ManifestParser(SYNAPSE_DIR);
    const registry = parser.parse();
    expect(typeof registry).toBe('object');
    expect(Object.keys(registry).length).toBeGreaterThan(0);
  });

  it('getActiveDomains({ agentId: "dev" }) returns at least L0, L1, L2, L7 domains', () => {
    const parser = new ManifestParser(SYNAPSE_DIR);
    const registry = parser.parse();
    const active = parser.getActiveDomains(registry, { agentId: 'dev' });

    expect(Array.isArray(active)).toBe(true);
    expect(active.length).toBeGreaterThan(0);

    const layers = active.map((d) => d.layer);
    expect(layers).toContain('L0');
    expect(layers).toContain('L1');
    expect(layers).toContain('L2');
    expect(layers).toContain('L7');
  });

  it('getActiveDomains({ agentId: "dev" }) includes agent-dev in L2', () => {
    const parser = new ManifestParser(SYNAPSE_DIR);
    const registry = parser.parse();
    const active = parser.getActiveDomains(registry, { agentId: 'dev' });
    const l2 = active.filter((d) => d.layer === 'L2');
    expect(l2.some((d) => d.file === 'agent-dev')).toBe(true);
  });

  it('DomainInjector.inject() returns a non-empty markdown string', () => {
    const parser = new ManifestParser(SYNAPSE_DIR);
    const registry = parser.parse();
    const active = parser.getActiveDomains(registry, { agentId: 'dev' });

    const injector = new DomainInjector(SYNAPSE_DIR);
    const content = injector.inject(active);

    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    expect(content).toContain('# SYNAPSE Active Domains');
  });

  it('DomainInjector.inject() output respects layer order (L0 before L1 before L7)', () => {
    const parser = new ManifestParser(SYNAPSE_DIR);
    const registry = parser.parse();
    const active = parser.getActiveDomains(registry, { agentId: 'dev' });

    const injector = new DomainInjector(SYNAPSE_DIR);
    const content = injector.inject(active);

    const l0pos = content.indexOf('(L0)');
    const l1pos = content.indexOf('(L1)');
    const l7pos = content.indexOf('(L7)');

    expect(l0pos).toBeLessThan(l1pos);
    expect(l1pos).toBeLessThan(l7pos);
  });

  it('writeSessionFile() creates .aios/active-domains.md in temp dir', () => {
    const parser = new ManifestParser(SYNAPSE_DIR);
    const registry = parser.parse();
    const active = parser.getActiveDomains(registry, { agentId: 'dev' });

    const injector = new DomainInjector(SYNAPSE_DIR);
    const content = injector.inject(active);
    const outPath = injector.writeSessionFile(content, tmpDir);

    expect(fs.existsSync(outPath)).toBe(true);
    expect(outPath).toContain('active-domains.md');
    const written = fs.readFileSync(outPath, 'utf8');
    expect(written).toContain('# SYNAPSE Active Domains');
  });

  it('getStatus() returns initialized=true after writeSessionFile()', () => {
    const injector = new DomainInjector(SYNAPSE_DIR);
    const status = injector.getStatus(tmpDir);

    expect(status.initialized).toBe(true);
    expect(Array.isArray(status.activeDomains)).toBe(true);
    expect(status.activeDomains.length).toBeGreaterThan(0);
    expect(typeof status.updatedAt).toBe('string');
  });

  it('getStatus() returns initialized=false when .aios/active-domains.md missing', () => {
    const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'synapse-empty-'));
    try {
      const injector = new DomainInjector(SYNAPSE_DIR);
      const status = injector.getStatus(emptyDir);
      expect(status.initialized).toBe(false);
      expect(status.activeDomains).toHaveLength(0);
    } finally {
      fs.rmSync(emptyDir, { recursive: true, force: true });
    }
  });
});
