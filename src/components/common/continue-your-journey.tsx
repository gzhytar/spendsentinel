'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Eye, Calculator, DollarSign } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { useBudget } from '@/hooks/use-budget';
import { useVisionBoard } from '@/hooks/use-vision-board';
import { useJourneyNavigation } from '@/hooks/use-journey-navigation';
import { VisionBoardDialog } from './vision-board-dialog';
import { BudgetDialog } from './budget-dialog';

interface ContinueYourJourneyProps {
  lang: string;
  onAction?: (action: string) => void;
  className?: string;
  // Optional button customization
  showCheckInButton?: boolean;
  showVisionBoardButton?: boolean;
  showBudgetButton?: boolean;
  showExpenseHighlighterButton?: boolean;
  customButtons?: React.ReactNode[];
  // Event handlers for specific contexts
  onNewCheckIn?: () => void;
}

export function ContinueYourJourney({
  lang,
  onAction,
  className = '',
  showCheckInButton = true,
  showVisionBoardButton = true,
  showBudgetButton = true,
  showExpenseHighlighterButton = true,
  customButtons = [],
  onNewCheckIn,
}: ContinueYourJourneyProps) {
  const { t } = useI18n();
  const { budget, updateBudget, hasValidBudget } = useBudget();
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget);

  const {
    visionBoardItems,
    isVisionDialogOpen,
    newVisionItem,
    setNewVisionItem,
    handleAddVisionItem,
    handleCloseVisionDialog,
  } = useVisionBoard();

  const {
    shouldShowVisionBoardButton,
    shouldShowBudgetButton,
    navigateToCheckin,
    navigateToExpenseHighlighter,
    handleVisionBoardAction,
  } = useJourneyNavigation({ lang, onAction });

  // Update budget input when budget changes
  useEffect(() => {
    setBudgetInput(budget);
  }, [budget]);

  const handleBudgetSave = () => {
    updateBudget(budgetInput);
    setIsBudgetDialogOpen(false);
  };

  const handleCloseBudgetDialog = () => {
    setBudgetInput(budget); // Reset to current budget
    setIsBudgetDialogOpen(false);
  };

  const handleBudgetAction = () => {
    onAction?.('budget');
    setIsBudgetDialogOpen(true);
  };

  const handleCheckInAction = () => {
    if (onNewCheckIn) {
      onNewCheckIn();
    } else {
      navigateToCheckin();
    }
  };

  return (
    <>
      <Card className={`shadow-lg border-2 border-primary/20 ${className}`}>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ArrowRight className="w-6 h-6 text-primary" />
            <CardTitle className="text-xl">{t('selfAssessment.nextSteps.title')}</CardTitle>
          </div>
          <CardDescription>
            {t('selfAssessment.nextSteps.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {/* Primary Action - Start New Check-in (conditional) */}
            {showCheckInButton && (
              <Button 
                onClick={handleCheckInAction}
                size="lg"
                className="w-full"
                variant="default"
              >
                <Calendar className="mr-2 h-4 w-4" /> 
                {t('dailyCheckIn.celebration.startNewCheckIn')}
              </Button>
            )}

            {/* Dynamic onboarding buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {/* Add to Vision Board - only if no items */}
              {showVisionBoardButton && shouldShowVisionBoardButton() && (
                <Button 
                  onClick={handleVisionBoardAction}
                  size="lg"
                  className="w-full"
                  variant="default"
                >
                  <Eye className="mr-2 h-4 w-4" /> 
                  {t('expenseHighlighter.visionBoard.addItem')}
                </Button>
              )}

              {/* Set Budget - only if no budget */}
              {showBudgetButton && shouldShowBudgetButton() && (
                <Button 
                  onClick={handleBudgetAction}
                  size="lg"
                  className="w-full"
                  variant="default"
                >
                  <Calculator className="mr-2 h-4 w-4" /> 
                  {t('expenseHighlighter.budgetPlanner.setBudgetButton')}
                </Button>
              )}

              {/* My Vision & Decisions - always available */}
              {showExpenseHighlighterButton && (
                <Button 
                  onClick={navigateToExpenseHighlighter}
                  size="lg"
                  className="w-full"
                  variant="outline"
                >
                  <DollarSign className="mr-2 h-4 w-4" /> 
                  {t('navigation.myVisionAndDecisions')}
                </Button>
              )}

              {/* Custom buttons */}
              {customButtons.map((button, index) => (
                <div key={index} className="w-full">
                  {button}
                </div>
              ))}
            </div>
          </div> 
        </CardContent>
      </Card>

      {/* Vision Board Dialog */}
      <VisionBoardDialog
        isOpen={isVisionDialogOpen}
        onClose={handleCloseVisionDialog}
        newVisionItem={newVisionItem}
        setNewVisionItem={setNewVisionItem}
        onAddItem={handleAddVisionItem}
      />

      {/* Budget Dialog */}
      <BudgetDialog
        isOpen={isBudgetDialogOpen}
        onClose={handleCloseBudgetDialog}
        budgetInput={budgetInput}
        setBudgetInput={setBudgetInput}
        onSave={handleBudgetSave}
      />
    </>
  );
} 