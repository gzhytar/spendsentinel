import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getAnalyticsInstance, environmentConfig } from '@/app/firebase';
import { logEvent, Analytics } from 'firebase/analytics';

// Types for better type safety
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnalyticsParameters = Record<string, any>;

interface TrackingResult {
  success: boolean;
  queued: boolean;
}

// Default parameters that should be included with every event
const getDefaultEventParameters = (): AnalyticsParameters => {
  return {
    traffic_type: environmentConfig.traffic_type,
    environment: environmentConfig.environment,
    // Add timestamp for better event tracking
    event_timestamp: new Date().toISOString(),
  };
};

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
    // Don't track if environment doesn't allow tracking
    if (!environmentConfig.shouldTrack) {
      console.log(`🚫 Analytics tracking disabled for ${environmentConfig.environment} environment:`, eventName, parameters);
      return { success: false, queued: false };
    }

    if (analytics) {
      // Merge default parameters with custom parameters
      const eventParameters = {
        ...getDefaultEventParameters(),
        ...parameters,
      };
      
      logEvent(analytics, eventName, eventParameters);
      console.log(`✅ Analytics ${eventType} Sent:`, eventName, eventParameters);
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
    environment: environmentConfig.environment,
    shouldTrack: environmentConfig.shouldTrack,
  }), [trackEvent, trackUserInteraction, trackFeatureUsage, analytics]);
}

// Helper functions
function logAnalyticsStatus(analyticsInstance: Analytics | undefined): void {
  if (analyticsInstance) {
    console.log('Analytics ready for tracking');
    console.log('Environment:', environmentConfig.environment);
    console.log('Traffic type:', environmentConfig.traffic_type);
  } else {
    console.warn('Analytics not available');
  }
}

function shouldTrackPageView(
  currentPath: string, 
  previousPath: string, 
  analytics: Analytics | undefined
): boolean {
  return !!(analytics && currentPath !== previousPath && environmentConfig.shouldTrack);
}

function trackPageView(analytics: Analytics, pathname: string, previousPath: string): void {
  if (!analytics || !environmentConfig.shouldTrack) return;
  
  const pageViewParameters = {
    ...getDefaultEventParameters(),
    page_location: window.location.href,
    page_path: pathname,
    page_title: document.title,
    previous_page: previousPath || undefined,
  };
  
  logEvent(analytics, 'page_view', pageViewParameters);
  console.log('Page view tracked:', pathname, pageViewParameters);
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