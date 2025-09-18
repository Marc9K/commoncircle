import type { Meta, StoryObj } from "@storybook/nextjs";
import { decorators } from "../../.storybook/previews";
import { CommunitiesGrid } from "./CommunitiesGrid";

const sampleCommunities = [
  {
    id: 1,
    name: "Tech Innovators",
    memberCount: 2847,
    tags: ["Technology", "Innovation", "Startups"],
    imageSrc: "./people.jpg",
    pastEvents: 45,
    futureEvents: 8,
  },
  {
    id: 2,
    name: "Design Collective",
    memberCount: 1923,
    tags: ["Design", "UI/UX", "Creative"],
    imageSrc: "./people.jpg",
    pastEvents: 32,
    futureEvents: 5,
  },
  {
    id: 3,
    name: "Data Science Hub",
    memberCount: 3456,
    tags: ["Data Science", "AI", "Machine Learning"],
    imageSrc: "./people.jpg",
    pastEvents: 67,
    futureEvents: 12,
  },
  {
    id: 4,
    name: "Digital Marketing Pros",
    memberCount: 1789,
    tags: ["Marketing", "Digital", "Growth"],
    imageSrc: "./people.jpg",
    pastEvents: 28,
    futureEvents: 6,
  },
  {
    id: 5,
    name: "Remote Work Community",
    memberCount: 4123,
    tags: ["Remote Work", "Productivity", "Lifestyle"],
    imageSrc: "./people.jpg",
    pastEvents: 89,
    futureEvents: 15,
  },
  {
    id: 6,
    name: "Sustainability Network",
    memberCount: 2156,
    tags: ["Sustainability", "Environment", "Green Tech"],
    imageSrc: "./people.jpg",
    pastEvents: 23,
    futureEvents: 4,
  },
  {
    id: 7,
    name: "Women in Tech",
    memberCount: 3892,
    tags: ["Women", "Tech", "Diversity"],
    imageSrc: "./people.jpg",
    pastEvents: 76,
    futureEvents: 18,
  },
  {
    id: 8,
    name: "Blockchain Enthusiasts",
    memberCount: 1567,
    tags: ["Blockchain", "Crypto", "Web3"],
    imageSrc: "./people.jpg",
    pastEvents: 19,
    futureEvents: 3,
  },
  {
    id: 9,
    name: "Freelancer Network",
    memberCount: 2734,
    tags: ["Freelancing", "Business", "Networking"],
    imageSrc: "./people.jpg",
    pastEvents: 54,
    futureEvents: 9,
  },
  {
    id: 10,
    name: "Open Source Contributors",
    memberCount: 4567,
    tags: ["Open Source", "Development", "Collaboration"],
    imageSrc: "./people.jpg",
    pastEvents: 112,
    futureEvents: 24,
  },
];

const meta = {
  title: "Components/CommunitiesGrid",
  component: CommunitiesGrid,
  decorators: decorators,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    communities: sampleCommunities,
    maxCommunities: 10,
  },
} satisfies Meta<typeof CommunitiesGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShowSix: Story = {
  args: {
    maxCommunities: 6,
  },
};
