'use client';

import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { BookOpen, Heart, Shield, Clock, Users, Sparkles } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface SessionSummaryProps {
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
}

interface InsightConfig {
  key: string;
  contentPath: string;
  translationKey: string;
  icon: LucideIcon;
  iconColor: string;
  labelColor: string;
}

interface InsightItemProps {
  content: string;
  translationKey: string;
  icon: LucideIcon;
  iconColor: string;
  labelColor: string;
}

// Utility function for text truncation
const truncateText = (text: string, maxLength: number = 120): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Utility function to get nested content from session
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getContentByPath = (obj: any, path: string): string => {
  const result = path.split('.').reduce((current, key) => current?.[key] || '', obj);
  return typeof result === 'string' ? result : '';
};

// Configuration for all insights - following Open/Closed Principle
const INSIGHT_CONFIGS: InsightConfig[] = [
  {
    key: 'safeSpace',
    contentPath: 'step1',
    translationKey: 'partsJournal.steps.appreciateLog.insights.safeSpace',
    icon: Heart,
    iconColor: 'text-primary',
    labelColor: 'text-primary'
  },
  {
    key: 'awareness',
    contentPath: 'step2',
    translationKey: 'partsJournal.steps.appreciateLog.insights.awareness',
    icon: BookOpen,
    iconColor: 'text-primary',
    labelColor: 'text-primary'
  },
  {
    key: 'positiveIntention',
    contentPath: 'step3.positiveIntention',
    translationKey: 'partsJournal.steps.appreciateLog.positiveIntention',
    icon: Heart,
    iconColor: 'text-green-600',
    labelColor: 'text-green-700'
  },
  {
    key: 'fears',
    contentPath: 'step3.fears',
    translationKey: 'partsJournal.steps.curiousDialogue.questions.fears.title',
    icon: Shield,
    iconColor: 'text-amber-600',
    labelColor: 'text-amber-700'
  },
  {
    key: 'protectionOrigins',
    contentPath: 'step3.protectionOrigins',
    translationKey: 'partsJournal.steps.curiousDialogue.questions.protectionOrigins.title',
    icon: Clock,
    iconColor: 'text-blue-600',
    labelColor: 'text-blue-700'
  },
  {
    key: 'agePerception',
    contentPath: 'step3.agePerception',
    translationKey: 'partsJournal.steps.curiousDialogue.questions.agePerception.title',
    icon: Users,
    iconColor: 'text-purple-600',
    labelColor: 'text-purple-700'
  },
  {
    key: 'trustNeeds',
    contentPath: 'step3.trustNeeds',
    translationKey: 'partsJournal.steps.appreciateLog.trustNeeds',
    icon: Heart,
    iconColor: 'text-rose-600',
    labelColor: 'text-rose-700'
  },
  {
    key: 'additionalInsights',
    contentPath: 'step3.additionalInsights',
    translationKey: 'partsJournal.steps.curiousDialogue.questions.additionalInsights.title',
    icon: Sparkles,
    iconColor: 'text-indigo-600',
    labelColor: 'text-indigo-700'
  }
];

// Single Responsibility: Component for individual insight item
function InsightItem({ content, translationKey, icon: Icon, iconColor, labelColor }: InsightItemProps) {
  const { t } = useI18n();
  
  if (!content?.trim()) return null;

  return (
    <div className="flex items-start gap-3">
      <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
      <div>
        <span className={`font-medium ${labelColor}`}>{t(translationKey)}: </span>
        <span className="text-muted-foreground">
          {truncateText(content)}
        </span>
      </div>
    </div>
  );
}

// Main component following Single Responsibility Principle
export function SessionSummary({ sessionContent }: SessionSummaryProps) {
  const { t } = useI18n();

  // Filter out empty insights to avoid rendering empty sections
  const visibleInsights = INSIGHT_CONFIGS.filter(config => {
    const content = getContentByPath(sessionContent, config.contentPath);
    return content?.trim();
  });

  return (
    <Card className="p-6 bg-primary/5 border-primary/20">
      <h3 className="font-semibold flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        {t('partsJournal.steps.appreciateLog.sessionSummary')}
      </h3>
      
      <div className="space-y-4 text-sm">
        {visibleInsights.map(config => (
          <InsightItem
            key={config.key}
            content={getContentByPath(sessionContent, config.contentPath)}
            translationKey={config.translationKey}
            icon={config.icon}
            iconColor={config.iconColor}
            labelColor={config.labelColor}
          />
        ))}
      </div>
    </Card>
  );
} 