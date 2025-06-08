import { UniversalPart, FirefighterType } from '../../../lib/FireFighterTypes';
import { IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';
import { IFSPartResolutionOutput } from '@/ai/flows/ifs-part-resolution';

/**
 * Convert predefined FirefighterType to UniversalPart
 */
export function firefighterTypeToUniversalPart(
  firefighterType: FirefighterType,
  source: 'system' | 'quiz' = 'system'
): UniversalPart {
  return {
    ...firefighterType,
    type: 'predefined',
    source,
  };
}

/**
 * Convert assessment identification result to UniversalPart
 */
export function identificationResultToUniversalPart(
  result: IdentifyIFSPartOutput,
  id?: string
): UniversalPart {
  const { identifiedPart } = result;
  
  return {
    id: id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: identifiedPart.partName,
    description: identifiedPart.description,
    triggers: identifiedPart.triggers || [],
    behaviors: identifiedPart.behaviors || [],
    emotions: identifiedPart.emotions || [],
    innerDialogue: identifiedPart.innerDialogue || [],
    digitalFootprints: identifiedPart.digitalFootprints || [],
    type: 'custom',
    source: 'deep-assessment',
    role: identifiedPart.role,
    burden: identifiedPart.burden,
    concern: identifiedPart.concern,
  };
}

/**
 * Enhance UniversalPart with resolution data
 */
export function enhancePartWithResolution(
  part: UniversalPart,
  resolution: IFSPartResolutionOutput
): UniversalPart {
  return {
    ...part,
    role: resolution.role,
    burden: resolution.burden,
    concern: resolution.concern,
    engagementStrategy: resolution.engagementStrategy,
  };
}

/**
 * Convert quiz result to UniversalPart by finding matching predefined type
 */
export function quizResultToUniversalPart(
  quizResult: string,
  predefinedTypes: FirefighterType[]
): UniversalPart | null {
  const matchingType = predefinedTypes.find(type => type.id === quizResult);
  
  if (!matchingType) {
    return null;
  }
  
  return firefighterTypeToUniversalPart(matchingType, 'quiz');
}

/**
 * Merge multiple parts (useful for displaying both predefined and custom)
 */
export function mergeParts(
  predefinedTypes: FirefighterType[],
  customParts: UniversalPart[] = []
): UniversalPart[] {
  const predefinedAsUniversal = predefinedTypes.map(type => 
    firefighterTypeToUniversalPart(type)
  );
  
  return [...predefinedAsUniversal, ...customParts];
}

/**
 * Filter parts based on display configuration
 */
export function filterParts(
  parts: UniversalPart[],
  config: {
    showOnlyCustom?: boolean;
    showOnlyPredefined?: boolean;
    highlightedPart?: string;
  }
): UniversalPart[] {
  let filtered = parts;
  
  if (config.showOnlyCustom) {
    filtered = filtered.filter(part => part.type === 'custom');
  } else if (config.showOnlyPredefined) {
    filtered = filtered.filter(part => part.type === 'predefined');
  }
  
  return filtered;
} 