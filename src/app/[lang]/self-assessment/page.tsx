"use client";

import React from 'react';
import { Brain } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { useAssessmentState } from './hooks/useAssessmentState';
import { useAssessmentTracking } from './hooks/useAssessmentTracking';
import { QuizSection } from './components/QuizSection';
import { QuizResults } from './components/QuizResults';
import { DeepAssessmentSection } from './components/DeepAssessmentSection';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Separator } from "@/components/ui/separator";

export default function SelfAssessmentPage() {
  const assessmentState = useAssessmentState();
  const { trackAssessmentStart } = useAssessmentTracking();

  // Track page visit on mount
  React.useEffect(() => {
    trackAssessmentStart();
  }, [trackAssessmentStart]);

  const {
    showQuizSection,
    showQuizResult,
    showDeepAssessment,
    quizResult,
    identificationResult,
    resolutionResult,
    error
  } = assessmentState;

  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      {/* Header */}
      <PageHeader />

      {/* Quiz Section */}
      {showQuizSection && (
        <QuizSection assessmentState={assessmentState} />
      )}

      {/* Quiz Results */}
      {showQuizResult && quizResult && (
        <>
          <QuizResults 
            result={quizResult} 
            assessmentState={assessmentState}
          />
          <Separator className="my-8" />
        </>
      )}

      {/* Deep Assessment */}
      {showDeepAssessment && (
        <DeepAssessmentSection assessmentState={assessmentState} />
      )}

      {/* Error Display */}
      {error && <ErrorDisplay error={error} />}

      {/* Assessment Results */}
      {/* Removed duplicate AssessmentResults render to prevent triple display for custom parts */}
    </div>
  );
}

function PageHeader() {
  const { t } = useI18n();
  
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <Brain className="w-8 h-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold">{t('selfAssessment.title')}</h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {t('selfAssessment.subtitle')}
      </p>
    </div>
  );
}