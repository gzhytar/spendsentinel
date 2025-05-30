# Changelog

All notable changes to this project will be documented in this file.

## [0.8.0] - 2025-05-30

### Added
- **Localization Support**: Comprehensive translation system for budget planning components
  - Added translation keys for budget planner and budget management dialogs in 4 languages (English, Czech, Russian, Ukrainian)
  - Localized budget category descriptions, form labels, and validation messages
  - Implemented variable interpolation for dynamic amounts and percentages in translations
  - Maintained trauma-informed and supportive messaging across all languages

- **Budget Progress Indicators**: Trauma-informed budget and saving progress tracking
  - Added visual progress bars with color-coded status indicators for budget consumption
  - Implemented saving target progress tracking with encouraging milestone messages
  - Created comprehensive guidelines for supportive financial messaging

- **Design System Foundation**: Established design guidelines as primary reference
  - Added design-guidelines.md with Core Visual Identity and Design System Foundation
  - Created AI/LLM Design Decision Framework with 5-step process for consistent design decisions
  - Documented color systems, typography, and component patterns

### Changed
- **UI Consistency Improvements**: Aligned budget components with established design patterns
  - Updated BudgetDialog to use Card structure matching AddExpenseForm visual patterns
  - Applied consistent color schemes and semantic styling across budget components
  - Improved CategoryExplanations icons to use semantic colors

### Fixed
- **Accessibility Improvements**: Resolved dialog accessibility issues
  - Fixed DialogTitle accessibility errors in budget dialog and expense form dialogs
  - Improved screen reader compatibility for budget management components
  - Enhanced keyboard navigation support in localized forms