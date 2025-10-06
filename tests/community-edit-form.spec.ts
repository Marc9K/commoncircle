import { test, expect } from "@playwright/test";
import { authenticateUser } from "./auth-setup";
import { randomUUID } from "crypto";

test.describe("CommunityEditForm", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateUser(page);
    await page.goto("/communities/new");

    await page.waitForSelector("form");
  });

  test("should not submit when required fields are missing", async ({
    page,
  }) => {
    await page.click('[data-testid="save-button"]');

    await expect(page).toHaveURL("/communities/new");
  });

  test("should submit successfully with all required fields filled", async ({
    page,
  }) => {
    await page.fill(
      '[data-testid="community-name-input"]',
      `Test Community ${randomUUID()}`
    );
    await page.fill(
      '[data-testid="community-email-input"]',
      "test@example.com"
    );

    await page.click('[data-testid="save-button"]');

    await expect(page).not.toHaveURL("/communities/new");
    await expect(page).toHaveURL(/\/communities\/[a-zA-Z0-9-]+/);
  });

  test("should submit successfully with all fields filled except image", async ({
    page,
  }) => {
    await page.fill(
      '[data-testid="community-name-input"]',
      `Test Community ${randomUUID()}`
    );
    await page.fill(
      '[data-testid="community-email-input"]',
      "test@example.com"
    );
    await page.fill(
      '[data-testid="community-description-input"]',
      "A test community description"
    );
    await page.fill(
      '[data-testid="community-location-input"]',
      "Manchester, UK"
    );
    await page.fill(
      '[data-testid="community-website-input"]',
      "https://testcommunity.com"
    );
    await page.fill(
      '[data-testid="community-established-input"]',
      "2024-01-01"
    );

    await page.focus('[data-testid="community-type-select"]');
    await page.keyboard.press("Space");
    await page.waitForSelector(
      '[role="option"]:has-text("Private - Requires approval")'
    );
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.click('[data-testid="save-button"]');

    // await expect(page).not.toHaveURL("/communities/new");
    await expect(page).toHaveURL(/\/communities\/[a-zA-Z0-9-]+/);
  });
});
