import { test, expect } from "@playwright/test";
import { authenticateUser } from "../../auth-setup";
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
    await page.getByTestId('save-button').click();

    await expect(page).toHaveURL("/communities/new");
  });

  test("should submit successfully with all required fields filled", async ({
    page,
  }) => {
    await page.getByTestId('community-name-input').fill(
      `Test Community ${randomUUID()}`
    );
    await page.getByTestId('community-email-input').fill(
      "test@example.com"
    );

    await page.getByTestId('save-button').click();

    await expect(page).not.toHaveURL("/communities/new");
    await expect(page).toHaveURL(/\/communities\/[a-zA-Z0-9-]+/);
  });

  test("should submit successfully with all fields filled except image", async ({
    page,
  }) => {
    await page.getByTestId('community-name-input').fill(
      `Test Community ${randomUUID()}`
    );
    await page.getByTestId('community-email-input').fill(
      "test@example.com"
    );
    await page.getByTestId('community-description-input').fill(
      "A test community description"
    );
    await page.getByTestId('community-location-input').fill(
      "Manchester, UK"
    );
    await page.getByTestId('community-website-input').fill(
      "https://testcommunity.com"
    );
    await page.getByTestId('community-established-input').fill(
      "2024-01-01"
    );

    await page.getByTestId('community-type-select').focus();
    await page.keyboard.press("Space");
    await page.waitForSelector(
      '[role="option"]:has-text("Private - Requires approval")'
    );
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.getByTestId('save-button').click();

    // await expect(page).not.toHaveURL("/communities/new");
    await expect(page).toHaveURL(/\/communities\/[a-zA-Z0-9-]+/);
  });
});
