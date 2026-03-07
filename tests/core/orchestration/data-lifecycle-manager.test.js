/**
 * Data Lifecycle Manager Tests
 * Story 13.2: Data Lifecycle Manager
 */

const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const yaml = require('js-yaml');

const {
  DataLifecycleManager,
  createDataLifecycleManager,
  runStartupCleanup,
  STALE_SESSION_DAYS,
  STALE_SNAPSHOT_DAYS,
} = require('../../../.aios-core/core/orchestration/data-lifecycle-manager');

// Test fixtures
const TEST_PROJECT_ROOT = path.join(__dirname, '../../fixtures/test-project-lifecycle');

// Mock LockManager
jest.mock('../../../.aios-core/core/orchestration/lock-manager', () => {
  const mockCleanupStaleLocks = jest.fn().mockResolvedValue(2);
  return jest.fn().mockImplementation(() => ({
    cleanupStaleLocks: mockCleanupStaleLocks,
    acquireLock: jest.fn().mockResolvedValue(true),
    releaseLock: jest.fn().mockResolvedValue(true),
  }));
});

describe('DataLifecycleManager', () => {
  let manager;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Clean up test directory
    try {
      await fs.rm(TEST_PROJECT_ROOT, { recursive: true, force: true });
    } catch {
      // Ignore
    }

    // Create base directories
    await fs.mkdir(path.join(TEST_PROJECT_ROOT, 'docs/stories'), { recursive: true });
    await fs.mkdir(path.join(TEST_PROJECT_ROOT, '.aios/locks'), { recursive: true });
    await fs.mkdir(path.join(TEST_PROJECT_ROOT, '.aios/snapshots'), { recursive: true });

    manager = new DataLifecycleManager(TEST_PROJECT_ROOT);
  });

  afterEach(async () => {
    try {
      await fs.rm(TEST_PROJECT_ROOT, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  // ==========================================
  // Constructor tests
  // ==========================================

  describe('constructor', () => {
    it('should create DataLifecycleManager with projectRoot', () => {
      expect(manager).toBeDefined();
      expect(manager.projectRoot).toBe(TEST_PROJECT_ROOT);
    });

    it('should throw if projectRoot is missing', () => {
      expect(() => new DataLifecycleManager()).toThrow('projectRoot is required');
      expect(() => new DataLifecycleManager('')).toThrow('projectRoot is required');
      expect(() => new DataLifecycleManager(123)).toThrow('projectRoot is required');
    });

    it('should use default options', () => {
      expect(manager.options.staleSessionDays).toBe(STALE_SESSION_DAYS);
      expect(manager.options.staleSnapshotDays).toBe(STALE_SNAPSHOT_DAYS);
    });

    it('should allow custom options', () => {
      const customManager = new DataLifecycleManager(TEST_PROJECT_ROOT, {
        staleSessionDays: 15,
        staleSnapshotDays: 60,
      });
      expect(customManager.options.staleSessionDays).toBe(15);
      expect(customManager.options.staleSnapshotDays).toBe(60);
    });
  });

  // ==========================================
  // cleanupStaleSessions tests (AC-1)
  // ==========================================

  describe('cleanupStaleSessions', () => {
    it('should return 0 when no session state exists', async () => {
      const result = await manager.cleanupStaleSessions();
      expect(result).toBe(0);
    });

    it('should not archive session if last_updated < 30 days', async () => {
      // Given - session updated 10 days ago
      const sessionPath = path.join(TEST_PROJECT_ROOT, 'docs/stories/.session-state.yaml');
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const sessionState = {
        session_state: {
          version: '1.1',
          last_updated: tenDaysAgo.toISOString(),
          epic: { id: 'test', title: 'Test Epic', total_stories: 1 },
        },
      };
      await fs.writeFile(sessionPath, yaml.dump(sessionState));

      // When
      const result = await manager.cleanupStaleSessions();

      // Then
      expect(result).toBe(0);
      expect(fsSync.existsSync(sessionPath)).toBe(true);
    });

    it('should archive session if last_updated > 30 days (AC-1)', async () => {
      // Given - session updated 45 days ago
      const sessionPath = path.join(TEST_PROJECT_ROOT, 'docs/stories/.session-state.yaml');
      const fortyFiveDaysAgo = new Date();
      fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);

      const sessionState = {
        session_state: {
          version: '1.1',
          last_updated: fortyFiveDaysAgo.toISOString(),
          epic: { id: 'test', title: 'Test Epic', total_stories: 1 },
        },
      };
      await fs.writeFile(sessionPath, yaml.dump(sessionState));

      // When
      const result = await manager.cleanupStaleSessions();

      // Then
      expect(result).toBe(1);
      expect(fsSync.existsSync(sessionPath)).toBe(false);

      // Check archive exists
      const archiveDir = path.join(TEST_PROJECT_ROOT, '.aios/archive/sessions');
      expect(fsSync.existsSync(archiveDir)).toBe(true);

      const archiveFiles = await fs.readdir(archiveDir);
      expect(archiveFiles.length).toBe(1);
      expect(archiveFiles[0]).toMatch(/session-state-\d{4}-\d{2}-\d{2}\.yaml/);
    });

    it('should handle corrupted session state gracefully', async () => {
      // Given - corrupted YAML
      const sessionPath = path.join(TEST_PROJECT_ROOT, 'docs/stories/.session-state.yaml');
      await fs.writeFile(sessionPath, 'invalid yaml %%% not parseable');

      // When/Then - should not throw
      const result = await manager.cleanupStaleSessions();
      expect(result).toBe(0);
    });

    it('should handle missing last_updated field', async () => {
      // Given - session without last_updated
      const sessionPath = path.join(TEST_PROJECT_ROOT, 'docs/stories/.session-state.yaml');
      const sessionState = {
        session_state: {
          version: '1.1',
          epic: { id: 'test', title: 'Test Epic' },
        },
      };
      await fs.writeFile(sessionPath, yaml.dump(sessionState));

      // When
      const result = await manager.cleanupStaleSessions();

      // Then
      expect(result).toBe(0);
    });

    it('should preserve original file when rename fails (AC-1 partial failure, AC-5)', async () => {
      // Given - stale session exists
      const sessionPath = path.join(TEST_PROJECT_ROOT, 'docs/stories/.session-state.yaml');
      const fortyFiveDaysAgo = new Date();
      fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);

      const sessionState = {
        session_state: {
          version: '1.1',
          last_updated: fortyFiveDaysAgo.toISOString(),
          epic: { id: 'test', title: 'Test Epic', total_stories: 1 },
        },
      };
      await fs.writeFile(sessionPath, yaml.dump(sessionState));

      // Mock rename to simulate failure
      const renameSpy = jest.spyOn(fs, 'rename').mockRejectedValue(new Error('ENOENT: rename failed'));

      // When / Then — should throw (rethrows the rename error)
      await expect(manager.cleanupStaleSessions()).rejects.toThrow('ENOENT: rename failed');

      // Original file must still exist (no data loss)
      expect(fsSync.existsSync(sessionPath)).toBe(true);

      renameSpy.mockRestore();
    });
  });

  // ==========================================
  // cleanupStaleSnapshots tests (AC-2)
  // ==========================================

  describe('cleanupStaleSnapshots', () => {
    it('should return 0 when no snapshots directory exists', async () => {
      // Given - remove snapshots dir
      await fs.rm(path.join(TEST_PROJECT_ROOT, '.aios/snapshots'), { recursive: true });

      // When
      const result = await manager.cleanupStaleSnapshots();

      // Then
      expect(result).toBe(0);
    });

    it('should return 0 when snapshots directory is empty', async () => {
      const result = await manager.cleanupStaleSnapshots();
      expect(result).toBe(0);
    });

    it('should not remove snapshot if age < 90 days', async () => {
      // Given - snapshot created 30 days ago
      const snapshotPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/snapshot-recent.json');
      await fs.writeFile(snapshotPath, JSON.stringify({ epic_id: 'test', story_id: '1.0' }));

      // Modify the mtime to 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      await fs.utimes(snapshotPath, thirtyDaysAgo, thirtyDaysAgo);

      // When
      const result = await manager.cleanupStaleSnapshots();

      // Then
      expect(result).toBe(0);
      expect(fsSync.existsSync(snapshotPath)).toBe(true);
    });

    it('should remove snapshot if age > 90 days and update index.json (AC-2)', async () => {
      // Given - snapshot created 100 days ago
      const snapshotPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/snapshot-old.json');
      await fs.writeFile(snapshotPath, JSON.stringify({ epic_id: 'test', story_id: '1.0' }));

      // Modify the mtime to 100 days ago
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);
      await fs.utimes(snapshotPath, hundredDaysAgo, hundredDaysAgo);

      // When
      const result = await manager.cleanupStaleSnapshots();

      // Then
      expect(result).toBe(1);
      expect(fsSync.existsSync(snapshotPath)).toBe(false);

      // Check index.json was updated
      const indexPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/index.json');
      expect(fsSync.existsSync(indexPath)).toBe(true);

      const index = JSON.parse(await fs.readFile(indexPath, 'utf8'));
      expect(index.removed_snapshots).toHaveLength(1);
      expect(index.removed_snapshots[0].filename).toBe('snapshot-old.json');
      expect(index.removed_snapshots[0].epic_id).toBe('test');
    });

    it('should preserve existing index entries when adding new ones (AC-2 atomicity)', async () => {
      // Given - index.json already has one existing entry
      const indexPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/index.json');
      const existingEntry = {
        filename: 'snapshot-previous.json',
        removed_at: '2026-01-01T00:00:00.000Z',
        original_created: '2025-10-01T00:00:00.000Z',
        age_days: 92,
        epic_id: 'prev-epic',
        story_id: '0.1',
      };
      await fs.writeFile(indexPath, JSON.stringify({ removed_snapshots: [existingEntry], last_cleanup: '2026-01-01T00:00:00.000Z' }));

      // And - a new stale snapshot to remove
      const snapshotPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/snapshot-stale.json');
      await fs.writeFile(snapshotPath, JSON.stringify({ epic_id: 'new-epic', story_id: '1.0' }));
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);
      await fs.utimes(snapshotPath, hundredDaysAgo, hundredDaysAgo);

      // When
      const result = await manager.cleanupStaleSnapshots();

      // Then - both entries present in index (read→merge→write)
      expect(result).toBe(1);
      const index = JSON.parse(await fs.readFile(indexPath, 'utf8'));
      expect(index.removed_snapshots).toHaveLength(2);
      expect(index.removed_snapshots[0].filename).toBe('snapshot-previous.json');
      expect(index.removed_snapshots[1].filename).toBe('snapshot-stale.json');
    });

    it('should NOT record snapshot in index if unlink fails (13.2-T1)', async () => {
      // Given - stale snapshot exists
      const snapshotPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/snapshot-fail.json');
      await fs.writeFile(snapshotPath, JSON.stringify({ epic_id: 'test', story_id: '1.0' }));
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);
      await fs.utimes(snapshotPath, hundredDaysAgo, hundredDaysAgo);

      // Mock unlink to fail
      const unlinkSpy = jest.spyOn(fs, 'unlink').mockRejectedValue(new Error('EACCES: permission denied'));

      // When
      const result = await manager.cleanupStaleSnapshots();

      // Then - nothing removed, index NOT created
      expect(result).toBe(0);
      const indexPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/index.json');
      expect(fsSync.existsSync(indexPath)).toBe(false);

      unlinkSpy.mockRestore();
    });

    it('should use atomic write (temp + rename) when updating index (13.2-T2)', async () => {
      // Given - stale snapshot
      const snapshotPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/snapshot-atomic.json');
      await fs.writeFile(snapshotPath, JSON.stringify({ epic_id: 'test', story_id: '1.0' }));
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);
      await fs.utimes(snapshotPath, hundredDaysAgo, hundredDaysAgo);

      // Spy on rename to confirm atomic swap is called
      const renameSpy = jest.spyOn(fs, 'rename');

      // When
      await manager.cleanupStaleSnapshots();

      // Then - rename called with .tmp → index.json
      const indexPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/index.json');
      const tmpPath = indexPath + '.tmp';
      expect(renameSpy).toHaveBeenCalledWith(tmpPath, indexPath);

      renameSpy.mockRestore();
    });

    it('should preserve original index if temp write fails (13.2-T2)', async () => {
      // Given - existing index with a prior entry
      const indexPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/index.json');
      const existing = { removed_snapshots: [{ filename: 'old.json' }], last_cleanup: '2026-01-01T00:00:00.000Z' };
      await fs.writeFile(indexPath, JSON.stringify(existing));

      // And - stale snapshot
      const snapshotPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/snapshot-space.json');
      await fs.writeFile(snapshotPath, JSON.stringify({ epic_id: 'test' }));
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);
      await fs.utimes(snapshotPath, hundredDaysAgo, hundredDaysAgo);

      // Mock writeFile to fail on tmp write
      jest.spyOn(fs, 'writeFile').mockRejectedValueOnce(new Error('ENOSPC: no space left'));

      // When - error propagates out
      await expect(manager.cleanupStaleSnapshots()).rejects.toThrow('ENOSPC');

      // Then - original index is untouched (tmp never renamed over it)
      const content = JSON.parse(await fs.readFile(indexPath, 'utf8'));
      expect(content.removed_snapshots).toHaveLength(1);
      expect(content.removed_snapshots[0].filename).toBe('old.json');
    });

    it('should not remove index.json itself', async () => {
      // Given - index.json in snapshots
      const indexPath = path.join(TEST_PROJECT_ROOT, '.aios/snapshots/index.json');
      await fs.writeFile(indexPath, JSON.stringify({ removed_snapshots: [] }));

      // Modify the mtime to 100 days ago
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);
      await fs.utimes(indexPath, hundredDaysAgo, hundredDaysAgo);

      // When
      const result = await manager.cleanupStaleSnapshots();

      // Then
      expect(result).toBe(0);
      expect(fsSync.existsSync(indexPath)).toBe(true);
    });
  });

  // ==========================================
  // cleanupOrphanLocks tests (AC-3)
  // ==========================================

  describe('cleanupOrphanLocks', () => {
    it('should delegate to LockManager.cleanupStaleLocks (AC-3)', async () => {
      // When
      const result = await manager.cleanupOrphanLocks();

      // Then
      expect(result).toBe(2); // Mock returns 2
      expect(manager.lockManager.cleanupStaleLocks).toHaveBeenCalled();
    });
  });

  // ==========================================
  // runStartupCleanup tests (AC-4)
  // ==========================================

  describe('runStartupCleanup', () => {
    it('should run all three cleanup operations', async () => {
      // Given - spy on methods
      const cleanupSessionsSpy = jest.spyOn(manager, 'cleanupStaleSessions').mockResolvedValue(1);
      const cleanupSnapshotsSpy = jest.spyOn(manager, 'cleanupStaleSnapshots').mockResolvedValue(3);
      const cleanupLocksSpy = jest.spyOn(manager, 'cleanupOrphanLocks').mockResolvedValue(2);

      // When
      const result = await manager.runStartupCleanup();

      // Then
      expect(result.locksRemoved).toBe(2);
      expect(result.sessionsArchived).toBe(1);
      expect(result.snapshotsRemoved).toBe(3);
      expect(result.errors).toHaveLength(0);

      expect(cleanupLocksSpy).toHaveBeenCalled();
      expect(cleanupSessionsSpy).toHaveBeenCalled();
      expect(cleanupSnapshotsSpy).toHaveBeenCalled();
    });

    it('should capture errors without stopping other cleanups', async () => {
      // Given - first cleanup fails
      jest.spyOn(manager, 'cleanupOrphanLocks').mockRejectedValue(new Error('Lock error'));
      jest.spyOn(manager, 'cleanupStaleSessions').mockResolvedValue(1);
      jest.spyOn(manager, 'cleanupStaleSnapshots').mockResolvedValue(2);

      // When
      const result = await manager.runStartupCleanup();

      // Then
      expect(result.locksRemoved).toBe(0);
      expect(result.sessionsArchived).toBe(1);
      expect(result.snapshotsRemoved).toBe(2);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Lock cleanup failed');
    });

    it('should log cleanup summary (AC-4)', async () => {
      // Given
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(manager, 'cleanupOrphanLocks').mockResolvedValue(2);
      jest.spyOn(manager, 'cleanupStaleSessions').mockResolvedValue(1);
      jest.spyOn(manager, 'cleanupStaleSnapshots').mockResolvedValue(0);

      // When
      await manager.runStartupCleanup();

      // Then
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🧹 Cleanup: 2 locks removidos, 1 sessions arquivadas, 0 snapshots removidos'),
      );

      consoleSpy.mockRestore();
    });
  });

  // ==========================================
  // Factory functions
  // ==========================================

  describe('factory functions', () => {
    it('createDataLifecycleManager should create instance', () => {
      const instance = createDataLifecycleManager(TEST_PROJECT_ROOT);
      expect(instance).toBeInstanceOf(DataLifecycleManager);
    });

    it('runStartupCleanup should create instance and run cleanup', async () => {
      // Given - mock the methods
      const mockCleanup = jest.fn().mockResolvedValue({
        locksRemoved: 0,
        sessionsArchived: 0,
        snapshotsRemoved: 0,
        errors: [],
      });

      jest.spyOn(DataLifecycleManager.prototype, 'runStartupCleanup').mockImplementation(mockCleanup);

      // When
      const result = await runStartupCleanup(TEST_PROJECT_ROOT);

      // Then
      expect(result).toBeDefined();
    });
  });

  // ==========================================
  // Constants
  // ==========================================

  describe('constants', () => {
    it('should export correct threshold values', () => {
      expect(STALE_SESSION_DAYS).toBe(30);
      expect(STALE_SNAPSHOT_DAYS).toBe(90);
    });
  });
});
