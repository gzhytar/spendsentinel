"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Brain, Shield, Heart, ArrowRight, Lightbulb, TrendingUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/contexts/i18n-context';
import { FirefighterTypes } from '@/components/common/FirefighterTypes';

export default function LandingPage() {
  const { t, locale } = useI18n();
  const localePrefix = `/${locale}`;

  return (
    <div className="container mx-auto py-8 space-y-12 px-4">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight sm:text-5xl">
          {t('landing.hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          {t('landing.hero.subtitle')}
        </p>
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
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('landing.theory.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <MessageSquare className="w-6 h-6 text-primary flex-shrink-0" />
                    <h3 className="font-semibold">{t('landing.features.ifsDialogue.title')}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {t('landing.features.ifsDialogue.description')}
                  </p>
                  <div className="mt-4">
                    <Button className="w-full sm:w-auto" wrap={true} asChild>
                        <Link href={`${localePrefix}/ifs-dialogue`}>
                          <span>{t('landing.features.ifsDialogue.button')} <ArrowRight className="ml-2 h-4 w-4 inline" /></span>
                        </Link>
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Lightbulb className="w-6 h-6 text-primary flex-shrink-0" />
                    <h3 className="font-semibold">{t('landing.features.expenseHighlighter.title')}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {t('landing.features.expenseHighlighter.description')}
                  </p>
                  <div className="mt-4">
                    <Button className="w-full sm:w-auto" wrap={true} asChild>
                        <Link href={`${localePrefix}/expense-highlighter`}>
                          <span>{t('landing.features.expenseHighlighter.button')} <ArrowRight className="ml-2 h-4 w-4 inline" /></span>
                        </Link>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-primary flex-shrink-0" />
                    <h3 className="font-semibold">{t('landing.features.financialGPS.title')}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {t('landing.features.financialGPS.description')}
                  </p>
                  <div className="mt-4">
                    <Button className="w-full sm:w-auto" wrap={true} asChild>
                        <Link href={`${localePrefix}/financial-gps`}>
                          <span>{t('landing.features.financialGPS.button')} <ArrowRight className="ml-2 h-4 w-4 inline" /></span>
                        </Link>
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Heart className="w-6 h-6 text-primary flex-shrink-0" />
                    <h3 className="font-semibold">{t('landing.features.selfCompassion.title')}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {t('landing.features.selfCompassion.description')}
                  </p>
                  <div className="mt-4">
                    <Button className="w-full sm:w-auto" wrap={true} asChild>
                        <Link href={`${localePrefix}/self-compassion`}>
                          <span>{t('landing.features.selfCompassion.button')} <ArrowRight className="ml-2 h-4 w-4 inline" /></span>
                        </Link>
                    </Button>
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