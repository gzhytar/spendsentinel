'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConsentState, ConsentContextType } from '@/types/consent';
import { ConsentManager } from '@/lib/consent-manager';
import { useAnalyticsContext } from '@/contexts/analytics-context';

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consentState, setConsentState] = useState<ConsentState>(ConsentManager.getDefaultState());
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { trackEvent } = useAnalyticsContext();

  // Load consent state on mount
  useEffect(() => {
    const loadedState = ConsentManager.loadConsentState();
    setConsentState(loadedState);
    setShowBanner(ConsentManager.shouldShowBanner(loadedState));
  }, []);

  const updateConsentState = (newDecisions: Record<string, boolean>, method: 'banner' | 'settings' | 'refresh') => {
    const validatedDecisions = ConsentManager.validateDecisions(newDecisions);
    const consentRecord = ConsentManager.createConsentRecord(validatedDecisions, method);
    
    const newState: ConsentState = {
      hasUserInteracted: true,
      lastConsentDate: new Date().toISOString(),
      currentDecisions: validatedDecisions,
      consentRecord,
      needsRefresh: false,
      bannerDismissed: true
    };

    // Record consent history for GDPR compliance
    ConsentManager.recordConsent(consentRecord);
    ConsentManager.saveConsentState(newState);
    
    setConsentState(newState);
    setShowBanner(false);
    setShowSettings(false);

    // Track consent decision for analytics (if analytics consent given)
    if (validatedDecisions.analytics && method !== 'refresh') {
      trackEvent('consent_decision', {
        event_category: 'Privacy',
        method,
        analytics_consent: validatedDecisions.analytics,
        preferences_consent: validatedDecisions.preferences,
        essential_consent: validatedDecisions.essential,
        timestamp: new Date().toISOString()
      });
    }
  };

  const acceptAll = () => {
    const decisions = ConsentManager.acceptAll();
    updateConsentState(decisions, 'banner');
  };

  const rejectAll = () => {
    const decisions = ConsentManager.rejectAllNonEssential();
    updateConsentState(decisions, 'banner');
  };

  const updateConsent = (decisions: Record<string, boolean>) => {
    updateConsentState(decisions, 'settings');
  };

  const openSettings = () => {
    setShowSettings(true);
    
    // Track settings open (only if analytics consent already given)
    if (hasConsent('analytics')) {
      trackEvent('consent_settings_open', {
        event_category: 'Privacy',
        source: 'user_initiated'
      });
    }
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const withdrawConsent = () => {
    // Track withdrawal before actually withdrawing consent
    if (hasConsent('analytics')) {
      trackEvent('consent_withdrawn', {
        event_category: 'Privacy',
        previous_analytics_consent: consentState.currentDecisions.analytics,
        previous_preferences_consent: consentState.currentDecisions.preferences
      });
    }

    const decisions = ConsentManager.rejectAllNonEssential();
    updateConsentState(decisions, 'settings');
  };

  const hasConsent = (purposeId: string): boolean => {
    return ConsentManager.hasValidConsent(consentState, purposeId);
  };

  const isEssential = (purposeId: string): boolean => {
    return ConsentManager.isEssential(purposeId);
  };

  const contextValue: ConsentContextType = {
    consentState,
    purposes: ConsentManager.PURPOSES,
    showBanner,
    showSettings,
    acceptAll,
    rejectAll,
    updateConsent,
    openSettings,
    closeSettings,
    withdrawConsent,
    hasConsent,
    isEssential
  };

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
} 