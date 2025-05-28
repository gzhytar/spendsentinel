'use client';

import { useState, useRef } from 'react';
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
const getFirefighterTypeId = (partName: string, t: any): string => {
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
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
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

  const startNewSession = (partName: string) => {
    setSelectedPart(partName);
    setCurrentStep(1);
    setShowHistory(false);
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

  const handleStepContent = (stepNumber: number, content: any) => {
    if (stepNumber === 1) {
      setJournalContent(prev => ({ ...prev, step1: content }));
    } else if (stepNumber === 2) {
      setJournalContent(prev => ({ ...prev, step2: content }));
    } else if (stepNumber === 3) {
      setJournalContent(prev => ({ ...prev, step3: { ...prev.step3, ...content } }));
    } else if (stepNumber === 4) {
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
    
    // Show completion message
    window.alert(t('partsJournal.completionMessage'));
    
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

  // Show introduction screen first
  if (showIntroduction) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('partsJournal.title')}</h1>
          <p className="text-muted-foreground mb-6">{t('partsJournal.subtitle')}</p>
        </div>

        <Card className="p-8 mb-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <MessageCircle className="h-16 w-16 text-primary" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Engage in structured dialogue with your financial parts</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                This journal provides a safe, structured space to understand and dialogue with the different parts of yourself that influence your financial decisions. Through compassionate inquiry, you'll discover the positive intentions behind your financial behaviors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="text-left space-y-3">
                <h3 className="font-semibold text-lg">What you'll explore:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Create a safe inner environment for dialogue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Locate and understand your financial parts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Discover their positive intentions and fears</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Build trust and appreciation with these parts</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-left space-y-3">
                <h3 className="font-semibold text-lg">The 4-step process:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">1</Badge>
                    <span>Safe Environment - Ground yourself and set intentions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">2</Badge>
                    <span>Find & Focus - Locate and observe your part</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">3</Badge>
                    <span>Curious Dialogue - Ask open-hearted questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">4</Badge>
                    <span>Appreciate & Log - Honor insights and express gratitude</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {userParts.length === 0 ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">Complete the self-assessment first to identify your financial parts.</p>
                  <Button onClick={() => window.location.href = '/self-assessment'}>
                    {t('partsJournal.goToAssessment')}
                  </Button>
                </div>
              ) : (
                <>
                  <Button onClick={() => setShowIntroduction(false)} size="lg">
                    Start New Session
                  </Button>
                  <Button variant="outline" onClick={() => { setShowIntroduction(false); setShowHistory(true); }} size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </>
              )}
            </div>
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

  // Show history and part selection screen
  if (showHistory || !selectedPart) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('partsJournal.title')}</h1>
              <p className="text-muted-foreground mb-6">{t('partsJournal.subtitle')}</p>
            </div>
            <Button variant="outline" onClick={() => setShowIntroduction(true)}>
              Back to Overview
            </Button>
          </div>
        </div>

        {userParts.length === 0 ? (
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">{t('partsJournal.noPartsTitle')}</h2>
            <p className="text-muted-foreground mb-6">{t('partsJournal.noPartsMessage')}</p>
            <Button onClick={() => window.location.href = '/self-assessment'}>
              {t('partsJournal.goToAssessment')}
            </Button>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('partsJournal.startNewSession')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userParts.map((part) => {
                  const firefighterTypeId = getFirefighterTypeId(part, t);
                  return (
                    <Card key={part} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
                          onClick={() => startNewSession(part)}>
                      <div className="relative h-32 w-full">
                        <Image
                          src={`/images/${firefighterTypeId}.jpg`}
                          alt={part}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <Heart className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="font-medium">{part}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{t('partsJournal.journalHistory')}</h2>
              </div>
              <PartsJournalTimeline lang={lang} />
            </div>
          </>
        )}

        <PanicButton />
      </div>
    );
  }

  // Show active session
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
          <Button variant="outline" onClick={() => setShowIntroduction(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            {t('partsJournal.viewHistory')}
          </Button>
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