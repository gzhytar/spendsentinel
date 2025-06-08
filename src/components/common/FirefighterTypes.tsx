"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Info } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { createFirefighterTypeData, FirefighterTypeId } from '@/lib/assessment-utils';
import { ExplorePartsButton } from './explore-parts-button';
import { 
  FirefighterTypeSelector, 
  FirefighterTypeContent, 
  useFirefighterTypeData,
  firefighterTypeToUniversalPart
} from './firefighter-types';

interface FirefighterTypesProps {
  highlightedType?: string;
  title?: string;
  subtitle?: string;
  showIntroduction?: boolean;
}

export function FirefighterTypes({ 
  highlightedType, 
  title, 
  subtitle, 
  showIntroduction = true 
}: FirefighterTypesProps) {
  const { t } = useI18n();
  const [selectedType, setSelectedType] = useState<string>(highlightedType || 'spender');
  
  const { firefighterTypes, currentType } = useFirefighterTypeData(selectedType, t);

  // Convert to UniversalPart format for the content component
  const currentUniversalPart = firefighterTypeToUniversalPart(currentType);

  const handleTypeSelect = (typeId: string) => {
    const isGrayedOut = highlightedType && highlightedType !== typeId;
    if (!isGrayedOut) {
      setSelectedType(typeId);
    }
  };

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
                {title || t('landing.firefighters.title')}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {subtitle || t('landing.firefighters.subtitle')}
              </CardDescription>
            </div>
          </div>
        </div>

        {showIntroduction && (
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>{t('landing.firefighters.introduction.title')}</strong> {t('landing.firefighters.introduction.description')}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <FirefighterTypeSelector
          types={firefighterTypes}
          selectedType={selectedType}
          highlightedType={highlightedType}
          onTypeSelect={handleTypeSelect}
        />

        <FirefighterTypeContent
          currentPart={currentUniversalPart}
          t={t}
        />

        {!highlightedType && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <ExplorePartsButton 
              size="lg"
              className="flex-1 sm:flex-initial w-full"
              customText={t('landing.firefighters.assessmentButton')}
              analyticsSource="firefighter_types"
              analyticsLocation="assessment_button"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 