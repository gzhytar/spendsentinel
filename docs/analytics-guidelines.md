# Analytics Guidelines

## Overview

This document outlines the analytics approach, design decisions, and implementation patterns for SpendSentinel. It serves as a reference for maintaining consistency in analytics integration across the application, ensuring privacy-conscious and trauma-informed data collection.

## Core Principles

### 1. Privacy-First Analytics
- **User-Centric Data Collection**: Only collect data that directly improves user experience
- **Minimal Data Philosophy**: Collect the minimum viable data needed for insights
- **No Personal Financial Data**: Never track actual financial amounts, account details, or sensitive personal information
- **Anonymized Patterns**: Focus on usage patterns rather than individual user identification

### 2. Trauma-Informed Data Collection
- **Non-Judgmental Tracking**: Events should not imply judgment about user behavior
- **Empowerment Focus**: Track features that promote user autonomy and self-discovery
- **Safe Environment**: Analytics should not make users feel monitored or judged
- **Consent-Aware**: Respect user privacy preferences and provide transparency

### 3. Technical Excellence
- **Type Safety**: All analytics functions use TypeScript for compile-time safety
- **Error Handling**: Graceful degradation when analytics is unavailable
- **Performance**: Non-blocking, lightweight implementation
- **Development-Friendly**: Clear logging and debugging capabilities

## Architecture Overview

### Component Structure
```
src/
├── hooks/
│   └── use-analytics.ts           # Core analytics hook
├── contexts/
│   └── analytics-context.tsx      # React context provider
├── lib/
│   └── analytics-utils.ts         # Utility functions and constants
└── app/
    └── firebase.ts               # Firebase Analytics configuration
```

### Data Flow
1. **Page Views**: Automatically tracked via `useAnalytics` hook
2. **User Interactions**: Tracked via context functions in components
3. **Feature Usage**: Tracked at key feature completion points
4. **Custom Events**: Tracked using utility functions for consistency

## Event Taxonomy

### Event Categories

#### Navigation Events
- **Purpose**: Understand user journey and popular features
- **Examples**: Page views, sidebar navigation, feature discovery
- **Privacy**: No personal information, only navigation patterns

#### Feature Usage Events
- **Purpose**: Measure feature adoption and effectiveness
- **Examples**: Assessment completion, daily check-in progress, parts journal sessions
- **Privacy**: Focus on completion rates, not content

#### User Interaction Events
- **Purpose**: Optimize UI/UX based on interaction patterns
- **Examples**: Button clicks, form submissions, panic mode activation
- **Privacy**: Interaction type only, no form content

#### Engagement Events
- **Purpose**: Understand session patterns and user retention
- **Examples**: Session duration, language changes, feature exploration
- **Privacy**: Behavioral patterns, not user identification

### Event Naming Convention

```typescript
// Format: {category}_{action}_{optional_detail}
// Examples:
'page_view'                    // Simple navigation
'feature_used'                 // General feature usage
'assessment_completed'         // Specific feature completion
'panic_mode_activated'         // Emergency feature usage
'daily_checkin_step_completed' // Progress tracking
```

### Data Structure Standards

```typescript
// Base event structure
interface BaseEvent {
  event_category: string;      // High-level categorization
  event_label?: string;        // Specific item/feature identifier
  timestamp: string;           // ISO date string
  user_locale?: string;        // Language preference (for localization insights)
}

// Feature-specific extensions
interface FeatureEvent extends BaseEvent {
  feature_name: string;        // Specific feature identifier
  completed: boolean;          // Success/completion status
  step?: number;              // For multi-step processes
  total_steps?: number;       // Context for step progress
}
```

## Implementation Patterns

### 1. Component-Level Analytics

```typescript
// Pattern for component analytics integration
import { useAnalyticsContext } from '@/contexts/analytics-context';
import { ANALYTICS_EVENTS, ANALYTICS_CATEGORIES } from '@/lib/analytics-utils';

function MyComponent() {
  const { trackUserInteraction, trackFeatureUsage } = useAnalyticsContext();
  
  const handleFeatureAction = () => {
    // Track specific user interaction
    trackUserInteraction(
      'button_click',
      ANALYTICS_CATEGORIES.FEATURE,
      'feature_name'
    );
    
    // Execute feature logic
    performFeatureAction();
    
    // Track feature completion
    trackFeatureUsage(ANALYTICS_EVENTS.FEATURE_USED, {
      feature_name: 'specific_feature',
      success: true
    });
  };
}
```

### 2. Progressive Feature Tracking

```typescript
// Pattern for multi-step feature tracking
const trackProgressiveFeature = (
  featureName: string,
  currentStep: number,
  totalSteps: number,
  completed: boolean = false
) => {
  trackFeatureUsage(featureName, {
    step: currentStep,
    total_steps: totalSteps,
    progress_percentage: (currentStep / totalSteps) * 100,
    completed,
    timestamp: new Date().toISOString()
  });
};

// Enhanced pattern for onboarding features with context
const trackOnboardingFeature = (
  featureName: string,
  actionType: string,
  additionalData: Record<string, any> = {}
) => {
  trackOnboarding(featureName, {
    action_type: actionType,
    session_id: getOnboardingSessionId(),
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};
```

### 3. Safe Error Handling

```typescript
// Pattern for analytics with error handling
const safeTrackEvent = (eventName: string, data?: Record<string, any>) => {
  try {
    if (analytics) {
      trackEvent(eventName, data);
    }
  } catch (error) {
    // Never break user experience for analytics
    console.warn('Analytics tracking failed:', error);
  }
};

// Enhanced pattern for onboarding with fallbacks
const safeTrackOnboarding = (
  step: string,
  data?: Record<string, any>,
  fallbackEvent?: string
) => {
  try {
    if (hasActiveOnboardingSession()) {
      trackOnboarding(step, data);
    } else if (fallbackEvent) {
      trackFeatureUsage(fallbackEvent, data);
    }
  } catch (error) {
    console.warn('Onboarding tracking failed:', error);
  }
};
```

## Privacy Safeguards

### Data Collection Boundaries

**✅ SAFE TO TRACK:**
- Feature usage patterns
- Navigation flows
- Completion rates
- Language preferences
- Error rates (without sensitive details)
- Performance metrics
- Button click patterns and text
- Feature sequencing and timing
- Setup completion status
- Goal creation patterns (type and length only)
- Budget setup patterns (ranges only)

**❌ NEVER TRACK:**
- Actual expense amounts
- Personal financial data
- User-generated content (journal entries, goal content)
- Account information
- Location data
- Device identifiers
- Exact budget amounts
- Personal goal descriptions
- Specific part dialogue content

### Data Anonymization

```typescript
// Pattern for anonymized data collection
const trackAnonymizedUsage = (featureType: string, category: string) => {
  trackFeatureUsage('feature_category_usage', {
    feature_type: featureType,     // e.g., 'expense_tracking'
    category: category,            // e.g., 'lifestyle' (anonymized)
    // NO: specific amounts, descriptions, or personal details
  });
};

// Pattern for anonymized onboarding progression
const trackAnonymizedOnboarding = (step: string, progressData: any) => {
  trackOnboarding(step, {
    progress_type: progressData.type,     // e.g., 'vision_board_setup'
    completion_status: progressData.completed,
    time_spent_range: progressData.timeRange, // e.g., 'quick', 'medium', 'thorough'
    // NO: actual content, amounts, or personal information
  });
};
```

## Development Guidelines

### 1. Testing Analytics

```typescript
// Development mode logging
if (process.env.NODE_ENV === 'development') {
  console.log('Analytics Event:', eventName, parameters);
}

// Test analytics availability
const isAnalyticsAvailable = () => {
  return typeof window !== 'undefined' && !!analytics;
};
```

### 2. Debugging Patterns

```typescript
// Comprehensive event logging for debugging
const debugAnalyticsEvent = (event: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('Analytics Debug');
    console.log('Event:', event.event_name);
    console.log('Category:', event.event_category);
    console.log('Data:', event);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
};
```

### 3. Performance Considerations

```typescript
// Non-blocking analytics with timeout
const trackWithTimeout = (eventFn: () => void, timeoutMs: number = 100) => {
  setTimeout(() => {
    try {
      eventFn();
    } catch (error) {
      console.warn('Analytics timeout or error:', error);
    }
  }, timeoutMs);
};
```

## Feature-Specific Tracking Guidelines

### Self-Assessment Analytics
- Track completion rates by step
- Monitor drop-off points
- Record identified part types (anonymized)
- Measure time to completion

```typescript
trackAssessmentProgress('step_identification', true, 'spender_type');
```

### Daily Check-In Analytics
- Track step progression
- Monitor completion rates
- Record feature usage within check-in
- Measure engagement patterns

```typescript
trackDailyCheckInProgress(3, 5, false); // Step 3 of 5, not completed
```

### Parts Journal Analytics
- Track session initiation
- Monitor session completion
- Record part interaction patterns
- Measure feature effectiveness

```typescript
trackPartsJournalSession('The Spender', 2, false); // Step 2, in progress
```

### Expense Tracking Analytics
- Track category usage patterns (anonymized)
- Monitor feature adoption
- Record workflow completion
- Measure user engagement

```typescript
trackExpenseAction('add', 'lifestyle_category'); // No amounts
```

### Continue Your Journey Analytics
- Track feature navigation patterns
- Monitor action preferences and sequencing
- Record source context for recommendations
- Measure onboarding progression effectiveness

```typescript
// Track Continue Your Journey button clicks
trackOnboarding('CONTINUE_JOURNEY_CLICK', {
  action_type: 'vision_board',
  button_text: 'Add to Vision Board',
  source_page: 'self_assessment',
  has_existing_data: false
});

// Track feature adoption from Continue Your Journey
trackFeatureUsage('continue_journey_navigation', {
  destination_feature: 'daily_checkin',
  source_context: 'post_assessment',
  sequential_usage: true
});
```

### Vision Board Analytics
- Track goal creation patterns (content-agnostic)
- Monitor goal type preferences
- Record setup completion rates
- Measure motivational feature effectiveness

```typescript
// Track vision board goal creation
trackOnboarding('VISION_BOARD_GOAL_ADD', {
  goal_type: 'text', // or 'image'
  content_length: 'medium', // 'short', 'medium', 'long'
  source_section: 'continue_your_journey',
  is_first_goal: true
});

// Track vision board engagement
trackFeatureUsage('vision_board_interaction', {
  action: 'goal_created',
  goal_count: 1,
  session_goals_added: 1
});
```

### Budget Setup Analytics
- Track budget planning completion
- Monitor budget range patterns (anonymized)
- Record setup source and context
- Measure financial planning feature adoption

```typescript
// Track budget setup initiation
trackOnboarding('BUDGET_SETUP_CLICK', {
  source_section: 'continue_your_journey',
  has_existing_budget: false,
  from_onboarding_flow: true
});

// Track budget completion (privacy-safe)
trackOnboarding('BUDGET_COMPLETE', {
  monthly_income_range: 'medium', // 'low', 'medium', 'high'
  setup_method: 'guided', // vs 'manual'
  completion_time_seconds: 180
});
```

### Onboarding Flow Analytics
- Track complete journey progression
- Monitor feature adoption sequences
- Record completion patterns and timing
- Measure comprehensive setup effectiveness

```typescript
// Enhanced onboarding completion
trackOnboarding('FLOW_COMPLETE', {
  total_time_minutes: 45,
  features_completed: ['assessment', 'daily_checkin', 'vision_board', 'budget'],
  optional_features_used: ['parts_session'],
  completion_sequence: 'standard', // vs 'custom'
  compassion_score_final: 7
});
```

## Ethical Considerations

### 1. Transparency
- Clear privacy policy regarding analytics
- User-friendly explanation of data collection
- Opt-out mechanisms where appropriate

### 2. Purpose Limitation
- Only collect data for stated purposes
- Regular review of tracking necessity
- Remove unused tracking points

### 3. Data Minimization
- Collect only essential behavioral data
- Avoid personally identifiable information
- Use aggregated data for insights

### 4. Trauma-Informed Approach
- No tracking that could trigger shame/judgment
- Focus on empowerment and progress
- Respect user emotional states

## Implementation Checklist

### For New Features
- [ ] Identify key user journey points
- [ ] Define success metrics (non-personal)
- [ ] Implement analytics using established patterns
- [ ] Test analytics in development mode
- [ ] Verify no sensitive data collection
- [ ] Document tracked events
- [ ] Review for trauma-informed compliance
- [ ] Consider onboarding flow integration
- [ ] Test Continue Your Journey integration
- [ ] Validate cross-feature navigation tracking

### For Analytics Events
- [ ] Use established naming conventions
- [ ] Include required base properties
- [ ] Implement error handling
- [ ] Add development logging
- [ ] Verify privacy compliance
- [ ] Test in production-like environment
- [ ] Consider onboarding session context
- [ ] Test button text and action type parameters
- [ ] Validate feature sequencing data

## Migration and Maintenance

### Version Updates
- Maintain backward compatibility for existing events
- Document schema changes
- Provide migration paths for breaking changes
- Archive deprecated events appropriately

### Regular Reviews
- Quarterly review of tracked events
- Annual privacy assessment
- Performance impact evaluation
- User feedback integration

## Integration with AI/LLM Development

### Context for AI Assistants
When developing new features, consider:

1. **Analytics Integration Points**: Where would tracking add value without compromising privacy?
2. **User Journey Mapping**: What are the key decision points users face?
3. **Success Metrics**: How can we measure feature effectiveness ethically?
4. **Privacy Boundaries**: What data is absolutely off-limits?
5. **Trauma-Informed Design**: How does tracking respect user emotional well-being?

### AI Assistant Guidelines
- Always reference this document when adding analytics
- Prioritize user privacy over data collection comprehensiveness
- Use established patterns and utilities
- Consider the trauma-informed implications of any tracking
- Focus on feature improvement, not user monitoring

---

This document should be referenced and updated as the analytics implementation evolves, ensuring consistent, ethical, and effective data collection practices across SpendSentinel. 