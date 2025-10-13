import { test, expect } from "@playwright/test";
import { authenticateUser } from "../../auth-setup";

interface EventFormData {
  title?: string;
  description?: string;
  start?: string;
  finish?: string;
  location?: string;
  tags?: string[];
  price?: number;
  capacity?: number;
  pricingType?: "free" | "paid" | "pay-what-you-can";
}

const getFutureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 16); // Format for datetime-local input
};


const requiredFields: EventFormData[] = [
  {
    title: "Test Event",
    description: "This is a test event description that meets the minimum requirements",
    start: getFutureDate(1),
    finish: getFutureDate(2),
    location: "Test Location",
    pricingType: "free"
  }
];

const allFields: EventFormData[] = [
  {
    title: "Complete Test Event",
    description: "This is a comprehensive test event with all possible fields filled out for testing purposes",
    start: getFutureDate(1),
    finish: getFutureDate(2),
    location: "Manchester, UK",
    tags: ["technology", "networking", "workshop"],
    price: 25.50,
    capacity: 50,
    pricingType: "paid"
  },
  {
    title: "Free Community Event",
    description: "A free community event for everyone to enjoy and participate in various activities",
    start: getFutureDate(3),
    finish: getFutureDate(4),
    location: "Community Center, London",
    tags: ["community", "free", "family"],
    capacity: 100,
    pricingType: "free"
  },
  {
    title: "Pay What You Can Workshop",
    description: "An inclusive workshop where attendees can contribute what they can afford",
    start: getFutureDate(5),
    finish: getFutureDate(6),
    location: "Creative Hub, Birmingham",
    tags: ["workshop", "inclusive", "creative"],
    capacity: 30,
    pricingType: "pay-what-you-can"
  }
];

const incompleteFields: EventFormData[] = [
  {
    // Missing title
    description: "Event without title",
    start: getFutureDate(1),
    finish: getFutureDate(2),
    location: "Test Location",
    pricingType: "free"
  },
  {
    // Missing description
    title: "Event without description",
    start: getFutureDate(1),
    finish: getFutureDate(2),
    location: "Test Location",
    pricingType: "free"
  },
  {
    // Missing start date
    title: "Event without start",
    description: "Event missing start date",
    finish: getFutureDate(2),
    location: "Test Location",
    pricingType: "free"
  },
  {
    // Missing finish date
    title: "Event without finish",
    description: "Event missing finish date",
    start: getFutureDate(1),
    location: "Test Location",
    pricingType: "free"
  },
  {
    // Missing location
    title: "Event without location",
    description: "Event missing location",
    start: getFutureDate(1),
    finish: getFutureDate(2),
    pricingType: "free"
  },
  {
    // Invalid date range (finish before start)
    title: "Invalid Date Event",
    description: "Event with invalid date range",
    start: getFutureDate(2),
    finish: getFutureDate(1),
    location: "Test Location",
    pricingType: "free"
  }
];

test.describe("EventForm", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateUser(page);
    // Navigate to a community's new event page (assuming community ID 36 exists)
    await page.goto("/communities/36/events/new");
    await page.waitForSelector('[data-testid="event-title-input"]');
  });

  test("should not submit when required fields are missing", async ({ page }) => {
    await page.click('[data-testid="event-submit-button"]');
    
    await expect(page).toHaveURL(/\/communities\/36\/events\/new/);
  });

  test("should submit successfully with just required fields", async ({ page }) => {
    const testData = requiredFields[0];
    
    await page.getByTestId('event-title-input').fill(testData.title!);
    await page.getByTestId('event-description-input').fill(testData.description!);
    await page.getByTestId('event-start-input').fill(testData.start!);
    await page.getByTestId('event-finish-input').fill(testData.finish!);
    await page.getByTestId('event-location-input').fill(testData.location!);
    
    await page.getByTestId('pricing-free-tab').click();
    
    await page.getByTestId('event-submit-button').click();
    
    await expect(page).toHaveURL(/\/communities\/36/);
  });

  allFields.forEach((testData, index) => {
    test(`should submit successfully with all fields filled - scenario ${index + 1}`, async ({ page }) => {
      await page.getByTestId('event-title-input').fill(testData.title!);
      await page.getByTestId('event-description-input').fill(testData.description!);
      await page.getByTestId('event-start-input').fill(testData.start!);
      await page.getByTestId('event-finish-input').fill(testData.finish!);
      await page.getByTestId('event-location-input').fill(testData.location!);
      
      if (testData.tags) {
        for (const tag of testData.tags) {
          await page.getByTestId('event-tags-input').fill(tag);
          await page.keyboard.press('Enter');
        }
      }
      
      if (testData.pricingType === "paid") {
        await page.getByTestId('pricing-paid-tab').click();
        if (testData.price) {
          await page.getByTestId('event-price-input').fill(testData.price.toString());
        }
      } else if (testData.pricingType === "pay-what-you-can") {
        await page.getByTestId('pricing-pay-what-you-can-tab').click();
      } else {
        await page.getByTestId('pricing-free-tab').click();
      }
      
      if (testData.capacity) {
        await page.getByTestId('event-capacity-input').fill(testData.capacity.toString());
      }
      
      await page.getByTestId('event-submit-button').click();
      
      await expect(page).toHaveURL(/\/communities\/36/);
    });
  });

  incompleteFields.forEach((testData, index) => {
    test(`should not submit with incomplete fields - scenario ${index + 1}`, async ({ page }) => {
      if (testData.title) {
        await page.getByTestId('event-title-input').fill(testData.title);
      }
      if (testData.description) {
        await page.getByTestId('event-description-input').fill(testData.description);
      }
      if (testData.start) {
        await page.getByTestId('event-start-input').fill(testData.start);
      }
      if (testData.finish) {
        await page.getByTestId('event-finish-input').fill(testData.finish);
      }
      if (testData.location) {
        await page.getByTestId('event-location-input').fill(testData.location);
      }
      
      if (testData.pricingType) {
        if (testData.pricingType === "paid") {
          await page.getByTestId('pricing-paid-tab').click();
        } else if (testData.pricingType === "pay-what-you-can") {
          await page.getByTestId('pricing-pay-what-you-can-tab').click();
        } else {
          await page.getByTestId('pricing-free-tab').click();
        }
      }
      
      await page.getByTestId('event-submit-button').click();
      
      await expect(page).toHaveURL(/\/communities\/36\/events\/new/);
    });
  });

  test("should handle paid event pricing correctly", async ({ page }) => {
    const testData = {
      title: "Paid Event Test",
      description: "Testing paid event functionality with proper pricing",
      start: getFutureDate(1),
      finish: getFutureDate(2),
      location: "Test Location",
      price: 15.99,
      pricingType: "paid" as const
    };
    
    await page.getByTestId('event-title-input').fill(testData.title);
    await page.getByTestId('event-description-input').fill(testData.description);
    await page.getByTestId('event-start-input').fill(testData.start);
    await page.getByTestId('event-finish-input').fill(testData.finish);
    await page.getByTestId('event-location-input').fill(testData.location);
    
    await page.getByTestId('pricing-paid-tab').click();
    
    await expect(page.getByTestId('event-price-input')).toBeVisible();
    
    await page.getByTestId('event-price-input').fill(testData.price.toString());
    
    await page.getByTestId('event-submit-button').click();
    
    await expect(page).toHaveURL(/\/communities\/36/);
  });

  test("should handle pay-what-you-can pricing correctly", async ({ page }) => {
    const testData = {
      title: "Pay What You Can Event",
      description: "Testing pay what you can event functionality",
      start: getFutureDate(1),
      finish: getFutureDate(2),
      location: "Test Location",
      pricingType: "pay-what-you-can" as const
    };
    
    await page.getByTestId('event-title-input').fill(testData.title);
    await page.getByTestId('event-description-input').fill(testData.description);
    await page.getByTestId('event-start-input').fill(testData.start);
    await page.getByTestId('event-finish-input').fill(testData.finish);
    await page.getByTestId('event-location-input').fill(testData.location);
    
    await page.getByTestId('pricing-pay-what-you-can-tab').click();
    
    await expect(page.getByTestId('event-price-input')).not.toBeVisible();
    
    await page.getByTestId('event-submit-button').click();
    
    await expect(page).toHaveURL(/\/communities\/36/);
  });

  test("should handle tags input correctly", async ({ page }) => {
    const testData = {
      title: "Event with Tags",
      description: "Testing tags functionality in event creation",
      start: getFutureDate(1),
      finish: getFutureDate(2),
      location: "Test Location",
      tags: ["workshop", "technology", "networking"],
      pricingType: "free" as const
    };
    
    await page.getByTestId('event-title-input').fill(testData.title);
    await page.getByTestId('event-description-input').fill(testData.description);
    await page.getByTestId('event-start-input').fill(testData.start);
    await page.getByTestId('event-finish-input').fill(testData.finish);
    await page.getByTestId('event-location-input').fill(testData.location);
    
    for (const tag of testData.tags) {
      await page.getByTestId('event-tags-input').fill(tag);
      await page.keyboard.press('Enter');
    }
    
    await page.getByTestId('event-submit-button').click();
    
    await expect(page).toHaveURL(/\/communities\/36/);
  });

  test("should handle capacity input correctly", async ({ page }) => {
    const testData = {
      title: "Event with Capacity",
      description: "Testing capacity functionality in event creation",
      start: getFutureDate(1),
      finish: getFutureDate(2),
      location: "Test Location",
      capacity: 25,
      pricingType: "free" as const
    };
    
    await page.getByTestId('event-title-input').fill(testData.title);
    await page.getByTestId('event-description-input').fill(testData.description);
    await page.getByTestId('event-start-input').fill(testData.start);
    await page.getByTestId('event-finish-input').fill(testData.finish);
    await page.getByTestId('event-location-input').fill(testData.location);
    await page.getByTestId('event-capacity-input').fill(testData.capacity.toString());
    
    await page.getByTestId('event-submit-button').click();
    
    await expect(page).toHaveURL(/\/communities\/36/);
  });

  test("should cancel form submission", async ({ page }) => {
    await page.getByTestId('event-title-input').fill("Test Event");
    await page.getByTestId('event-description-input').fill("Test description");
    await page.getByTestId('event-start-input').fill(getFutureDate(1));
    await page.getByTestId('event-finish-input').fill(getFutureDate(2));
    await page.getByTestId('event-location-input').fill("Test Location");
    
    await page.getByTestId('event-cancel-button').click();
    
    await expect(page).toHaveURL(/\/communities\/36/);
  });
});
