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
import { Loader2, Wand2, MessageSquareHeart, UserCheck, AlertTriangle, BrainCircuit, RefreshCw, ArrowRight, Lightbulb, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { IdentifyIFSPartInput, IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';
import type { IFSPartResolutionInput, IFSPartResolutionOutput } from '@/ai/flows/ifs-part-resolution';
import { useI18n } from '@/contexts/i18n-context';
import { PremiumButton } from '@/components/ui/premium-button';
import { FirefighterQuiz } from '@/components/common/FirefighterQuiz';
import { FirefighterTypes } from '@/components/common/FirefighterTypes';

const identifySchema = z.object({
  financialSituation: z.string().min(10, "Please describe your financial situation in more detail."),
  recentFinancialBehavior: z.string().min(10, "Please describe your recent financial behavior."),
});

type IdentifyFormValues = z.infer<typeof identifySchema>;

const LOCAL_STORAGE_KEY = 'identifiedFinancialParts';
const QUIZ_RESULTS_KEY = 'firefighterQuizResults';

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
  const [showQuizSection, setShowQuizSection] = useState(true);
  
  // Deep assessment visibility state
  const [showDeepAssessment, setShowDeepAssessment] = useState(false);

  // Load saved quiz results from local storage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Load quiz results
        const savedQuizResults = localStorage.getItem(QUIZ_RESULTS_KEY);
        if (savedQuizResults) {
          const parsedQuizResults = JSON.parse(savedQuizResults);
          // Find the most recent result for the current locale
          const localeQuizResults = parsedQuizResults.filter((item: any) => item.locale === locale);
          if (localeQuizResults.length > 0) {
            // Get the most recent quiz result
            const mostRecentQuiz = localeQuizResults.sort((a: any, b: any) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )[0];
            setQuizResult(mostRecentQuiz.result);
            setShowQuizResult(true);
            setShowQuizSection(false); // Hide quiz section when we have results
          }
        }

        // Load deep assessment results
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
            setShowQuizSection(false); // Hide quiz section when deep assessment results are loaded
          } else {
            setShowIdentifyForm(true); // Show the form if no results for this locale
          }
        } else {
          setShowIdentifyForm(true); // Show the form if no results at all
        }
      } catch (error) {
        console.error('Error loading saved results:', error);
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
      setShowQuizSection(false); // Hide quiz section after successful deep assessment identification
      
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
    setShowQuizSection(false);
  };

  const handleQuizComplete = (result: string) => {
    setQuizResult(result);
    setQuizStarted(false);
    setShowQuizResult(true);
    setShowQuizSection(false); // Hide quiz section after completion
    
    // Save quiz result to localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedQuizResults = localStorage.getItem(QUIZ_RESULTS_KEY);
        const existingResults = savedQuizResults ? JSON.parse(savedQuizResults) : [];
        const newQuizResult = {
          result,
          timestamp: new Date().toISOString(),
          locale
        };
        
        // Keep maximum 10 results per locale
        const otherLocaleResults = existingResults.filter((item: any) => item.locale !== locale);
        const currentLocaleResults = existingResults.filter((item: any) => item.locale === locale);
        
        // Add new result and limit to 10 most recent per locale
        const updatedLocaleResults = [newQuizResult, ...currentLocaleResults]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10);
          
        // Combine with other locale results
        const allResults = [...updatedLocaleResults, ...otherLocaleResults];
        
        localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(allResults));
      } catch (error) {
        console.error('Error saving quiz results to local storage:', error);
      }
    }
  };

  const handleRetakeQuiz = () => {
    setQuizResult(null);
    setShowQuizResult(false);
    setShowQuizSection(true);
    setQuizStarted(false);
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
      {showQuizSection && (
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
                onComplete={handleQuizComplete}
                onCancel={() => {
                  setQuizStarted(false);
                  setShowQuizResult(false);
                }}
                onSuggestDeepAssessment={handleQuizSuggestDeepAssessment}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Quiz Results Display */}
      {showQuizResult && quizResult && (
        <div className="space-y-6">
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <AlertDescription className="text-green-800 dark:text-green-200 flex-1">
                {t('selfAssessment.quiz.interpretationGuide')}
              </AlertDescription>
              <Button 
                onClick={handleRetakeQuiz} 
                variant="outline" 
                size="sm"
                className="self-start sm:self-center shrink-0"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> 
                {t('selfAssessment.quiz.repeatQuizButton')}
              </Button>
            </div>
          </Alert>

          {/* Detailed Firefighter Information */}
          <FirefighterTypes 
            highlightedType={quizResult}
            title={t('selfAssessment.quiz.detailedResult.title')}
            subtitle={t('selfAssessment.quiz.detailedResult.subtitle')}
            showIntroduction={false}
          />
        </div>
      )}

      {showQuizResult && <Separator className="my-8" />}

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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <h3 className="text-lg font-semibold">{t('selfAssessment.result.role')}</h3>
                </div>
                <p className="text-muted-foreground">{identificationResult.identifiedPart.role}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <h3 className="text-lg font-semibold">{t('selfAssessment.result.burden')}</h3>
                </div>
                <p className="text-muted-foreground">{identificationResult.identifiedPart.burden}</p>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="w-4 h-4 text-blue-500" />
                  <h3 className="text-lg font-semibold">{t('selfAssessment.result.concern')}</h3>
                </div>
                <p className="text-muted-foreground">{identificationResult.identifiedPart.concern}</p>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <MessageSquareHeart className="w-4 h-4 text-green-500" />
                  <h3 className="text-lg font-semibold">{t('selfAssessment.result.suggestedEngagement')}</h3>
                </div>
                <p className="text-muted-foreground">{identificationResult.suggestedEngagement}</p>
                <p className="text-sm text-muted-foreground italic">{t('selfAssessment.result.engagementDescription')}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                onClick={() => window.location.href = `/${locale}/parts-journal?part=${encodeURIComponent(identificationResult.identifiedPart.partName)}`}
                size="lg"
                className="w-full sm:flex-1"
                variant="default"
              >
                <BookOpen className="mr-2 h-4 w-4" /> {t('selfAssessment.startPartJournalButton')}
              </Button>
              <PremiumButton 
                onClick={handleResolvePart} 
                disabled={isLoadingResolve}
                size="lg"
                className="w-full sm:flex-1"
                tooltipText={t('selfAssessment.premiumFeatureTooltip')}
                wrap={true}
              >
                {isLoadingResolve && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <MessageSquareHeart className="mr-2 h-4 w-4" /> {t('selfAssessment.explorePartButton')}
              </PremiumButton>
            </div>
          </CardFooter>
        </Card>
      )}

      {resolutionResult && (
        <Card className="shadow-lg bg-gradient-to-br from-green-50 to-blue-50 border-green-200 dark:from-green-950/20 dark:to-blue-950/20 dark:border-green-900">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <MessageSquareHeart className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              <div>
                <CardTitle className="text-xl md:text-2xl text-green-800 dark:text-green-200">
                  Compassionate Resolution
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  A deeper understanding and path forward
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-primary" />
                    <h3 className="text-lg font-semibold">{t('selfAssessment.result.role')}</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300">{resolutionResult.role}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <h3 className="text-lg font-semibold">{t('selfAssessment.result.burden')}</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300">{resolutionResult.burden}</p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <BrainCircuit className="w-4 h-4 text-blue-500" />
                    <h3 className="text-lg font-semibold">{t('selfAssessment.result.concern')}</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300">{resolutionResult.concern}</p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquareHeart className="w-4 h-4 text-green-500" />
                    <h3 className="text-lg font-semibold">{t('selfAssessment.result.suggestedEngagement')}</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300 capitalize">{resolutionResult.engagementStrategy}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 italic">{t('selfAssessment.result.engagementDescription')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 