'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, ReceiptText } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { CategoryExplanations } from '@/components/ui/category-explanations';

interface FinancialDecisionsProps {
  onAddExpense: () => void;
}

export function FinancialDecisions({ onAddExpense }: FinancialDecisionsProps) {
  const { t } = useI18n();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <ReceiptText className="w-8 h-8 text-primary" />
          <CardTitle className="text-2xl">{t('expenseHighlighter.title')}</CardTitle>
        </div>
        <CardDescription>{t('expenseHighlighter.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Categories Explanations */}
        <CategoryExplanations />
      </CardContent>
      <CardFooter>
        <Button onClick={onAddExpense}>
          <PlusCircle className="mr-2 h-4 w-4" /> 
          {t('expenseHighlighter.addTransaction')}
        </Button>
      </CardFooter>
    </Card>
  );
} 