'use strict';

const path = require('path');
const { ManifestParser } = require('../../../.aios-core/core/synapse/manifest-parser');

const SYNAPSE_DIR = path.resolve(__dirname, '../../../.aios-core/core/synapse');

describe('ManifestParser', () => {
  let parser;
  let registry;

  beforeAll(() => {
    parser = new ManifestParser(SYNAPSE_DIR);
    registry = parser.parse();
  });

  describe('parse()', () => {
    it('should return a non-empty registry object', () => {
      expect(registry).toBeDefined();
      expect(typeof registry).toBe('object');
      expect(Object.keys(registry).length).toBeGreaterThan(0);
    });

    it('should parse key=value pairs correctly', () => {
      expect(registry.DEVMODE).toBe('false');
      expect(registry.CONSTITUTION_STATE).toBe('active');
      expect(registry.GLOBAL_ALWAYS_ON).toBe('true');
    });

    it('should skip comment lines starting with #', () => {
      const keys = Object.keys(registry);
      const commentKeys = keys.filter((k) => k.startsWith('#'));
      expect(commentKeys).toHaveLength(0);
    });

    it('should skip empty lines (no empty-string keys)', () => {
      expect(registry['']).toBeUndefined();
    });

    it('DEVMODE flag should be readable from registry', () => {
      expect(registry.DEVMODE).toBe('false');
    });
  });

  describe('getActiveDomains() — L0/L1/L7 always active', () => {
    it('should always include constitution (L0)', () => {
      const domains = parser.getActiveDomains(registry);
      const found = domains.find((d) => d.file === 'constitution' && d.layer === 'L0');
      expect(found).toBeDefined();
    });

    it('should always include global (L1)', () => {
      const domains = parser.getActiveDomains(registry);
      const found = domains.find((d) => d.file === 'global' && d.layer === 'L1');
      expect(found).toBeDefined();
    });

    it('should always include context (L1)', () => {
      const domains = parser.getActiveDomains(registry);
      const found = domains.find((d) => d.file === 'context' && d.layer === 'L1');
      expect(found).toBeDefined();
    });

    it('should always include commands (L7)', () => {
      const domains = parser.getActiveDomains(registry);
      const found = domains.find((d) => d.file === 'commands' && d.layer === 'L7');
      expect(found).toBeDefined();
    });

    it('should return always-on domains even with no agent or workflow', () => {
      const domains = parser.getActiveDomains(registry, {});
      const layers = domains.map((d) => d.layer);
      expect(layers).toContain('L0');
      expect(layers).toContain('L1');
      expect(layers).toContain('L7');
    });
  });

  describe('getActiveDomains() — L2 agent activation', () => {
    it('agentId=dev activates agent-dev in L2', () => {
      const domains = parser.getActiveDomains(registry, { agentId: 'dev' });
      const l2 = domains.filter((d) => d.layer === 'L2');
      expect(l2).toHaveLength(1);
      expect(l2[0].file).toBe('agent-dev');
    });

    it('agentId=dev does NOT activate agent-qa', () => {
      const domains = parser.getActiveDomains(registry, { agentId: 'dev' });
      const qaEntry = domains.find((d) => d.file === 'agent-qa');
      expect(qaEntry).toBeUndefined();
    });

    it('agentId=dev does NOT activate agent-pm', () => {
      const domains = parser.getActiveDomains(registry, { agentId: 'dev' });
      const pmEntry = domains.find((d) => d.file === 'agent-pm');
      expect(pmEntry).toBeUndefined();
    });

    it('agentId=data-engineer activates agent-data-engineer (hyphenated prefix)', () => {
      const domains = parser.getActiveDomains(registry, { agentId: 'data-engineer' });
      const l2 = domains.filter((d) => d.layer === 'L2');
      expect(l2).toHaveLength(1);
      expect(l2[0].file).toBe('agent-data-engineer');
    });

    it('agentId=ux-design-expert activates agent-ux', () => {
      const domains = parser.getActiveDomains(registry, { agentId: 'ux-design-expert' });
      const l2 = domains.filter((d) => d.layer === 'L2');
      expect(l2).toHaveLength(1);
      expect(l2[0].file).toBe('agent-ux');
    });

    it('unknown agentId returns empty L2 array (no crash)', () => {
      const domains = parser.getActiveDomains(registry, { agentId: 'nonexistent-agent' });
      const l2 = domains.filter((d) => d.layer === 'L2');
      expect(l2).toHaveLength(0);
    });
  });

  describe('getActiveDomains() — L3 workflow activation', () => {
    it('workflowPhase=story_development activates workflow-story-dev in L3', () => {
      const domains = parser.getActiveDomains(registry, { workflowPhase: 'story_development' });
      const l3 = domains.filter((d) => d.layer === 'L3');
      expect(l3).toHaveLength(1);
      expect(l3[0].file).toBe('workflow-story-dev');
    });

    it('workflowPhase=epic_creation activates workflow-epic-create in L3', () => {
      const domains = parser.getActiveDomains(registry, { workflowPhase: 'epic_creation' });
      const l3 = domains.filter((d) => d.layer === 'L3');
      expect(l3).toHaveLength(1);
      expect(l3[0].file).toBe('workflow-epic-create');
    });

    it('workflowPhase=architecture_review activates workflow-arch-review in L3', () => {
      const domains = parser.getActiveDomains(registry, { workflowPhase: 'architecture_review' });
      const l3 = domains.filter((d) => d.layer === 'L3');
      expect(l3).toHaveLength(1);
      expect(l3[0].file).toBe('workflow-arch-review');
    });

    it('unknown workflowPhase returns empty L3 (no crash)', () => {
      const domains = parser.getActiveDomains(registry, { workflowPhase: 'nonexistent_phase' });
      const l3 = domains.filter((d) => d.layer === 'L3');
      expect(l3).toHaveLength(0);
    });
  });

  describe('getActiveDomains() — combined context', () => {
    it('agent + workflow both activate their respective layers', () => {
      const domains = parser.getActiveDomains(registry, {
        agentId: 'qa',
        workflowPhase: 'story_development',
      });
      const l2 = domains.filter((d) => d.layer === 'L2');
      const l3 = domains.filter((d) => d.layer === 'L3');
      expect(l2[0].file).toBe('agent-qa');
      expect(l3[0].file).toBe('workflow-story-dev');
    });
  });
});
