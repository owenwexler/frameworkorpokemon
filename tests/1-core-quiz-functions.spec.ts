import { test, expect } from '@playwright/test';
import { checkScorecard } from './globalTestFunctions/globalTestFunctions';

test.describe('Core Quiz Functions', () => {
  test('all core quiz functions work', async ({ page }) => {
    // these all need to be in one test because a page refresh would reset the quiz

    await page.goto('/');

    await expect(page.locator('#name-sign-text')).toContainText('React');
    await checkScorecard(page, {
      correct: 0,
      wrong: 0
    });
    await page.getByRole('button', { name: 'Framework' }).click();

    await checkScorecard(page, {
      correct: 1,
      wrong: 0
    });

    await page.getByText('% right: 100.00%').click();
    await expect(page.locator('#percent-right-text')).toContainText('% right: 100.00%');
    await expect(page.locator('div').filter({ hasText: 'Correct! React is a framework.' })).toBeVisible();
    await expect(page.locator('#answer-status-text')).toContainText('Correct! React is a framework.');
    await page.getByRole('button', { name: 'NEXT >>>' }).click();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('1');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('0');
    await page.getByRole('button', { name: 'Pokemon' }).click();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('2');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('0');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 100.00%');
    await expect(page.locator('#answer-status-text')).toContainText('Correct! Bulbasaur is a Pokemon.');
    await page.getByRole('button', { name: 'NEXT >>>' }).click();
    await expect(page.locator('#name-sign-text')).toContainText('Backbone');
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('2');
    await page.locator('#scorecard-status-number-wrong').click();
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('0');
    await page.getByRole('button', { name: 'Pokemon' }).click();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('2');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('1');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 66.67%');
    await expect(page.locator('div').filter({ hasText: 'Wrong answer! Backbone is a' })).toBeVisible();
    await expect(page.locator('#answer-status-text')).toContainText('Wrong answer! Backbone is a framework.');
    await page.getByRole('button', { name: 'NEXT >>>' }).click();
    await expect(page.locator('#name-sign-text')).toContainText('Charmander');
    await expect(page.getByText('2', { exact: true })).toBeVisible();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('2');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('1');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 66.67%');
    await page.getByRole('button', { name: 'Framework' }).click();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('2');
    await page.locator('#scorecard-status-number-wrong').click();
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('2');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 50.00%');
    await expect(page.locator('#answer-status-text')).toContainText('Wrong answer! Charmander is a Pokemon.');
    await expect(page.getByRole('button', { name: 'NEXT >>>' })).toBeVisible();
    await page.getByRole('button', { name: 'NEXT >>>' }).click();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('2');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('2');
    await page.getByRole('button', { name: 'Framework' }).click();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('3');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('2');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 60.00%');
    await expect(page.locator('#answer-status-text')).toContainText('Correct! Handlebars is a framework.');
    await page.getByRole('button', { name: 'NEXT >>>' }).click();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('3');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('2');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 60.00%');
    await page.getByRole('button', { name: 'Pokemon' }).click();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('4');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('2');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 66.67%');
    await expect(page.locator('#answer-status-text')).toContainText('Correct! Charmeleon is a Pokemon.');
    await page.getByRole('button', { name: 'NEXT >>>' }).click();
    await expect(page.locator('#name-sign-text')).toContainText('Angular');
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('4');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('2');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 66.67%');
    await page.getByRole('button', { name: 'Framework' }).click();
    await expect(page.getByText('5', { exact: true })).toBeVisible();
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('5');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('2');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 71.43%');
    await expect(page.locator('#answer-status-text')).toContainText('Correct! Angular is a framework.');
  });
});