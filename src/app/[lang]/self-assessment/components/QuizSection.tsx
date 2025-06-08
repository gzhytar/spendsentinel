import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { FirefighterQuiz } from '@/components/common/FirefighterQuiz';
import { useAssessmentTracking } from '../hooks/useAssessmentTracking';
import type { AssessmentState } from '../hooks/useAssessmentState';

interface QuizSectionProps {
  assessmentState: AssessmentState;
}

export function QuizSection({ assessmentState }: QuizSectionProps) {
  const { t } = useI18n();
  const { trackQuizComplete } = useAssessmentTracking();
  
  const {
    quizStarted,
    startQuiz,
    cancelQuiz,
    completeQuiz,
    suggestDeepAssessment,
    showQuizResult,
    quizResult,
  } = assessmentState;

  const handleQuizComplete = (result: string) => {
    trackQuizComplete(result);
    completeQuiz(result);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Info className="w-6 h-6 text-yellow-600" />
          <CardTitle className="text-xl md:text-2xl">
            {t('selfAssessment.quiz.title')}
          </CardTitle>
        </div>
        <CardDescription>
          {t('selfAssessment.quiz.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!quizStarted ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {t('selfAssessment.quiz.instruction')}
            </p>
            <Button 
              onClick={startQuiz}
              size="lg"
              className="w-full sm:w-auto"
            >
              {t('selfAssessment.quiz.startButton')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <FirefighterQuiz
            onComplete={handleQuizComplete}
            onCancel={cancelQuiz}
            onSuggestDeepAssessment={suggestDeepAssessment}
          />
        )}
      </CardContent>
    </Card>
  );
} 