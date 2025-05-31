# Onboarding Funnel Analytics Setup

## Overview

This document outlines how to track and analyze the primary onboarding funnel for your financial wellness application using Google Analytics 4 (GA4). The funnel tracks users from their first interaction with the "Explore my financial parts" button through completion of their first daily check-in.

## Primary Onboarding Funnel Steps

The complete onboarding flow consists of these key steps:

1. **Landing Page** → Click "Explore my financial parts"
2. **Self-Assessment Start** → Begin assessment process
3. **Quick Discovery** → Complete firefighter quiz OR deep assessment
4. **Daily Check-in Start** → Click "Perform a Daily check-in"
5. **Daily Check-in Progress** → Complete steps 1-3 including adding expenses
6. **Parts Session** → Start and complete dialogue with triggered parts (Step 4)
7. **Self-Compassion** → Save compassion score (Step 5)
8. **Onboarding Complete** → Finish entire flow

## Event Tracking Implementation

### Event Names and Structure

All onboarding events follow this naming convention:
- **Event Name**: `onboarding_[action]_[context]`
- **Event Category**: `navigation`
- **Session ID**: Unique identifier for tracking complete user journeys

### Tracked Events

| Step | Event Name | Trigger | Key Parameters |
|------|------------|---------|----------------|
| 1 | `onboarding_landing_explore_click` | Click "Explore my financial parts" | `source_page`, `button_location` |
| 2 | `onboarding_assessment_start` | Visit self-assessment page | `source_page`, `has_existing_results` |
| 3a | `onboarding_quiz_complete` | Complete quick discovery quiz | `quiz_result`, `assessment_type` |
| 3b | `onboarding_deep_assessment_complete` | Complete deep assessment | `identified_part`, `assessment_type` |
| 4 | `onboarding_daily_checkin_start` | Click daily check-in button | `source_page`, `assessment_completed` |
| 5 | `onboarding_daily_checkin_step` | Complete each daily check-in step | `step`, `total_steps`, `progress_percentage` |
| 6 | `onboarding_expense_add_click` | Add expense in daily check-in | `expense_category`, `has_triggered_parts` |
| 7 | `onboarding_parts_session_start` | Start parts dialogue session | `part_name`, `source_page` |
| 8 | `onboarding_parts_session_complete` | Complete parts dialogue | `part_name`, `session_steps_completed` |
| 9 | `onboarding_compassion_score_save` | Save self-compassion score | `score`, `step` |
| 10 | `onboarding_flow_complete` | Complete entire onboarding | `total_time`, `completed_expenses`, `compassion_score` |

## Google Analytics 4 Setup

### 1. Custom Events Configuration

In GA4, create custom events for each onboarding step:

```javascript
// Example event structure
gtag('event', 'onboarding_landing_explore_click', {
  event_category: 'navigation',
  funnel_step: 'LANDING_EXPLORE_CLICK',
  session_id: 'unique_session_id',
  source_page: 'landing',
  button_location: 'self_assessment_feature_card'
});
```

### 2. Custom Dimensions

Set up these custom dimensions in GA4:

| Dimension Name | Scope | Description |
|----------------|-------|-------------|
| `onboarding_session_id` | Event | Tracks complete user journeys |
| `funnel_step` | Event | Identifies which step in the funnel |
| `assessment_type` | Event | Quick discovery vs deep assessment |
| `identified_part` | Event | Which financial part was identified |
| `source_page` | Event | Where the user came from |

### 3. Conversion Events

Mark these events as conversions in GA4:
- `onboarding_quiz_complete`
- `onboarding_deep_assessment_complete`
- `onboarding_parts_session_complete`
- `onboarding_flow_complete`

## Funnel Analysis in GA4

### 1. Create a Custom Funnel Report

1. Go to **Explore** → **Funnel exploration**
2. Set up the funnel with these steps:

```
Step 1: onboarding_landing_explore_click
Step 2: onboarding_assessment_start
Step 3: onboarding_quiz_complete OR onboarding_deep_assessment_complete
Step 4: onboarding_daily_checkin_start
Step 5: onboarding_expense_add_click
Step 6: onboarding_parts_session_start
Step 7: onboarding_parts_session_complete
Step 8: onboarding_compassion_score_save
Step 9: onboarding_flow_complete
```

### 2. Key Metrics to Track

#### Completion Rates
- **Overall Funnel Completion**: % of users who complete entire flow
- **Step-by-Step Drop-off**: Identify where users leave the funnel
- **Assessment Completion**: % who complete either quiz or deep assessment
- **Daily Check-in Engagement**: % who start and complete daily check-in
- **Parts Session Engagement**: % who engage with parts dialogue

#### Time-based Metrics
- **Time to Complete**: How long the entire onboarding takes
- **Step Duration**: Time spent on each funnel step
- **Session Length**: Total time from start to finish

#### Quality Metrics
- **Assessment Type Distribution**: Quick vs deep assessment preference
- **Parts Engagement**: Which parts are most commonly identified/worked with
- **Compassion Score Distribution**: Self-compassion levels at completion

### 3. Segmentation Analysis

Create segments to analyze different user behaviors:

#### By Assessment Type
- **Quick Discovery Users**: Completed quiz only
- **Deep Assessment Users**: Completed full assessment
- **Both Assessment Users**: Completed both quiz and deep assessment

#### By Completion Level
- **Full Completers**: Finished entire onboarding
- **Partial Completers**: Started but didn't finish
- **Assessment Only**: Completed assessment but didn't proceed

#### By Engagement Level
- **High Engagement**: Completed parts session + compassion score
- **Medium Engagement**: Completed daily check-in steps
- **Low Engagement**: Only completed assessment

## Privacy and Trauma-Informed Considerations

### Data Collection Principles
- **Minimal Data**: Only collect data necessary for improving user experience
- **Anonymized Tracking**: Use session IDs, not personal identifiers
- **Aggregated Analysis**: Focus on patterns, not individual user behavior
- **Consent-Based**: Respect user privacy preferences

### Sensitive Data Handling
- **No Content Tracking**: Never track actual journal content or assessment responses
- **Part Names Only**: Track identified part types, not personal details
- **Score Ranges**: Track compassion scores in ranges, not exact values
- **Anonymized Patterns**: Focus on user flow patterns, not individual journeys

## Reporting and Insights

### Weekly Onboarding Report

Create a custom dashboard with:

1. **Funnel Overview**
   - Total funnel starts
   - Completion rate
   - Drop-off points

2. **Step Performance**
   - Conversion rate for each step
   - Average time per step
   - Most common exit points

3. **User Segments**
   - Assessment type preferences
   - Completion patterns
   - Engagement levels

### Monthly Analysis

Focus on:
- **Trend Analysis**: How completion rates change over time
- **Optimization Opportunities**: Which steps need improvement
- **User Journey Insights**: Common paths through the funnel
- **Feature Effectiveness**: Which features drive completion

## Implementation Checklist

- [ ] Set up custom events in GA4
- [ ] Configure custom dimensions
- [ ] Mark conversion events
- [ ] Create funnel exploration report
- [ ] Set up automated reporting
- [ ] Test event tracking in development
- [ ] Validate data collection in production
- [ ] Create privacy-compliant data retention policies
- [ ] Train team on report interpretation
- [ ] Establish regular review schedule

## Sample GA4 Queries

### Funnel Completion Rate
```sql
SELECT
  COUNT(DISTINCT CASE WHEN event_name = 'onboarding_landing_explore_click' THEN user_pseudo_id END) as funnel_starts,
  COUNT(DISTINCT CASE WHEN event_name = 'onboarding_flow_complete' THEN user_pseudo_id END) as funnel_completions,
  SAFE_DIVIDE(
    COUNT(DISTINCT CASE WHEN event_name = 'onboarding_flow_complete' THEN user_pseudo_id END),
    COUNT(DISTINCT CASE WHEN event_name = 'onboarding_landing_explore_click' THEN user_pseudo_id END)
  ) * 100 as completion_rate_percent
FROM `your_project.analytics_dataset.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20240101' AND '20241231'
```

### Step-by-Step Analysis
```sql
SELECT
  event_name,
  COUNT(DISTINCT user_pseudo_id) as unique_users,
  COUNT(*) as total_events
FROM `your_project.analytics_dataset.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20240101' AND '20241231'
  AND event_name LIKE 'onboarding_%'
GROUP BY event_name
ORDER BY unique_users DESC
```

This comprehensive tracking setup will give you detailed insights into how users progress through your onboarding funnel while maintaining privacy and trauma-informed principles. 