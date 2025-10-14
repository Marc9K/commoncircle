import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";
import { authenticateUser } from "../../auth-setup";

async function logoutUser(page: any) {
    await page.goto("/account");
    await page.getByTestId('settings-tab').first().click();
    await page.getByTestId('sign-out-button').first().click();
    await page.waitForURL("/");
}

test.describe("Community - Updating", () => {
  test.describe.configure({ mode: 'serial' });
  let communityId: string;

  test("should allow user to create community, accept pending members, and promote to manager", async ({ page }) => {
    page.setDefaultTimeout(150000);
    await authenticateUser(page, 1);
    
    await page.goto("/communities/new");
    await page.waitForSelector('[data-testid="community-name-input"]');

    const communityName = `Test Community ${randomUUID()}`;
    await page.getByTestId('community-name-input').first().fill(communityName);
    await page.getByTestId('community-email-input').first().fill("test@example.com");
    await page.getByTestId('community-description-input').first().fill("A test community for updating functionality");
    await page.getByTestId('community-location-input').first().fill("Manchester, UK");
    
    await page.getByTestId('community-type-select').first().focus();
    await page.keyboard.press("Space");
    await page.waitForSelector('[role="option"]:has-text("Private - Requires approval")');
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.getByTestId('save-button').first().click();
    
    await expect(page).not.toHaveURL("/communities/new");
    await expect(page).toHaveURL(/\/communities\/[a-zA-Z0-9-]+/);
    const url = page.url();
    communityId = url.split('/').pop()!;
    
    console.log(`Created community with ID: ${communityId}`);

    await logoutUser(page);
    await authenticateUser(page, 2);

    await page.goto(`/communities/${communityId}`);
    await page.waitForSelector('[data-testid="join-community-button"]');

    await page.getByTestId('join-community-button').first().click();
    
    await expect(page.getByTestId('join-request-pending-button').first()).toBeVisible();

    await logoutUser(page);
    await authenticateUser(page, 1);

    await page.goto(`/communities/${communityId}`);
    await page.getByTestId('manage-community-button').first().click();
    // await page.goto(`/communities/${communityId}/manage`);
    // await page.waitForTimeout(50000);
    await page.getByTestId('community-members-tab').waitFor({ state: 'visible', timeout: 100000 });
    await page.getByTestId('community-members-tab').first().click();
    await page.getByTestId('pending-members-section').waitFor({ state: 'visible', timeout: 100000 });

    await page.getByTestId('approve-member-button').first().click();
    await page.waitForTimeout(5000);
    await page.getByTestId('existing-members-tab').first().click();
    
    await expect(page.getByTestId('existing-members-section').first()).toBeVisible();
    await expect(page.getByTestId('member-email').first()).toContainText("test2@testing.org");

    await page.getByTestId('role-menu-button').first().waitFor({ state: 'visible', timeout: 100000 });
    await page.getByTestId('role-menu-button').first().click();
    await page.getByTestId('role-manager-option').first().click();
    await page.waitForTimeout(5000);
    await page.getByTestId('community-managers-tab').first().click();
    
    await expect(page.getByTestId('member-role')[1]).toContainText("Manager");

    await logoutUser(page);
    await authenticateUser(page, 2);

    await page.goto(`/communities/${communityId}`);
    await page.waitForSelector('[data-testid="manage-community-button"]');
    
    await page.getByTestId('manage-community-button').first().click();
    
    await expect(page).toHaveURL(`/communities/${communityId}/manage`);
    
    await expect(page.getByTestId('community-settings-tab').first()).toBeVisible();
    await expect(page.getByTestId('community-members-tab').first()).toBeVisible();
    await expect(page.getByTestId('community-managers-tab').first()).toBeVisible();
  });

  test("should handle role changes and permissions correctly", async ({ page }) => {
    await authenticateUser(page, 1);
    await page.goto(`/communities/${communityId}/manage`);
    await page.getByTestId("community-members-tab").first().waitFor({ state: 'visible' });

    await page.getByTestId('community-members-tab').first().click();
    await page.getByTestId('existing-members-tab').first().click();
    
    await page.getByTestId('role-menu-button').first().click();
    
    await page.getByTestId('role-event-creator-option').first().click();
    await expect(page.getByTestId('member-role').first()).toContainText("Event Creator");
    
    await page.getByTestId('role-menu-button').first().click();
    await page.getByTestId('role-door-person-option').first().click();
    await expect(page.getByTestId('member-role').first()).toContainText("Door Person");
    
    await page.getByTestId('role-menu-button').first().click();
    await page.getByTestId('role-member-option').first().click();
    await expect(page.getByTestId('member-role').first()).toContainText("Member");
  });

  test("should prevent non-managers from accessing management features", async ({ page }) => {
    await authenticateUser(page, 2);
    
    await page.goto(`/communities/${communityId}/manage`);
    
    await expect(page).not.toHaveURL(`/communities/${communityId}/manage`);
    
    await page.goto(`/communities/${communityId}`);
    await expect(page.getByTestId('manage-community-button').first()).not.toBeVisible();
  });

  test("should handle member removal correctly", async ({ page }) => {
    await authenticateUser(page, 1);
    await page.goto(`/communities/${communityId}/manage`);
    await page.waitForSelector('[data-testid="existing-members-section"]');

    await page.getByTestId('role-menu-button').first().click();
    
    await page.getByTestId('remove-member-option').first().click();
    
    await page.getByTestId('confirm-removal-button').first().click();
    
    await expect(page.getByTestId('member-email').first()).not.toContainText("test2@testing.org");
  });

  test("should handle community settings updates", async ({ page }) => {
    await authenticateUser(page, 1);
    await page.goto(`/communities/${communityId}/manage`);
    await page.waitForSelector('[data-testid="community-settings-tab"]');

    await page.getByTestId('community-settings-tab').first().click();
    
    await page.getByTestId('community-description-input').first().fill("Updated community description");
    
    await page.getByTestId('community-location-input').first().fill("London, UK");
    
    await page.getByTestId('save-settings-button').first().click();
    
    await expect(page.getByTestId('save-settings-button').first()).toBeVisible();
  });

  test("should handle multiple pending members correctly", async ({ page }) => {
    await authenticateUser(page, 1);
    await page.goto(`/communities/${communityId}/manage`);
    await page.waitForSelector('[data-testid="community-members-tab"]');

    await page.getByTestId('community-members-tab').first().click();
    await page.getByTestId('pending-members-tab').first().click();
    
    await expect(page.getByTestId('pending-members-section').first()).toBeVisible();
  });
});
