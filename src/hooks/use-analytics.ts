import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/app/firebase';
import { logEvent } from 'firebase/analytics';

export function useAnalytics() {
  const pathname = usePathname();
  const previousPath = useRef<string>('');

  // Track page views
  useEffect(() => {
    // Only track if path actually changed and analytics is available
    if (analytics && pathname !== previousPath.current) {
      // Small delay to ensure analytics is fully initialized
      setTimeout(() => {
        if (analytics) {
          logEvent(analytics, 'page_view', {
            page_location: window.location.href,
            page_path: pathname,
            page_title: document.title,
            previous_page: previousPath.current || undefined,
          });
        }
      }, 100);
      
      previousPath.current = pathname;
    }
  }, [pathname]);

  // Function to track custom events
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics, eventName, parameters);
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', eventName, parameters);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Analytics not available, would track event:', eventName, parameters);
    }
  };

  // Function to track user interactions
  const trackUserInteraction = (action: string, category: string, label?: string, value?: number) => {
    const eventData = {
      action,
      category,
      label,
      value,
    };
    
    if (analytics) {
      logEvent(analytics, 'user_interaction', eventData);
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics User Interaction:', eventData);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Analytics not available, would track interaction:', eventData);
    }
  };

  // Function to track feature usage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trackFeatureUsage = (featureName: string, details?: Record<string, any>) => {
    const eventData = {
      feature_name: featureName,
      ...details,
    };
    
    if (analytics) {
      logEvent(analytics, 'feature_usage', eventData);
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Feature Usage:', eventData);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Analytics not available, would track feature usage:', eventData);
    }
  };

  return {
    trackEvent,
    trackUserInteraction,
    trackFeatureUsage,
  };
} 