"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePanicMode } from '@/contexts/panic-mode-context';
import { useI18n } from '@/contexts/i18n-context';
import { Zap } from 'lucide-react';

export function GroundingExercise() {
  const { deactivatePanicMode } = usePanicMode();
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center">
          <Zap className="w-12 h-12 text-primary mb-2" />
          <CardTitle className="text-2xl text-center">{t('groundingExercise.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('groundingExercise.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg">{t('groundingExercise.introduction')}</p>
          <ul className="list-none space-y-2 text-muted-foreground">
            <li><strong className="text-primary">{t('groundingExercise.steps.see')}</strong></li>
            <li><strong className="text-primary">{t('groundingExercise.steps.touch')}</strong></li>
            <li><strong className="text-primary">{t('groundingExercise.steps.hear')}</strong></li>
            <li><strong className="text-primary">{t('groundingExercise.steps.smell')}</strong></li>
            <li><strong className="text-primary">{t('groundingExercise.steps.taste')}</strong></li>
          </ul>
          <p className="mt-4">{t('groundingExercise.breathingPrompt')}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={deactivatePanicMode} className="w-full" variant="secondary">
            {t('groundingExercise.continueButton')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
