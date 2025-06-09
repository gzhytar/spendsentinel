import { useBudget } from '@/hooks/use-budget';

interface UseJourneyNavigationProps {
  lang: string;
  onAction?: (action: string) => void;
}

export function useJourneyNavigation({ lang, onAction }: UseJourneyNavigationProps) {
  const { hasValidBudget } = useBudget();

  const isTodayCompleted = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedCheckIns = JSON.parse(localStorage.getItem('completedCheckIns') || '[]');
    return completedCheckIns.includes(today);
  };

  const hasVisionBoardItems = () => {
    const storedVisionItems = localStorage.getItem('visionBoardItems');
    if (storedVisionItems) {
      const items = JSON.parse(storedVisionItems);
      return items.length > 0;
    }
    return false;
  };

  const shouldShowVisionBoardButton = () => {
    return !hasVisionBoardItems();
  };

  const shouldShowBudgetButton = () => {
    return !hasValidBudget;
  };

  const navigateToCheckin = () => {
    onAction?.('checkin');
    window.location.href = `/${lang}/daily-checkin`;
  };

  const navigateToExpenseHighlighter = () => {
    onAction?.('expense-highlighter');
    window.location.href = `/${lang}/expense-highlighter`;
  };

  return {
    shouldShowVisionBoardButton,
    shouldShowBudgetButton,
    navigateToCheckin,
    navigateToExpenseHighlighter,
    isTodayCompleted,
    hasVisionBoardItems,
    hasValidBudget,
  };
} 