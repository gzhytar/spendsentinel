import { ConsentPurpose, ConsentRecord, ConsentState, ConsentDecision } from '@/types/consent';

export class ConsentManager {
  private static readonly CONSENT_KEY = 'cookie_consent_v1';
  private static readonly CONSENT_HISTORY_KEY = 'consent_history_v1';
  private static readonly CONSENT_VERSION = '1.0.0';
  private static readonly REFRESH_INTERVAL_MONTHS = 6;

  // GDPR-compliant cookie purposes for SpendSentinel (using translation keys)
  static readonly PURPOSES: ConsentPurpose[] = [
    {
      id: 'essential',
      name: 'consent.widget.essential',
      description: 'cookie.category.essentialDesc',
      required: true,
      category: 'essential'
    },
    {
      id: 'analytics',
      name: 'consent.widget.analytics',
      description: 'cookie.category.analyticsDesc',
      required: false,
      category: 'analytics'
    },
    {
      id: 'preferences',
      name: 'consent.widget.preferences',
      description: 'cookie.category.preferencesDesc',
      required: false,
      category: 'preferences'
    }
  ];

  static getDefaultState(): ConsentState {
    return {
      hasUserInteracted: false,
      lastConsentDate: null,
      currentDecisions: {},
      consentRecord: null,
      needsRefresh: false,
      bannerDismissed: false
    };
  }

  static loadConsentState(): ConsentState {
    if (typeof window === 'undefined') {
      return this.getDefaultState();
    }

    try {
      const stored = localStorage.getItem(this.CONSENT_KEY);
      if (!stored) {
        return this.getDefaultState();
      }

      const state: ConsentState = JSON.parse(stored);
      
      // Check if consent needs refresh
      if (state.lastConsentDate) {
        const lastConsent = new Date(state.lastConsentDate);
        const refreshDate = new Date(lastConsent);
        refreshDate.setMonth(refreshDate.getMonth() + this.REFRESH_INTERVAL_MONTHS);
        
        if (new Date() > refreshDate) {
          state.needsRefresh = true;
          state.bannerDismissed = false;
        }
      }

      return state;
    } catch (error) {
      console.warn('Failed to load consent state:', error);
      return this.getDefaultState();
    }
  }

  static saveConsentState(state: ConsentState): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.CONSENT_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save consent state:', error);
    }
  }

  static createConsentRecord(
    decisions: Record<string, boolean>,
    method: 'banner' | 'settings' | 'refresh'
  ): ConsentRecord {
    const timestamp = new Date().toISOString();
    
    const consentDecisions: ConsentDecision[] = Object.entries(decisions).map(([purposeId, granted]) => ({
      purposeId,
      granted,
      timestamp
    }));

    return {
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      decisions: consentDecisions,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      version: this.CONSENT_VERSION,
      method
    };
  }

  static recordConsent(record: ConsentRecord): void {
    if (typeof window === 'undefined') return;

    try {
      const historyKey = this.CONSENT_HISTORY_KEY;
      const existing = localStorage.getItem(historyKey);
      const history: ConsentRecord[] = existing ? JSON.parse(existing) : [];
      
      history.push(record);
      
      // Keep only last 10 records to avoid storage bloat
      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }
      
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to record consent history:', error);
    }
  }

  static getConsentHistory(): ConsentRecord[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.CONSENT_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load consent history:', error);
      return [];
    }
  }

  static acceptAll(): Record<string, boolean> {
    const decisions: Record<string, boolean> = {};
    this.PURPOSES.forEach(purpose => {
      decisions[purpose.id] = true;
    });
    return decisions;
  }

  static rejectAllNonEssential(): Record<string, boolean> {
    const decisions: Record<string, boolean> = {};
    this.PURPOSES.forEach(purpose => {
      decisions[purpose.id] = purpose.required;
    });
    return decisions;
  }

  static hasValidConsent(state: ConsentState, purposeId: string): boolean {
    if (!state.hasUserInteracted || state.needsRefresh) {
      return false;
    }

    const purpose = this.PURPOSES.find(p => p.id === purposeId);
    if (!purpose) {
      return false;
    }

    // Essential purposes are always granted
    if (purpose.required) {
      return true;
    }

    // Check explicit consent for non-essential purposes
    return state.currentDecisions[purposeId] === true;
  }

  static isEssential(purposeId: string): boolean {
    const purpose = this.PURPOSES.find(p => p.id === purposeId);
    return purpose?.required || false;
  }

  static shouldShowBanner(state: ConsentState): boolean {
    return !state.hasUserInteracted || state.needsRefresh || !state.bannerDismissed;
  }

  static validateDecisions(decisions: Record<string, boolean>): Record<string, boolean> {
    const validated: Record<string, boolean> = {};
    
    this.PURPOSES.forEach(purpose => {
      // Essential purposes are always true
      if (purpose.required) {
        validated[purpose.id] = true;
      } else {
        // Non-essential purposes respect user choice
        validated[purpose.id] = decisions[purpose.id] || false;
      }
    });

    return validated;
  }

  static clearAllConsent(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.CONSENT_KEY);
      localStorage.removeItem(this.CONSENT_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear consent data:', error);
    }
  }
} 