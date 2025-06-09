'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight, Calendar, Eye, Calculator, DollarSign } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { useBudget } from '@/hooks/use-budget';
import { useJourneyNavigation } from '@/hooks/use-journey-navigation';
import { BudgetManagement } from '@/components/ui/budget-management';
import { VisionBoardItem } from '@/types';

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

// Extract the vision board dialog component to reuse the same logic as expense-highlighter
function AddVisionBoardItemDialog({ 
  isOpen, 
  onClose, 
  onAddItem 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAddItem: (item: Omit<VisionBoardItem, 'id'>) => void; 
}) {
  const { t } = useI18n();
  const [newItemType, setNewItemType] = useState<'text' | 'image'>('text');
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const handleAddItem = () => {
    if (!newItemContent) return;
    
    // For image type, use a placeholder if content is not a URL
    const content = newItemType === 'image' && !newItemContent.startsWith('https://') 
      ? `https://placehold.co/300x200.png` 
      : newItemContent;
      
    const newItem = {
      type: newItemType,
      content: content,
      description: newItemType === 'image' ? newItemDescription : undefined,
    };
    
    onAddItem(newItem);
    
    // Reset form and close dialog
    setNewItemContent('');
    setNewItemDescription('');
    setNewItemType('text');
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setNewItemContent('');
    setNewItemDescription('');
    setNewItemType('text');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('expenseHighlighter.visionBoard.addItem')}</DialogTitle>
          <DialogDescription>
            {t('expenseHighlighter.visionBoard.addItemDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-type" className="text-right">
              {t('expenseHighlighter.visionBoard.form.type')}
            </Label>
            <select 
              id="item-type" 
              value={newItemType} 
              onChange={(e) => setNewItemType(e.target.value as 'text'|'image')} 
              className="col-span-3 border border-input rounded-md px-3 py-2 text-sm"
            >
              <option value="text">{t('expenseHighlighter.visionBoard.form.types.text')}</option>
              <option value="image">{t('expenseHighlighter.visionBoard.form.types.image')}</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-content" className="text-right">
              {t('expenseHighlighter.visionBoard.form.content')}
            </Label>
            {newItemType === 'text' ? (
              <Input 
                id="item-content" 
                value={newItemContent} 
                onChange={(e) => setNewItemContent(e.target.value)} 
                className="col-span-3" 
              />
            ) : (
              <Input 
                id="item-content" 
                type="url" 
                value={newItemContent} 
                onChange={(e) => setNewItemContent(e.target.value)} 
                className="col-span-3" 
                placeholder="https://..." 
              />
            )}
          </div>
          {newItemType === 'image' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-description" className="text-right">
                {t('expenseHighlighter.visionBoard.form.description')}
              </Label>
              <Input 
                id="item-description" 
                value={newItemDescription} 
                onChange={(e) => setNewItemDescription(e.target.value)} 
                className="col-span-3" 
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('expenseHighlighter.visionBoard.form.cancel')}
          </Button>
          <Button onClick={handleAddItem} disabled={!newItemContent}>
            {t('expenseHighlighter.visionBoard.form.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
  const { budget, updateBudget } = useBudget();
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isVisionDialogOpen, setIsVisionDialogOpen] = useState(false);
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([]);

  // Load vision board items on mount
  useEffect(() => {
    const storedVisionItems = localStorage.getItem('visionBoardItems');
    if (storedVisionItems) {
      setVisionBoardItems(JSON.parse(storedVisionItems));
    }
  }, []);

  const {
    shouldShowVisionBoardButton,
    shouldShowBudgetButton,
    navigateToCheckin,
    navigateToExpenseHighlighter,
  } = useJourneyNavigation({ lang, onAction });

  const handleBudgetSave = (newBudget: { monthlyIncome: number; spendBudget: number; savingTarget: number }) => {
    updateBudget(newBudget);
    setIsBudgetDialogOpen(false);
  };

  const handleCloseBudgetDialog = () => {
    setIsBudgetDialogOpen(false);
  };

  const handleBudgetAction = () => {
    onAction?.('budget');
    setIsBudgetDialogOpen(true);
  };

  const handleVisionBoardAction = () => {
    onAction?.('vision-board');
    setIsVisionDialogOpen(true);
  };

  const handleAddVisionBoardItem = (item: Omit<VisionBoardItem, 'id'>) => {
    const newItem: VisionBoardItem = {
      ...item,
      id: Date.now().toString(),
    };
    const updatedItems = [...visionBoardItems, newItem];
    setVisionBoardItems(updatedItems);
    localStorage.setItem('visionBoardItems', JSON.stringify(updatedItems));
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
      <AddVisionBoardItemDialog
        isOpen={isVisionDialogOpen}
        onClose={() => setIsVisionDialogOpen(false)}
        onAddItem={handleAddVisionBoardItem}
      />

      {/* Budget Management Dialog */}
      <BudgetManagement.Dialog
        isOpen={isBudgetDialogOpen}
        onClose={handleCloseBudgetDialog}
        initialBudget={budget}
        onSave={handleBudgetSave}
      />
    </>
  );
} 