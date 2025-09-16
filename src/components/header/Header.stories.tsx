import type { Meta, StoryObj } from "@storybook/nextjs";
import { Header } from "./Header";
import { decorators } from "../../../.storybook/previews";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

const meta = {
  title: "Components/Header",
  component: Header,
  decorators: decorators,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = {
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
};
