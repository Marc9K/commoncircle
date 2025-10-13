import { test, expect } from "@playwright/test";
import { authenticateUser } from "./auth-setup";
import { randomUUID } from "crypto";

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

const getFutureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 16); // Format for datetime-local input
};

const testCommunity: CommunityData = {
  name: `Test Community for Event Deletion ${randomUUID()}`,
  email: "test@example.com",
  description: "A test community for event deletion testing",
  location: "Manchester, UK",
  website: "https://testcommunity.com",
  established: "2024-01-01",
  type: "Private - Requires approval"
};

const testEvent: EventData = {
  title: "Test Event for Deletion",
  description: "This is a test event that will be deleted to test deletion functionality",
  start: getFutureDate(1),
  finish: getFutureDate(2),
  location: "Test Event Location",
  pricingType: "free",
  capacity: 50,
  tags: ["test", "deletion", "event"]
};

async function createCommunityAndEvent(page: any) {
  await page.goto("/communities/new");
  await page.waitForSelector("form");

  await page.getByTestId('community-name-input').fill(testCommunity.name);
  await page.getByTestId('community-email-input').fill(testCommunity.email);
  await page.getByTestId('community-description-input').fill(testCommunity.description!);
  await page.getByTestId('community-location-input').fill(testCommunity.location!);
  await page.getByTestId('community-established-input').fill(testCommunity.established!);

  await page.getByTestId('save-button').click();
  
  await expect(page).not.toHaveURL("/communities/new");
  await expect(page).toHaveURL(/\/communities\/[0-9]+/);
  const communityUrl = page.url();
  const communityId = communityUrl.split('/').pop();
  
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

async function navigateToEventEdit(page: any, communityId: string, eventId: string) {
  await page.goto(`/communities/${communityId}/events/${eventId}`);
  
  await page.getByTestId('manage-event-button').first().click();
  
  await page.waitForSelector('[data-testid="event-title-input"]');
}

async function verifyEventExists(page: any, communityId: string, eventId: string, eventTitle: string) {
  await page.goto(`/communities/${communityId}/events/${eventId}`);
  
  await expect(page.getByRole('heading', { name: eventTitle })).toBeVisible();
  
  await expect(page.getByText(testEvent.description).first()).toBeVisible();
  
  await expect(page.getByText(testEvent.location).first()).toBeVisible();
}

async function verifyEventDeleted(page: any, communityId: string, eventId: string) {
  await page.goto(`/communities/${communityId}/events/${eventId}`);
  
  await expect(page.getByText('404').first()).toBeVisible();
  await expect(page.getByText('This page could not be found').first()).toBeVisible();
}


test("should create, verify existence, delete, and verify deletion of event", async ({ page }) => {
  
  page.setDefaultTimeout(15000);
  await authenticateUser(page);
  await page.waitForTimeout(2000); // Wait 2 seconds after login
  
  const result = await createCommunityAndEvent(page);
  const communityId = result.communityId;
  const eventId = result.eventId;
  
  await verifyEventExists(page, communityId, eventId, testEvent.title);
  
  await navigateToEventEdit(page, communityId, eventId);
  
  await expect(page.getByTestId('event-title-input')).toBeVisible();
  await expect(page.getByTestId('event-delete-button')).toBeVisible();
  
  await page.getByTestId('event-delete-button').first().click();
  
  await expect(page.getByText('This action cannot be undone').first()).toBeVisible();
  await expect(page.getByText('This will permanently delete the event and all associated data').first()).toBeVisible();
  await expect(page.getByText('Are you sure you want to delete this event? This action cannot be undone.').first()).toBeVisible();
  
  await page.getByTestId('event-cancel-delete-button').first().click();
  
  await expect(page.getByTestId('event-title-input')).toBeVisible();
  await expect(page.getByText('This action cannot be undone').first()).not.toBeVisible();
  
  await page.getByTestId('event-delete-button').first().click();
  
  await page.waitForSelector('text=This action cannot be undone');
  
  await page.getByTestId('confirm-delete-button').first().click();
  
  await page.waitForURL(`/communities/${communityId}`);
  
  await verifyEventDeleted(page, communityId, eventId);
});
