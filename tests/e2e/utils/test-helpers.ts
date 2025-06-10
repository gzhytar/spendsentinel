import { expect, type Page } from '@playwright/test';

/**
 * Clear all local storage and session storage before test
 */
export async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Mock Firebase Analytics to prevent network calls
 */
export async function mockFirebaseAnalytics(page: Page) {
  await page.route('**/analytics/**', route => {
    route.fulfill({ status: 200, body: '{}' });
  });
  
  await page.route('**/www.google-analytics.com/**', route => {
    route.fulfill({ status: 200, body: '{}' });
  });
  
  await page.route('**/firebase/**', route => {
    route.fulfill({ status: 200, body: '{}' });
  });
}

/**
 * Mock AI service calls for testing
 */
export async function mockAIServices(page: Page, mockResponses?: {
  identifyPart?: any;
  resolvePart?: any;
}) {
  // Mock IFS Part Identification
  await page.route('**/api/identifyIFSPart**', route => {
    const response = mockResponses?.identifyPart || {
        "identifiedPart": {
            "behaviors": [
                "Carefully plans purchases",
                "Researches investment options",
                "Regularly reviews financial goals",
                "Stays within budget"
            ],
            "burden": "Believes that any financial mistakes will lead to failure and a loss of control.",
            "concern": "Fear of losing financial stability and not achieving long-term goals.",
            "description": "This part is all about planning and stability, making sure you stay on track with your financial goals. It works to keep you in control and secure. Its focus is to help you feel confident and successful in your financial journey, ensuring a stable and predictable future.",
            "digitalFootprints": [
                "Uses financial planning apps",
                "Follows financial news websites",
                "Saves articles on investing",
                "Subscribes to finance newsletters"
            ],
            "emotions": [
                "Confidence",
                "Satisfaction",
                "Sense of control",
                "Mild anxiety when things are uncertain"
            ],
            "innerDialogue": [
                "I'm doing a great job.",
                "I'm in control.",
                "Let's make sure we're on track.",
                "This is working."
            ],
            "partName": "The Planner",
            "role": "To ensure financial security and the attainment of long-term financial goals by meticulously planning and making informed decisions.",
            "triggers": [
                "Setting financial goals",
                "Reviewing financial progress",
                "Positive financial outcomes",
                "Talking about future plans"
            ]
        }
      };
    
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
  
  // Mock IFS Part Resolution
  await page.route('**/api/ifsPartResolution**', route => {
    const response = mockResponses?.resolvePart || {
      role: 'Protecting you from financial harm through vigilant oversight.',
      burden: 'Carrying the weight of preventing any financial mistakes.',
      concern: 'Deep fear that any financial misstep will lead to ruin.',
      engagementStrategy: 'gentle'
    };
    
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
}

/**
 * Setup common mocks for tests
 */
export async function setupTestMocks(page: Page, options?: {
  skipAnalytics?: boolean;
  skipAI?: boolean;
  customAIResponses?: any;
}) {
  if (!options?.skipAnalytics) {
    await mockFirebaseAnalytics(page);
  }
  
  if (!options?.skipAI) {
    await mockAIServices(page, options?.customAIResponses);
  }
}

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Check if local storage contains expected data
 */
export async function expectLocalStorageContains(
  page: Page, 
  key: string, 
  expectedContent: any
) {
  const storageContent = await page.evaluate((storageKey) => {
    const content = localStorage.getItem(storageKey);
    return content ? JSON.parse(content) : null;
  }, key);
  
  expect(storageContent).toBeTruthy();
  
  if (Array.isArray(expectedContent)) {
    expect(storageContent).toEqual(expect.arrayContaining(expectedContent));
  } else if (typeof expectedContent === 'object' && Array.isArray(storageContent)) {
    // If expected is an object but storage content is an array,
    // check if the array contains an object with the expected properties
    expect(storageContent).toEqual(expect.arrayContaining([
      expect.objectContaining(expectedContent)
    ]));
  } else if (typeof expectedContent === 'object') {
    expect(storageContent).toEqual(expect.objectContaining(expectedContent));
  } else {
    expect(storageContent).toEqual(expectedContent);
  }
}

/**
 * Set up local storage with test data
 */
export async function setupLocalStorage(page: Page, data: Record<string, any>) {
  await page.addInitScript((testData) => {
    for (const [key, value] of Object.entries(testData)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, data);
}

/**
 * Get current locale from URL
 */
export async function getCurrentLocale(page: Page): Promise<string> {
  const url = page.url();
  const match = url.match(/\/([a-z]{2})(?:\/|$)/);
  return match ? match[1] : 'en';
}

/**
 * Navigate to a localized route
 */
export async function gotoLocalized(page: Page, path: string, locale: string = 'en') {
  const url = `/${locale}${path.startsWith('/') ? path : '/' + path}`;
  await page.goto(url);
  await waitForPageLoad(page);
}

/**
 * Take a screenshot with consistent naming
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true
  });
}

/**
 * Verify page accessibility basics
 */
export async function checkBasicAccessibility(page: Page) {
  // Check for basic accessibility attributes
  const headings = page.locator('h1, h2, h3, h4, h5, h6');
  const headingCount = await headings.count();
  expect(headingCount).toBeGreaterThan(0);
  
  // Check for alt text on images
  const images = page.locator('img');
  const imageCount = await images.count();
  
  if (imageCount > 0) {
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      
      // Images should have alt text or aria-label
      expect(alt || ariaLabel).toBeTruthy();
    }
  }
  
  // Check for form labels
  const inputs = page.locator('input[type="text"], input[type="email"], textarea');
  const inputCount = await inputs.count();
  
  if (inputCount > 0) {
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        expect(hasLabel || ariaLabel).toBeTruthy();
      }
    }
  }
}

/**
 * Wait for specific text to appear on page
 */
export async function waitForText(page: Page, text: string | RegExp, timeout: number = 10000) {
  await page.waitForFunction(
    (searchText) => {
      const bodyText = document.body.textContent || '';
      if (typeof searchText === 'string') {
        return bodyText.includes(searchText);
      } else {
        return searchText.test(bodyText);
      }
    },
    text,
    { timeout }
  );
}

/**
 * Simulate slow network for testing loading states
 */
export async function simulateSlowNetwork(page: Page) {
  await page.route('**/api/**', async route => {
    // Add 2 second delay to API calls
    await new Promise(resolve => setTimeout(resolve, 2000));
    route.continue();
  });
}

/**
 * Responsive viewport testing helper
 */
export async function testResponsiveBreakpoints(
  page: Page, 
  callback: (viewport: { width: number; height: number; name: string }) => Promise<void>
) {
  const viewports = [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 1024, height: 768, name: 'tablet-landscape' },
    { width: 768, height: 1024, name: 'tablet-portrait' },
    { width: 375, height: 667, name: 'mobile' }
  ];
  
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(500); // Allow for responsive adjustments
    await callback(viewport);
  }
}

export const TEST_TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 15000,
  LONG: 30000,
  API_CALL: 10000,
} as const; 