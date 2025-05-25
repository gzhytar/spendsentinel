"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Info,
  Brain,
  Heart,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/contexts/i18n-context';

interface FirefighterType {
  id: string;
  title: string;
  description: string;
  triggers: string[];
  behaviors: string[];
}

interface FirefighterTypesProps {
  highlightedType?: string; // If provided, only this type will be enabled, others grayed out
  showActions?: boolean; // Whether to show the action buttons at the bottom
  title?: string; // Custom title override
  subtitle?: string; // Custom subtitle override
  showIntroduction?: boolean; // Whether to show the introduction alert
}

export function FirefighterTypes({ 
  highlightedType, 
  showActions = true, 
  title, 
  subtitle, 
  showIntroduction = true 
}: FirefighterTypesProps) {
  const { t, locale } = useI18n();
  const localePrefix = `/${locale}`;
  const [selectedType, setSelectedType] = useState<string>(highlightedType || 'spender');

  const firefighterTypes: FirefighterType[] = [
    {
      id: 'spender',
      title: t('landing.firefighters.spender.title'),
      description: t('landing.firefighters.spender.description'),
      triggers: t<string[]>('landing.firefighters.spender.triggers.items'),
      behaviors: t<string[]>('landing.firefighters.spender.behaviors.items'),
    },
    {
      id: 'hoarder',
      title: t('landing.firefighters.hoarder.title'),
      description: t('landing.firefighters.hoarder.description'),
      triggers: t<string[]>('landing.firefighters.hoarder.triggers.items'),
      behaviors: t<string[]>('landing.firefighters.hoarder.behaviors.items'),
    },
    {
      id: 'avoider',
      title: t('landing.firefighters.avoider.title'),
      description: t('landing.firefighters.avoider.description'),
      triggers: t<string[]>('landing.firefighters.avoider.triggers.items'),
      behaviors: t<string[]>('landing.firefighters.avoider.behaviors.items'),
    },
    {
      id: 'indulger',
      title: t('landing.firefighters.indulger.title'),
      description: t('landing.firefighters.indulger.description'),
      triggers: t<string[]>('landing.firefighters.indulger.triggers.items'),
      behaviors: t<string[]>('landing.firefighters.indulger.behaviors.items'),
    }
  ];

  const currentType = firefighterTypes.find(type => type.id === selectedType) || firefighterTypes[0];

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

        {/* Educational Introduction */}
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
        {/* Interactive Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {firefighterTypes.map((type) => {
            const isHighlighted = highlightedType === type.id;
            const isGrayedOut = highlightedType && !isHighlighted;
            
            return (
              <button
                key={type.id}
                onClick={() => !isGrayedOut && setSelectedType(type.id)}
                disabled={!!isGrayedOut}
                className={`p-4 rounded-lg border-2 transition-all overflow-hidden ${
                  selectedType === type.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-muted-foreground/30'
                } ${
                  isGrayedOut 
                    ? 'opacity-40 cursor-not-allowed grayscale' 
                    : ''
                } ${
                  isHighlighted 
                    ? 'ring-2 ring-green-400 border-green-400 bg-green-50 dark:bg-green-950/20' 
                    : ''
                }`}
              >
                <div className="relative w-full h-20 mb-3 rounded-md overflow-hidden">
                  <Image
                    src={`/images/${type.id}.jpg`}
                    alt={type.title}
                    fill
                    className="object-cover"
                  />
                  {isHighlighted && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                  )}
                </div>
                <div className={`font-medium text-sm ${isHighlighted ? 'text-green-700 font-bold' : ''}`}>
                  {type.title}
                </div>
                {isHighlighted && (
                  <div className="text-xs text-green-600 mt-1 font-medium">
                    Your Type
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Type Information */}
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{currentType.title}</h3>
              <p className="text-muted-foreground">{currentType.description}</p>
            </div>
          </div>

          {/* Triggers and Behaviors in Tabs */}
          <Tabs defaultValue="behaviors" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="behaviors">
                <Brain className="w-4 h-4 mr-2" />
                {t('landing.firefighters.tabs.behaviors')}
              </TabsTrigger>
              <TabsTrigger value="triggers">
                <AlertCircle className="w-4 h-4 mr-2" />
                {t('landing.firefighters.tabs.triggers')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="triggers" className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                {t(`landing.firefighters.${currentType.id}.triggers.label`)}
              </p>
              {currentType.triggers.map((trigger, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <p className="text-sm">{trigger}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="behaviors" className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                {t(`landing.firefighters.${currentType.id}.behaviors.label`)}
              </p>
              {currentType.behaviors.map((behavior, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{behavior}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Call to Action */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="flex-1 sm:flex-initial" asChild>
              <Link href={`${localePrefix}/self-assessment`}>
                {t('landing.firefighters.assessmentButton')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 