import type { Meta, StoryObj } from "@storybook/nextjs";
import Page, { CommunityDetail, CommunityDetailData } from "./page";
import { decorators } from "../../../../.storybook/previews";

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
  description: "A vibrant community of tech enthusiasts, developers, and entrepreneurs passionate about innovation and learning. We host regular meetups, workshops, and networking events to foster collaboration and knowledge sharing in the Manchester tech scene.",
  memberCount: 1234,
  imageSrc: "/people.jpg",
  isMember: false,
  joinRequestPending: false,
  establishedDate: "2020-03-15",
  contactEmail: "contact@techmeetup-manchester.com",
  website: "https://techmeetup-manchester.com",
  location: "Manchester, UK",
  languagesSpoken: ["English", "Spanish", "Mandarin", "French"],
  type: "public",
  pastEvents: [
    {
      id: 1,
      name: "JavaScript Fundamentals Workshop",
      startDateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      location: "Online",
      imageSrc: "/people.jpg",
      tags: ["JavaScript", "Beginner", "Web Development"],
      price: undefined,
    },
  ],
  futureEvents: [
    {
      id: 2,
      name: "React Advanced Patterns Workshop",
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      location: "Manchester Tech Hub",
      imageSrc: "/people.jpg",
      tags: ["React", "Advanced", "Frontend"],
      price: 75,
    },
    {
      id: 3,
      name: "Tech Conference 2024: Future of AI",
      startDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDateTime: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Manchester Convention Center",
      imageSrc: "/people.jpg",
      tags: ["AI", "Conference", "Machine Learning", "Innovation"],
      price: 299,
    },
  ],
};

const privateCommunity: CommunityDetailData = {
  ...communitySample,
  name: "Exclusive Tech Leaders Circle",
  type: "private",
  location: "London, UK",
  website: "https://techleaders-circle.com",
  description: "An exclusive community for senior tech leaders and executives. Members share strategic insights, discuss industry trends, and collaborate on high-level initiatives.",
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
  render: () => <CommunityDetail community={{...communitySample, isMember: true}} />,
};

export const Mobile: Story = {
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
  render: () => <CommunityDetail community={communitySample} />,
};
