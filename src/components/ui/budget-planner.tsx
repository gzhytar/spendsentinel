'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { BudgetManagement } from '@/components/ui/budget-management';
import { useBudget } from '@/hooks/use-budget';

export function MyBudgetPlanner() {
  const { t } = useI18n();
  const { budget, updateBudget } = useBudget();
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

  const openBudgetDialog = () => {
    setIsBudgetDialogOpen(true);
  };

  const handleBudgetSave = (newBudget: { monthlyIncome: number; spendBudget: number; savingTarget: number }) => {
    updateBudget(newBudget);
    setIsBudgetDialogOpen(false);
  };

  // Check if budget is already set
  const hasBudget = budget.monthlyIncome > 0;
  const buttonVariant = hasBudget ? "outline" : "default";
  const buttonText = hasBudget ? t('expenseHighlighter.budgetPlanner.editBudgetButton') : t('expenseHighlighter.budgetPlanner.setBudgetButton');

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">{t('expenseHighlighter.budgetPlanner.title')}</CardTitle>
          </div>
          <CardDescription>
            {t('expenseHighlighter.budgetPlanner.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 p-6 rounded-lg space-y-4">
            <BudgetManagement budget={budget} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={openBudgetDialog} variant={buttonVariant}>
            <Calculator className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        </CardFooter>
      </Card>

      {/* Budget Management Dialog */}
      <BudgetManagement.Dialog
        isOpen={isBudgetDialogOpen}
        onClose={() => setIsBudgetDialogOpen(false)}
        initialBudget={budget}
        onSave={handleBudgetSave}
      />
    </>
  );
} 