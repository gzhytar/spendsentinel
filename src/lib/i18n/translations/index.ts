import { en } from './en';
import { cs } from './cs';
import { ru } from './ru';

export const translations = {
  en,
  cs,
  ru,
} as const;

export type Locale = keyof typeof translations;