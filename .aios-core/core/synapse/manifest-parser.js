'use strict';

const fs = require('fs');
const path = require('path');

class ManifestParser {
  constructor(synapseDir) {
    this.synapseDir = synapseDir;
    this.manifestPath = path.join(synapseDir, '.synapse', 'manifest');
  }

  // Parse manifest file → registry object
  parse() {
    const content = fs.readFileSync(this.manifestPath, 'utf8');
    const registry = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      registry[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
    return registry;
  }

  // Return active domains based on agent + workflow context
  getActiveDomains(registry, { agentId = null, workflowPhase = null } = {}) {
    const active = [];

    // L0: Constitution (always)
    if (registry.CONSTITUTION_STATE === 'active') {
      active.push({ file: 'constitution', layer: 'L0' });
    }

    // L1: Global + Context (always_on)
    if (registry.GLOBAL_STATE === 'active' && registry.GLOBAL_ALWAYS_ON === 'true') {
      active.push({ file: 'global', layer: 'L1' });
    }
    if (registry.CONTEXT_STATE === 'active' && registry.CONTEXT_ALWAYS_ON === 'true') {
      active.push({ file: 'context', layer: 'L1' });
    }

    // L7: Commands (always)
    if (registry.COMMANDS_STATE === 'active') {
      active.push({ file: 'commands', layer: 'L7' });
    }

    // L2: Agent-scoped (scan for *_AGENT_TRIGGER=agentId)
    if (agentId) {
      for (const [key, value] of Object.entries(registry)) {
        if (!key.endsWith('_AGENT_TRIGGER') || value !== agentId) continue;
        const prefix = key.slice(0, key.length - '_AGENT_TRIGGER'.length);
        if (registry[`${prefix}_STATE`] !== 'active') continue;
        // Map prefix to filename: AGENT_DATA_ENGINEER → agent-data-engineer
        const filename = prefix.toLowerCase().replace(/_/g, '-');
        active.push({ file: filename, layer: 'L2' });
      }
    }

    // L3: Workflow-scoped (scan for *_WORKFLOW_TRIGGER=workflowPhase)
    if (workflowPhase) {
      for (const [key, value] of Object.entries(registry)) {
        if (!key.endsWith('_WORKFLOW_TRIGGER') || value !== workflowPhase) continue;
        const prefix = key.slice(0, key.length - '_WORKFLOW_TRIGGER'.length);
        if (registry[`${prefix}_STATE`] !== 'active') continue;
        const filename = prefix.toLowerCase().replace(/_/g, '-');
        active.push({ file: filename, layer: 'L3' });
      }
    }

    return active;
  }
}

module.exports = { ManifestParser };
