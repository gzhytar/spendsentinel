import { useI18n } from '@/contexts/i18n-context';
import { en } from './i18n/translations/en';
import { cs } from './i18n/translations/cs';
import { ru } from './i18n/translations/ru';
import { uk } from './i18n/translations/uk';
import { useState, useEffect } from 'react';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firefighterSection = t.landing.firefighters as any;
    acc[config.id] = firefighterSection[config.id]?.title || config.id;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Hook to get identified parts for the current locale using the unified assessment system
 * Provides real-time updates when assessment results change
 */
export function useIdentifiedParts(): string[] {
  const [parts, setParts] = useState<string[]>([]);
  const { locale } = useI18n();

  useEffect(() => {
    const loadParts = () => {
      if (typeof window === 'undefined') {
        setParts([]);
        return;
      }

      try {
        // Import AssessmentStorageService dynamically to avoid SSR issues
        import('@/app/[lang]/self-assessment/services/AssessmentStorageService')
          .then(({ AssessmentStorageService }) => {
            const service = new AssessmentStorageService();
            const assessmentResults = service.getAllAssessmentResults(locale);
            
            // Extract part names from assessment results
            const identifiedParts = assessmentResults
              .map((result: { partName: string }) => result.partName)
              .filter((name: string, index: number, array: string[]) => array.indexOf(name) === index); // Remove duplicates
            
            setParts(identifiedParts);
          })
          .catch(error => {
            console.error('Error loading unified assessment results:', error);
            setParts([]);
          });
      } catch (error) {
        console.error('Error in useIdentifiedParts:', error);
        setParts([]);
      }
    };

    // Initial load
    loadParts();

    // Listen for storage changes to provide real-time updates
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'unifiedAssessmentResults' || 
          event.key === 'firefighterQuizResults' || 
          event.key === 'identifiedFinancialParts') {
        loadParts();
      }
    };

    // Listen for custom events from assessment components
    const handleAssessmentUpdate = () => {
      loadParts();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('assessmentResultsUpdated', handleAssessmentUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('assessmentResultsUpdated', handleAssessmentUpdate);
    };
  }, [locale]);

  return parts;
}

/**
 * Create firefighter type data structure for components
 * Centralized factory function to generate consistent type objects
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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