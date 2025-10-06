import type { Meta, StoryObj } from "@storybook/nextjs";
import Page from "./page";
import { decorators } from "../../../../.storybook/previews";
import CommunityDetail, {
  CommunityDetailData,
} from "@/components/CommunityDetail/CommunityDetail";

const meta = {
  title: "Pages/CommunityDetail",
  component: Page,
  decorators: decorators,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

const communitySample: CommunityDetailData = {
  id: 1,
  name: "Tech Meetup Manchester",
  description:
    "A vibrant community of tech enthusiasts, developers, and entrepreneurs passionate about innovation and learning. We host regular meetups, workshops, and networking events to foster collaboration and knowledge sharing in the Manchester tech scene.",
  memberCount: 1234,
  picture: "./people.jpg",
  isMember: false,
  joinRequestPending: false,
  established: "2020-03-15",
  email: "contact@techmeetup-manchester.com",
  website: "https://techmeetup-manchester.com",
  location: "Manchester, UK",
  languages: ["English", "Spanish", "Mandarin", "French"],
  public: "public",
  pastEvents: [
    {
      id: 1,
      title: "JavaScript Fundamentals Workshop",
      start: new Date("2024-11-25T14:00:00Z").toISOString(),
      finish: new Date("2024-11-25T16:00:00Z").toISOString(),
      location: "Online",
      picture: "./people.jpg",
      tags: ["JavaScript", "Beginner", "Web Development"],
      price: undefined,
    },
  ],
  futureEvents: [
    {
      id: 2,
      title: "React Advanced Patterns Workshop",
      start: new Date("2024-12-15T10:00:00Z").toISOString(),
      finish: new Date("2024-12-15T14:00:00Z").toISOString(),
      location: "Manchester Tech Hub",
      picture: "./people.jpg",
      tags: ["React", "Advanced", "Frontend"],
      price: 75,
    },
    {
      id: 3,
      title: "Tech Conference 2024: Future of AI",
      start: new Date("2025-01-15T09:00:00Z").toISOString(),
      finish: new Date("2025-01-17T17:00:00Z").toISOString(),
      location: "Manchester Convention Center",
      picture: "./people.jpg",
      tags: ["AI", "Conference", "Machine Learning", "Innovation"],
      price: 299,
    },
  ],
};

const privateCommunity: CommunityDetailData = {
  ...communitySample,
  name: "Exclusive Tech Leaders Circle",
  public: "private",
  location: "London, UK",
  website: "https://techleaders-circle.com",
  description:
    "An exclusive community for senior tech leaders and executives. Members share strategic insights, discuss industry trends, and collaborate on high-level initiatives.",
  memberCount: 156,
};

const pendingRequestCommunity: CommunityDetailData = {
  ...privateCommunity,
  joinRequestPending: true,
};

export const PublicCommunity: Story = {
  render: () => <CommunityDetail community={communitySample} />,
};

export const PrivateCommunity: Story = {
  render: () => <CommunityDetail community={privateCommunity} />,
};

export const PendingRequest: Story = {
  render: () => <CommunityDetail community={pendingRequestCommunity} />,
};

export const MemberOfCommunity: Story = {
  render: () => (
    <CommunityDetail community={{ ...communitySample, isMember: true }} />
  ),
};

export const Mobile: Story = {
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
  render: () => <CommunityDetail community={communitySample} />,
};

export const ManagerView: Story = {
  render: () => (
    <CommunityDetail
      community={{ ...communitySample, currentUserRole: "manager" }}
    />
  ),
};
