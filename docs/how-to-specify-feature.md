## How to Specify a Feature

When defining new features for the application, use the following template to ensure AI models can accurately understand and implement the requirements:

### Feature Specification Template

```
## Feature: [Feature Name]

### Purpose and Impact
- **User Need**: [Describe the core user need being addressed]
- **Expected Outcome**: [What the user will gain from this feature]
- **Emotional Impact**: [How this feature should make the user feel]

### Functional Requirements
- **Core Functionality**: [Concise description of what the feature does]
- **User Interactions**: [How users will engage with the feature]
- **Data Requirements**: [What information the feature needs to function]

### UI/UX Specifications
- **Component Placement**: [Where in the app the feature will appear]
- **Visual Elements**: [Specific UI components needed]
- **Interactive Behavior**: [How the feature responds to user actions]
- **States**: [Different states the feature can be in (e.g., loading, active, error)]

### Technical Implementation Guidelines
- **Suggested Approach**: [Technical patterns to follow]
- **Integration Points**: [How it connects with other features]
- **Performance Considerations**: [Any specific performance requirements]

### Examples
- **Similar Features**: [Examples of similar implementations for reference]
- **Sample Content**: [Example content to populate the feature]
```

### Example of a Feature Specification

```
## Feature: Daily Self-Compassion Prompts

### Purpose and Impact
- **User Need**: Users need regular reminders to practice self-compassion during their financial journey
- **Expected Outcome**: Increased self-compassion scores and reduced financial anxiety
- **Emotional Impact**: Should create a moment of calm and self-reflection

### Functional Requirements
- **Core Functionality**: Displays a daily rotating self-compassion prompt with an interactive response option
- **User Interactions**: Users can read the prompt, reflect on it, and optionally log their current "calm score" (1-10)
- **Data Requirements**: Library of self-compassion prompts, user calm score history

### UI/UX Specifications
- **Component Placement**: Accessible from dashboard as a card component and via a dedicated section
- **Visual Elements**: Card with prompt text, calm score slider, submit button, history graph
- **Interactive Behavior**: Smooth transitions between prompts, animated confirmation when logging score
- **States**: Default (showing today's prompt), History view (showing past scores and trends)

### Technical Implementation Guidelines
- **Suggested Approach**: Use React context for state management, store user responses in database
- **Integration Points**: Connect with user authentication system, notification system for reminders
- **Performance Considerations**: Pre-fetch next day's prompt to ensure immediate loading

### Examples
- **Sample Content**: "Today, I will treat myself with the same kindness I would offer a good friend."
```