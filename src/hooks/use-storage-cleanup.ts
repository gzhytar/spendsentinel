import { useEffect, useCallback } from 'react';
import { CleanupManager } from '@/lib/cleanup-manager';
import { VersionManager } from '@/lib/version-manager';

interface UseStorageCleanupOptions {
  strategy: 'version' | 'date' | 'corruption' | 'manual';
  currentVersion?: string;
  dateThreshold?: string;
  autoRepair?: boolean;
  onCleanup?: (info: { strategy: string; clearedItems: number }) => void;
}

export function useStorageCleanup(options: UseStorageCleanupOptions) {
  const {
    strategy,
    currentVersion,
    dateThreshold,
    autoRepair = true,
    onCleanup
  } = options;

  const executeCleanup = useCallback(() => {
    const beforeInfo = CleanupManager.getStorageInfo();

    switch (strategy) {
      case 'version':
        if (currentVersion) {
          VersionManager.initializeVersion({
            currentVersion,
            clearAllOnMajorUpdate: true,
            clearSpecificKeys: ['dailyCheckInProgress', 'completedCheckIns', 'firefighterQuizResults', 'expenses', 'completedPartsJournalSessions', 'calmHistory'],
            migrateData: true
          });
        }
        break;

      case 'date':
        if (dateThreshold) {
          CleanupManager.cleanup({ dateThreshold });
        }
        break;

      case 'corruption':
        if (CleanupManager.isCleanupNeeded()) {
          CleanupManager.repairCorrupted();
        }
        break;

      case 'manual':
        // Manual cleanup - do nothing automatically
        break;
    }

    const afterInfo = CleanupManager.getStorageInfo();
    const clearedItems = beforeInfo.totalKeys - afterInfo.totalKeys;

    if (clearedItems > 0 && onCleanup) {
      onCleanup({ strategy, clearedItems });
    }
  }, [strategy, currentVersion, dateThreshold, onCleanup]);

  const forceCleanup = useCallback(() => {
    CleanupManager.cleanup({ forceCleanup: true });
  }, []);

  const repairCorrupted = useCallback(() => {
    CleanupManager.repairCorrupted();
  }, []);

  const getStorageInfo = useCallback(() => {
    return CleanupManager.getStorageInfo();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Auto-repair corrupted data on mount
    if (autoRepair) {
      CleanupManager.repairCorrupted();
    }

    // Execute cleanup strategy
    executeCleanup();
  }, [executeCleanup, autoRepair]);

  return {
    forceCleanup,
    repairCorrupted,
    getStorageInfo,
    executeCleanup,
    cleanupHistory: CleanupManager.getCleanupHistory()
  };
} 