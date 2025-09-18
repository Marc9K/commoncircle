import type { Meta, StoryObj } from "@storybook/nextjs";
import { Account } from "./Account";
import { decorators } from "../../.storybook/previews";

const meta = {
  title: "Components/Account",
  component: Account,
  decorators: decorators,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Account>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleUser = {
  id: "user-1",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
};

const sampleMemberCommunities = [
  {
    id: "1",
    name: "Local Photography Club",
    memberCount: 245,
    tags: ["Photography", "Art", "Workshops"],
    imageSrc: "./people.jpg",
    pastEvents: 12,
    futureEvents: 3,
    role: "member" as const,
  },
  {
    id: "2",
    name: "Tech Meetup Manchester",
    memberCount: 1200,
    tags: ["Technology", "Networking", "Career"],
    imageSrc: "./people.jpg",
    pastEvents: 24,
    futureEvents: 2,
    role: "member" as const,
  },
  {
    id: "3",
    name: "Hiking Adventures",
    memberCount: 89,
    tags: ["Hiking", "Nature", "Fitness"],
    imageSrc: "./people.jpg",
    pastEvents: 8,
    futureEvents: 4,
    role: "member" as const,
  },
];

const sampleRunningCommunities = [
  {
    id: "4",
    name: "Manchester Book Club",
    memberCount: 156,
    tags: ["Books", "Literature", "Discussion"],
    imageSrc: "./people.jpg",
    pastEvents: 18,
    futureEvents: 2,
    role: "owner" as const,
  },
];

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
];

const samplePastEvents = [
  {
    id: "event-4",
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
    id: "event-5",
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
];

export const Desktop: Story = {
  args: {
    user: sampleUser,
    memberCommunities: sampleMemberCommunities,
    runningCommunities: sampleRunningCommunities,
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
    memberCommunities: sampleMemberCommunities,
    runningCommunities: sampleRunningCommunities,
    futureEvents: sampleFutureEvents,
    pastEvents: samplePastEvents,
  },
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

// Empty states for testing
export const EmptyData: Story = {
  args: {
    user: sampleUser,
    memberCommunities: [],
    runningCommunities: [],
    futureEvents: [],
    pastEvents: [],
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
