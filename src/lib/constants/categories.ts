import { Home, ShoppingBag, Shield, Target, HelpCircle, PiggyBank, Banknote } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ExpenseCategory = 'living' | 'lifestyle' | 'unassigned' | 'avoided' | 'goals';
export type ExpenseType = 'expense' | 'saving';

export interface CategoryConfig {
  id: ExpenseCategory;
  icon: LucideIcon;
  color: string;
  iconColor: string;
  translationKey: string;
  descriptionKey: string;
  type: ExpenseType;
}

export const CATEGORY_COLORS = {
  living: '#e76e50',
  lifestyle: '#10b981',
  unassigned: '#9ca3af',
  avoided: '#16a34a',
  goals: '#2563eb',
} as const;

export const BUDGET_CATEGORIES: CategoryConfig[] = [
  {
    id: 'living',
    icon: Home,
    color: CATEGORY_COLORS.living,
    iconColor: 'text-chart-1',
    translationKey: 'expenseHighlighter.categories.living',
    descriptionKey: 'expenseHighlighter.livingDescription',
    type: 'expense'
  },
  {
    id: 'lifestyle',
    icon: ShoppingBag,
    color: CATEGORY_COLORS.lifestyle,
    iconColor: 'text-chart-2',
    translationKey: 'expenseHighlighter.categories.lifestyle',
    descriptionKey: 'expenseHighlighter.lifestyleDescription',
    type: 'expense'
  },
  {
    id: 'avoided',
    icon: Shield,
    color: CATEGORY_COLORS.avoided,
    iconColor: 'text-green-600',
    translationKey: 'expenseHighlighter.savingCategories.avoided',
    descriptionKey: 'expenseHighlighter.avoidedDescription',
    type: 'saving'
  },
  {
    id: 'goals',
    icon: Target,
    color: CATEGORY_COLORS.goals,
    iconColor: 'text-blue-600',
    translationKey: 'expenseHighlighter.savingCategories.goals',
    descriptionKey: 'expenseHighlighter.goalsDescription',
    type: 'saving'
  },
  {
    id: 'unassigned',
    icon: HelpCircle,
    color: CATEGORY_COLORS.unassigned,
    iconColor: 'text-muted-foreground',
    translationKey: 'expenseHighlighter.unassigned',
    descriptionKey: 'expenseHighlighter.unassignedDescription',
    type: 'expense' // Can be either, but defaulting to expense
  }
];

export const BUDGET_EXPLANATION_CATEGORIES = [
  {
    id: 'income',
    icon: Banknote,
    iconColor: 'text-blue-600',
    title: 'Monthly Income',
    description: 'Your total monthly earnings from all sources. This forms the foundation of your budget planning.'
  },
  {
    id: 'spend',
    icon: Home,
    iconColor: 'text-chart-1',
    title: 'Spend Budget',
    description: 'Allocated amount for living expenses and lifestyle purchases.'
  },
  {
    id: 'saving',
    icon: PiggyBank,
    iconColor: 'text-green-600',
    title: 'Saving Target',
    description: 'Amount dedicated to building emergency fund and vision board goals.'
  }
] as const;

export function getCategoryConfig(categoryId: ExpenseCategory): CategoryConfig | undefined {
  return BUDGET_CATEGORIES.find(cat => cat.id === categoryId);
}

export function getCategoriesByType(type: ExpenseType): CategoryConfig[] {
  return BUDGET_CATEGORIES.filter(cat => cat.type === type);
} 