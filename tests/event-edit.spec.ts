import { test, expect } from "@playwright/test";
import { authenticateUser } from "./auth-setup";
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
  name: `Test Community ${randomUUID()}`,
  email: "test@example.com",
  description: "A test community for event editing testing",
  location: "Manchester, UK",
  website: "https://testcommunity.com",
  established: "2024-01-01",
  type: "Private - Requires approval"
};

const originalEventData: EventData = {
  title: "Original Test Event",
  description: "This is the original description for the test event",
  start: getFutureDate(1),
  finish: getFutureDate(2),
  location: "Original Test Location",
  pricingType: "paid",
  price: 25.50,
  capacity: 50,
  tags: ["original", "test", "event"]
};

const updatedEventData: EventData = {
  title: "Updated Test Event",
  description: "This is the updated description for the test event with more details",
  start: getFutureDate(3),
  finish: getFutureDate(4),
  location: "Updated Test Location",
  pricingType: "free",
  price: undefined,
  capacity: 100,
  tags: ["updated", "new", "event", "modified"]
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

  await page.getByTestId('event-title-input').fill(originalEventData.title);
  await page.getByTestId('event-description-input').fill(originalEventData.description);
  await page.getByTestId('event-start-input').fill(originalEventData.start);
  await page.getByTestId('event-finish-input').fill(originalEventData.finish);
  await page.getByTestId('event-location-input').fill(originalEventData.location);
  
  // Add tags
  for (const tag of originalEventData.tags) {
    await page.getByTestId('event-tags-input').fill(tag);
    await page.keyboard.press('Enter');
  }
  
  // Set pricing type
  await page.getByTestId('pricing-paid-tab').click();
  await page.getByTestId('event-price-input').fill(originalEventData.price!.toString());
  await page.getByTestId('event-capacity-input').fill(originalEventData.capacity!.toString());

  await page.getByTestId('event-submit-button').click();
  
  // Wait for redirect to event page
  await page.waitForURL(/\/communities\/[0-9-]+\/events\/[0-9-]+/);
  
  // Extract event ID from URL
  const eventUrl = page.url();
  const eventId = eventUrl.split('/').pop();
  
  return { communityId, eventId };
}

async function navigateToEventEdit(page: any, communityId: string, eventId: string) {
  // Navigate to event page
  await page.goto(`/communities/${communityId}/events/${eventId}`);
  
  // Click "Manage Event" button
  await page.getByRole('button', { name: 'Manage Event' }).click();
  
  // Wait for edit form to load
  await page.waitForSelector('[data-testid="event-title-input"]');
}

async function verifyEventData(page: any, eventData: EventData) {
  // Verify title
  await expect(page.getByTestId('event-title-input')).toHaveValue(eventData.title);
  
  // Verify description
  await expect(page.getByTestId('event-description-input')).toHaveValue(eventData.description);
  
  // Verify start date
  await expect(page.getByTestId('event-start-input')).toHaveValue(eventData.start);
  
  // Verify finish date
  await expect(page.getByTestId('event-finish-input')).toHaveValue(eventData.finish);
  
  // Verify location
  await expect(page.getByTestId('event-location-input')).toHaveValue(eventData.location);
  
  // Verify capacity
  await expect(page.getByTestId('event-capacity-input')).toHaveValue(eventData.capacity!.toString());
  
  // Verify pricing type
  if (eventData.pricingType === "free") {
    await expect(page.getByTestId('pricing-free-tab')).toHaveAttribute('data-active', 'true');
  } else if (eventData.pricingType === "paid") {
    await expect(page.getByTestId('pricing-paid-tab')).toHaveAttribute('data-active', 'true');
    if (eventData.price) {
      await expect(page.getByTestId('event-price-input')).toHaveValue("£" + eventData.price.toString());
    }
  } else if (eventData.pricingType === "pay-what-you-can") {
    await expect(page.getByTestId('pricing-pay-what-you-can-tab')).toHaveAttribute('data-active', 'true');
  }
  
  // Verify tags are displayed as individual elements
  for (const tag of eventData.tags) {
    await expect(page.getByText(tag).first()).toBeVisible();
  }
}

async function updateEventData(page: any, eventData: EventData) {
  await page.getByTestId('event-title-input').fill(eventData.title);
  
  await page.getByTestId('event-description-input').fill(eventData.description);
  
  await page.getByTestId('event-start-input').fill(eventData.start);
  
  await page.getByTestId('event-finish-input').fill(eventData.finish);
  
  await page.getByTestId('event-location-input').fill(eventData.location);
  
  // Clear existing tags and add new ones
  const tagsInput = page.getByTestId('event-tags-input');
  await tagsInput.click();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  
  for (const tag of eventData.tags) {
    await tagsInput.fill(tag);
    await page.keyboard.press('Enter');
  }
  
  // Update pricing type
  if (eventData.pricingType === "free") {
    await page.getByTestId('pricing-free-tab').click();
  } else if (eventData.pricingType === "paid") {
    await page.getByTestId('pricing-paid-tab').click();
    if (eventData.price) {
      await page.getByTestId('event-price-input').fill(eventData.price.toString());
    }
  } else if (eventData.pricingType === "pay-what-you-can") {
    await page.getByTestId('pricing-pay-what-you-can-tab').click();
  }
  
  // Update capacity
  await page.getByTestId('event-capacity-input').fill(eventData.capacity!.toString());
}

async function verifyEventDisplayData(page: any, eventData: EventData) {
  // Verify title is displayed
  await expect(page.getByRole('heading', { name: eventData.title })).toBeVisible();
  
  // Verify description is displayed
  await expect(page.getByText(eventData.description).first()).toBeVisible();
  
  // Verify location is displayed
  await expect(page.getByText(eventData.location).first()).toBeVisible();
  
  // Verify capacity is displayed
  await expect(page.getByText(eventData.capacity!.toString()).first()).toBeVisible();
  
  // Verify pricing is displayed correctly
  if (eventData.pricingType === "free") {
    await expect(page.getByText('Free').first()).toBeVisible();
  } else if (eventData.pricingType === "paid" && eventData.price) {
    await expect(page.getByText('£' + eventData.price.toString()).first()).toBeVisible();
  } else if (eventData.pricingType === "pay-what-you-can") {
    await expect(page.getByText('Pay What You Can').first()).toBeVisible();
  }
  
  // Verify tags are displayed
  for (const tag of eventData.tags) {
    await expect(page.getByText(tag).first()).toBeVisible();
  }
}

test.describe("Event Edit", () => {
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

  test("should create, edit, and verify event changes in complete flow", async ({ page }) => {
    // Step 1: Navigate to the created event page
    await page.goto(`/communities/${communityId}/events/${eventId}`);
    
    // Step 2: Verify original event data is displayed correctly
    await expect(page.getByRole('heading', { name: originalEventData.title })).toBeVisible();
    await expect(page.getByText(originalEventData.description).first()).toBeVisible();
    await expect(page.getByText(originalEventData.location).first()).toBeVisible();
    await expect(page.getByText('£' + originalEventData.price!.toString()).first()).toBeVisible();
    await expect(page.getByText(originalEventData.capacity!.toString()).first()).toBeVisible();
    
    // Verify original tags are displayed
    for (const tag of originalEventData.tags) {
      await expect(page.getByText(tag).first()).toBeVisible();
    }
    
    // Step 3: Click "Manage Event" button to navigate to edit form
    await page.getByRole('button', { name: 'Manage Event' }).click();
    
    // Step 4: Wait for edit form to load and verify original data is in form
    await page.waitForSelector('[data-testid="event-title-input"]');
    await verifyEventData(page, originalEventData);
    
    // Step 5: Update all event fields
    await updateEventData(page, updatedEventData);
    
    // Step 6: Submit the form to save changes
    await page.getByTestId('event-submit-button').click();
    
    // Step 7: Wait for redirect back to event page and verify updated data
    await page.waitForURL(`/communities/${communityId}/events/${eventId}`);
    await verifyEventDisplayData(page, updatedEventData);
    
    // Step 8: Navigate back to edit form to make more changes
    await page.getByRole('button', { name: 'Manage Event' }).click();
    await page.waitForSelector('[data-testid="event-title-input"]');
    
    // Step 9: Change pricing from free to pay-what-you-can
    const payWhatYouCanEventData = { 
      ...updatedEventData, 
      pricingType: "pay-what-you-can" as const 
    };
    await updateEventData(page, payWhatYouCanEventData);
    await page.getByTestId('event-submit-button').click();
    await page.waitForURL(`/communities/${communityId}/events/${eventId}`);
    await verifyEventDisplayData(page, payWhatYouCanEventData);
    
    // Step 10: Navigate back to edit form again
    await page.getByRole('button', { name: 'Manage Event' }).click();
    await page.waitForSelector('[data-testid="event-title-input"]');
    
    // Step 11: Change to paid pricing with new price
    const paidEventData = { 
      ...updatedEventData, 
      pricingType: "paid" as const, 
      price: 15.99 
    };
    await updateEventData(page, paidEventData);
    await page.getByTestId('event-submit-button').click();
    await page.waitForURL(`/communities/${communityId}/events/${eventId}`);
    await verifyEventDisplayData(page, paidEventData);
    
    // Step 12: Navigate back to edit form for final test
    await page.getByRole('button', { name: 'Manage Event' }).click();
    await page.waitForSelector('[data-testid="event-title-input"]');
    
    // Step 13: Test cancel functionality - make a change but don't save
    await page.getByTestId('event-title-input').fill("This Change Should Not Be Saved");
    await page.getByTestId('event-cancel-button').click();
    
    // Step 14: Verify we're back on event page and changes weren't saved
    await page.waitForURL(`/communities/${communityId}/events/${eventId}`);
    await expect(page.getByRole('heading', { name: "This Change Should Not Be Saved" })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: paidEventData.title })).toBeVisible();
  });
});
