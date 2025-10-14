import { test, expect } from "@playwright/test";
import { authenticateUser } from "../../auth-setup";
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

  await page.getByTestId('event-title-input').fill(originalEventData.title);
  await page.getByTestId('event-description-input').fill(originalEventData.description);
  await page.getByTestId('event-start-input').fill(originalEventData.start);
  await page.getByTestId('event-finish-input').fill(originalEventData.finish);
  await page.getByTestId('event-location-input').fill(originalEventData.location);
  
  for (const tag of originalEventData.tags) {
    await page.getByTestId('event-tags-input').fill(tag);
    await page.keyboard.press('Enter');
  }
  
  await page.getByTestId('pricing-paid-tab').click();
  await page.getByTestId('event-price-input').fill(originalEventData.price!.toString());
  await page.getByTestId('event-capacity-input').fill(originalEventData.capacity!.toString());

  await page.getByTestId('event-submit-button').click();
  
  await page.waitForURL(/\/communities\/[0-9-]+\/events\/[0-9-]+/);
  
  const eventUrl = page.url();
  const eventId = eventUrl.split('/').pop();
  
  return { communityId, eventId };
}

async function navigateToEventEdit(page: any, communityId: string, eventId: string) {
  await page.goto(`/communities/${communityId}/events/${eventId}`);
  
  await page.getByRole('button', { name: 'Manage Event' }).click();
  
  await page.waitForSelector('[data-testid="event-title-input"]');
}

async function verifyEventData(page: any, eventData: EventData) {
  await expect(page.getByTestId('event-title-input')).toHaveValue(eventData.title);
  
  await expect(page.getByTestId('event-description-input')).toHaveValue(eventData.description);
  
  await expect(page.getByTestId('event-start-input')).toHaveValue(eventData.start);
  
  await expect(page.getByTestId('event-finish-input')).toHaveValue(eventData.finish);
  
  await expect(page.getByTestId('event-location-input')).toHaveValue(eventData.location);
  
  await expect(page.getByTestId('event-capacity-input')).toHaveValue(eventData.capacity!.toString());
  
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
  
  const tagsInput = page.getByTestId('event-tags-input');
  await tagsInput.click();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  
  for (const tag of eventData.tags) {
    await tagsInput.fill(tag);
    await page.keyboard.press('Enter');
  }
  
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
  
  await page.getByTestId('event-capacity-input').fill(eventData.capacity!.toString());
}

async function verifyEventDisplayData(page: any, eventData: EventData) {
  await expect(page.getByRole('heading', { name: eventData.title })).toBeVisible();
  
  await expect(page.getByText(eventData.description).first()).toBeVisible();
  
  await expect(page.getByText(eventData.location).first()).toBeVisible();
  
  await expect(page.getByText(eventData.capacity!.toString()).first()).toBeVisible();
  
  if (eventData.pricingType === "free") {
    await expect(page.getByText('Free').first()).toBeVisible();
  } else if (eventData.pricingType === "paid" && eventData.price) {
    await expect(page.getByText('£' + eventData.price.toString()).first()).toBeVisible();
  } else if (eventData.pricingType === "pay-what-you-can") {
    await expect(page.getByText('Pay What You Can').first()).toBeVisible();
  }
  
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
    await page.goto(`/communities/${communityId}/events/${eventId}`);
    
    await expect(page.getByRole('heading', { name: originalEventData.title })).toBeVisible();
    await expect(page.getByText(originalEventData.description).first()).toBeVisible();
    await expect(page.getByText(originalEventData.location).first()).toBeVisible();
    await expect(page.getByText('£' + originalEventData.price!.toString()).first()).toBeVisible();
    await expect(page.getByText(originalEventData.capacity!.toString()).first()).toBeVisible();
    
    for (const tag of originalEventData.tags) {
      await expect(page.getByText(tag).first()).toBeVisible();
    }
    
    await page.getByRole('button', { name: 'Manage Event' }).click();
    
    await page.waitForSelector('[data-testid="event-title-input"]');
    await verifyEventData(page, originalEventData);
    
    await updateEventData(page, updatedEventData);
    
    await page.getByTestId('event-submit-button').click();
    
    await page.waitForURL(`/communities/${communityId}/events/${eventId}`);
    await verifyEventDisplayData(page, updatedEventData);
    
    await page.getByRole('button', { name: 'Manage Event' }).click();
    await page.getByTestId("event-title-input").waitFor({ state: 'visible' });
    
    const payWhatYouCanEventData = { 
      ...updatedEventData, 
      pricingType: "pay-what-you-can" as const 
    };
    await updateEventData(page, payWhatYouCanEventData);
    await page.getByTestId('event-submit-button').click();
    await page.waitForURL(`/communities/${communityId}/events/${eventId}`);
    await verifyEventDisplayData(page, payWhatYouCanEventData);
    
    await page.getByRole('button', { name: 'Manage Event' }).click();
    await page.waitForSelector('[data-testid="event-title-input"]');
    
    const paidEventData = { 
      ...updatedEventData, 
      pricingType: "paid" as const, 
      price: 15.99 
    };
    await updateEventData(page, paidEventData);
    await page.getByTestId('event-submit-button').click();
    await page.waitForURL(`/communities/${communityId}/events/${eventId}`);
    await verifyEventDisplayData(page, paidEventData);
    
    await page.getByRole('button', { name: 'Manage Event' }).click();
    await page.waitForSelector('[data-testid="event-title-input"]');
    
    await page.getByTestId('event-title-input').fill("This Change Should Not Be Saved");
    await page.getByTestId('event-cancel-button').click();
    
    await page.waitForURL(`/communities/${communityId}/events/${eventId}`);
    await expect(page.getByRole('heading', { name: "This Change Should Not Be Saved" })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: paidEventData.title })).toBeVisible();
  });
});
