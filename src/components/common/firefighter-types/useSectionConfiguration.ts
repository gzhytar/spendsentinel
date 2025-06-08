import { useMemo } from 'react';
import { LucideIcon, AlertCircle, CheckCircle2, Brain, Heart, Shield, Smartphone } from 'lucide-react';
import { FirefighterType } from './useFirefighterTypeData';

export interface SectionConfig {
  id: string;
  titleKey: string;
  icon: LucideIcon;
  labelKey: string;
  itemIcon: LucideIcon;
  items: string[] | undefined;
}

interface UseSectionConfigurationReturn {
  sections: SectionConfig[];
  availableSections: SectionConfig[];
}

export function useSectionConfiguration(
  currentType: FirefighterType,
  t: (key: string) => string
): UseSectionConfigurationReturn {
  const sections = useMemo(() => [
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
  ], [currentType]);

  const availableSections = useMemo(
    () => sections.filter(section => section.items && section.items.length > 0),
    [sections]
  );

  return {
    sections,
    availableSections
  };
} 