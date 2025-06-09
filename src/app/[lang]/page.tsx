"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Brain, Shield, Lightbulb, MessageSquare, CalendarCheck, Coffee, LucideIcon } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { ExplorePartsButton, FeatureNavigationButton, BuyMeCoffeeButton } from '@/components/common';
import { UniversalPartsDisplay } from '@/components/common/firefighter-types';
import { VersionInfo } from '@/components/ui/version-info';
import { useDebugMode } from '@/hooks/use-debug-mode';
import { useMonetizationVisibility } from '@/hooks/use-monetization-visibility';
import { AssessmentStorageService } from '@/app/[lang]/self-assessment/services/AssessmentStorageService';
import { unifiedResultToUniversalPart } from '@/components/common/firefighter-types/adapters';
import { createFirefighterTypeData } from '@/lib/assessment-utils';
import { UniversalPart } from '@/lib/FireFighterTypes';

// Feature card interfaces and types
/**
 * Configuration interface for feature cards
 * @interface FeatureConfig
 * @property {string} id - Unique identifier for the feature (used for keys and ARIA labels)
 * @property {LucideIcon} icon - Lucide icon component to display
 * @property {string} titleKey - Translation key for the feature title
 * @property {string} descriptionKey - Translation key for the feature description
 * @property {React.ReactNode} buttonComponent - React component for the feature's CTA button
 */
interface FeatureConfig {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  buttonComponent: React.ReactNode;
}

/**
 * Reusable FeatureCard component with proper accessibility and semantic structure
 * @param {FeatureConfig} props - Feature configuration object
 * @returns {React.ReactElement} Accessible feature card with article/header/footer structure
 */
const FeatureCard = ({ id, icon: Icon, titleKey, descriptionKey, buttonComponent }: FeatureConfig) => {
  const { t } = useI18n();
  
  return (
    <article className="space-y-4" role="article" aria-labelledby={`feature-${id}-title`}>
      <header>
        <div className="flex items-center space-x-3 mb-2">
          <Icon 
            className="w-6 h-6 text-primary flex-shrink-0" 
            aria-hidden="true" 
          />
          <h3 
            id={`feature-${id}-title`} 
            className="font-semibold"
          >
            {t(titleKey)}
          </h3>
        </div>
        <p className="text-muted-foreground">
          {t(descriptionKey)}
        </p>
      </header>
      <footer className="mt-4">
        {buttonComponent}
      </footer>
    </article>
  );
};

export default function LandingPage() {
  const { t, locale } = useI18n();
  const [customParts, setCustomParts] = useState<UniversalPart[]>([]);
  const [isLoadingCustomParts, setIsLoadingCustomParts] = useState(true);

  // Use custom hook for safe debug mode detection (handles both dev environment and URL params)
  const showDebugInfo = useDebugMode();
  const { showMissionMention } = useMonetizationVisibility();

  // Load custom parts from assessments
  useEffect(() => {
    const loadCustomParts = () => {
      try {
        const storageService = new AssessmentStorageService();
        const assessmentResults = storageService.getAllAssessmentResults(locale);
        
        if (assessmentResults.length > 0) {
          // Get predefined types for quiz result conversion
          const predefinedTypes = createFirefighterTypeData(t);
          
          // Convert assessment results to UniversalPart format
          const parts: UniversalPart[] = [];
          
          assessmentResults.forEach(result => {
            const universalPart = unifiedResultToUniversalPart(result, predefinedTypes);
            if (universalPart) {
              parts.push(universalPart);
            }
          });
          
          setCustomParts(parts);
        } else {
          // No results found, clear custom parts
          setCustomParts([]);
        }
      } catch (error) {
        console.error('Error loading custom parts:', error);
        setCustomParts([]);
      } finally {
        setIsLoadingCustomParts(false);
      }
    };

    // Only load if we're in the browser
    if (typeof window !== 'undefined') {
      loadCustomParts();
      
      // Listen for storage changes to refresh custom parts
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'unifiedAssessmentResults') {
          setIsLoadingCustomParts(true);
          loadCustomParts();
        }
      };
      
      // Listen for custom refresh events (for same-tab updates)
      const handleCustomRefresh = () => {
        setIsLoadingCustomParts(true);
        loadCustomParts();
      };
      
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('assessmentResultsCleared', handleCustomRefresh);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('assessmentResultsCleared', handleCustomRefresh);
      };
    } else {
      setIsLoadingCustomParts(false);
    }
  }, [locale, t]);

  // Features configuration
  const features: FeatureConfig[] = [
    {
      id: 'self-assessment',
      icon: MessageSquare,
      titleKey: 'landing.features.selfAssessment.title',
      descriptionKey: 'landing.features.selfAssessment.description',
      buttonComponent: (
        <ExplorePartsButton 
          fullWidth={true}
          analyticsSource="landing"
          analyticsLocation="self_assessment_feature_card"
        />
      )
    },
    {
      id: 'daily-checkin',
      icon: CalendarCheck,
      titleKey: 'landing.features.myJourney.title',
      descriptionKey: 'landing.features.myJourney.description',
      buttonComponent: (
        <FeatureNavigationButton 
          href="/daily-checkin"
          translationKey="landing.features.myJourney.button"
          fullWidth={true}
        />
      )
    },
    {
      id: 'financial-decisions',
      icon: Lightbulb,
      titleKey: 'landing.features.myFinances.title',
      descriptionKey: 'landing.features.myFinances.description',
      buttonComponent: (
        <FeatureNavigationButton 
          href="/expense-highlighter"
          translationKey="landing.features.myFinances.button"
          fullWidth={true}
        />
      )
    }
  ];

  // Determine if we should show only predefined parts or include custom parts
  const shouldShowOnlyPredefined = customParts.length === 0;
  
  // Use appropriate titles based on whether custom parts exist
  const partsDisplayTitle = customParts.length > 0 
    ? t('selfAssessment.title') // "My Parts Discovery" when custom parts exist
    : t('landing.firefighters.title'); // "Types of Financial Firefighters" for predefined only
    
  const partsDisplaySubtitle = customParts.length > 0
    ? t('selfAssessment.subtitle') // "Discover your financial parts and learn to work with them compassionately"
    : t('landing.firefighters.subtitle'); // "Recognize your patterns and understand their purpose"

  return (
    <div className="container mx-auto py-8 space-y-12 px-4">
      {/* Version Info (only in debug mode) */}
      {showDebugInfo && (
        <VersionInfo showDebugInfo className="mb-8" />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="text-center space-y-12">
            {/* Header Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                    {t('landing.hero.title')}
                  </span>
                </h1>
              </div>
              
              <div className="space-y-6 max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  {t('landing.hero.subtitle')}
                </p>
                
                <p className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mx-auto">
                  {t('landing.hero.description')}
                </p>
              </div>
              
              {/* Feature Badges */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                <div className="flex items-center px-4 py-2 bg-card border border-border rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm font-medium text-card-foreground">
                    {t('landing.hero.features.evidenceBased')}
                  </span>
                </div>
                <div className="flex items-center px-4 py-2 bg-card border border-border rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  <span className="text-sm font-medium text-card-foreground">
                    {t('landing.hero.features.traumaInformed')}
                  </span>
                </div>
                <div className="flex items-center px-4 py-2 bg-card border border-border rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                  <span className="text-sm font-medium text-card-foreground">
                    {t('landing.hero.features.selfCompassion')}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
                <ExplorePartsButton 
                  variant="default"
                  size="lg"
                  analyticsSource="landing"
                  analyticsLocation="hero_primary_cta"
                  customText={t('landing.hero.cta.primary')}
                  className="flex-1 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                />
                <FeatureNavigationButton 
                  href="/expense-highlighter"
                  translationKey="landing.hero.cta.secondary"
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-card hover:bg-accent transition-colors duration-300"
                />
              </div>
              
              {/* Social Proof */}
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium px-4">
                  {t('landing.hero.socialProof.text')}
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6 px-3 sm:px-6 py-2 sm:py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full max-w-sm sm:max-w-none mx-auto">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {t('landing.hero.socialProof.features.free')}
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-3 sm:h-4 bg-border" />
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {t('landing.hero.socialProof.features.private')}
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-3 sm:h-4 bg-border" />
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {t('landing.hero.socialProof.features.noSignup')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theory Section */}
      <section className="space-y-4 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Brain className="w-24 h-24 md:w-12 md:h-12 text-primary" />
              <CardTitle className="text-xl md:text-2xl">{t('landing.theory.title')}</CardTitle>
            </div>
            <CardDescription>{t('landing.theory.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {t('landing.theory.description')}
              </p>
              <p className="text-muted-foreground">
                {t('landing.theory.benefitsDescription')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{t('landing.theory.emotionsMatter.title')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.theory.emotionsMatter.description')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('landing.theory.emotionsMatter.researchNote')}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{t('landing.theory.ifsConnection.title')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.theory.ifsConnection.description')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('landing.theory.ifsConnection.therapyNote')}
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg text-center">{t('landing.theory.cta.title')}</h3>
              <p className="text-muted-foreground text-center">
                {t('landing.theory.cta.description')}
              </p>
              <div className="flex justify-center">
                <ExplorePartsButton 
                  variant="default"
                  size="lg"
                  analyticsSource="landing"
                  analyticsLocation="theory_section_cta"
                  customText={t('landing.theory.cta.buttonText')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Firefighter Types Section - Now showing custom parts when available */}
      <section className="space-y-6 px-4">
        {!isLoadingCustomParts && (
          <UniversalPartsDisplay 
            customParts={customParts}
            showOnlyPredefined={shouldShowOnlyPredefined}
            title={partsDisplayTitle}
            subtitle={partsDisplaySubtitle}
          />
        )}
      </section>

      {/* Features Section */}
      <section className="space-y-6 px-4" aria-labelledby="features-heading">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-primary" aria-hidden="true" />
              <CardTitle id="features-heading" className="text-xl md:text-2xl">
                {t('landing.features.title')}
              </CardTitle>
            </div>
            <CardDescription>
              {t('landing.features.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              role="region" 
              aria-labelledby="features-heading"
            >
              {features.map((feature) => (
                <FeatureCard key={feature.id} {...feature} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Support Mission Section */}
      { showMissionMention && <section className="px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Coffee className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">{t('support.mission.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('support.mission.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">{t('support.mission.sustainabilityTitle')}</h3>
              <p className="text-muted-foreground">
                {t('support.mission.sustainabilityMessage')}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <BuyMeCoffeeButton 
              placement="card"
              variant="outline"
              size="default"
              className="flex items-center gap-2 w-full sm:w-auto"
            />
          </CardFooter>
        </Card>
      </section>
      }
    </div>
  );
} 