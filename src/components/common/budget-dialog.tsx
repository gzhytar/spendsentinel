'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/contexts/i18n-context';
import { Calculator, DollarSign } from 'lucide-react';
import { Budget } from '@/hooks/use-budget';

interface BudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  budgetInput: Budget;
  setBudgetInput: (budget: Budget) => void;
  onSave: () => void;
}

export function BudgetDialog({
  isOpen,
  onClose,
  budgetInput,
  setBudgetInput,
  onSave,
}: BudgetDialogProps) {
  const { t } = useI18n();

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
                <DollarSign className="w-4 h-4 text-blue-600" />
                {t('expenseHighlighter.budgetPlanner.dialog.monthlyIncome.label')}
              </Label>
              <Input
                id="monthly-income"
                type="number"
                value={budgetInput.monthlyIncome || ''}
                onChange={(e) => {
                  const income = Number(e.target.value) || 0;
                  const recommendedSpend = Math.round(income * 0.6);
                  const recommendedSaving = income - recommendedSpend;
                  setBudgetInput({
                    monthlyIncome: income,
                    spendBudget: recommendedSpend,
                    savingTarget: recommendedSaving
                  });
                }}
                placeholder={t('expenseHighlighter.budgetPlanner.dialog.monthlyIncome.placeholder')}
                className="mt-2"
              />
            </div>

            {budgetInput.monthlyIncome > 0 && (
              <div className="bg-muted/50 p-3 rounded-md space-y-2">
                <h4 className="font-medium">{t('expenseHighlighter.budgetPlanner.dialog.summary.title')}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('expenseHighlighter.budgetPlanner.dialog.summary.income')}</p>
                    <p className="font-medium text-blue-600">{budgetInput.monthlyIncome}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('expenseHighlighter.budgetPlanner.dialog.summary.spendBudget')}</p>
                    <p className="font-medium text-chart-1">{budgetInput.spendBudget}</p>
                    <p className="text-xs text-muted-foreground">
                      {budgetInput.monthlyIncome > 0 ? Math.round((budgetInput.spendBudget / budgetInput.monthlyIncome) * 100) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('expenseHighlighter.budgetPlanner.dialog.summary.savingTarget')}</p>
                    <p className="font-medium text-green-600">{budgetInput.savingTarget}</p>
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
                onClick={onSave} 
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