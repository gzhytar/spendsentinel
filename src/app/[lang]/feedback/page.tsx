"use client";

import React from 'react';
import Script from 'next/script';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/contexts/i18n-context';
import Link from 'next/link';

export default function FeedbackPage() {
  const { t, locale } = useI18n();

  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      {/* Header */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('feedback.title')}</h1>
          <p className="text-muted-foreground">
            {t('feedback.subtitle')}
          </p>
        </div>
        <div>
          <Link href={`/${locale}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToOverview')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Feedback Form Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">{t('feedback.card.title')}</CardTitle>
              <CardDescription className="mt-2">
                {t('feedback.card.description')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 p-6 rounded-lg">
            {/* Introduction text */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{t('feedback.form.introTitle')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('feedback.form.introText')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>{t('feedback.form.helpPoint1')}</li>
                <li>{t('feedback.form.helpPoint2')}</li>
                <li>{t('feedback.form.helpPoint3')}</li>
              </ul>
            </div>

            {/* Tally.so Embed Form */}
            <div className="min-h-[600px]">
                <iframe 
                    data-tally-src="https://tally.so/embed/wbE6WZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
                    width="100%" 
                    height="600" 
                    title={t('feedback.form.title')}
                    className="rounded-lg border-0"
                />
            </div>

            {/* Footer note */}
            <div className="mt-6 text-sm text-muted-foreground">
              <p>{t('feedback.form.privacyNote')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

    {/* Additional Information Card
      <Card className="shadow-lg max-w-3xl">
        <CardHeader>
          <CardTitle className="text-xl">{t('feedback.additionalInfo.title')}</CardTitle>
          <CardDescription>
            {t('feedback.additionalInfo.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t('feedback.additionalInfo.bugs.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('feedback.additionalInfo.bugs.description')}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t('feedback.additionalInfo.features.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('feedback.additionalInfo.features.description')}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t('feedback.additionalInfo.experience.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('feedback.additionalInfo.experience.description')}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t('feedback.additionalInfo.general.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('feedback.additionalInfo.general.description')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    */}

      {/* Tally.so Script */}
      <Script
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          // @ts-ignore - Tally is loaded from external script
          if (typeof window !== 'undefined' && window.Tally) {
            // @ts-ignore
            window.Tally.loadEmbeds();
          }
        }}
      />
    </div>
  );
} 