import { FIREFIGHTER_TYPE_IDS } from './assessment-utils';

/**
 * Maps a part name to its corresponding firefighter type image ID
 * @param partName - The name of the part (localized)
 * @param t - Translation function to get localized names
 * @returns The firefighter type ID for the image, or 'custom' for unknown parts
 */
export function getPartImageId(partName: string, t: (key: string) => string): string {
  // Create mapping of localized names to firefighter type IDs
  const localizedNames = FIREFIGHTER_TYPE_IDS.reduce((acc, id) => {
    acc[t(`landing.firefighters.${id}.title`)] = id;
    return acc;
  }, {} as Record<string, string>);
  
  // Look for exact match first
  if (localizedNames[partName]) {
    return localizedNames[partName];
  }
  
  // Fallback to custom image for unknown parts (custom parts from deep assessment)
  return 'custom';
}

/**
 * Gets the full image path for a part
 * @param partName - The name of the part (localized)
 * @param t - Translation function to get localized names
 * @returns The full image path
 */
export function getPartImagePath(partName: string, t: (key: string) => string): string {
  const imageId = getPartImageId(partName, t);
  return `/images/${imageId}.jpg`;
} 