import { useMemo } from 'react';
import { createFirefighterTypeData, FirefighterTypeId } from '@/lib/assessment-utils';

export interface FirefighterType {
  id: FirefighterTypeId;
  title: string;
  description: string;
  triggers: string[];
  behaviors: string[];
  emotions?: string[];
  innerDialogue?: string[];
  digitalFootprints?: string[];
}

interface UseFirefighterTypeDataReturn {
  firefighterTypes: FirefighterType[];
  currentType: FirefighterType;
}

export function useFirefighterTypeData(
  selectedType: string, 
  t: (key: string) => string
): UseFirefighterTypeDataReturn {
  const firefighterTypes = useMemo(
    () => createFirefighterTypeData(t) as FirefighterType[], 
    [t]
  );

  const currentType = useMemo(
    () => firefighterTypes.find(type => type.id === selectedType) || firefighterTypes[0],
    [firefighterTypes, selectedType]
  );

  return {
    firefighterTypes,
    currentType
  };
} 