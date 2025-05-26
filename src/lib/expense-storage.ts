import { type Expense } from '@/components/ui/add-expense-form';

const EXPENSES_STORAGE_KEY = 'expenses';

export const expenseStorage = {
  // Get all expenses from localStorage
  getAll(): Expense[] {
    const stored = localStorage.getItem(EXPENSES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get expenses for a specific date
  getByDate(date: string): Expense[] {
    const allExpenses = this.getAll();
    return allExpenses.filter(expense => expense.date === date);
  },

  // Get today's expenses
  getToday(): Expense[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  },

  // Add a new expense
  add(expense: Expense): void {
    const allExpenses = this.getAll();
    const updatedExpenses = [...allExpenses, expense];
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updatedExpenses));
  },

  // Update an existing expense
  update(updatedExpense: Expense): void {
    const allExpenses = this.getAll();
    const updatedExpenses = allExpenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updatedExpenses));
  },

  // Remove an expense by ID
  remove(id: string): void {
    const allExpenses = this.getAll();
    const updatedExpenses = allExpenses.filter(expense => expense.id !== id);
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updatedExpenses));
  },

  // Save all expenses (for bulk operations)
  saveAll(expenses: Expense[]): void {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  }
}; 