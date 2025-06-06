import { useI18n } from '@/contexts/i18n-context';
import type { AssessmentState } from '../hooks/useAssessmentState';

interface DeepAssessmentSectionProps {
  assessmentState: AssessmentState;
}

export function DeepAssessmentSection({ assessmentState }: DeepAssessmentSectionProps) {
  const { t } = useI18n();
  
  return (
    <div className="text-center space-y-2 mb-6">
      <h2 className="text-2xl font-semibold">{t('selfAssessment.deepAssessment.title')}</h2>
      <p className="text-muted-foreground">{t('selfAssessment.deepAssessment.description')}</p>
      {/* TODO: Implement deep assessment form */}
    </div>
  );
} 