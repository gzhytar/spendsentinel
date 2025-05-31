'use client';

import { useI18n } from '@/contexts/i18n-context';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Heart } from 'lucide-react';
import { SessionSummary } from './session-summary';

interface AppreciateLogStepProps {
  partName: string;
  content: string;
  sessionContent: {
    step1: string;
    step2: string;
    step3: {
      positiveIntention: string;
      fears: string;
      protectionOrigins: string;
      agePerception: string;
      trustNeeds: string;
      additionalInsights: string;
    };
    step4: string;
  };
  onContentChange: (content: string) => void;
}

export function AppreciateLogStep({ 
  partName, 
  content, 
  sessionContent,
  onContentChange 
}: AppreciateLogStepProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            {t('partsJournal.steps.appreciateLog.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('partsJournal.steps.appreciateLog.subtitle', { partName })}
          </p>
        </div>
      </div>

      {/* Session Summary */}
      <SessionSummary sessionContent={sessionContent} />

      {/* Appreciation Section */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          {t('partsJournal.steps.appreciateLog.appreciationTitle')}
        </h3>
        <p className="text-muted-foreground">
          {t('partsJournal.steps.appreciateLog.appreciationPrompt', { partName })}
        </p>
        
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={t('partsJournal.steps.appreciateLog.placeholder', { partName })}
          className="min-h-[150px] resize-none text-base leading-relaxed mt-4"
        />
      </div>
    </div>
  );
} 