"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Edit3, Lightbulb, Utensils, Home, ShoppingCart, TrendingUp, Palette, PenLine } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useI18n } from '@/contexts/i18n-context';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'living' | 'lifestyle' | 'unassigned';
}

const COLORS = {
  living: 'hsl(var(--chart-1))', // Blue
  lifestyle: 'hsl(var(--chart-2))', // Green
  unassigned: 'hsl(var(--muted))', // Gray
};

export default function ExpenseHighlighterPage() {
  const { t } = useI18n();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<Expense> & { id?: string }>({});

  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  const saveExpenses = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
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
    } else { // Adding new expense
      saveExpenses([...expenses, { ...currentExpense, id: Date.now().toString(), category: currentExpense.category || 'unassigned' } as Expense]);
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
    setCurrentExpense({ date: new Date().toISOString().split('T')[0], category: 'unassigned' });
    setIsModalOpen(true);
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
    { name: t('expenseHighlighter.categories.living'), value: expenseSummary.living },
    { name: t('expenseHighlighter.categories.lifestyle'), value: expenseSummary.lifestyle },
    { name: 'Unassigned', value: expenseSummary.unassigned },
  ].filter(d => d.value > 0);

  const getCategoryIcon = (category: Expense['category']) => {
    switch (category) {
      case 'living': return <Home className="h-4 w-4 text-chart-1" />;
      case 'lifestyle': return <Palette className="h-4 w-4 text-chart-2" />;
      default: return <Lightbulb className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center space-x-3">
            <PenLine className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">{t('expenseHighlighter.title')}</CardTitle>
          </div>
          <CardDescription>{t('expenseHighlighter.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <strong>{t('expenseHighlighter.categories.living')}:</strong> Essential costs like rent/mortgage, utilities, groceries, transportation for work, insurance.
            <br />
            <strong>{t('expenseHighlighter.categories.lifestyle')}:</strong> Discretionary spending like dining out, entertainment, hobbies, travel, luxury items.
          </p>
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
                <CardTitle className="text-xl">{t('expenseHighlighter.title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold mb-2 text-lg">{t('expenseHighlighter.overview')}:</h3>
              <p>{t('expenseHighlighter.total')}: <span className="font-bold text-primary">${expenseSummary.total.toFixed(2)}</span></p>
              <p>{t('expenseHighlighter.categories.living')}: <span className="font-bold" style={{color: COLORS.living}}>${expenseSummary.living.toFixed(2)}</span></p>
              <p>{t('expenseHighlighter.categories.lifestyle')}: <span className="font-bold" style={{color: COLORS.lifestyle}}>${expenseSummary.lifestyle.toFixed(2)}</span></p>
              <p>Unassigned: <span className="font-bold" style={{color: COLORS.unassigned}}>${expenseSummary.unassigned.toFixed(2)}</span></p>
            </div>
            <div className="h-[300px]">
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t('expenseHighlighter.yourExpenses')}</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-muted-foreground">{t('expenseHighlighter.noExpenses')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('expenseHighlighter.form.description')}</TableHead>
                  <TableHead>{t('expenseHighlighter.form.amount')}</TableHead>
                  <TableHead>{t('expenseHighlighter.form.date')}</TableHead>
                  <TableHead>{t('expenseHighlighter.form.category')}</TableHead>
                  <TableHead className="text-right">{t('expenseHighlighter.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(expense.category)}
                        <span className="capitalize">{expense.category === 'living' ? t('expenseHighlighter.categories.living') : 
                          expense.category === 'lifestyle' ? t('expenseHighlighter.categories.lifestyle') : 'Unassigned'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(expense)} className="mr-2">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentExpense.id ? t('expenseHighlighter.editExpense') : t('expenseHighlighter.addExpense')}</DialogTitle>
            <DialogDescription>
              {currentExpense.id ? t('expenseHighlighter.editDescription') : t('expenseHighlighter.addDescription')}
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
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="living">{t('expenseHighlighter.categories.living')}</SelectItem>
                  <SelectItem value="lifestyle">{t('expenseHighlighter.categories.lifestyle')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>{currentExpense.id ? t('expenseHighlighter.editExpense') : t('expenseHighlighter.addExpense')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

