import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Info } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { UniversalPart, PartDisplayConfig } from '../../../lib/FireFighterTypes';
import { UniversalPartSelector } from './UniversalPartSelector';
import { FirefighterTypeContent } from './FirefighterTypeContent';
import { useUniversalPartData } from './useUniversalPartData';
import { ExplorePartsButton } from '../explore-parts-button';

interface UniversalPartsDisplayProps extends PartDisplayConfig {
  customParts?: UniversalPart[];
  onPartSelect?: (part: UniversalPart) => void;
  showCallToAction?: boolean;
}

export function UniversalPartsDisplay({
  customParts = [],
  highlightedPart,
  title,
  subtitle,
  showIntroduction = true,
  showTypeSelector = true,
  allowSelection = true,
  showOnlyCustom = false,
  showOnlyPredefined = false,
  showCallToAction = true,
  onPartSelect
}: UniversalPartsDisplayProps) {
  const { t } = useI18n();
  const [selectedPartId, setSelectedPartId] = useState<string>(
    highlightedPart || customParts[0]?.id || 'spender'
  );

  const config: PartDisplayConfig = {
    showOnlyCustom,
    showOnlyPredefined,
    highlightedPart
  };

  const { availableParts, currentPart } = useUniversalPartData({
    selectedPartId,
    t,
    customParts,
    config
  });

  const handlePartSelect = (partId: string) => {
    if (!allowSelection) return;
    
    const isGrayedOut = highlightedPart && highlightedPart !== partId;
    if (!isGrayedOut) {
      setSelectedPartId(partId);
      const selectedPart = availableParts.find(p => p.id === partId);
      if (selectedPart && onPartSelect) {
        onPartSelect(selectedPart);
      }
    }
  };

  const getDisplayTitle = () => {
    if (title) return title;
    if (showOnlyCustom) return t('assessment.results.title');
    if (showOnlyPredefined) return t('landing.firefighters.title');
    return t('parts.overview.title');
  };

  const getDisplaySubtitle = () => {
    if (subtitle) return subtitle;
    if (showOnlyCustom) return t('assessment.results.subtitle');
    if (showOnlyPredefined) return t('landing.firefighters.subtitle');
    return t('parts.overview.subtitle');
  };

  if (availableParts.length === 0) {
    return (
      <Card className="shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            {showOnlyCustom 
              ? t('assessment.results.noParts') 
              : t('parts.overview.noParts')
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Brain className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl">
                {getDisplayTitle()}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {getDisplaySubtitle()}
              </CardDescription>
            </div>
          </div>
        </div>

        {showIntroduction && (
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>{t('parts.introduction.title')}</strong> {t('parts.introduction.description')}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {showTypeSelector && (
          <UniversalPartSelector
            parts={availableParts}
            selectedPartId={selectedPartId}
            highlightedPartId={highlightedPart}
            onPartSelect={handlePartSelect}
            showTypeIndicator={!showOnlyPredefined && !showOnlyCustom}
          />
        )}

        <FirefighterTypeContent
          currentPart={currentPart}
          t={t}
        />

        {showCallToAction && !highlightedPart && !showOnlyCustom && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <ExplorePartsButton 
              size="lg"
              className="flex-1 sm:flex-initial w-full"
              customText={t('landing.firefighters.assessmentButton')}
              analyticsSource="universal_parts_display"
              analyticsLocation="assessment_button"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 