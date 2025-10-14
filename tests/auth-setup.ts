import { Page } from "@playwright/test";

function getTestEmail(index: number) {
  return `test${index}@testing.org`;
}

function getTestPassword(index: number) {
  return `Password${index}`;
}


export async function authenticateUser(page: Page, userIndex: number = 2) {
  await page.goto(`http://localhost:3000/auth/login`);
  await page.waitForSelector('[data-testid="email-login-form"]', { timeout: 10000 });

  await page.getByTestId('email-input').fill(getTestEmail(userIndex));
  await page.getByTestId('password-input').fill(getTestPassword(userIndex));

  await page.getByTestId('email-signin-button').first().focus();
  await page.keyboard.press('Enter');

  await page.waitForURL("http://localhost:3000/communities", { timeout: 150000 });
}

export async function setupAuthState(page: Page, userIndex: number = 2) {
  try {
    await authenticateUser(page, userIndex);
    console.log("Authentication successful");
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
}
