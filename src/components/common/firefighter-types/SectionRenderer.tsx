import { SectionConfig } from './useSectionConfiguration';

interface SectionRendererProps {
  section: SectionConfig;
  t: (key: string) => string;
  showLabel?: boolean;
}

export function SectionRenderer({ section, t, showLabel = true }: SectionRendererProps) {
  if (!section.items || section.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {showLabel && (
        <p className="text-sm text-muted-foreground mb-3">
          {t(section.labelKey)}
        </p>
      )}
      {section.items.map((item, index) => (
        <div key={index} className="flex items-start space-x-3">
          <section.itemIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm">{item}</p>
        </div>
      ))}
    </div>
  );
} 