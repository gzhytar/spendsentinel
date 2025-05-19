# Localization and Internationalization Guide

## Overview

This project implements a comprehensive localization (l10n) and internationalization (i18n) system using React and TypeScript. The system supports multiple languages (currently English, Czech, and Russian) and provides a type-safe way to manage translations.

## Architecture

### 1. Translation Files

Translations are stored in the `src/lib/i18n/translations` directory, with separate files for each language:
- `en.ts` - English translations
- `cs.ts` - Czech translations
- `ru.ts` - Russian translations

Each translation file exports a constant object with the same structure, ensuring type safety across languages.

### 2. Translation Structure

Translations are organized hierarchically by feature and component. For example:

```typescript
export const en = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    // ...
  },
  navigation: {
    home: 'Home',
    expenseHighlighter: 'Expense Highlighter',
    // ...
  },
  // Feature-specific translations
  expenseHighlighter: {
    title: 'Expense Highlighter',
    subtitle: 'Track and categorize your expenses...',
    // ...
  }
} as const;
```

### 3. I18n Context

The application uses a React context (`I18nContext`) to manage the current language and provide translation functions. The context is implemented in `src/contexts/i18n-context.tsx`.

Key features:
- Language switching
- Translation function (`t`)
- Type-safe translation keys
- Fallback to English for missing translations

## Usage

### 1. Accessing Translations

In any component, use the `useI18n` hook to access translations:

```typescript
import { useI18n } from '@/contexts/i18n-context';

function MyComponent() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

### 2. Adding New Translations

1. Add new translation keys to all language files (`en.ts`, `cs.ts`, `ru.ts`)
2. Maintain the same structure across all files
3. Use TypeScript's `as const` assertion to ensure type safety

Example:
```typescript
// In en.ts
export const en = {
  newFeature: {
    title: 'New Feature',
    description: 'Description in English'
  }
} as const;

// In cs.ts
export const cs = {
  newFeature: {
    title: 'Nová Funkce',
    description: 'Popis v češtině'
  }
} as const;
```

### 3. Dynamic Content

For dynamic content, use string interpolation with the `t` function:

```typescript
// In translation files
{
  welcome: 'Welcome, {name}!'
}

// In component
const name = 'John';
t('welcome', { name });
```

### 4. Pluralization

For pluralization, use separate keys:

```typescript
// In translation files
{
  items: {
    one: '1 item',
    other: '{count} items'
  }
}

// In component
const count = 5;
t('items', { count });
```

## Best Practices

1. **Type Safety**
   - Always use TypeScript's `as const` assertion in translation files
   - Use the `useI18n` hook for type-safe translations

2. **Organization**
   - Group translations by feature/component
   - Use consistent naming conventions
   - Keep translation keys descriptive and hierarchical

3. **Maintenance**
   - Add new translations to all language files simultaneously
   - Use English as the source of truth
   - Document any special translation requirements

4. **Performance**
   - Avoid unnecessary re-renders by memoizing translation functions
   - Use lazy loading for language files if needed

## Adding a New Language

1. Create a new translation file in `src/lib/i18n/translations/`
2. Copy the structure from `en.ts`
3. Translate all strings
4. Add the language to the language selector in the UI
5. Update the language detection logic if needed

## Common Patterns

### 1. Form Labels and Placeholders

```typescript
{
  form: {
    email: {
      label: 'Email Address',
      placeholder: 'Enter your email',
      error: 'Please enter a valid email'
    }
  }
}
```

### 2. Button Text

```typescript
{
  actions: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit'
  }
}
```

### 3. Error Messages

```typescript
{
  errors: {
    required: 'This field is required',
    invalid: 'Invalid input',
    network: 'Network error occurred'
  }
}
```

## Testing

When testing components that use translations:

1. Mock the `useI18n` hook
2. Provide test translations
3. Verify that the correct translation keys are used

Example:
```typescript
jest.mock('@/contexts/i18n-context', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}));
```

## Future Improvements

1. Add support for:
   - RTL languages
   - Date and number formatting
   - Currency formatting
   - Pluralization rules
2. Implement translation memory
3. Add automated translation key validation
4. Create a translation management system
5. Add support for nested translations 