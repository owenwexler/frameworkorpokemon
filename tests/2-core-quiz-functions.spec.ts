import { test } from '@playwright/test';
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

    // question: Handlebars, it is a framework, guess correctly
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

    // question: Charmelon, it is a pokemon, guess correctly
    await playRound(page, {
      name: 'Charmeleon',
      expectedInitialScores: { correct: 3, wrong: 2 },
      expectedInitialPercentRight: '60.00%',
      guess: 'Pokemon',
      guessStatus: 'correct',
      correctType: 'pokemon',
      expectedNewScores: { correct: 4, wrong: 2 },
      expectedNewPercentRight: '66.67%'
    });

    // question: Angular, it is a framework, guess correctly
    await playRound(page, {
      name: 'Angular',
      expectedInitialScores: { correct: 4, wrong: 2 },
      expectedInitialPercentRight: '66.67%',
      guess: 'Framework',
      guessStatus: 'correct',
      correctType: 'framework',
      expectedNewScores: { correct: 5, wrong: 2 },
      expectedNewPercentRight: '71.43%'
    });
  });
});
