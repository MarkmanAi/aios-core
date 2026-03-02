// Epic 1 MVP stub — all features enabled. Replace in Epic 2.

/**
 * FeatureGate — Epic 1 stub
 *
 * All features are enabled by default in Epic 1. This stub satisfies all
 * callers without adding any gating logic. Epic 2 replaces this with a real
 * license-aware implementation.
 *
 * Export pattern:
 *   const featureGate = require('../license/feature-gate')          // default
 *   const { featureGate } = require('../license/feature-gate')      // named
 */
const FeatureGate = {
  /**
   * Guard a feature access point.
   * Epic 1: no-op. Contract: void return, NEVER throws.
   * @param {string} featureId - Feature identifier (e.g. 'pro.memory.synapse')
   * @param {string} name - Human-readable feature name
   */
  require: (featureId, name) => {
    // Epic 1: no-op. Epic 2 replaces this with real gate check.
    // Contract: void return, NEVER throws.
  },

  /**
   * Check if a feature is enabled.
   * Epic 1: always returns true.
   * @param {string} featureId - Feature identifier
   * @returns {boolean} true
   */
  isEnabled: (featureId) => true,

  /**
   * Reset internal state. Test cleanup hook.
   * Epic 1: no internal state — no-op.
   */
  reset: () => {},
};

// Export both as default AND as named property.
// synapse-memory-provider.js uses: const { featureGate } = require('../license/feature-gate')
// Other callers may use:           const featureGate = require('../license/feature-gate')
module.exports = FeatureGate;
module.exports.featureGate = FeatureGate;
