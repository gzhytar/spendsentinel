"use client";

import React, { useEffect, useState } from 'react';
import { Brain, CheckCircle, RefreshCw, RotateCcw, ArrowRight, Calendar, BookOpen, DollarSign, History } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { useAssessmentState } from './hooks/useAssessmentState';
import { useAssessmentTracking } from './hooks/useAssessmentTracking';
import { QuizSection } from './components/QuizSection';
import { DeepAssessmentSection } from './components/DeepAssessmentSection';
import { ErrorDisplay } from './components/ErrorDisplay';
import { UniversalPartsDisplay } from '@/components/common/firefighter-types';
import { unifiedResultToUniversalPart } from '@/components/common/firefighter-types/adapters';
import { createFirefighterTypeData } from '@/lib/assessment-utils';
import { AssessmentStorageService } from './services/AssessmentStorageService';
import { PartsJournalTimeline } from '@/components/parts-journal/parts-journal-timeline';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UniversalPart } from '@/lib/FireFighterTypes';

export default function SelfAssessmentPage() {
  const { t, locale } = useI18n();
  const assessmentState = useAssessmentState();
  const { trackAssessmentStart, trackDailyCheckinStart, trackPartsSessionStart } = useAssessmentTracking();
  const [partsDisplayData, setPartsDisplayData] = useState<any>(null);
  const [selectedPart, setSelectedPart] = useState<UniversalPart | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Track page visit on mount
  useEffect(() => {
    trackAssessmentStart();
  }, [trackAssessmentStart]);

  // Set client-side flag and load data
  useEffect(() => {
    setIsClient(true);
    
    // Get the latest assessment result for parts display
    const getLatestAssessmentResult = () => {
      const storageService = new AssessmentStorageService();
      return storageService.getLatestAssessmentResult(locale);
    };

    // Convert latest result to display data
    const getPartsDisplayData = () => {
      const latestResult = getLatestAssessmentResult();
      if (!latestResult) return null;

      const predefinedTypes = createFirefighterTypeData(t);
      const universalPart = unifiedResultToUniversalPart(latestResult, predefinedTypes);
      
      return {
        part: universalPart,
        type: latestResult.type,
        partName: latestResult.partName
      };
    };

    const displayData = getPartsDisplayData();
    setPartsDisplayData(displayData);
    
    // Set initial selected part
    if (displayData?.part && !selectedPart) {
      setSelectedPart(displayData.part);
    }
  }, [locale, t, assessmentState.showQuizResult, assessmentState.showDeepAssessment, assessmentState.identificationResult, assessmentState.resolutionResult, selectedPart]);

  const shouldShowPartsDisplay = isClient && (assessmentState.showQuizResult || assessmentState.showDeepAssessment) && partsDisplayData;

  const handlePartSelect = (part: UniversalPart) => {
    setSelectedPart(part);
  };

  const handleRetakeQuiz = () => {
    assessmentState.retakeQuiz();
  };

  const handleResetDeepAssessment = () => {
    assessmentState.resetIdentification();
  };

  const handleDailyCheckinStart = () => {
    // Get fresh result from storage
    const storageService = new AssessmentStorageService();
    const latestResult = storageService.getLatestAssessmentResult(locale);
    const result = latestResult?.type === 'quiz' ? latestResult.quizResult : latestResult?.partName;
    
    trackDailyCheckinStart('self_assessment_results', {
      assessment_result: result,
    });
    window.location.href = `/${locale}/daily-checkin`;
  };

  const handlePartsJournalStart = () => {
    // Use the selectedPart title for proper display name, fallback to stored result if needed
    let partName = selectedPart?.title;
    
    if (!partName) {
      // Fallback: Get fresh result from storage
      const storageService = new AssessmentStorageService();
      const latestResult = storageService.getLatestAssessmentResult(locale);
      partName = latestResult?.type === 'quiz' ? latestResult.quizResult : latestResult?.partName;
    }
    
    trackPartsSessionStart();
    window.location.href = `/${locale}/parts-journal${partName ? `?part=${encodeURIComponent(partName)}` : ''}`;
  };

  const handleExpenseTracking = () => {
    window.location.href = `/${locale}/expense-highlighter`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <PageHeader />
      
      {/* Quiz Section */}
      {assessmentState.showQuizSection && (
        <QuizSection assessmentState={assessmentState} />
      )}

      {/* Centralized Parts Display */}
      {shouldShowPartsDisplay && (
        <UniversalPartsDisplay
          customParts={partsDisplayData.type === 'deep-assessment' && partsDisplayData.part ? [partsDisplayData.part] : []}
          highlightedPart={partsDisplayData.part.id}
          title={partsDisplayData.type === 'quiz' 
            ? t('selfAssessment.quiz.detailedResult.title')
            : t('selfAssessment.deepAssessment.results.title')
          }
          subtitle={partsDisplayData.type === 'quiz'
            ? t('selfAssessment.quiz.detailedResult.subtitle') 
            : t('selfAssessment.deepAssessment.results.subtitle')
          }
          showIntroduction={false}
          showOnlyCustom={partsDisplayData.type === 'deep-assessment'}
          showOnlyPredefined={partsDisplayData.type === 'quiz'}
          showCallToAction={false}
          onPartSelect={handlePartSelect}
        />
      )}

      {/* Next Steps - Shown when parts are identified */}
      {shouldShowPartsDisplay && (
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <ArrowRight className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl">{t('selfAssessment.nextSteps.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('selfAssessment.nextSteps.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {/* Primary Action - Daily Check-in */}
              <Button 
                onClick={handleDailyCheckinStart}
                size="lg"
                className="w-full"
                variant="default"
              >
                <Calendar className="mr-2 h-4 w-4" /> 
                {t('selfAssessment.dailyCheckInButton')}
              </Button>

              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button 
                  onClick={handleExpenseTracking}
                  size="lg"
                  className="w-full"
                  variant="outline"
                >
                  <DollarSign className="mr-2 h-4 w-4" /> 
                  {t('navigation.myFinancialDecisions')}
                </Button>
              </div>
            </div> 
          </CardContent>
        </Card>
      )}

      {/* Journal History Section - Show for selected part */}
      {shouldShowPartsDisplay && selectedPart && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <History className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl">{t('partsJournal.journalHistory')}</CardTitle>
            </div>
            <CardDescription>
              {t('selfAssessment.journalHistory.subtitle', { partName: selectedPart.title })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PartsJournalTimeline 
                lang={locale} 
                selectedPartName={selectedPart.title}
              />
              
              {/* Action to start new session with this part */}
              <div className="pt-2">
                <Button 
                  onClick={handlePartsJournalStart}
                  size="lg"
                  className="w-full"
                  variant="default"
                >
                  <BookOpen className="mr-2 h-4 w-4" /> 
                  {t('selfAssessment.startNewSessionButton')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deep Assessment Section */}
      {assessmentState.showDeepAssessment && (
        <DeepAssessmentSection assessmentState={assessmentState} />
      )}

      {/* Error Display */}
      {assessmentState.error && <ErrorDisplay error={assessmentState.error} />}

      {shouldShowPartsDisplay && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <AlertDescription className="text-green-800 dark:text-green-200 flex-1">
              {partsDisplayData.type === 'quiz' 
                ? t('selfAssessment.quiz.interpretationGuide')
                : t('selfAssessment.deepAssessment.success')
              }
            </AlertDescription>
            <Button 
              onClick={partsDisplayData.type === 'quiz' ? handleRetakeQuiz : handleResetDeepAssessment}
              variant="outline" 
              size="sm"
              className="self-start sm:self-center shrink-0"
            >
              {partsDisplayData.type === 'quiz' ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> 
                  {t('selfAssessment.quiz.repeatQuizButton')}
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('selfAssessment.deepAssessment.tryAgainButton')}
                </>
              )}
            </Button>
          </div>
        </Alert>
      )}

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