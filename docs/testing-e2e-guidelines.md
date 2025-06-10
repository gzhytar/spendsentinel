# E2E Testing Strategy with Playwright

## Overview

This document outlines our end-to-end testing strategy for the Financial Parts Awareness application using Playwright. The approach emphasizes incremental implementation, starting with core user journeys and gradually expanding coverage.

## Testing Philosophy

### Core Principles
- **User-Centric Testing**: Focus on testing user-visible behavior and real user journeys
- **Test Isolation**: Each test should be completely independent with its own data state
- **Incremental Approach**: Start simple, validate the framework, then expand systematically
- **Multilingual Support**: Account for i18n functionality across different locales
- **Local Storage Management**: Handle client-side data persistence properly

### What We Test
- Critical user journeys (onboarding, assessments, daily workflows)
- Cross-browser compatibility for core features
- Responsive design behavior
- Data persistence across sessions
- Language switching functionality

### What We Don't Test
- Firebase Analytics integration (mock or stub)
- Third-party service integrations
- Unit-level component logic (covered by component tests)

## Technical Setup

### Project Structure
```
tests/
├── e2e/
│   ├── specs/
│   │   ├── critical-flows/
│   │   ├── feature-specific/
│   │   └── cross-cutting/
│   ├── fixtures/
│   ├── page-objects/
│   ├── utils/
│   └── data/
├── config/
│   ├── playwright.config.ts
│   └── test-environments.ts
└── reports/
```

### Configuration Requirements
- **Multiple Browsers**: Chrome, Firefox, Safari (WebKit)
- **Multiple Viewports**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **Locales**: Test en, cs, uk, ru language variants
- **Base URL**: Configurable for different environments

## Phase 1: Foundation & First Scenario

### Objective
Establish Playwright infrastructure and validate approach with one critical user flow.

### Selected First Scenario: "Quick Assessment Journey"
**Flow**: Landing Page → Self-Assessment → Quick Quiz → Results Display

**Why This Flow**:
- Represents core app value proposition
- Touches multiple key components
- Uses local storage (tests data persistence)
- Has clear success criteria
- Relatively simple, low dependency

**Success Criteria**:
1. User can navigate from landing to self-assessment
2. User can complete the firefighter quiz
3. Quiz results are displayed correctly
4. Results are persisted in local storage
5. User can retake the quiz

### Implementation Steps

#### Step 1: Basic Setup
```bash
npm init playwright@latest
```

#### Step 2: Create Page Objects
- `pages/LandingPage.ts`
- `pages/SelfAssessmentPage.ts`
- `pages/components/FirefighterQuiz.ts`

#### Step 3: Write First Test
- `specs/critical-flows/quick-assessment.spec.ts`

#### Step 4: Add Test Utilities
- Storage helpers
- Language switching utilities
- Common assertions

## Phase 2: Expand Core Flows

### Additional Critical Scenarios
1. **Deep Assessment Flow**: Financial situation → AI part identification → Results
2. **Daily Check-in Flow**: Start check-in → Log expenses → Set compassion score → Complete
3. **Parts Journal Flow**: Select part → Complete 4-step journal → Save session
4. **Language Switching**: Verify UI updates across different locales

### Testing Patterns

#### Data Management Pattern
```typescript
// Before each test
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});

// After critical actions
await expect(page).toHaveLocalStorage('key', expectedValue);
```

#### Multi-language Testing Pattern
```typescript
const locales = ['en', 'cs', 'uk', 'ru'];
for (const locale of locales) {
  test(`Assessment flow in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/self-assessment`);
    // Test logic
  });
}
```

#### Responsive Testing Pattern
```typescript
const viewports = [
  { width: 1920, height: 1080, name: 'desktop' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 375, height: 667, name: 'mobile' }
];
```

## Phase 3: Feature-Specific Testing

### Component-Level E2E Tests
- Expense form submission and validation
- Vision board item management
- Budget calculator functionality
- Panic button and grounding exercises

### Edge Cases & Error Scenarios
- Network failures during API calls
- Invalid form submissions
- Local storage quota exceeded
- Browser refresh during multi-step flows

## Phase 4: Cross-Cutting Concerns

### Performance Testing
- Page load times
- Large dataset handling
- Memory usage patterns

### Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation

### Security Testing
- XSS prevention
- Local storage data validation
- URL manipulation attempts

## Test Data Strategy

### Static Test Data
- Pre-defined expense categories
- Sample assessment responses
- Mock firefighter quiz answers

### Dynamic Test Data
- Generated user inputs
- Randomized assessment scenarios
- Time-based data (dates, timestamps)

### Data Isolation
- Each test uses unique identifiers
- Clean slate for every test run
- No shared state between tests

## Mocking Strategy

### External Services
```typescript
// Mock Firebase Analytics
await page.route('**/analytics/**', route => {
  route.fulfill({ status: 200, body: '{}' });
});

// Mock AI service calls
await page.route('**/api/identifyIFSPart', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockIFSPartResponse)
  });
});
```

### Local Storage Mocking
```typescript
// Pre-populate test data
await page.addInitScript(() => {
  localStorage.setItem('testData', JSON.stringify(mockData));
});
```

## Continuous Integration

### Pipeline Integration
- Run on pull requests
- Nightly full regression runs
- Performance benchmarking
- Cross-browser matrix testing

### Reporting
- HTML reports with screenshots
- Video recordings for failures
- Performance metrics tracking
- Flaky test identification

## Implementation Timeline

### Week 1: Foundation
- [ ] Install and configure Playwright
- [ ] Create basic project structure
- [ ] Implement first scenario (Quick Assessment)
- [ ] Set up CI pipeline

### Week 2: Core Expansion
- [ ] Add deep assessment flow
- [ ] Implement daily check-in testing
- [ ] Create reusable page objects
- [ ] Add multi-language testing

### Week 3: Feature Coverage
- [ ] Parts journal functionality
- [ ] Expense management flows
- [ ] Error handling scenarios
- [ ] Mobile responsiveness

### Week 4: Polish & Optimization
- [ ] Performance testing
- [ ] Accessibility validation
- [ ] Test stability improvements
- [ ] Documentation completion

## Maintenance Guidelines

### Test Health
- Regular review of flaky tests
- Update tests with UI changes
- Maintain page object accuracy
- Monitor test execution times

### Documentation
- Keep test scenarios current
- Document complex test logic
- Maintain troubleshooting guides
- Update setup instructions

## Success Metrics

### Coverage Goals
- 90%+ coverage of critical user paths
- All major features tested across 3 browsers
- Mobile responsiveness validated
- Multi-language functionality verified

### Quality Metrics
- < 5% flaky test rate
- < 30 second average test execution time
- 95% first-time pass rate in CI
- Zero critical bugs reaching production

## Getting Started

### Prerequisites
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Running Tests
```bash
# Run all tests
npm run test:e2e

# Run specific test
npx playwright test quick-assessment

# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui
```

## Implementation: Getting Started Today

### Step 1: Install Playwright
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Step 2: Run the First Test
The initial "Quick Assessment Journey" test is ready to run:

```bash
# Run the first test scenario
npm run test:e2e:quick

# Or run all tests
npm run test:e2e

# View results
npm run test:e2e:report
```

### Step 3: Understanding the First Test
The implemented test covers:
- ✅ Page navigation and loading
- ✅ Quiz completion with different answer patterns
- ✅ Results display and validation
- ✅ Local storage persistence
- ✅ Multi-language support
- ✅ Responsive design testing
- ✅ Accessibility basics
- ✅ Error handling scenarios

**Test Files Created:**
- `playwright.config.ts` - Main configuration
- `tests/e2e/specs/critical-flows/quick-assessment.spec.ts` - First test
- `tests/e2e/page-objects/SelfAssessmentPage.ts` - Page object model
- `tests/e2e/utils/test-helpers.ts` - Utility functions
- `tests/e2e/data/test-data.ts` - Test data and patterns

### Step 4: Validating the Approach
Run the test to verify:
1. **Infrastructure works**: Playwright can launch browsers and run tests
2. **Page objects work**: Selectors can find and interact with UI elements
3. **Mocking works**: External services are properly stubbed
4. **Storage works**: Local storage persistence is testable
5. **Multi-language works**: Tests run across different locales

### Step 5: Next Implementation Steps
Once the first test passes, expand systematically:

1. **Add Deep Assessment Test** (Week 1)
   ```bash
   # Create deep-assessment.spec.ts
   # Test AI-powered part identification flow
   ```

2. **Add Daily Check-in Test** (Week 2)
   ```bash
   # Create daily-checkin.spec.ts
   # Test expense logging and compassion scoring
   ```

3. **Add Parts Journal Test** (Week 3)
   ```bash
   # Create parts-journal.spec.ts
   # Test 4-step journaling process
   ```

## Troubleshooting the First Test

### If Tests Fail
1. **Check dev server**: Ensure `npm run dev` is running on port 3000
2. **Check selectors**: UI elements might have changed
3. **Check network**: Verify mocks are working
4. **Check storage**: Local storage might need different handling

### Common First-Run Issues
```bash
# Browser not installed
npx playwright install chromium

# Wrong base URL
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e:quick

# Timeout issues
npx playwright test --timeout=60000

# Debug mode to see what's happening
npm run test:e2e:debug
```

### Success Indicators
✅ Test completes without errors  
✅ Quiz can be completed programmatically  
✅ Results are displayed correctly  
✅ Local storage contains expected data  
✅ Test runs in under 30 seconds  
✅ Screenshots show expected UI states  

## Next Phase Planning

After validating the first test works, proceed with:

**Phase 2 Implementation (Weeks 2-3):**
- Deep assessment with AI integration testing
- Daily check-in multi-step flow
- Cross-browser validation
- Mobile responsiveness verification

**Phase 3 Expansion (Week 4):**
- Parts journal complete workflow
- Expense management features
- Performance benchmarking
- Accessibility compliance

This incremental approach ensures each step builds on validated infrastructure, minimizing risk and maximizing learning from each implementation phase. 