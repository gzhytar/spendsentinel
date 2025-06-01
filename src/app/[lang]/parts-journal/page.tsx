'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PanicButton } from '@/components/common/panic-button';
import { Calendar, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { PartsJournalTimeline } from '@/components/parts-journal/parts-journal-timeline';
import { SafeEnvironmentStep } from '@/components/parts-journal/safe-environment-step';
import { FindFocusStep } from '@/components/parts-journal/find-focus-step';
import { CuriousDialogueStep } from '@/components/parts-journal/curious-dialogue-step';
import { AppreciateLogStep } from '@/components/parts-journal/appreciate-log-step';
import { useIdentifiedParts } from '@/lib/assessment-utils';
import { use } from 'react';
import Image from 'next/image';
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

// Utility function to map part names to firefighter type IDs for image display
const getFirefighterTypeId = (partName: string, t: (key: string) => string): string => {
  // Get the firefighter type names from translations
  const firefighterTypeNames = {
    spender: t('landing.firefighters.spender.title'),
    hoarder: t('landing.firefighters.hoarder.title'),
    avoider: t('landing.firefighters.avoider.title'),
    indulger: t('landing.firefighters.indulger.title')
  };
  
  // Find the type ID that matches the part name
  for (const [typeId, typeName] of Object.entries(firefighterTypeNames)) {
    if (typeName === partName) {
      return typeId;
    }
  }
  
  // Default fallback
  return 'spender';
};

export default function PartsJournal({ params }: PartsJournalProps) {
  const { lang } = use(params);
  const { t } = useI18n();
  const trackOnboarding = useOnboardingTracking();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [showIntroduction, setShowIntroduction] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const userParts = useIdentifiedParts();
  
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

  // Check URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const partParam = urlParams.get('part');
      const returnToDailyCheckIn = urlParams.get('returnToDailyCheckIn');
      
      if (partParam && returnToDailyCheckIn === 'true') {
        // Auto-start session with the specified part
        startNewSession(decodeURIComponent(partParam));
      }
    }
  }, []);

  const startNewSession = (partName: string) => {
    setSelectedPart(partName);
    setCurrentStep(1);
    setShowIntroduction(false);
    
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
    if (currentStep > 1) {
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

    // Normal completion flow (not from daily check-in)
    // Save completed session
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
    
    // Navigate back to introduction screen
    setShowIntroduction(true);
    setSelectedPart('');
    setCurrentStep(1);
    
    // Reset content
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

  const progressPercentage = (currentStep / 4) * 100;

  // Show introduction screen with part selection
  if (showIntroduction) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <MessageCircle className="h-16 w-16 text-primary flex-shrink-0" />
            <h1 className="text-3xl font-bold">{t('partsJournal.title')}</h1>
          </div>
          <p className="text-muted-foreground mb-6">{t('partsJournal.subtitle')}</p>
        </div>

        <Card className="p-8 mb-8">
          <div className="text-center space-y-6">
            <div className="space-y-4 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold">{t('partsJournal.introduction.title')}</h2>
              <div className="flex flex-col gap-4">
                <p className="text-lg text-muted-foreground max-w-2xl text-center">
                  {t('partsJournal.introduction.description')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="text-left space-y-3">
                <h3 className="font-semibold text-lg">{t('partsJournal.introduction.whatYouExplore.title')}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {(t('partsJournal.introduction.whatYouExplore.items') as string[]).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-left space-y-3">
                <h3 className="font-semibold text-lg">{t('partsJournal.introduction.fourStepProcess.title')}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {(t('partsJournal.introduction.fourStepProcess.steps') as string[]).map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">{index + 1}</Badge>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Start New Session Section with Part Images */}
            {userParts.length === 0 ? (
              <div className="text-center space-y-4 mt-8">
                <p className="text-muted-foreground">{t('partsJournal.introduction.noPartsMessage')}</p>
                <Button onClick={() => window.location.href = '/self-assessment'}>
                  {t('partsJournal.goToAssessment')}
                </Button>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                <h3 className="text-xl font-semibold text-center">{t('partsJournal.introduction.choosePartTitle')}</h3>
                <div className="flex justify-center">
                  <div className="grid gap-6 max-w-4xl">
                    {userParts.map((part) => {
                      const firefighterTypeId = getFirefighterTypeId(part, t);
                      return (
                        <Card key={part} className="overflow-hidden hover:shadow-md transition-shadow w-full max-w-sm mx-auto">
                          <div className="relative h-40 w-full">
                            <Image
                              src={`/images/${firefighterTypeId}.jpg`}
                              alt={part}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="p-6 space-y-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <Heart className="h-5 w-5 text-primary flex-shrink-0" />
                              <span className="font-semibold text-lg">{part}</span>
                            </div>
                            <Button 
                              onClick={() => startNewSession(part)}
                              className="w-full"
                              size="default"
                            >
                              {t('partsJournal.startNewSession')}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Journal Sessions Timeline */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">{t('partsJournal.journalHistory')}</h2>
          </div>
          <PartsJournalTimeline lang={lang} />
        </div>

        <PanicButton />
      </div>
    );
  }

  // Show active session (removed the intermediate part selection screen)
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('partsJournal.sessionTitle', { partName: selectedPart })}
            </h1>
            <p className="text-muted-foreground">{t('partsJournal.sessionSubtitle')}</p>
          </div>
        </div>
        
        <div className="mb-4">
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
      </div>

      <PanicButton />

      {/* Step Content */}
      <Card ref={containerRef} className="p-6">
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
            disabled={currentStep === 1}
          >
            {t('partsJournal.navigation.previous')}
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNextStep}>
              {t('partsJournal.navigation.next')}
            </Button>
          ) : (
            <Button onClick={handleCompleteSession}>
              <Sparkles className="h-4 w-4 mr-2" />
              {t('partsJournal.navigation.complete')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
} 