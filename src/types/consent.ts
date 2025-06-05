export interface ConsentPurpose {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'essential' | 'analytics' | 'marketing' | 'preferences';
}

export interface ConsentDecision {
  purposeId: string;
  granted: boolean;
  timestamp: string;
}

export interface ConsentRecord {
  id: string;
  timestamp: string;
  decisions: ConsentDecision[];
  userAgent: string;
  ipHash?: string; // Optional, hashed for privacy
  version: string; // Consent banner version
  method: 'banner' | 'settings' | 'refresh';
}

export interface ConsentState {
  hasUserInteracted: boolean;
  lastConsentDate: string | null;
  currentDecisions: Record<string, boolean>;
  consentRecord: ConsentRecord | null;
  needsRefresh: boolean;
  bannerDismissed: boolean;
}

export interface ConsentContextType {
  consentState: ConsentState;
  purposes: ConsentPurpose[];
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (decisions: Record<string, boolean>) => void;
  openSettings: () => void;
  closeSettings: () => void;
  withdrawConsent: () => void;
  hasConsent: (purposeId: string) => boolean;
  isEssential: (purposeId: string) => boolean;
} 