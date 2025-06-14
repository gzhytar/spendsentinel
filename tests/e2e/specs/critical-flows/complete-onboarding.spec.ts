import { test, expect } from '@playwright/test';
import { 
  clearStorage, 
  setupTestMocks, 
  waitForPageLoad,
  expectLocalStorageContains,
  gotoLocalized,
  takeScreenshot,
  setCookieConsentState
} from '../../utils/test-helpers';

test.describe('Complete New User Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all previous data and setup mocks
    await setupTestMocks(page, {
      skipAnalytics: false, // We want to test analytics in this flow
      skipAI: false
    });
    const locale = 'en';
    await gotoLocalized(page, '/', locale);
    await waitForPageLoad(page);
    await clearStorage(page);
    await setCookieConsentState(page);
    await page.waitForTimeout(1000);
  });

  test('should complete full onboarding journey from landing to budget setup', async ({ page }) => {
    const locale = 'en';
    
    // Step 1: Visit landing page
    await test.step('1. Visit landing page', async () => {
      await gotoLocalized(page, '/', locale);
      await waitForPageLoad(page);
      
      // Verify landing page elements are present
      await expect(page.getByRole('heading', { name: /transform your relationship with money/i })).toBeVisible();
    });

    // Step 2: Use 'Explore My Financial Parts' button
    await test.step('2. Click Explore My Financial Parts button', async () => {
      const exploreButton = page.getByRole('link', { name: /explore my financial parts/i }).first();
      await expect(exploreButton).toBeVisible();
      await exploreButton.click();
      
      // Should navigate to self-assessment page
      await expect(page).toHaveURL(new RegExp(`/${locale}/self-assessment`));
      await waitForPageLoad(page);
      
      // Verify self-assessment page loaded
      await expect(page.getByText('My Parts Discovery')).toBeVisible();
      await expect(page.getByText('Quick Parts Discovery')).toBeVisible();
    });

    // Step 3: Complete Quick Parts Discovery test
    await test.step('3. Complete Quick Parts Discovery quiz', async () => {
      // Start the quiz
      const startQuizButton = page.getByRole('button', { name: 'Start My Discovery' });
      await expect(startQuizButton).toBeVisible();
      await startQuizButton.click();
      
      // Answer all 6 questions to get a predefined part (spender)
      // Question 1: When financially stressed, I tend to...
      await expect(page.getByText('Browse online stores')).toBeVisible();
      await page.getByText('Browse online stores').click();
      await page.getByRole('button', { name: 'Next' }).click();
      
      // Question 2: If I received unexpected money, I would...
      await expect(page.getByText('Put it all in savings')).toBeVisible();
      await page.getByText('Put it all in savings').click();
      await page.getByRole('button', { name: 'Next' }).click();
      
      // Question 3: When it comes to financial planning, I think budgets are...
      await expect(page.getByText('It feels too restrictive')).toBeVisible();
      await page.getByText('It feels too restrictive').click();
      await page.getByRole('button', { name: 'Next' }).click();
      
      // Question 4: My biggest financial regret is usually...
      await expect(page.getByText('Impulse purchases')).toBeVisible();
      await page.getByText('Impulse purchases').click();
      await page.getByRole('button', { name: 'Next' }).click();
      
      // Question 5: What worries me most about money is...
      await expect(page.getByText('Not having enough')).toBeVisible();
      await page.getByText('Not having enough').click();
      await page.getByRole('button', { name: 'Next' }).click();
      
      // Question 6: How often do you think about money?
      await expect(page.getByText('Only when I')).toBeVisible();
      await page.getByText('Only when I').click();
      await page.getByRole('button', { name: 'See Results' }).click();
      
      // Verify quiz result shows The Spender
      await expect(page.getByRole('button', { name: 'The Spender' })).toBeEnabled();
      
      // Verify the result is saved to localStorage
      await expectLocalStorageContains(page, 'unifiedAssessmentResults', { type: 'quiz' });
    });

    // Step 4: Start New Check-in
    await test.step('4. Start daily check-in flow', async () => {
      // Click the "Perform a Daily Check-In" button
      const startCheckinButton = page.getByRole('button', { name: 'Start New Check-In' });
      await expect(startCheckinButton).toBeVisible();
      await startCheckinButton.click();
      
      // Should navigate to daily check-in page
      await expect(page).toHaveURL(new RegExp(`/${locale}/daily-checkin`));
      await waitForPageLoad(page);
      
      // Verify check-in page loaded with grounding exercise
      await expect(page.getByRole('heading', { name: 'Grounding Breath Exercise' })).toBeVisible();
    });

    // Step 4a: Complete check-in steps including expense with triggered part
    await test.step('4a. Complete check-in steps with expense', async () => {
      // Step 1: Grounding exercise - click next
      await expect(page.getByRole('heading', { name: 'Grounding Breath Exercise' })).toBeVisible();
      const nextStep1 = page.getByRole('button', { name: 'Next' });
      await nextStep1.click();
      
      // Step 2: Reflection step - click next
      await expect(page.getByRole('heading', { name: 'Reflect on Your Day' })).toBeVisible();
      const nextStep2 = page.getByRole('button', { name: 'Next' });
      await nextStep2.click();
      
      // Step 3: Expense logging - add an expense with triggered part
      await expect(page.getByText(/Add Spend Or Saving/i)).toBeVisible();
      
      // Add an expense
      await page.getByRole('radio', { name: 'Spend' }).click();
      await page.getByRole('spinbutton', { name: 'Amount' }).fill('25');
      await page.getByRole('combobox', { name: 'Category' }).click();
      await page.getByText('Lifestyle Expenses').click();
      await page.getByRole('textbox', { name: 'Description' }).fill('Coffee and pastry');
      
      // Select The Spender as triggered part
      await page.getByRole('checkbox', { name: 'The Spender' }).check();
      
      // Add a journal note for the triggered part
      await page.getByRole('textbox', { name: 'How did this part show up?' }).fill('I was feeling stressed and wanted something comforting');
      
      // Save the expense
      await page.getByRole('button', { name: 'Add Spend' }).click();
      
      // Verify expense was added
      await expect(page.getByRole('cell', { name: 'Coffee and pastry' })).toBeVisible();
      
      // Continue to next step
      const nextStep3 = page.getByRole('button', { name: 'Next', exact: true });
      await nextStep3.click();
    });

    // Step 4b: Complete journal session with triggered part
    await test.step('4b. Complete parts journal session', async () => {
      // Step 4: Parts reflection - should show triggered parts
      await expect(page.getByText(/Parts triggered in today's spending/i)).toBeVisible();
      
      // Should see The Spender part that was triggered
      await expect(page.getByText(/the spender/i)).toBeVisible();
      
      // Start journal session with The Spender
      const startJournalButton = page.getByRole('button', { name: 'Start New Session' });
      await startJournalButton.click();
      
      // Complete the 4-step journal process
      // Step 0: Introduction
      await expect(page.getByText(/Working with The Spender/i)).toBeVisible();
      const startDialogueButton = page.getByRole('button', { name: 'Start Dialogue' });
      await startDialogueButton.click();
      
      // Step 1: Safe Environment - multiple fields
      await expect(page.getByText(/Grounding Breath Exercise/i)).toBeVisible();
      const nextJournal1 = page.getByRole('button', { name: 'Next', exact: true });
      await nextJournal1.click();
      
       // Step 2: Find & Focus
      const step2Content = 'I noticed The Spender part became active when I was feeling stressed at work. It wanted to help me feel better through a treat.';
      await page.getByRole('textbox', { name: 'When The Spender is triggered' }).fill(step2Content);
      const nextJournal2 = page.getByRole('button', { name: 'Next', exact: true });
      await nextJournal2.click();
      
      // Fill positive intention
      await page.getByRole('textbox', { name: 'This part wants to help me by' }).fill('helping me feel better and cope with stress');
      // Fill fears
      await page.getByRole('textbox', { name: 'This part is afraid that if' }).fill('I will feel deprived or sad if I don\'t spend');
      // Fill protection origins
      await page.getByRole('textbox', { name: 'This part learned to protect' }).fill('me when I was young and treats made difficult days better');
      // Fill age perception
      await page.getByRole('textbox', { name: 'This part sees me as...' }).fill('someone who deserves comfort when life is hard');
      // Fill trust needs
      await page.getByRole('textbox', { name: 'This part needs me to...' }).fill('know that other forms of comfort and joy are available');
      // Fill additional insights
      await page.getByRole('textbox', { name: 'This part also wants me to' }).fill('find healthy ways to manage stress');
      
      const nextJournal3 = page.getByRole('button', { name: 'Next', exact: true });
      await nextJournal3.click();
      
      // Step 4: Appreciate & Log
      await expect(page.getByText(/Honor The Spender and capture your insights/i)).toBeVisible();
      const step4Content = 'Thank you, Spender part, for trying to help me feel better. I understand you want me to be happy. Let\'s work together to find healthy ways to manage stress.';
      await page.getByRole('textbox', { name: 'Thank you, The Spender, for...' }).fill(step4Content);
      
      // Complete journal session
      const completeJournalButton = page.getByRole('button', { name: 'Complete Session' });
      await completeJournalButton.click();
    });

    // Step 4c: Complete final check-in step
    await test.step('4c. Complete check-in final step', async () => {
      // Complete the check-in
      const completeCheckinButton = page.getByRole('button', { name: 'Complete Check-in' });
      await expect(completeCheckinButton).toBeVisible();
      await completeCheckinButton.click();
      
      // Verify check-in completion is saved
      const today = new Date().toISOString().split('T')[0];
      await page.waitForTimeout(500);
      await expectLocalStorageContains(page, 'completedCheckIns', [today]);
    });

    // Step 5: Add goal to Vision board via Continue Your Journey
    await test.step('5. Add goal to Vision board', async () => {
      // Look for Continue Your Journey section
      const visionBoardButton = page.getByRole('button', { name: 'Add to Vision Board' });
      await expect(visionBoardButton).toBeVisible();
      await visionBoardButton.click();
      
      // Should open vision board dialog
      await expect(page.getByRole('textbox', { name: 'Content' })).toBeVisible();
      
      // Add a goal
      await page.getByRole('textbox', { name: 'Content' }).fill('Save for a vacation to Japan');
      
      // Save the vision board item
      const addItemButton = page.getByRole('button', { name: 'Add Item' });
      await addItemButton.click();
      
      // Verify vision board item was saved
      await page.waitForTimeout(1000);
      await expectLocalStorageContains(page, 'visionBoardItems', { content: 'Save for a vacation to Japan' });
    });

    // Step 6: Set budget via Continue Your Journey
    await test.step('6. Set budget via Continue Your Journey', async () => {
      // Look for budget setup button
      const budgetButton = page.getByRole('button', { name: 'Set My Budget' });
      await expect(budgetButton).toBeVisible();
      await budgetButton.click();
      
      // Should open budget dialog
      await expect(page.getByRole('spinbutton', { name: 'Monthly Income' })).toBeVisible();
      
      // Fill budget information
      await page.getByRole('spinbutton', { name: 'Monthly Income' }).fill('4000');
      
      // Save the budget
      const saveBudgetButton = page.getByRole('button', { name: 'Save Budget' });
      await saveBudgetButton.click();
      
      // Verify budget was saved
      await page.waitForTimeout(1000);
      await expectLocalStorageContains(page, 'monthlyBudget', { monthlyIncome: 4000 });
    });

    // Final verification: Complete onboarding state
    await test.step('7. Verify complete onboarding state', async () => {
      // Verify all key data exists in localStorage
      await expectLocalStorageContains(page, 'unifiedAssessmentResults', { type: 'quiz' });
      
      const today = new Date().toISOString().split('T')[0];
      await expectLocalStorageContains(page, 'completedCheckIns', [today]);
      
      await expectLocalStorageContains(page, 'visionBoardItems', { content: 'Save for a vacation to Japan' });
      await expectLocalStorageContains(page, 'monthlyBudget', { monthlyIncome: 4000 });
      
      // Check that parts journal session was saved
      const journalSessions = await page.evaluate(() => {
        const stored = localStorage.getItem('completedPartsJournalSessions');
        return stored ? JSON.parse(stored) : [];
      });
      expect(journalSessions).toHaveLength(1);
      expect(journalSessions[0]).toHaveProperty('partName', 'The Spender');
      
      // Check that expense was saved
      const expenses = await page.evaluate(() => {
        const stored = localStorage.getItem('expenses');
        return stored ? JSON.parse(stored) : [];
      });
      expect(expenses.length).toBeGreaterThan(0);
      expect(expenses[0]).toHaveProperty('description', 'Coffee and pastry');
    });
  });

  test('should handle quiz uncertainty and suggest deep assessment', async ({ page }) => {
    const locale = 'en';
    
    await test.step('Navigate to self-assessment and start quiz', async () => {
      await gotoLocalized(page, '/self-assessment', locale);
      await waitForPageLoad(page);
      
      const startQuizButton = page.getByRole('button', { name: 'Start My Discovery' });
      await startQuizButton.click();
    });

    await test.step('Answer with mostly "unsure" options', async () => {
      // Answer most questions with "I'm not sure" to trigger deep assessment suggestion
      for (let i = 0; i < 6; i++) {
        // Wait for question to load
        await page.waitForTimeout(500);
        
        const unsureOption = page.getByText('I\'m not sure / None of these match me');
        await expect(unsureOption).toBeVisible();
        await unsureOption.click();
        
        if (i < 5) {
          const nextButton = page.getByRole('button', { name: 'Next' });
          await nextButton.click();
        }
      }
      
      const seeResultsButton = page.getByRole('button', { name: 'See Results' });
      await seeResultsButton.click();
    });

    await test.step('Verify deep assessment suggestion', async () => {
      // Should suggest deep assessment due to uncertainty
      await expect(page.getByText(/Deep Part Exploration/i)).toBeVisible();

      await page.getByRole('textbox', { name: 'Describe your current' }).fill('I don\'t have any issues with money.');
      await page.getByRole('textbox', { name: 'Describe your recent' }).fill('I make well balanced financial decisions.');

      await page.getByRole('button', { name: 'Identify My Financial Parts' }).click();

      // Verify quiz result shows custom part. API call is MOCKED!!!! see test-helpers.ts
      await expect(page.getByRole('button', { name: 'The Planner' })).toBeEnabled();
      // Verify behaviors are shown
      await expect(page.getByRole('tab', { name: 'Behaviors' })).toBeEnabled();

      await expect(page.getByText(/continue your journey/i)).toBeVisible();
    });
  });
});