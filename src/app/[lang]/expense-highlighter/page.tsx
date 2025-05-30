"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/contexts/i18n-context';
import { AddExpenseForm, type Expense } from '@/components/ui/add-expense-form';
import { ExpenseList } from '@/components/ui/expense-list';
import { VisionBoard } from '@/components/ui/vision-board';
import { MyBudgetPlanner } from '@/components/ui/budget-planner';
import { FinancialDecisions } from '@/components/ui/financial-decisions';
import { ExpenseOverview } from '@/components/ui/expense-overview';
import { expenseStorage } from '@/lib/expense-storage';
import { VisionBoardItem } from '@/types';
import { useIdentifiedParts } from '@/lib/assessment-utils';

export default function ExpenseHighlighterPage() {
  const { t } = useI18n();
  
  // State management
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [editingSelectedParts, setEditingSelectedParts] = useState<string[]>([]);
  
  // Modal states
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<Expense> & { id?: string }>({});
  
  // Get user's identified parts from self-assessment results
  const userParts = useIdentifiedParts();

  // Load data on mount
  useEffect(() => {
    loadExpenses();
    loadVisionBoardItems();
  }, []);

  // Data loading functions
  const loadExpenses = () => {
    const storedExpenses = expenseStorage.getAll();
    setExpenses(storedExpenses);
  };

  const loadVisionBoardItems = () => {
    const storedVisionItems = localStorage.getItem('visionBoardItems');
    if (storedVisionItems) {
      setVisionBoardItems(JSON.parse(storedVisionItems));
    }
  };

  // Data persistence functions
  const saveExpenses = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
    expenseStorage.saveAll(updatedExpenses);
  };

  const saveVisionBoardItems = (items: VisionBoardItem[]) => {
    setVisionBoardItems(items);
    localStorage.setItem('visionBoardItems', JSON.stringify(items));
  };

  // Expense handlers
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>, journalNotes?: Record<string, string>) => {
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      triggeredParts: selectedParts,
    };
    saveExpenses([...expenses, expense]);
    setIsAddFormOpen(false);
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
    setIsEditModalOpen(false);
    setCurrentExpense({});
    setEditingSelectedParts([]);
    
    // Note: journalNotes are not used in expense highlighter, only in daily check-in
  };

  const handleEditExpenseClick = (expense: Expense) => {
    setCurrentExpense(expense);
    setEditingSelectedParts(expense.triggeredParts || []);
    setIsEditModalOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    saveExpenses(expenses.filter(exp => exp.id !== id));
  };

  // Vision board handlers
  const handleAddVisionBoardItem = (item: Omit<VisionBoardItem, 'id'>) => {
    const newItem: VisionBoardItem = {
      ...item,
      id: Date.now().toString(),
    };
    saveVisionBoardItems([...visionBoardItems, newItem]);
  };

  const handleRemoveVisionBoardItem = (id: string) => {
    saveVisionBoardItems(visionBoardItems.filter(item => item.id !== id));
  };

  // Parts handlers
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

  // Modal handlers
  const openNewExpenseModal = () => {
    setIsAddFormOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      {/* Vision Board Section */}
      <VisionBoard
        items={visionBoardItems}
        onAddItem={handleAddVisionBoardItem}
        onRemoveItem={handleRemoveVisionBoardItem}
      />

      {/* Budget Planning Section */}
      <MyBudgetPlanner />

      {/* Financial Decisions Section */}
      <FinancialDecisions onAddExpense={openNewExpenseModal} />

      {/* Overview Cards - Side by Side Layout */}
      <ExpenseOverview expenses={expenses} />

      {/* Expense List Section */}
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
            onEdit={handleEditExpenseClick}
            onDelete={handleDeleteExpense}
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
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
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

