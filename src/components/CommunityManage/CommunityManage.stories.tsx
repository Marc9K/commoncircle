import type { Meta, StoryObj } from "@storybook/nextjs";
import { CommunityManage } from "./CommunityManage";
import {
  CommunityManager,
  PendingMember,
  ExistingMember,
} from "./CommunityManage";
import { CommunityDetailData } from "@/components/CommunityDetail/CommunityDetail";
import { decorators } from "../../../.storybook/previews";

const meta: Meta<typeof CommunityManage> = {
  title: "Components/CommunityManage",
  component: CommunityManage,
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
    communityId: "1",
    currentUserRole: "owner",
  },
};

export const PrivateCommunity: Story = {
  args: {
    community: privateCommunity,
    managers: mockManagers,
    pendingMembers: pendingMembers,
    existingMembers: existingMembers,
    communityId: "2",
    currentUserRole: "owner",
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
    communityId: "new",
    currentUserRole: "owner",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/communities/new/manage",
      },
    },
  },
};

export const WithUndefinedProps: Story = {
  args: {
    community: undefined,
    managers: undefined,
    pendingMembers: undefined,
    existingMembers: undefined,
    communityId: undefined,
    currentUserRole: undefined,
  },
};
