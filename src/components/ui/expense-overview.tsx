'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PiggyBank, DollarSign, CheckCircle, AlertTriangle, Info, Heart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useI18n } from '@/contexts/i18n-context';
import { getCategoryConfig, CATEGORY_COLORS } from '@/lib/constants/categories';
import { useBudget } from '@/hooks/use-budget';
import { Progress } from '@/components/ui/progress';
import type { Expense } from '@/components/ui/add-expense-form';

interface ExpenseOverviewProps {
  expenses: Expense[];
}

interface SummaryData {
  living: number;
  lifestyle: number;
  unassigned: number;
  total: number;
}

interface SavingsSummaryData {
  avoided: number;
  goals: number;
  unassigned: number;
  total: number;
}

export function ExpenseOverview({ expenses }: ExpenseOverviewProps) {
  const { t } = useI18n();
  const { budget } = useBudget();

  const expenseSummary = useMemo((): SummaryData => {
    const summary = {
      living: 0,
      lifestyle: 0,
      unassigned: 0,
      total: 0,
    };
    
    expenses.filter(exp => exp.type === 'expense').forEach(exp => {
      if (exp.category === 'living' || exp.category === 'lifestyle' || exp.category === 'unassigned') {
        summary[exp.category] += exp.amount;
      }
      summary.total += exp.amount;
    });
    
    return summary;
  }, [expenses]);

  const savingsSummary = useMemo((): SavingsSummaryData => {
    const summary = {
      avoided: 0,
      goals: 0,
      unassigned: 0,
      total: 0,
    };
    
    expenses.filter(exp => exp.type === 'saving').forEach(exp => {
      if (exp.category === 'avoided' || exp.category === 'goals' || exp.category === 'unassigned') {
        summary[exp.category] += exp.amount;
      }
      summary.total += exp.amount;
    });
    
    return summary;
  }, [expenses]);

  const chartData = [
    { name: t('expenseHighlighter.categories.living'), value: expenseSummary.living, category: 'living' },
    { name: t('expenseHighlighter.categories.lifestyle'), value: expenseSummary.lifestyle, category: 'lifestyle' },
    { name: t('expenseHighlighter.unassigned'), value: expenseSummary.unassigned, category: 'unassigned' },
  ].filter(d => d.value > 0);

  const savingsChartData = [
    { name: t('expenseHighlighter.savingCategories.avoided'), value: savingsSummary.avoided, category: 'avoided' },
    { name: t('expenseHighlighter.savingCategories.goals'), value: savingsSummary.goals, category: 'goals' },
    { name: t('expenseHighlighter.unassigned'), value: savingsSummary.unassigned, category: 'unassigned' },
  ].filter(d => d.value > 0);

  const getCategoryIconForSummary = (categoryId: string) => {
    const config = getCategoryConfig(categoryId as any);
    if (!config) return <DollarSign className="mr-2 h-5 w-5 text-primary" />;
    
    const Icon = config.icon;
    return <Icon className={`mr-2 h-5 w-5 ${config.iconColor}`} />;
  };

  // Budget consumption calculations
  const budgetConsumption = useMemo(() => {
    if (budget.spendBudget <= 0) return null;

    const percentage = (expenseSummary.total / budget.spendBudget) * 100;
    const remaining = budget.spendBudget - expenseSummary.total;
    
    // Determine status and styling based on consumption percentage
    let status: 'excellent' | 'good' | 'warning' | 'over' = 'excellent';
    let IconComponent = CheckCircle;
    let iconColor = 'text-green-600';
    let progressColor = 'bg-green-500';
    let message = '';
    let messageStyle = 'text-green-700 bg-green-50';

    if (percentage <= 50) {
      status = 'excellent';
      message = `Great job! You're well within your budget with $${remaining.toFixed(0)} remaining.`;
    } else if (percentage <= 75) {
      status = 'good';
      message = `You're doing well! $${remaining.toFixed(0)} left in your budget.`;
    } else if (percentage < 100) {
      status = 'warning';
      IconComponent = AlertTriangle;
      iconColor = 'text-yellow-600';
      progressColor = 'bg-yellow-500';
      messageStyle = 'text-yellow-700 bg-yellow-50';
      message = `Getting close to your limit. $${remaining.toFixed(0)} remaining in your budget.`;
    } else {
      status = 'over';
      IconComponent = Info;
      iconColor = 'text-blue-600';
      progressColor = 'bg-blue-500';
      messageStyle = 'text-blue-700 bg-blue-50';
      const overAmount = Math.abs(remaining);
      message = `You've exceeded your budget by $${overAmount.toFixed(0)}. Consider reviewing your spending or adjusting your budget.`;
    }

    return {
      percentage: Math.min(percentage, 100),
      remaining,
      status,
      IconComponent,
      iconColor,
      progressColor,
      message,
      messageStyle,
    };
  }, [expenseSummary.total, budget.spendBudget]);

  // Saving target progress calculations
  const savingProgress = useMemo(() => {
    if (budget.savingTarget <= 0) return null;

    const percentage = (savingsSummary.total / budget.savingTarget) * 100;
    const remaining = budget.savingTarget - savingsSummary.total;
    
    // Trauma-informed messaging: encouraging and supportive at all levels
    let status: 'building' | 'progressing' | 'approaching' | 'achieved' = 'building';
    let IconComponent = Heart;
    let iconColor = 'text-blue-600';
    let progressColor = 'bg-blue-500';
    let message = '';
    let messageStyle = 'text-blue-700 bg-blue-50';

    if (percentage <= 25) {
      status = 'building';
      IconComponent = Heart;
      iconColor = 'text-blue-600';
      progressColor = 'bg-blue-500';
      messageStyle = 'text-blue-700 bg-blue-50';
      message = `Every saving effort counts! You're building something important for your future.`;
    } else if (percentage <= 60) {
      status = 'progressing';
      IconComponent = TrendingUp;
      iconColor = 'text-yellow-600';
      progressColor = 'bg-yellow-500';
      messageStyle = 'text-yellow-700 bg-yellow-50';
      message = `Great progress! You're steadily building your financial foundation. $${remaining.toFixed(0)} to reach your target.`;
    } else if (percentage < 100) {
      status = 'approaching';
      IconComponent = CheckCircle;
      iconColor = 'text-green-600';
      progressColor = 'bg-green-500';
      messageStyle = 'text-green-700 bg-green-50';
      message = `Excellent work! You're so close to your saving target. Just $${remaining.toFixed(0)} to go!`;
    } else {
      status = 'achieved';
      IconComponent = CheckCircle;
      iconColor = 'text-green-600';
      progressColor = 'bg-green-500';
      messageStyle = 'text-green-700 bg-green-50';
      const extraAmount = Math.abs(remaining);
      message = `Amazing! You've exceeded your saving target by $${extraAmount.toFixed(0)}. Your financial security is growing stronger!`;
    }

    return {
      percentage: Math.min(percentage, 100),
      remaining,
      status,
      IconComponent,
      iconColor,
      progressColor,
      message,
      messageStyle,
    };
  }, [savingsSummary.total, budget.savingTarget]);

  // Don't render if no expenses
  if (expenses.length === 0 && expenses.filter(exp => exp.type === 'saving').length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Spend Overview */}
      {expenses.filter(exp => exp.type === 'expense').length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-7 h-7 text-accent" />
              <CardTitle className="text-xl">{t('expenseHighlighter.overview')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                <p>{t('expenseHighlighter.total')}: <span className="font-bold text-primary">${expenseSummary.total.toFixed(0)}</span></p>
              </div>
              
              {/* Budget Consumption Indicator */}
              {budgetConsumption && (
                <div className="space-y-3 pt-2 border-t border-muted">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Budget Progress</p>
                    <p className="text-sm text-muted-foreground">
                      ${expenseSummary.total.toFixed(0)} / ${budget.spendBudget.toFixed(0)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Progress 
                        value={budgetConsumption.percentage} 
                        className="h-3"
                      />
                      {/* Custom progress color overlay */}
                      <div 
                        className={`absolute top-0 left-0 h-3 rounded-full transition-all ${budgetConsumption.progressColor}`}
                        style={{ width: `${budgetConsumption.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-start space-x-2">
                      <budgetConsumption.IconComponent className={`w-4 h-4 mt-0.5 flex-shrink-0 ${budgetConsumption.iconColor}`} />
                      <p className={`text-xs p-2 rounded-md ${budgetConsumption.messageStyle}`}>
                        {budgetConsumption.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center">
                  {getCategoryIconForSummary('living')}
                  <p>{t('expenseHighlighter.categories.living')}: <span className="font-bold" style={{color: CATEGORY_COLORS.living}}>${expenseSummary.living.toFixed(0)}</span></p>
                </div>
                <div className="flex items-center">
                  {getCategoryIconForSummary('lifestyle')}
                  <p>{t('expenseHighlighter.categories.lifestyle')}: <span className="font-bold" style={{color: CATEGORY_COLORS.lifestyle}}>${expenseSummary.lifestyle.toFixed(0)}</span></p>
                </div>
                <div className="flex items-center">
                  {getCategoryIconForSummary('unassigned')}
                  <p>{t('expenseHighlighter.unassigned')}: <span className="font-bold" style={{color: CATEGORY_COLORS.unassigned}}>${expenseSummary.unassigned.toFixed(0)}</span></p>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category.toLowerCase() as keyof typeof CATEGORY_COLORS]} />
                    ))}
                  </Pie>
                  <Legend 
                    formatter={(value, entry) => {
                      const total = chartData.reduce((sum, item) => sum + item.value, 0);
                      const percentage = entry?.payload ? ((entry.payload.value / total) * 100).toFixed(0) : '0';
                      return `${value} (${percentage}%)`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Savings */}
      {expenses.filter(exp => exp.type === 'saving').length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <PiggyBank className="w-7 h-7 text-accent" />
              <CardTitle className="text-xl">{t('expenseHighlighter.totalSavings')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                <p>{t('expenseHighlighter.totalSavings')}: <span className="font-bold text-primary">${savingsSummary.total.toFixed(0)}</span></p>
              </div>
              
              {/* Saving Target Progress Indicator */}
              {savingProgress && (
                <div className="space-y-3 pt-2 border-t border-muted">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Saving Target Progress</p>
                    <p className="text-sm text-muted-foreground">
                      ${savingsSummary.total.toFixed(0)} / ${budget.savingTarget.toFixed(0)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Progress 
                        value={savingProgress.percentage} 
                        className="h-3"
                      />
                      {/* Custom progress color overlay */}
                      <div 
                        className={`absolute top-0 left-0 h-3 rounded-full transition-all ${savingProgress.progressColor}`}
                        style={{ width: `${savingProgress.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-start space-x-2">
                      <savingProgress.IconComponent className={`w-4 h-4 mt-0.5 flex-shrink-0 ${savingProgress.iconColor}`} />
                      <p className={`text-xs p-2 rounded-md ${savingProgress.messageStyle}`}>
                        {savingProgress.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center">
                  {getCategoryIconForSummary('avoided')}
                  <p>{t('expenseHighlighter.savingCategories.avoided')}: <span className="font-bold" style={{color: CATEGORY_COLORS.avoided}}>${savingsSummary.avoided.toFixed(0)}</span></p>
                </div>
                <div className="flex items-center">
                  {getCategoryIconForSummary('goals')}
                  <p>{t('expenseHighlighter.savingCategories.goals')}: <span className="font-bold" style={{color: CATEGORY_COLORS.goals}}>${savingsSummary.goals.toFixed(0)}</span></p>
                </div>
                <div className="flex items-center">
                  {getCategoryIconForSummary('unassigned')}
                  <p>{t('expenseHighlighter.unassigned')}: <span className="font-bold" style={{color: CATEGORY_COLORS.unassigned}}>${savingsSummary.unassigned.toFixed(0)}</span></p>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={savingsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                  >
                    {savingsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category.toLowerCase() as keyof typeof CATEGORY_COLORS]} />
                    ))}
                  </Pie>
                  <Legend 
                    formatter={(value, entry) => {
                      const total = savingsChartData.reduce((sum, item) => sum + item.value, 0);
                      const percentage = entry?.payload ? ((entry.payload.value / total) * 100).toFixed(0) : '0';
                      return `${value} (${percentage}%)`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 