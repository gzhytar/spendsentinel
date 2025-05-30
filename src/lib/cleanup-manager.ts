export interface CleanupOptions {
  forceCleanup?: boolean;
  specificKeys?: string[];
  dateThreshold?: string; // ISO date string
  preserveKeys?: string[];
}

export class CleanupManager {
  private static readonly CLEANUP_HISTORY_KEY = 'cleanup_history';

  /**
   * Cleanup based on environment variables
   */
  static cleanupFromEnv(): void {
    const forceCleanup = process.env.NEXT_PUBLIC_FORCE_CLEANUP === 'true';
    const cleanupKeys = process.env.NEXT_PUBLIC_CLEANUP_KEYS?.split(',') || [];
    
    if (forceCleanup) {
      this.forceCleanAll();
    } else if (cleanupKeys.length > 0) {
      this.cleanupSpecific(cleanupKeys);
    }
  }

  /**
   * Cleanup localStorage with various options
   */
  static cleanup(options: CleanupOptions = {}): void {
    const {
      forceCleanup = false,
      specificKeys = [],
      dateThreshold,
      preserveKeys = ['app_version', 'last_cleanup_date']
    } = options;

    if (forceCleanup) {
      this.clearAllExcept(preserveKeys);
    } else if (specificKeys.length > 0) {
      this.cleanupSpecific(specificKeys);
    } else if (dateThreshold) {
      this.cleanupByDate(dateThreshold);
    }

    this.recordCleanup(options);
  }

  /**
   * Clear all localStorage except specified keys
   */
  private static clearAllExcept(preserveKeys: string[]): void {
    const allKeys = Object.keys(localStorage);
    let clearedCount = 0;

    allKeys.forEach(key => {
      if (!preserveKeys.includes(key)) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });

    console.log(`Cleared ${clearedCount} localStorage items`);
  }

  /**
   * Remove specific keys from localStorage
   */
  private static cleanupSpecific(keys: string[]): void {
    let clearedCount = 0;

    keys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        clearedCount++;
        console.log(`Cleared localStorage key: ${key}`);
      }
    });

    console.log(`Cleared ${clearedCount} specific localStorage items`);
  }

  /**
   * Clean up items older than specified date
   */
  private static cleanupByDate(thresholdDate: string): void {
    const threshold = new Date(thresholdDate);
    const allKeys = Object.keys(localStorage);
    let clearedCount = 0;

    allKeys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          
          // Check if item has a date field
          if (parsed.date || parsed.timestamp) {
            const itemDate = new Date(parsed.date || parsed.timestamp);
            if (itemDate < threshold) {
              localStorage.removeItem(key);
              clearedCount++;
            }
          }
        }
      } catch (error) {
        // Skip items that can't be parsed
      }
    });

    console.log(`Cleared ${clearedCount} items older than ${thresholdDate}`);
  }

  /**
   * Force cleanup of all data
   */
  static forceCleanAll(): void {
    const keyCount = Object.keys(localStorage).length;
    localStorage.clear();
    console.log(`Force cleared all localStorage (${keyCount} items)`);
    
    // Re-add cleanup history
    this.recordCleanup({ forceCleanup: true });
  }

  /**
   * Record cleanup operation
   */
  private static recordCleanup(options: CleanupOptions): void {
    const history = this.getCleanupHistory();
    history.push({
      timestamp: new Date().toISOString(),
      options,
      userAgent: navigator.userAgent
    });

    // Keep only last 10 cleanup records
    const recentHistory = history.slice(-10);
    localStorage.setItem(this.CLEANUP_HISTORY_KEY, JSON.stringify(recentHistory));
  }

  /**
   * Get cleanup history
   */
  static getCleanupHistory(): any[] {
    try {
      const history = localStorage.getItem(this.CLEANUP_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  /**
   * Check if cleanup is needed based on app state
   */
  static isCleanupNeeded(): boolean {
    // Check for corrupted data
    const criticalKeys = [
      'dailyCheckInProgress',
      'completedCheckIns',
      'calmHistory',
      'expenses'
    ];

    return criticalKeys.some(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          JSON.parse(item); // This will throw if corrupted
        }
        return false;
      } catch {
        console.warn(`Corrupted localStorage detected for key: ${key}`);
        return true;
      }
    });
  }

  /**
   * Repair corrupted localStorage entries
   */
  static repairCorrupted(): void {
    const allKeys = Object.keys(localStorage);
    let repairedCount = 0;

    allKeys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          JSON.parse(item);
        }
      } catch {
        localStorage.removeItem(key);
        repairedCount++;
        console.log(`Removed corrupted localStorage key: ${key}`);
      }
    });

    if (repairedCount > 0) {
      console.log(`Repaired ${repairedCount} corrupted localStorage items`);
      this.recordCleanup({ forceCleanup: false, specificKeys: [`${repairedCount} corrupted items`] });
    }
  }

  /**
   * Get localStorage usage info
   */
  static getStorageInfo(): {
    totalKeys: number;
    totalSize: number;
    keyDetails: Array<{ key: string; size: number }>;
  } {
    const allKeys = Object.keys(localStorage);
    let totalSize = 0;
    const keyDetails: Array<{ key: string; size: number }> = [];

    allKeys.forEach(key => {
      const item = localStorage.getItem(key) || '';
      const size = new Blob([item]).size;
      totalSize += size;
      keyDetails.push({ key, size });
    });

    return {
      totalKeys: allKeys.length,
      totalSize,
      keyDetails: keyDetails.sort((a, b) => b.size - a.size)
    };
  }
} 