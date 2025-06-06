import type { IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';

interface SavedQuizResult {
  result: string;
  timestamp: string;
  locale: string;
}

interface SavedDeepAssessmentResult {
  result: IdentifyIFSPartOutput;
  timestamp: string;
  locale: string;
}

export class AssessmentStorageService {
  private static readonly QUIZ_RESULTS_KEY = 'firefighterQuizResults';
  private static readonly DEEP_ASSESSMENT_KEY = 'identifiedFinancialParts';
  private static readonly MAX_RESULTS_PER_LOCALE = 10;

  // Quiz result methods
  saveQuizResult(data: { result: string; locale: string }): void {
    try {
      const newResult: SavedQuizResult = {
        ...data,
        timestamp: new Date().toISOString(),
      };

      const existingResults = this.getQuizResults();
      const updatedResults = this.addResultToCollection(existingResults, newResult, data.locale);
      
      localStorage.setItem(AssessmentStorageService.QUIZ_RESULTS_KEY, JSON.stringify(updatedResults));
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  }

  getLatestQuizResult(locale: string): SavedQuizResult | null {
    try {
      const results = this.getQuizResults();
      const localeResults = this.filterByLocale(results, locale);
      return this.getMostRecent(localeResults);
    } catch (error) {
      console.error('Error loading quiz results:', error);
      return null;
    }
  }

  // Deep assessment result methods
  saveDeepAssessmentResult(data: { result: IdentifyIFSPartOutput; locale: string }): void {
    try {
      const newResult: SavedDeepAssessmentResult = {
        ...data,
        timestamp: new Date().toISOString(),
      };

      const existingResults = this.getDeepAssessmentResults();
      const updatedResults = this.addResultToCollection(existingResults, newResult, data.locale);
      
      localStorage.setItem(AssessmentStorageService.DEEP_ASSESSMENT_KEY, JSON.stringify(updatedResults));
    } catch (error) {
      console.error('Error saving deep assessment result:', error);
    }
  }

  getLatestDeepAssessmentResult(locale: string): SavedDeepAssessmentResult | null {
    try {
      const results = this.getDeepAssessmentResults();
      const localeResults = this.filterByLocale(results, locale);
      return this.getMostRecent(localeResults);
    } catch (error) {
      console.error('Error loading deep assessment results:', error);
      return null;
    }
  }

  // Private helper methods
  private getQuizResults(): SavedQuizResult[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(AssessmentStorageService.QUIZ_RESULTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private getDeepAssessmentResults(): SavedDeepAssessmentResult[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(AssessmentStorageService.DEEP_ASSESSMENT_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private filterByLocale<T extends { locale: string }>(results: T[], locale: string): T[] {
    return results.filter(item => item.locale === locale);
  }

  private getMostRecent<T extends { timestamp: string }>(results: T[]): T | null {
    if (results.length === 0) return null;
    
    return results.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  }

  private addResultToCollection<T extends { locale: string; timestamp: string }>(
    existingResults: T[], 
    newResult: T, 
    locale: string
  ): T[] {
    const otherLocaleResults = existingResults.filter(item => item.locale !== locale);
    const currentLocaleResults = existingResults.filter(item => item.locale === locale);
    
    // Add new result and limit to max per locale
    const updatedLocaleResults = [newResult, ...currentLocaleResults]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, AssessmentStorageService.MAX_RESULTS_PER_LOCALE);
      
    return [...updatedLocaleResults, ...otherLocaleResults];
  }
} 