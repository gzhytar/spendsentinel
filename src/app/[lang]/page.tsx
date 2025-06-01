"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Lightbulb, MessageSquare, CalendarCheck } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { FirefighterTypes, ExplorePartsButton, FeatureNavigationButton } from '@/components/common';
import { VersionInfo } from '@/components/ui/version-info';

export default function LandingPage() {
  const { t } = useI18n();

  // Show debug info in development or if URL has debug param
  const showDebugInfo = process.env.NODE_ENV === 'development' || 
    (typeof window !== 'undefined' && window.location.search.includes('debug=true'));

  return (
    <div className="container mx-auto py-8 space-y-12 px-4">
      {/* Version Info (only in debug mode) */}
      {showDebugInfo && (
        <VersionInfo showDebugInfo={true} className="mb-8" />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-12">
            {/* Header Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/15 border border-primary/20 shadow-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse" />
                  <span className="text-sm font-medium text-primary tracking-wide">
                    {t('landing.hero.badge')}
                  </span>
                </div>
                
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
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-medium">
                  {t('landing.hero.socialProof.text')}
                </p>
                
                <div className="inline-flex items-center justify-center gap-6 px-6 py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {t('landing.hero.socialProof.features.free')}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {t('landing.hero.socialProof.features.private')}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span className="text-xs font-medium text-muted-foreground">
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
      <section className="space-y-6 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 md:w-8 md:h-8 text-primary" />
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

      {/* Firefighter Types Section - Now using the new component */}
      <section className="space-y-6 px-4">
        <FirefighterTypes />
      </section>

      {/* Features Section */}
      <section className="space-y-6 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              <CardTitle className="text-xl md:text-2xl">{t('landing.features.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('landing.features.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <MessageSquare className="w-6 h-6 text-primary flex-shrink-0" />
                  <h3 className="font-semibold">{t('landing.features.selfAssessment.title')}</h3>
                </div>
                <p className="text-muted-foreground">
                  {t('landing.features.selfAssessment.description')}
                </p>
                <div className="mt-4">
                  <ExplorePartsButton 
                    fullWidth={true}
                    analyticsSource="landing"
                    analyticsLocation="self_assessment_feature_card"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <CalendarCheck className="w-6 h-6 text-primary flex-shrink-0" />
                  <h3 className="font-semibold">{t('landing.features.dailyCheckIn.title')}</h3>
                </div>
                <p className="text-muted-foreground">
                  {t('landing.features.dailyCheckIn.description')}
                </p>
                <div className="mt-4">
                  <FeatureNavigationButton 
                    href="/daily-checkin"
                    translationKey="landing.features.dailyCheckIn.button"
                    fullWidth={true}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Lightbulb className="w-6 h-6 text-primary flex-shrink-0" />
                  <h3 className="font-semibold">{t('landing.features.myFinancialDecisions.title')}</h3>
                </div>
                <p className="text-muted-foreground">
                  {t('landing.features.myFinancialDecisions.description')}
                </p>
                <div className="mt-4">
                  <FeatureNavigationButton 
                    href="/expense-highlighter"
                    translationKey="landing.features.myFinancialDecisions.button"
                    fullWidth={true}
                  />
                </div>
              </div>


            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 