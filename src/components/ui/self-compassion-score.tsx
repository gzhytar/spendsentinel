'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Lightbulb } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface SelfCompassionScoreProps {
  onScoreSave?: (score: number) => void;
  initialScore?: number;
  showPrompt?: boolean;
  compact?: boolean;
  showActions?: boolean;
  className?: string;
}

export function SelfCompassionScore({ 
  onScoreSave, 
  initialScore = 5, 
  showPrompt = true,
  compact = false,
  showActions = true,
  className = ""
}: SelfCompassionScoreProps) {
  const { t } = useI18n();
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [score, setScore] = useState<number>(initialScore);
  const [showPromptState, setShowPromptState] = useState(showPrompt);

  useEffect(() => {
    if (showPromptState && showPrompt) {
      const prompts = t<string[]>('selfCompassion.prompts');
      const randomIndex = Math.floor(Math.random() * prompts.length);
      setCurrentPrompt(prompts[randomIndex]);
    }
  }, [showPromptState, showPrompt, t]);

  const handleSaveScore = () => {
    onScoreSave?.(score);
    if (showPrompt) {
      setShowPromptState(false); // Hide prompt after saving score
    }
  };

  const handleNewPrompt = () => {
    setShowPromptState(true);
  };

  const handleScoreChange = (value: number[]) => {
    setScore(value[0]);
    // If showActions is false, immediately call the callback to save the score
    if (!showActions) {
      onScoreSave?.(value[0]);
    }
  };

  if (compact) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showPrompt && showPromptState && currentPrompt && (
          <div className="p-4 bg-primary/10 rounded-lg flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <p className="text-sm text-primary-foreground leading-relaxed">{currentPrompt}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <label htmlFor="compassion-score" className="block text-sm font-medium text-muted-foreground">
            {t('selfCompassion.calmScore.label')}
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Slider
                id="compassion-score"
                min={1}
                max={10}
                step={1}
                value={[score]}
                onValueChange={handleScoreChange}
                className="flex-grow"
              />
              <span className="font-semibold text-primary w-8 text-center">{score}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{t('dailyCheckIn.steps.selfCompassion.veryCritical')}</span>
              <span>{t('dailyCheckIn.steps.selfCompassion.veryCompassionate')}</span>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {showPrompt && showPromptState && currentPrompt ? (
              <Button onClick={handleSaveScore} size="sm" className="flex-1">
                {t('selfCompassion.calmScore.saveButton')}
              </Button>
            ) : showPrompt ? (
              <Button onClick={handleNewPrompt} size="sm" variant="outline" className="flex-1">
                {t('selfCompassion.calmScore.newPromptButton')}
              </Button>
            ) : (
              <Button onClick={handleSaveScore} size="sm" className="flex-1">
                Save Score
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`shadow-lg ${className}`}>
      {showPrompt && showPromptState && currentPrompt && (
        <CardContent className="pt-6">
          <div className="p-6 bg-primary/10 rounded-lg flex items-start space-x-3">
            <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <p className="text-lg text-primary-foreground leading-relaxed">{currentPrompt}</p>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        {showActions && showPrompt && showPromptState && currentPrompt ? (
          <>
            <div className="flex-1 w-full sm:w-auto">
              <label htmlFor="compassion-score" className="block text-sm font-medium text-muted-foreground mb-2">
                {t('selfCompassion.calmScore.label')}
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Slider
                    id="compassion-score"
                    min={1}
                    max={10}
                    step={1}
                    value={[score]}
                    onValueChange={handleScoreChange}
                    className="flex-grow"
                  />
                  <span className="font-semibold text-primary w-8 text-center">{score}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>{t('dailyCheckIn.steps.selfCompassion.veryCritical')}</span>
                  <span>{t('dailyCheckIn.steps.selfCompassion.veryCompassionate')}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleSaveScore} size="lg">
              {t('selfCompassion.calmScore.saveButton')}
            </Button>
          </>
        ) : showActions && showPrompt ? (
          <Button onClick={handleNewPrompt} size="lg" variant="outline" className="w-full">
            {t('selfCompassion.calmScore.newPromptButton')}
          </Button>
        ) : showActions ? (
          <>
            <div className="flex-1 w-full sm:w-auto">
              <label htmlFor="compassion-score" className="block text-sm font-medium text-muted-foreground mb-2">
                {t('selfCompassion.calmScore.label')}
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Slider
                    id="compassion-score"
                    min={1}
                    max={10}
                    step={1}
                    value={[score]}
                    onValueChange={handleScoreChange}
                    className="flex-grow"
                  />
                  <span className="font-semibold text-primary w-8 text-center">{score}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>{t('dailyCheckIn.steps.selfCompassion.veryCritical')}</span>
                  <span>{t('dailyCheckIn.steps.selfCompassion.veryCompassionate')}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleSaveScore} size="lg">
              Save Score
            </Button>
          </>
        ) : (
          <div className="flex-1 w-full sm:w-auto">
            <label htmlFor="compassion-score" className="block text-sm font-medium text-muted-foreground mb-2">
              {t('selfCompassion.calmScore.label')}
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Slider
                  id="compassion-score"
                  min={1}
                  max={10}
                  step={1}
                  value={[score]}
                  onValueChange={handleScoreChange}
                  className="flex-grow"
                />
                <span className="font-semibold text-primary w-8 text-center">{score}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>{t('dailyCheckIn.steps.selfCompassion.veryCritical')}</span>
                <span>{t('dailyCheckIn.steps.selfCompassion.veryCompassionate')}</span>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 