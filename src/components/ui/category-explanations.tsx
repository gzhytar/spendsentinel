'use client';

import { useI18n } from '@/contexts/i18n-context';
import { getCategoriesByType } from '@/lib/constants/categories';

export function CategoryExplanations() {
  const { t } = useI18n();
  const expenseCategories = getCategoriesByType('expense');
  const savingCategories = getCategoriesByType('saving');

  const getCategoryIcon = (IconComponent: any, size: 'lg' = 'lg') => {
    const dimensions = {
      lg: "h-6 w-6"
    };
    
    return <IconComponent className={`${dimensions[size]} flex-shrink-0`} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Spending Categories - Left Side */}
      <div>
        <h3 className="font-semibold text-lg mb-3">{t('expenseHighlighter.form.types.expense')}</h3>
        <div className="space-y-4">
          {expenseCategories.map((category) => {
            if (category.id === 'unassigned') return null; // Skip unassigned for explanation
            
            return (
              <div key={category.id} className="flex items-start space-x-3">
                {getCategoryIcon(category.icon)}
                <div>
                  <strong>{t(category.translationKey)}:</strong>
                  <p className="text-muted-foreground text-sm">{t(category.descriptionKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savings Categories - Right Side */}
      <div>
        <h3 className="font-semibold text-lg mb-3">{t('expenseHighlighter.form.types.saving')}</h3>
        <div className="space-y-4">
          {savingCategories.map((category) => {
            if (category.id === 'unassigned') return null; // Skip unassigned for explanation
            
            return (
              <div key={category.id} className="flex items-start space-x-3">
                {getCategoryIcon(category.icon)}
                <div>
                  <strong>{t(category.translationKey)}:</strong>
                  <p className="text-muted-foreground text-sm">{t(category.descriptionKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 