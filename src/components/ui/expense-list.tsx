'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit3, Trash2, Home, ShoppingBag, HelpCircle, PiggyBank, Shield, Target } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { useCurrency } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';
import type { Expense } from './add-expense-form';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete: (id: string) => void;
  showEditActions?: boolean;
}

export function ExpenseList({ 
  expenses, 
  onEdit, 
  onDelete, 
  showEditActions = true 
}: ExpenseListProps) {
  const { t } = useI18n();
  const { formatAmount } = useCurrency();

  const getCategoryIcon = (category: Expense['category'], size: 'sm' | 'md' | 'lg' = 'sm') => {
    const dimensions = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6"
    };
    
    switch (category) {
      case 'living':
        return <Home className={cn(dimensions[size], "text-chart-1")} />;
      case 'lifestyle':
        return <ShoppingBag className={cn(dimensions[size], "text-chart-2")} />;
      case 'avoided':
        return <Shield className={cn(dimensions[size], "text-green-600")} />;
      case 'goals':
        return <Target className={cn(dimensions[size], "text-blue-600")} />;
      default:
        return <HelpCircle className={cn(dimensions[size], "text-muted-foreground")} />;
    }
  };

  const getCategoryName = (category: Expense['category']) => {
    switch (category) {
      case 'living':
        return t('expenseHighlighter.categories.living');
      case 'lifestyle':
        return t('expenseHighlighter.categories.lifestyle');
      case 'avoided':
        return t('expenseHighlighter.savingCategories.avoided');
      case 'goals':
        return t('expenseHighlighter.savingCategories.goals');
      case 'unassigned':
        return t('expenseHighlighter.unassigned');
      default:
        return t('expenseHighlighter.unassigned');
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <PiggyBank className="w-12 h-12 text-muted mb-2" />
        <p className="text-muted-foreground">{t('expenseHighlighter.noTransactions')}</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile view - Card layout for small screens */}
      <div className="block sm:hidden space-y-4">
        {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
          <Card key={expense.id} className="overflow-hidden border">
            <CardContent className="p-4 space-y-3">
              <div className="border-b pb-2">
                <p className="text-xs text-muted-foreground">{t('expenseHighlighter.form.description')}</p>
                <p className="font-medium">{expense.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{t('expenseHighlighter.form.amount')}</p>
                  <p className="font-medium">{formatAmount(expense.amount, { decimals: 0 })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('expenseHighlighter.form.date')}</p>
                  <p className="font-medium">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{t('expenseHighlighter.form.type')}</p>
                  <p className="font-medium capitalize">{expense.type === 'expense' ? t('expenseHighlighter.form.types.expense') : t('expenseHighlighter.form.types.saving')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('expenseHighlighter.form.category')}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getCategoryIcon(expense.category)}
                    <span className="capitalize">{getCategoryName(expense.category)}</span>
                  </div>
                                 </div>
               </div>
               {expense.triggeredParts && expense.triggeredParts.length > 0 && (
                 <div>
                   <p className="text-xs text-muted-foreground">{t('dailyCheckIn.steps.expenseLogging.triggeredParts')}</p>
                   <div className="flex flex-wrap gap-1 mt-1">
                     {expense.triggeredParts.map((part, index) => (
                       <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                         {part}
                       </span>
                     ))}
                   </div>
                 </div>
               )}
              {showEditActions && (
                <div className="flex justify-end space-x-2 pt-1">
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
                      <Edit3 className="h-4 w-4 mr-1" />
                      {t('expenseHighlighter.editExpense')}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => onDelete(expense.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t('expenseHighlighter.deleteExpense')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view - Table layout for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('expenseHighlighter.form.description')}</TableHead>
              <TableHead>{t('expenseHighlighter.form.amount')}</TableHead>
              <TableHead>{t('expenseHighlighter.form.date')}</TableHead>
              <TableHead>{t('expenseHighlighter.form.type')}</TableHead>
              <TableHead>{t('expenseHighlighter.form.category')}</TableHead>
              <TableHead>{t('dailyCheckIn.steps.expenseLogging.triggeredParts')}</TableHead>
              {showEditActions && <TableHead className="text-right">{t('expenseHighlighter.actions')}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell>{formatAmount(expense.amount, { decimals: 0 })}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell className="capitalize">{expense.type === 'expense' ? t('expenseHighlighter.form.types.expense') : t('expenseHighlighter.form.types.saving')}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(expense.category)}
                    <span className="capitalize">{getCategoryName(expense.category)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {expense.triggeredParts && expense.triggeredParts.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {expense.triggeredParts.map((part, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {part}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                {showEditActions && (
                  <TableCell className="text-right">
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(expense)} className="mr-2">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => onDelete(expense.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
} 