# Design Guidelines

> **Purpose**: This document serves as a comprehensive guide for maintaining consistent design language across the SpendSentinel application. It captures the reasoning behind design decisions and provides context for AI/LLM when creating new features.

## Table of Contents
- [Page Header Standards](#page-header-standards)
- [Visual Hierarchy](#visual-hierarchy)
- [Button Design System](#button-design-system)
- [Component Structure Patterns](#component-structure-patterns)
- [Color System](#color-system)
- [Layout Principles](#layout-principles)
- [State-Driven Design](#state-driven-design)
- [UX Best Practices](#ux-best-practices)
- [Accessibility Guidelines](#accessibility-guidelines)

---

## Page Header Standards

> **Established Pattern**: All pages follow unified header structure for consistency and clear user orientation.

### Universal Page Header Pattern
```tsx
<div className="container mx-auto py-8 space-y-8 px-4">
  {/* Header */}
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('page.title')}</h1>
      <p className="text-muted-foreground">
        {t('page.subtitle')}
      </p>
    </div>
    {/* Optional: Additional header content like back buttons */}
  </div>
  
  {/* Page content sections */}
</div>
```

### Header Design Principles

#### Typography Hierarchy
- **Main Title**: `text-3xl font-bold mb-2`
  - Consistent large size for immediate page identification
  - Bottom margin of `mb-2` for proper spacing to subtitle
- **Subtitle**: `text-muted-foreground`
  - Explains page purpose and sets user expectations
  - Muted color to establish clear hierarchy

#### Layout Standards
- **Left-aligned**: All headers use left alignment (not centered)
- **No icons in main title**: Icons are reserved for card headers and section titles
- **Consistent spacing**: `space-y-6` between header elements and page content
- **Full-width layout**: No artificial width constraints (`max-w-*` removed)

#### Content Structure
- **Title**: Clear, descriptive page name matching navigation
- **Subtitle**: One-sentence explanation of page purpose and functionality
- **Context**: Additional elements (back buttons, breadcrumbs) placed below title/subtitle

### Header Implementation Examples

#### Feature Pages (Daily Check-in, Parts Journal, Self Assessment, Feedback)
```tsx
<div className="space-y-6">
  <div>
    <h1 className="text-3xl font-bold mb-2">{t('dailyCheckIn.title')}</h1>
    <p className="text-muted-foreground">{t('dailyCheckIn.subtitle')}</p>
  </div>
</div>
```

#### Legal/Informational Pages (Privacy Policy, Terms, Cookie Settings)
```tsx
<div className="space-y-6">
  <div>
    <h1 className="text-3xl font-bold mb-2">{t('privacyPolicy.title')}</h1>
    <p className="text-muted-foreground">
      {t('privacyPolicy.lastUpdated', { date: currentDate })}
    </p>
  </div>
</div>
```

#### Dashboard Pages (Expense Highlighter)
```tsx
<div className="space-y-6">
  <div>
    <h1 className="text-3xl font-bold mb-2">{t('expenseHighlighter.title')}</h1>
    <p className="text-muted-foreground">
      {t('expenseHighlighter.subtitle')}
    </p>
  </div>
</div>
```

### Migration Pattern
When updating existing pages:
1. **Remove centered layouts** (`text-center`, centered containers)
2. **Remove icons from main headers** (move to card headers if needed)
3. **Standardize title styling** (`text-3xl font-bold mb-2`)
4. **Apply muted foreground to subtitles** (`text-muted-foreground`)
5. **Ensure consistent spacing** (`space-y-6` for header container)
6. **Remove width constraints** (no `max-w-*` on main containers)

### Accessibility Considerations
- **Semantic HTML**: Always use `<h1>` for page titles
- **Clear hierarchy**: Title → subtitle → content maintains logical flow
- **Color contrast**: Muted foreground maintains accessibility standards
- **Screen readers**: Descriptive titles and subtitles provide context

---

## Visual Hierarchy

### Primary Actions
**Color**: Lavender (Primary/Default variant)
**Usage**: Main actions that users perform frequently
**Examples**: 
- "Add Transaction" button
- "Set My Budget" (when no budget exists)

**Reasoning**: Primary actions should draw immediate attention and guide users through their main workflow.

### Secondary Actions
**Color**: Sand/Neutral (Outline variant)
**Usage**: Supporting actions, configuration, or one-time setup
**Examples**:
- "Edit My Budget" (when budget exists)
- Navigation items
- Utility actions

**Reasoning**: Secondary actions should be visible but not compete with primary actions for attention.

### Information Display
**Usage**: Data presentation, explanations, descriptive content
**Style**: Muted colors, consistent typography hierarchy

---

## Button Design System

### Button Variants

#### Primary Button (`variant="default"`)
```tsx
<Button onClick={handleAction}>Primary Action</Button>
```
- **Color**: Lavender background
- **Use for**: Core functionality, main user actions
- **Examples**: Add Transaction, Set My Budget (initial), Save, Submit

#### Secondary Button (`variant="outline"`)
```tsx
<Button variant="outline" onClick={handleAction}>Secondary Action</Button>
```
- **Color**: Sand/neutral border with transparent background
- **Use for**: Supporting actions, modifications, navigation
- **Examples**: Edit Budget, Cancel, Settings

#### State-Driven Button Styling
```tsx
const buttonVariant = hasData ? "outline" : "default";
const buttonText = hasData ? "Edit Data" : "Set Data";
```
- **Dynamic styling** based on application state
- **Guides users** through setup → maintenance workflow
- **Provides contextual emphasis** when needed

### Button Placement Patterns

#### Card Footer Buttons
```tsx
<CardFooter>
  <Button>Primary Action</Button>
</CardFooter>
```
- **Consistent placement** at bottom of cards
- **Clear separation** from content
- **Follows shadcn/ui patterns**

---

## Component Structure Patterns

### Standard Card Layout
```tsx
<Card className="shadow-lg">
  <CardHeader>
    <div className="flex items-center space-x-3">
      <Icon className="w-8 h-8 text-primary" />
      <CardTitle className="text-2xl">Title</CardTitle>
    </div>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Key Elements**:
- **Icon + Title** in header for visual recognition
- **Descriptive subtitle** for context
- **Shadow elevation** for depth (`shadow-lg`)
- **Action buttons** in footer for consistency

### Content Section Patterns
```tsx
<div className="bg-primary/5 p-6 rounded-lg space-y-4">
  {/* Highlighted content */}
</div>
```
- **Light background tint** for emphasis
- **Consistent padding** (`p-6`)
- **Rounded corners** for modern appearance
- **Vertical spacing** (`space-y-4`)

### Card Structure Standards
```tsx
<Card className="shadow-lg">
  <CardContent className="p-6">
    {/* Main content */}
  </CardContent>
</Card>
```

**Unified Card Patterns**:
- **Shadow elevation**: All cards use `shadow-lg` for consistent depth
- **Content padding**: `CardContent` with appropriate padding
- **Proper nesting**: Always wrap content in `CardContent` for semantic structure
- **Consistent styling**: No custom shadows or borders beyond `shadow-lg`

#### Card Implementation Examples
```tsx
{/* Step content cards */}
<Card className="shadow-lg">
  <CardContent>
    <StepComponent />
  </CardContent>
</Card>

{/* Section cards with headers */}
<Card className="shadow-lg">
  <CardHeader>
    <div className="flex items-center space-x-3">
      <Icon className="w-8 h-8 text-primary" />
      <CardTitle className="text-2xl">Section Title</CardTitle>
    </div>
    <CardDescription>Section description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Section content */}
  </CardContent>
</Card>
```

---

## Color System

### Primary Colors
- **Primary**: Lavender (`hsl(var(--primary))`)
- **Primary Foreground**: High contrast text
- **Accent**: Supporting color for icons and highlights

### Semantic Colors
- **Success/Positive**: Green tones
  - Budget savings: `text-green-600`
  - Avoided expenses: `#16a34a`
- **Spending/Neutral**: Chart colors
  - Living expenses: `#e76e50`
  - Lifestyle: `#10b981`
- **Unassigned/Muted**: Gray tones
  - Unknown categories: `#9ca3af`

### Background Tints
- **Primary tint**: `bg-primary/5` (5% opacity)
- **Muted backgrounds**: `bg-muted/50`
- **Card backgrounds**: Default white/system

---

## Layout Principles

### Responsive Grid Patterns
```tsx
// Side-by-side on large screens, stacked on small
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
  
// Responsive card grids
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

### Container Structure
```tsx
<div className="container mx-auto py-8 space-y-8 px-4">
  {/* Page content with consistent spacing */}
</div>
```
- **Consistent spacing** between sections (`space-y-8`)
- **Full-width utilization** (no artificial max-width constraints)
- **Responsive padding** (`px-4`)
- **Professional spacing** with `py-8` for vertical page padding

#### Container Pattern Evolution
**Previous**: Pages used various max-width constraints (`max-w-4xl`, `max-w-3xl`, etc.)
**Current**: All pages use full-width containers for better space utilization
**Reasoning**: Better user experience on larger screens, consistent with modern web design

### Information Architecture
1. **Vision Board** - Motivational goals (top)
2. **Budget Planning** - Financial setup
3. **Financial Decisions** - Category explanations
4. **Overview Charts** - Data visualization
5. **Transaction List** - Detailed records

**Reasoning**: Flow from inspiration → planning → understanding → tracking

---

## State-Driven Design

### Progressive Disclosure
**Principle**: Show relevant information based on user progress

#### Budget Setup Flow
- **No Budget**: Primary "Set My Budget" button
- **Budget Exists**: Secondary "Edit My Budget" button
- **Display Values**: Show actual amounts when available

#### Content Visibility
```tsx
{hasData && <DataVisualization />}
{!hasData && <EmptyState />}
```

### Contextual Emphasis
**Principle**: Emphasize what users need to do next

#### First-Time Users
- **Prominent setup buttons**
- **Explanatory text**
- **Guided workflows**

#### Returning Users
- **Quick access to main functions**
- **Detailed data views**
- **Secondary setup options**

---

## UX Best Practices

### User Flow Priority
1. **Primary workflows** get primary styling
2. **Setup tasks** are emphasized until complete
3. **Maintenance tasks** become secondary after setup
4. **Navigation** remains consistently accessible

### Cognitive Load Management
- **Consistent patterns** across components
- **Familiar iconography** (Calculator, Plus, Receipt, etc.)
- **Logical grouping** of related functionality
- **Clear action outcomes**

### Feedback and States
- **Loading states** for async operations
- **Success feedback** for completed actions
- **Error handling** with clear messaging
- **Empty states** with guidance

---

## Accessibility Guidelines

### Color and Contrast
- **High contrast** text combinations
- **Semantic meaning** not dependent on color alone
- **Icon + text** combinations for clarity

### Interactive Elements
- **Sufficient touch targets** (minimum 44px)
- **Keyboard navigation** support
- **Screen reader** friendly labels
- **Focus indicators** for navigation

### Content Structure
- **Logical heading hierarchy** (h1 → h2 → h3)
- **Descriptive link text**
- **Alt text** for images
- **ARIA labels** where needed

---

## Implementation Notes

### shadcn/ui Integration
- **Leverage existing variants** rather than custom styles
- **Follow component patterns** from the design system
- **Maintain consistency** with built-in accessibility features

### Responsive Design
- **Mobile-first approach** for layout decisions
- **Breakpoint consistency** across components
- **Touch-friendly** interaction areas

### Performance Considerations
- **Conditional rendering** for large data sets
- **Optimized images** with Next.js Image component
- **Lazy loading** for non-critical components

---

## Future Considerations

### Design Evolution
- **Monitor user behavior** to validate design decisions
- **A/B test** critical user flows
- **Iterate based on feedback**

### Consistency Checks
- **Regular design reviews** for new features
- **Component library updates**
- **Documentation maintenance**

### Design Consistency Methodology

#### Systematic Unification Process
When establishing or updating design patterns:

1. **Pattern Identification**
   - Examine all existing implementations
   - Identify inconsistencies and variations
   - Document current state and desired end state

2. **Reference Selection**
   - Choose the most appropriate existing implementation as reference
   - Consider user experience, technical implementation, and design quality
   - Validate choice against overall design system

3. **Systematic Application**
   - Update all relevant components to match chosen pattern
   - Ensure consistent implementation across all instances
   - Remove outdated or inconsistent variations

4. **Documentation Update**
   - Capture established patterns in design guidelines
   - Include implementation examples and reasoning
   - Provide migration guidance for future updates

#### Example: Header Unification
**Process Applied**: All page headers were unified to follow the expense-highlighter page pattern
**Result**: Consistent `text-3xl font-bold mb-2` titles, `text-muted-foreground` subtitles, left-aligned layout
**Benefit**: Clear user orientation, predictable navigation experience

### AI/LLM Context
When creating new features, prioritize:
1. **Consistency** with existing patterns (follow established header, container, and card patterns)
2. **User flow logic** over visual novelty  
3. **Accessibility** as a requirement, not afterthought
4. **State-driven design** for dynamic experiences
5. **Systematic implementation** following the unification methodology above

#### New Page Creation Checklist
- [ ] Use universal page header pattern (`text-3xl font-bold mb-2` + `text-muted-foreground`)
- [ ] Implement standard container structure (`container mx-auto py-8 space-y-8 px-4`)
- [ ] Apply consistent card styling (`shadow-lg` with proper `CardContent` nesting)
- [ ] Ensure full-width layout (no arbitrary max-width constraints)
- [ ] Follow left-aligned, semantic HTML structure
- [ ] Test responsive behavior and accessibility

---

*Last updated: [Current Date]*
*Version: 2.0 - Added Page Header Standards and Design Consistency Methodology* 