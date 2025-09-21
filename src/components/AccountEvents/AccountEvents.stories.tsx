import type { Meta, StoryObj } from "@storybook/nextjs";
import { AccountEvents } from "./AccountEvents";
import { decorators } from "../../../.storybook/previews";

const meta = {
  title: "Components/AccountEvents",
  component: AccountEvents,
  decorators: decorators,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AccountEvents>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleUser = {
  id: "user-1",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
};

const sampleFutureEvents = [
  {
    id: "event-1",
    name: "Photography Workshop: Street Photography",
    startDateTime: "2024-03-15T14:00:00",
    endDateTime: "2024-03-15T17:00:00",
    location: "Manchester City Centre",
    imageSrc: "./people.jpg",
    tags: ["Photography", "Workshop"],
    price: 25,
    registrationDate: "2024-02-20T10:00:00",
    registrationStatus: "confirmed" as const,
    communityName: "Local Photography Club",
  },
  {
    id: "event-2",
    name: "Tech Talk: AI in Web Development",
    startDateTime: "2024-03-20T18:30:00",
    endDateTime: "2024-03-20T20:30:00",
    location: "Tech Hub Manchester",
    imageSrc: "./people.jpg",
    tags: ["Technology", "AI"],
    registrationDate: "2024-02-25T16:00:00",
    registrationStatus: "confirmed" as const,
    communityName: "Tech Meetup Manchester",
  },
  {
    id: "event-3",
    name: "Peak District Hike",
    startDateTime: "2024-03-22T09:00:00",
    endDateTime: "2024-03-22T16:00:00",
    location: "Peak District National Park",
    imageSrc: "./people.jpg",
    tags: ["Hiking", "Nature"],
    registrationDate: "2024-03-01T12:00:00",
    registrationStatus: "waitlist" as const,
    communityName: "Hiking Adventures",
  },
  {
    id: "event-4",
    name: "Book Launch: Local Authors",
    startDateTime: "2024-03-25T19:00:00",
    endDateTime: "2024-03-25T21:00:00",
    location: "Central Library",
    imageSrc: "./people.jpg",
    tags: ["Books", "Authors", "Launch"],
    registrationDate: "2024-03-02T14:00:00",
    registrationStatus: "confirmed" as const,
    communityName: "Manchester Book Club",
  },
  {
    id: "event-5",
    name: "Running Club Social",
    startDateTime: "2024-03-28T18:00:00",
    endDateTime: "2024-03-28T20:00:00",
    location: "Heaton Park",
    imageSrc: "./people.jpg",
    tags: ["Running", "Social", "Fitness"],
    registrationDate: "2024-03-05T11:00:00",
    registrationStatus: "cancelled" as const,
    communityName: "Weekend Runners",
  },
];

const samplePastEvents = [
  {
    id: "event-6",
    name: "Book Discussion: 1984",
    startDateTime: "2024-02-10T19:00:00",
    endDateTime: "2024-02-10T21:00:00",
    location: "Central Library",
    imageSrc: "./people.jpg",
    tags: ["Books", "Discussion"],
    registrationDate: "2024-01-15T14:00:00",
    registrationStatus: "confirmed" as const,
    communityName: "Manchester Book Club",
  },
  {
    id: "event-7",
    name: "Night Photography Meetup",
    startDateTime: "2024-02-05T20:00:00",
    endDateTime: "2024-02-05T23:00:00",
    location: "Manchester Canals",
    imageSrc: "./people.jpg",
    tags: ["Photography", "Night"],
    registrationDate: "2024-01-20T09:00:00",
    registrationStatus: "confirmed" as const,
    communityName: "Local Photography Club",
  },
  {
    id: "event-8",
    name: "New Year 5K Run",
    startDateTime: "2024-01-01T10:00:00",
    endDateTime: "2024-01-01T11:00:00",
    location: "Manchester City Centre",
    imageSrc: "./people.jpg",
    tags: ["Running", "New Year", "Charity"],
    registrationDate: "2023-12-15T16:00:00",
    registrationStatus: "confirmed" as const,
    communityName: "Weekend Runners",
  },
  {
    id: "event-9",
    name: "JavaScript Fundamentals Workshop",
    startDateTime: "2024-01-25T18:00:00",
    endDateTime: "2024-01-25T21:00:00",
    location: "Tech Hub Manchester",
    imageSrc: "./people.jpg",
    tags: ["JavaScript", "Workshop", "Learning"],
    price: 15,
    registrationDate: "2024-01-10T13:00:00",
    registrationStatus: "confirmed" as const,
    communityName: "Tech Meetup Manchester",
  },
];

export const Desktop: Story = {
  args: {
    user: sampleUser,
    futureEvents: sampleFutureEvents,
    pastEvents: samplePastEvents,
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const Mobile: Story = {
  args: {
    user: sampleUser,
    futureEvents: sampleFutureEvents,
    pastEvents: samplePastEvents,
  },
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

export const EmptyFutureEvents: Story = {
  args: {
    user: sampleUser,
    futureEvents: [],
    pastEvents: samplePastEvents,
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const EmptyPastEvents: Story = {
  args: {
    user: sampleUser,
    futureEvents: sampleFutureEvents,
    pastEvents: [],
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const AllEmpty: Story = {
  args: {
    user: sampleUser,
    futureEvents: [],
    pastEvents: [],
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const MobileEmpty: Story = {
  args: {
    user: sampleUser,
    futureEvents: [],
    pastEvents: [],
  },
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

export const VariousStatuses: Story = {
  args: {
    user: sampleUser,
    futureEvents: [
      {
        ...sampleFutureEvents[0],
        registrationStatus: "confirmed" as const,
      },
      {
        ...sampleFutureEvents[1],
        registrationStatus: "waitlist" as const,
      },
      {
        ...sampleFutureEvents[2],
        registrationStatus: "cancelled" as const,
      },
    ],
    pastEvents: samplePastEvents.slice(0, 2),
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
