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

// Helper function to format translated messages with variables
const formatMessage = (template: string, variables: Record<string, string | number>): string => {
  return template.replace(/\$\{(\w+)\}/g, (match, key) => {
    return String(variables[key] || match);
  });
};

export function ExpenseOverview({ expenses }: ExpenseOverviewProps) {
  const { t } = useI18n();
  const { budget } = useBudget();

  // Calculate expense summary
  const expenseSummary = useMemo((): SummaryData => {
    const expenseData = expenses.filter(exp => exp.type === 'expense');
    
    return expenseData.reduce((acc, expense) => {
      const amount = expense.amount;
      if (expense.category === 'living') {
        acc.living += amount;
      } else if (expense.category === 'lifestyle') {
        acc.lifestyle += amount;
      } else {
        acc.unassigned += amount;
      }
      acc.total += amount;
      return acc;
    }, { living: 0, lifestyle: 0, unassigned: 0, total: 0 });
  }, [expenses]);

  // Calculate savings summary
  const savingsSummary = useMemo((): SavingsSummaryData => {
    const savingsData = expenses.filter(exp => exp.type === 'saving');
    
    return savingsData.reduce((acc, saving) => {
      const amount = saving.amount;
      if (saving.category === 'avoided') {
        acc.avoided += amount;
      } else if (saving.category === 'goals') {
        acc.goals += amount;
      } else {
        acc.unassigned += amount;
      }
      acc.total += amount;
      return acc;
    }, { avoided: 0, goals: 0, unassigned: 0, total: 0 });
  }, [expenses]);

  // Prepare chart data for expenses
  const chartData = useMemo(() => {
    const data = [];
    if (expenseSummary.living > 0) {
      data.push({ 
        name: t('expenseHighlighter.categories.living'),
        value: expenseSummary.living, 
        category: 'living' 
      });
    }
    if (expenseSummary.lifestyle > 0) {
      data.push({ 
        name: t('expenseHighlighter.categories.lifestyle'),
        value: expenseSummary.lifestyle, 
        category: 'lifestyle' 
      });
    }
    if (expenseSummary.unassigned > 0) {
      data.push({ 
        name: t('expenseHighlighter.unassigned'),
        value: expenseSummary.unassigned, 
        category: 'unassigned' 
      });
    }
    return data;
  }, [expenseSummary, t]);

  // Prepare chart data for savings
  const savingsChartData = useMemo(() => {
    const data = [];
    if (savingsSummary.avoided > 0) {
      data.push({ 
        name: t('expenseHighlighter.savingCategories.avoided'),
        value: savingsSummary.avoided, 
        category: 'avoided' 
      });
    }
    if (savingsSummary.goals > 0) {
      data.push({ 
        name: t('expenseHighlighter.savingCategories.goals'),
        value: savingsSummary.goals, 
        category: 'goals' 
      });
    }
    if (savingsSummary.unassigned > 0) {
      data.push({ 
        name: t('expenseHighlighter.unassigned'),
        value: savingsSummary.unassigned, 
        category: 'unassigned' 
      });
    }
    return data;
  }, [savingsSummary, t]);

  const getCategoryIconForSummary = (categoryId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = getCategoryConfig(categoryId as any);
    if (!config) return <DollarSign className="mr-2 h-5 w-5 text-primary" />;
    
    const IconComponent = config.icon;
    return <IconComponent className="mr-2 h-5 w-5" style={{color: config.color}} />;
  };

  // Budget consumption calculations
  const budgetConsumption = useMemo(() => {
    if (budget.spendBudget <= 0) return null;

    const percentage = (expenseSummary.total / budget.spendBudget) * 100;
    const remaining = budget.spendBudget - expenseSummary.total;
    
    // Trauma-informed messaging: encouraging and supportive at all levels
    let status: 'excellent' | 'good' | 'warning' | 'over' = 'excellent';
    let IconComponent = CheckCircle;
    let iconColor = 'text-green-600';
    let progressColor = 'bg-green-500';
    let messageKey = '';
    let messageStyle = 'text-green-700 bg-green-50';

    if (percentage <= 60) {
      status = 'excellent';
      IconComponent = CheckCircle;
      iconColor = 'text-green-600';
      progressColor = 'bg-green-500';
      messageStyle = 'text-green-700 bg-green-50';
      messageKey = 'excellent';
    } else if (percentage <= 85) {
      status = 'good';
      IconComponent = Info;
      iconColor = 'text-blue-600';
      progressColor = 'bg-blue-500';
      messageStyle = 'text-blue-700 bg-blue-50';
      messageKey = 'good';
    } else if (percentage < 100) {
      status = 'warning';
      IconComponent = AlertTriangle;
      iconColor = 'text-yellow-600';
      progressColor = 'bg-yellow-500';
      messageStyle = 'text-yellow-700 bg-yellow-50';
      messageKey = 'warning';
    } else {
      status = 'over';
      IconComponent = AlertTriangle;
      iconColor = 'text-red-600';
      progressColor = 'bg-red-500';
      messageStyle = 'text-red-700 bg-red-50';
      messageKey = 'over';
    }

    const variables: Record<string, string | number> = status === 'over' 
      ? { overAmount: Math.abs(remaining).toFixed(0) }
      : { remaining: remaining.toFixed(0) };

    const message = formatMessage(t(`expenseHighlighter.budgetProgress.${messageKey}`), variables);

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
  }, [expenseSummary.total, budget.spendBudget, t]);

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
    let messageKey = '';
    let messageStyle = 'text-blue-700 bg-blue-50';

    if (percentage <= 25) {
      status = 'building';
      IconComponent = Heart;
      iconColor = 'text-blue-600';
      progressColor = 'bg-blue-500';
      messageStyle = 'text-blue-700 bg-blue-50';
      messageKey = 'building';
    } else if (percentage <= 60) {
      status = 'progressing';
      IconComponent = TrendingUp;
      iconColor = 'text-yellow-600';
      progressColor = 'bg-yellow-500';
      messageStyle = 'text-yellow-700 bg-yellow-50';
      messageKey = 'progressing';
    } else if (percentage < 100) {
      status = 'approaching';
      IconComponent = CheckCircle;
      iconColor = 'text-green-600';
      progressColor = 'bg-green-500';
      messageStyle = 'text-green-700 bg-green-50';
      messageKey = 'approaching';
    } else {
      status = 'achieved';
      IconComponent = CheckCircle;
      iconColor = 'text-green-600';
      progressColor = 'bg-green-500';
      messageStyle = 'text-green-700 bg-green-50';
      messageKey = 'achieved';
    }

    const variables: Record<string, string | number> = status === 'achieved' 
      ? { extraAmount: Math.abs(remaining).toFixed(0) }
      : { remaining: remaining.toFixed(0) };

    const message = formatMessage(t(`expenseHighlighter.savingProgress.${messageKey}`), variables);

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
  }, [savingsSummary.total, budget.savingTarget, t]);

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
                    <p className="text-sm font-medium">{t('expenseHighlighter.budgetProgress.title')}</p>
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
                    <div className={`flex items-center space-x-2 ${budgetConsumption.messageStyle}`}>
                      <budgetConsumption.IconComponent className={`w-4 h-4 flex-shrink-0 ${budgetConsumption.iconColor}`} />
                      <p className={`text-xs p-2 rounded-md `}>
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
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const name = (entry?.payload as any)?.name || value;
                      return `${name} (${percentage}%)`;
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
                    <p className="text-sm font-medium">{t('expenseHighlighter.savingProgress.title')}</p>
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
                    <div className={`flex items-center space-x-2 ${savingProgress.messageStyle}`}>
                      <savingProgress.IconComponent className={`w-4 h-4 flex-shrink-0 ${savingProgress.iconColor}`} />
                      <p className={`text-xs p-2 rounded-md`}>
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
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const name = (entry?.payload as any)?.name || value;
                      return `${name} (${percentage}%)`;
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