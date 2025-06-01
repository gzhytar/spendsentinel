"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/contexts/i18n-context';
import { useAnalyticsContext } from '@/contexts/analytics-context';
import { trackOnboardingStep, initializeOnboardingSession } from '@/lib/analytics-utils';

interface ExplorePartsButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
  analyticsSource?: string;
  analyticsLocation?: string;
  customText?: string;
}

export function ExplorePartsButton({ 
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  fullWidth = false,
  analyticsSource = 'landing',
  analyticsLocation = 'self_assessment_feature_card',
  customText
}: ExplorePartsButtonProps) {
  const { t, locale } = useI18n();
  const { trackEvent } = useAnalyticsContext();
  const localePrefix = `/${locale}`;

  const handleExplorePartsClick = () => {
    // Initialize onboarding session and track first step
    initializeOnboardingSession();
    const eventData = trackOnboardingStep('LANDING_EXPLORE_CLICK', {
      source_page: analyticsSource,
      button_location: analyticsLocation,
    });
    trackEvent(eventData.event_name, eventData);
  };

  const buttonText = customText || t('landing.features.selfAssessment.button');
  const buttonClasses = `${fullWidth ? 'w-full sm:w-auto' : ''} ${className}`;

  return (
    <Button 
      className={buttonClasses} 
      variant={variant}
      size={size}
      wrap={true} 
      asChild
    >
      <Link href={`${localePrefix}/self-assessment`} onClick={handleExplorePartsClick}>
        <span>
          {buttonText}
          {showIcon && <ArrowRight className="ml-2 h-4 w-4 inline" />}
        </span>
      </Link>
    </Button>
  );
} 