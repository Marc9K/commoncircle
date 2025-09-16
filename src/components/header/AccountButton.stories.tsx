import type { Meta, StoryObj } from "@storybook/nextjs";
import AccountButton from "./AccountButton";
import { decorators } from "../../../.storybook/previews";

const meta = {
  title: "Components/AccountButton",
  component: AccountButton,
  decorators: decorators,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AccountButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithUser: Story = {
  args: {
    user: { name: "John" },
  },
};

export const WithoutUser: Story = {
  name: "Login",
  args: {
    user: undefined,
  },
};
