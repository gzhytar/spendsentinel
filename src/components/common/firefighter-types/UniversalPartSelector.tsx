import { CheckCircle2, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import { UniversalPart } from '../../../lib/FireFighterTypes';

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
  
  const getButtonStyles = (part: UniversalPart) => {
    const isHighlighted = highlightedPartId === part.id;
    const isGrayedOut = highlightedPartId && !isHighlighted;
    const isSelected = selectedPartId === part.id;

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

    // Add special styling for custom parts
    if (part.type === 'custom') {
      baseClasses += " border-l-4 border-l-purple-400";
    }

    return baseClasses;
  };

  const getTitleStyles = (part: UniversalPart) => {
    const isHighlighted = highlightedPartId === part.id;
    return `font-medium text-sm ${isHighlighted ? 'text-green-700 font-bold' : ''}`;
  };

  const getTypeIndicator = (part: UniversalPart) => {
    if (!showTypeIndicator) return null;

    if (part.type === 'custom') {
      return (
        <div className="absolute top-2 right-2 bg-purple-100 text-purple-700 rounded-full p-1">
          <Sparkles className="w-3 h-3" />
        </div>
      );
    }

    if (part.source === 'quiz') {
      return (
        <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 rounded-full p-1">
          <CheckCircle2 className="w-3 h-3" />
        </div>
      );
    }

    return (
      <div className="absolute top-2 right-2 bg-gray-100 text-gray-700 rounded-full p-1">
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {parts.map((part) => {
        const isHighlighted = highlightedPartId === part.id;
        const isGrayedOut = highlightedPartId && !isHighlighted;
        console.log('isGrayedOut', isGrayedOut);
        console.log('highlightedPartId', highlightedPartId);
        console.log('part.id', part.id);
        
        return (
          <button
            key={part.id}
            onClick={() => onPartSelect(part.id)}
            disabled={!!isGrayedOut}
            className={getButtonStyles(part)}
          >
            <div className="relative w-full h-20 mb-3 rounded-md overflow-hidden">
              <Image
                src={getPartImage(part)}
                alt={`Illustration representing ${part.title} financial behavior`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to a default image if custom part image fails
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/default-part.jpg';
                }}
              />
              
              {getTypeIndicator(part)}
              
              {isHighlighted && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              )}
            </div>
            
            <div className={getTitleStyles(part)}>
              {part.title}
            </div>
            
            {part.type === 'custom' && (
              <div className="text-xs text-purple-600 mt-1">
                Custom Part
              </div>
            )}
            
            {isHighlighted && (
              <div className="text-xs text-green-600 mt-1 font-medium">
                {part.source === 'quiz' ? 'Quiz Result' : 'Your Type'}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
} 