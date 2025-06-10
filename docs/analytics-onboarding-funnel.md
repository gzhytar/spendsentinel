# Onboarding Funnel Analytics Setup

## Overview

This document outlines how to track and analyze the primary onboarding funnel for your financial wellness application using Google Analytics 4 (GA4). The funnel tracks users from their first interaction with any part discovery button through completion of their comprehensive financial wellness setup.

## Primary Onboarding Funnel Steps

The complete onboarding flow consists of these key steps that guide users through discovering their financial parts and establishing healthy habits:

1. **Landing Page** → Click any part discovery button ("Discover My Financial Parts", "Start My Discovery", "Explore My Financial Parts")
2. **Self-Assessment Start** → Begin assessment process
3. **Quick Discovery** → Complete firefighter quiz OR deep assessment
4. **Daily Check-in Start** → Click "Perform a Daily check-in" from Continue Your Journey
5. **Daily Check-in Progress** → Complete all 5 steps including expense logging
6. **Parts Session** → Start and complete dialogue with triggered parts (optional)
7. **Self-Compassion** → Save compassion score (final daily check-in step)
8. **Vision Board Setup** → Click "Add to Vision Board" from Continue Your Journey
9. **Budget Planning** → Click "Set My Budget" from Continue Your Journey
10. **Onboarding Complete** → Finish comprehensive setup

## Event Tracking Implementation

### Event Names and Structure

All onboarding events follow this naming convention:
- **Event Name**: `onboarding_[action]_[context]`
- **Event Category**: `navigation`
- **Session ID**: Unique identifier for tracking complete user journeys

### Tracked Events

| Step | Event Name | Trigger | Key Parameters |
|------|------------|---------|----------------|
| 1a | `onboarding_landing_discover_click` | Click "Discover My Financial Parts" | `source_page`, `button_location`, `button_text` |
| 1b | `onboarding_landing_start_click` | Click "Start My Discovery" | `source_page`, `button_location`, `button_text` |
| 1c | `onboarding_landing_explore_click` | Click "Explore My Financial Parts" | `source_page`, `button_location`, `button_text` |
| 2 | `onboarding_assessment_start` | Visit self-assessment page | `source_page`, `has_existing_results` |
| 3a | `onboarding_quiz_complete` | Complete quick discovery quiz | `quiz_result`, `assessment_type` |
| 3b | `onboarding_deep_assessment_complete` | Complete deep assessment | `identified_part`, `assessment_type` |
| 4 | `onboarding_continue_journey_click` | Click any button in Continue Your Journey | `action_type`, `button_text`, `source_page` |
| 5 | `onboarding_daily_checkin_start` | Click "Perform a Daily check-in" | `source_section`, `assessment_completed` |
| 6 | `onboarding_daily_checkin_step` | Complete each daily check-in step | `step`, `total_steps`, `progress_percentage` |
| 7 | `onboarding_expense_add_click` | Add expense in daily check-in | `expense_category`, `has_triggered_parts` |
| 8 | `onboarding_parts_session_start` | Start parts dialogue session | `part_name`, `source_page` |
| 9 | `onboarding_parts_session_complete` | Complete parts dialogue | `part_name`, `session_steps_completed` |
| 10 | `onboarding_compassion_score_save` | Save self-compassion score | `score`, `step` |
| 11 | `onboarding_vision_board_click` | Click "Add to Vision Board" | `source_section`, `has_existing_goals` |
| 12 | `onboarding_vision_board_goal_add` | Add first goal to vision board | `goal_type`, `content_length` |
| 13 | `onboarding_budget_setup_click` | Click "Set My Budget" | `source_section`, `has_existing_budget` |
| 14 | `onboarding_budget_complete` | Complete budget setup | `monthly_income_range`, `budget_type` |
| 15 | `onboarding_flow_complete` | Complete entire onboarding | `total_time`, `completed_goals`, `has_budget`, `compassion_score` |

## Google Analytics 4 Setup

### 1. Custom Events Configuration

In GA4, create custom events for each onboarding step:

```javascript
// Example event structure for button variations
gtag('event', 'onboarding_landing_discover_click', {
  event_category: 'navigation',
  funnel_step: 'LANDING_DISCOVER_CLICK',
  session_id: 'unique_session_id',
  source_page: 'landing',
  button_location: 'hero_primary_cta',
  button_text: 'Discover My Financial Parts'
});

// Example event for Continue Your Journey tracking
gtag('event', 'onboarding_continue_journey_click', {
  event_category: 'navigation',
  funnel_step: 'CONTINUE_JOURNEY_CLICK',
  session_id: 'unique_session_id',
  action_type: 'vision_board',
  button_text: 'Add to Vision Board',
  source_page: 'self_assessment'
});

// Example event for vision board goal creation
gtag('event', 'onboarding_vision_board_goal_add', {
  event_category: 'onboarding_completion',
  funnel_step: 'VISION_BOARD_GOAL_ADD',
  session_id: 'unique_session_id',
  goal_type: 'text',
  content_length: 'medium'
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
| `button_text` | Event | Exact button text clicked |
| `action_type` | Event | Type of action in Continue Your Journey |
| `source_section` | Event | Which section triggered the action |

### 3. Conversion Events

Mark these events as conversions in GA4:
- `onboarding_quiz_complete`
- `onboarding_deep_assessment_complete`
- `onboarding_parts_session_complete`
- `onboarding_vision_board_goal_add`
- `onboarding_budget_complete`
- `onboarding_flow_complete`

## Funnel Analysis in GA4

### 1. Create a Custom Funnel Report

1. Go to **Explore** → **Funnel exploration**
2. Set up the funnel with these steps:

```
Step 1: onboarding_landing_discover_click OR onboarding_landing_start_click OR onboarding_landing_explore_click
Step 2: onboarding_assessment_start
Step 3: onboarding_quiz_complete OR onboarding_deep_assessment_complete
Step 4: onboarding_daily_checkin_start
Step 5: onboarding_expense_add_click
Step 6: onboarding_parts_session_start (optional branch)
Step 7: onboarding_compassion_score_save
Step 8: onboarding_vision_board_goal_add
Step 9: onboarding_budget_complete
Step 10: onboarding_flow_complete
```

### 2. Key Metrics to Track

#### Completion Rates
- **Overall Funnel Completion**: % of users who complete entire onboarding flow including vision board and budget
- **Core Onboarding Completion**: % who complete through daily check-in
- **Setup Completion**: % who complete vision board and budget setup
- **Step-by-Step Drop-off**: Identify where users leave the funnel
- **Assessment Completion**: % who complete either quiz or deep assessment
- **Daily Check-in Engagement**: % who start and complete daily check-in
- **Parts Session Engagement**: % who engage with parts dialogue (optional)
- **Continue Your Journey Engagement**: % who use Continue Your Journey section

#### Button Performance Metrics
- **Discovery Button Variations**: Performance comparison of different button texts
- **Continue Your Journey CTR**: Click-through rates for different actions
- **Feature Adoption**: Vision board vs budget setup preference order

#### Time-based Metrics
- **Time to Complete Core Flow**: Time from landing to daily check-in completion
- **Time to Full Setup**: Time to complete including vision board and budget
- **Step Duration**: Time spent on each funnel step
- **Session Length**: Total time from start to finish

#### Quality Metrics
- **Assessment Type Distribution**: Quick vs deep assessment preference
- **Parts Engagement**: Which parts are most commonly identified/worked with
- **Compassion Score Distribution**: Self-compassion levels at completion
- **Goal Type Distribution**: Text vs image goals in vision board
- **Budget Range Distribution**: Monthly income and budget ranges (anonymized)

### 3. Segmentation Analysis

Create segments to analyze different user behaviors:

#### By Entry Point
- **Discover Button Users**: Used "Discover My Financial Parts"
- **Start Discovery Users**: Used "Start My Discovery"
- **Explore Button Users**: Used "Explore My Financial Parts"

#### By Completion Level
- **Full Onboarding Completers**: Finished entire flow including vision board and budget
- **Core Completers**: Completed through daily check-in only
- **Assessment Only**: Completed assessment but didn't proceed
- **Setup Incomplete**: Started but didn't finish vision board/budget

#### By Feature Usage
- **High Engagement**: Used parts sessions, vision board, and budget
- **Medium Engagement**: Completed daily check-in and one setup feature
- **Basic Engagement**: Assessment and daily check-in only

#### By Continue Your Journey Usage
- **Sequential Users**: Follow suggested order (check-in → vision board → budget)
- **Goal-First Users**: Start with vision board setup
- **Budget-First Users**: Start with budget setup
- **Navigation Users**: Use Continue Your Journey for feature discovery

## Privacy and Trauma-Informed Considerations

### Data Collection Principles
- **Minimal Data**: Only collect data necessary for improving user experience
- **Anonymized Tracking**: Use session IDs, not personal identifiers
- **Aggregated Analysis**: Focus on patterns, not individual user behavior
- **Consent-Based**: Respect user privacy preferences

### Sensitive Data Handling
- **No Content Tracking**: Never track actual goal content or budget amounts
- **Range-Based Tracking**: Track budget ranges, not exact amounts
- **Part Names Only**: Track identified part types, not personal details
- **Score Ranges**: Track compassion scores in ranges, not exact values
- **Anonymized Patterns**: Focus on user flow patterns, not individual journeys

## Reporting and Insights

### Weekly Onboarding Report

Create a custom dashboard with:

1. **Funnel Overview**
   - Total funnel starts by entry point
   - Core completion rate (through daily check-in)
   - Full completion rate (including setup features)
   - Drop-off points analysis

2. **Entry Point Performance**
   - Button variation performance comparison
   - Conversion rates by button text
   - Most effective entry points

3. **Continue Your Journey Analysis**
   - Feature adoption rates
   - Action sequence patterns
   - Time between actions

4. **Setup Feature Performance**
   - Vision board adoption rate
   - Budget setup completion rate
   - Feature usage order preferences

### Monthly Analysis

Focus on:
- **Trend Analysis**: How completion rates change over time
- **Entry Point Optimization**: Most effective button variations
- **Feature Sequencing**: Optimal order for setup features
- **User Journey Insights**: Common paths through the onboarding
- **Continue Your Journey Effectiveness**: Impact on feature adoption

## Implementation Checklist

- [ ] Set up custom events in GA4 for all button variations
- [ ] Configure custom dimensions including button_text and action_type
- [ ] Mark conversion events for key onboarding milestones
- [ ] Create comprehensive funnel exploration report
- [ ] Set up Continue Your Journey section tracking
- [ ] Implement vision board and budget completion tracking
- [ ] Set up automated reporting dashboards
- [ ] Test event tracking for all button variations in development
- [ ] Validate data collection in production
- [ ] Create privacy-compliant data retention policies
- [ ] Train team on report interpretation
- [ ] Establish regular review schedule for optimization

## Sample GA4 Queries

### Complete Funnel Completion Rate
```sql
SELECT
  COUNT(DISTINCT CASE WHEN event_name IN ('onboarding_landing_discover_click', 'onboarding_landing_start_click', 'onboarding_landing_explore_click') THEN user_pseudo_id END) as funnel_starts,
  COUNT(DISTINCT CASE WHEN event_name = 'onboarding_flow_complete' THEN user_pseudo_id END) as funnel_completions,
  SAFE_DIVIDE(
    COUNT(DISTINCT CASE WHEN event_name = 'onboarding_flow_complete' THEN user_pseudo_id END),
    COUNT(DISTINCT CASE WHEN event_name IN ('onboarding_landing_discover_click', 'onboarding_landing_start_click', 'onboarding_landing_explore_click') THEN user_pseudo_id END)
  ) * 100 as completion_rate_percent
FROM `your_project.analytics_dataset.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20240101' AND '20241231'
```

### Button Variation Performance
```sql
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'button_text') as button_text,
  COUNT(DISTINCT user_pseudo_id) as unique_users,
  COUNT(DISTINCT CASE WHEN event_name = 'onboarding_flow_complete' THEN user_pseudo_id END) as completions,
  SAFE_DIVIDE(
    COUNT(DISTINCT CASE WHEN event_name = 'onboarding_flow_complete' THEN user_pseudo_id END),
    COUNT(DISTINCT user_pseudo_id)
  ) * 100 as conversion_rate
FROM `your_project.analytics_dataset.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20240101' AND '20241231'
  AND event_name IN ('onboarding_landing_discover_click', 'onboarding_landing_start_click', 'onboarding_landing_explore_click')
GROUP BY button_text
ORDER BY conversion_rate DESC
```

### Continue Your Journey Performance
```sql
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'action_type') as action_type,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT user_pseudo_id) as unique_users
FROM `your_project.analytics_dataset.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20240101' AND '20241231'
  AND event_name = 'onboarding_continue_journey_click'
GROUP BY action_type
ORDER BY total_clicks DESC
```

This comprehensive tracking setup will give you detailed insights into how users progress through your complete onboarding funnel while maintaining privacy and trauma-informed principles. The enhanced tracking includes all button variations and the full setup flow through vision board and budget creation. 