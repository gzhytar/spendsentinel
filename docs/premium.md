# Premium Functionality Implementation Guide

This document outlines the approach for implementing and managing premium features in the InnerBalance application. Premium features provide enhanced capabilities that can be enabled or disabled based on environment configuration.

## Overview

Premium functionality in our application follows these key principles:
- Features are toggled using environment variables
- User interface elements clearly indicate premium status
- Premium features are gracefully disabled when not available
- Visual styling distinguishes premium features

## Configuration

### Environment Variables

Premium functionality is controlled via the `.env` file with the following variable:

```
NEXT_PUBLIC_PREMIUM_ENABLED=true|false
```

- When set to `'true'`, premium features are enabled
- When set to `'false'`, premium features are disabled
- The default value is `'false'` if not explicitly set

#### .env.example File

Create a `.env.example` file in the root of your project with the following contents:

```
# Application Settings
NODE_ENV=development

# Premium Features Configuration
# Set to 'true' to enable premium features, 'false' to disable
NEXT_PUBLIC_PREMIUM_ENABLED=false

# API Keys and other configurations can be added here
```

For local development, create a `.env.local` file based on this example and set `NEXT_PUBLIC_PREMIUM_ENABLED` to the appropriate value.

### Implementation

To access this configuration in code:

```typescript
// Access premium status in any component
import { usePremiumStatus } from '@/hooks/use-premium-status';

function MyComponent() {
  const { isPremiumEnabled } = usePremiumStatus();
  
  // Use isPremiumEnabled to conditionally render or enable features
}
```

## UI Implementation Guidelines

### Button Styling

Premium functionality buttons should follow these guidelines:

1. **Visual Distinction**:
   - Use a gold/premium color scheme for premium buttons
   - Add a subtle glow or shadow effect
   - Include a premium indicator icon (e.g., ✨ or 💎)

2. **Disabled State**:
   - When premium is disabled, buttons should:
     - Display in a disabled state (reduced opacity)
     - Not respond to click events
     - Provide a tooltip explaining premium status

3. **Enabled State**:
   - When premium is enabled, buttons should:
     - Be fully interactive
     - Maintain the premium visual styling
     - Execute the premium functionality when clicked

### Example Implementation

```tsx
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { usePremiumStatus } from '@/hooks/use-premium-status';

interface PremiumButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function PremiumButton({ onClick, children }: PremiumButtonProps) {
  const { isPremiumEnabled } = usePremiumStatus();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={isPremiumEnabled ? onClick : undefined}
          disabled={!isPremiumEnabled}
          className={`
            ${isPremiumEnabled 
              ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-black hover:from-amber-400 hover:to-amber-600' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'}
          `}
        >
          {isPremiumEnabled ? (
            <Crown className="w-4 h-4 mr-2 text-amber-200" />
          ) : (
            <Lock className="w-4 h-4 mr-2" />
          )}
          {children}
        </Button>
      </TooltipTrigger>
      {!isPremiumEnabled && (
        <TooltipContent>
          <p>This is a premium feature. Contact admin to enable premium functionality.</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
```

## Feature Toggling Implementation

### Creating the Premium Status Hook

Create a custom hook to manage premium status:

```typescript
// src/hooks/use-premium-status.ts
import { useState, useEffect } from 'react';

export function usePremiumStatus() {
  const [isPremiumEnabled, setIsPremiumEnabled] = useState(false);
  
  useEffect(() => {
    // Access the environment variable
    // Note: Next.js requires prefixing environment variables with NEXT_PUBLIC_ 
    // to make them available on the client side
    const premiumEnabled = process.env.NEXT_PUBLIC_PREMIUM_ENABLED === 'true';
    setIsPremiumEnabled(premiumEnabled);
  }, []);
  
  return { isPremiumEnabled };
}
```

### Conditional Feature Rendering

Use the hook to conditionally render premium features:

```tsx
function FeatureSection() {
  const { isPremiumEnabled } = usePremiumStatus();
  
  return (
    <div>
      <h2>Standard Features</h2>
      {/* Standard features always show */}
      
      {isPremiumEnabled && (
        <div>
          <h2>Premium Features</h2>
          {/* Premium features only render when enabled */}
        </div>
      )}
    </div>
  );
}
```

## Best Practices

1. **Graceful Degradation**:
   - Ensure the application works well without premium features
   - Provide clear visual cues about premium limitations
   - Offer upgrade paths or information when premium features are disabled

2. **Consistent Styling**:
   - Maintain consistent premium styling across the application
   - Use the `PremiumButton` component for all premium actions
   - Apply similar styling to other premium UI elements (cards, sections, etc.)

3. **Performance Considerations**:
   - Avoid loading premium-related assets when premium is disabled
   - Use code-splitting to separate premium functionality code
   - Consider lazy loading for premium-only components

## Testing Premium Functionality

To test premium features:

1. Set `NEXT_PUBLIC_PREMIUM_ENABLED=true` in your `.env.local` file
2. Restart the development server
3. Verify premium buttons are active and styled correctly
4. Test the premium functionality
5. Set `NEXT_PUBLIC_PREMIUM_ENABLED=false` to test disabled states
6. Verify buttons are disabled and tooltips show correctly

## Deployment Considerations

- For production environments, set `NEXT_PUBLIC_PREMIUM_ENABLED` according to business requirements
- For client-specific deployments, customize the environment variable per deployment
- Consider implementing server-side checks for premium functionality as an additional security measure

## Future Enhancements

Potential enhancements to consider:
- User-based premium access (rather than environment-based)
- Tiered premium features with different levels
- Time-limited premium trials
- Analytics tracking for premium feature usage 

## Complete Example

The following is a complete example of a component using premium functionality, demonstrating the proper implementation of the `PremiumButton` component and conditional rendering based on premium status:

```tsx
"use client";

import { useState } from 'react';
import { PremiumButton } from '@/components/ui/premium-button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePremiumStatus } from '@/hooks/use-premium-status';

/**
 * Example component demonstrating how to use premium functionality
 */
export function FinancialAnalysisCard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isPremiumEnabled } = usePremiumStatus();

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // In a real app, you would call your analysis API here
    setTimeout(() => {
      setIsAnalyzing(false);
      alert('Analysis complete!');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Financial Pattern Analysis</CardTitle>
        <CardDescription>
          Analyze your spending patterns to identify emotional triggers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Our advanced AI can analyze your spending history to identify emotional
          patterns and help you understand your financial behavior better.
        </p>
        
        {isPremiumEnabled && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800 text-sm">
              ✨ <strong>Premium Feature:</strong> Get detailed insights with emotional
              correlation analysis and personalized recommendations.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <PremiumButton 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
          tooltipText="The detailed financial analysis is a premium feature. Subscribe to enable premium features."
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Spending Patterns'}
        </PremiumButton>
      </CardFooter>
    </Card>
  );
}
```

This example demonstrates:
- Using the `usePremiumStatus` hook to check premium status
- Conditionally rendering premium-only UI elements
- Using the `PremiumButton` component with proper styling
- Handling loading states in premium functionality
- Providing appropriate tooltips for disabled premium features 