import { expect, type Page } from "@playwright/test";

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

interface CheckScoreCardArgs {
  correct: number;
  wrong: number;
}

const checkScorecard = async (page: Page, args: CheckScoreCardArgs) => {
  const {
    correct,
    wrong
  } = args;


  await expect(page.locator('#scorecard-status-number-correct')).toContainText(correct.toString());
  await expect(page.locator('#scorecard-status-number-wrong')).toContainText(wrong.toString());
}

export {
  setMobileViewport,
  setTabletViewport,
  setDesktopViewport,
  checkNameSign,
  checkStaticElements,
  checkScorecard
}