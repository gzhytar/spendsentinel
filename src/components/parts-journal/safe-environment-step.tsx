'use client';

import { useI18n } from '@/contexts/i18n-context';
import { RichTextEditor } from './rich-text-editor';
import { Card } from '@/components/ui/card';
import { Leaf, Heart } from 'lucide-react';

interface SafeEnvironmentStepProps {
  partName: string;
  content: string;
  onContentChange: (content: string) => void;
}

export function SafeEnvironmentStep({ 
  partName, 
  content, 
  onContentChange 
}: SafeEnvironmentStepProps) {
  const { t } = useI18n();

  const affirmationText = t('partsJournal.steps.safeEnvironment.affirmation');
  
  // Initialize content with affirmation if empty
  const initialContent = content || affirmationText;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
          <Leaf className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            {t('partsJournal.steps.safeEnvironment.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('partsJournal.steps.safeEnvironment.subtitle', { partName })}
          </p>
        </div>
      </div>

      {/* Breathing Instructions */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {t('partsJournal.steps.safeEnvironment.breathingTitle')}
            </h3>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>{t('partsJournal.steps.safeEnvironment.breathingStep1')}</p>
              <p>{t('partsJournal.steps.safeEnvironment.breathingStep2')}</p>
              <p>{t('partsJournal.steps.safeEnvironment.breathingStep3')}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Affirmation and Journal */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          {t('partsJournal.steps.safeEnvironment.journalTitle')}
        </h3>
        <p className="text-muted-foreground">
          {t('partsJournal.steps.safeEnvironment.journalPrompt')}
        </p>
        
        <RichTextEditor
          content={initialContent}
          onChange={onContentChange}
          placeholder={t('partsJournal.steps.safeEnvironment.placeholder')}
          className="mt-4"
        />
      </div>

      {/* Gentle Reminder */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <p className="text-sm text-accent-foreground/80 italic text-center">
          {t('partsJournal.steps.safeEnvironment.reminder')}
        </p>
      </Card>
    </div>
  );
} 