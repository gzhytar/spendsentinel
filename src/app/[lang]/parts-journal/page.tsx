'use client';

import { useState, useEffect, useRef } from 'react';
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

interface PartsJournalProps {
  params: Promise<{
    lang: string;
  }>;
}

interface JournalSession {
  id: string;
  partName: string;
  currentStep: number;
  startTime: string;
  lastSaved: string;
  completed: boolean;
  content: {
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
  };
}

export default function PartsJournal({ params }: PartsJournalProps) {
  const { lang } = use(params);
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const userParts = useIdentifiedParts();
  
  const [journalSession, setJournalSession] = useState<JournalSession>({
    id: '',
    partName: '',
    currentStep: 1,
    startTime: '',
    lastSaved: '',
    completed: false,
    content: {
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
    },
  });

  // Load existing session or create new one
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const partParam = urlParams.get('part');
    const sessionParam = urlParams.get('session');
    
    if (sessionParam) {
      // Load existing session
      const savedSession = localStorage.getItem(`partsJournal_${sessionParam}`);
      if (savedSession) {
        const session = JSON.parse(savedSession);
        setJournalSession(session);
        setCurrentStep(session.currentStep);
        setSelectedPart(session.partName);
        setSessionId(session.id);
      }
    } else if (partParam && userParts.includes(partParam)) {
      // Start new session for specific part
      startNewSession(partParam);
    }
  }, [userParts]);

  const startNewSession = (partName: string) => {
    const newSessionId = `${Date.now()}_${partName}`;
    const newSession: JournalSession = {
      id: newSessionId,
      partName,
      currentStep: 1,
      startTime: new Date().toISOString(),
      lastSaved: new Date().toISOString(),
      completed: false,
      content: {
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
      },
    };
    
    setJournalSession(newSession);
    setSelectedPart(partName);
    setSessionId(newSessionId);
    setCurrentStep(1);
    setShowHistory(false);
    
    // Update URL
    window.history.pushState({}, '', `?part=${partName}&session=${newSessionId}`);
    
    saveSession(newSession);
  };

  const saveSession = (session: JournalSession) => {
    const updatedSession = {
      ...session,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(`partsJournal_${session.id}`, JSON.stringify(updatedSession));
    
    // Update session list
    const sessionList = JSON.parse(localStorage.getItem('partsJournalSessions') || '[]');
    const existingIndex = sessionList.findIndex((s: any) => s.id === session.id);
    const sessionSummary = {
      id: session.id,
      partName: session.partName,
      startTime: session.startTime,
      lastSaved: updatedSession.lastSaved,
      completed: session.completed,
      currentStep: session.currentStep,
    };
    
    if (existingIndex >= 0) {
      sessionList[existingIndex] = sessionSummary;
    } else {
      sessionList.push(sessionSummary);
    }
    
    localStorage.setItem('partsJournalSessions', JSON.stringify(sessionList));
  };

  const handleStepContent = (stepNumber: number, content: any) => {
    const updatedSession = { ...journalSession };
    
    if (stepNumber === 1) {
      updatedSession.content.step1 = content;
    } else if (stepNumber === 2) {
      updatedSession.content.step2 = content;
    } else if (stepNumber === 3) {
      updatedSession.content.step3 = { ...updatedSession.content.step3, ...content };
    } else if (stepNumber === 4) {
      updatedSession.content.step4 = content;
    }
    
    updatedSession.currentStep = stepNumber;
    setJournalSession(updatedSession);
    saveSession(updatedSession);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const updatedSession = { ...journalSession, currentStep: nextStep };
      setJournalSession(updatedSession);
      saveSession(updatedSession);
      
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
      const updatedSession = { ...journalSession, currentStep: prevStep };
      setJournalSession(updatedSession);
      saveSession(updatedSession);
      
      containerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleCompleteSession = () => {
    const completedSession = {
      ...journalSession,
      completed: true,
      currentStep: 4,
    };
    
    setJournalSession(completedSession);
    saveSession(completedSession);
    
    // Show completion message
    window.alert(t('partsJournal.completionMessage'));
    
    // Navigate to history view
    setShowHistory(true);
    window.history.pushState({}, '', '/parts-journal');
  };

  const progressPercentage = (currentStep / 4) * 100;

  if (showHistory || (!selectedPart && userParts.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('partsJournal.title')}</h1>
          <p className="text-muted-foreground mb-6">{t('partsJournal.subtitle')}</p>
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
                {userParts.map((part) => (
                  <Card key={part} className="p-4 hover:shadow-md transition-shadow cursor-pointer" 
                        onClick={() => startNewSession(part)}>
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-primary" />
                      <span className="font-medium">{part}</span>
                    </div>
                  </Card>
                ))}
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

  if (!selectedPart) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">{t('partsJournal.selectPartTitle')}</h2>
          <p className="text-muted-foreground mb-6">{t('partsJournal.selectPartMessage')}</p>
          <Button onClick={() => setShowHistory(true)}>
            {t('partsJournal.viewHistory')}
          </Button>
        </Card>
      </div>
    );
  }

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
          <Button variant="outline" onClick={() => setShowHistory(true)}>
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
            content={journalSession.content.step1}
            onContentChange={(content) => handleStepContent(1, content)}
          />
        )}

        {currentStep === 2 && (
          <FindFocusStep
            partName={selectedPart}
            content={journalSession.content.step2}
            onContentChange={(content: string) => handleStepContent(2, content)}
          />
        )}

        {currentStep === 3 && (
          <CuriousDialogueStep
            partName={selectedPart}
            content={journalSession.content.step3}
            onContentChange={(content: Partial<typeof journalSession.content.step3>) => handleStepContent(3, content)}
          />
        )}

        {currentStep === 4 && (
          <AppreciateLogStep
            partName={selectedPart}
            content={journalSession.content.step4}
            sessionContent={journalSession.content}
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