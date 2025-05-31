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