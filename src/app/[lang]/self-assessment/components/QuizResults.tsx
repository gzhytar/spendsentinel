import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, RefreshCw, ArrowRight, Calendar, BookOpen, DollarSign } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { FirefighterTypes } from '@/components/common/FirefighterTypes';
import { useAssessmentTracking } from '../hooks/useAssessmentTracking';
import type { AssessmentState } from '../hooks/useAssessmentState';

interface QuizResultsProps {
  result: string;
  assessmentState: AssessmentState;
}

export function QuizResults({ result, assessmentState }: QuizResultsProps) {
  const { t, locale } = useI18n();
  const { trackDailyCheckinStart, trackPartsSessionStart } = useAssessmentTracking();
  
  const { retakeQuiz } = assessmentState;

  const handleDailyCheckinStart = () => {
    trackDailyCheckinStart('self_assessment_quiz_results', {
      quiz_result: result,
    });
    window.location.href = `/${locale}/daily-checkin`;
  };

  const handlePartsJournalStart = () => {
    trackPartsSessionStart();
    window.location.href = `/${locale}/parts-journal?part=${encodeURIComponent(result)}`;
  };

  const handleExpenseTracking = () => {
    window.location.href = `/${locale}/expense-highlighter`;
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <AlertDescription className="text-green-800 dark:text-green-200 flex-1">
            {t('selfAssessment.quiz.interpretationGuide')}
          </AlertDescription>
          <Button 
            onClick={retakeQuiz} 
            variant="outline" 
            size="sm"
            className="self-start sm:self-center shrink-0"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> 
            {t('selfAssessment.quiz.repeatQuizButton')}
          </Button>
        </div>
      </Alert>

      {/* Detailed Firefighter Information */}
      <FirefighterTypes 
        highlightedType={result}
        title={t('selfAssessment.quiz.detailedResult.title')}
        subtitle={t('selfAssessment.quiz.detailedResult.subtitle')}
        showIntroduction={false}
      />

      {/* Next Steps after Quiz */}
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
                onClick={handlePartsJournalStart}
                size="lg"
                className="w-full sm:flex-1"
                variant="outline"
              >
                <BookOpen className="mr-2 h-4 w-4" /> 
                {t('selfAssessment.startPartJournalButton')}
              </Button>

              <Button 
                onClick={handleExpenseTracking}
                size="lg"
                className="w-full sm:flex-1"
                variant="outline"
              >
                <DollarSign className="mr-2 h-4 w-4" /> 
                {t('navigation.myFinancialDecisions')}
              </Button>
            </div>
          </div> 
        </CardContent>
      </Card>
    </div>
  );
} 