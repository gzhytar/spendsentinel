import { useCallback } from 'react';
import { useOnboardingTracking } from '@/hooks/use-onboarding-tracking';

export function useAssessmentTracking() {
  const trackOnboarding = useOnboardingTracking();

  const trackAssessmentStart = useCallback(() => {
    trackOnboarding('ASSESSMENT_START', {
      source_page: 'self_assessment',
      has_existing_results: false,
    });
  }, [trackOnboarding]);

  const trackQuizComplete = useCallback((result: string) => {
    trackOnboarding('ASSESSMENT_QUIZ_COMPLETE', {
      quiz_result: result,
      assessment_type: 'quick_discovery',
    });
  }, [trackOnboarding]);

  const trackDeepAssessmentComplete = useCallback((partName: string) => {
    trackOnboarding('ASSESSMENT_DEEP_COMPLETE', {
      identified_part: partName,
      assessment_type: 'deep_assessment',
    });
  }, [trackOnboarding]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trackDailyCheckinStart = useCallback((source: string, additionalData: any = {}) => {
    trackOnboarding('DAILY_CHECKIN_START', {
      source_page: source,
      assessment_completed: true,
      ...additionalData,
    });
  }, [trackOnboarding]);

  const trackPartsSessionStart = useCallback(() => {
    trackOnboarding('PARTS_SESSION_START');
  }, [trackOnboarding]);

  return {
    trackAssessmentStart,
    trackQuizComplete,
    trackDeepAssessmentComplete,
    trackDailyCheckinStart,
    trackPartsSessionStart,
  };
} 