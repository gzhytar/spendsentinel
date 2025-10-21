import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@vercel/analytics';

// Types for better type safety
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnalyticsParameters = Record<string, any>;

interface TrackingResult {
  success: boolean;
  queued: boolean;
}

// Environment configuration
const getEnvironmentConfig = () => {
  if (typeof window === 'undefined') {
    return {
      environment: 'server',
      traffic_type: 'server',
      shouldTrack: false
    };
  }

  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Check for specific testing environment
  if (hostname === 'localhost' && port === '9002') {
    return {
      environment: 'testing',
      traffic_type: 'testing',
      shouldTrack: false // Don't track localhost:9002
    };
  }
  
  // Check for other local development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('local')) {
    return {
      environment: 'staging',
      traffic_type: 'staging',
      shouldTrack: true // Track other local environments for testing
    };
  }
  
  // Production environment
  return {
    environment: 'production',
    traffic_type: 'production',
    shouldTrack: true
  };
};

// Export environment config for use in analytics
export const environmentConfig = getEnvironmentConfig();

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
  const [isReady, setIsReady] = useState<boolean>(false);

  // Initialize analytics
  useEffect(() => {
    // Vercel Analytics is ready immediately
    setIsReady(true);
    logAnalyticsStatus();
  }, []);

  // Track page views
  useEffect(() => {
    if (shouldTrackPageView(pathname, previousPath.current)) {
      setTimeout(() => {
        trackPageView(pathname, previousPath.current);
      }, 100);
      
      previousPath.current = pathname;
    }
  }, [pathname]);

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

    try {
      // Merge default parameters with custom parameters
      const eventParameters = {
        ...getDefaultEventParameters(),
        ...parameters,
      };
      
      // Use Vercel Analytics track function
      track(eventName, eventParameters);
      console.log(`✅ Analytics ${eventType} Sent:`, eventName, eventParameters);
      return { success: true, queued: false };
    } catch (error) {
      console.warn(`⚠️ Analytics tracking failed for ${eventType}:`, eventName, parameters, error);
      return { success: false, queued: true };
    }
  }, []);

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
    isReady,
    environment: environmentConfig.environment,
    shouldTrack: environmentConfig.shouldTrack,
  }), [trackEvent, trackUserInteraction, trackFeatureUsage, isReady]);
}

// Helper functions
function logAnalyticsStatus(): void {
  console.log('Vercel Analytics ready for tracking');
  console.log('Environment:', environmentConfig.environment);
  console.log('Traffic type:', environmentConfig.traffic_type);
}

function shouldTrackPageView(
  currentPath: string, 
  previousPath: string
): boolean {
  return !!(currentPath !== previousPath && environmentConfig.shouldTrack);
}

function trackPageView(pathname: string, previousPath: string): void {
  if (!environmentConfig.shouldTrack) return;
  
  const pageViewParameters: Record<string, any> = {
    ...getDefaultEventParameters(),
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_path: pathname,
    page_title: typeof document !== 'undefined' ? document.title : '',
  };
  
  // Only add previous_page if it exists
  if (previousPath) {
    pageViewParameters.previous_page = previousPath;
  }
  
  track('page_view', pageViewParameters);
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