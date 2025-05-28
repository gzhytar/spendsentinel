'use client';

import { useI18n } from '@/contexts/i18n-context';
import { RichTextEditor } from './rich-text-editor';
import { Card } from '@/components/ui/card';
import { MessageCircle, Heart, Shield, Clock, Users, Lightbulb } from 'lucide-react';

interface CuriousDialogueStepProps {
  partName: string;
  content: {
    positiveIntention: string;
    fears: string;
    protectionOrigins: string;
    agePerception: string;
    trustNeeds: string;
    additionalInsights: string;
  };
  onContentChange: (content: Partial<CuriousDialogueStepProps['content']>) => void;
}

export function CuriousDialogueStep({ 
  partName, 
  content, 
  onContentChange 
}: CuriousDialogueStepProps) {
  const { t } = useI18n();

  const questions = [
    {
      key: 'positiveIntention' as keyof typeof content,
      icon: Heart,
      title: t('partsJournal.steps.curiousDialogue.questions.positiveIntention.title'),
      prompt: t('partsJournal.steps.curiousDialogue.questions.positiveIntention.prompt'),
      placeholder: t('partsJournal.steps.curiousDialogue.questions.positiveIntention.placeholder'),
    },
    {
      key: 'fears' as keyof typeof content,
      icon: Shield,
      title: t('partsJournal.steps.curiousDialogue.questions.fears.title'),
      prompt: t('partsJournal.steps.curiousDialogue.questions.fears.prompt'),
      placeholder: t('partsJournal.steps.curiousDialogue.questions.fears.placeholder'),
    },
    {
      key: 'protectionOrigins' as keyof typeof content,
      icon: Clock,
      title: t('partsJournal.steps.curiousDialogue.questions.protectionOrigins.title'),
      prompt: t('partsJournal.steps.curiousDialogue.questions.protectionOrigins.prompt'),
      placeholder: t('partsJournal.steps.curiousDialogue.questions.protectionOrigins.placeholder'),
    },
    {
      key: 'agePerception' as keyof typeof content,
      icon: Users,
      title: t('partsJournal.steps.curiousDialogue.questions.agePerception.title'),
      prompt: t('partsJournal.steps.curiousDialogue.questions.agePerception.prompt'),
      placeholder: t('partsJournal.steps.curiousDialogue.questions.agePerception.placeholder'),
    },
    {
      key: 'trustNeeds' as keyof typeof content,
      icon: Heart,
      title: t('partsJournal.steps.curiousDialogue.questions.trustNeeds.title'),
      prompt: t('partsJournal.steps.curiousDialogue.questions.trustNeeds.prompt'),
      placeholder: t('partsJournal.steps.curiousDialogue.questions.trustNeeds.placeholder'),
    },
    {
      key: 'additionalInsights' as keyof typeof content,
      icon: Lightbulb,
      title: t('partsJournal.steps.curiousDialogue.questions.additionalInsights.title'),
      prompt: t('partsJournal.steps.curiousDialogue.questions.additionalInsights.prompt'),
      placeholder: t('partsJournal.steps.curiousDialogue.questions.additionalInsights.placeholder'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
          <MessageCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            {t('partsJournal.steps.curiousDialogue.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('partsJournal.steps.curiousDialogue.subtitle', { partName })}
          </p>
        </div>
      </div>

      {/* Introduction */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">
            {t('partsJournal.steps.curiousDialogue.introTitle')}
          </h3>
          <p className="text-sm leading-relaxed">
            {t('partsJournal.steps.curiousDialogue.introText', { partName })}
          </p>
          <p className="text-sm leading-relaxed font-medium">
            {t('partsJournal.steps.curiousDialogue.approach')}
          </p>
        </div>
      </Card>

      {/* Questions */}
      <div className="space-y-8">
        {questions.map((question, index) => {
          const IconComponent = question.icon;
          return (
            <div key={question.key} className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mt-1">
                  <IconComponent className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {index + 1}. {question.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {question.prompt}
                  </p>
                  
                  <RichTextEditor
                    content={content[question.key]}
                    onChange={(newContent) => 
                      onContentChange({ [question.key]: newContent })
                    }
                    placeholder={question.placeholder}
                    className="mt-2"
                    showVoiceInput={true}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appreciation Reminder */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <p className="text-sm text-muted-foreground italic text-center">
          {t('partsJournal.steps.curiousDialogue.appreciationReminder', { partName })}
        </p>
      </Card>
    </div>
  );
} 