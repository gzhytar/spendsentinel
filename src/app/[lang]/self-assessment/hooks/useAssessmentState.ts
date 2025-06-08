import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { AssessmentStorageService } from '../services/AssessmentStorageService';
import { useAssessmentTracking } from './useAssessmentTracking';
import type { IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';
import type { IFSPartResolutionOutput } from '@/ai/flows/ifs-part-resolution';

export interface AssessmentState {
  // Quiz state
  quizStarted: boolean;
  showQuizResult: boolean;
  quizResult: string | null;
  showQuizSection: boolean;

  // Deep assessment state
  showDeepAssessment: boolean;
  showIdentifyForm: boolean;
  identificationResult: IdentifyIFSPartOutput | null;
  resolutionResult: IFSPartResolutionOutput | null;

  // Loading states
  isLoadingIdentify: boolean;
  isLoadingResolve: boolean;
  error: string | null;

  // Actions
  startQuiz: () => void;
  cancelQuiz: () => void;
  completeQuiz: (result: string) => void;
  retakeQuiz: () => void;
  suggestDeepAssessment: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitIdentification: (data: any) => Promise<void>;
  resetIdentification: () => void;
  resolvePart: () => Promise<void>;
  setError: (error: string | null) => void;
}

export function useAssessmentState(): AssessmentState {
  const { locale, t } = useI18n();
  const { trackQuizComplete, trackDeepAssessmentComplete } = useAssessmentTracking();
  const storageService = new AssessmentStorageService();

  // State
  const [quizStarted, setQuizStarted] = useState(false);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [showQuizSection, setShowQuizSection] = useState(true);
  const [showDeepAssessment, setShowDeepAssessment] = useState(false);
  const [showIdentifyForm, setShowIdentifyForm] = useState(true);
  const [identificationResult, setIdentificationResult] = useState<IdentifyIFSPartOutput | null>(null);
  const [resolutionResult, setResolutionResult] = useState<IFSPartResolutionOutput | null>(null);
  const [isLoadingIdentify, setIsLoadingIdentify] = useState(false);
  const [isLoadingResolve, setIsLoadingResolve] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved results on mount
  useEffect(() => {
    loadSavedResults();
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSavedResults = () => {
    try {
      // Load the latest unified result
      const latestResult = storageService.getLatestAssessmentResult(locale);

      if (latestResult) {
        if (latestResult.type === 'quiz') {
          // Quiz result is most recent
          setQuizResult(latestResult.quizResult!);
          setShowQuizResult(true);
          setShowQuizSection(false);
          setShowDeepAssessment(false);
        } else if (latestResult.type === 'deep-assessment') {
          // Deep assessment is most recent
          setIdentificationResult(latestResult.identificationResult!);
          if (latestResult.resolutionResult) {
            setResolutionResult(latestResult.resolutionResult);
          }
          setShowIdentifyForm(false);
          setShowDeepAssessment(true);
          setShowQuizSection(false);
          setShowQuizResult(false);
        }
      }
      // If no results exist, keep defaults (show quiz section)
    } catch (error) {
      console.error('Error loading saved results:', error);
      setShowIdentifyForm(true);
    }
  };

  // Quiz actions
  const startQuiz = () => setQuizStarted(true);
  
  const cancelQuiz = () => {
    setQuizStarted(false);
    setShowQuizResult(false);
  };

  const completeQuiz = (result: string) => {
    setQuizResult(result);
    setQuizStarted(false);
    setShowQuizResult(true);
    setShowQuizSection(false);
    
    // Track and save
    trackQuizComplete(result);
    storageService.saveQuizResult({ result, locale });
  };

  const retakeQuiz = () => {
    // Clear all previous assessment results for this locale
    storageService.clearAssessmentResults(locale);
    
    // Reset quiz state
    setQuizResult(null);
    setShowQuizResult(false);
    setShowQuizSection(true);
    setQuizStarted(false);
    
    // Also clear deep assessment state in case user had both
    setIdentificationResult(null);
    setResolutionResult(null);
    setShowDeepAssessment(false);
    setShowIdentifyForm(true);
    setError(null);
  };

  const suggestDeepAssessment = () => {
    setQuizStarted(false);
    setShowQuizResult(false);
    setQuizResult(null);
    setShowDeepAssessment(true);
    setShowQuizSection(false);
  };

  // Deep assessment actions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitIdentification = async (data: any) => {
    setIsLoadingIdentify(true);
    setError(null);
    setIdentificationResult(null);
    setResolutionResult(null);

    try {
      const response = await fetch(`/api/identifyIFSPart?lang=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });

      if (!response.ok) throw new Error('API error');
      
      const result: IdentifyIFSPartOutput = await response.json();
      setIdentificationResult(result);
      setShowIdentifyForm(false);
      setShowQuizSection(false);

      // Track and save
      trackDeepAssessmentComplete(result.identifiedPart.partName);
      storageService.saveDeepAssessmentResult({ 
        result, 
        locale,
        resolutionResult: resolutionResult || undefined
      });
    } catch (e) {
      console.error(e);
      setError(t('selfAssessment.error.identifyFailed'));
    } finally {
      setIsLoadingIdentify(false);
    }
  };

  const resetIdentification = () => {
    // Clear all previous assessment results for this locale
    storageService.clearAssessmentResults(locale);
    
    // Reset deep assessment state
    setIdentificationResult(null);
    setResolutionResult(null);
    setShowIdentifyForm(true);
    setShowDeepAssessment(true);
    
    // Also reset quiz state in case user had both
    setQuizResult(null);
    setShowQuizResult(false);
    setShowQuizSection(false);
    setQuizStarted(false);
    setError(null);
  };

  const resolvePart = async () => {
    if (!identificationResult) return;
    
    setIsLoadingResolve(true);
    setError(null);
    setResolutionResult(null);

    try {
      const input = {
        partName: identificationResult.identifiedPart.partName,
        partBehavior: `${identificationResult.identifiedPart.role} ${identificationResult.identifiedPart.burden} ${identificationResult.identifiedPart.concern}`,
        locale,
      };

      const response = await fetch(`/api/ifsPartResolution?lang=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) throw new Error('API error');
      
      const result: IFSPartResolutionOutput = await response.json();
      setResolutionResult(result);
    } catch (e) {
      console.error(e);
      setError(t('selfAssessment.error.resolveFailed'));
    } finally {
      setIsLoadingResolve(false);
    }
  };

  return {
    // State
    quizStarted,
    showQuizResult,
    quizResult,
    showQuizSection,
    showDeepAssessment,
    showIdentifyForm,
    identificationResult,
    resolutionResult,
    isLoadingIdentify,
    isLoadingResolve,
    error,

    // Actions
    startQuiz,
    cancelQuiz,
    completeQuiz,
    retakeQuiz,
    suggestDeepAssessment,
    submitIdentification,
    resetIdentification,
    resolvePart,
    setError,
  };
} 