"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  ShoppingBag, 
  HelpCircle, 
  TrendingUp, 
  Home, 
  ReceiptText, 
  PiggyBank, 
  DollarSign
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useI18n } from '@/contexts/i18n-context';
import { cn } from '@/lib/utils';
import { AddExpenseForm, type Expense } from '@/components/ui/add-expense-form';
import { ExpenseList } from '@/components/ui/expense-list';
import { expenseStorage } from '@/lib/expense-storage';

const COLORS = {
  living: '#e76e50', // Red
  lifestyle: '#10b981', // Green
  unassigned: '#9ca3af', // Gray
};

export default function ExpenseHighlighterPage() {
  const { t } = useI18n();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<Expense> & { id?: string }>({});

  useEffect(() => {
    const storedExpenses = expenseStorage.getAll();
    setExpenses(storedExpenses);
  }, []);

  const saveExpenses = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
    expenseStorage.saveAll(updatedExpenses);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>, journalNotes?: Record<string, string>) => {
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
    };
    saveExpenses([...expenses, expense]);
    setIsAddFormOpen(false);
    // Note: journalNotes are not used in expense highlighter, only in daily check-in
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentExpense(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
  };

  const handleSelectChange = (value: 'living' | 'lifestyle' | 'unassigned') => {
    setCurrentExpense(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = () => {
    if (!currentExpense.description || !currentExpense.amount || !currentExpense.date) return;

    if (currentExpense.id) { // Editing existing expense
      saveExpenses(expenses.map(exp => exp.id === currentExpense.id ? { ...exp, ...currentExpense } as Expense : exp));
    }
    setIsModalOpen(false);
    setCurrentExpense({});
  };

  const handleEdit = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    saveExpenses(expenses.filter(exp => exp.id !== id));
  };

  const openNewExpenseModal = () => {
    setIsAddFormOpen(true);
  };
  
  const expenseSummary = useMemo(() => {
    const summary = {
      living: 0,
      lifestyle: 0,
      unassigned: 0,
      total: 0,
    };
    expenses.forEach(exp => {
      summary[exp.category] += exp.amount;
      summary.total += exp.amount;
    });
    return summary;
  }, [expenses]);

  const chartData = [
    { name: t('expenseHighlighter.categories.living'), value: expenseSummary.living, category: 'living' },
    { name: t('expenseHighlighter.categories.lifestyle'), value: expenseSummary.lifestyle, category: 'lifestyle' },
    { name: t('expenseHighlighter.unassigned'), value: expenseSummary.unassigned, category: 'unassigned' },
  ].filter(d => d.value > 0);

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
      default:
        return <HelpCircle className={cn(dimensions[size], "text-muted-foreground")} />;
    }
  };

  const getCategoryIconForSummary = (category: Expense['category']) => {
    switch (category) {
      case 'living':
        return <Home className="mr-2 h-5 w-5 text-chart-1" />;
      case 'lifestyle':
        return <ShoppingBag className="mr-2 h-5 w-5 text-chart-2" />;
      case 'unassigned':
        return <HelpCircle className="mr-2 h-5 w-5 text-muted-foreground" />;
      default:
        return <DollarSign className="mr-2 h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center space-x-3">
            <ReceiptText className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">{t('expenseHighlighter.title')}</CardTitle>
          </div>
          <CardDescription>{t('expenseHighlighter.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              {getCategoryIcon('living', 'lg')}
              <div>
                <strong>{t('expenseHighlighter.categories.living')}:</strong>
                <p className="text-muted-foreground text-sm">{t('expenseHighlighter.livingDescription')}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              {getCategoryIcon('lifestyle', 'lg')}
              <div>
                <strong>{t('expenseHighlighter.categories.lifestyle')}:</strong>
                <p className="text-muted-foreground text-sm">{t('expenseHighlighter.lifestyleDescription')}</p>
              </div>
            </div>
          </div>
        </CardContent>
         <CardFooter>
          <Button onClick={openNewExpenseModal}><PlusCircle className="mr-2 h-4 w-4" /> {t('expenseHighlighter.addExpense')}</Button>
        </CardFooter>
      </Card>

      {expenses.length > 0 && (
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
                <p>{t('expenseHighlighter.categories.living')}: <span className="font-bold" style={{color: COLORS.living}}>${expenseSummary.living.toFixed(0)}</span></p>
              </div>
              <div className="flex items-center">
                {getCategoryIconForSummary('lifestyle')}
                <p>{t('expenseHighlighter.categories.lifestyle')}: <span className="font-bold" style={{color: COLORS.lifestyle}}>${expenseSummary.lifestyle.toFixed(0)}</span></p>
              </div>
              <div className="flex items-center">
                {getCategoryIconForSummary('unassigned')}
                <p>{t('expenseHighlighter.unassigned')}: <span className="font-bold" style={{color: COLORS.unassigned}}>${expenseSummary.unassigned.toFixed(0)}</span></p>
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
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.category.toLowerCase() as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ReceiptText className="w-6 h-6 text-primary" />
            <CardTitle className="text-xl">{t('expenseHighlighter.yourExpenses')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showEditActions={true}
          />
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('expenseHighlighter.addExpense')}</DialogTitle>
            <DialogDescription>
              {t('expenseHighlighter.addDescription')}
            </DialogDescription>
          </DialogHeader>
          <AddExpenseForm
            onAddExpense={handleAddExpense}
            showTriggeredParts={false}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('expenseHighlighter.editExpense')}</DialogTitle>
            <DialogDescription>
              {t('expenseHighlighter.editDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="description">{t('expenseHighlighter.form.description')}</Label>
              <Input id="description" name="description" value={currentExpense.description || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="amount">{t('expenseHighlighter.form.amount')}</Label>
              <Input id="amount" name="amount" type="number" value={currentExpense.amount || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="date">{t('expenseHighlighter.form.date')}</Label>
              <Input id="date" name="date" type="date" value={currentExpense.date || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="category">{t('expenseHighlighter.form.category')}</Label>
              <Select value={currentExpense.category || 'unassigned'} onValueChange={handleSelectChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder={t('expenseHighlighter.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">
                    <div className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{t('expenseHighlighter.unassigned')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="living">
                    <div className="flex items-center">
                      <Home className="mr-2 h-4 w-4 text-chart-1" />
                      <span>{t('expenseHighlighter.categories.living')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="lifestyle">
                    <div className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4 text-chart-2" />
                      <span>{t('expenseHighlighter.categories.lifestyle')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>{t('expenseHighlighter.editExpense')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

