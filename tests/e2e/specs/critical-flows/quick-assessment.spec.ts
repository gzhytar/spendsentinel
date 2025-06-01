import { test, expect } from '@playwright/test';
import { 
  clearStorage, 
  setupTestMocks, 
  expectLocalStorageContains,
  waitForPageLoad,
  checkBasicAccessibility
} from '../../utils/test-helpers';


test.describe('Quick Assessment Journey', () => {
 
  test.beforeEach(async ({ page }) => {
    // Set up mocks before navigation
    await setupTestMocks(page);
    await page.goto('en');
    await clearStorage(page);
  });


  test('should complete quick assessment quiz flow successfully', async ({ page }) => {
    await page.goto('en');
    await page.getByRole('link', { name: 'Explore my financial parts', exact: false }).first().click();
    await page.getByRole('button', { name: 'Start Discovery' }).click();
    await page.getByText('Browse online stores or go').click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByText('Put it all in savings before').click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByText('It feels too restrictive and').click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByText('Impulse purchases I didn\'t').click();
    await page.getByRole('button', { name: 'See Results' }).click();
    
    await expect(page.getByRole('button', { name: 'The Spender' })).toBeEnabled();
    await page.getByRole('button', { name: 'Perform a Daily Check-In' }).click({force: true});

    await expect(page.getByRole('heading', { name: 'Grounding Breath Exercise' })).toBeVisible({timeout: 1000});
    await page.getByRole('button', { name: 'Next'}).click({force: true});

    await expect(page.getByRole('heading', { name: 'Reflect on Your Day' })).toBeVisible({timeout: 1000});
    await page.getByRole('button', { name: 'Next', exact: true }).click({force: true});

    await page.getByRole('radio', { name: 'Spend' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('300');
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByText('Lifestyle Expenses').click();
    await page.getByRole('textbox', { name: 'Description' }).click();
    await page.getByRole('textbox', { name: 'Description' }).fill('Pivko');
    await page.getByRole('checkbox', { name: 'The Spender' }).click();
    await page.getByRole('textbox', { name: 'How did this part show up?' }).click();
    await page.getByRole('textbox', { name: 'How did this part show up?' }).fill('went to the pub');
    await page.getByRole('button', { name: 'Add Spend' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Start New Session' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('textbox', { name: 'When The Spender is triggered' }).click();
    await page.getByRole('textbox', { name: 'When The Spender is triggered' }).fill('noticed in my belly');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('textbox', { name: 'This part wants to help me by' }).click();
    await page.getByRole('textbox', { name: 'This part wants to help me by' }).fill('positive intent');
    await page.getByRole('textbox', { name: 'This part is afraid that if' }).click();
    await page.getByRole('textbox', { name: 'This part is afraid that if' }).fill('afraid of future');
    await page.getByRole('textbox', { name: 'This part learned to protect' }).click();
    await page.getByRole('textbox', { name: 'This part learned to protect' }).fill('by reliving the stress');
    await page.getByRole('textbox', { name: 'This part sees me as...' }).click();
    await page.getByRole('textbox', { name: 'This part sees me as...' }).fill('5 y.o');
    await page.getByRole('textbox', { name: 'This part needs me to...' }).click();
    await page.getByRole('textbox', { name: 'This part needs me to...' }).fill('avoid stress');
    await page.getByRole('textbox', { name: 'This part also wants me to' }).click();
    await page.getByRole('textbox', { name: 'This part also wants me to' }).fill('no');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('textbox', { name: 'Thank you, The Spender, for...' }).click();
    await page.getByRole('textbox', { name: 'Thank you, The Spender, for...' }).fill('thank you!');
    await page.getByRole('button', { name: 'Complete Session' }).click();
    await page.getByRole('button', { name: 'Reflect & Save Score' }).click();
    await page.getByRole('button', { name: 'Complete Check-in' }).click();
    
    await page.getByRole('link', { name: 'My Financial Decisions' }).click();
    await page.getByRole('button', { name: 'Add to Vision Board' }).click();
    await page.getByRole('textbox', { name: 'Content' }).click();
    await page.getByRole('textbox', { name: 'Content' }).fill('Domek');
    await page.getByRole('button', { name: 'Add Item' }).click();
    await page.getByRole('button', { name: 'Set My Budget' }).click();
    await page.getByRole('spinbutton', { name: 'Monthly Income' }).fill('50000');
    await page.getByRole('button', { name: 'Save Budget' }).click();
    await page.getByRole('button', { name: 'Add Spend or Saving' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('500');
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByLabel('Lifestyle Expenses').getByText('Lifestyle Expenses').click();
    await page.getByRole('textbox', { name: 'Description' }).click();
    await page.getByRole('textbox', { name: 'Description' }).fill('Zmrzka');
    await page.getByRole('checkbox', { name: 'The Spender' }).click();
    await page.getByRole('button', { name: 'Add Spend' }).click();
    await page.getByRole('button', { name: 'Add Spend or Saving' }).click();
    await page.getByRole('radio', { name: 'Saving' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('500');
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByText('Vision Board Goals', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Description' }).click();
    await page.getByRole('textbox', { name: 'Description' }).fill('Domecek');
    await page.getByRole('button', { name: 'Add Saving' }).click();
    
    await expect(page.getByRole('cell', { name: 'Domecek' })).toBeVisible();
  });
});