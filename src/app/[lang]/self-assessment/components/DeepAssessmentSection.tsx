import { useI18n } from '@/contexts/i18n-context';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Brain, Lightbulb, RotateCcw, Heart } from 'lucide-react';
import type { AssessmentState } from '../hooks/useAssessmentState';

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
                  <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
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
                  <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
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
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>Your Financial Guardian: {identificationResult.identifiedPart.partName}</span>
            </CardTitle>
            <CardDescription>
              Understanding this part of you can help create a more harmonious relationship with money.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Part Details */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                  Protective Role
                </h4>
                <p className="text-sm leading-relaxed">
                  {identificationResult.identifiedPart.role}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                  What This Part Carries
                </h4>
                <p className="text-sm leading-relaxed">
                  {identificationResult.identifiedPart.burden}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                  Underlying Care
                </h4>
                <p className="text-sm leading-relaxed">
                  {identificationResult.identifiedPart.concern}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                  How to Work With This Part
                </h4>
                <p className="text-sm leading-relaxed">
                  {identificationResult.suggestedEngagement}
                </p>
              </div>
            </div>

            {/* Resolution Results */}
            {resolutionResult && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg space-y-4">
                <h4 className="font-medium text-primary flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Deeper Understanding
                </h4>
                
                <div className="grid gap-3">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Enhanced Role Clarity:</span>
                    <p className="text-sm mt-1">{resolutionResult.role}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Deeper Compassion:</span>
                    <p className="text-sm mt-1">{resolutionResult.burden}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Core Care:</span>
                    <p className="text-sm mt-1">{resolutionResult.concern}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Gentle Approach:</span>
                    <p className="text-sm mt-1 capitalize">{resolutionResult.engagementStrategy} approach recommended</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This suggests the most supportive way to work with this part of yourself.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            {!resolutionResult && (
              <Button 
                onClick={resolvePart}
                disabled={isLoadingResolve}
                variant="outline"
                className="flex-1"
              >
                {isLoadingResolve ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Deepening understanding...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Explore deeper insights
                  </>
                )}
              </Button>
            )}
            
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Explore another part
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 