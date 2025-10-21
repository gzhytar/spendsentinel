import { useMemo } from 'react';
import { LucideIcon, AlertCircle, CheckCircle2, Brain, Heart, Shield, Smartphone } from 'lucide-react';
import { UniversalPart } from '../../../lib/FireFighterTypes';

export interface SectionConfig {
  id: string;
  titleKey: string;
  icon: LucideIcon;
  labelKey: string;
  itemIcon: LucideIcon;
  items: string[] | undefined;
  customContent?: string; // For custom parts with special content
}

interface UseSectionConfigurationReturn {
  sections: SectionConfig[];
  availableSections: SectionConfig[];
}

export function useSectionConfiguration(
  currentPart: UniversalPart
): UseSectionConfigurationReturn {
  const sections = useMemo(() => {
    const baseSections: SectionConfig[] = [
      {
        id: 'behaviors',
        titleKey: 'landing.firefighters.tabs.behaviors',
        icon: Brain,
        labelKey: currentPart.type === 'predefined' 
          ? `landing.firefighters.${currentPart.id}.behaviors.label`
          : 'assessment.results.behaviors.label',
        itemIcon: CheckCircle2,
        items: currentPart.behaviors,
      },
      {
        id: 'triggers',
        titleKey: 'landing.firefighters.tabs.triggers',
        icon: AlertCircle,
        labelKey: currentPart.type === 'predefined'
          ? `landing.firefighters.${currentPart.id}.triggers.label`
          : 'assessment.results.triggers.label',
        itemIcon: AlertCircle,
        items: currentPart.triggers,
      },
      {
        id: 'emotions',
        titleKey: 'landing.firefighters.tabs.emotions',
        icon: Heart,
        labelKey: currentPart.type === 'predefined'
          ? `landing.firefighters.${currentPart.id}.emotions.label`
          : 'assessment.results.emotions.label',
        itemIcon: Heart,
        items: currentPart.emotions,
      },
      {
        id: 'innerDialogue',
        titleKey: 'landing.firefighters.tabs.innerDialogue',
        icon: Shield,
        labelKey: currentPart.type === 'predefined'
          ? `landing.firefighters.${currentPart.id}.innerDialogue.label`
          : 'assessment.results.innerDialogue.label',
        itemIcon: Shield,
        items: currentPart.innerDialogue,
      },
      {
        id: 'digitalFootprints',
        titleKey: 'landing.firefighters.tabs.digitalFootprints',
        icon: Smartphone,
        labelKey: currentPart.type === 'predefined'
          ? `landing.firefighters.${currentPart.id}.digitalFootprints.label`
          : 'assessment.results.digitalFootprints.label',
        itemIcon: Smartphone,
        items: currentPart.digitalFootprints,
      }
    ];

    // Custom parts use the same base sections as predefined parts
    // IFS-specific sections (role, burden, concern) are not displayed in the UI

    return baseSections;
  }, [currentPart]);

  const availableSections = useMemo(
    () => sections.filter(section => 
      (section.items && section.items.length > 0) || section.customContent
    ),
    [sections]
  );

  return {
    sections,
    availableSections
  };
} 