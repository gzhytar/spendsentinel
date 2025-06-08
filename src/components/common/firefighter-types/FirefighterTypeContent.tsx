import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FirefighterType } from './useFirefighterTypeData';
import { useSectionConfiguration } from './useSectionConfiguration';
import { SectionRenderer } from './SectionRenderer';

interface FirefighterTypeContentProps {
  currentType: FirefighterType;
  t: (key: string) => string;
}

export function FirefighterTypeContent({ currentType, t }: FirefighterTypeContentProps) {
  const { availableSections } = useSectionConfiguration(currentType, t);

  if (availableSections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Type Header */}
      <div className="flex items-center space-x-6">
        <div className="flex-1">
          <h4 className="text-xl font-semibold mb-2">{currentType.title}</h4>
          <p className="text-muted-foreground">{currentType.description}</p>
        </div>
      </div>

      {/* Mobile Accordion */}
      <div className="block md:hidden">
        <Accordion type="single" collapsible className="w-full" defaultValue="behaviors">
          {availableSections.map((section) => (
            <AccordionItem value={section.id} key={section.id}>
              <AccordionTrigger className="bg-[#EADDCB] dark:bg-[#EADDCB]/20 px-3 rounded-md font-medium">
                <section.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-left">{t(section.titleKey)}</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 px-3">
                <SectionRenderer section={section} t={t} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <Tabs defaultValue="behaviors" className="w-full">
          <TabsList className="grid-cols-5">
            {availableSections.map((section) => (
              <TabsTrigger value={section.id} key={section.id}>
                <section.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm whitespace-normal">{t(section.titleKey)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {availableSections.map((section) => (
            <TabsContent value={section.id} key={section.id} className="mt-4">
              <SectionRenderer section={section} t={t} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
} 