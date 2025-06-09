import { useBudget } from '@/hooks/use-budget';
import { useVisionBoard } from '@/hooks/use-vision-board';

interface UseJourneyNavigationProps {
  lang: string;
  onAction?: (action: string) => void;
}

export function useJourneyNavigation({ lang, onAction }: UseJourneyNavigationProps) {
  const { hasValidBudget } = useBudget();
  const { hasVisionBoardItems, openVisionDialog } = useVisionBoard();

  const isTodayCompleted = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedCheckIns = JSON.parse(localStorage.getItem('completedCheckIns') || '[]');
    return completedCheckIns.includes(today);
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

  const handleVisionBoardAction = () => {
    onAction?.('vision-board');
    openVisionDialog();
  };

  return {
    shouldShowVisionBoardButton,
    shouldShowBudgetButton,
    navigateToCheckin,
    navigateToExpenseHighlighter,
    handleVisionBoardAction,
    isTodayCompleted,
    hasVisionBoardItems,
    hasValidBudget,
  };
} 