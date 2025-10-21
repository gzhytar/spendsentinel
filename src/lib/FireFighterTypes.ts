/**
 * Universal interface for both predefined and custom financial parts
 */
export interface UniversalPart {
  id: string; // For predefined: FirefighterTypeId, for custom: generated ID
  title: string; // Part name
  description: string; // Part description
  triggers: string[];
  behaviors: string[];
  emotions?: string[];
  innerDialogue?: string[];
  digitalFootprints?: string[];
  
  // Metadata to distinguish between types
  type: 'predefined' | 'custom';
  source?: 'quiz' | 'deep-assessment' | 'system';
  
  // Additional fields for custom parts
  role?: string; // IFS role
  burden?: string; // IFS burden
  concern?: string; // IFS concern
  engagementStrategy?: 'direct' | 'gentle' | 'validation';
}

/**
 * Configuration for displaying parts
 */
export interface PartDisplayConfig {
  showTypeSelector?: boolean;
  highlightedPart?: string;
  allowSelection?: boolean;
  showOnlyCustom?: boolean;
  showOnlyPredefined?: boolean;
  title?: string;
  subtitle?: string;
  showIntroduction?: boolean;
} 