'use client';

import { useI18n } from '@/contexts/i18n-context';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, Heart, BookOpen, CheckCircle } from 'lucide-react';

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

  const appreciationText = t('partsJournal.steps.appreciateLog.defaultAppreciation', { partName });
  const initialContent = content || appreciationText;

  // Create session insights summary
  const insights = [
    {
      title: t('partsJournal.steps.appreciateLog.insights.safeSpace'),
      content: sessionContent.step1,
      icon: Heart,
    },
    {
      title: t('partsJournal.steps.appreciateLog.insights.awareness'),
      content: sessionContent.step2,
      icon: BookOpen,
    },
    {
      title: t('partsJournal.steps.appreciateLog.insights.dialogue'),
      content: Object.values(sessionContent.step3).filter(Boolean).join('\n\n'),
      icon: CheckCircle,
    },
  ].filter(insight => insight.content.trim());

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
      {insights.length > 0 && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            {t('partsJournal.steps.appreciateLog.sessionSummary')}
          </h3>
          
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-white/50 rounded-full mt-1">
                    <IconComponent className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {insight.content.substring(0, 150)}
                      {insight.content.length > 150 ? '...' : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

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

      {/* Key Insights from Dialogue */}
      {sessionContent.step3.positiveIntention && (
        <Card className="p-4 bg-accent/5 border-accent/20">
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-accent" />
            {t('partsJournal.steps.appreciateLog.keyInsights')}
          </h4>
          <div className="space-y-3 text-sm">
            {sessionContent.step3.positiveIntention && (
              <div>
                <span className="font-medium">{t('partsJournal.steps.appreciateLog.positiveIntention')}: </span>
                <span className="text-muted-foreground">{sessionContent.step3.positiveIntention.substring(0, 100)}...</span>
              </div>
            )}
            {sessionContent.step3.trustNeeds && (
              <div>
                <span className="font-medium">{t('partsJournal.steps.appreciateLog.trustNeeds')}: </span>
                <span className="text-muted-foreground">{sessionContent.step3.trustNeeds.substring(0, 100)}...</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Completion Message */}
      <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
        <div className="text-center space-y-3">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
          <h3 className="font-semibold text-green-800 dark:text-green-200">
            {t('partsJournal.steps.appreciateLog.completionTitle')}
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            {t('partsJournal.steps.appreciateLog.completionMessage', { partName })}
          </p>
        </div>
      </Card>
    </div>
  );
} 