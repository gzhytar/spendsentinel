import { useI18n } from '@/contexts/i18n-context';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Brain } from 'lucide-react';
import type { AssessmentState } from '../hooks/useAssessmentState';
import { AssessmentResults } from './AssessmentResults';

interface DeepAssessmentSectionProps {
  assessmentState: AssessmentState;
}

interface FormData {
  financialSituation: string;
  recentFinancialBehavior: string;
}

interface FormErrors {
  financialSituation?: string;
  recentFinancialBehavior?: string;
}

export function DeepAssessmentSection({ assessmentState }: DeepAssessmentSectionProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<FormData>({
    financialSituation: '',
    recentFinancialBehavior: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState<'form' | 'results'>('form');

  const {
    showIdentifyForm,
    identificationResult,
    resolutionResult,
    isLoadingIdentify,
    isLoadingResolve,
    error,
    submitIdentification,
    resetIdentification,
    resolvePart,
    setError
  } = assessmentState;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear gentle nudge when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.financialSituation.trim() || formData.financialSituation.trim().length < 10) {
      newErrors.financialSituation = 'We\'d love to understand your situation better. Could you share a bit more detail?';
    }
    
    if (!formData.recentFinancialBehavior.trim() || formData.recentFinancialBehavior.trim().length < 10) {
      newErrors.recentFinancialBehavior = 'To help identify patterns, could you describe your recent financial experience in a bit more detail?';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setError(null);
    await submitIdentification({
      financialSituation: formData.financialSituation.trim(),
      recentFinancialBehavior: formData.recentFinancialBehavior.trim(),
      personalityType: 'general' // Default personality type
    });
  };

  const handleReset = () => {
    setFormData({
      financialSituation: '',
      recentFinancialBehavior: ''
    });
    setErrors({});
    setCurrentStep('form');
    resetIdentification();
  };

  // Determine which step to show based on state
  const determineCurrentView = () => {
    if (identificationResult) return 'results';
    return 'form';
  };

  const currentView = determineCurrentView();

  return (
    <div className="space-y-6">
      {/* Gentle Error Display */}
      {error && (
        <Card className="border-blue-200 bg-blue-50/50 shadow-lg">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">We encountered a small hiccup</h4>
                <p className="text-sm text-blue-700/80 mt-1">
                  {error === t('ifsDialogue.error.identifyFailed') 
                    ? 'We\'re having a brief technical moment. Your information is safe, and you can try again when you\'re ready.'
                    : error === t('ifsDialogue.error.resolveFailed')
                    ? 'The deeper exploration isn\'t available right now. The insights you\'ve already received are still valuable.'
                    : error}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Step */}
      {currentView === 'form' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Share what feels comfortable</span>
            </CardTitle>
            <CardDescription>
              Help us understand your financial journey. Share as much or as little as you'd like.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Financial Situation Field */}
            <div className="space-y-2">
              <Label htmlFor="financialSituation" className="flex items-center gap-2">
                {t('ifsDialogue.form.financialSituation.label')}
                <span className="text-xs text-muted-foreground">(share what feels right for you)</span>
              </Label>
              <Textarea
                id="financialSituation"
                value={formData.financialSituation}
                onChange={(e) => handleInputChange('financialSituation', e.target.value)}
                placeholder={t('ifsDialogue.form.financialSituation.placeholder')}
                className={`min-h-[100px] transition-colors ${
                  errors.financialSituation 
                    ? 'border-blue-300 bg-blue-50/30 focus:border-blue-400' 
                    : ''
                }`}
              />
              {errors.financialSituation && (
                <p className="text-sm text-blue-600 mt-1 flex items-start gap-2">
                  {errors.financialSituation}
                </p>
              )}
            </div>

            {/* Recent Financial Behavior Field */}
            <div className="space-y-2">
              <Label htmlFor="recentFinancialBehavior" className="flex items-center gap-2">
                {t('ifsDialogue.form.recentFinancialBehavior.label')}
                <span className="text-xs text-muted-foreground">(optional details)</span>
              </Label>
              <Textarea
                id="recentFinancialBehavior"
                value={formData.recentFinancialBehavior}
                onChange={(e) => handleInputChange('recentFinancialBehavior', e.target.value)}
                placeholder={t('ifsDialogue.form.recentFinancialBehavior.placeholder')}
                className={`min-h-[100px] transition-colors ${
                  errors.recentFinancialBehavior 
                    ? 'border-blue-300 bg-blue-50/30 focus:border-blue-400' 
                    : ''
                }`}
              />
              {errors.recentFinancialBehavior && (
                <p className="text-sm text-blue-600 mt-1 flex items-start gap-2">
                  {errors.recentFinancialBehavior}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoadingIdentify}
              className="w-full"
            >
              {isLoadingIdentify ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Understanding your patterns...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  {t('ifsDialogue.identifyButton')}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Results Step */}
      {currentView === 'results' && identificationResult && (
        <AssessmentResults 
          partName={identificationResult.identifiedPart.partName}
          identificationResult={identificationResult}
          resolutionResult={resolutionResult}
          assessmentState={assessmentState}
        />
      )}
    </div>
  );
} 