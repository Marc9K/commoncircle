import type { Meta, StoryObj } from "@storybook/nextjs";
import { EmptyState } from "./EmptyState";
import { decorators } from "../../.storybook/previews";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  decorators: decorators,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onAction: { action: "clicked" },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    title: "No items found",
    description:
      "There are no items to display at the moment. Try checking back later or creating a new item.",
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const Mobile: Story = {
  args: {
    title: "No items found",
    description:
      "There are no items to display at the moment. Try checking back later or creating a new item.",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const WithAction: Story = {
  args: {
    title: "No communities yet",
    description:
      "You haven't joined any communities yet. Start building your network by joining communities that match your interests.",
    actionLabel: "Explore Communities",
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const CreateNewItem: Story = {
  args: {
    title: "You're not running any communities yet",
    description:
      "Start building your community today and connect with like-minded people",
    actionLabel: "Start New Community",
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const NoUpcomingEvents: Story = {
  args: {
    title: "No upcoming events",
    description:
      "Register for events to see them here. Check out communities to discover new events",
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const NoPastEvents: Story = {
  args: {
    title: "No past events yet",
    description: "Events you attend will appear here after they've finished",
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const LongDescription: Story = {
  args: {
    title: "No results found",
    description:
      "We couldn't find any results matching your search criteria. This might happen if you're looking for something very specific or if the content doesn't exist yet. Try adjusting your search terms, checking for typos, or browse through our categories to discover new content.",
    actionLabel: "Browse Categories",
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
