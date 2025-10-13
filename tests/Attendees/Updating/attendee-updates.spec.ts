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
}

// Generate future dates for testing
const getFutureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 16); // Format for datetime-local input
};

// Test data
const testCommunity: CommunityData = {
  name: `Test Community ${randomUUID()}`,
  email: "test@example.com",
  description: "A test community for attendee management testing",
  location: "Manchester, UK",
  website: "https://testcommunity.com",
  established: "2024-01-01",
  type: "Private - Requires approval"
};

const testEvent: EventData = {
  title: "Test Event for Attendee Management",
  description: "This is a test event for testing attendee management functionality",
  start: getFutureDate(1),
  finish: getFutureDate(2),
  location: "Test Location",
  pricingType: "paid",
  price: 25.50,
  capacity: 50
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
  // await page.getByTestId('community-website-input').fill(testCommunity.website!);
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
  
  // Set pricing type
  await page.getByTestId('pricing-paid-tab').click();
  await page.getByTestId('event-price-input').fill(testEvent.price!.toString());
  await page.getByTestId('event-capacity-input').fill(testEvent.capacity!.toString());

  await page.getByTestId('event-submit-button').click();
  
  // Wait for redirect to community page
  // await expect(page).toHaveURL(`/communities/${communityId}/events/40`);
  await page.waitForURL(/\/communities\/[0-9-]+\/events\/[0-9-]+/);
  
  // Extract event ID from URL
  const eventUrl = page.url();
  const eventId = eventUrl.split('/').pop();
  
  return { communityId, eventId };
}

async function navigateToAttendeesTab(page: any) {
  // Click on the Attendees tab
  await page.getByTestId('attendees-tab').click();
  await page.waitForSelector('[data-testid="add-attendee-button"]');
}

async function addAttendee(page: any, name: string, email: string) {
  // Click Add Attendee button
  await page.getByTestId('add-attendee-button').click();
  
  // Wait for modal to open
  await page.waitForSelector('[data-testid="attendee-name-input"]');
  
  // Fill in attendee details
  await page.getByTestId('attendee-name-input').fill(name);
  await page.getByTestId('attendee-email-input').fill(email);
  
  // Submit the form
  await page.getByTestId('add-attendee-submit-button').click();
  
  // Wait for modal to close
  await page.waitForSelector('[data-testid="add-attendee-button"]', { state: 'visible' });
}

test.describe("Attendee Updates", () => {
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
    await page.goto(`/communities/${communityId}/events/${eventId}`);
    await navigateToAttendeesTab(page);
  });

  test("should check in an attendee", async ({ page }) => {
    const attendeeName = `Test Attendee ${randomUUID()}`;
    const attendeeEmail = `testattendee${randomUUID()}@example.com`;

    await addAttendee(page, attendeeName, attendeeEmail);


    await expect(page.locator(`text=${attendeeName}`)).toBeVisible();


    const attendeeCard = page.locator(`text=${attendeeName}`).locator('..').locator('..').locator('..').locator('..');
    await attendeeCard.getByTestId(`check-in-button`).click();


    await expect(page.locator('text=Checked In')).toBeVisible();
    

    await expect(attendeeCard.getByTestId('check-in-button')).not.toBeVisible();
  });

  test("should uncheck in an attendee", async ({ page }) => {
    const attendeeName = `Test Attendee ${randomUUID()}`;
    const attendeeEmail = `testattendee${randomUUID()}@example.com`;

    await addAttendee(page, attendeeName, attendeeEmail);

    await expect(page.locator(`text=${attendeeName}`)).toBeVisible();

    const attendeeCard = page.locator(`text=${attendeeName}`).locator('..').locator('..').locator('..').locator('..');
    await attendeeCard.getByTestId('check-in-button').click();
    await expect(page.locator('text=Checked In')).toBeVisible();


    await attendeeCard.getByTestId('attendee-menu').click();
    
    await page.getByTestId('uncheck-in-menu-item').click();

    await expect(attendeeCard.locator('text=Checked In')).not.toBeVisible();
    
    await expect(attendeeCard.getByTestId('check-in-button')).toBeVisible();
  });

  test("should mark attendee as paid", async ({ page }) => {
    const attendeeName = `Test Attendee ${randomUUID()}`;
    const attendeeEmail = `testattendee${randomUUID()}@example.com`;

    await addAttendee(page, attendeeName, attendeeEmail);

    await expect(page.locator(`text=${attendeeName}`)).toBeVisible();

    const attendeeCard = page.locator(`text=${attendeeName}`).locator('..').locator('..').locator('..').locator('..');
    await attendeeCard.getByTestId('mark-paid-button').click();

    // await expect(page.locator('text=Paid')).toBeVisible();
    
    await expect(attendeeCard.getByTestId('mark-paid-button')).not.toBeVisible();
  });

  test("should refund a paid attendee", async ({ page }) => {
    const attendeeName = `Test Attendee ${randomUUID()}`;
    const attendeeEmail = `testattendee${randomUUID()}@example.com`;

    await addAttendee(page, attendeeName, attendeeEmail);

    await expect(page.locator(`text=${attendeeName}`)).toBeVisible();

    const attendeeCard = page.locator(`text=${attendeeName}`).locator('..').locator('..').locator('..').locator('..');
    await attendeeCard.getByTestId('mark-paid-button').click();
    
    await expect(attendeeCard.getByTestId('mark-paid-button')).not.toBeVisible();

    await attendeeCard.getByTestId('attendee-menu').click();
    
    await page.getByTestId('refund-menu-item').click();

    await expect(page.locator('text=Not paid')).toBeVisible();
    
    await expect(attendeeCard.getByTestId('mark-paid-button')).toBeVisible();
  });

  test("should cancel an attendee registration", async ({ page }) => {
    const attendeeName = `Test Attendee ${randomUUID()}`;
    const attendeeEmail = `testattendee${randomUUID()}@example.com`;

    await addAttendee(page, attendeeName, attendeeEmail);

    await expect(page.locator(`text=${attendeeName}`)).toBeVisible();

    const attendeeCard = page.locator(`text=${attendeeName}`).locator('..').locator('..').locator('..').locator('..');
    await attendeeCard.getByTestId('attendee-menu').click();
    
    await page.getByTestId('cancel-menu-item').click();

    await expect(page.locator(`text=${attendeeName}`)).not.toBeVisible();
  });
});
