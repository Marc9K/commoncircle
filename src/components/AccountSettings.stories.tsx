import type { Meta, StoryObj } from "@storybook/nextjs";
import { AccountSettings } from "./AccountSettings";
import { decorators } from "../../.storybook/previews";

const meta = {
  title: "Components/AccountSettings",
  component: AccountSettings,
  decorators: decorators,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AccountSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleUser = {
  id: "user-1",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
};

const sampleUserWithLongName = {
  id: "user-2",
  name: "Elizabeth Catherine Montgomery-Smith",
  email: "elizabeth.montgomery-smith@verylongemaildomain.co.uk",
};

export const Desktop: Story = {
  args: {
    user: sampleUser,
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
  },
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

export const LongUserDetails: Story = {
  args: {
    user: sampleUserWithLongName,
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const MobileWithLongDetails: Story = {
  args: {
    user: sampleUserWithLongName,
  },
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};
