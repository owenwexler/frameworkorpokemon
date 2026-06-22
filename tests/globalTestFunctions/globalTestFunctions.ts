import { expect } from "@playwright/test";
import type { Page } from '@playwright/test';

const yellowBGColor = 'oklch(0.681 0.162 75.834)';
const greenBGColor =  'oklch(0.527 0.154 150.069)';
const redBGColor = 'oklch(0.505 0.213 27.518)';

const setMobileViewport = async (page: Page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  return;
}

const setTabletViewport = async (page: Page) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  return;
}

const setDesktopViewport = async (page: Page) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  return;
}

const checkNameSign = async (page: Page, args: { name: string }) => {
  const {
    name
  } = args;

  await expect(page.locator('#name-sign')).toBeVisible();
  await expect(page.locator('#name-sign')).toHaveCSS('background-color', yellowBGColor);
  await expect(page.locator('#name-sign-text')).toBeVisible();
  await expect(page.locator('#name-sign-text')).toContainText(name);
}

const checkStaticElements = async (page: Page) => {
  await expect(page.locator('#logo')).toBeVisible();
  await expect(page.locator('#fop-question')).toBeVisible();
  await expect(page.locator('#fop-question')).toContainText('Is this a programming framework or a Pokemon?');
  await expect(page.locator('#created-by-text')).toBeVisible();
  await expect(page.locator('#created-by-text')).toContainText('Created by Owen Wexler');
  await expect(page.locator('#btn-framework')).toBeVisible();
  await expect(page.locator('#btn-framework')).toContainText('Framework');
  await expect(page.locator('#btn-pokemon')).toBeVisible();
  await expect(page.locator('#btn-pokemon')).toContainText('Pokemon');
  await expect(page.locator('#scorecard-status-text-correct')).toBeVisible();
  await expect(page.locator('#scorecard-status-text-correct')).toContainText('Correct:');
  await expect(page.locator('#scorecard-status-text-wrong')).toBeVisible();
  await expect(page.locator('#scorecard-status-text-wrong')).toContainText('Wrong:');
}

interface Scores {
  correct: number;
  wrong: number;
}

const checkScorecard = async (page: Page, args: Scores) => {
  const {
    correct,
    wrong
  } = args;


  await expect(page.locator('#scorecard-status-number-correct')).toContainText(correct.toString());
  await expect(page.locator('#scorecard-status-number-wrong')).toContainText(wrong.toString());
}

interface CheckAnswerStatusCardArgs {
  status: 'correct' | 'wrong';
  name: string;
  type: 'framework' | 'pokemon';
}

const checkAnswerStatusCard = async (page: Page, args: CheckAnswerStatusCardArgs) => {
  const { status, name, type } = args;

  const answerStatusCard = page.locator('#answer-status-card');
  const colorCSS = status === 'correct' ? greenBGColor : redBGColor;
  await expect(answerStatusCard).toBeVisible();
  await expect(answerStatusCard).toHaveCSS('background-color', colorCSS);

  const text = `${status === 'correct' ? 'Correct!' : 'Wrong answer!'} ${name} is a ${type === 'pokemon' ? 'Pokemon.' : 'framework.'}`;
  await expect(page.locator('#answer-status-text')).toContainText(text);
}

const checkPercentRight = async (page: Page, percent: string) => {
  await expect(page.locator('#percent-right-text')).toContainText(`% right: ${percent}`);
}

const clickNext = async (page: Page) => {
  await page.getByRole('button', { name: 'NEXT >>>' }).click();
}

interface PlayRoundArgs {
  name: string;
  expectedInitialScores: Scores;
  expectedInitialPercentRight?: string;
  guess: 'Framework' | 'Pokemon';
  guessStatus: 'correct' | 'wrong'; // is the test making a correct or wrong guess
  correctType: 'framework' | 'pokemon';
  expectedNewScores: Scores;
  expectedNewPercentRight: string;
}

// the core test functions basically are repeating the steps in these functions 6 times so why not make it a function
const playRound = async (page: Page, args: PlayRoundArgs) => {
  const {
    name,
    expectedInitialScores,
    expectedInitialPercentRight,
    guess,
    guessStatus,
    correctType,
    expectedNewScores,
    expectedNewPercentRight,
  } = args;

  await checkNameSign(page, { name });
  await checkScorecard(page, expectedInitialScores);

  // the first question will not have an initial percent right so this is an optional field
  if (expectedInitialPercentRight) {
    await checkPercentRight(page, expectedInitialPercentRight);
  }

  await page.getByRole('button', { name: guess }).click();

  await checkScorecard(page, expectedNewScores);

  await checkPercentRight(page, expectedNewPercentRight);
  await checkAnswerStatusCard(page,
    {
      status: guessStatus,
      name,
      type: correctType
    }
  );

  await clickNext(page);
}

export {
  setMobileViewport,
  setTabletViewport,
  setDesktopViewport,
  checkNameSign,
  checkStaticElements,
  checkScorecard,
  checkAnswerStatusCard,
  checkPercentRight,
  clickNext,
  playRound
}
