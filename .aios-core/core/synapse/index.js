'use strict';

/**
 * @module core/synapse
 * @description Public API for the SYNAPSE context injection engine.
 * Stable surface consumed by Epic 11+ stories.
 */

module.exports = {
  ManifestParser: require('./manifest-parser').ManifestParser,
  DomainInjector: require('./domain-injector').DomainInjector,
  SynapseMemoryProvider: require('./memory/synapse-memory-provider').SynapseMemoryProvider,
  createMemoryLoader: require('./memory/memory-loader').createMemoryLoader,
  createSelfLearner: require('./memory/self-learner').createSelfLearner,
};
