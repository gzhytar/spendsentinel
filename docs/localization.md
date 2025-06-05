# Localization and Internationalization Guide

## Overview

This project implements a comprehensive localization (l10n) and internationalization (i18n) system using React and TypeScript. The system supports multiple languages (currently English, Czech, Russian, and Ukrainian) and provides a type-safe way to manage translations.

## Architecture

### 1. Translation Files

Translations are stored in the `src/lib/i18n/translations` directory, with separate files for each language:
- `en.ts` - English translations
- `cs.ts` - Czech translations
- `ru.ts` - Russian translations
- `uk.ts` - Ukrainian translations

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

1. Add new translation keys to all language files (`en.ts`, `cs.ts`, `ru.ts`, `uk.ts`)
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

## Translation Freezing System

### Overview

The project implements a translation freezing system to protect human-reviewed and approved translations from being modified by AI agents during development. This ensures that carefully crafted content (legal copy, branding, clinical terminology) remains unchanged while allowing flexibility for ongoing improvements to other translations.

### Comment-Based Freezing (Primary Method)

This approach uses special comments directly in translation files to mark frozen strings. It's the simplest method that requires no additional infrastructure while providing clear visual indicators for both humans and AI agents.

#### For AI/LLM Agents: Translation Freeze Detection Rules

**CRITICAL: Before modifying any translation string, AI agents MUST check for freeze markers.**

#### Freeze Marker Syntax

Frozen translations are marked with special comments using the `@freeze` directive:

```typescript
export const en = {
  common: {
    // @freeze - Human reviewed and approved
    appName: 'SpendSentinel',
    
    // @freeze - Final branding decision
    loading: 'Loading...',
    
    error: 'An error occurred', // Not frozen - can be improved
    
    // @freeze - Standard UI actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
  },
  navigation: {
    // @freeze - Core navigation approved by UX team
    home: 'Home',
    overview: 'Overview',
    selfAssessment: 'My parts',
    
    partsJournal: 'Parts Journal', // Not frozen - under review
    myFinancialDecisions: 'My Financial Decisions',
    
    // @freeze - Hyphenated format approved
    dailyCheckIn: 'Daily Check-in',
  },
} as const;
```

#### AI Agent Detection Algorithm

AI agents MUST implement this detection logic:

1. **Check the line immediately before** the translation string
2. **Check the same line after** the translation string (inline comments)
3. **Look for group freeze markers** that cover multiple translations

#### Freeze Marker Patterns

AI agents must recognize these patterns:

```typescript
// Pattern 1: Line-before freeze marker
// @freeze - [optional reason]
key: 'Frozen Translation',

// Pattern 2: Inline freeze marker  
key: 'Frozen Translation', // @freeze - [optional reason]

// Pattern 3: Group freeze marker (covers multiple keys until next marker)
// @freeze-group - Navigation approved by UX team
home: 'Home',
overview: 'Overview', 
selfAssessment: 'My parts',
// @freeze-group-end

// Pattern 4: Section freeze marker with reason
// @freeze - Legal and marketing approved - evidence-based claims verified
title: 'Break Free from Emotional Spending Patterns with Science-Based Self-Compassion',
subtitle: 'Stop fighting your financial habits...',
```

#### Required Freeze Marker Formats

AI agents must recognize these exact patterns (case-insensitive):

- `// @freeze`
- `// @freeze -`
- `// @freeze - [any text]`
- `// @freeze-group`
- `// @freeze-group -`
- `// @freeze-group - [any text]`
- `// @freeze-group-end`

#### AI Agent Modification Rules

**ABSOLUTE REQUIREMENTS:**

1. **NEVER modify any translation string that has a freeze marker**
2. **NEVER remove or modify freeze markers**
3. **NEVER add content between a freeze marker and its protected translation**
4. **ALWAYS preserve the exact format and spacing of freeze markers**

#### Implementation Example for AI Agents

```typescript
// Pseudo-code for AI agent freeze detection
function canModifyTranslation(filePath: string, lineNumber: number): boolean {
  const lines = readFile(filePath);
  const currentLine = lines[lineNumber];
  const previousLine = lines[lineNumber - 1] || '';
  
  // Check for freeze markers
  if (previousLine.includes('@freeze') || currentLine.includes('@freeze')) {
    return false;
  }
  
  // Check for group freeze markers
  let isInFrozenGroup = false;
  for (let i = lineNumber - 1; i >= 0; i--) {
    if (lines[i].includes('@freeze-group-end')) {
      break;
    }
    if (lines[i].includes('@freeze-group')) {
      isInFrozenGroup = true;
      break;
    }
  }
  
  return !isInFrozenGroup;
}
```

#### Special Cases for AI Agents

1. **Nested Objects**: If a parent object is frozen, ALL child properties are frozen:
   ```typescript
   // @freeze - Entire hero section approved
   hero: {
     title: 'Protected Title',      // FROZEN (parent frozen)
     subtitle: 'Protected Subtitle', // FROZEN (parent frozen)
   },
   ```

2. **Array Translations**: Individual array items can be frozen:
   ```typescript
   items: [
     'Modifiable item',
     'Another modifiable item',
     // @freeze - Legal requirement
     'Protected legal text',
   ],
   ```

3. **Multi-line Translations**: Freeze marker protects the entire string:
   ```typescript
   // @freeze - Multi-line legal text approved
   description: `This is a long description
   that spans multiple lines
   and is completely protected`,
   ```

#### Error Handling for AI Agents

When AI agents encounter frozen translations:

1. **Log the detection**: Record which keys were skipped due to freeze markers
2. **Suggest alternatives**: If possible, suggest nearby non-frozen keys that could be improved
3. **Report conflicts**: If a modification request conflicts with frozen content, report it clearly

Example logging:
```
[AI AGENT] Skipped modification of 'common.appName' - found freeze marker: '@freeze - Final branding decision'
[AI AGENT] Alternative suggestion: Consider improving 'common.error' which is not frozen
```

#### Validation Rules for AI Agents

Before completing any translation work, AI agents should:

1. **Verify no freeze markers were removed**
2. **Confirm no frozen translations were modified**
3. **Check that new translations don't conflict with frozen content**
4. **Ensure freeze marker format remains consistent**

#### Common Freeze Reasons (for AI Agent Context)

AI agents should understand these common freeze reasons to respect the intent:

- `UX approved` - User experience decisions
- `IFS terminology` - Internal Family Systems therapy terms

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