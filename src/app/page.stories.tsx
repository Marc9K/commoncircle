import type { Meta, StoryObj } from "@storybook/nextjs";

import Page from "./page";
import { decorators } from "../../.storybook/previews";
const meta = {
  component: Page,
  decorators: decorators,
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
