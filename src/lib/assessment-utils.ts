import { useI18n } from '@/contexts/i18n-context';
import { en } from './i18n/translations/en';
import { cs } from './i18n/translations/cs';
import { ru } from './i18n/translations/ru';
import { uk } from './i18n/translations/uk';
import { useState, useEffect } from 'react';

interface QuizResult {
  result: string;
  timestamp: string;
  locale: string;
}

interface DeepAssessmentResult {
  result: {
    identifiedPart: {
      partName: string;
      role: string;
      burden: string;
      concern: string;
    };
    suggestedEngagement: string;
  };
  timestamp: string;
  locale: string;
}

const QUIZ_RESULTS_KEY = 'firefighterQuizResults';
const DEEP_ASSESSMENT_KEY = 'identifiedFinancialParts';

// Centralized firefighter types configuration - single source of truth
export const FIREFIGHTER_TYPE_IDS = [
  'spender', 
  'hoarder', 
  'avoider', 
  'indulger', 
  'planner', 
  'expenseController'
] as const;

export type FirefighterTypeId = typeof FIREFIGHTER_TYPE_IDS[number];

/**
 * Centralized firefighter type configuration
 * Single source of truth for all firefighter type definitions
 */
export interface FirefighterTypeConfig {
  id: FirefighterTypeId;
  translationKeyBase: string;
}

export const FIREFIGHTER_TYPES_CONFIG: FirefighterTypeConfig[] = FIREFIGHTER_TYPE_IDS.map(id => ({
  id,
  translationKeyBase: `landing.firefighters.${id}`
}));

/**
 * Get localized firefighter type names using centralized config
 */
export function getLocalizedFirefighterNames(locale: string): Record<string, string> {
  const translations = { en, cs, ru, uk };
  const t = translations[locale as keyof typeof translations] || translations.en;
  
  return FIREFIGHTER_TYPES_CONFIG.reduce((acc, config) => {
    // Use type assertion to access dynamic properties safely
    const firefighterSection = t.landing.firefighters as any;
    acc[config.id] = firefighterSection[config.id]?.title || config.id;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Get the user's identified financial parts from self-assessment results
 * Returns an array of part names that were identified via quiz or deep assessment
 */
export function getIdentifiedParts(locale: string): string[] {
  if (typeof window === 'undefined') return [];

  const parts: string[] = [];

  try {
    // Get localized firefighter type names
    const firefighterTypeNames = getLocalizedFirefighterNames(locale);
    
    // Get quiz results
    const savedQuizResults = localStorage.getItem(QUIZ_RESULTS_KEY);
    if (savedQuizResults) {
      const quizResults: QuizResult[] = JSON.parse(savedQuizResults);
      const localeQuizResults = quizResults.filter(item => item.locale === locale);
      
      if (localeQuizResults.length > 0) {
        // Get the most recent quiz result
        const mostRecentQuiz = localeQuizResults.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        
        const partName = firefighterTypeNames[mostRecentQuiz.result as keyof typeof firefighterTypeNames];
        if (partName) {
          parts.push(partName);
        }
      }
    }

    // Get deep assessment results
    const savedDeepResults = localStorage.getItem(DEEP_ASSESSMENT_KEY);
    if (savedDeepResults) {
      const deepResults: DeepAssessmentResult[] = JSON.parse(savedDeepResults);
      const localeDeepResults = deepResults.filter(item => item.locale === locale);
      
      if (localeDeepResults.length > 0) {
        // Get the most recent deep assessment result
        const mostRecentDeep = localeDeepResults.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        
        const partName = mostRecentDeep.result.identifiedPart.partName;
        if (partName && !parts.includes(partName)) {
          parts.push(partName);
        }
      }
    }

    // If no assessment results found, return empty array (no default parts)
    return parts;
    
  } catch (error) {
    console.error('Error loading assessment results:', error);
    return [];
  }
}

/**
 * Hook to get identified parts for the current locale
 */
export function useIdentifiedParts(): string[] {
  const [parts, setParts] = useState<string[]>([]);
  const { locale } = useI18n();

  useEffect(() => {
    const identifiedParts = getIdentifiedParts(locale);
    setParts(identifiedParts);
  }, [locale]);

  return parts;
}

/**
 * Maps a localized part name to its corresponding firefighter type ID for image display
 * Uses centralized configuration to eliminate duplication
 */
export function getFirefighterTypeId(partName: string, t: (key: string) => string): string {
  // Use centralized config to build translation mapping
  const firefighterTypeNames: Record<string, string> = FIREFIGHTER_TYPES_CONFIG.reduce((acc, config) => {
    acc[config.id] = t(`${config.translationKeyBase}.title`);
    return acc;
  }, {} as Record<string, string>);
  
  // Find the type ID that matches the part name
  for (const [typeId, typeName] of Object.entries(firefighterTypeNames)) {
    if (typeName === partName) {
      return typeId;
    }
  }
  
  // Default fallback to spender
  return 'spender';
}

/**
 * Gets all available firefighter type IDs from centralized config
 */
export function getAllFirefighterTypeIds(): FirefighterTypeId[] {
  return [...FIREFIGHTER_TYPE_IDS];
}

/**
 * Create firefighter type data structure for components
 * Centralized factory function to generate consistent type objects
 */
export function createFirefighterTypeData(t: (key: string) => any) {
  return FIREFIGHTER_TYPES_CONFIG.map(config => ({
    id: config.id,
    title: t(`${config.translationKeyBase}.title`),
    description: t(`${config.translationKeyBase}.description`),
    triggers: t(`${config.translationKeyBase}.triggers.items`),
    behaviors: t(`${config.translationKeyBase}.behaviors.items`),
    emotions: t(`${config.translationKeyBase}.emotions.items`),
    innerDialogue: t(`${config.translationKeyBase}.innerDialogue.items`),
    digitalFootprints: t(`${config.translationKeyBase}.digitalFootprints.items`),
  }));
} 