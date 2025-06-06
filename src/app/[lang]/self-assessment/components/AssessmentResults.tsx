import { useI18n } from '@/contexts/i18n-context';
import type { IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';
import type { IFSPartResolutionOutput } from '@/ai/flows/ifs-part-resolution';
import type { AssessmentState } from '../hooks/useAssessmentState';

interface AssessmentResultsProps {
  identificationResult: IdentifyIFSPartOutput;
  resolutionResult: IFSPartResolutionOutput | null;
  assessmentState: AssessmentState;
}

export function AssessmentResults({ 
  identificationResult, 
  resolutionResult, 
  assessmentState 
}: AssessmentResultsProps) {
  const { t } = useI18n();
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        {t('selfAssessment.result.title').replace('{partName}', identificationResult.identifiedPart.partName)}
      </h3>
      <p>{identificationResult.identifiedPart.role}</p>
      {/* TODO: Implement full assessment results display */}
    </div>
  );
} 