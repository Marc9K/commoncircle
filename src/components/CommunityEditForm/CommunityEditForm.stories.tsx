import type { Meta, StoryObj } from "@storybook/nextjs";
import { CommunityEditForm } from "./CommunityEditForm";
import { decorators } from "../../../.storybook/previews";
import { CommunityDetailData } from "@/components/CommunityDetail/CommunityDetail";

const meta: Meta<typeof CommunityEditForm> = {
  title: "Components/CommunityEditForm",
  component: CommunityEditForm,
  decorators: decorators,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockCommunity: CommunityDetailData = {
  id: "1",
  name: "Tech Manchester",
  description:
    "A vibrant community of tech enthusiasts in Manchester, organizing meetups, workshops, and networking events. We welcome developers, designers, entrepreneurs, and anyone passionate about technology.",
  memberCount: 1250,
  imageSrc: "/people.jpg",
  isMember: true,
  establishedDate: "2020-01-15",
  contactEmail: "hello@techmanchester.com",
  website: "https://techmanchester.com",
  location: "Manchester, UK",
  languages: ["English", "Spanish", "French"],
  public: "public",
  pastEvents: [],
  futureEvents: [],
};

const privateCommunity: CommunityDetailData = {
  ...mockCommunity,
  name: "Exclusive Tech Leaders",
  description:
    "An exclusive community for senior tech leaders and CTOs. Private discussions, executive roundtables, and strategic planning sessions.",
  public: "private",
  languages: ["English"],
  establishedDate: "2019-06-01",
  contactEmail: "admin@exclusive-tech.com",
  website: "https://exclusive-tech.com",
  location: "London, UK",
};

export const Default: Story = {
  args: {
    community: mockCommunity,
  },
};

export const PrivateCommunity: Story = {
  args: {
    community: privateCommunity,
  },
};

export const NewCommunity: Story = {
  args: {
    community: {
      id: "new",
      name: "",
      description: "",
      memberCount: 0,
      imageSrc: "",
      isMember: false,
      establishedDate: new Date().toISOString().split("T")[0],
      contactEmail: "",
      website: "",
      location: "",
      languagesSpoken: [],
      public: "public",
      pastEvents: [],
      futureEvents: [],
    },
  },
};
