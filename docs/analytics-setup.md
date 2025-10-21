# Vercel Analytics Configuration with Environment Detection

This document explains how Vercel Analytics is configured in this Next.js application, including environment detection and custom parameters.

## 🎯 Features

- **Environment Detection**: Automatically detects and categorizes different environments
- **Traffic Filtering**: Prevents analytics tracking on localhost:9002 (testing environment)
- **Custom Parameters**: Automatically adds `traffic_type` parameter to all events
- **Debug Tools**: Utilities for testing and validating analytics configuration

## 🏗️ Environment Categories

The system automatically detects and categorizes environments:

| Environment | Description | Analytics Tracking | Traffic Type |
|-------------|-------------|-------------------|--------------|
| **Testing** | localhost:9002 | ❌ Disabled | `testing` |
| **Development** | localhost (other ports), 127.0.0.1 | ✅ Enabled | `development` |
| **Staging** | preview/staging domains, vercel.app | ✅ Enabled | `staging` |
| **Production** | Your production domain | ✅ Enabled | `production` |
| **Server** | Server-side rendering | ❌ Disabled | `server` |

## 📦 Configuration Files

### 1. Analytics Hook (`src/hooks/use-analytics.ts`)
- Environment detection logic
- Vercel Analytics integration using `track()` function
- Automatically includes default parameters with every event
- Provides tracking functions: `trackEvent`, `trackUserInteraction`, `trackFeatureUsage`

### 2. Analytics Context (`src/contexts/analytics-context.tsx`)
- React context for easy access to analytics functions
- Includes environment information
- Consent-aware analytics wrapper

### 3. Root Layout (`src/app/layout.tsx`)
- Vercel Analytics component integration
- `<Analytics />` component for automatic page view tracking

## 🔧 Default Parameters

Every analytics event automatically includes these parameters:

```typescript
{
  traffic_type: 'production' | 'staging' | 'development' | 'testing' | 'server',
  environment: 'production' | 'staging' | 'development' | 'testing' | 'server',
  event_timestamp: '2024-01-01T12:00:00.000Z'
}
```

## 🧪 Testing Your Configuration

### Method 1: Analytics Test Page
Visit `/analytics-test` in your app to use the built-in testing interface.

### Method 2: Using Debug Utilities
```typescript
import { analyticsDebug } from '@/lib/analytics-debug';

// Log environment information
analyticsDebug.logEnvironmentInfo();

// Check if tracking is enabled
const shouldTrack = analyticsDebug.shouldTrackInCurrentEnvironment();

// Get current traffic type
const trafficType = analyticsDebug.getCurrentTrafficType();

// Simulate event parameters
const params = analyticsDebug.simulateEventParameters({
  custom_param: 'value'
});
```

### Method 3: Manual Testing
```typescript
import { useAnalyticsContext } from '@/contexts/analytics-context';

function MyComponent() {
  const { trackEvent, environment, shouldTrack } = useAnalyticsContext();
  
  const handleClick = () => {
    trackEvent('button_click', {
      button_name: 'test_button',
      component: 'my_component'
    });
  };
  
  return (
    <div>
      <p>Environment: {environment}</p>
      <p>Tracking: {shouldTrack ? 'Enabled' : 'Disabled'}</p>
      <button onClick={handleClick}>Test Event</button>
    </div>
  );
}
```

## 📊 Vercel Analytics Setup

### In your Vercel Dashboard:

1. **Analytics**: Enable Vercel Analytics in your project settings
2. **Custom Events**: All custom events are automatically tracked via the `track()` function
3. **Environment Detection**: Events include `traffic_type` and `environment` parameters for filtering

### Custom Dimensions
Set up these custom dimensions in Vercel Analytics:
- `traffic_type` → Custom Dimension
- `environment` → Custom Dimension

## 🚀 Deployment Checklist

### Development
- [ ] Test on localhost (not port 9002) - should track with `traffic_type: 'development'`
- [ ] Verify console logs show analytics events
- [ ] Check GA4 real-time reports for incoming events

### Staging
- [ ] Deploy to staging environment
- [ ] Verify `traffic_type: 'staging'` in events
- [ ] Test analytics functionality end-to-end

### Production
- [ ] Verify production domain triggers `traffic_type: 'production'`
- [ ] Confirm no development/testing events in production GA4
- [ ] Monitor GA4 real-time reports

## 🛠️ Troubleshooting

### No Events in Vercel Analytics
1. Check browser console for analytics logs
2. Verify Vercel Analytics is enabled in project settings
3. Test with the analytics test page (`/analytics-test`)
4. Check Vercel Analytics dashboard for incoming events

### Wrong Environment Detection
1. Check `analyticsDebug.logEnvironmentInfo()` output
2. Verify your domain configuration in the environment detection logic
3. Update the environment detection rules if needed

### Events from Testing Environment
1. Confirm localhost:9002 shows "Analytics tracking disabled"
2. Check that `shouldTrack` is `false` for testing environment
3. Verify no events are being sent to Vercel Analytics from localhost:9002

## 🔒 Privacy Considerations

- No personal data is included in default parameters
- All tracking respects user consent (implement consent management as needed)
- Testing environment data is never sent to Vercel Analytics
- Server-side events are not tracked to prevent bot traffic

## 📈 Custom Event Examples

```typescript
// Feature usage tracking
trackFeatureUsage('expense_tracker', {
  action: 'add_expense',
  category: 'lifestyle',
  amount: 50
});

// User interaction tracking
trackUserInteraction('click', 'navigation', 'parts_journal');

// Custom events
trackEvent('daily_checkin_completed', {
  steps_completed: 5,
  self_compassion_score: 8,
  parts_activated: ['spender', 'avoider']
});
```

All these events will automatically include the `traffic_type` and `environment` parameters. 