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
import { Loader2, Wand2, MessageSquareHeart, UserCheck, AlertTriangle, BrainCircuit, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { IdentifyIFSPartInput, IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';
import type { IFSPartResolutionInput, IFSPartResolutionOutput } from '@/ai/flows/ifs-part-resolution';
import { useI18n } from '@/contexts/i18n-context';

const identifySchema = z.object({
  financialSituation: z.string().min(10, "Please describe your financial situation in more detail."),
  recentFinancialBehavior: z.string().min(10, "Please describe your recent financial behavior."),
  personalityType: z.string().min(1, "Please select a personality type."),
});

type IdentifyFormValues = z.infer<typeof identifySchema>;

const LOCAL_STORAGE_KEY = 'identifiedFinancialParts';

export default function IFSDialoguePage() {
  const { t, locale } = useI18n();
  const [isLoadingIdentify, setIsLoadingIdentify] = useState(false);
  const [isLoadingResolve, setIsLoadingResolve] = useState(false);
  const [identificationResult, setIdentificationResult] = useState<IdentifyIFSPartOutput | null>(null);
  const [resolutionResult, setResolutionResult] = useState<IFSPartResolutionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showIdentifyForm, setShowIdentifyForm] = useState(true);

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
      personalityType: "",
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
      setError(t('ifsDialogue.error.identifyFailed'));
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
      setError(t('ifsDialogue.error.resolveFailed'));
    } finally {
      setIsLoadingResolve(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {showIdentifyForm ? (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BrainCircuit className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">{t('ifsDialogue.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('ifsDialogue.subtitle')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={identifyForm.handleSubmit(handleIdentifySubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="financialSituation">{t('ifsDialogue.form.financialSituation.label')}</Label>
                <Textarea
                  id="financialSituation"
                  placeholder={t('ifsDialogue.form.financialSituation.placeholder')}
                  {...identifyForm.register("financialSituation")}
                  className="min-h-[100px]"
                />
                {identifyForm.formState.errors.financialSituation && (
                  <p className="text-sm text-destructive">{t('ifsDialogue.form.financialSituation.error')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recentFinancialBehavior">{t('ifsDialogue.form.recentFinancialBehavior.label')}</Label>
                <Textarea
                  id="recentFinancialBehavior"
                  placeholder={t('ifsDialogue.form.recentFinancialBehavior.placeholder')}
                  {...identifyForm.register("recentFinancialBehavior")}
                  className="min-h-[100px]"
                />
                {identifyForm.formState.errors.recentFinancialBehavior && (
                  <p className="text-sm text-destructive">{t('ifsDialogue.form.recentFinancialBehavior.error')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalityType">{t('ifsDialogue.form.personalityType.label')}</Label>
                <Select onValueChange={(value) => identifyForm.setValue('personalityType', value)} defaultValue={identifyForm.getValues('personalityType')}>
                  <SelectTrigger id="personalityType">
                    <SelectValue placeholder={t('ifsDialogue.form.personalityType.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analytical">{t('ifsDialogue.form.personalityType.options.analytical')}</SelectItem>
                    <SelectItem value="expressive">{t('ifsDialogue.form.personalityType.options.expressive')}</SelectItem>
                    <SelectItem value="amiable">{t('ifsDialogue.form.personalityType.options.amiable')}</SelectItem>
                    <SelectItem value="driver">{t('ifsDialogue.form.personalityType.options.driver')}</SelectItem>
                    <SelectItem value="gentle">{t('ifsDialogue.form.personalityType.options.gentle')}</SelectItem>
                  </SelectContent>
                </Select>
                {identifyForm.formState.errors.personalityType && (
                  <p className="text-sm text-destructive">{t('ifsDialogue.form.personalityType.error')}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoadingIdentify} size="lg">
                {isLoadingIdentify && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Wand2 className="mr-2 h-4 w-4" /> {t('ifsDialogue.identifyButton')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="flex justify-end mb-4">
          <Button onClick={handleNewIdentification} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> {t('ifsDialogue.repeatAssessmentButton')}
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('ifsDialogue.error.title')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {identificationResult && (
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
                <MessageSquareHeart className="w-8 h-8 text-accent" />
                <CardTitle className="text-2xl">{t('ifsDialogue.result.title').replace('{partName}', identificationResult.identifiedPart.partName)}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('ifsDialogue.result.role')}:</h3>
              <p className="text-muted-foreground">{identificationResult.identifiedPart.role}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('ifsDialogue.result.burden')}:</h3>
              <p className="text-muted-foreground">{identificationResult.identifiedPart.burden}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('ifsDialogue.result.concern')}:</h3>
              <p className="text-muted-foreground">{identificationResult.identifiedPart.concern}</p>
            </div>
            <Separator className="my-6" />
            <div>
                <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-lg">{t('ifsDialogue.result.suggestedEngagement')}:</h3>
                </div>
                <p className="text-muted-foreground mt-2">{identificationResult.suggestedEngagement}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleResolvePart} disabled={isLoadingResolve} size="lg">
              {isLoadingResolve && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               <Wand2 className="mr-2 h-4 w-4" />
              {t('ifsDialogue.explorePartButton')}
            </Button>
          </CardFooter>
        </Card>
      )}

      {resolutionResult && (
         <Card className="shadow-lg mt-8">
          <CardHeader>
             <div className="flex items-center space-x-3">
                <MessageSquareHeart className="w-8 h-8 text-green-500" />
                <CardTitle className="text-2xl">{t('ifsDialogue.result.title').replace('{partName}', identificationResult?.identifiedPart.partName || '')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('ifsDialogue.result.role')}:</h3>
              <p className="text-muted-foreground">{resolutionResult.role}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('ifsDialogue.result.burden')}:</h3>
              <p className="text-muted-foreground">{resolutionResult.burden}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">{t('ifsDialogue.result.concern')}:</h3>
              <p className="text-muted-foreground">{resolutionResult.concern}</p>
            </div>
            <Separator className="my-6" />
            <div>
                <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-lg">{t('ifsDialogue.result.suggestedEngagement')}:</h3>
                </div>
              <p className="text-muted-foreground mt-1 capitalize">{resolutionResult.engagementStrategy}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('ifsDialogue.result.engagementDescription')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}