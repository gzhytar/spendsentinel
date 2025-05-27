'use client';

import { useI18n } from '@/contexts/i18n-context';
import { RichTextEditor } from './rich-text-editor';
import { Card } from '@/components/ui/card';
import { Search, Eye, Brain } from 'lucide-react';

interface FindFocusStepProps {
  partName: string;
  content: string;
  onContentChange: (content: string) => void;
}

export function FindFocusStep({ 
  partName, 
  content, 
  onContentChange 
}: FindFocusStepProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            {t('partsJournal.steps.findFocus.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('partsJournal.steps.findFocus.subtitle', { partName })}
          </p>
        </div>
      </div>

      {/* Guided Questions */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Eye className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {t('partsJournal.steps.findFocus.locationTitle')}
              </h3>
              <p className="text-sm leading-relaxed">
                {t('partsJournal.steps.findFocus.locationPrompt')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Brain className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {t('partsJournal.steps.findFocus.experienceTitle')}
              </h3>
              <p className="text-sm leading-relaxed">
                {t('partsJournal.steps.findFocus.experiencePrompt')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {[
                  t('partsJournal.steps.findFocus.experienceTypes.visual'),
                  t('partsJournal.steps.findFocus.experienceTypes.voice'),
                  t('partsJournal.steps.findFocus.experienceTypes.thoughts'),
                  t('partsJournal.steps.findFocus.experienceTypes.emotions'),
                  t('partsJournal.steps.findFocus.experienceTypes.sensations'),
                  t('partsJournal.steps.findFocus.experienceTypes.other'),
                ].map((type) => (
                  <div key={type} className="text-xs bg-white/50 rounded px-2 py-1 text-center">
                    {type}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Journal Section */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          {t('partsJournal.steps.findFocus.journalTitle')}
        </h3>
        <p className="text-muted-foreground">
          {t('partsJournal.steps.findFocus.journalPrompt')}
        </p>
        
        <RichTextEditor
          content={content}
          onChange={onContentChange}
          placeholder={t('partsJournal.steps.findFocus.placeholder', { partName })}
          className="mt-4"
        />
      </div>

      {/* Encouragement */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <p className="text-sm text-accent-foreground/80 italic text-center">
          {t('partsJournal.steps.findFocus.encouragement')}
        </p>
      </Card>
    </div>
  );
} 