import type { Meta, StoryObj } from "@storybook/nextjs";
import { decorators } from "../../../.storybook/previews";
import { CommunityCard } from "./CommunityCard";

const meta = {
  title: "Components/CommunityCard",
  component: CommunityCard,
  decorators: decorators,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "Tech Innovators",
    memberCount: 2847,
    tags: ["Technology", "Innovation", "Startups"],
    picture: "./people.jpg",
    pastEvents: 45,
    futureEvents: 8,
  },
} satisfies Meta<typeof CommunityCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ManyTags: Story = {
  args: {
    tags: ["Tech", "AI", "ML", "Data", "Cloud", "Security"],
  },
};

export const LongName: Story = {
  args: {
    name: "Open Source Contributors Worldwide Collaborative Network for Builders and Maintainers",
  },
};
