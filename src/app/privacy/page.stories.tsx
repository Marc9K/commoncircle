import type { Meta, StoryObj } from "@storybook/react";
import PrivacyPolicy from "./page";

const meta: Meta<typeof PrivacyPolicy> = {
  title: "Pages/Privacy Policy",
  component: PrivacyPolicy,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
