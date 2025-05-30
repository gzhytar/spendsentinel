'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PiggyBank, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useI18n } from '@/contexts/i18n-context';
import { getCategoryConfig, CATEGORY_COLORS } from '@/lib/constants/categories';
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
            <div className="space-y-3">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                <p>{t('expenseHighlighter.total')}: <span className="font-bold text-primary">${expenseSummary.total.toFixed(0)}</span></p>
              </div>
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
            <div className="space-y-3">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                <p>{t('expenseHighlighter.totalSavings')}: <span className="font-bold text-primary">${savingsSummary.total.toFixed(0)}</span></p>
              </div>
              <div className="flex items-center">
                {getCategoryIconForSummary('avoided')}
                <p>{t('expenseHighlighter.savingCategories.avoided')}: <span className="font-bold" style={{color: CATEGORY_COLORS.avoided}}>${savingsSummary.avoided.toFixed(0)}</span></p>
              </div>
              <div className="flex items-center">
                {getCategoryIconForSummary('goals')}
                <p>{t('expenseHighlighter.savingCategories.goals')}: <span className="font-bold" style={{color: CATEGORY_COLORS.goals}}>${savingsSummary.goals.toFixed(0)}</span></p>
              </div>
              {savingsSummary.unassigned > 0 && (
                <div className="flex items-center">
                  {getCategoryIconForSummary('unassigned')}
                  <p>{t('expenseHighlighter.unassigned')}: <span className="font-bold" style={{color: CATEGORY_COLORS.unassigned}}>${savingsSummary.unassigned.toFixed(0)}</span></p>
                </div>
              )}
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