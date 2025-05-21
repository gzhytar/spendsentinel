import { en } from './en';
import { cs } from './cs';
import { ru } from './ru';
import { uk } from './uk';

export const translations = {
  en,
  cs,
  ru,
  uk,
} as const;

export type Locale = keyof typeof translations;