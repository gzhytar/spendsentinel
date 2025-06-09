import type { IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';
import type { IFSPartResolutionOutput } from '@/ai/flows/ifs-part-resolution';

interface UnifiedAssessmentResult {
  id: string;
  type: 'quiz' | 'deep-assessment';
  timestamp: string;
  locale: string;
  
  // For quiz results
  quizResult?: string;
  
  // For deep assessment results  
  identificationResult?: IdentifyIFSPartOutput;
  resolutionResult?: IFSPartResolutionOutput;
  
  // Common fields for easier access
  partName: string; // Extracted from either type
}

// Legacy interfaces for backward compatibility
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
  private static readonly UNIFIED_RESULTS_KEY = 'unifiedAssessmentResults';
  private static readonly MAX_RESULTS_PER_LOCALE = 10;

  // Unified methods
  saveAssessmentResult(data: {
    type: 'quiz' | 'deep-assessment';
    locale: string;
    quizResult?: string;
    identificationResult?: IdentifyIFSPartOutput;
    resolutionResult?: IFSPartResolutionOutput;
  }): void {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const existingResults = this.getUnifiedResults();
      
      // Extract part name based on type
      const partName = data.type === 'quiz' 
        ? data.quizResult! 
        : data.identificationResult!.identifiedPart.partName;

      const newResult: UnifiedAssessmentResult = {
        id: `${data.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: data.type,
        timestamp: new Date().toISOString(),
        locale: data.locale,
        partName,
        quizResult: data.quizResult,
        identificationResult: data.identificationResult,
        resolutionResult: data.resolutionResult
      };

      // Add to existing results
      const updatedResults = this.addResultToUnifiedCollection(existingResults, newResult, data.locale);
      
      localStorage.setItem(AssessmentStorageService.UNIFIED_RESULTS_KEY, JSON.stringify(updatedResults));
    } catch (error) {
      console.error('Failed to save unified assessment result:', error);
    }
  }

  getLatestAssessmentResult(locale: string): UnifiedAssessmentResult | null {
    try {
      const results = this.getUnifiedResults();
      const localeResults = this.filterByLocale(results, locale);
      return this.getMostRecent(localeResults);
    } catch (error) {
      console.error('Failed to load latest assessment result:', error);
      return null;
    }
  }

  getAllAssessmentResults(locale: string): UnifiedAssessmentResult[] {
    try {
      const results = this.getUnifiedResults();
      return this.filterByLocale(results, locale);
    } catch (error) {
      console.error('Failed to load assessment results:', error);
      return [];
    }
  }

  // Legacy methods for backward compatibility
  saveQuizResult(data: { result: string; locale: string }): void {
    this.saveAssessmentResult({
      type: 'quiz',
      locale: data.locale,
      quizResult: data.result
    });
  }

  getLatestQuizResult(locale: string): SavedQuizResult | null {
    // First try unified storage
    const unifiedResult = this.getLatestAssessmentResult(locale);
    if (unifiedResult && unifiedResult.type === 'quiz') {
      return {
        result: unifiedResult.quizResult!,
        timestamp: unifiedResult.timestamp,
        locale: unifiedResult.locale
      };
    }
    else {
      return null;
    }
  }

  saveDeepAssessmentResult(data: { result: IdentifyIFSPartOutput; locale: string; resolutionResult?: IFSPartResolutionOutput }): void {
    this.saveAssessmentResult({
      type: 'deep-assessment',
      locale: data.locale,
      identificationResult: data.result,
      resolutionResult: data.resolutionResult
    });
  }

  getLatestDeepAssessmentResult(locale: string): SavedDeepAssessmentResult | null {
    // First try unified storage
      const unifiedResult = this.getLatestAssessmentResult(locale);
      if (unifiedResult && unifiedResult.type === 'deep-assessment') {
      return {
        result: unifiedResult.identificationResult!,
        timestamp: unifiedResult.timestamp,
        locale: unifiedResult.locale
      };
    }
    else {
      return null;
    }
  }

  // Private unified storage methods
  private getUnifiedResults(): UnifiedAssessmentResult[] {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return [];
    }
    
    try {
      const stored = localStorage.getItem(AssessmentStorageService.UNIFIED_RESULTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse unified results:', error);
      return [];
    }
  }

  private addResultToUnifiedCollection(
    existingResults: UnifiedAssessmentResult[], 
    newResult: UnifiedAssessmentResult, 
    locale: string
  ): UnifiedAssessmentResult[] {
    const filteredResults = existingResults.filter(r => r.locale !== locale);
    const localeResults = existingResults.filter(r => r.locale === locale);
    
    localeResults.push(newResult);
    localeResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const trimmedLocaleResults = localeResults.slice(0, AssessmentStorageService.MAX_RESULTS_PER_LOCALE);
    
    return [...filteredResults, ...trimmedLocaleResults];
  }

  private filterByLocale<T extends { locale: string }>(results: T[], locale: string): T[] {
    return results.filter(result => result.locale === locale);
  }

  private getMostRecent<T extends { timestamp: string }>(results: T[]): T | null {
    if (results.length === 0) return null;
    
    return results.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  }

  // Clear all assessment results for a specific locale
  clearAssessmentResults(locale: string): void {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      // Clear from unified storage
      const existingResults = this.getUnifiedResults();
      const filteredResults = existingResults.filter(r => r.locale !== locale);
      localStorage.setItem(AssessmentStorageService.UNIFIED_RESULTS_KEY, JSON.stringify(filteredResults));
      
      console.log(`Cleared all assessment results for locale: ${locale}`);
      
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('assessmentResultsCleared', {
          detail: { locale, timestamp: new Date().toISOString() }
        }));
      }
    } catch (error) {
      console.error('Failed to clear assessment results:', error);
    }
  }
} 