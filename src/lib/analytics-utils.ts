/**
 * Analytics utility functions for common tracking scenarios
 */

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
  additionalData?: Record<string, any>
) => ({
  event_name: ONBOARDING_FUNNEL_STEPS[step],
  event_category: ANALYTICS_CATEGORIES.NAVIGATION,
  funnel_step: step,
  session_id: typeof window !== 'undefined' ? sessionStorage.getItem('onboarding_session_id') || 'unknown' : 'unknown',
  timestamp: new Date().toISOString(),
  ...additionalData,
});

export const initializeOnboardingSession = () => {
  if (typeof window === 'undefined') return null;
  
  const sessionId = Date.now().toString();
  sessionStorage.setItem('onboarding_session_id', sessionId);
  sessionStorage.setItem('onboarding_start_time', new Date().toISOString());
  return sessionId;
};

export const getOnboardingSessionData = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    session_id: sessionStorage.getItem('onboarding_session_id'),
    start_time: sessionStorage.getItem('onboarding_start_time'),
    current_time: new Date().toISOString(),
  };
};

export const completeOnboardingSession = () => {
  if (typeof window === 'undefined') return;
  
  const sessionData = getOnboardingSessionData();
  sessionStorage.removeItem('onboarding_session_id');
  sessionStorage.removeItem('onboarding_start_time');
  return sessionData;
}; 