'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AddExpenseForm, type Expense } from '@/components/ui/add-expense-form';
import { ExpenseList } from '@/components/ui/expense-list';

interface ExpenseLoggingStepProps {
  lang: string;
  expenses: Expense[];
  triggeredParts: Record<string, string>;
  onUpdate: (expenses: Expense[], triggeredParts: Record<string, string>) => void;
}

export function ExpenseLoggingStep({
  lang,
  expenses,
  triggeredParts,
  onUpdate,
}: ExpenseLoggingStepProps) {
  const { t } = useI18n();
  const [userParts, setUserParts] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  // Load user's identified parts from localStorage (from self-assessment)
  useEffect(() => {
    const assessmentResults = localStorage.getItem('assessmentResults');
    if (assessmentResults) {
      const results = JSON.parse(assessmentResults);
      // Extract parts from assessment results
      const parts = results.parts || ['Spender', 'Hoarder', 'Avoider', 'Indulger'];
      setUserParts(parts);
    } else {
      // Default parts if no assessment done
      setUserParts(['Spender', 'Hoarder', 'Avoider', 'Indulger']);
    }
  }, []);

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      triggeredParts: selectedParts,
    };
    
    onUpdate([...expenses, expense], triggeredParts);
    
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
    const updatedExpenses = expenses.filter(e => e.id !== id);
    
    // Remove associated journal notes
    const updatedTriggeredParts = { ...triggeredParts };
    Object.keys(updatedTriggeredParts).forEach(key => {
      if (key.startsWith(`${id}-`)) {
        delete updatedTriggeredParts[key];
      }
    });
    
    onUpdate(updatedExpenses, updatedTriggeredParts);
  };

  const updateJournalNote = (expenseId: string, part: string, note: string) => {
    const key = `${expenseId}-${part}`;
    const updated = { ...triggeredParts };
    
    if (note.trim()) {
      updated[key] = note;
    } else {
      delete updated[key];
    }
    
    onUpdate(expenses, updated);
  };

  return (
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
      {expenses.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">{t('expenseHighlighter.yourExpenses')}</h3>
          
          <ExpenseList
            expenses={expenses}
            onDelete={removeExpense}
            showEditActions={false}
          />

          {/* Journal Notes for Triggered Parts */}
          {expenses.some(expense => expense.triggeredParts && expense.triggeredParts.length > 0) && (
            <div className="space-y-4">
              <h4 className="font-medium">{t('dailyCheckIn.steps.expenseLogging.journalNotes')}</h4>
              {expenses.map((expense) => (
                expense.triggeredParts && expense.triggeredParts.length > 0 && (
                  <Card key={expense.id} className="p-4">
                    <h5 className="font-medium mb-3">{expense.description}</h5>
                    <div className="space-y-3">
                      {expense.triggeredParts.map((part) => (
                        <div key={`${expense.id}-${part}`} className="space-y-2">
                          <Label className="text-sm">{part} {t('dailyCheckIn.steps.expenseLogging.partNote')}</Label>
                          <Textarea
                            value={triggeredParts[`${expense.id}-${part}`] || ''}
                            onChange={(e) => updateJournalNote(expense.id, part, e.target.value)}
                            placeholder={t('dailyCheckIn.steps.expenseLogging.journalPlaceholder')}
                            className="min-h-[60px]"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 