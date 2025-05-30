export interface VersionConfig {
  currentVersion: string;
  clearAllOnMajorUpdate?: boolean;
  clearSpecificKeys?: string[];
  migrateData?: boolean;
  showUserNotification?: boolean;
}

export class VersionManager {
  private static readonly VERSION_KEY = 'app_version';
  private static readonly LAST_CLEANUP_KEY = 'last_cleanup_date';
  
  // App-specific localStorage keys that should be handled carefully
  private static readonly APP_DATA_KEYS = [
    'dailyCheckInProgress',
    'completedCheckIns', 
    'calmHistory',
    'expenses',
    'visionBoardItems',
    'selfAssessmentResults',
    'quizResults',
    'deepAssessmentResults',
    'dailyCheckInReturnContext'
  ];

  static initializeVersion(config: VersionConfig): void {
    if (typeof window === 'undefined') return;
    
    const storedVersion = localStorage.getItem(this.VERSION_KEY);
    
    if (!storedVersion) {
      // First time user - just set version
      localStorage.setItem(this.VERSION_KEY, config.currentVersion);
      console.log(`Initialized app version: ${config.currentVersion}`);
      return;
    }

    if (storedVersion !== config.currentVersion) {
      console.log(`Version changed from ${storedVersion} to ${config.currentVersion}`);
      
      const shouldClearAll = this.shouldClearAllData(storedVersion, config.currentVersion, config.clearAllOnMajorUpdate);
      
      if (shouldClearAll) {
        this.clearAllData();
        if (config.showUserNotification) {
          this.showMajorUpdateNotification(storedVersion, config.currentVersion);
        }
      } else {
        // For minor updates, clear specific problematic keys
        if (config.clearSpecificKeys) {
          this.clearSpecificKeys(config.clearSpecificKeys);
        }
        
        // Clear keys that are known to cause issues between versions
        this.clearProblematicKeys(storedVersion, config.currentVersion);
      }
      
      if (config.migrateData) {
        this.migrateData(storedVersion, config.currentVersion);
      }
      
      // Update version
      localStorage.setItem(this.VERSION_KEY, config.currentVersion);
      localStorage.setItem(this.LAST_CLEANUP_KEY, new Date().toISOString());
      
      // Notify about the update
      this.showUpdateNotification(storedVersion, config.currentVersion);
    }
  }

  private static shouldClearAllData(oldVersion: string, newVersion: string, clearOnMajor?: boolean): boolean {
    if (!clearOnMajor) return false;
    
    const oldMajor = parseInt(oldVersion.split('.')[0]);
    const newMajor = parseInt(newVersion.split('.')[0]);
    
    return newMajor > oldMajor;
  }

  private static clearAllData(): void {
    const keysToPreserve = [this.VERSION_KEY, this.LAST_CLEANUP_KEY, 'cleanup_history'];
    const allKeys = Object.keys(localStorage);
    let clearedCount = 0;
    
    allKeys.forEach(key => {
      if (!keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    
    console.log(`Major version update: Cleared ${clearedCount} localStorage items`);
  }

  private static clearSpecificKeys(keys: string[]): void {
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

  private static clearProblematicKeys(oldVersion: string, newVersion: string): void {
    const keysToCheck = [];
    
    // Version-specific cleanup rules
    if (this.isVersionLower(oldVersion, '2.1.0')) {
      // Clear daily check-in progress as structure may have changed
      keysToCheck.push('dailyCheckInProgress', 'dailyCheckInReturnContext');
    }
    
    if (this.isVersionLower(oldVersion, '2.0.0')) {
      // Clear old expense format
      keysToCheck.push('expenses');
    }
    
    if (keysToCheck.length > 0) {
      this.clearSpecificKeys(keysToCheck);
      console.log(`Cleared problematic keys for version transition ${oldVersion} -> ${newVersion}`);
    }
  }

  private static migrateData(oldVersion: string, newVersion: string): void {
    console.log(`Starting data migration from ${oldVersion} to ${newVersion}`);
    
    try {
      // Migrate to v2.0.0 - New expense format
      if (this.isVersionLower(oldVersion, '2.0.0')) {
        this.migrateExpensesToV2();
      }
      
      // Migrate to v2.1.0 - New daily check-in format
      if (this.isVersionLower(oldVersion, '2.1.0')) {
        this.migrateDailyCheckInToV2_1();
      }
      
      // Migrate assessment results format
      if (this.isVersionLower(oldVersion, '2.2.0')) {
        this.migrateAssessmentResultsToV2_2();
      }
      
      console.log(`Data migration completed successfully`);
    } catch (error) {
      console.error('Data migration failed:', error);
      // If migration fails, clear the data to prevent issues
      this.clearSpecificKeys(['expenses', 'dailyCheckInProgress', 'selfAssessmentResults']);
    }
  }

  private static migrateExpensesToV2(): void {
    try {
      const oldExpenses = localStorage.getItem('expenses');
      if (oldExpenses) {
        const parsed = JSON.parse(oldExpenses);
        
        // If it's an array, assume it's the new format already
        if (Array.isArray(parsed)) {
          // Ensure all expenses have required fields
          const migratedExpenses = parsed.map((expense: any) => ({
            id: expense.id || Date.now().toString(),
            amount: Number(expense.amount) || 0,
            description: expense.description || 'Unknown',
            category: expense.category || 'unassigned',
            date: expense.date || new Date().toISOString().split('T')[0],
            type: expense.type || 'expense',
            triggeredParts: expense.triggeredParts || []
          }));
          
          localStorage.setItem('expenses', JSON.stringify(migratedExpenses));
          console.log(`Migrated ${migratedExpenses.length} expenses to v2.0 format`);
        }
      }
    } catch (error) {
      console.error('Expense migration failed:', error);
      localStorage.removeItem('expenses');
    }
  }

  private static migrateDailyCheckInToV2_1(): void {
    try {
      const oldProgress = localStorage.getItem('dailyCheckInProgress');
      if (oldProgress) {
        const parsed = JSON.parse(oldProgress);
        
        // Ensure new structure with required fields
        const migratedProgress = {
          currentStep: parsed.currentStep || 1,
          checkInData: {
            selfCompassionScore: parsed.checkInData?.selfCompassionScore || 5,
            expenses: parsed.checkInData?.expenses || [],
            triggeredParts: parsed.checkInData?.triggeredParts || {}
          },
          isScoreSaved: parsed.isScoreSaved || false
        };
        
        localStorage.setItem('dailyCheckInProgress', JSON.stringify(migratedProgress));
        console.log('Migrated daily check-in progress to v2.1 format');
      }
    } catch (error) {
      console.error('Daily check-in migration failed:', error);
      localStorage.removeItem('dailyCheckInProgress');
    }
  }

  private static migrateAssessmentResultsToV2_2(): void {
    try {
      // Migrate quiz results format if needed
      const quizResults = localStorage.getItem('quizResults');
      if (quizResults) {
        const parsed = JSON.parse(quizResults);
        if (!parsed.locale) {
          parsed.locale = 'en'; // Default locale for old results
          localStorage.setItem('quizResults', JSON.stringify(parsed));
          console.log('Added locale to quiz results');
        }
      }

      // Migrate deep assessment results format if needed  
      const deepResults = localStorage.getItem('deepAssessmentResults');
      if (deepResults) {
        const parsed = JSON.parse(deepResults);
        if (!parsed.locale) {
          parsed.locale = 'en'; // Default locale for old results
          localStorage.setItem('deepAssessmentResults', JSON.stringify(parsed));
          console.log('Added locale to deep assessment results');
        }
      }
    } catch (error) {
      console.error('Assessment results migration failed:', error);
      // Don't remove these as they're important user data
    }
  }

  private static isVersionLower(version1: string, version2: string): boolean {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part < v2Part) return true;
      if (v1Part > v2Part) return false;
    }
    
    return false;
  }

  private static showUpdateNotification(oldVersion: string, newVersion: string): void {
    console.log(`✅ App updated from ${oldVersion} to ${newVersion}`);
    
    // Dispatch custom event for UI components to listen to
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('app-updated', {
        detail: { oldVersion, newVersion, timestamp: new Date().toISOString() }
      }));
    }
  }

  private static showMajorUpdateNotification(oldVersion: string, newVersion: string): void {
    console.log(`🚀 Major app update from ${oldVersion} to ${newVersion}. All data has been reset for compatibility.`);
    
    // Dispatch custom event for major updates
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('app-major-update', {
        detail: { oldVersion, newVersion, timestamp: new Date().toISOString() }
      }));
    }
  }

  static getCurrentVersion(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.VERSION_KEY);
  }

  static getLastCleanupDate(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.LAST_CLEANUP_KEY);
  }

  static getVersionInfo(): {
    currentVersion: string | null;
    lastCleanupDate: string | null;
    dataKeys: string[];
    dataSize: number;
  } {
    if (typeof window === 'undefined') {
      return { currentVersion: null, lastCleanupDate: null, dataKeys: [], dataSize: 0 };
    }
    
    const dataKeys = this.APP_DATA_KEYS.filter(key => localStorage.getItem(key) !== null);
    const dataSize = dataKeys.reduce((total, key) => {
      const item = localStorage.getItem(key) || '';
      return total + new Blob([item]).size;
    }, 0);
    
    return {
      currentVersion: this.getCurrentVersion(),
      lastCleanupDate: this.getLastCleanupDate(),
      dataKeys,
      dataSize
    };
  }

  // Force cleanup for emergency situations
  static forceCleanup(): void {
    this.clearAllData();
    localStorage.setItem(this.LAST_CLEANUP_KEY, new Date().toISOString());
    console.log('🧹 Emergency cleanup completed');
  }

  // Check if data exists from older versions
  static hasLegacyData(): boolean {
    if (typeof window === 'undefined') return false;
    
    const currentVersion = this.getCurrentVersion();
    if (!currentVersion) return false;
    
    // Check for data patterns that suggest legacy versions
    const expenses = localStorage.getItem('expenses');
    if (expenses) {
      try {
        const parsed = JSON.parse(expenses);
        // Check if expenses don't have the 'type' field (added in v2.0)
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].type) {
          return true;
        }
      } catch {}
    }
    
    return false;
  }
} 