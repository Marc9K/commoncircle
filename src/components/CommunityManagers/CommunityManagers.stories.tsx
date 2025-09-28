import type { Meta, StoryObj } from "@storybook/nextjs";
import { CommunityManagers } from "./CommunityManagers";
import { CommunityManager } from "@/components/CommunityManage/CommunityManage";
import { decorators } from "../../../.storybook/previews";

const meta: Meta<typeof CommunityManagers> = {
  title: "Components/CommunityManagers",
  component: CommunityManagers,
  decorators: decorators,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

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
  {
    id: "4",
    name: "David Rodriguez",
    email: "david@techmanchester.com",
    avatar: "/person.svg",
    role: "door_person",
    joinedAt: "2023-01-15",
  },
];

const largeTeam: CommunityManager[] = [
  ...mockManagers,
  {
    id: "5",
    name: "Lisa Park",
    email: "lisa@techmanchester.com",
    avatar: "/person.svg",
    role: "event_creator",
    joinedAt: "2023-03-01",
  },
  {
    id: "6",
    name: "James Thompson",
    email: "james@techmanchester.com",
    avatar: "/person.svg",
    role: "door_person",
    joinedAt: "2023-05-15",
  },
  {
    id: "7",
    name: "Anna Kowalski",
    email: "anna@techmanchester.com",
    avatar: "/person.svg",
    role: "manager",
    joinedAt: "2023-07-20",
  },
];

export const AsOwner: Story = {
  args: {
    communityId: "1",
    managers: mockManagers,
    currentUserRole: "owner",
  },
};

export const AsManager: Story = {
  args: {
    communityId: "1",
    managers: mockManagers,
    currentUserRole: "manager",
  },
};

export const AsEventCreator: Story = {
  args: {
    communityId: "1",
    managers: mockManagers,
    currentUserRole: "event_creator",
  },
};

export const AsDoorPerson: Story = {
  args: {
    communityId: "1",
    managers: mockManagers,
    currentUserRole: "door_person",
  },
};

export const LargeTeam: Story = {
  args: {
    communityId: "1",
    managers: largeTeam,
    currentUserRole: "owner",
  },
};

export const EmptyTeam: Story = {
  args: {
    communityId: "1",
    managers: [],
    currentUserRole: "owner",
  },
};
