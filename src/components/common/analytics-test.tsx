"use client";

import React from 'react';
import { useAnalyticsContext } from '@/contexts/analytics-context';
import { analyticsDebug } from '@/lib/analytics-debug';
import { trackOnboardingStepIfActive } from '@/lib/analytics-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AnalyticsTest() {
  const { trackEvent, trackUserInteraction, trackFeatureUsage, isReady, environment, shouldTrack } = useAnalyticsContext();

  const handleTestEvent = () => {
    trackEvent('test_event', {
      test_type: 'manual_test',
      component: 'analytics_test',
      user_action: 'button_click'
    });
  };

  const handleTestInteraction = () => {
    trackUserInteraction('click', 'test_component', 'analytics_test_button');
  };

  const handleTestFeature = () => {
    trackFeatureUsage('analytics_test', {
      test_type: 'manual_feature_test',
      timestamp: new Date().toISOString()
    });
  };

  // Test new onboarding events
  const handleTestContinueJourney = () => {
    trackOnboardingStepIfActive('CONTINUE_JOURNEY_CLICK', {
      action_type: 'test_action',
      button_text: 'Test Continue Journey Button',
      source_section: 'analytics_test'
    }, trackEvent);
  };

  const handleTestVisionBoard = () => {
    trackOnboardingStepIfActive('VISION_BOARD_GOAL_ADD', {
      goal_type: 'text',
      goal_content_length: 25,
      total_goals: 1,
      source_section: 'analytics_test'
    }, trackEvent);
  };

  const handleTestBudget = () => {
    trackOnboardingStepIfActive('BUDGET_COMPLETE', {
      budget_amount: 5000,
      spend_budget: 3000,
      saving_target: 2000,
      spend_percentage: 60,
      saving_percentage: 40,
      source_section: 'analytics_test'
    }, trackEvent);
  };

  const handleShowEnvironmentInfo = () => {
    analyticsDebug.logEnvironmentInfo();
  };

  const handleSimulateParameters = () => {
    const simulatedParams = analyticsDebug.simulateEventParameters({
      custom_param: 'test_value',
      user_id: 'test_user_123'
    });
    console.log('Simulated Event Parameters:', simulatedParams);
  };

  const getEnvironmentBadgeVariant = () => {
    switch (environment) {
      case 'production':
        return 'default';
      case 'staging':
        return 'secondary';
      case 'development':
        return 'outline';
      case 'testing':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Analytics Configuration Test
          <Badge variant={getEnvironmentBadgeVariant()}>
            {environment}
          </Badge>
        </CardTitle>
        <CardDescription>
          Test your Vercel Analytics configuration and environment detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Environment:</strong> {environment}
          </div>
          <div>
            <strong>Analytics Ready:</strong> {isReady ? '✅' : '❌'}
          </div>
          <div>
            <strong>Should Track:</strong> {shouldTrack ? '✅' : '❌'}
          </div>
          <div>
            <strong>Traffic Type:</strong> {analyticsDebug.getCurrentTrafficType()}
          </div>
        </div>

        {analyticsDebug.isTestingEnvironment() && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">
              🚫 <strong>Testing Environment Detected:</strong> You&apos;re on localhost:9002 - analytics tracking is disabled.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={handleTestEvent} variant="outline">
            Test Basic Event
          </Button>
          
          <Button onClick={handleTestInteraction} variant="outline">
            Test User Interaction
          </Button>
          
          <Button onClick={handleTestFeature} variant="outline">
            Test Feature Usage
          </Button>

          <Button onClick={handleShowEnvironmentInfo} variant="outline">
            Show Environment Info
          </Button>

          <Button onClick={handleSimulateParameters} variant="outline">
            Test With Parameters
          </Button>
          
          {/* New onboarding event tests */}
          <Button onClick={handleTestContinueJourney} variant="outline" className="bg-blue-50 border-blue-200">
            Test Continue Journey
          </Button>
          
          <Button onClick={handleTestVisionBoard} variant="outline" className="bg-green-50 border-green-200">
            Test Vision Board Goal
          </Button>
          
          <Button onClick={handleTestBudget} variant="outline" className="bg-purple-50 border-purple-200">
            Test Budget Complete
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p><strong>Note:</strong> Check your browser&apos;s developer console to see the analytics events and environment information.</p>
          <p><strong>Traffic Type Parameter:</strong> All events will include a &apos;traffic_type&apos; parameter indicating the current environment.</p>
        </div>
      </CardContent>
    </Card>
  );
} 