# Changelog

All notable changes to this project will be documented in this file.

## [0.12.0] - 2025-06-17

### Added
- 

### Changed
- 

### Fixed
- 


## [0.11.0] - 2025-06-09

### Added
- **Journey Navigation**: New seamless way to continue your personal growth journey
  - Added "Continue Your Journey" section that appears after completing daily check-ins and self-assessments
  - Introduced integrated budget planning dialog accessible directly from your progress celebrations
  - Added vision board feature to help you visualize and plan your financial goals
  - New guided navigation between different app features for a more connected experience

### Changed
- **Simplified Navigation**: Renamed "My Daily Check-in" to "My Journey" in the sidebar for clearer purpose
  - Updated navigation across all supported languages (English, Czech, Russian, Ukrainian)
  - More intuitive way to access your personal development tools

- **Enhanced Celebration Experience**: Improved how you celebrate completing daily activities
  - Replaced temporary notification popups with dedicated celebration sections on the page
  - Better visual feedback when you complete daily check-ins
  - Clearer next steps presented after finishing activities
  - Consistent celebration experience across all app features

- **Streamlined User Flow**: More cohesive experience between different app features
  - Smoother transitions from self-assessment to daily activities
  - Better integration between financial planning and personal development tools
  - Consistent interface design across all major features

### Fixed
- **Improved Reliability**: Fixed timing issues that could interrupt your progress
  - Eliminated random interruptions during daily check-in completion
  - More stable celebration and progress tracking
  - Better handling of feature transitions and data saving

- **Enhanced Interface Consistency**: Resolved visual inconsistencies across the app
  - Fixed budget dialog appearing differently in various contexts
  - Cleaned up duplicate or conflicting interface elements
  - More consistent visual experience throughout your journey


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