'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Home, ShoppingBag, HelpCircle, Shield, Target, TrendingUp } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { Checkbox } from '@/components/ui/checkbox';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: 'living' | 'lifestyle' | 'unassigned' | 'emergency' | 'goals' | 'investment';
  date: string;
  type: 'expense' | 'saving';
  triggeredParts?: string[];
}

interface AddExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>, journalNotes?: Record<string, string>) => void;
  showTriggeredParts?: boolean;
  availableParts?: string[];
  onPartToggle?: (part: string, isSelected: boolean) => void;
  selectedParts?: string[];
}

export function AddExpenseForm({ 
  onAddExpense, 
  showTriggeredParts = false,
  availableParts = [],
  onPartToggle,
  selectedParts = []
}: AddExpenseFormProps) {
  const { t, locale } = useI18n();
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    amount: 0,
    description: '',
    category: 'living',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    triggeredParts: [],
  });
  const [journalNotes, setJournalNotes] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleCategoryChange = (value: 'living' | 'lifestyle' | 'unassigned' | 'emergency' | 'goals' | 'investment') => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleTypeChange = (value: 'expense' | 'saving') => {
    setFormData(prev => ({ 
      ...prev, 
      type: value,
      // Reset category when type changes
      category: value === 'expense' ? 'living' : 'emergency'
    }));
  };

  const handleJournalNoteChange = (part: string, note: string) => {
    setJournalNotes(prev => ({
      ...prev,
      [part]: note
    }));
  };

  const handleSubmit = () => {
    if (!formData.description || !formData.amount) return;

    const expenseToAdd = {
      ...formData,
      triggeredParts: showTriggeredParts ? selectedParts : []
    };

    // Only pass journal notes for selected parts
    const relevantJournalNotes: Record<string, string> = {};
    selectedParts.forEach(part => {
      if (journalNotes[part]?.trim()) {
        relevantJournalNotes[part] = journalNotes[part];
      }
    });

    onAddExpense(expenseToAdd, relevantJournalNotes);
    
    // Reset form
    setFormData({
      amount: 0,
      description: '',
      category: 'living',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      triggeredParts: [],
    });
    setJournalNotes({});
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'living':
        return <Home className="mr-2 h-4 w-4 text-chart-1" />;
      case 'lifestyle':
        return <ShoppingBag className="mr-2 h-4 w-4 text-chart-2" />;
      case 'emergency':
        return <Shield className="mr-2 h-4 w-4 text-green-600" />;
      case 'goals':
        return <Target className="mr-2 h-4 w-4 text-blue-600" />;
      case 'investment':
        return <TrendingUp className="mr-2 h-4 w-4 text-purple-600" />;
      default:
        return <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">
        {t('expenseHighlighter.addTransaction')}
      </h3>
      
      <div className="space-y-4">
        {/* Type Selector */}
        <div>
          <Label>{t('expenseHighlighter.form.type')}</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={handleTypeChange}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense" className="cursor-pointer">
                {t('expenseHighlighter.form.types.expense')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="saving" id="saving" />
              <Label htmlFor="saving" className="cursor-pointer">
                {t('expenseHighlighter.form.types.saving')}
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">{t('expenseHighlighter.form.amount')}</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount || ''}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
          
          <div>
            <Label htmlFor="category">{t('expenseHighlighter.form.category')}</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formData.type === 'expense' ? (
                  <>
                    <SelectItem value="living">
                      <div className="flex items-center">
                        {getCategoryIcon('living')}
                        <span>{t('expenseHighlighter.categories.living')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="lifestyle">
                      <div className="flex items-center">
                        {getCategoryIcon('lifestyle')}
                        <span>{t('expenseHighlighter.categories.lifestyle')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="unassigned">
                      <div className="flex items-center">
                        {getCategoryIcon('unassigned')}
                        <span>{t('expenseHighlighter.unassigned')}</span>
                      </div>
                    </SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="emergency">
                      <div className="flex items-center">
                        {getCategoryIcon('emergency')}
                        <span>{t('expenseHighlighter.savingCategories.emergency')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="goals">
                      <div className="flex items-center">
                        {getCategoryIcon('goals')}
                        <span>{t('expenseHighlighter.savingCategories.goals')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="investment">
                      <div className="flex items-center">
                        {getCategoryIcon('investment')}
                        <span>{t('expenseHighlighter.savingCategories.investment')}</span>
                      </div>
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">{t('expenseHighlighter.form.description')}</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={t('expenseHighlighter.form.description')}
          />
        </div>

        <div>
          <Label htmlFor="date">{t('expenseHighlighter.form.date')}</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>
        
        {showTriggeredParts && (
          <div>
            <Label>{t('dailyCheckIn.steps.expenseLogging.triggeredParts')}</Label>
            {availableParts.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {availableParts.map((part) => (
                  <label key={part} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={selectedParts.includes(part)}
                      onCheckedChange={(checked) => onPartToggle?.(part, !!checked)}
                    />
                    <span className="text-sm">{part}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="mt-2 p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">
                  {t('dailyCheckIn.steps.expenseLogging.noPartsMessage')}{' '}
                  <a href={`/${locale}/self-assessment`} className="text-primary hover:underline">
                    {t('selfAssessment.title')}
                  </a>
                  {t('dailyCheckIn.steps.expenseLogging.noPartsMessageAfter')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Journal Notes for Selected Parts */}
        {showTriggeredParts && selectedParts.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">{t('dailyCheckIn.steps.expenseLogging.journalNotes')}</Label>
            {selectedParts.map((part) => (
              <div key={part} className="space-y-2">
                <Label className="text-sm">{part} {t('dailyCheckIn.steps.expenseLogging.partNote')}</Label>
                <Textarea
                  value={journalNotes[part] || ''}
                  onChange={(e) => handleJournalNoteChange(part, e.target.value)}
                  placeholder={t('dailyCheckIn.steps.expenseLogging.journalPlaceholder')}
                  className="min-h-[60px]"
                />
              </div>
            ))}
          </div>
        )}
        
        <Button onClick={handleSubmit} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {formData.type === 'expense' 
            ? t('expenseHighlighter.addExpense') 
            : t('expenseHighlighter.addSaving')
          }
        </Button>
      </div>
    </Card>
  );
} 