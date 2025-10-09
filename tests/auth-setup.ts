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
  await page.waitForSelector('[data-testid="email-login-form"]');

  await page.fill('[data-testid="email-input"]', getTestEmail(2));
  await page.fill('[data-testid="password-input"]', getTestPassword(2));

  await page.click('[data-testid="email-signin-button"]');

  await page.waitForURL("http://localhost:3000/communities");
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
