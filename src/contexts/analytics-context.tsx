"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { ConsentManager } from '@/lib/consent-manager';

interface AnalyticsContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  trackUserInteraction: (action: string, category: string, label?: string, value?: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackFeatureUsage: (featureName: string, details?: Record<string, any>) => void;
  isReady: boolean;
  environment: string;
  shouldTrack: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const analytics = useAnalytics();

  // Create consent-aware analytics wrapper
  const consentAwareAnalytics: AnalyticsContextType = {
    trackEvent: (eventName: string, parameters?: Record<string, any>) => {
      const consentState = ConsentManager.loadConsentState();
      if (ConsentManager.hasValidConsent(consentState, 'analytics')) {
        analytics.trackEvent(eventName, parameters);
      } else {
        // Log that tracking was blocked for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Analytics tracking blocked - no consent:', eventName, parameters);
        }
      }
    },
    trackUserInteraction: (action: string, category: string, label?: string, value?: number) => {
      const consentState = ConsentManager.loadConsentState();
      if (ConsentManager.hasValidConsent(consentState, 'analytics')) {
        analytics.trackUserInteraction(action, category, label, value);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('Analytics interaction blocked - no consent:', { action, category, label, value });
        }
      }
    },
    trackFeatureUsage: (featureName: string, details?: Record<string, any>) => {
      const consentState = ConsentManager.loadConsentState();
      if (ConsentManager.hasValidConsent(consentState, 'analytics')) {
        analytics.trackFeatureUsage(featureName, details);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('Analytics feature tracking blocked - no consent:', featureName, details);
        }
      }
    },
    isReady: analytics.isReady,
    environment: analytics.environment,
    shouldTrack: analytics.shouldTrack && ConsentManager.hasValidConsent(ConsentManager.loadConsentState(), 'analytics')
  };

  return (
    <AnalyticsContext.Provider value={consentAwareAnalytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
} 