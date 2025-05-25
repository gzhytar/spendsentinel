# **App Name**: ToBeDefined

## App vision: an interactive, AI-powered Financial Therapist and Coach that behaves like a personal financial-behavior specialist, mindfulness mentor, and trauma-informed coach. With the goal of supporting and guiding users on how to achieve both financial health and emotional well-being. 

## Core Features:

- IFS Dialogue: AI-driven dialogue to identify and understand the user's financial "firefighter" parts using the 6F (Find, Focus, Flesh out, Feel toward, Befriend, Fears) framework, surfacing the role, burden, and concern of each part. This acts as a decision-making tool, and must carefully assess how to communicate sometimes complex emotional concepts to end-users of different personality types, in a supportive manner. This uses a tool to make decisions about how to engage the user.
- Financial GPS: Interactive timeline mapping past influences, present snapshot, and vision board to establish a financial GPS, showing a 'You Are Here' point.
- Expense Highlighter: Expense tool allowing users to highlight expenses as 'Living' vs. 'Lifestyle' to promote mindful spending decisions.
- Panic Button: A 'Red-Dot Panic' feature which offers users the ability to instantly hide sensitive financial screens and trigger a quick grounding exercise if they feel triggered or overwhelmed.
- Self-Compassion Prompts: Daily self-compassion micro-practices integrated into the app's workflow that provides supportive messaging. Tracks self-reported calm scores and the ratio of self-critical statements over time.

## Style Guidelines:

- Primary color: A calming lavender (#B5B7E8), selected to instill a sense of peace and balance, drawing inspiration from mindfulness practices. Its versatility makes it adaptable to various UI components without overwhelming the user.
- Background color: Light gray (#F0F0F5), providing a soft, neutral backdrop that ensures readability and reduces eye strain, in keeping with a light color scheme.
- Accent color: Soft blue (#A0D2EB), analogous to lavender, adding a touch of serenity and trust, ideal for highlighting interactive elements and CTAs. The brightness and saturation is offset from the primary.
- Clean and easily legible font to ensure the content is easily readable. Radix-UI font choices will be used as a base.
- Gentle, minimalist icons that represent financial and emotional concepts, contributing to the app's calming and intuitive interface. Radix-UI icons will be used as a base.
- Simple and intuitive layouts with ample spacing to reduce clutter and promote a sense of calm. Radix-UI layouts will be used as a base.
- Subtle animations that provide gentle feedback and guide the user through the app. Radix-UI animations will be used as a base.

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

