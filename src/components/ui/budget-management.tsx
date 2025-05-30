'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calculator, Home, PiggyBank, Banknote } from 'lucide-react';
import { BUDGET_EXPLANATION_CATEGORIES } from '@/lib/constants/categories';
import { useBudget, type Budget } from '@/hooks/use-budget';

interface BudgetManagementProps {
  budget: Budget;
}

interface BudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialBudget: Budget;
  onSave: (budget: Budget) => void;
}

export function BudgetManagement({ budget }: BudgetManagementProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {BUDGET_EXPLANATION_CATEGORIES.map((category) => {
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
                  ${value.toFixed(0)}
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
  };

  // Reset form when dialog opens
  useState(() => {
    if (isOpen) {
      setBudgetInput(initialBudget);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Set Your Monthly Budget
          </DialogTitle>
          <DialogDescription>
            Set your monthly income and we'll recommend budget allocations. You can adjust the recommendations to fit your needs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Monthly Income Input */}
          <div className="space-y-2">
            <Label htmlFor="monthly-income" className="flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              Monthly Income
            </Label>
            <Input
              id="monthly-income"
              type="number"
              value={budgetInput.monthlyIncome || ''}
              onChange={(e) => handleIncomeChange(Number(e.target.value) || 0)}
              placeholder="Enter your monthly income"
              className="text-lg"
            />
          </div>

          {budgetInput.monthlyIncome > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spend Budget */}
              <div className="space-y-3">
                <Label htmlFor="spend-budget" className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-chart-1" />
                  Spend Budget
                </Label>
                <div className="space-y-2">
                  <Input
                    id="spend-budget"
                    type="number"
                    value={budgetInput.spendBudget || ''}
                    onChange={(e) => handleSpendBudgetChange(Number(e.target.value) || 0)}
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: ${Math.round(budgetInput.monthlyIncome * 0.6)} (60% of income)
                  </p>
                  <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    Covers living essentials and lifestyle choices
                  </div>
                </div>
              </div>

              {/* Saving Target */}
              <div className="space-y-3">
                <Label htmlFor="saving-target" className="flex items-center gap-2">
                  <PiggyBank className="w-4 h-4 text-green-600" />
                  Saving Target
                </Label>
                <div className="space-y-2">
                  <Input
                    id="saving-target"
                    type="number"
                    value={budgetInput.savingTarget || ''}
                    onChange={(e) => handleSavingTargetChange(Number(e.target.value) || 0)}
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Automatic: ${budgetInput.monthlyIncome - budgetInput.spendBudget} (Income - Spend Budget)
                  </p>
                  <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    For emergency fund, goals, and avoiding impulse purchases
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget Summary */}
          {budgetInput.monthlyIncome > 0 && (
            <div className="bg-primary/5 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Budget Summary:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Income</p>
                  <p className="font-medium text-blue-600">${budgetInput.monthlyIncome}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Spend Budget</p>
                  <p className="font-medium text-chart-1">${budgetInput.spendBudget}</p>
                  <p className="text-xs text-muted-foreground">
                    {budgetInput.monthlyIncome > 0 ? Math.round((budgetInput.spendBudget / budgetInput.monthlyIncome) * 100) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Saving Target</p>
                  <p className="font-medium text-green-600">${budgetInput.savingTarget}</p>
                  <p className="text-xs text-muted-foreground">
                    {budgetInput.monthlyIncome > 0 ? Math.round((budgetInput.savingTarget / budgetInput.monthlyIncome) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={budgetInput.monthlyIncome <= 0}
          >
            Save Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Compose the component with its dialog
BudgetManagement.Dialog = BudgetDialog; 