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

  // Helper to render prominent examples as a list
  const renderList = (items: string[] | undefined) =>
    items && items.length > 0 ? (
      <ul className="list-disc list-inside space-y-1 text-left mx-auto max-w-md">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    ) : null;

  // Render extended details for any part (custom or known)
  const renderExtendedDetails = (identifiedPart: IdentifyIFSPartOutput['identifiedPart']) => (
    <div className="space-y-4 mt-6">
      {identifiedPart.description && (
        <div>
          <h4 className="font-semibold text-lg mb-1">{t('selfAssessment.result.description') || 'Description'}</h4>
          <p className="text-muted-foreground text-base">{identifiedPart.description}</p>
        </div>
      )}
      {identifiedPart.behaviors && identifiedPart.behaviors.length > 0 && (
        <div>
          <h4 className="font-semibold text-lg mb-1">{t('selfAssessment.result.behaviors') || 'Behaviors'}</h4>
          {renderList(identifiedPart.behaviors)}
        </div>
      )}
      {identifiedPart.triggers && identifiedPart.triggers.length > 0 && (
        <div>
          <h4 className="font-semibold text-lg mb-1">{t('selfAssessment.result.triggers') || 'Triggers'}</h4>
          {renderList(identifiedPart.triggers)}
        </div>
      )}
      {identifiedPart.emotions && identifiedPart.emotions.length > 0 && (
        <div>
          <h4 className="font-semibold text-lg mb-1">{t('selfAssessment.result.emotions') || 'Emotions over time'}</h4>
          {renderList(identifiedPart.emotions)}
        </div>
      )}
      {identifiedPart.innerDialogue && identifiedPart.innerDialogue.length > 0 && (
        <div>
          <h4 className="font-semibold text-lg mb-1">{t('selfAssessment.result.innerDialogue') || 'Inner Dialogue'}</h4>
          {renderList(identifiedPart.innerDialogue)}
        </div>
      )}
      {identifiedPart.digitalFootprints && identifiedPart.digitalFootprints.length > 0 && (
        <div>
          <h4 className="font-semibold text-lg mb-1">{t('selfAssessment.result.digitalFootprints') || 'Digital Footprints'}</h4>
          {renderList(identifiedPart.digitalFootprints)}
        </div>
      )}
    </div>
  );

    return (
      <div className="space-y-8">
        <FirefighterTypes
          highlightedType={typeId}
          title={t('selfAssessment.quiz.detailedResult.title')}
          subtitle={t('selfAssessment.quiz.detailedResult.subtitle')}
          showIntroduction={false}
        />
        {/* Optionally show extended details for known types as well */}
        {identificationResult && renderExtendedDetails(identificationResult.identifiedPart)}
      </div>
    );
} 