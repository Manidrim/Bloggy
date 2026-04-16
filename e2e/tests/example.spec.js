// @ts-check
const { test, expect } = require('@playwright/test');

test('homepage', async ({ page }) => {
  await page.goto('https://localhost/');
  await expect(page).toHaveTitle('Welcome to API Platform!');
});

test('swagger', async ({ page }) => {
  await page.goto('https://localhost/docs');
  await expect(page).toHaveTitle('Hello API Platform - API Platform');
  await expect(page.locator('.operation-tag-content > span')).toHaveCount(5);
});

test('admin', async ({ page, browserName }) => {
  await page.goto('https://localhost/admin');
  // Wait for the admin app to mount
  await expect(page.getByLabel('Create')).toBeVisible();

  // Create a new greeting
  await page.getByLabel('Create').click();
  await expect(page).toHaveURL(/admin\/?#\/greetings\/create/);
  await page.getByLabel('Name').fill('foo' + browserName);
  await page.getByLabel('Save').click();

  // Navigate explicitly to the list (react-admin's post-save redirect varies by version)
  await page.goto('https://localhost/admin/#/greetings');
  await expect(page.getByText('foo' + browserName).first()).toBeVisible();
  await page.getByText('foo' + browserName).first().click();

  // Should now be on edit or show view of the created record
  await expect(page).toHaveURL(/admin\/?#\/greetings\/[^/]+/);

  // Edit may already be the current view; if there is an Edit link/button, click it
  const editButton = page.getByLabel('Edit').first();
  if (await editButton.isVisible().catch(() => false)) {
    await editButton.click();
  }

  await page.getByLabel('Name').fill('bar' + browserName);
  await page.getByLabel('Save').click();

  await page.goto('https://localhost/admin/#/greetings');
  await expect(page.getByText('bar' + browserName).first()).toBeVisible();
});
