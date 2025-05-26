'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { PanicButton } from '@/components/common/panic-button';
import { Calendar, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { CheckinTimeline } from '@/components/daily-checkin';
import { AddExpenseForm, type Expense } from '@/components/ui/add-expense-form';
import { ExpenseList } from '@/components/ui/expense-list';
import { SelfCompassionScore } from '@/components/ui/self-compassion-score';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { expenseStorage } from '@/lib/expense-storage';
import { useIdentifiedParts } from '@/lib/assessment-utils';
import { use } from 'react';

interface DailyCheckInProps {
  params: Promise<{
    lang: string;
  }>;
}

export default function DailyCheckIn({ params }: DailyCheckInProps) {
  const { lang } = use(params);
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [checkInData, setCheckInData] = useState({
    selfCompassionScore: 5,
    expenses: [] as Expense[],
    triggeredParts: {} as Record<string, string>,
  });
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  
  // Get user's identified parts from self-assessment results
  const userParts = useIdentifiedParts();

  // Auto-save progress to localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('dailyCheckInProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setCurrentStep(parsed.currentStep);
      setCheckInData(parsed.checkInData);
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
    }));
  }, [currentStep, checkInData]);

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
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
    
    // Scroll to top after reset for better UX
    containerRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const progressPercentage = (currentStep / 6) * 100;

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header with Progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('dailyCheckIn.title')}</h1>
        <p className="text-muted-foreground mb-6">{t('dailyCheckIn.subtitle')}</p>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {t('dailyCheckIn.progress', { current: currentStep, total: 6 })}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
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
      <Card className="p-6">
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
            
            <blockquote className="italic text-lg text-center text-primary-foreground max-w-md mx-auto my-8 px-8 py-6 border-l-4 border-primary/40 bg-primary/5 rounded-r-lg shadow-sm">
              "The quieter you become, the more you can hear."
              <footer className="text-sm mt-3 text-muted-foreground">— Ram Dass</footer>
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

        {/* Step 4: Timeline */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('dailyCheckIn.steps.timeline.title')}</h2>
            <p className="text-muted-foreground">{t('dailyCheckIn.steps.timeline.caption')}</p>
            <CheckinTimeline lang={lang} />
          </div>
        )}

        {/* Step 5: Deepen Relationships */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('dailyCheckIn.steps.deepenRelationships.title')}</h2>
            <p className="text-muted-foreground">
              {t('dailyCheckIn.steps.deepenRelationships.description')}
            </p>
            <div className="flex justify-center">
              <Button variant="outline" disabled className="relative">
                {t('dailyCheckIn.steps.deepenRelationships.button')}
                <Badge className="absolute -top-2 -right-2" variant="secondary">
                  {t('dailyCheckIn.comingSoon')}
                </Badge>
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Self-Compassion Score */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t('dailyCheckIn.steps.selfCompassion.title')}</h2>
            <p className="text-muted-foreground">
              {t('dailyCheckIn.steps.selfCompassion.prompt')}
            </p>
            
            <SelfCompassionScore
              initialScore={checkInData.selfCompassionScore}
              onScoreSave={(score) => {
                setCheckInData({ ...checkInData, selfCompassionScore: score });
                
                // Also save to calm history for consistency with self-compassion page
                const newEntry = { date: new Date().toLocaleDateString(), score };
                const storedHistory = localStorage.getItem('calmHistory');
                const calmHistory = storedHistory ? JSON.parse(storedHistory) : [];
                const updatedHistory = [...calmHistory, newEntry].slice(-7); // Keep last 7 entries
                localStorage.setItem('calmHistory', JSON.stringify(updatedHistory));
              }}
              showPrompt={true}
              compact={true}
              showActions={false}
            />
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
          
          {currentStep < 6 ? (
            <Button onClick={handleNextStep}>
              {t('dailyCheckIn.navigation.next')}
            </Button>
          ) : (
            <Button onClick={handleCompleteCheckIn}>
              {t('dailyCheckIn.navigation.complete')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
} 