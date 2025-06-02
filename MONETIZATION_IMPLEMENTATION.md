# Monetization Implementation: Buy Me a Coffee Integration

This document outlines the implementation of trauma-informed monetization features for the InnerBalance app, following the strategic guidelines outlined in `docs/monetization-strategy.md`.

## Overview

The implementation follows a **progressive disclosure** approach, only showing monetization elements to users who have demonstrated engagement with the app. This ensures that support requests feel organic rather than intrusive.

## Core Components

### 1. Progressive Disclosure Hook (`use-monetization-visibility.ts`)

Controls when monetization elements are shown based on:
- **Session count**: Number of times user has visited the app
- **Engagement score**: Calculated from feature usage (expenses, assessments, check-ins, etc.)
- **Assessment completion**: Whether user has completed self-assessments

```typescript
// Visibility rules (using EngagementLevel enum):
showSupportMention: getEngagementLevel() >= EngagementLevel.BEGINNER
showCelebrationSupport: getEngagementLevel() >= EngagementLevel.BEGINNER  
showPremiumTeaser: getEngagementLevel() >= EngagementLevel.ADVANCED
showSubscriptionOffer: getEngagementLevel() >= EngagementLevel.ADVANCED
```

### 2. Buy Me a Coffee Button (`buy-me-coffee-button.tsx`)

Standardized button component with:
- Context-aware messaging based on placement
- Analytics tracking for conversion optimization
- Consistent styling across placements
- Opens external Buy Me a Coffee page

**Placements:**
- `footer`: "Support Our Mission"
- `card`: "Buy Us a Coffee"
- `celebration`: "Support Development"
- `settings`: "Support the Team"

### 3. Support Components

#### SupportMissionCard
- Appears on landing page after 6+ sessions
- Explains mission and sustainability
- Provides gentle call-to-action

#### CelebrationSupport
- Shows after meaningful completions (assessments, check-ins)
- Positive emotional context
- Celebrates user progress while offering support option

#### GentleSupportWidget
- Subtle integration for various contexts
- Multiple placement options (sidebar, inline, floating)
- Minimal visual impact with high emotional connection

## Integration Points

### 1. App Footer
- Progressive disclosure after 6 sessions
- Appears between disclaimer and copyright
- Includes mission messaging

### 2. Landing Page
- SupportMissionCard at bottom of page
- Only visible to engaged users
- Mission-focused messaging

### 3. Daily Check-in Completion
- CelebrationSupport appears after completion
- 5-second delay before auto-reset
- Positive reinforcement context

### 4. Session Tracking
- Automatic session counting in main layout
- Persistent across browser sessions
- Used for progressive disclosure calculations

## Analytics Integration

All monetization interactions are tracked with:
- User session count
- Engagement level (starter/beginner/advanced/expert)
- Placement context
- Button variant and size

**Events tracked:**
- `support_cta_clicked`: Buy Me a Coffee button clicks
- `gentle_support_clicked`: Widget interactions
- Context-specific completion events

## Translations

Monetization strings are available in multiple languages:
- `support.*`: Button labels and mission messaging
- `monetization.*`: Gentle prompts and CTAs
- `premium.*`: Future subscription offerings
- `completion.*`: Celebration messaging

## Usage Examples

### Basic Footer Integration
```tsx
import { BuyMeCoffeeButton } from '@/components/common';
import { useMonetizationVisibility, getEngagementLevel, EngagementLevel } from '@/hooks/use-monetization-visibility';

const { showSupportMention } = useMonetizationVisibility();

// Or use direct comparison:
const shouldShowSupport = getEngagementLevel() >= EngagementLevel.BEGINNER;

{showSupportMention && (
  <BuyMeCoffeeButton placement="footer" variant="outline" size="sm" />
)}
```

### Celebration After Completion
```tsx
import { CelebrationSupport } from '@/components/common';

{showCompletion && (
  <CelebrationSupport completionType="assessment" />
)}
```

### Gentle Inline Widget
```tsx
import { GentleSupportWidget } from '@/components/common';

<GentleSupportWidget placement="inline" className="my-4" />
```

## Best Practices

### 1. Trauma-Informed Approach
- Never show monetization during distress/panic states
- Use positive, celebratory contexts
- Emphasize mission and values over need
- Provide value before asking for support

### 2. Progressive Disclosure
- Respect user engagement levels
- Build trust before monetization
- Use gentle, non-pressuring language
- Allow users to control their experience

### 3. Analytics Considerations
- Track engagement patterns
- Monitor conversion rates by placement
- A/B test messaging approaches
- Respect user privacy preferences

## Technical Implementation Notes

### State Management
- Session tracking in localStorage
- Engagement scoring based on feature usage
- Real-time visibility calculations

### Performance
- Lazy loading of monetization components
- Client-side only (no SSR for personalization)
- Minimal bundle impact

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly messaging
- Focus management

## Future Enhancements

1. **Subscription Integration**: Monthly support options
2. **Premium Features**: Enhanced functionality for supporters
3. **Gratitude System**: Thank you messages and recognition
4. **Analytics Dashboard**: Detailed conversion tracking
5. **A/B Testing**: Message and timing optimization

## Monitoring & Optimization

### Key Metrics
- Conversion rates by placement
- User engagement correlation
- Session-to-support timeline
- Message effectiveness

### Success Indicators
- Organic feeling support requests
- High user satisfaction scores
- Sustainable revenue generation
- Maintained free feature accessibility

## Compliance & Ethics

- GDPR-compliant analytics
- Clear value proposition
- No dark patterns
- Transparent pricing
- Mission-aligned messaging

---

For detailed strategic background, see `docs/monetization-strategy.md`
For implementation questions, contact the development team. 