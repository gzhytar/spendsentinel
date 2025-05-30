# **App Name**: SpendSentinel

## Tagline: "Pause · Notice · Choose."

## App purpose: Transform Your Relationship with Money Through Compassionate Self-Discovery. Understand the different parts of yourself that influence your financial decisions and learn to work with them, not against them

## App vision: an interactive, AI-powered Financial Therapist and Coach that behaves like a personal financial-behavior specialist, mindfulness mentor, and trauma-informed coach. With the goal of supporting and guiding users on how to achieve both financial health and emotional well-being. 

## Style Guidelines:

> **🎨 Primary Design Reference**: For comprehensive visual design decisions, component patterns, and UX guidelines, refer to [`docs/design-guidelines.md`](./design-guidelines.md). This document serves as the authoritative source for maintaining design consistency across all features and should be consulted by AI/LLM when making any visual or interaction design decisions.

### Core Visual Identity
- Primary color: A calming lavender #B5B7E8, selected to instill a sense of peace and balance, drawing inspiration from mindfulness practices. Its versatility makes it adaptable to various UI components without overwhelming the user.
- Background color: Soft sand #EADDCB (warmth), providing a soft, neutral backdrop that ensures readability and reduces eye strain, in keeping with a light color scheme.
- Accent color: Deep teal #0F5850 (vigilant presence), ideal for highlighting interactive elements and CTAs. The brightness and saturation is offset from the primary.
- Clean and easily legible font to ensure the content is easily readable. Radix-UI font choices will be used as a base.
- App icon: minimal eye-within-circle (watchful Self) whose negative space hints at a heart—protection and compassion.

### Design System Foundation
- **Component Structure**: Follow shadcn/ui patterns with consistent Card → CardHeader → CardContent → CardFooter structure
- **Button Hierarchy**: State-driven design with primary (lavender) for main actions, secondary (outline) for supporting actions
- **Layout Principles**: Responsive grid layouts, consistent spacing (`space-y-8`), and mobile-first approach
- **Visual Hierarchy**: Contextual emphasis based on user progress and application state
- Simple and intuitive layouts with ample spacing to reduce clutter and promote a sense of calm. Radix-UI layouts will be used as a base.
- Subtle animations that provide gentle feedback and guide the user through the app. Radix-UI animations will be used as a base.

### AI/LLM Design Decision Framework
When implementing new features or modifying existing ones:
1. **Always consult** [`docs/design-guidelines.md`](./design-guidelines.md) for visual and interaction patterns
2. **Prioritize consistency** with established component structures and color usage
3. **Apply state-driven design** principles for dynamic user experiences
4. **Follow accessibility guidelines** as outlined in the design guide
5. **Maintain responsive design** patterns for all screen sizes

## Tone guidelines:
Use "invite" not "warn", "notice" not "fail", "parts" language sparingly outside psycho-education screens. Example: "A part noticed extra coffee runs ( +€24 this week ). Breathe, then decide."	

## Feature Specifications

### Feature: Quick Firefighter Assessment

#### Purpose and Impact
- **User Need**: Users need a simple and fast way to get an initial idea of their dominant financial firefighter type.
- **Expected Outcome**: User gains awareness of their primary firefighter type and a brief explanation, encouraging further exploration and self-compassion.
- **Emotional Impact**: Should make the user feel curious, understood, and gently guided, not judged or pigeonholed.

#### Functional Requirements
- **Core Functionality**: Presents a series of (currently 4) multiple-choice questions. Based on answers, identifies one of the predefined firefighter types (Spender, Hoarder, Avoider, Indulger). Displays the result with a description and interpretation guide.
- **User Interactions**: User selects one option per question, navigates (next/previous/start/cancel), submits to see results. Can choose an "I'm not sure / None of these match me" option for questions. Can repeat the quiz.
- **Data Requirements**: Predefined set of questions, options for each question, mapping of answer combinations to firefighter types, descriptions for each firefighter type, result interpretation guide, and text for uncertainty notices.

#### UI/UX Specifications
- **Component Placement**: Prominently on the "Self-Assessment" page (`src/app/[lang]/self-assessment/page.tsx`).
- **Visual Elements**:
    - Introduction screen with title, description, and "Start Assessment" button.
    - Quiz screen with progress indicator (e.g., "Question X of Y"), question text, multiple-choice options (e.g., radio buttons or styled button group), navigation buttons ("Previous", "Next", "Cancel").
    - Results screen displaying: "Your primary firefighter type is: [Type Name]", a description of the type, an interpretation guide, and a "Repeat Quiz" button.
    - An "Uncertainty Notice" if the user selects unsure options, suggesting the Deep Assessment.
- **Interactive Behavior**: Smooth transitions between questions. Clear indication of selected option. Feedback upon completion. Visual progress tracking.
- **States**:
    - Initial/Welcome state.
    - Quiz In-Progress state (one for each question).
    - Results Displayed state.
    - Uncertainty Notice state.

#### Technical Implementation Guidelines
- **Suggested Approach**: Client-side logic for quiz flow, state management (e.g., using React `useState` or `useReducer`), and result calculation based on a predefined algorithm/mapping of answers to types. Content (questions, options, results text) managed via `i18n` translation files.
- **Integration Points**: Links/references to the detailed "Firefighter Types" component/section for users to learn more about their identified type.
- **Performance Considerations**: Should be lightweight and fast, primarily client-side operations during the quiz.

#### Examples
- **Sample Content (from `en.ts`):**
    - Quiz Title: "Quick Firefighter Assessment"
    - Instruction: "Answer 4 quick questions to discover which financial 'firefighter' part is most active in your life."
    - Question: "When you feel stressed about money, what's your first instinct?"
    - Option: "Browse online stores or go shopping"
    - Result Text: "Your primary firefighter type is: The Spender"
    - Result Description: "This doesn't define you completely—we all have multiple parts. Understanding your dominant pattern is the first step toward financial self-compassion."

---

### Feature: Deep Assessment (Personalized Financial Part Identification)

#### Purpose and Impact
- **User Need**: Users who are unsure about their type from the quick quiz, or who want a more nuanced and personalized understanding of their financial parts, need a way to explore this with more context.
- **Expected Outcome**: User submits descriptions of their financial situation and behavior, and receives an AI-generated identification of a financial "part" active in their described situation. This includes its role, burden, concern, and a suggested engagement strategy based on IFS principles. This should foster deeper self-understanding and introduce IFS concepts in a practical way.
- **Emotional Impact**: Should make the user feel heard, validated, and empowered with actionable, compassionate insights. The interaction with AI should feel supportive and non-judgmental.

#### Functional Requirements
- **Core Functionality**: Allows users to describe their current financial situation and recent financial behavior/decisions in free-text input fields. Submits this information to an AI model (referred to as "IFS Dialogue" in general app vision). The AI analyzes the input and identifies a relevant financial "part" (potentially a firefighter type or a more nuanced aspect), providing an analysis that may include its role, burden, concern, and suggested ways to engage with this part.
- **User Interactions**: User types into two main text areas ("Describe your current financial situation", "Describe your recent financial behavior"). Clicks an "Identify My Financial Parts" button. Views the AI-generated results. Options to "Start New Assessment" or "Explore This Part Deeper" (which could be a premium feature).
- **Data Requirements**: User's textual input for the two prompts. An AI model trained or prompted for IFS-based analysis of financial narratives. Content for result presentation (titles, labels for role, burden, concern, etc.) from `i18n`.

#### UI/UX Specifications
- **Component Placement**: On the "Self-Assessment" page, possibly presented as an alternative or follow-up to the Quick Firefighter Assessment.
- **Visual Elements**:
    - Section title like "Deep Assessment" or "Personalized Financial Part Identification".
    - Two text input areas with clear labels and placeholders (e.g., "Share what's happening with your finances right now...", "Tell us about your spending, saving, or money-related decisions...").
    - An "Identify My Financial Parts" button.
    - A loading/processing indicator while the AI is working.
    - A results display area showing: "Meet Your {partName}", and sections for "Role", "What it carries (Burden)", "Its biggest worry (Concern)", and "How to work with this part (Suggested Engagement)".
    - Buttons like "Start New Assessment" and "Explore This Part Deeper".
    - A tooltip for the "Explore This Part Deeper" button if it's a premium feature.
- **Interactive Behavior**: Text areas should be resizable or accommodate sufficient text. Clear loading state during AI processing. Results should be presented in an easily digestible format.
- **States**:
    - Initial input form state.
    - Loading/Processing state (after submission, before AI response).
    - Results Displayed state.
    - Error state (e.g., if AI service fails or input is insufficient).

#### Technical Implementation Guidelines
- **Suggested Approach**: Frontend form (React components) captures user input. An API call is made to a backend service that interfaces with the AI model (IFS Dialogue capability). The backend processes the request, gets the AI analysis, and returns it to the frontend.
- **Integration Points**: Secure API endpoint for the AI-driven IFS Dialogue service. User authentication might be needed if results are to be saved or tied to a user account, especially for premium "Explore Deeper" features. Error handling for API calls.
- **Performance Considerations**: Manage user expectations for AI processing time with clear loading indicators and potentially asynchronous feedback if processing is lengthy.

#### Examples
- **Sample Content (from `en.ts` and `blueprint.md`):**
    - Form Title: "Personalized Financial Part Identification"
    - Placeholder 1: "Share what's happening with your finances right now - debts, income, expenses, goals, challenges..."
    - Placeholder 2: "Tell us about your spending, saving, or money-related decisions in the past few weeks or months..."
    - Identify Button: "Identify My Financial Parts"
    - Result Title Example: "Meet Your Protector Part" (or specific firefighter like "The Spender")
    - Result Fields: Role, Burden, Concern, Suggested Engagement (with descriptions).

---

### Feature: Self-Compassion Practice

#### Purpose and Impact
- **User Need**: Users need a dedicated space to practice self-compassion and track their emotional well-being over time, especially during challenging financial periods
- **Expected Outcome**: Users develop consistent self-compassion habits, gain awareness of their emotional patterns, and build resilience through regular practice and visual progress tracking
- **Emotional Impact**: Should create a nurturing, supportive environment that encourages self-kindness and emotional awareness without judgment

#### Functional Requirements
- **Core Functionality**: Daily self-compassion scoring system with timeline visualization, inspirational prompts for reflection, and 30-day historical tracking with emoji-based mood indicators
- **User Interactions**: 
  - Rate daily self-compassion level on 1-10 scale with contextual prompts
  - View 30-day timeline with visual mood indicators (sad/neutral/happy faces)
  - Access rotating collection of self-compassion prompts for reflection
  - Track progress through calendar-style interface with completion statistics
- **Data Requirements**: 
  - Daily self-compassion scores stored in localStorage with date stamps
  - Collection of inspirational self-compassion prompts in multiple languages
  - 30-day historical data with score-to-emoji mapping (1-3: sad, 4-7: neutral, 8-10: happy)

#### UI/UX Specifications
- **Component Placement**: 
  - Dedicated page at `/[lang]/self-compassion` accessible via side navigation
  - SelfCompassionScore component for daily scoring with prompts
  - CompassionTimeline component displaying 30-day calendar view
- **Visual Elements**:
  - **Scoring Interface**: Slider input (1-10) with contextual prompts and save button
  - **Timeline Display**: 
    - 30-day calendar grid with day numbers and emoji indicators
    - Color-coded backgrounds: red (1-3), yellow (4-7), green (8-10), gray (no data)
    - Emoji icons: Frown (sad), Meh (neutral), Smile (happy), empty circle (no data)
    - Month labels and today highlighting with ring indicator
  - **Statistics**: Average score calculation and total entries count
  - **Legend**: Clear explanation of emoji meanings and score ranges
- **Interactive Behavior**: 
  - Real-time timeline updates when new scores are saved
  - Hover tooltips showing exact scores on timeline days
  - Smooth transitions and responsive design
  - Storage event listening for cross-component updates
- **States**:
  - Empty state (no scores recorded yet)
  - Populated timeline with historical data
  - Today highlighting and current streak tracking

#### Technical Implementation Guidelines
- **Suggested Approach**: 
  - React components with localStorage persistence for offline functionality
  - CompassionTimeline component similar to CheckinTimeline but with score-based emoji mapping
  - Event-driven updates using storage events for real-time synchronization
  - Internationalization support for all text content and prompts
- **Integration Points**: 
  - Shared localStorage system with other app features
  - I18n translation system for multi-language support
  - Consistent styling with app's design system (Radix UI components)
  - Integration with existing SelfCompassionScore component
- **Performance Considerations**: 
  - Efficient localStorage operations with error handling
  - Optimized re-rendering using React hooks and event listeners
  - Lazy loading of historical data calculation

#### Examples
- **Sample Content (from translation files)**:
  - **Prompts**: "Today, I will treat myself with the same kindness I would offer a good friend."
  - **Timeline Labels**: "High compassion (8-10)", "Medium compassion (4-7)", "Low compassion (1-3)", "No data"
  - **Statistics**: "Average score: 7.2", "Total entries: 15 / 30"
  - **Score Interface**: "How self-compassionate do you feel right now? (1-10)" with "Reflect & Save Score" button

---

### Feature: Daily Check-in

#### Purpose and Impact
- **User Need**: Users need a structured daily practice to reflect on their financial behaviors, identify triggered parts, and build awareness of the connection between emotions and spending patterns
- **Expected Outcome**: Users develop consistent self-reflection habits, gain insight into which parts influence their financial decisions, and track their progress over time through visual feedback and streak tracking
- **Emotional Impact**: Should create a safe, non-judgmental space for reflection that feels supportive and encouraging, making users feel understood and empowered to explore their relationship with money

#### Functional Requirements
- **Core Functionality**: Guided 6-step daily check-in process that includes grounding breath exercise, mindful day reflection, expense logging with part identification and journaling, visual progress tracking with streak calculation, relationship building prompts (coming soon), and self-compassion scoring
- **User Interactions**: 
  - Navigate through 6 sequential steps with next/previous controls and progress indicator
  - Complete guided breathing exercise with detailed IFS-informed instructions
  - Reflect on daily events, emotions, and financial decisions (contemplative, no input required)
  - Log expenses using integrated AddExpenseForm with part selection and journal notes for each triggered part
  - View 30-day calendar-style timeline with completion indicators, streak tracking, and statistics
  - Access persistent panic button throughout the process with prominent reminder alert
  - Rate daily self-compassion score (1-10) with integration to calm history tracking
- **Data Requirements**: 
  - User's identified parts from self-assessment results (via `useIdentifiedParts()` hook)
  - Daily check-in completion status stored in localStorage and future database
  - Expense entries with associated triggered parts and journal notes (shared with Expense Highlighter)
  - Self-compassion scores integrated with existing calm history system
  - 30-day completion history with streak calculation

#### UI/UX Specifications
- **Component Placement**: 
  - Dedicated page at `/[lang]/daily-checkin` accessible via side navigation menu
  - Progress indicator showing current step (1-6) with percentage completion
  - Prominent panic button reminder alert at top of page with red styling
  - Persistent PanicButton component available throughout
- **Visual Elements**:
  - **Step 1 (Breathing)**: Detailed IFS-informed breathing instructions in highlighted card with calming background styling
  - **Step 2 (Reflection)**: Contemplative prompts with inspirational quote from Ram Dass and calming reflection image
  - **Step 3 (Expense Logging)**: 
    - Integrated AddExpenseForm with triggered parts functionality
    - Part selection based on user's assessment results only (no default parts)
    - ExpenseList showing today's expenses with journal notes display
    - Helpful message with link to Self-Assessment if no parts identified
  - **Step 4 (Timeline)**: 
    - CheckinTimeline component with 30-day calendar grid view
    - Visual indicators (CheckCircle2/Circle icons) for completed/missed days
    - Current streak counter and total completion statistics
    - Month labels and today highlighting
  - **Step 5 (Deepen Relationships)**: Placeholder button with "Coming Soon" badge (disabled state)
  - **Step 6 (Self-Compassion)**: SelfCompassionScore component with compact styling and calm history integration
- **Interactive Behavior**: 
  - Smooth step transitions with scroll-to-top navigation
  - Auto-save progress to localStorage with session persistence
  - Expense data shared with Expense Highlighter feature
  - Completion triggers localStorage update and success message
  - Reset to step 1 after completion for new check-in
- **States**:
  - In-progress (current step highlighted with progress bar)
  - Session persistence (can resume from saved progress)
  - Completed for today (marked in timeline)
  - Historical view (30-day timeline with streak tracking)

#### Technical Implementation Guidelines
- **Suggested Approach**: 
  - React component (`src/app/[lang]/daily-checkin/page.tsx`) with step-based navigation using `useState`
  - Integration with existing components: AddExpenseForm, ExpenseList, SelfCompassionScore, CheckinTimeline
  - localStorage for session persistence (`dailyCheckInProgress`) and completion tracking (`completedCheckIns`)
  - Shared expense storage with Expense Highlighter via `expenseStorage` utility
- **Integration Points**: 
  - `useIdentifiedParts()` hook from `assessment-utils.ts` for available parts list
  - Shared expense storage system for consistency across features
  - Self-compassion scoring integrated with existing calm history system
  - PanicButton component (shared across app)
  - Internationalization via `useI18n()` hook with comprehensive translation support
- **Performance Considerations**: 
  - Lazy loading of timeline data (30-day calculation on mount)
  - Efficient localStorage operations with error handling
  - Optimistic UI updates for smooth user experience
  - Scroll management for step transitions

#### Examples
- **Sample Content (from translation files)**:
  - **Step 1**: "Sit or stand tall with relaxed shoulders and grounded feet, inviting any tense or busy part of you to simply watch. Place one hand on your heart, one on your belly, and quietly set an intention like 'May this breath give all my parts ease.' Breathe in through your nose to fill your chest, then sigh the air out an open mouth without pausing, keeping a connected 5-second in / 5-second out flow for about six waves while letting tension ride out on each exhale."
  - **Step 2**: "Take a moment to recall your day. What events stood out? What emotions did you experience? What financial decisions did you make? This silent practice helps build mindfulness and self-awareness over time."
  - **Panic Button Reminder**: "Remember, the panic button is always here for you - no judgment, just support when you need it."
  - **Step 4**: "Your check-in journey over the last 30 days" with streak tracking and completion statistics
  - **Step 6**: "Rate your self-compassion today (1 = very critical, 10 = very compassionate)"
  - **No Parts Message**: "No financial parts identified yet. Complete the [Self-Assessment] to identify your financial parts and track which ones are triggered by your expenses."

---

### Feature: Expense Highlighter (Financial Decisions Tracker)

#### Purpose and Impact
- **User Need**: Users need a comprehensive tool to track both spending and saving decisions, understand their financial patterns, and see visual insights into their financial behavior across different categories with efficient use of screen space.
- **Expected Outcome**: Users gain awareness of their financial patterns through detailed tracking, visual analytics, and categorized insights that help them understand both their spending habits and saving achievements. The responsive layout maximizes screen real estate while maintaining mobile accessibility.
- **Emotional Impact**: Should make users feel empowered and informed about their financial decisions, celebrating both spending awareness and saving achievements without judgment. The clean, organized layout promotes confidence in financial tracking.

#### Functional Requirements
- **Core Functionality**: 
  - Dual-purpose transaction logging for both expenses and savings with radio button selection
  - Comprehensive categorization system with spending categories (Living, Lifestyle) and saving categories (Emergency/Money Spared, Goals from Vision Board, Other Savings)
  - Responsive visual analytics with side-by-side pie chart overviews for spending and savings on larger screens
  - Clean pie chart display with percentages shown only in legend descriptions without tooltips or slice labels
  - Complete transaction history with type distinction and category-specific icons
  - Vision board integration for goal visualization and financial aspiration tracking
  - Category education sections with descriptions and visual icons for both spending and saving types
- **User Interactions**: 
  - Add transactions using "Add Spend or Saving" dialog with radio button type selection
  - Dynamic button text that changes based on selected type (Add Spend/Add Saving)
  - View side-by-side overview widgets for spending patterns and saving achievements on desktop
  - Browse complete Financial Decisions History with type and category filtering
  - Access educational content about spending and saving categories with descriptions
  - Manage vision board items with text affirmations and image goals
- **Data Requirements**: 
  - Transaction entries with type (expense/saving), amount, description, date, category, and optional triggered parts
  - Category definitions and descriptions for both spending and saving types
  - Visual chart data with category-specific colors and percentage calculations for legend display
  - Vision board items with text/image content and descriptions
  - Historical transaction data with sorting and filtering capabilities

#### UI/UX Specifications
- **Component Placement**: 
  - Dedicated page at `/[lang]/expense-highlighter` accessible via side navigation
  - Vision board section at top for goal visualization
  - Category education card with spending and saving explanations
  - Responsive grid layout for overview cards (side-by-side on lg+ screens, stacked on mobile)
  - AddExpenseForm dialog component with radio button type selection
  - ExpenseList component showing comprehensive transaction history
- **Visual Elements**:
  - **Vision Board Section**: 
    - Grid layout for text affirmations and image goals
    - Add/remove functionality with dialog interface
    - Responsive card display with hover effects
  - **Transaction Entry Dialog**: 
    - Radio button selection for "Expense" vs "Saving" type
    - Dynamic dialog title "Add Spend or Saving"
    - Category dropdowns that change based on selected type
    - Dynamic submit button text (Add Spend/Add Saving)
  - **Responsive Overview Layout**: 
    - Grid container with `grid-cols-1 lg:grid-cols-2 gap-6` for responsive side-by-side display
    - "Spend Overview" and "Total Savings" cards positioned side-by-side on large screens (≥1024px)
    - Stacked vertically on mobile and tablet devices for optimal readability
    - Conditional rendering based on data availability (only show relevant cards)
  - **Enhanced Pie Charts**: 
    - Clean pie slices without percentage labels or tooltips
    - Percentages displayed exclusively in legend with format "Category Name (XX%)"
    - Custom legend formatter with percentage calculations
    - Category-specific color coding: Living (red), Lifestyle (green), Emergency (green), Goals (blue), Investment (purple)
    - Responsive chart sizing with 300px height containers
  - **Financial Decisions History**: 
    - Comprehensive table/card view with Type, Description, Amount, Date, Category columns
    - Category-specific icons (Home, ShoppingBag for spending; Shield, Target, TrendingUp for saving)
    - Type distinction showing "Spend" vs "Saving" for each transaction
    - Mobile-responsive card layout and desktop table view
    - Empty state with "no transactions" message
  - **Category Education**: 
    - Spending categories section with Living and Lifestyle descriptions
    - Saving categories section with Emergency, Goals, and Investment descriptions
    - Visual icons and explanatory text for each category type
- **Interactive Behavior**: 
  - Real-time chart updates when new transactions are added
  - Smooth responsive transitions between desktop side-by-side and mobile stacked layouts
  - Clean chart interactions without hover tooltips or slice highlighting
  - Responsive design with mobile-optimized card layouts
  - Sort transactions by date (newest first) automatically
  - Vision board item management with add/remove functionality
- **States**:
  - Empty state (no transactions recorded)
  - Spending-only view (only expense transactions, only Spend Overview card shown)
  - Saving-only view (only saving transactions, only Total Savings card shown)
  - Mixed view (both expense and saving transactions, both cards shown side-by-side on desktop)
  - Responsive layout states (side-by-side vs stacked based on screen size)
  - Loading states for chart calculations

#### Technical Implementation Guidelines
- **Suggested Approach**: 
  - React components with localStorage persistence for offline functionality
  - Responsive grid layout using Tailwind CSS classes (`grid-cols-1 lg:grid-cols-2`)
  - Enhanced pie chart implementation with custom legend formatters and disabled tooltips
  - AddExpenseForm with radio button type selection using RadioGroup component
  - Separate chart calculations for spending and saving analytics with percentage computation
  - ExpenseList component enhanced with type distinction and category-specific styling
  - Shared expense storage system with Daily Check-in feature
- **Integration Points**: 
  - Shared localStorage system (`expenseStorage` utility) with Daily Check-in feature
  - I18n translation system for all category names, descriptions, and UI text
  - Consistent styling with app's design system (Radix UI components)
  - Recharts library for pie chart visualizations with custom formatters and responsive containers
  - Vision board localStorage integration for goal tracking
- **Performance Considerations**: 
  - Efficient localStorage operations with error handling
  - Optimized chart rendering with conditional display logic and responsive containers
  - Responsive design considerations for mobile and desktop views with CSS Grid
  - Lazy loading of chart calculations for large transaction datasets
  - Type-safe percentage calculations with null checking for legend formatters

#### Examples
- **Sample Content (from translation files)**:
  - **Dialog Title**: "Add Spend or Saving"
  - **Type Options**: "Expense" and "Saving" radio buttons
  - **Dynamic Buttons**: "Add Spend" (when expense selected), "Add Saving" (when saving selected)
  - **Category Names**: 
    - Spending: "Living Expenses" (essential needs), "Lifestyle Expenses" (discretionary spending)
    - Saving: "Money spared because I didn't spend", "Vision Board Goals", "Other Savings"
  - **Overview Titles**: "Spend Overview" and "Total Savings"
  - **Legend Format**: "Living Expenses (45%)", "Lifestyle Expenses (55%)", "Emergency Fund (30%)"
  - **History Title**: "Financial Decisions History"
  - **Responsive Behavior**: Side-by-side cards on desktop (≥1024px), stacked on mobile/tablet
  - **Category Descriptions**: Educational content explaining the purpose and examples for each category type
  - **Empty State**: "No transactions recorded yet. Start by adding your first spend or saving!"

