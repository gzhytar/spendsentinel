import { useI18n } from '@/contexts/i18n-context';
import { FirefighterTypes } from '@/components/common/FirefighterTypes';
import type { IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';
import type { IFSPartResolutionOutput } from '@/ai/flows/ifs-part-resolution';
import type { AssessmentState } from '../hooks/useAssessmentState';
import { getAllFirefighterTypeIds, getFirefighterTypeId } from '@/lib/assessment-utils';
import Image from 'next/image';

interface AssessmentResultsProps {
  partName: string; // The part name (from quiz or deep assessment)
  identificationResult?: IdentifyIFSPartOutput | null;
  resolutionResult?: IFSPartResolutionOutput | null;
  assessmentState?: AssessmentState;
}

export function AssessmentResults({
  partName,
  identificationResult,
  resolutionResult,
  assessmentState
}: AssessmentResultsProps) {
  const { t } = useI18n();
  const knownTypeIds = getAllFirefighterTypeIds();
  // Try to map the part name to a known type id
  const typeId = getFirefighterTypeId(partName, t);
  const isKnownType = knownTypeIds.includes(typeId as any);
  console.log('isKnownType', isKnownType);
  console.log('typeId', typeId);
  console.log('partName', partName);

  if (isKnownType) {
    // Use FirefighterTypes for known types
    return (
      <FirefighterTypes
        highlightedType={typeId}
        title={t('selfAssessment.quiz.detailedResult.title')}
        subtitle={t('selfAssessment.quiz.detailedResult.subtitle')}
        showIntroduction={false}
      />
    );
  }

  // Fallback for custom/unknown part
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-4 rounded-md overflow-hidden border bg-muted">
          {/* Placeholder for custom part image */}
          <Image src="/images/custom.jpg" alt="Custom part" fill className="object-contain" />
        </div>
        <h3 className="text-xl font-semibold text-center">{partName}</h3>
        {identificationResult && (
          <div className="mt-2 space-y-2 text-center">
            <p className="text-muted-foreground">{identificationResult.identifiedPart.role}</p>
            <p className="text-muted-foreground">{identificationResult.identifiedPart.burden}</p>
            <p className="text-muted-foreground">{identificationResult.identifiedPart.concern}</p>
            <p className="text-primary font-medium mt-2">{identificationResult.suggestedEngagement}</p>
          </div>
        )}
      </div>
    </div>
  );
} 