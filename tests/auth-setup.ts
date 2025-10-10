import { Page } from "@playwright/test";
import path from "path";
import fs from "fs";

function getTestEmail(index: number) {
  return `test${index}@testing.org`;
}

function getTestPassword(index: number) {
  return `Password${index}`;
}


export async function authenticateUser(page: Page) {
  await page.goto("/auth/login");
  await page.waitForSelector('[data-testid="email-login-form"]', { timeout: 10000 });

  await page.getByTestId('email-input').fill(getTestEmail(2));
  await page.getByTestId('password-input').fill(getTestPassword(2));

  await page.getByTestId('email-signin-button').click();

  await page.waitForURL("http://localhost:3000/communities", { timeout: 15000 });
}

export async function setupAuthState(page: Page) {
  try {
    await authenticateUser(page);
    console.log("Authentication successful");
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
}
