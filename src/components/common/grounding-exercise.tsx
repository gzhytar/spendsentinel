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
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Main Grounding Breath Exercise */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-center mb-3">
                {t('dailyCheckIn.steps.breathing.title')}
              </h3>
              <div className="text-sm leading-relaxed whitespace-pre-line text-left">
                {t('dailyCheckIn.steps.breathing.instruction')}
              </div>
            </div>
            
            {/* Optional 5-4-3-2-1 grounding technique */}
            <details className="group">
              <summary className="cursor-pointer text-primary hover:text-primary/80 font-medium text-center">
                Alternative: Quick 5-4-3-2-1 Grounding Technique
              </summary>
              <div className="mt-3 space-y-2 text-center">
                <ul className="list-none space-y-2 text-muted-foreground">
                  <li><strong className="text-primary">{t('groundingExercise.steps.see')}</strong></li>
                  <li><strong className="text-primary">{t('groundingExercise.steps.touch')}</strong></li>
                  <li><strong className="text-primary">{t('groundingExercise.steps.hear')}</strong></li>
                  <li><strong className="text-primary">{t('groundingExercise.steps.smell')}</strong></li>
                  <li><strong className="text-primary">{t('groundingExercise.steps.taste')}</strong></li>
                </ul>
                <p className="mt-4">{t('groundingExercise.breathingPrompt')}</p>
              </div>
            </details>
          </div>
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
