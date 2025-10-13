import { test, expect } from "@playwright/test";
import { authenticateUser } from "../../auth-setup";
import { randomUUID } from "crypto";

// Test data configuration
interface CommunityData {
  name: string;
  email: string;
  description?: string;
  location?: string;
  website?: string;
  established?: string;
  type?: string;
}

interface EventData {
  title: string;
  description: string;
  start: string;
  finish: string;
  location: string;
  pricingType: "free" | "paid" | "pay-what-you-can";
  price?: number;
  capacity?: number;
  tags: string[];
}

// Generate future dates for testing
const getFutureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 16); // Format for datetime-local input
};

// Test data
const testCommunity: CommunityData = {
  name: `Test Community for Deletion ${randomUUID()}`,
  email: "test@example.com",
  description: "A test community that will be deleted to test deletion functionality",
  location: "Manchester, UK",
  website: "https://testcommunity.com",
  established: "2024-01-01",
  type: "Private - Requires approval"
};

const testEvent: EventData = {
  title: "Test Event for Deletion",
  description: "This is a test event that will be deleted along with the community",
  start: getFutureDate(1),
  finish: getFutureDate(2),
  location: "Test Event Location",
  pricingType: "free",
  capacity: 50,
  tags: ["test", "deletion", "event"]
};

// Helper functions
async function createCommunityAndEvent(page: any) {
  // Create community
  await page.goto("/communities/new");
  await page.waitForSelector("form");

  await page.getByTestId('community-name-input').fill(testCommunity.name);
  await page.getByTestId('community-email-input').fill(testCommunity.email);
  await page.getByTestId('community-description-input').fill(testCommunity.description!);
  await page.getByTestId('community-location-input').fill(testCommunity.location!);
  await page.getByTestId('community-established-input').fill(testCommunity.established!);

  await page.getByTestId('save-button').click();
  
  // Wait for redirect to community page and extract community ID
  await expect(page).not.toHaveURL("/communities/new");
  await expect(page).toHaveURL(/\/communities\/[0-9]+/);
  const communityUrl = page.url();
  const communityId = communityUrl.split('/').pop();
  
  // Create event
  await page.goto(`/communities/${communityId}/events/new`);
  await page.waitForSelector('[data-testid="event-title-input"]');

  await page.getByTestId('event-title-input').fill(testEvent.title);
  await page.getByTestId('event-description-input').fill(testEvent.description);
  await page.getByTestId('event-start-input').fill(testEvent.start);
  await page.getByTestId('event-finish-input').fill(testEvent.finish);
  await page.getByTestId('event-location-input').fill(testEvent.location);
  
  for (const tag of testEvent.tags) {
    await page.getByTestId('event-tags-input').fill(tag);
    await page.keyboard.press('Enter');
  }
  
  await page.getByTestId('pricing-free-tab').click();
  await page.getByTestId('event-capacity-input').fill(testEvent.capacity!.toString());

  await page.getByTestId('event-submit-button').click();
  
  await page.waitForURL(/\/communities\/[0-9-]+\/events\/[0-9-]+/);
  
  const eventUrl = page.url();
  const eventId = eventUrl.split('/').pop();
  
  return { communityId, eventId };
}

async function navigateToCommunitySettings(page: any, communityId: string) {
  await page.goto(`/communities/${communityId}/manage`);
  
  await page.waitForSelector('[role="tablist"]');
  
  await page.getByRole('tab', { name: 'Settings' }).click();
  
  await page.waitForSelector('text=Danger Zone');
}

async function verifyCommunityExists(page: any, communityId: string, communityName: string) {
  await page.goto(`/communities/${communityId}`);
  
  await expect(page.getByRole('heading', { name: communityName })).toBeVisible();
  
  await expect(page.getByText(testCommunity.description!).first()).toBeVisible();
}

async function verifyCommunityDeleted(page: any, communityId: string) {
  await page.goto(`/communities/${communityId}`);
  
  await expect(page.getByText('404').first()).toBeVisible();
  await expect(page.getByText('This page could not be found').first()).toBeVisible();
}

async function verifyEventDeleted(page: any, communityId: string, eventId: string) {
  await page.goto(`/communities/${communityId}/events/${eventId}`);
  
  await expect(page.getByText('404').first()).toBeVisible();
  await expect(page.getByText('This page could not be found').first()).toBeVisible();
}

async function performCommunityDeletion(page: any) {
  await page.getByRole('button', { name: 'Delete Community' }).click();
  
  await page.waitForSelector('text=This action cannot be undone');
  
  await page.getByPlaceholder('Type DELETE to confirm').fill('DELETE');
  
  await page.getByRole('button', { name: 'Delete Community' }).last().click();
  
  await page.waitForURL('/');
}

test.describe("Community Deletion", () => {
  let communityId: string;
  let eventId: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await authenticateUser(page);
    const result = await createCommunityAndEvent(page);
    communityId = result.communityId;
    eventId = result.eventId;
    
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await authenticateUser(page);
  });

  test("should create, verify existence, delete, and verify deletion of community", async ({ page }) => {
    await verifyCommunityExists(page, communityId, testCommunity.name);
    
    await navigateToCommunitySettings(page, communityId);
    
    await expect(page.getByText('Danger Zone').first()).toBeVisible();
    await expect(page.getByText('Delete Community').first()).toBeVisible();
    
    await performCommunityDeletion(page);
    
    await expect(page).toHaveURL('/');
    
    await verifyCommunityDeleted(page, communityId);
    
    await verifyEventDeleted(page, communityId, eventId);
  });

});
