// Legacy components (for backward compatibility)
export { FirefighterTypeSelector } from './FirefighterTypeSelector';
export { FirefighterTypeContent } from './FirefighterTypeContent';
export { SectionRenderer } from './SectionRenderer';
export { useFirefighterTypeData } from './useFirefighterTypeData';
export { useSectionConfiguration } from './useSectionConfiguration';

// New unified components and utilities
export { UniversalPartsDisplay } from './UniversalPartsDisplay';
export { UniversalPartSelector } from './UniversalPartSelector';
export { useUniversalPartData } from './useUniversalPartData';
export * from './adapters';

// Types
export type { FirefighterType } from './useFirefighterTypeData';
export type { SectionConfig } from './useSectionConfiguration';
export type { UniversalPart, PartDisplayConfig } from '../../../lib/FireFighterTypes'; 