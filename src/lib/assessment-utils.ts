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

/**
 * Get localized firefighter type names for a given locale
 */
function getLocalizedFirefighterNames(locale: string): Record<string, string> {
  const translations = { en, cs, ru, uk };
  const t = translations[locale as keyof typeof translations] || translations.en;
  
  return {
    spender: t.landing.firefighters.spender.title,
    hoarder: t.landing.firefighters.hoarder.title,
    avoider: t.landing.firefighters.avoider.title,
    indulger: t.landing.firefighters.indulger.title,
    planner: t.landing.firefighters.planner.title,
    expenseController: t.landing.firefighters.expenseController.title
  };
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