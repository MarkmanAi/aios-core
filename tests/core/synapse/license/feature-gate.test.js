'use strict';

/**
 * Tests for SYNAPSE FeatureGate — Epic 1 stub
 *
 * Verifies interface contract:
 *  - require()      does not throw for any featureId (void, NEVER throws)
 *  - isEnabled()    returns true for any featureId (Epic 1: all enabled)
 *  - reset()        is callable without error (test cleanup hook)
 *  - module shape   { require, isEnabled, reset }
 *  - dual-export    default + named featureGate property
 *
 * NOTE: tests/license/feature-gate.test.js is occupied by the PRO license
 * system (pro/license/feature-gate.js). This file tests the SYNAPSE-specific
 * stub at .aios-core/core/synapse/license/feature-gate.js.
 *
 * Story: 10.1 — SYNAPSE Blocker Resolution
 * AC: 3, 4
 */

const FeatureGate = require('../../../../.aios-core/core/synapse/license/feature-gate');

describe('SYNAPSE FeatureGate (Epic 1 stub)', () => {
  afterEach(() => {
    FeatureGate.reset();
  });

  describe('require()', () => {
    it('should not throw for a known featureId', () => {
      expect(() => FeatureGate.require('pro.memory.synapse', 'SYNAPSE Memory')).not.toThrow();
    });

    it('should not throw for an arbitrary featureId', () => {
      expect(() => FeatureGate.require('any.unknown.feature', 'Unknown Feature')).not.toThrow();
    });

    it('should not throw for empty featureId and name', () => {
      expect(() => FeatureGate.require('', '')).not.toThrow();
    });

    it('should return void (undefined)', () => {
      const result = FeatureGate.require('pro.memory.synapse', 'SYNAPSE Memory');
      expect(result).toBeUndefined();
    });
  });

  describe('isEnabled()', () => {
    it('should return true for a known featureId', () => {
      expect(FeatureGate.isEnabled('pro.memory.synapse')).toBe(true);
    });

    it('should return true for any featureId', () => {
      expect(FeatureGate.isEnabled('any.feature.id')).toBe(true);
    });

    it('should return true for empty featureId', () => {
      expect(FeatureGate.isEnabled('')).toBe(true);
    });
  });

  describe('reset()', () => {
    it('should complete without error', () => {
      expect(() => FeatureGate.reset()).not.toThrow();
    });

    it('should be callable multiple times without error', () => {
      expect(() => {
        FeatureGate.reset();
        FeatureGate.reset();
        FeatureGate.reset();
      }).not.toThrow();
    });
  });

  describe('module shape', () => {
    it('should export an object with require, isEnabled, reset', () => {
      expect(typeof FeatureGate.require).toBe('function');
      expect(typeof FeatureGate.isEnabled).toBe('function');
      expect(typeof FeatureGate.reset).toBe('function');
    });
  });

  describe('dual-export pattern', () => {
    it('should expose named featureGate property', () => {
      const { featureGate } = require('../../../../.aios-core/core/synapse/license/feature-gate');
      expect(featureGate).toBe(FeatureGate);
    });

    it('named featureGate should satisfy the same interface', () => {
      const { featureGate } = require('../../../../.aios-core/core/synapse/license/feature-gate');
      expect(typeof featureGate.require).toBe('function');
      expect(typeof featureGate.isEnabled).toBe('function');
      expect(typeof featureGate.reset).toBe('function');
    });

    it('named featureGate.isEnabled() should return true', () => {
      const { featureGate } = require('../../../../.aios-core/core/synapse/license/feature-gate');
      expect(featureGate.isEnabled('pro.memory.synapse')).toBe(true);
    });
  });
});
