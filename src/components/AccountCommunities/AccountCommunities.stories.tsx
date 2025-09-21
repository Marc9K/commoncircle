import type { Meta, StoryObj } from "@storybook/nextjs";
import { AccountCommunities } from "./AccountCommunities";
import { decorators } from "../../../.storybook/previews";

const meta = {
  title: "Components/AccountCommunities",
  component: AccountCommunities,
  decorators: decorators,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AccountCommunities>;

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
  {
    id: "4",
    name: "Creative Writing Circle",
    memberCount: 67,
    tags: ["Writing", "Literature", "Creativity"],
    imageSrc: "./people.jpg",
    pastEvents: 15,
    futureEvents: 1,
    role: "member" as const,
  },
];

const sampleRunningCommunities = [
  {
    id: "5",
    name: "Manchester Book Club",
    memberCount: 156,
    tags: ["Books", "Literature", "Discussion"],
    imageSrc: "./people.jpg",
    pastEvents: 18,
    futureEvents: 2,
    role: "owner" as const,
  },
  {
    id: "6",
    name: "Weekend Runners",
    memberCount: 234,
    tags: ["Running", "Fitness", "Health"],
    imageSrc: "./people.jpg",
    pastEvents: 32,
    futureEvents: 5,
    role: "admin" as const,
  },
];

export const Desktop: Story = {
  args: {
    user: sampleUser,
    memberCommunities: sampleMemberCommunities,
    runningCommunities: sampleRunningCommunities,
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
  },
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

export const EmptyMemberCommunities: Story = {
  args: {
    user: sampleUser,
    memberCommunities: [],
    runningCommunities: sampleRunningCommunities,
  },
};

export const EmptyRunningCommunities: Story = {
  args: {
    user: sampleUser,
    memberCommunities: sampleMemberCommunities,
    runningCommunities: [],
  },
};

export const AllEmpty: Story = {
  args: {
    user: sampleUser,
    memberCommunities: [],
    runningCommunities: [],
  },
};

export const MobileEmpty: Story = {
  args: {
    user: sampleUser,
    memberCommunities: [],
    runningCommunities: [],
  },
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};
