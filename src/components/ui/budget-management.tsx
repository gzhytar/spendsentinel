'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Calculator, Home, PiggyBank, Banknote } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { useCurrency } from '@/hooks/use-currency';
import { useBudget, type Budget } from '@/hooks/use-budget';
import { useAnalyticsContext } from '@/contexts/analytics-context';
import { trackOnboardingStepIfActive, ONBOARDING_FUNNEL_STEPS } from '@/lib/analytics-utils';

interface BudgetManagementProps {
  budget: Budget;
}

interface BudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialBudget: Budget;
  onSave: (budget: Budget) => void;
}

// Helper function to format translated messages with variables
const formatMessage = (template: string, variables: Record<string, string | number>): string => {
  return template.replace(/\$\{(\w+)\}/g, (match, key) => {
    return String(variables[key] || match);
  });
};

export function BudgetManagement({ budget }: BudgetManagementProps) {
  const { t } = useI18n();
  const { formatAmount } = useCurrency();
  
  const budgetCategories = [
    {
      id: 'income',
      title: t('expenseHighlighter.budgetPlanner.categories.income.title'),
      description: t('expenseHighlighter.budgetPlanner.categories.income.description'),
      icon: Banknote,
      iconColor: 'text-blue-600'
    },
    {
      id: 'spend',
      title: t('expenseHighlighter.budgetPlanner.categories.spend.title'),
      description: t('expenseHighlighter.budgetPlanner.categories.spend.description'),
      icon: Home,
      iconColor: 'text-chart-1'
    },
    {
      id: 'saving',
      title: t('expenseHighlighter.budgetPlanner.categories.saving.title'),
      description: t('expenseHighlighter.budgetPlanner.categories.saving.description'),
      icon: PiggyBank,
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {budgetCategories.map((category) => {
        const Icon = category.icon;
        let value: number | undefined;
        
        switch (category.id) {
          case 'income':
            value = budget.monthlyIncome > 0 ? budget.monthlyIncome : undefined;
            break;
          case 'spend':
            value = budget.spendBudget > 0 ? budget.spendBudget : undefined;
            break;
          case 'saving':
            value = budget.savingTarget > 0 ? budget.savingTarget : undefined;
            break;
        }

        return (
          <div key={category.id} className="flex items-start space-x-3">
            <Icon className={`w-6 h-6 ${category.iconColor} flex-shrink-0 mt-1`} />
            <div>
              <strong>{category.title}:</strong>
              <p className="text-muted-foreground text-sm">{category.description}</p>
              {value && (
                <p className={`text-sm font-medium ${category.iconColor} mt-1`}>
                  {formatAmount(value, { decimals: 0 })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BudgetDialog({ isOpen, onClose, initialBudget, onSave }: BudgetDialogProps) {
  const { t } = useI18n();
  const { formatAmount } = useCurrency();
  const { trackEvent } = useAnalyticsContext();
  const { calculateRecommended, adjustSpendBudget, adjustSavingTarget } = useBudget();
  const [budgetInput, setBudgetInput] = useState<Budget>(initialBudget);

  const handleIncomeChange = (income: number) => {
    const recommended = calculateRecommended(income);
    setBudgetInput(recommended);
  };

  const handleSpendBudgetChange = (spendBudget: number) => {
    const adjusted = adjustSpendBudget(budgetInput, spendBudget);
    setBudgetInput(adjusted);
  };

  const handleSavingTargetChange = (savingTarget: number) => {
    const adjusted = adjustSavingTarget(budgetInput, savingTarget);
    setBudgetInput(adjusted);
  };

  const handleSave = () => {
    onSave(budgetInput);
    
    // Track budget completion analytics
    trackOnboardingStepIfActive('BUDGET_COMPLETE', {
      budget_amount: budgetInput.monthlyIncome,
      spend_budget: budgetInput.spendBudget,
      saving_target: budgetInput.savingTarget,
      spend_percentage: budgetInput.monthlyIncome > 0 ? Math.round((budgetInput.spendBudget / budgetInput.monthlyIncome) * 100) : 0,
      saving_percentage: budgetInput.monthlyIncome > 0 ? Math.round((budgetInput.savingTarget / budgetInput.monthlyIncome) * 100) : 0,
      source_section: 'standalone_budget_dialog'
    }, trackEvent);
  };

  // Reset form when dialog opens
  useState(() => {
    if (isOpen) {
      setBudgetInput(initialBudget);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <Card className="p-4 border-0 shadow-none">
          <DialogTitle asChild>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              {t('expenseHighlighter.budgetPlanner.dialog.title')}
            </h3>
          </DialogTitle>
          
          <div className="space-y-4">
            {/* Monthly Income Input */}
            <div>
              <Label htmlFor="monthly-income" className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-blue-600" />
                {t('expenseHighlighter.budgetPlanner.dialog.monthlyIncome.label')}
              </Label>
              <Input
                id="monthly-income"
                type="number"
                value={budgetInput.monthlyIncome || ''}
                onChange={(e) => handleIncomeChange(Number(e.target.value) || 0)}
                placeholder={t('expenseHighlighter.budgetPlanner.dialog.monthlyIncome.placeholder')}
                className="mt-2"
              />
            </div>

            {budgetInput.monthlyIncome > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Spend Budget */}
                <div>
                  <Label htmlFor="spend-budget" className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-chart-1" />
                    {t('expenseHighlighter.budgetPlanner.dialog.spendBudget.label')}
                  </Label>
                  <div className="space-y-2 mt-2">
                    <Input
                      id="spend-budget"
                      type="number"
                      value={budgetInput.spendBudget || ''}
                      onChange={(e) => handleSpendBudgetChange(Number(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formatMessage(t('expenseHighlighter.budgetPlanner.dialog.spendBudget.recommended'), {
                        amount: Math.round(budgetInput.monthlyIncome * 0.6).toString()
                      })}
                    </p>
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      {t('expenseHighlighter.budgetPlanner.dialog.spendBudget.description')}
                    </div>
                  </div>
                </div>

                {/* Saving Target */}
                <div>
                  <Label htmlFor="saving-target" className="flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-green-600" />
                    {t('expenseHighlighter.budgetPlanner.dialog.savingTarget.label')}
                  </Label>
                  <div className="space-y-2 mt-2">
                    <Input
                      id="saving-target"
                      type="number"
                      value={budgetInput.savingTarget || ''}
                      onChange={(e) => handleSavingTargetChange(Number(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formatMessage(t('expenseHighlighter.budgetPlanner.dialog.savingTarget.automatic'), {
                        amount: (budgetInput.monthlyIncome - budgetInput.spendBudget).toString()
                      })}
                    </p>
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      {t('expenseHighlighter.budgetPlanner.dialog.savingTarget.description')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Budget Summary */}
            {budgetInput.monthlyIncome > 0 && (
              <div className="bg-muted/50 p-3 rounded-md space-y-2">
                <h4 className="font-medium">{t('expenseHighlighter.budgetPlanner.dialog.summary.title')}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('expenseHighlighter.budgetPlanner.dialog.summary.income')}</p>
                    <p className="font-medium text-blue-600">{formatAmount(budgetInput.monthlyIncome, { decimals: 0 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('expenseHighlighter.budgetPlanner.dialog.summary.spendBudget')}</p>
                    <p className="font-medium text-chart-1">{formatAmount(budgetInput.spendBudget, { decimals: 0 })}</p>
                    <p className="text-xs text-muted-foreground">
                      {budgetInput.monthlyIncome > 0 ? Math.round((budgetInput.spendBudget / budgetInput.monthlyIncome) * 100) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('expenseHighlighter.budgetPlanner.dialog.summary.savingTarget')}</p>
                    <p className="font-medium text-green-600">{formatAmount(budgetInput.savingTarget, { decimals: 0 })}</p>
                    <p className="text-xs text-muted-foreground">
                      {budgetInput.monthlyIncome > 0 ? Math.round((budgetInput.savingTarget / budgetInput.monthlyIncome) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                {t('expenseHighlighter.budgetPlanner.dialog.buttons.cancel')}
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={budgetInput.monthlyIncome <= 0}
              >
                {t('expenseHighlighter.budgetPlanner.dialog.buttons.save')}
              </Button>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

// Compose the component with its dialog
BudgetManagement.Dialog = BudgetDialog; 