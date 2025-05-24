"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, MessageSquareHeart, UserCheck, AlertTriangle, BrainCircuit, RefreshCw, ArrowRight, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { IdentifyIFSPartInput, IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';
import type { IFSPartResolutionInput, IFSPartResolutionOutput } from '@/ai/flows/ifs-part-resolution';
import { useI18n } from '@/contexts/i18n-context';
import { PremiumButton } from '@/components/ui/premium-button';
import { FirefighterQuiz } from '@/components/common/FirefighterQuiz';

const identifySchema = z.object({
  financialSituation: z.string().min(10, "Please describe your financial situation in more detail."),
  recentFinancialBehavior: z.string().min(10, "Please describe your recent financial behavior."),
});

type IdentifyFormValues = z.infer<typeof identifySchema>;

const LOCAL_STORAGE_KEY = 'identifiedFinancialParts';

export default function SelfAssessmentPage() {
  const { t, locale } = useI18n();
  const [isLoadingIdentify, setIsLoadingIdentify] = useState(false);
  const [isLoadingResolve, setIsLoadingResolve] = useState(false);
  const [identificationResult, setIdentificationResult] = useState<IdentifyIFSPartOutput | null>(null);
  const [resolutionResult, setResolutionResult] = useState<IFSPartResolutionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showIdentifyForm, setShowIdentifyForm] = useState(true);
  
  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizResult, setQuizResult] = useState<string | null>(null);
  
  // Deep assessment visibility state
  const [showDeepAssessment, setShowDeepAssessment] = useState(false);

  // Load saved identification results from local storage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedResults = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedResults) {
          const parsedResults = JSON.parse(savedResults);
          // Find the most recent result for the current locale
          const localeResults = parsedResults.filter((item: any) => item.locale === locale);
          if (localeResults.length > 0) {
            // Get the most recent result
            const mostRecent = localeResults.sort((a: any, b: any) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )[0];
            setIdentificationResult(mostRecent.result);
            setShowIdentifyForm(false); // Hide the form when we have saved results
            setShowDeepAssessment(true); // Show deep assessment when we have saved results
          } else {
            setShowIdentifyForm(true); // Show the form if no results for this locale
          }
        } else {
          setShowIdentifyForm(true); // Show the form if no results at all
        }
      } catch (error) {
        console.error('Error loading saved identification results:', error);
        setShowIdentifyForm(true); // Show the form on error
      }
    }
  }, [locale]);

  const identifyForm = useForm<IdentifyFormValues>({
    resolver: zodResolver(identifySchema),
    defaultValues: {
      financialSituation: "",
      recentFinancialBehavior: "",
    },
  });

  const handleIdentifySubmit: SubmitHandler<IdentifyFormValues> = async (data) => {
    setIsLoadingIdentify(true);
    setError(null);
    setIdentificationResult(null);
    setResolutionResult(null); 
    try {
      const response = await fetch(`/api/identifyIFSPart?lang=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data, locale}),
      });
      if (!response.ok) throw new Error('API error');
      const result: IdentifyIFSPartOutput = await response.json();
      setIdentificationResult(result);
      setShowIdentifyForm(false); // Hide form after successful identification
      
      // Save to local storage with timestamp and locale
      if (typeof window !== 'undefined') {
        try {
          const savedResults = localStorage.getItem(LOCAL_STORAGE_KEY);
          const existingResults = savedResults ? JSON.parse(savedResults) : [];
          const newSavedResult = {
            result,
            timestamp: new Date().toISOString(),
            locale
          };
          
          // Keep maximum 10 results per locale
          const otherLocaleResults = existingResults.filter((item: any) => item.locale !== locale);
          const currentLocaleResults = existingResults.filter((item: any) => item.locale === locale);
          
          // Add new result and limit to 10 most recent per locale
          const updatedLocaleResults = [newSavedResult, ...currentLocaleResults]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
            
          // Combine with other locale results
          const allResults = [...updatedLocaleResults, ...otherLocaleResults];
          
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allResults));
        } catch (error) {
          console.error('Error saving identification results to local storage:', error);
        }
      }
    } catch (e) {
      console.error(e);
      setError(t('selfAssessment.error.identifyFailed'));
    } finally {
      setIsLoadingIdentify(false);
    }
  };

  const handleNewIdentification = () => {
    setIdentificationResult(null);
    setResolutionResult(null);
    setShowIdentifyForm(true);
    identifyForm.reset();
  };

  const handleQuizSuggestDeepAssessment = () => {
    setQuizStarted(false);
    setShowQuizResult(false);
    setQuizResult(null);
    setShowDeepAssessment(true);
  };

  const handleResolvePart = async () => {
    if (!identificationResult) return;
    setIsLoadingResolve(true);
    setError(null);
    setResolutionResult(null);
    try {
      const input: IFSPartResolutionInput = {
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

  const firefighterTypeNames = {
    spender: t('landing.firefighters.spender.title'),
    hoarder: t('landing.firefighters.hoarder.title'),
    avoider: t('landing.firefighters.avoider.title'),
    indulger: t('landing.firefighters.indulger.title')
  };

  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <BrainCircuit className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">{t('selfAssessment.title')}</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('selfAssessment.subtitle')}
        </p>
      </div>

      {/* Quick Self-Assessment Quiz */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
            <CardTitle className="text-xl md:text-2xl">{t('selfAssessment.quiz.title')}</CardTitle>
          </div>
          <CardDescription>
            {t('selfAssessment.quiz.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!quizStarted ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {t('selfAssessment.quiz.instruction')}
              </p>
              <Button 
                onClick={() => setQuizStarted(true)}
                size="lg"
                className="w-full sm:w-auto"
              >
                {t('selfAssessment.quiz.startButton')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <FirefighterQuiz
              onComplete={(result) => {
                setQuizResult(result);
                setQuizStarted(false);
                setShowQuizResult(true);
              }}
              onCancel={() => {
                setQuizStarted(false);
                setShowQuizResult(false);
              }}
              onSuggestDeepAssessment={handleQuizSuggestDeepAssessment}
            />
          )}
          {showQuizResult && !quizStarted && quizResult && (
            <Alert className="mt-4 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>{t('selfAssessment.quiz.result')}</strong> {firefighterTypeNames[quizResult as keyof typeof firefighterTypeNames]}. 
                {t('selfAssessment.quiz.resultDescription')}
              </AlertDescription>
            </Alert>
          )}
          {showDeepAssessment && !showQuizResult && (
            <Alert className="mt-4 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>{t('selfAssessment.quiz.uncertaintyNotice.title')}</strong> {t('selfAssessment.quiz.uncertaintyNotice.description')}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Deep Assessment Section */}
      {showDeepAssessment && (
        <>
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-semibold">{t('selfAssessment.deepAssessment.title')}</h2>
            <p className="text-muted-foreground">{t('selfAssessment.deepAssessment.description')}</p>
          </div>

          {showIdentifyForm ? (
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <BrainCircuit className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  <CardTitle className="text-xl md:text-2xl">{t('selfAssessment.deepAssessment.formTitle')}</CardTitle>
                </div>
                <CardDescription>
                  {t('selfAssessment.deepAssessment.formDescription')}
                </CardDescription>
              </CardHeader>
              <form onSubmit={identifyForm.handleSubmit(handleIdentifySubmit)}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="financialSituation">{t('selfAssessment.form.financialSituation.label')}</Label>
                    <Textarea
                      id="financialSituation"
                      placeholder={t('selfAssessment.form.financialSituation.placeholder')}
                      {...identifyForm.register("financialSituation")}
                      className="min-h-[100px]"
                    />
                    {identifyForm.formState.errors.financialSituation && (
                      <p className="text-sm text-destructive">{t('selfAssessment.form.financialSituation.error')}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recentFinancialBehavior">{t('selfAssessment.form.recentFinancialBehavior.label')}</Label>
                    <Textarea
                      id="recentFinancialBehavior"
                      placeholder={t('selfAssessment.form.recentFinancialBehavior.placeholder')}
                      {...identifyForm.register("recentFinancialBehavior")}
                      className="min-h-[100px]"
                    />
                    {identifyForm.formState.errors.recentFinancialBehavior && (
                      <p className="text-sm text-destructive">{t('selfAssessment.form.recentFinancialBehavior.error')}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoadingIdentify} size="lg" className="w-full sm:w-auto" wrap={true}>
                    {isLoadingIdentify && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Wand2 className="mr-2 h-4 w-4" /> {t('selfAssessment.identifyButton')}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <div className="flex justify-end mb-4">
              <Button onClick={handleNewIdentification} variant="outline" className="w-full sm:w-auto" wrap={true}>
                <RefreshCw className="mr-2 h-4 w-4" /> {t('selfAssessment.repeatAssessmentButton')}
              </Button>
            </div>
          )}
        </>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('selfAssessment.error.title')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {identificationResult && (
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
                <MessageSquareHeart className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                <CardTitle className="text-xl md:text-2xl">{t('selfAssessment.result.title').replace('{partName}', identificationResult.identifiedPart.partName)}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('selfAssessment.result.role')}:</h3>
              <p className="text-muted-foreground">{identificationResult.identifiedPart.role}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('selfAssessment.result.burden')}:</h3>
              <p className="text-muted-foreground">{identificationResult.identifiedPart.burden}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('selfAssessment.result.concern')}:</h3>
              <p className="text-muted-foreground">{identificationResult.identifiedPart.concern}</p>
            </div>
            <Separator className="my-6" />
            <div>
                <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-lg">{t('selfAssessment.result.suggestedEngagement')}:</h3>
                </div>
                <p className="text-muted-foreground mt-2">{identificationResult.suggestedEngagement}</p>
            </div>
          </CardContent>
          <CardFooter>
            <PremiumButton 
              onClick={handleResolvePart} 
              disabled={isLoadingResolve} 
              size="lg"
              className="w-full sm:w-auto"
              tooltipText={t('selfAssessment.premiumFeatureTooltip') || "This deep exploration is a premium feature. Subscribe to enable premium features."}
              wrap={true}
            >
              {isLoadingResolve && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               <Wand2 className="mr-2 h-4 w-4" />
              {t('selfAssessment.explorePartButton')}
            </PremiumButton>
          </CardFooter>
        </Card>
      )}

      {resolutionResult && (
         <Card className="shadow-lg mt-8">
          <CardHeader>
             <div className="flex items-center space-x-3">
                <MessageSquareHeart className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                <CardTitle className="text-xl md:text-2xl">{t('selfAssessment.result.title').replace('{partName}', identificationResult?.identifiedPart.partName || '')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('selfAssessment.result.role')}:</h3>
              <p className="text-muted-foreground">{resolutionResult.role}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('selfAssessment.result.burden')}:</h3>
              <p className="text-muted-foreground">{resolutionResult.burden}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('selfAssessment.result.concern')}:</h3>
              <p className="text-muted-foreground">{resolutionResult.concern}</p>
            </div>
            <Separator className="my-6" />
            <div>
                <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-lg">{t('selfAssessment.result.suggestedEngagement')}:</h3>
                </div>
              <p className="text-muted-foreground mt-1 capitalize">{resolutionResult.engagementStrategy}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('selfAssessment.result.engagementDescription')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 