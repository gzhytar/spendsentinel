import { useMemo } from 'react';
import { useAnalyticsContext } from '@/contexts/analytics-context';
import { trackOnboardingStepIfActive, ONBOARDING_FUNNEL_STEPS } from '@/lib/analytics-utils';

/**
 * Custom hook for simplified onboarding tracking
 * 
 * Automatically handles:
 * - Checking for active onboarding session
 * - Creating event data with proper structure
 * - Sending events via analytics context
 * - Debug logging
 * 
 * @returns trackOnboarding function that takes step name and optional additional data
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const trackOnboarding = useOnboardingTracking();
 *   
 *   const handleQuizComplete = (result: string) => {
 *     trackOnboarding('ASSESSMENT_QUIZ_COMPLETE', {
 *       quiz_result: result,
 *       assessment_type: 'quick_discovery'
 *     });
 *   };
 * }
 * ```
 */
export function useOnboardingTracking() {
  const { trackEvent } = useAnalyticsContext();
  
  // Return a function that takes a step name and optional additional data
  return useMemo(() => {
    return (step: keyof typeof ONBOARDING_FUNNEL_STEPS, additionalData?: Record<string, any>) => {
      return trackOnboardingStepIfActive(step, additionalData, trackEvent);
    };
  }, [trackEvent]);
}

// Export the type for convenience
export type OnboardingStep = keyof typeof ONBOARDING_FUNNEL_STEPS; 