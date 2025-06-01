/**
 * Analytics utility functions for common tracking scenarios
 */

// Onboarding session data types
export interface OnboardingSessionData {
  session_id: string | null;
  start_time: string | null;
  current_time: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OnboardingSessionDataEmpty {
  // Empty object for SSR cases
}

export type OnboardingSessionResult = OnboardingSessionData | OnboardingSessionDataEmpty;

// Common event types for consistency
export const ANALYTICS_EVENTS = {
  // Navigation
  PAGE_VIEW: 'page_view',
  NAVIGATION: 'navigation',
  
  // User interactions
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  LINK_CLICK: 'link_click',
  
  // Feature usage
  FEATURE_USED: 'feature_used',
  EXPENSE_ADDED: 'expense_added',
  BUDGET_UPDATED: 'budget_updated',
  ASSESSMENT_COMPLETED: 'assessment_completed',
  DAILY_CHECKIN_COMPLETED: 'daily_checkin_completed',
  PARTS_JOURNAL_SESSION: 'parts_journal_session',
  
  // User engagement
  SESSION_START: 'session_start',
  PANIC_MODE_ACTIVATED: 'panic_mode_activated',
  LANGUAGE_CHANGED: 'language_changed',
} as const;

// Common categories for user interactions
export const ANALYTICS_CATEGORIES = {
  NAVIGATION: 'navigation',
  FORM: 'form',
  BUTTON: 'button',
  FEATURE: 'feature',
  USER_PREFERENCE: 'user_preference',
  EMERGENCY: 'emergency',
} as const;

// Utility functions for structured event tracking
export const createEventData = (
  eventName: string,
  category?: string,
  label?: string,
  value?: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customProperties?: Record<string, any>
) => ({
  event_name: eventName,
  event_category: category,
  event_label: label,
  event_value: value,
  ...customProperties,
});

// Feature-specific tracking helpers
export const trackExpenseAction = (action: 'add' | 'edit' | 'delete', category: string, amount?: number) => ({
  action,
  expense_category: category,
  amount,
  timestamp: new Date().toISOString(),
});

export const trackAssessmentProgress = (step: string, completed: boolean, partType?: string) => ({
  assessment_step: step,
  completed,
  identified_part_type: partType,
  timestamp: new Date().toISOString(),
});

export const trackDailyCheckInProgress = (step: number, totalSteps: number, completed: boolean) => ({
  checkin_step: step,
  total_steps: totalSteps,
  progress_percentage: (step / totalSteps) * 100,
  completed,
  timestamp: new Date().toISOString(),
});

export const trackPartsJournalSession = (partName: string, sessionStep: number, completed: boolean) => ({
  part_name: partName,
  session_step: sessionStep,
  completed,
  timestamp: new Date().toISOString(),
});

// Onboarding Funnel Tracking
export const ONBOARDING_FUNNEL_STEPS = {
  LANDING_EXPLORE_CLICK: 'onboarding_landing_explore_click',
  ASSESSMENT_START: 'onboarding_assessment_start',
  ASSESSMENT_QUIZ_COMPLETE: 'onboarding_quiz_complete',
  ASSESSMENT_DEEP_COMPLETE: 'onboarding_deep_assessment_complete',
  DAILY_CHECKIN_START: 'onboarding_daily_checkin_start',
  DAILY_CHECKIN_STEP_COMPLETE: 'onboarding_daily_checkin_step',
  EXPENSE_ADD_CLICK: 'onboarding_expense_add_click',
  PARTS_SESSION_START: 'onboarding_parts_session_start',
  PARTS_SESSION_COMPLETE: 'onboarding_parts_session_complete',
  COMPASSION_SCORE_SAVE: 'onboarding_compassion_score_save',
  ONBOARDING_COMPLETE: 'onboarding_flow_complete'
} as const;

export const trackOnboardingStep = (
  step: keyof typeof ONBOARDING_FUNNEL_STEPS,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalData?: Record<string, any>
) => {
  // Get session ID safely with proper typing
  let sessionId = 'unknown';
  if (typeof window !== 'undefined') {
    const storedSessionId = sessionStorage.getItem('onboarding_session_id');
    sessionId = storedSessionId || 'unknown';
  }

  return {
    event_name: ONBOARDING_FUNNEL_STEPS[step],
    event_category: ANALYTICS_CATEGORIES.NAVIGATION,
    funnel_step: step,
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    ...additionalData,
  };
};

// Helper function to check if there's an active onboarding session
export const hasActiveOnboardingSession = (): boolean => {
  console.log('🔍 [ONBOARDING DEBUG] hasActiveOnboardingSession() called');
  
  if (typeof window === 'undefined') {
    console.log('❌ [ONBOARDING DEBUG] Cannot check session - window is undefined (SSR)');
    return false;
  }
  
  const sessionData = getOnboardingSessionData() as OnboardingSessionData;
  const hasSession = !!sessionData.session_id;
  
  console.log('✅ [ONBOARDING DEBUG] Active session check result:', {
    hasSession,
    sessionId: sessionData.session_id,
    location: window.location.href
  });
  
  return hasSession;
};

// Type guard helper function
export const isValidOnboardingSessionData = (data: OnboardingSessionResult): data is OnboardingSessionData => {
  return 'session_id' in data && 'start_time' in data && 'current_time' in data;
};

export const initializeOnboardingSession = (): string | null => {
  console.log('🔄 [ONBOARDING DEBUG] initializeOnboardingSession() called');
  
  if (typeof window === 'undefined') {
    console.log('❌ [ONBOARDING DEBUG] Cannot initialize - window is undefined (SSR)');
    return null;
  }
  
  const sessionId = Date.now().toString();
  const startTime = new Date().toISOString();
  
  console.log('✅ [ONBOARDING DEBUG] Initializing onboarding session:', {
    sessionId,
    startTime,
    location: window.location.href
  });
  
  sessionStorage.setItem('onboarding_session_id', sessionId);
  sessionStorage.setItem('onboarding_start_time', startTime);
  
  console.log('💾 [ONBOARDING DEBUG] Session data stored in sessionStorage');
  return sessionId;
};

export const getOnboardingSessionData = (): OnboardingSessionResult => {
  console.log('📋 [ONBOARDING DEBUG] getOnboardingSessionData() called');
  
  if (typeof window === 'undefined') {
    console.log('❌ [ONBOARDING DEBUG] Cannot get session data - window is undefined (SSR)');
    return {} as OnboardingSessionDataEmpty;
  }

  const sessionId = sessionStorage.getItem('onboarding_session_id');
  const startTime = sessionStorage.getItem('onboarding_start_time');
  const currentTime = new Date().toISOString();
  
  const sessionData: OnboardingSessionData = {
    session_id: sessionId,
    start_time: startTime,
    current_time: currentTime,
  };
  
  console.log('📊 [ONBOARDING DEBUG] Retrieved session data:', {
    ...sessionData,
    hasActiveSession: !!sessionId,
    sessionAge: sessionId ? `${Date.now() - parseInt(sessionId)}ms` : 'N/A',
    location: window.location.href
  });
  
  return sessionData;
};

export const completeOnboardingSession = (): OnboardingSessionResult | undefined => {
  console.log('🏁 [ONBOARDING DEBUG] completeOnboardingSession() called');
  
  if (typeof window === 'undefined') {
    console.log('❌ [ONBOARDING DEBUG] Cannot complete session - window is undefined (SSR)');
    return undefined;
  }
  
  const sessionData = getOnboardingSessionData();
  
  // Type guard to check if sessionData has session_id (is OnboardingSessionData)
  const isValidSessionData = (data: OnboardingSessionResult): data is OnboardingSessionData => {
    return 'session_id' in data && 'start_time' in data && 'current_time' in data;
  };
  
  const hasActiveSession = isValidSessionData(sessionData) && sessionData.session_id;
  
  console.log('🧹 [ONBOARDING DEBUG] Completing onboarding session:', {
    sessionData,
    location: window.location.href,
    sessionDuration: hasActiveSession && sessionData.session_id ? 
      `${Date.now() - parseInt(sessionData.session_id)}ms` : 'N/A'
  });
  
  sessionStorage.removeItem('onboarding_session_id');
  sessionStorage.removeItem('onboarding_start_time');
  
  console.log('✨ [ONBOARDING DEBUG] Session data cleared from sessionStorage');
  return sessionData;
};

// Simplified onboarding tracking function that combines session check + tracking + analytics context
export const trackOnboardingStepIfActive = (
  step: keyof typeof ONBOARDING_FUNNEL_STEPS,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalData?: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackEventFn?: (eventName: string, eventData: any) => void
): boolean => {
  console.log(`🎯 [ONBOARDING DEBUG] trackOnboardingStepIfActive() called for step: ${step}`);
  
  // Check if there's an active onboarding session
  if (!hasActiveOnboardingSession()) {
    console.log('❌ [ONBOARDING DEBUG] No active session - skipping tracking');
    return false;
  }
  
  // Track the onboarding step
  const eventData = trackOnboardingStep(step, additionalData);
  
  console.log('✅ [ONBOARDING DEBUG] Event data created:', {
    step,
    eventName: eventData.event_name,
    additionalData,
    location: typeof window !== 'undefined' ? window.location.href : 'SSR'
  });
  
  // If a track function is provided, use it (for analytics context)
  if (trackEventFn) {
    trackEventFn(eventData.event_name, eventData);
    console.log('📊 [ONBOARDING DEBUG] Event sent via trackEventFn');
  }
  
  return true;
};

// React hook helper for components using analytics context
// Usage: const trackOnboarding = useOnboardingTracking();
//        trackOnboarding('ASSESSMENT_QUIZ_COMPLETE', { quiz_result: result });
export const createOnboardingTracker = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackEventFn: (eventName: string, eventData: any) => void
) => {
  return (
    step: keyof typeof ONBOARDING_FUNNEL_STEPS,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalData?: Record<string, any>
  ): boolean => {
    return trackOnboardingStepIfActive(step, additionalData, trackEventFn);
  };
}; 