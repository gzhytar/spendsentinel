"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DollarSign,
  Eye,
  Shield,
  Target
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useI18n } from '@/contexts/i18n-context';
import { cn } from '@/lib/utils';
import { AddExpenseForm, type Expense } from '@/components/ui/add-expense-form';
import { ExpenseList } from '@/components/ui/expense-list';
import { expenseStorage } from '@/lib/expense-storage';
import { VisionBoardItem } from '@/types';
import { useIdentifiedParts } from '@/lib/assessment-utils';
import Image from 'next/image';

const COLORS = {
  living: '#e76e50', // Red
  lifestyle: '#10b981', // Green
  unassigned: '#9ca3af', // Gray
  avoided: '#16a34a', // Green
  goals: '#2563eb', // Blue
};

export default function ExpenseHighlighterPage() {
  const { t } = useI18n();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<Expense> & { id?: string }>({});
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [editingSelectedParts, setEditingSelectedParts] = useState<string[]>([]);
  
  // Get user's identified parts from self-assessment results
  const userParts = useIdentifiedParts();
  
  // Form state for adding new vision board item
  const [newVisionItemType, setNewVisionItemType] = useState<'text' | 'image'>('text');
  const [newVisionItemContent, setNewVisionItemContent] = useState('');
  const [newVisionItemDescription, setNewVisionItemDescription] = useState('');

  useEffect(() => {
    const storedExpenses = expenseStorage.getAll();
    setExpenses(storedExpenses);
    
    const storedVisionItems = localStorage.getItem('visionBoardItems');
    if (storedVisionItems) {
      setVisionBoardItems(JSON.parse(storedVisionItems));
    }
  }, []);

  const saveExpenses = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
    expenseStorage.saveAll(updatedExpenses);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>, journalNotes?: Record<string, string>) => {
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      triggeredParts: selectedParts,
    };
    saveExpenses([...expenses, expense]);
    setIsAddFormOpen(false);
    
    // Reset selected parts after adding expense
    setSelectedParts([]);
    
    // Note: journalNotes are not used in expense highlighter, only in daily check-in
  };

  const handleEditExpense = (expenseData: Omit<Expense, 'id'>, journalNotes?: Record<string, string>) => {
    if (!currentExpense.id) return;
    
    const updatedExpense: Expense = {
      ...expenseData,
      id: currentExpense.id,
      triggeredParts: editingSelectedParts,
    };
    
    saveExpenses(expenses.map(exp => exp.id === currentExpense.id ? updatedExpense : exp));
    setIsModalOpen(false);
    setCurrentExpense({});
    setEditingSelectedParts([]);
    
    // Note: journalNotes are not used in expense highlighter, only in daily check-in
  };



  const handleEdit = (expense: Expense) => {
    setCurrentExpense(expense);
    setEditingSelectedParts(expense.triggeredParts || []);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    saveExpenses(expenses.filter(exp => exp.id !== id));
  };

  const openNewExpenseModal = () => {
    setIsAddFormOpen(true);
  };

  const saveVisionBoardItems = (items: VisionBoardItem[]) => {
    setVisionBoardItems(items);
    localStorage.setItem('visionBoardItems', JSON.stringify(items));
  };

  const handleAddVisionBoardItem = () => {
    if (!newVisionItemContent) return;
    // For image type, use a placeholder if content is not a URL
    const content = newVisionItemType === 'image' && !newVisionItemContent.startsWith('https://') 
      ? `https://placehold.co/300x200.png` 
      : newVisionItemContent;
      
    const newItem: VisionBoardItem = {
      id: Date.now().toString(),
      type: newVisionItemType,
      content: content,
      description: newVisionItemType === 'image' ? newVisionItemDescription : undefined,
    };
    saveVisionBoardItems([...visionBoardItems, newItem]);
    setNewVisionItemContent('');
    setNewVisionItemDescription('');
  };

  const handleRemoveVisionBoardItem = (id: string) => {
    saveVisionBoardItems(visionBoardItems.filter(item => item.id !== id));
  };

  const handlePartToggle = (part: string, isSelected: boolean) => {
    setSelectedParts(prev => 
      isSelected 
        ? [...prev, part]
        : prev.filter(p => p !== part)
    );
  };

  const handleEditPartToggle = (part: string, isSelected: boolean) => {
    setEditingSelectedParts(prev => 
      isSelected 
        ? [...prev, part]
        : prev.filter(p => p !== part)
    );
  };
  
  const expenseSummary = useMemo(() => {
    const summary = {
      living: 0,
      lifestyle: 0,
      unassigned: 0,
      total: 0,
    };
    expenses.filter(exp => exp.type === 'expense').forEach(exp => {
      // Only process expense categories
      if (exp.category === 'living' || exp.category === 'lifestyle' || exp.category === 'unassigned') {
        summary[exp.category] += exp.amount;
      }
      summary.total += exp.amount;
    });
    return summary;
  }, [expenses]);

  const savingsSummary = useMemo(() => {
    const summary = {
      avoided: 0,
      goals: 0,
      unassigned: 0,
      total: 0,
    };
    expenses.filter(exp => exp.type === 'saving').forEach(exp => {
      // Only process saving categories
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

  const getCategoryIconForSummary = (category: Expense['category']) => {
    switch (category) {
      case 'living':
        return <Home className="mr-2 h-5 w-5 text-chart-1" />;
      case 'lifestyle':
        return <ShoppingBag className="mr-2 h-5 w-5 text-chart-2" />;
      case 'avoided':
        return <Shield className="mr-2 h-5 w-5 text-green-600" />;
      case 'goals':
        return <Target className="mr-2 h-5 w-5 text-blue-600" />;
      case 'unassigned':
        return <HelpCircle className="mr-2 h-5 w-5 text-muted-foreground" />;
      default:
        return <DollarSign className="mr-2 h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
 {/* Vision Board Section */}
 <Card>
        <CardHeader>
           <div className="flex items-center space-x-3">
            <Eye className="w-7 h-7 text-accent" />
            <CardTitle className="text-2xl">{t('expenseHighlighter.visionBoard.title')}</CardTitle>
          </div>
          <CardDescription>{t('expenseHighlighter.visionBoard.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
           {visionBoardItems.length === 0 && <p className="text-muted-foreground">{t('expenseHighlighter.visionBoard.empty')}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visionBoardItems.map(item => (
              <Card key={item.id} className="overflow-hidden group relative">
                {item.type === 'image' && (
                  <Image 
                    src={item.content} 
                    alt={item.description || t('expenseHighlighter.visionBoard.imageAlt')} 
                    width={300} 
                    height={200} 
                    className="w-full h-48 object-cover" 
                    data-ai-hint="abstract goal"
                  />
                )}
                {item.type === 'text' && (
                  <div className="h-48 p-4 bg-primary/10 flex items-center justify-center">
                    <p className="text-lg font-semibold text-center text-primary-foreground">{item.content}</p>
                  </div>
                )}
                {item.description && item.type === 'image' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </div>
                )}
                 <Button variant="ghost" size="icon" onClick={() => handleRemoveVisionBoardItem(item.id)} className="absolute top-1 right-1 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                 </Button>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> {t('expenseHighlighter.visionBoard.addItem')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('expenseHighlighter.visionBoard.addItem')}</DialogTitle>
                <DialogDescription>
                  {t('expenseHighlighter.visionBoard.addItemDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-type" className="text-right">{t('expenseHighlighter.visionBoard.form.type')}</Label>
                  <select id="item-type" value={newVisionItemType} onChange={(e) => setNewVisionItemType(e.target.value as 'text'|'image')} className="col-span-3 border border-input rounded-md px-3 py-2 text-sm">
                    <option value="text">{t('expenseHighlighter.visionBoard.form.types.text')}</option>
                    <option value="image">{t('expenseHighlighter.visionBoard.form.types.image')}</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-content" className="text-right">{t('expenseHighlighter.visionBoard.form.content')}</Label>
                  {newVisionItemType === 'text' ? (
                    <Input id="item-content" value={newVisionItemContent} onChange={(e) => setNewVisionItemContent(e.target.value)} className="col-span-3" />
                  ) : (
                    <Input id="item-content" type="url" value={newVisionItemContent} onChange={(e) => setNewVisionItemContent(e.target.value)} className="col-span-3" placeholder="https://..." />
                  )}
                </div>
                {newVisionItemType === 'image' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="item-description" className="text-right">{t('expenseHighlighter.visionBoard.form.description')}</Label>
                    <Input id="item-description" value={newVisionItemDescription} onChange={(e) => setNewVisionItemDescription(e.target.value)} className="col-span-3" />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleAddVisionBoardItem}>{t('expenseHighlighter.visionBoard.form.save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>


      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center space-x-3">
            <ReceiptText className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">{t('expenseHighlighter.title')}</CardTitle>
          </div>
          <CardDescription>{t('expenseHighlighter.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Categories Layout - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Spending Categories - Left Side */}
              <div>
                <h3 className="font-semibold text-lg mb-3">{t('expenseHighlighter.form.types.expense')}</h3>
                <div className="space-y-4">
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
              </div>

              {/* Savings Categories - Right Side */}
              <div>
                <h3 className="font-semibold text-lg mb-3">{t('expenseHighlighter.form.types.saving')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    {getCategoryIcon('avoided', 'lg')}
                    <div>
                      <strong>{t('expenseHighlighter.savingCategories.avoided')}:</strong>
                      <p className="text-muted-foreground text-sm">{t('expenseHighlighter.avoidedDescription')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    {getCategoryIcon('goals', 'lg')}
                    <div>
                      <strong>{t('expenseHighlighter.savingCategories.goals')}:</strong>
                      <p className="text-muted-foreground text-sm">{t('expenseHighlighter.goalsDescription')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
         <CardFooter>
          <Button onClick={openNewExpenseModal}><PlusCircle className="mr-2 h-4 w-4" /> {t('expenseHighlighter.addTransaction')}</Button>
        </CardFooter>
      </Card>

      {/* Overview Cards - Side by Side Layout */}
      {(expenses.length > 0 || expenses.filter(exp => exp.type === 'saving').length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spend Overview */}
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
                        label={false}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.category.toLowerCase() as keyof typeof COLORS]} />
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
                    <p>{t('expenseHighlighter.savingCategories.avoided')}: <span className="font-bold" style={{color: COLORS.avoided}}>${savingsSummary.avoided.toFixed(0)}</span></p>
                  </div>
                  <div className="flex items-center">
                    {getCategoryIconForSummary('goals')}
                    <p>{t('expenseHighlighter.savingCategories.goals')}: <span className="font-bold" style={{color: COLORS.goals}}>${savingsSummary.goals.toFixed(0)}</span></p>
                  </div>
                  {savingsSummary.unassigned > 0 && (
                    <div className="flex items-center">
                      {getCategoryIconForSummary('unassigned')}
                      <p>{t('expenseHighlighter.unassigned')}: <span className="font-bold" style={{color: COLORS.unassigned}}>${savingsSummary.unassigned.toFixed(0)}</span></p>
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
                          <Cell key={`cell-${index}`} fill={COLORS[entry.category.toLowerCase() as keyof typeof COLORS]} />
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
            <DialogTitle>{t('expenseHighlighter.addTransaction')}</DialogTitle>
            <DialogDescription>
              {t('expenseHighlighter.addDescription')}
            </DialogDescription>
          </DialogHeader>
          <AddExpenseForm
            onAddExpense={handleAddExpense}
            showTriggeredParts={true}
            availableParts={userParts}
            selectedParts={selectedParts}
            onPartToggle={handlePartToggle}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('expenseHighlighter.editExpense')}</DialogTitle>
            <DialogDescription>
              {t('expenseHighlighter.editTransactionDescription')}
            </DialogDescription>
          </DialogHeader>
          <AddExpenseForm
            onAddExpense={handleEditExpense}
            showTriggeredParts={true}
            availableParts={userParts}
            selectedParts={editingSelectedParts}
            onPartToggle={handleEditPartToggle}
            editingExpense={currentExpense as Expense}
            isEditMode={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

