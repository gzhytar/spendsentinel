## Feature: Parts Journal

### Purpose and Impact
- **User Need**: Users need a structured, guided journaling interface to engage in Internal Family Systems-based self-reflection, enabling deeper understanding of their financial parts through digital inner work
- **Expected Outcome**: Users develop meaningful relationships with their identified financial parts through structured dialogue, leading to increased self-awareness, emotional regulation, and healthier financial decision-making patterns
- **Emotional Impact**: Should create a safe, sacred space for inner exploration that feels supportive, non-judgmental, and transformative, fostering genuine self-compassion and part integration

### Functional Requirements
- **Core Functionality**: 
  - Step-by-step guided journaling interface following 4 structured IFS-based steps
  - Dynamic prompts that adapt to user's identified financial parts with optional financial-behavior-specific reflections
  - Rich-text journaling blocks with formatting options (headings, emphasis, bullet points, emoji support)
  - Voice input capability for accessibility and natural expression
  - Part tagging system to associate journal entries with specific identified parts
  - Save, revisit, and edit journal entries organized by date and part name
  - Session persistence to allow users to pause and resume journaling sessions
- **User Interactions**: 
  - Access via "Work with the Part" button from identified parts in Self-Assessment results
  - Navigate through 4 sequential steps with guided prompts and instructions
  - Write in rich-text journal blocks with formatting toolbar
  - Tag specific parts mentioned in journal entries
  - Save progress automatically and manually
  - Browse historical journal entries by date, part, or session
  - Edit and update previous journal entries
- **Data Requirements**: 
  - User's identified parts from self-assessment results
  - Journal entry content with rich-text formatting
  - Session metadata (date, duration, completion status, associated parts)
  - Step-specific prompts and instructions in multiple languages
  - Auto-save functionality with localStorage and future database integration

### UI/UX Specifications
- **Component Placement**: 
  - Accessible from Self-Assessment page via "Start Part Journal" button in identified parts section
  - Dedicated page at `/[lang]/parts-journal` with session-based routing
  - Integration point in Daily Check-in as optional deeper exploration step
- **Visual Elements**:
  - **Session Header**: Progress indicator showing current step (1-4), session timer, part being explored
  - **Step 1 (Safe Environment)**: 
    - Calming background with breathing animation
    - Pre-filled affirmation text: "I welcome all parts of me, just as they are right now"
    - Guided breathing instructions with visual cues
  - **Step 2 (Find, Focus, Flesh Out)**:
    - Body awareness prompts with optional body diagram for marking sensations
    - Rich-text editor for logging observations about part's presence
    - Guided questions about physical sensations, emotions, thoughts, images
  - **Step 3 (Curious Dialogue)**:
    - Structured question prompts with expandable rich-text areas for each response
    - Questions: positive intention, fears, protection origins, age perception, trust needs, additional insights
    - Part appreciation section with gratitude prompts
  - **Step 4 (Appreciate & Log)**:
    - Summary view of session insights
    - Final appreciation message to the part
    - Session completion confirmation with save options
  - **Rich-Text Editor Features**:
    - Formatting toolbar (bold, italic, headings, bullet points, emoji picker)
    - Voice input button with speech-to-text capability
    - Manual save button
  - **Journal History View**:
    - Timeline interface showing journal sessions by date - similar to DailyCheckin timeline component
    - Filter by part name, session completion status
    - Entry preview cards with date, part, and excerpt
- **Interactive Behavior**: 
  - Smooth step transitions with progress saving
  - Voice input with visual feedback
  - Responsive design optimized for both desktop writing and mobile reflection
  - Gentle animations and transitions maintaining calm, sacred atmosphere

### Technical Implementation Guidelines
- **Suggested Approach**: 
  - React component architecture with step-based navigation using `useState` and session routing
  - Rich-text editor using Tiptap or similar library for formatting capabilities
  - Voice input integration using Web Speech API with fallback options
  - localStorage for session persistence and auto-save functionality
  - Part tagging system integrated with `useIdentifiedParts()` hook
  - Content management via i18n translation files for multi-language support
- **Integration Points**: 
  - `useIdentifiedParts()` hook from assessment-utils.ts for available parts
  - Shared component library (Button, Card, Progress, Dialog) for consistent UI
  - Voice input API integration with error handling and permissions
  - PanicButton component available throughout journaling session
  - Integration with Daily Check-in as optional "Deepen Relationships" step
- **Performance Considerations**: 
  - Lazy loading of rich-text editor to reduce initial bundle size
  - Efficient auto-save with debouncing to prevent excessive storage operations
  - Voice input optimization with compression and local processing when possible
  - Session data compression for localStorage efficiency
  - Progressive enhancement for voice features with graceful degradation

### Examples
- **Sample Content (from translation files)**:
  - **Session Start**: "Begin a dialogue with your [PartName]. This is a safe space for inner exploration and understanding."
  - **Step 1 Affirmation**: "I welcome all parts of me, just as they are right now."
  - **Step 2 Prompt**: "Ask yourself: 'When this part is triggered, where do I notice it?' Turn your attention inside and notice how you experience this part - visually, as a voice, through thoughts, emotions, sensations, or something else entirely."
  - **Step 3 Questions**: 
    - "What is your positive intention for me?"
    - "What are you afraid would happen if you stop protecting me?"
    - "How did you learn to protect me this way?"
    - "How old do you think I am?"
    - "What do you need from me so you can trust me more?"
  - **Step 4 Appreciation**: "Thank you, [PartName], for the work you're doing to protect me. I see your positive intention and I'm grateful for your care."
  - **Voice Input**: "Tap to speak your thoughts aloud - sometimes our parts speak more freely through voice than text."