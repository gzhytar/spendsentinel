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

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'living' | 'lifestyle' | 'unassigned';
}

const COLORS = {
  living: '#e76e50', // Red
  lifestyle: '#10b981', // Green
  unassigned: '#9ca3af', // Gray
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
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <PiggyBank className="w-12 h-12 text-muted mb-2" />
              <p className="text-muted-foreground">{t('expenseHighlighter.noExpenses')}</p>
              <Button onClick={openNewExpenseModal} variant="outline" className="mt-4" wrap={true}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('expenseHighlighter.addExpense')}
              </Button>
            </div>
          ) : (
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
                          <p className="font-medium">${expense.amount.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('expenseHighlighter.form.date')}</p>
                          <p className="font-medium">{new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('expenseHighlighter.form.category')}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getCategoryIcon(expense.category)}
                          <span className="capitalize">{expense.category === 'living' ? t('expenseHighlighter.categories.living') : 
                            expense.category === 'lifestyle' ? t('expenseHighlighter.categories.lifestyle') : t('expenseHighlighter.unassigned')}</span>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(expense)} wrap={true}>
                          <Edit3 className="h-4 w-4 mr-1" />
                          {t('expenseHighlighter.editExpense')}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id)} className="text-destructive" wrap={true}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t('expenseHighlighter.deleteExpense')}
                        </Button>
                      </div>
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
                      <TableHead>{t('expenseHighlighter.form.category')}</TableHead>
                      <TableHead className="text-right">{t('expenseHighlighter.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>${expense.amount.toFixed(0)}</TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(expense.category)}
                            <span className="capitalize">{expense.category === 'living' ? t('expenseHighlighter.categories.living') :
                              expense.category === 'lifestyle' ? t('expenseHighlighter.categories.lifestyle') : t('expenseHighlighter.unassigned')}</span>
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
              </div>
            </>
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
            <Button onClick={handleSubmit} wrap={true}>{currentExpense.id ? t('expenseHighlighter.editExpense') : t('expenseHighlighter.addExpense')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

