import { CheckCircle2, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import { UniversalPart } from '../../../lib/FireFighterTypes';
import { useI18n } from '@/contexts/i18n-context';

interface UniversalPartSelectorProps {
  parts: UniversalPart[];
  selectedPartId: string;
  highlightedPartId?: string;
  onPartSelect: (partId: string) => void;
  showTypeIndicator?: boolean;
}

export function UniversalPartSelector({
  parts,
  selectedPartId,
  highlightedPartId,
  onPartSelect,
  showTypeIndicator = true
}: UniversalPartSelectorProps) {
  const { t } = useI18n();
  
  const getButtonStyles = (part: UniversalPart) => {
    const isHighlighted = highlightedPartId === part.id;
    const isGrayedOut = highlightedPartId && !isHighlighted;
    const isSelected = selectedPartId === part.id;

    let baseClasses = "relative rounded-lg border-2 transition-all overflow-hidden group cursor-pointer";
    
    if (isSelected) {
      baseClasses += " border-primary ring-2 ring-primary/20";
    } else {
      baseClasses += " border-muted hover:border-muted-foreground/50 hover:shadow-md";
    }
    
    if (isGrayedOut) {
      baseClasses += " opacity-40 cursor-not-allowed grayscale";
    }
    
    if (isHighlighted) {
      baseClasses += " ring-2 ring-green-400 border-green-400";
    }

    // Add special styling for custom parts
    if (part.type === 'custom') {
      baseClasses += " border-l-4 border-l-purple-400";
    }

    return baseClasses;
  };

  const getTitleStyles = (part: UniversalPart) => {
    const isHighlighted = highlightedPartId === part.id;
    return `font-semibold text-sm md:text-base text-white drop-shadow-lg ${isHighlighted ? 'text-green-100' : ''}`;
  };

  const getTypeIndicator = (part: UniversalPart) => {
    if (!showTypeIndicator) return null;

    if (part.type === 'custom') {
      return (
        <div className="absolute top-2 right-2 bg-purple-100/90 text-purple-700 rounded-full p-1 z-10">
          <Sparkles className="w-3 h-3" />
        </div>
      );
    }

    if (part.source === 'quiz') {
      return (
        <div className="absolute top-2 right-2 bg-blue-100/90 text-blue-700 rounded-full p-1 z-10">
          <CheckCircle2 className="w-3 h-3" />
        </div>
      );
    }

    return (
      <div className="absolute top-2 right-2 bg-gray-100/90 text-gray-700 rounded-full p-1 z-10">
        <Users className="w-3 h-3" />
      </div>
    );
  };

  const getPartImage = (part: UniversalPart) => {
    if (part.type === 'predefined') {
      return `/images/${part.id}.jpg`;
    }
    
    // For custom parts, use a default or generated image
    return '/images/custom.jpg';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {parts.map((part) => {
        const isHighlighted = highlightedPartId === part.id;
        const isGrayedOut = highlightedPartId && !isHighlighted;
        
        return (
          <button
            key={part.id}
            onClick={() => onPartSelect(part.id)}
            disabled={!!isGrayedOut}
            className={getButtonStyles(part)}
            style={{ aspectRatio: '1' }} // Force square aspect ratio
          >
            {/* Full-size background image */}
            <div className="absolute inset-0">
              <Image
                src={getPartImage(part)}
                alt={`Illustration representing ${part.title} financial behavior`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to a default image if custom part image fails
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/default-part.jpg';
                }}
              />
              
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            
            {getTypeIndicator(part)}
            
            {/* Overlapping content at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
              <div className={getTitleStyles(part)}>
                {part.title}
              </div>
              
              {part.type === 'custom' && (
                <div className="text-xs text-purple-200 mt-1 font-medium">
                  {t('parts.labels.customPart')}
                </div>
              )}
              
              {isHighlighted && (
                <div className="text-xs text-green-200 mt-1 font-medium">
                  {part.source === 'quiz' ? t('parts.labels.quizResult') : t('parts.labels.yourType')}
                </div>
              )}
            </div>
            
            {/* Selection indicator overlay */}
            {isHighlighted && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/30 z-20">
                <CheckCircle2 className="w-8 h-8 text-green-100 drop-shadow-lg" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
} 