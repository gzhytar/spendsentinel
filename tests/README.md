# E2E Testing with Playwright

This directory contains end-to-end tests for the Financial Parts Awareness application using Playwright.

## Quick Start

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Run Your First Test
```bash
# Run the quick assessment test (our first scenario)
npm run test:e2e:quick
```

### 3. View Results
```bash
# Open test report
npm run test:e2e:report
```

## Test Commands

```bash
# Run all tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Debug tests (step through with debugger)
npm run test:e2e:debug

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test tests/e2e/specs/critical-flows/quick-assessment.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests against specific URL
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e
```

## Project Structure

```
tests/
├── e2e/
│   ├── specs/
│   │   ├── critical-flows/          # Core user journey tests
│   │   │   └── quick-assessment.spec.ts
│   │   ├── feature-specific/        # Individual feature tests
│   │   └── cross-cutting/          # Cross-cutting concern tests
│   ├── page-objects/               # Page object models
│   │   └── SelfAssessmentPage.ts
│   ├── utils/                      # Test utilities and helpers
│   │   └── test-helpers.ts
│   └── data/                       # Test data and fixtures
│       └── test-data.ts
├── config/                         # Test configuration
└── reports/                        # Generated test reports
```

## Writing Tests

### Page Objects
Use the page object pattern to encapsulate page interactions:

```typescript
import { SelfAssessmentPage } from '../../page-objects/SelfAssessmentPage';

test('my test', async ({ page }) => {
  const selfAssessmentPage = new SelfAssessmentPage(page);
  await selfAssessmentPage.goto('en');
  await selfAssessmentPage.completeQuizWithAnswers([0, 1, 0, 1, 0]);
});
```

### Test Data
Use predefined test data for consistency:

```typescript
import { QUIZ_ANSWER_PATTERNS, DEEP_ASSESSMENT_SAMPLES } from '../../data/test-data';

// Use predefined quiz patterns
await selfAssessmentPage.completeQuizWithAnswers(QUIZ_ANSWER_PATTERNS.spender);

// Use sample assessment responses
await selfAssessmentPage.fillDeepAssessment(
  DEEP_ASSESSMENT_SAMPLES.anxious_spender.financialSituation,
  DEEP_ASSESSMENT_SAMPLES.anxious_spender.recentBehavior
);
```

### Test Helpers
Use utility functions for common operations:

```typescript
import { clearStorage, setupTestMocks, checkBasicAccessibility } from '../../utils/test-helpers';

test.beforeEach(async ({ page }) => {
  await clearStorage(page);           // Clean slate for each test
  await setupTestMocks(page);         // Mock external services
});

test('accessibility test', async ({ page }) => {
  await checkBasicAccessibility(page); // Verify accessibility basics
});
```

## Test Categories

### Critical Flows (`critical-flows/`)
- Core user journeys that must always work
- End-to-end scenarios from landing to completion
- Cross-browser and cross-device testing

**Current Tests:**
- Quick Assessment Journey (quiz completion)

### Feature-Specific (`feature-specific/`)
- Individual feature testing
- Component-level E2E tests
- Feature isolation testing

### Cross-Cutting (`cross-cutting/`)
- Performance testing
- Accessibility validation
- Security testing
- Multi-language testing

## Test Data Management

### Local Storage
Tests automatically handle local storage cleanup and mocking:

```typescript
// Storage is cleared before each test
await clearStorage(page);

// Verify data persistence
await expectLocalStorageContains(page, 'firefighterQuizResults', expectedData);
```

### API Mocking
External services are mocked by default:

```typescript
// Firebase Analytics is automatically mocked
// AI services return predictable test data
await setupTestMocks(page, {
  customAIResponses: { identifyPart: customResponse }
});
```

## Multi-Language Testing

Tests support multiple locales:

```typescript
const locales = ['en', 'cs', 'uk', 'ru'];
for (const locale of locales) {
  await selfAssessmentPage.goto(locale);
  // Test logic
}
```

## Debugging

### Visual Debugging
```bash
# Run with browser visible
npm run test:e2e:headed

# Interactive debugging
npm run test:e2e:debug

# UI mode for exploration
npm run test:e2e:ui
```

### Screenshots
Automatic screenshots on failure, manual screenshots:

```typescript
await page.screenshot({ 
  path: `test-results/screenshots/my-test.png`,
  fullPage: true 
});
```

### Traces
View detailed traces of test execution:

```bash
# After test failure, open trace viewer
npx playwright show-trace test-results/[test-name]/trace.zip
```

## CI/CD Integration

Tests are configured for CI environments:

```yaml
# Example GitHub Actions
- name: Install Playwright
  run: npx playwright install

- name: Run E2E Tests
  run: npm run test:e2e
  env:
    PLAYWRIGHT_BASE_URL: http://localhost:3000

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Best Practices

### Test Isolation
- Each test runs with clean storage
- No dependencies between tests
- Predictable test data

### Accessibility
- Basic accessibility checks included
- Keyboard navigation testing
- Screen reader compatibility

### Performance
- Network mocking to avoid external dependencies
- Optimized selectors for speed
- Parallel test execution

### Maintainability
- Page object pattern for reusability
- Centralized test data
- Clear naming conventions

## Troubleshooting

### Common Issues

**Tests failing locally:**
```bash
# Ensure dev server is running
npm run dev

# Check if Playwright browsers are installed
npx playwright install
```

**Tests timing out:**
- Check if baseURL is correct
- Ensure dev server is running
- Review network mocking configuration

**Selector issues:**
- Use `npx playwright codegen` to generate selectors
- Check page object locator strategies
- Verify element accessibility attributes

### Getting Help

1. Check the [Playwright documentation](https://playwright.dev/docs/intro)
2. Review test logs in `test-results/`
3. Use `--debug` mode to step through tests
4. Check the page object implementations for selector strategies

## Next Steps

1. **Expand Critical Flows**: Add deep assessment and daily check-in tests
2. **Feature Coverage**: Test expense management and parts journal
3. **Cross-Cutting**: Add performance and security testing
4. **CI Integration**: Set up automated testing pipeline 