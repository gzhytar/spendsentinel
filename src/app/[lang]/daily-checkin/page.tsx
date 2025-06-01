'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { PanicButton } from '@/components/common/panic-button';
import { Calendar, ShieldAlert, Heart } from 'lucide-react';
import Image from 'next/image';
import { CheckinTimeline } from '@/components/daily-checkin';
import { AddExpenseForm, type Expense } from '@/components/ui/add-expense-form';
import { ExpenseList } from '@/components/ui/expense-list';
import { SelfCompassionScore } from '@/components/ui/self-compassion-score';
import { CompassionTimeline } from '@/components/ui/compassion-timeline';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { expenseStorage } from '@/lib/expense-storage';
import { useIdentifiedParts } from '@/lib/assessment-utils';
import { use } from 'react';
import { completeOnboardingSession } from '@/lib/analytics-utils';
import { useOnboardingTracking } from '@/hooks/use-onboarding-tracking';

interface DailyCheckInProps {
  params: Promise<{
    lang: string;
  }>;
}

export default function DailyCheckIn({ params }: DailyCheckInProps) {
  const { lang } = use(params);
  const { t } = useI18n();
  const trackOnboarding = useOnboardingTracking();
  const [currentStep, setCurrentStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [checkInData, setCheckInData] = useState({
    selfCompassionScore: 5,
    expenses: [] as Expense[],
    triggeredParts: {} as Record<string, string>,
  });
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [isScoreSaved, setIsScoreSaved] = useState(false);
  
  // Get user's identified parts from self-assessment results
  const userParts = useIdentifiedParts();

  // Auto-save progress to localStorage
  useEffect(() => {
    // Check if returning from Parts Journal
    const returnContext = localStorage.getItem('dailyCheckInReturnContext');
    if (returnContext) {
      const parsed = JSON.parse(returnContext);
      if (parsed.fromDailyCheckIn) {
        // Restore state and go to step 5 (self-compassion)
        setCurrentStep(parsed.currentStep);
        setCheckInData(parsed.checkInData);
        setIsScoreSaved(parsed.isScoreSaved || false);
        
        // Clean up return context
        localStorage.removeItem('dailyCheckInReturnContext');
        
        // Show welcome back message
        setTimeout(() => {
          window.alert('Welcome back! Your parts journal session has been completed. Please continue with your self-compassion check-in.');
        }, 500);
        
        return; // Don't load saved progress, use return context instead
      }
    }
    
    // Normal flow - load saved progress
    const savedProgress = localStorage.getItem('dailyCheckInProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setCurrentStep(parsed.currentStep);
      setCheckInData(parsed.checkInData);
      setIsScoreSaved(parsed.isScoreSaved || false);
    }
    
    // Load existing expenses from shared storage (same as Expense Highlighter)
    // Only show today's expenses in the daily check-in
    const todaysExpenses = expenseStorage.getToday();
    
    setCheckInData(prev => ({
      ...prev,
      expenses: todaysExpenses
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyCheckInProgress', JSON.stringify({
      currentStep,
      checkInData,
      isScoreSaved,
    }));
  }, [currentStep, checkInData, isScoreSaved]);

  const handleNextStep = () => {
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Track daily check-in step completion in onboarding flow
      trackOnboarding('DAILY_CHECKIN_STEP_COMPLETE', {
        step: nextStep,
        total_steps: 5,
        progress_percentage: (nextStep / 5) * 100,
      });
      
      // Scroll to top of the container for better navigation
      containerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of the container for better navigation
      containerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>, journalNotes?: Record<string, string>) => {
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      triggeredParts: selectedParts,
    };
    
    // Track expense add in onboarding flow
    trackOnboarding('EXPENSE_ADD_CLICK', {
      expense_category: expenseData.category,
      has_triggered_parts: selectedParts.length > 0,
      triggered_parts_count: selectedParts.length,
    });
    
    // Save to shared expenses storage (same as Expense Highlighter)
    expenseStorage.add(expense);
    
    setCheckInData(prev => {
      const updatedTriggeredParts = { ...prev.triggeredParts };
      
      // Add journal notes for each selected part
      if (journalNotes) {
        Object.entries(journalNotes).forEach(([part, note]) => {
          const key = `${expense.id}-${part}`;
          updatedTriggeredParts[key] = note;
        });
      }
      
      return {
        ...prev,
        expenses: [...prev.expenses, expense],
        triggeredParts: updatedTriggeredParts
      };
    });
    
    // Reset selected parts
    setSelectedParts([]);
  };

  const handlePartToggle = (part: string, isSelected: boolean) => {
    setSelectedParts(prev => 
      isSelected 
        ? [...prev, part]
        : prev.filter(p => p !== part)
    );
  };

  const removeExpense = (id: string) => {
    // Remove from shared expenses storage (same as Expense Highlighter)
    expenseStorage.remove(id);
    
    setCheckInData(prev => {
      const updatedExpenses = prev.expenses.filter(e => e.id !== id);
      
      // Remove associated journal notes
      const updatedTriggeredParts = { ...prev.triggeredParts };
      Object.keys(updatedTriggeredParts).forEach(key => {
        if (key.startsWith(`${id}-`)) {
          delete updatedTriggeredParts[key];
        }
      });
      
      return {
        ...prev,
        expenses: updatedExpenses,
        triggeredParts: updatedTriggeredParts
      };
    });
  };

  const handleCompleteCheckIn = async () => {
    // Track onboarding completion
    trackOnboarding('ONBOARDING_COMPLETE', {
      completed_expenses: checkInData.expenses.length,
      compassion_score: checkInData.selfCompassionScore,
    });
    
    // Complete and cleanup onboarding session
    completeOnboardingSession();
    
    // Save completed check-in to database
    // For now, just clear the progress and mark today as completed
    localStorage.removeItem('dailyCheckInProgress');
    
    // Mark today as completed
    const today = new Date().toISOString().split('T')[0];
    const completedCheckIns = JSON.parse(localStorage.getItem('completedCheckIns') || '[]');
    if (!completedCheckIns.includes(today)) {
      completedCheckIns.push(today);
      localStorage.setItem('completedCheckIns', JSON.stringify(completedCheckIns));
    }
    
    // TODO: Save to database
    console.log('Check-in completed:', checkInData);
    
    // Show completion message
    window.alert(t('dailyCheckIn.completionMessage'));
    
    // Reset for new check-in
    setCurrentStep(1);
    setCheckInData({
      selfCompassionScore: 5,
      expenses: [],
      triggeredParts: {},
    });
    setSelectedParts([]);
    setIsScoreSaved(false);
    
    // Scroll to top after reset for better UX
    containerRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const progressPercentage = (currentStep / 5) * 100;

  // Function to get triggered parts from today's expenses
  const getTriggeredPartsDisplay = () => {
    const triggeredParts = [...new Set(
      checkInData.expenses
        .filter(expense => expense.triggeredParts && expense.triggeredParts.length > 0)
        .flatMap(expense => expense.triggeredParts || [])
    )];

    // Utility function to map part names to firefighter type IDs for image display
    const getFirefighterTypeId = (partName: string): string => {
      // Get the firefighter type names from translations
      const firefighterTypeNames: Record<string, string> = {
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

    const handleStartPartSession = (partName: string) => {
      // Track parts session start in onboarding flow
      trackOnboarding('PARTS_SESSION_START', {
        part_name: partName,
        source_page: 'daily_checkin_step_4',
      });
      
      // Store current daily check-in state before navigating
      localStorage.setItem('dailyCheckInReturnContext', JSON.stringify({
        currentStep: 5, // Return to self-compassion step
        checkInData,
        isScoreSaved,
        fromDailyCheckIn: true
      }));
      
      // Navigate to parts journal with the selected part
      window.location.href = `/${lang}/parts-journal?part=${encodeURIComponent(partName)}&returnToDailyCheckIn=true`;
    };

    if (triggeredParts.length === 0) {
      return (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No parts were triggered today</h3>
          <p className="text-muted-foreground">
            You haven&apos;t logged any expenses with triggered parts today. Continue with your self-compassion check-in.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Parts triggered in today&apos;s spending:</h3>
          <p className="text-muted-foreground">
            Deepen your relationship with the parts that showed up in your financial decisions today.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="grid gap-6 max-w-4xl">
            {triggeredParts.map((part) => {
              const firefighterTypeId = getFirefighterTypeId(part);
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
                      onClick={() => handleStartPartSession(part)}
                      className="w-full"
                      size="default"
                    >
                      Start New Session
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            After completing a parts journal session, you&apos;ll return to finish your daily check-in.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header with Progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('dailyCheckIn.title')}</h1>
        <p className="text-muted-foreground mb-6">{t('dailyCheckIn.subtitle')}</p>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {t('dailyCheckIn.progress', { current: currentStep, total: 5 })}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Check-in Timeline */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t('dailyCheckIn.steps.timeline.title')}</h2>
        </div>
        <CheckinTimeline lang={lang} />
      </div>

      {/* Panic Button Reminder Alert */}
      <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900">
        <AlertDescription className="text-red-800 dark:text-red-200 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-red-600 dark:bg-red-500 rounded-full flex-shrink-0">
            <ShieldAlert className="h-4 w-4 text-white" />
          </span>
          {t('dailyCheckIn.panicButtonReminder')}
        </AlertDescription>
      </Alert>  

      {/* Panic Button */}
      <PanicButton />

      {/* Step Content */}
      <Card ref={containerRef} className="p-6">
        {/* Step 1: Breathing Exercise */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('dailyCheckIn.steps.breathing.title')}</h2>
            <div className="bg-primary/5 p-6 rounded-lg">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {t('dailyCheckIn.steps.breathing.instruction')}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Day Reflection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('dailyCheckIn.steps.reflection.title')}</h2>
            <p className="text-muted-foreground">
              {t('dailyCheckIn.steps.reflection.prompt')}
            </p>
            
            <blockquote className="italic text-md text-center text-primary-foreground max-w-md mx-auto my-8 px-8 py-6 border-l-4 border-primary/40 bg-primary/5 rounded-r-lg shadow-sm">
              &quot;The quieter you become, the more you can hear.&quot;
              <footer className="text-sm mt-3 text-muted-foreground">&mdash; Ram Dass</footer>
            </blockquote>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-[250px] w-full rounded-lg overflow-hidden bg-primary/5">
                <Image 
                  src="/images/reflection-calm.jpg" 
                  alt="Calm reflective state"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Expense Logging */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('dailyCheckIn.steps.expenseLogging.title')}</h2>
            <p className="text-muted-foreground">
              {t('dailyCheckIn.steps.expenseLogging.description')}
            </p>

            {/* Add New Expense Form */}
            <AddExpenseForm
              onAddExpense={handleAddExpense}
              showTriggeredParts={true}
              availableParts={userParts}
              selectedParts={selectedParts}
              onPartToggle={handlePartToggle}
            />

            {/* Expense List */}
            {checkInData.expenses.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">{t('expenseHighlighter.yourExpenses')}</h3>
                
                <ExpenseList
                  expenses={checkInData.expenses}
                  onDelete={removeExpense}
                  showEditActions={false}
                />

                {/* Show Journal Notes Summary */}
                {checkInData.expenses.some(expense => expense.triggeredParts && expense.triggeredParts.length > 0) && (
                  <div className="space-y-4">
                    <h4 className="font-medium">{t('dailyCheckIn.steps.expenseLogging.journalNotes')}</h4>
                    {checkInData.expenses.map((expense) => (
                      expense.triggeredParts && expense.triggeredParts.length > 0 && (
                        <Card key={expense.id} className="p-4">
                          <h5 className="font-medium mb-3">{expense.description}</h5>
                          <div className="space-y-3">
                            {expense.triggeredParts.map((part) => {
                              const note = checkInData.triggeredParts[`${expense.id}-${part}`];
                              return note ? (
                                <div key={`${expense.id}-${part}`} className="space-y-2">
                                  <Label className="text-sm font-medium">{part}:</Label>
                                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                                    {note}
                                  </p>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </Card>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Deepen Relationships */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('dailyCheckIn.steps.deepenRelationships.title')}</h2>
            <p className="text-muted-foreground">
              {t('dailyCheckIn.steps.deepenRelationships.description')}
            </p>
            
            {getTriggeredPartsDisplay()}
          </div>
        )}

        {/* Step 5: Self-Compassion Score */}
        {currentStep === 5 && (
          <div className="space-y-6 overflow-hidden">
            <h2 className="text-2xl font-semibold">{t('dailyCheckIn.steps.selfCompassion.title')}</h2>
            <p className="text-muted-foreground">
              {t('dailyCheckIn.steps.selfCompassion.prompt')}
            </p>
            
            <div className="w-full overflow-hidden">
              <SelfCompassionScore
                initialScore={checkInData.selfCompassionScore}
                onScoreSave={(score) => {
                  setCheckInData({ ...checkInData, selfCompassionScore: score });
                  setIsScoreSaved(true);
                  
                  // Track compassion score save in onboarding flow
                  trackOnboarding('COMPASSION_SCORE_SAVE', {
                    score: score,
                    step: 5,
                  });
                  
                  // Save to calm history for consistency with self-compassion page
                  const newEntry = { date: new Date().toISOString().split('T')[0], score };
                  const storedHistory = localStorage.getItem('calmHistory');
                  const calmHistory = storedHistory ? JSON.parse(storedHistory) : [];
                  
                  // Keep all entries instead of just last 7 for better timeline tracking
                  const existingEntryIndex = calmHistory.findIndex((entry: { date: string; score: number }) => entry.date === newEntry.date);
                  if (existingEntryIndex >= 0) {
                    calmHistory[existingEntryIndex] = newEntry;
                  } else {
                    calmHistory.push(newEntry);
                  }
                  
                  localStorage.setItem('calmHistory', JSON.stringify(calmHistory));
                  
                  // Trigger storage event for real-time timeline updates
                  window.dispatchEvent(new StorageEvent('storage', {
                    key: 'calmHistory',
                    newValue: JSON.stringify(calmHistory)
                  }));
                }}
                showPrompt={true}
                compact={true}
                showActions={true}
              />
            </div>
            
            {/* Score save status indicator */}
            {!isScoreSaved && (
              <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  💡 {t('dailyCheckIn.steps.selfCompassion.savePrompt')}
                </p>
              </div>
            )}
            
            {/* Self-Compassion Timeline - Only show after score is saved */}
            {isScoreSaved && (
              <div className="mt-8 w-full overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{t('selfCompassion.journey.title')}</h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <CompassionTimeline lang={lang} />
                </div>
                
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅ {t('dailyCheckIn.steps.selfCompassion.scoreSaved')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            {t('dailyCheckIn.navigation.previous')}
          </Button>
          
          {currentStep < 5 ? (
            <Button onClick={handleNextStep}>
              {t('dailyCheckIn.navigation.next')}
            </Button>
          ) : (
            <Button onClick={handleCompleteCheckIn} disabled={!isScoreSaved}>
              {t('dailyCheckIn.navigation.complete')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
} 