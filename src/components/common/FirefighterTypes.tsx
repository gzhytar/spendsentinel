"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle,
  CheckCircle2,
  Info,
  Brain,
  Heart,
  Shield,
  Smartphone,
  BookOpen,
  Calendar
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/contexts/i18n-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIdentifiedParts } from '@/lib/assessment-utils';
import { ExplorePartsButton } from './explore-parts-button';

interface FirefighterType {
  id: string;
  title: string;
  description: string;
  triggers: string[];
  behaviors: string[];
  emotions?: string[];
  innerDialogue?: string[];
  digitalFootprints?: string[];
}

interface FirefighterTypesProps {
  highlightedType?: string; // If provided, only this type will be enabled, others grayed out
  title?: string; // Custom title override
  subtitle?: string; // Custom subtitle override
  showIntroduction?: boolean; // Whether to show the introduction alert
}

export function FirefighterTypes({ 
  highlightedType, 
  title, 
  subtitle, 
  showIntroduction = true 
}: FirefighterTypesProps) {
  const { t, locale } = useI18n();
  const [selectedType, setSelectedType] = useState<string>(highlightedType || 'spender');
  const identifiedParts = useIdentifiedParts();

  const firefighterTypes: FirefighterType[] = [
    {
      id: 'spender',
      title: t('landing.firefighters.spender.title'),
      description: t('landing.firefighters.spender.description'),
      triggers: t<string[]>('landing.firefighters.spender.triggers.items'),
      behaviors: t<string[]>('landing.firefighters.spender.behaviors.items'),
      emotions: t<string[]>('landing.firefighters.spender.emotions.items'),
      innerDialogue: t<string[]>('landing.firefighters.spender.innerDialogue.items'),
      digitalFootprints: t<string[]>('landing.firefighters.spender.digitalFootprints.items'),
    },
    {
      id: 'hoarder',
      title: t('landing.firefighters.hoarder.title'),
      description: t('landing.firefighters.hoarder.description'),
      triggers: t<string[]>('landing.firefighters.hoarder.triggers.items'),
      behaviors: t<string[]>('landing.firefighters.hoarder.behaviors.items'),
      emotions: t<string[]>('landing.firefighters.hoarder.emotions.items'),
      innerDialogue: t<string[]>('landing.firefighters.hoarder.innerDialogue.items'),
      digitalFootprints: t<string[]>('landing.firefighters.hoarder.digitalFootprints.items'),
    },
    {
      id: 'avoider',
      title: t('landing.firefighters.avoider.title'),
      description: t('landing.firefighters.avoider.description'),
      triggers: t<string[]>('landing.firefighters.avoider.triggers.items'),
      behaviors: t<string[]>('landing.firefighters.avoider.behaviors.items'),
      emotions: t<string[]>('landing.firefighters.avoider.emotions.items'),
      innerDialogue: t<string[]>('landing.firefighters.avoider.innerDialogue.items'),
      digitalFootprints: t<string[]>('landing.firefighters.avoider.digitalFootprints.items'),
    },
    {
      id: 'indulger',
      title: t('landing.firefighters.indulger.title'),
      description: t('landing.firefighters.indulger.description'),
      triggers: t<string[]>('landing.firefighters.indulger.triggers.items'),
      behaviors: t<string[]>('landing.firefighters.indulger.behaviors.items'),
      emotions: t<string[]>('landing.firefighters.indulger.emotions.items'),
      innerDialogue: t<string[]>('landing.firefighters.indulger.innerDialogue.items'),
      digitalFootprints: t<string[]>('landing.firefighters.indulger.digitalFootprints.items'),
    }
  ];

  const currentType = firefighterTypes.find(type => type.id === selectedType) || firefighterTypes[0];

  const tabSections = [
    {
      id: 'behaviors',
      titleKey: 'landing.firefighters.tabs.behaviors',
      icon: Brain,
      labelKey: `landing.firefighters.${currentType.id}.behaviors.label`,
      itemIcon: CheckCircle2,
      items: currentType.behaviors,
    },
    {
      id: 'triggers',
      titleKey: 'landing.firefighters.tabs.triggers',
      icon: AlertCircle,
      labelKey: `landing.firefighters.${currentType.id}.triggers.label`,
      itemIcon: AlertCircle,
      items: currentType.triggers,
    },
    {
      id: 'emotions',
      titleKey: 'landing.firefighters.tabs.emotions',
      icon: Heart,
      labelKey: `landing.firefighters.${currentType.id}.emotions.label`,
      itemIcon: Heart,
      items: currentType.emotions,
    },
    {
      id: 'innerDialogue',
      titleKey: 'landing.firefighters.tabs.innerDialogue',
      icon: Shield,
      labelKey: `landing.firefighters.${currentType.id}.innerDialogue.label`,
      itemIcon: Shield,
      items: currentType.innerDialogue,
    },
    {
      id: 'digitalFootprints',
      titleKey: 'landing.firefighters.tabs.digitalFootprints',
      icon: Smartphone,
      labelKey: `landing.firefighters.${currentType.id}.digitalFootprints.label`,
      itemIcon: Smartphone,
      items: currentType.digitalFootprints,
    }
  ];

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

          {/* Accordion for mobile */}
          <div className="block md:hidden">
            <Accordion type="single" collapsible className="w-full" defaultValue="behaviors">
              {tabSections.map((section) => (
                section.items && section.items.length > 0 && (
                  <AccordionItem value={section.id} key={section.id}>
                    <AccordionTrigger className="bg-[#EADDCB] dark:bg-[#EADDCB]/20 px-3 rounded-md font-medium">
                      <section.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-left">{t(section.titleKey)}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2 px-3">
                      <p className="text-sm text-muted-foreground mb-3">
                        {t(section.labelKey)}
                      </p>
                      {section.items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <section.itemIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )
              ))}
            </Accordion>
          </div>

          {/* Tabs for md and up */}
          <div className="hidden md:block">
            <Tabs defaultValue="behaviors" className="w-full">
              <TabsList className=" grid-cols-5">
                {tabSections.map((section) => (
                  <TabsTrigger value={section.id} key={section.id} >
                    <section.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm whitespace-normal">{t(section.titleKey)}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabSections.map((section) => (
                section.items && section.items.length > 0 && (
                  <TabsContent value={section.id} key={section.id} className="mt-4 space-y-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      {t(section.labelKey)}
                    </p>
                    {section.items.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <section.itemIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </TabsContent>
                )
              ))}
            </Tabs>
          </div>
        </div>

        {/* Call to Action */}
        {<div className="flex flex-col sm:flex-row gap-4 pt-4">
            {!highlightedType && (
              <ExplorePartsButton 
                size="lg"
                className="flex-1 sm:flex-initial"
                customText={t('landing.firefighters.assessmentButton')}
                analyticsSource="firefighter_types"
                analyticsLocation="assessment_button"
              />
            )}
            {highlightedType && identifiedParts.length > 0 && (
              <div className="flex flex-col gap-3 w-full">
                <Button 
                    onClick={() => window.location.href = `/${locale}/daily-checkin`}
                    size="lg"
                    className="w-full"
                    variant="default"
                  >
                    <Calendar className="mr-2 h-4 w-4" /> {t('selfAssessment.dailyCheckInButton')}
                </Button>

                <Button size="lg" className="flex-1 sm:flex-initial" variant="outline" asChild>
                  <Link href={`/${locale}/parts-journal?part=${encodeURIComponent(currentType.title)}`}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    {t('landing.firefighters.workWithPartButton')}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        }
      </CardContent>
    </Card>
  );
} 