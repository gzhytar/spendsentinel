"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Brain, Shield, Heart, ArrowRight, Lightbulb, TrendingUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/contexts/i18n-context';

export default function LandingPage() {
  const { t, locale } = useI18n();
  const localePrefix = `/${locale}`;

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('landing.hero.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('landing.hero.subtitle')}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link href={`${localePrefix}/ifs-dialogue`}>
              {t('landing.hero.cta')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Theory Section */}
      <section className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">{t('landing.theory.title')}</CardTitle>
            </div>
            <CardDescription>{t('landing.theory.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('landing.theory.description')}
            </p>
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{t('landing.theory.emotionsMatter.title')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.theory.emotionsMatter.description')}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{t('landing.theory.ifsConnection.title')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.theory.ifsConnection.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Firefighter Types Section */}
      <section className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Flame className="w-8 h-8 text-destructive" />
              <CardTitle className="text-2xl">{t('landing.firefighters.title')}</CardTitle>
            </div>
            <CardDescription>{t('landing.firefighters.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{t('landing.firefighters.spender.title')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.firefighters.spender.description')}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{t('landing.firefighters.hoarder.title')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.firefighters.hoarder.description')}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{t('landing.firefighters.avoider.title')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.firefighters.avoider.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">{t('landing.features.title')}</CardTitle>
            </div>
            <CardDescription>{t('landing.features.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Lightbulb className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('landing.features.expenseHighlighter.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('landing.features.expenseHighlighter.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <TrendingUp className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('landing.features.financialGPS.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('landing.features.financialGPS.description')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MessageSquare className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('landing.features.ifsDialogue.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('landing.features.ifsDialogue.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Heart className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('landing.features.selfCompassion.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('landing.features.selfCompassion.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 