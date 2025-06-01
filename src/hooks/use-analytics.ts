import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAnalyticsInstance } from '@/app/firebase';
import { logEvent, Analytics } from 'firebase/analytics';

export function useAnalytics() {
  const pathname = usePathname();
  const previousPath = useRef<string>('');
  const [analytics, setAnalytics] = useState<Analytics | undefined>();

  // Initialize analytics
  useEffect(() => {
    getAnalyticsInstance().then((analyticsInstance) => {
      setAnalytics(analyticsInstance);
      if (analyticsInstance) {
        console.log('Analytics ready for tracking');
      } else {
        console.warn('Analytics not available');
      }
    });
  }, []);

  // Track page views
  useEffect(() => {
    if (analytics && pathname !== previousPath.current) {
      setTimeout(() => {
        if (analytics) {
          logEvent(analytics, 'page_view', {
            page_location: window.location.href,
            page_path: pathname,
            page_title: document.title,
            previous_page: previousPath.current || undefined,
          });
          console.log('Page view tracked:', pathname);
        }
      }, 100);
      
      previousPath.current = pathname;
    }
  }, [pathname, analytics]);

  // Function to track custom events
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics, eventName, parameters);
      console.log('✅ Analytics Event Sent:', eventName, parameters);
    } else {
      console.warn('⚠️ Analytics not ready, queuing event:', eventName, parameters);
      // You could implement a queue here if needed
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
      console.log('✅ Analytics User Interaction Sent:', eventData);
    } else {
      console.warn('⚠️ Analytics not ready, would track interaction:', eventData);
    }
  };

  // Function to track feature usage
  const trackFeatureUsage = (featureName: string, details?: Record<string, any>) => {
    const eventData = {
      feature_name: featureName,
      ...details,
    };
    
    if (analytics) {
      logEvent(analytics, 'feature_usage', eventData);
      console.log('✅ Analytics Feature Usage Sent:', eventData);
    } else {
      console.warn('⚠️ Analytics not ready, would track feature usage:', eventData);
    }
  };

  return {
    trackEvent,
    trackUserInteraction,
    trackFeatureUsage,
    isReady: !!analytics,
  };
} 