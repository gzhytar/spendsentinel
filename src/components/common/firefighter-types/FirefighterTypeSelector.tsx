import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { FirefighterType } from './useFirefighterTypeData';
import { useI18n } from '@/contexts/i18n-context';

interface FirefighterTypeSelectorProps {
  types: FirefighterType[];
  selectedType: string;
  highlightedType?: string;
  onTypeSelect: (typeId: string) => void;
}

export function FirefighterTypeSelector({
  types,
  selectedType,
  highlightedType,
  onTypeSelect
}: FirefighterTypeSelectorProps) {
  const { t } = useI18n();
  const getButtonStyles = (type: FirefighterType) => {
    const isHighlighted = highlightedType === type.id;
    const isGrayedOut = highlightedType && !isHighlighted;
    const isSelected = selectedType === type.id;

    let baseClasses = "p-4 rounded-lg border-2 transition-all overflow-hidden";
    
    if (isSelected) {
      baseClasses += " border-primary bg-primary/5";
    } else {
      baseClasses += " border-muted hover:border-muted-foreground/30";
    }
    
    if (isGrayedOut) {
      baseClasses += " opacity-40 cursor-not-allowed grayscale";
    }
    
    if (isHighlighted) {
      baseClasses += " ring-2 ring-green-400 border-green-400 bg-green-50 dark:bg-green-950/20";
    }

    return baseClasses;
  };

  const getTitleStyles = (type: FirefighterType) => {
    const isHighlighted = highlightedType === type.id;
    return `font-medium text-sm ${isHighlighted ? 'text-green-700 font-bold' : ''}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {types.map((type) => {
        const isHighlighted = highlightedType === type.id;
        const isGrayedOut = highlightedType && !isHighlighted;
        
        return (
          <button
            key={type.id}
            onClick={() => onTypeSelect(type.id)}
            disabled={!!isGrayedOut}
            className={getButtonStyles(type)}
          >
            <div className="relative w-full h-20 mb-3 rounded-md overflow-hidden">
              <Image
                src={`/images/${type.id}.jpg`}
                alt={`Illustration representing ${type.title} financial behavior`}
                fill
                className="object-cover"
              />
              {isHighlighted && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              )}
            </div>
            <div className={getTitleStyles(type)}>
              {type.title}
            </div>
            {isHighlighted && (
              <div className="text-xs text-green-600 mt-1 font-medium">
                {t('parts.labels.yourType')}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
} 