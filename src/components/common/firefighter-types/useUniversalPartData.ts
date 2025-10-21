import { useMemo } from 'react';
import { UniversalPart, PartDisplayConfig } from '../../../lib/FireFighterTypes';
import { createFirefighterTypeData } from '@/lib/assessment-utils';
import { 
  mergeParts, 
  filterParts, 
  firefighterTypeToUniversalPart 
} from './adapters';

interface UseUniversalPartDataProps {
  selectedPartId: string;
  t: (key: string) => string;
  customParts?: UniversalPart[];
  config?: PartDisplayConfig;
}

interface UseUniversalPartDataReturn {
  allParts: UniversalPart[];
  availableParts: UniversalPart[];
  currentPart: UniversalPart;
  predefinedParts: UniversalPart[];
  customPartsOnly: UniversalPart[];
}

export function useUniversalPartData({
  selectedPartId,
  t,
  customParts = [],
  config = {}
}: UseUniversalPartDataProps): UseUniversalPartDataReturn {
  
  // Get predefined firefighter types
  const predefinedFirefighterTypes = useMemo(
    () => createFirefighterTypeData(t),
    [t]
  );

  // Convert to universal format
  const predefinedParts = useMemo(
    () => predefinedFirefighterTypes.map(type => 
      firefighterTypeToUniversalPart(type)
    ),
    [predefinedFirefighterTypes]
  );

  // Merge all parts
  const allParts = useMemo(
    () => mergeParts(predefinedFirefighterTypes, customParts),
    [predefinedFirefighterTypes, customParts]
  );

  // Filter based on configuration
  const availableParts = useMemo(
    () => filterParts(allParts, config),
    [allParts, config]
  );

  // Find current part
  const currentPart = useMemo(() => {
    const found = availableParts.find(part => part.id === selectedPartId);
    return found || availableParts[0] || predefinedParts[0];
  }, [availableParts, selectedPartId, predefinedParts]);

  // Separate custom parts for easier access
  const customPartsOnly = useMemo(
    () => customParts.filter(part => part.type === 'custom'),
    [customParts]
  );

  return {
    allParts,
    availableParts,
    currentPart,
    predefinedParts,
    customPartsOnly
  };
} 