"use client";

import { useState } from 'react';
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
import { identifyIFSPart, type IdentifyIFSPartInput, type IdentifyIFSPartOutput } from '@/ai/flows/ifs-part-identification';
import { ifsPartResolution, type IFSPartResolutionInput, type IFSPartResolutionOutput } from '@/ai/flows/ifs-part-resolution';
import { Loader2, Wand2, MessageSquareHeart, UserCheck, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const identifySchema = z.object({
  financialSituation: z.string().min(10, "Please describe your financial situation in more detail."),
  recentFinancialBehavior: z.string().min(10, "Please describe your recent financial behavior."),
  personalityType: z.string().min(1, "Please select a personality type."),
});

type IdentifyFormValues = z.infer<typeof identifySchema>;

export default function IFSDialoguePage() {
  const [isLoadingIdentify, setIsLoadingIdentify] = useState(false);
  const [isLoadingResolve, setIsLoadingResolve] = useState(false);
  const [identificationResult, setIdentificationResult] = useState<IdentifyIFSPartOutput | null>(null);
  const [resolutionResult, setResolutionResult] = useState<IFSPartResolutionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const result = await identifyIFSPart(data);
      setIdentificationResult(result);
    } catch (e) {
      console.error(e);
      setError("Failed to identify part. Please try again.");
    } finally {
      setIsLoadingIdentify(false);
    }
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
      };
      const result = await ifsPartResolution(input);
      setResolutionResult(result);
    } catch (e) {
      console.error(e);
      setError("Failed to resolve part. Please try again.");
    } finally {
      setIsLoadingResolve(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">IFS Dialogue: Understand Your Financial Parts</CardTitle>
          </div>
          <CardDescription>
            Use AI to identify and understand your inner financial "firefighter" parts using the 6F framework.
          </CardDescription>
        </CardHeader>
        <form onSubmit={identifyForm.handleSubmit(handleIdentifySubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="financialSituation">Your Current Financial Situation</Label>
              <Textarea
                id="financialSituation"
                placeholder="e.g., I'm struggling with debt, I'm saving for a house..."
                {...identifyForm.register("financialSituation")}
                className="min-h-[100px]"
              />
              {identifyForm.formState.errors.financialSituation && (
                <p className="text-sm text-destructive">{identifyForm.formState.errors.financialSituation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recentFinancialBehavior">Recent Financial Behavior/Decisions</Label>
              <Textarea
                id="recentFinancialBehavior"
                placeholder="e.g., I recently made a large impulse purchase, I avoided looking at my bank account..."
                {...identifyForm.register("recentFinancialBehavior")}
                className="min-h-[100px]"
              />
              {identifyForm.formState.errors.recentFinancialBehavior && (
                <p className="text-sm text-destructive">{identifyForm.formState.errors.recentFinancialBehavior.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalityType">Primary Communication Style</Label>
               <Select onValueChange={(value) => identifyForm.setValue('personalityType', value)} defaultValue={identifyForm.getValues('personalityType')}>
                <SelectTrigger id="personalityType">
                  <SelectValue placeholder="Select your preferred style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytical">Analytical & Direct</SelectItem>
                  <SelectItem value="expressive">Expressive & Enthusiastic</SelectItem>
                  <SelectItem value="amiable">Amiable & Supportive</SelectItem>
                  <SelectItem value="driver">Driver & Results-Oriented</SelectItem>
                   <SelectItem value="gentle">Gentle & Cautious</SelectItem>
                </SelectContent>
              </Select>
              {identifyForm.formState.errors.personalityType && (
                <p className="text-sm text-destructive">{identifyForm.formState.errors.personalityType.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoadingIdentify} size="lg">
              {isLoadingIdentify && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Wand2 className="mr-2 h-4 w-4" /> Identify Financial Part
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {identificationResult && (
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
                <MessageSquareHeart className="w-8 h-8 text-accent" />
                <CardTitle className="text-2xl">Identified Part: {identificationResult.identifiedPart.partName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary">Role:</h3>
              <p className="text-muted-foreground">{identificationResult.identifiedPart.role}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">Burden:</h3>
              <p className="text-muted-foreground">{identificationResult.identifiedPart.burden}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">Concern:</h3>
              <p className="text-muted-foreground">{identificationResult.identifiedPart.concern}</p>
            </div>
            <Separator className="my-6" />
            <div>
                <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-lg">Suggested Engagement:</h3>
                </div>
              <p className="text-muted-foreground mt-1">{identificationResult.suggestedEngagement}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleResolvePart} disabled={isLoadingResolve} size="lg">
              {isLoadingResolve && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               <Wand2 className="mr-2 h-4 w-4" />
              Explore This Part Deeper
            </Button>
          </CardFooter>
        </Card>
      )}

      {resolutionResult && (
         <Card className="shadow-lg mt-8">
          <CardHeader>
             <div className="flex items-center space-x-3">
                <MessageSquareHeart className="w-8 h-8 text-green-500" />
                <CardTitle className="text-2xl">Part Resolution Insights for "{identificationResult?.identifiedPart.partName}"</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary">Uncovered Role:</h3>
              <p className="text-muted-foreground">{resolutionResult.role}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">Identified Burden:</h3>
              <p className="text-muted-foreground">{resolutionResult.burden}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">Underlying Concern:</h3>
              <p className="text-muted-foreground">{resolutionResult.concern}</p>
            </div>
            <Separator className="my-6" />
            <div>
                <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-lg">Proposed Engagement Strategy:</h3>
                </div>
              <p className="text-muted-foreground mt-1 capitalize">{resolutionResult.engagementStrategy}</p>
              <p className="text-sm text-muted-foreground mt-1">
                This strategy suggests a tailored approach to communicate with this part based on its nature and your profile.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper icon components (can be moved to a separate file)
const BrainCircuit = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5v.343a3.5 3.5 0 0 0-3.5 3.5v3.314a3.5 3.5 0 0 0 3.5 3.5h.343a4.5 4.5 0 0 0 8.314 0h.343a3.5 3.5 0 0 0 3.5-3.5v-3.314a3.5 3.5 0 0 0-3.5-3.5V6.5A4.5 4.5 0 0 0 12 2Z"/>
    <path d="M12 13a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
    <path d="M17 13a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
    <path d="M12 17.5A2.5 2.5 0 1 0 9.5 20a2.5 2.5 0 0 0 2.5-2.5Z"/>
    <path d="M14.5 17.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
    <path d="M12 6.5A2.5 2.5 0 1 0 9.5 4A2.5 2.5 0 0 0 12 6.5Z"/>
    <path d="M14.5 6.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
    <path d="M7 13a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
  </svg>
);

