import { useState, useEffect, useCallback } from 'react';

export interface Budget {
  monthlyIncome: number;
  spendBudget: number;
  savingTarget: number;
}

const STORAGE_KEY = 'monthlyBudget';

const defaultBudget: Budget = {
  monthlyIncome: 0,
  spendBudget: 0,
  savingTarget: 0
};

export function useBudget() {
  const [budget, setBudget] = useState<Budget>(defaultBudget);

  // Load budget from localStorage on mount
  useEffect(() => {
    try {
      const storedBudget = localStorage.getItem(STORAGE_KEY);
      if (storedBudget) {
        const parsedBudget = JSON.parse(storedBudget);
        setBudget(parsedBudget);
      }
    } catch (error) {
      console.warn('Failed to load budget from localStorage:', error);
    }
  }, []);

  // Update budget and persist to localStorage
  const updateBudget = useCallback((newBudget: Budget) => {
    setBudget(newBudget);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBudget));
    } catch (error) {
      console.warn('Failed to save budget to localStorage:', error);
    }
  }, []);

  // Calculate recommended budget based on income
  const calculateRecommended = useCallback((income: number) => {
    const recommendedSpend = Math.round(income * 0.6);
    const recommendedSaving = income - recommendedSpend;
    return {
      monthlyIncome: income,
      spendBudget: recommendedSpend,
      savingTarget: recommendedSaving
    };
  }, []);

  // Adjust spend budget and recalculate saving target
  const adjustSpendBudget = useCallback((currentBudget: Budget, spendBudget: number): Budget => {
    const savingTarget = currentBudget.monthlyIncome - spendBudget;
    return {
      ...currentBudget,
      spendBudget,
      savingTarget: Math.max(0, savingTarget)
    };
  }, []);

  // Adjust saving target and recalculate spend budget
  const adjustSavingTarget = useCallback((currentBudget: Budget, savingTarget: number): Budget => {
    const spendBudget = currentBudget.monthlyIncome - savingTarget;
    return {
      ...currentBudget,
      spendBudget: Math.max(0, spendBudget),
      savingTarget
    };
  }, []);

  return {
    budget,
    updateBudget,
    calculateRecommended,
    adjustSpendBudget,
    adjustSavingTarget,
    hasValidBudget: budget.monthlyIncome > 0
  };
} 