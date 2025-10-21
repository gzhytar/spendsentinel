import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/contexts/i18n-context';
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
  
  const {
    showIdentifyForm,
    identificationResult,
    resolutionResult,
    isLoadingIdentify,
    submitIdentification,
    error,
  } = assessmentState;

  const [formData, setFormData] = useState<FormData>({
    financialSituation: '',
    recentFinancialBehavior: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.financialSituation.trim()) {
      errors.financialSituation = t('selfAssessment.deepAssessment.validation.financialSituation');
    }
    
    if (!formData.recentFinancialBehavior.trim()) {
      errors.recentFinancialBehavior = t('selfAssessment.deepAssessment.validation.recentBehavior');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    await submitIdentification(formData);
  };

  const determineCurrentView = () => {
    if (showIdentifyForm) return 'form';
    if (identificationResult && !resolutionResult) return 'identification-result';
    if (identificationResult && resolutionResult) return 'full-result';
    return 'form';
  };

  const currentView = determineCurrentView();

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Section */}
      {currentView === 'form' && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Search className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl md:text-2xl">
                {t('selfAssessment.deepAssessment.title')}
              </CardTitle>
            </div>
            <CardDescription>
              {t('selfAssessment.deepAssessment.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="financialSituation" className="text-sm font-medium">
                {t('selfAssessment.deepAssessment.financialSituation.label')}
              </Label>
              <Textarea
                id="financialSituation"
                placeholder={t('selfAssessment.deepAssessment.financialSituation.placeholder')}
                value={formData.financialSituation}
                onChange={(e) => handleInputChange('financialSituation', e.target.value)}
                className={`min-h-[100px] ${formErrors.financialSituation ? 'border-red-500' : ''}`}
              />
              {formErrors.financialSituation && (
                <p className="text-sm text-red-600">{formErrors.financialSituation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recentFinancialBehavior" className="text-sm font-medium">
                {t('selfAssessment.deepAssessment.recentBehavior.label')}
              </Label>
              <Textarea
                id="recentFinancialBehavior"
                placeholder={t('selfAssessment.deepAssessment.recentBehavior.placeholder')}
                value={formData.recentFinancialBehavior}
                onChange={(e) => handleInputChange('recentFinancialBehavior', e.target.value)}
                className={`min-h-[100px] ${formErrors.recentFinancialBehavior ? 'border-red-500' : ''}`}
              />
              {formErrors.recentFinancialBehavior && (
                <p className="text-sm text-red-600">{formErrors.recentFinancialBehavior}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={isLoadingIdentify}
                size="lg"
                className="flex-1"
              >
                {isLoadingIdentify ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('selfAssessment.deepAssessment.analyzing')}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t('selfAssessment.deepAssessment.identifyButton')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {(currentView === 'identification-result' || currentView === 'full-result') && identificationResult && (
        <div className="space-y-6">
          {/* Resolution Section */}
          {/* {currentView === 'identification-result' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('selfAssessment.deepAssessment.resolution.title')}</CardTitle>
                <CardDescription>
                  {t('selfAssessment.deepAssessment.resolution.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={resolvePart}
                  disabled={isLoadingResolve}
                  size="lg"
                  className="w-full"
                >
                  {isLoadingResolve ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('selfAssessment.deepAssessment.resolving')}
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      {t('selfAssessment.deepAssessment.resolveButton')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )} */}

          {/* Resolution Results */}
          {currentView === 'full-result' && resolutionResult && (
            <Card>
              <CardHeader>
                <CardTitle>{t('selfAssessment.deepAssessment.resolution.results.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    {t('selfAssessment.deepAssessment.resolution.results.role')}
                  </h4>
                  <p className="text-sm">{resolutionResult.role}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    {t('selfAssessment.deepAssessment.resolution.results.burden')}
                  </h4>
                  <p className="text-sm">{resolutionResult.burden}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    {t('selfAssessment.deepAssessment.resolution.results.concern')}
                  </h4>
                  <p className="text-sm">{resolutionResult.concern}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 