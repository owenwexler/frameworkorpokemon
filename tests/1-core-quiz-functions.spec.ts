import { test, expect } from '@playwright/test';
import { playRound } from './globalTestFunctions/globalTestFunctions';

test.describe('Core Quiz Functions', () => {
  test('all core quiz functions work, correct and incorrect guesses show the expected results and adjust the scores and percentage correct accordingly', async ({ page }) => {
    // these all need to be in one test because a page refresh would reset the quiz

    await page.goto('/');

    // first question: React, it is a framework, guess correctly
    await playRound(page, {
      name: 'React',
      expectedInitialScores: { correct: 0, wrong: 0 },
      guess: 'Framework',
      guessStatus: 'correct',
      correctType: 'framework',
      expectedNewScores: { correct: 1, wrong: 0},
      expectedNewPercentRight: '100.00%'
    });

    // question: Bulbasaur, it is a pokemon, guess correctly
    await playRound(page, {
      name: 'Bulbasaur',
      expectedInitialScores: { correct: 1, wrong: 0 },
      expectedInitialPercentRight: '100.00%',
      guess: 'Pokemon',
      guessStatus: 'correct',
      correctType: 'pokemon',
      expectedNewScores: { correct: 2, wrong: 0},
      expectedNewPercentRight: '100.00%'
    });

    // question: Backbone, it is a framework, guess incorrectly
    await playRound(page, {
      name: 'Backbone',
      expectedInitialScores: { correct: 2, wrong: 0 },
      expectedInitialPercentRight: '100.00%',
      guess: 'Pokemon',
      guessStatus: 'wrong',
      correctType: 'framework',
      expectedNewScores: { correct: 2, wrong: 1},
      expectedNewPercentRight: '66.67%'
    });

    // question: Charmander, it is a pokemon, guess incorrectly
    await playRound(page, {
      name: 'Charmander',
      expectedInitialScores: { correct: 2, wrong: 1 },
      expectedInitialPercentRight: '66.67%',
      guess: 'Framework',
      guessStatus: 'wrong',
      correctType: 'pokemon',
      expectedNewScores: { correct: 2, wrong: 2 },
      expectedNewPercentRight: '50.00%'
    });

    // question: Handlebars, it is a pokemon, guess correctly
    await playRound(page, {
      name: 'Handlebars',
      expectedInitialScores: { correct: 2, wrong: 2 },
      expectedInitialPercentRight: '50.00%',
      guess: 'Framework',
      guessStatus: 'correct',
      correctType: 'framework',
      expectedNewScores: { correct: 3, wrong: 2 },
      expectedNewPercentRight: '60.00%'
    });

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
    await expect(page.locator('#scorecard-status-number-correct')).toContainText('5');
    await expect(page.locator('#scorecard-status-number-wrong')).toContainText('2');
    await expect(page.locator('#percent-right-text')).toContainText('% right: 71.43%');
    await expect(page.locator('#answer-status-text')).toContainText('Correct! Angular is a framework.');
  });
});