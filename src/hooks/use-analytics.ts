import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getAnalyticsInstance } from '@/app/firebase';
import { logEvent, Analytics } from 'firebase/analytics';

// Types for better type safety
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnalyticsParameters = Record<string, any>;

interface TrackingResult {
  success: boolean;
  queued: boolean;
}

export function useAnalytics() {
  const pathname = usePathname();
  const previousPath = useRef<string>('');
  const [analytics, setAnalytics] = useState<Analytics | undefined>();

  // Initialize analytics
  useEffect(() => {
    getAnalyticsInstance().then((analyticsInstance) => {
      setAnalytics(analyticsInstance);
      logAnalyticsStatus(analyticsInstance);
    });
  }, []);

  // Track page views
  useEffect(() => {
    if (shouldTrackPageView(pathname, previousPath.current, analytics)) {
      setTimeout(() => {
        trackPageView(analytics!, pathname, previousPath.current);
      }, 100);
      
      previousPath.current = pathname;
    }
  }, [pathname, analytics]);

  // Core tracking function - handles all analytics events (memoized)
  const trackAnalyticsEvent = useCallback((
    eventName: string, 
    parameters?: AnalyticsParameters,
    eventType: string = 'general'
  ): TrackingResult => {
    if (analytics) {
      logEvent(analytics, eventName, parameters);
      console.log(`✅ Analytics ${eventType} Sent:`, eventName, parameters);
      return { success: true, queued: false };
    } else {
      console.warn(`⚠️ Analytics not ready, queuing ${eventType}:`, eventName, parameters);
      return { success: false, queued: true };
    }
  }, [analytics]);

  // Public API functions (memoized)
  const trackEvent = useCallback((eventName: string, parameters?: AnalyticsParameters) => {
    return trackAnalyticsEvent(eventName, parameters, 'Event');
  }, [trackAnalyticsEvent]);

  const trackUserInteraction = useCallback((action: string, category: string, label?: string, value?: number) => {
    const eventData = createInteractionEventData(action, category, label, value);
    return trackAnalyticsEvent('user_interaction', eventData, 'User Interaction');
  }, [trackAnalyticsEvent]);

  const trackFeatureUsage = useCallback((featureName: string, details?: AnalyticsParameters) => {
    const eventData = createFeatureEventData(featureName, details);
    return trackAnalyticsEvent('feature_usage', eventData, 'Feature Usage');
  }, [trackAnalyticsEvent]);

  // Memoize the returned object to prevent unnecessary re-renders
  return useMemo(() => ({
    trackEvent,
    trackUserInteraction,
    trackFeatureUsage,
    isReady: !!analytics,
  }), [trackEvent, trackUserInteraction, trackFeatureUsage, analytics]);
}

// Helper functions
function logAnalyticsStatus(analyticsInstance: Analytics | undefined): void {
  if (analyticsInstance) {
    console.log('Analytics ready for tracking');
  } else {
    console.warn('Analytics not available');
  }
}

function shouldTrackPageView(
  currentPath: string, 
  previousPath: string, 
  analytics: Analytics | undefined
): boolean {
  return !!(analytics && currentPath !== previousPath);
}

function trackPageView(analytics: Analytics, pathname: string, previousPath: string): void {
  if (!analytics) return;
  
  logEvent(analytics, 'page_view', {
    page_location: window.location.href,
    page_path: pathname,
    page_title: document.title,
    previous_page: previousPath || undefined,
  });
  console.log('Page view tracked:', pathname);
}

function createInteractionEventData(
  action: string, 
  category: string, 
  label?: string, 
  value?: number
): AnalyticsParameters {
  return {
    action,
    category,
    label,
    value,
  };
}

function createFeatureEventData(
  featureName: string, 
  details?: AnalyticsParameters
): AnalyticsParameters {
  return {
    feature_name: featureName,
    ...details,
  };
} 