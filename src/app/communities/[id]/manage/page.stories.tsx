import type { Meta, StoryObj } from "@storybook/react";
import CommunityManagePage from "./page";
import { CommunityManager } from "./page";
import { CommunityDetailData } from "../page";
import { decorators } from "../../../../../.storybook/previews";
import { PendingMember } from "@/components/PendingMembers/PendingMembers";
import { ExistingMember } from "@/components/ExistingMembers/ExistingMembers";

const meta: Meta<typeof CommunityManagePage> = {
  title: "Pages/CommunityManage",
  component: CommunityManagePage,
  decorators: decorators,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        pathname: "/communities/1/manage",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockCommunity: CommunityDetailData = {
  id: "1",
  name: "Tech Manchester",
  description:
    "A vibrant community of tech enthusiasts in Manchester, organizing meetups, workshops, and networking events.",
  memberCount: 1250,
  imageSrc: "/people.jpg",
  isMember: true,
  establishedDate: "2020-01-15",
  contactEmail: "hello@techmanchester.com",
  website: "https://techmanchester.com",
  location: "Manchester, UK",
  languagesSpoken: ["English", "Spanish", "French"],
  type: "public",
  pastEvents: [],
  futureEvents: [],
};

const mockManagers: CommunityManager[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@techmanchester.com",
    avatar: "/person.svg",
    role: "owner",
    joinedAt: "2020-01-15",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@techmanchester.com",
    avatar: "/person.svg",
    role: "manager",
    joinedAt: "2021-03-20",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@techmanchester.com",
    avatar: "/person.svg",
    role: "event_creator",
    joinedAt: "2022-06-10",
  },
];

const privateCommunity: CommunityDetailData = {
  ...mockCommunity,
  name: "Exclusive Tech Leaders",
  description: "An exclusive community for senior tech leaders and CTOs.",
  type: "private",
  languagesSpoken: ["English"],
  establishedDate: "2019-06-01",
  contactEmail: "admin@exclusive-tech.com",
  website: "https://exclusive-tech.com",
  location: "London, UK",
};

const pendingMembers: PendingMember[] = [
  {
    id: "4",
    name: "John Doe",
    email: "john@techmanchester.com",
    avatar: "/person.svg",
    requestedAt: "2020-01-15",
  },
];

const existingMembers: ExistingMember[] = [
  {
    id: "5",
    name: "Jane Doe",
    email: "jane@techmanchester.com",
    avatar: "/person.svg",
    joinedAt: "2020-01-15",
    role: "member",
    isActive: true,
  },
];

export const Default: Story = {
  args: {
    community: mockCommunity,
    managers: mockManagers,
    pendingMembers: pendingMembers,
    existingMembers: [],
  },
};

export const PrivateCommunity: Story = {
  args: {
    community: privateCommunity,
    managers: mockManagers,
    pendingMembers: pendingMembers,
    existingMembers: existingMembers,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/communities/2/manage",
      },
    },
  },
};

export const NewCommunity: Story = {
  args: {
    community: mockCommunity,
    managers: mockManagers,
    pendingMembers: pendingMembers,
    existingMembers: existingMembers,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/communities/new/manage",
      },
    },
  },
};
