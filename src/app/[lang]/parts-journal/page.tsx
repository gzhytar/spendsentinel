'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PanicButton } from '@/components/common/panic-button';
import { MessageCircle, Sparkles } from 'lucide-react';
import { SafeEnvironmentStep } from '@/components/parts-journal/safe-environment-step';
import { FindFocusStep } from '@/components/parts-journal/find-focus-step';
import { CuriousDialogueStep } from '@/components/parts-journal/curious-dialogue-step';
import { AppreciateLogStep } from '@/components/parts-journal/appreciate-log-step';
import { useOnboardingTracking } from '@/hooks/use-onboarding-tracking';

interface PartsJournalProps {
  params: Promise<{
    lang: string;
  }>;
}

interface JournalContent {
  step1: string;
  step2: string;
  step3: {
    positiveIntention: string;
    fears: string;
    protectionOrigins: string;
    agePerception: string;
    trustNeeds: string;
    additionalInsights: string;
  };
  step4: string;
}

export default function PartsJournal({ params }: PartsJournalProps) {
  const { lang } = use(params);
  const { t } = useI18n();
  const trackOnboarding = useOnboardingTracking();
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for introduction
  const [selectedPart, setSelectedPart] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  
  const [journalContent, setJournalContent] = useState<JournalContent>({
    step1: '',
    step2: '',
    step3: {
      positiveIntention: '',
      fears: '',
      protectionOrigins: '',
      agePerception: '',
      trustNeeds: '',
      additionalInsights: '',
    },
    step4: '',
  });

  // Check URL parameters on mount to auto-start session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const partParam = urlParams.get('part');
      
      if (partParam) {
        // Auto-start session with the specified part
        startNewSession(decodeURIComponent(partParam));
      } else {
        // Redirect to self-assessment if no part is specified
        window.location.href = `/${lang}/self-assessment`;
      }
    }
  }, [lang]);

  const startNewSession = (partName: string) => {
    setSelectedPart(partName);
    setCurrentStep(0); // Start with introduction step
    
    // Reset content for new session
    setJournalContent({
      step1: '',
      step2: '',
      step3: {
        positiveIntention: '',
        fears: '',
        protectionOrigins: '',
        agePerception: '',
        trustNeeds: '',
        additionalInsights: '',
      },
      step4: '',
    });
  };

  const handleStepContent = (stepNumber: number, content: string | Partial<JournalContent['step3']>) => {
    if (stepNumber === 1 && typeof content === 'string') {
      setJournalContent(prev => ({ ...prev, step1: content }));
    } else if (stepNumber === 2 && typeof content === 'string') {
      setJournalContent(prev => ({ ...prev, step2: content }));
    } else if (stepNumber === 3 && typeof content === 'object') {
      setJournalContent(prev => ({ ...prev, step3: { ...prev.step3, ...content } }));
    } else if (stepNumber === 4 && typeof content === 'string') {
      setJournalContent(prev => ({ ...prev, step4: content }));
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      containerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      containerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleCompleteSession = () => {
    // Track parts session completion in onboarding flow
    trackOnboarding('PARTS_SESSION_COMPLETE', {
      part_name: selectedPart,
      session_steps_completed: 4,
      total_content_length: JSON.stringify(journalContent).length,
    });
    
    // Check if we came from daily check-in
    const urlParams = new URLSearchParams(window.location.search);
    const returnToDailyCheckIn = urlParams.get('returnToDailyCheckIn');
    const returnContext = localStorage.getItem('dailyCheckInReturnContext');
    
    if (returnToDailyCheckIn === 'true' && returnContext) {
      // Save completed session first
      const completedSession = {
        id: `${Date.now()}_${selectedPart}`,
        partName: selectedPart,
        completionTime: new Date().toISOString(),
        content: journalContent,
      };
      
      // Store in completed sessions
      const completedSessions = JSON.parse(localStorage.getItem('completedPartsJournalSessions') || '[]');
      completedSessions.push(completedSession);
      localStorage.setItem('completedPartsJournalSessions', JSON.stringify(completedSessions));
      
      // Return to daily check-in
      window.location.href = `/${lang}/daily-checkin`;
      return;
    }

    // Normal completion flow - Save completed session and return to self-assessment
    const completedSession = {
      id: `${Date.now()}_${selectedPart}`,
      partName: selectedPart,
      completionTime: new Date().toISOString(),
      content: journalContent,
    };
    
    // Store in completed sessions
    const completedSessions = JSON.parse(localStorage.getItem('completedPartsJournalSessions') || '[]');
    completedSessions.push(completedSession);
    localStorage.setItem('completedPartsJournalSessions', JSON.stringify(completedSessions));
    
    // Navigate back to self-assessment
    window.location.href = `/${lang}/self-assessment`;
  };

  const progressPercentage = ((currentStep) / 4) * 100;

  // Always show active session interface since we require a part parameter
  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      {/* Header with Progress */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {currentStep === 0 
              ? t('partsJournal.title')
              : t('partsJournal.sessionTitle', { partName: selectedPart })
            }
          </h1>
          <p className="text-muted-foreground">
            {currentStep === 0 
              ? t('partsJournal.introduction.subtitle')
              : t('partsJournal.sessionSubtitle')
            }
          </p>
        </div>
        
        {currentStep > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {t('partsJournal.progress', { current: currentStep, total: 4 })}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </div>

      <PanicButton />

      {/* Step Content */}
      <Card ref={containerRef} className="shadow-lg">
        <CardContent className="p-6">
        {/* Introduction Step */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold">{t('partsJournal.introduction.title')}</h2>
                <p className="text-muted-foreground">{t('partsJournal.introduction.subtitle')}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <p>{t('partsJournal.introduction.description')}</p>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t('partsJournal.introduction.stepPreview.title')}
                </h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">1</Badge>
                    <span>{t('partsJournal.introduction.stepPreview.step1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">2</Badge>
                    <span>{t('partsJournal.introduction.stepPreview.step2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">3</Badge>
                    <span>{t('partsJournal.introduction.stepPreview.step3')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">4</Badge>
                    <span>{t('partsJournal.introduction.stepPreview.step4')}</span>
                  </div>
                </div>
              </div>

              <Card className="p-4 bg-accent/5 border-accent/20">
                <p className="text-sm text-center">
                  <strong>{t('partsJournal.introduction.selectedPart.title', { partName: selectedPart })}</strong>
                </p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {t('partsJournal.introduction.selectedPart.subtitle')}
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Structured Dialog Steps */}
        {currentStep === 1 && (
          <SafeEnvironmentStep
            partName={selectedPart}
            content={journalContent.step1}
            onContentChange={(content) => handleStepContent(1, content)}
          />
        )}

        {currentStep === 2 && (
          <FindFocusStep
            partName={selectedPart}
            content={journalContent.step2}
            onContentChange={(content: string) => handleStepContent(2, content)}
          />
        )}

        {currentStep === 3 && (
          <CuriousDialogueStep
            partName={selectedPart}
            content={journalContent.step3}
            onContentChange={(content: Partial<typeof journalContent.step3>) => handleStepContent(3, content)}
          />
        )}

        {currentStep === 4 && (
          <AppreciateLogStep
            partName={selectedPart}
            content={journalContent.step4}
            sessionContent={journalContent}
            onContentChange={(content) => handleStepContent(4, content)}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            {t('partsJournal.navigation.previous')}
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNextStep}>
              {currentStep === 0 
                ? t('partsJournal.navigation.start')
                : t('partsJournal.navigation.next')
              }
            </Button>
          ) : (
            <Button onClick={handleCompleteSession}>
              <Sparkles className="h-4 w-4 mr-2" />
              {t('partsJournal.navigation.complete')}
            </Button>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
} 