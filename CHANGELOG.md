# Changelog

All notable changes to this project will be documented in this file.

## [0.10.0] - 2025-06-09

### Added
- **Enhanced Translation Coverage**: Complete localization support across all app features
  - Added missing translation keys for all UI elements, ensuring every text is properly localized
  - Extended translation support to parts selector components for better international accessibility
  - Added comprehensive translations for Czech, Russian, and Ukrainian languages
  - Implemented translation tooling to maintain consistent localization quality

### Changed
- **Improved Parts Recognition Experience**: Enhanced visual representation and naming of personal financial patterns
  - Custom financial parts now display appropriate images instead of generic placeholders
  - Identified parts show properly translated names in your chosen language
  - Streamlined parts display system for more consistent user experience across all features
  - Better integration between self-assessment results and other app features

- **Enhanced Assessment Flow**: More responsive and reliable self-discovery experience
  - Quiz results now appear immediately after completion without delays
  - "Repeat My Discovery" feature now properly clears previous results for fresh starts
  - Real-time updates when starting new assessments or clearing results
  - Improved assessment state management for smoother transitions between features

### Fixed
- **Resolved Display Issues**: Fixed visual inconsistencies affecting user experience
  - Fixed custom financial parts showing wrong images (now displays appropriate visuals)
  - Resolved parts showing technical IDs instead of user-friendly names
  - Fixed custom part buttons being incorrectly disabled in assessment results
  - Eliminated duplicate implementations that could cause inconsistent behavior

- **Enhanced Technical Stability**: Improved app reliability and performance
  - Cleaned up obsolete code that could cause unexpected behavior
  - Unified assessment system integration for more consistent data handling
  - Better cleanup processes when resetting or retaking assessments
  - Improved overall app stability and responsiveness


## [0.9.0] - 2025-06-01

### Added
- **Enhanced Privacy Transparency**: Updated privacy policy with clear analytics disclosure
  - Added dedicated section explaining what data is collected and how it's used
  - Improved transparency about tracking practices with user control information
  - Reinforced privacy-first approach to protect user data

### Changed
- **Improved App Performance**: Streamlined analytics tracking across all features
  - Faster and more reliable tracking in self-assessment, daily check-in, and parts journal
  - More consistent user experience when navigating between features
  - Better responsiveness when saving progress and completing activities

### Fixed
- **Enhanced App Stability**: Resolved technical issues affecting user experience
  - Improved reliability of progress tracking throughout the app
  - Fixed potential interruptions during daily check-ins and assessments
  - Enhanced overall app stability and smooth operation


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