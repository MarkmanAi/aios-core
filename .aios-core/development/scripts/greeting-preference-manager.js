/**
 * Greeting Preference Configuration Manager
 *
 * Manages user preferences for agent greeting personification levels.
 * Integrates with GreetingBuilder (Story 6.1.2.5).
 *
 * Performance: Preference check <5ms (called on every agent activation)
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CONFIG_PATH = path.join(process.cwd(), '.aios-core', 'core-config.yaml');
const BACKUP_PATH = path.join(process.cwd(), '.aios-core', 'core-config.yaml.backup');
const VALID_PREFERENCES = ['auto', 'minimal', 'named', 'archetypal'];

class GreetingPreferenceManager {
  /**
   * @param {Object} [options]
   * @param {string} [options.configPath] - Override config file path (useful for tests)
   * @param {string} [options.backupPath] - Override backup file path (useful for tests)
   */
  constructor(options = {}) {
    this._configPath = options.configPath || CONFIG_PATH;
    this._backupPath = options.backupPath || BACKUP_PATH;
  }

  /**
   * Get current greeting preference, accounting for user_profile overrides
   * @param {string|null} userProfile - User profile ('bob'|'advanced'|null to read from config)
   * @returns {string} Current preference (auto|minimal|named|archetypal)
   */
  getPreference(userProfile = null) {
    try {
      const config = this._loadConfig();
      const preference = config?.agentIdentity?.greeting?.preference || 'auto';

      // Determine effective user_profile (param takes precedence over config)
      const effectiveProfile = userProfile || config?.user_profile || null;

      // Bob mode: cap rich preferences to 'named' (bob users see less verbose greetings)
      if (effectiveProfile === 'bob') {
        const bobAllowed = ['minimal', 'named'];
        return bobAllowed.includes(preference) ? preference : 'named';
      }

      return preference;
    } catch (error) {
      console.warn('[GreetingPreference] Failed to load, using default:', error.message);
      return 'auto';
    }
  }

  /**
   * Set greeting preference
   * @param {string} preference - New preference (auto|minimal|named|archetypal)
   * @throws {Error} If preference is invalid
   */
  setPreference(preference) {
    // Validate preference
    if (!VALID_PREFERENCES.includes(preference)) {
      const validOptions = VALID_PREFERENCES.join(', ');
      throw new Error(
        `Invalid preference: "${preference}". ` +
        `Valid options: ${validOptions}. ` +
        'Examples: "auto" (session-aware), "minimal" (always minimal), "named" (always named), "archetypal" (always archetypal)',
      );
    }

    try {
      // Backup existing config before modification
      this._backupConfig();

      const config = this._loadConfig();

      // Ensure structure exists
      if (!config.agentIdentity) config.agentIdentity = {};
      if (!config.agentIdentity.greeting) config.agentIdentity.greeting = {};

      // Set preference
      config.agentIdentity.greeting.preference = preference;

      // Validate YAML before write
      const yamlContent = yaml.dump(config, { lineWidth: -1 });
      try {
        yaml.load(yamlContent); // Validate syntax
      } catch (yamlError) {
        this._restoreBackup();
        throw new Error(`Invalid YAML generated: ${yamlError.message}`);
      }

      // Write back
      this._saveConfig(config);

      return { success: true, preference };
    } catch (error) {
      // Restore backup on error
      this._restoreBackup();
      throw new Error(`Failed to set preference: ${error.message}`);
    }
  }

  /**
   * Get all greeting configuration
   * @returns {Object} Complete greeting config
   */
  getConfig() {
    try {
      const config = this._loadConfig();
      return config?.agentIdentity?.greeting || {};
    } catch (error) {
      console.warn('[GreetingPreference] Failed to load config, returning empty:', error.message);
      return {};
    }
  }

  /**
   * Backup config file before modification
   * @private
   */
  _backupConfig() {
    try {
      if (fs.existsSync(this._configPath)) {
        fs.copyFileSync(this._configPath, this._backupPath);
      }
    } catch (error) {
      console.warn('[GreetingPreference] Failed to backup config:', error.message);
    }
  }

  /**
   * Restore config from backup
   * @private
   */
  _restoreBackup() {
    try {
      if (fs.existsSync(this._backupPath)) {
        fs.copyFileSync(this._backupPath, this._configPath);
        console.log('[GreetingPreference] Config restored from backup');
      }
    } catch (error) {
      console.error('[GreetingPreference] Failed to restore backup:', error.message);
    }
  }

  /**
   * Load config from YAML
   * @private
   */
  _loadConfig() {
    const content = fs.readFileSync(this._configPath, 'utf8');
    return yaml.load(content);
  }

  /**
   * Save config to YAML
   * @private
   */
  _saveConfig(config) {
    const content = yaml.dump(config, { lineWidth: -1 });
    fs.writeFileSync(this._configPath, content, 'utf8');
  }
}

module.exports = GreetingPreferenceManager;

