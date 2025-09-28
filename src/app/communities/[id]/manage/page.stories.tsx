import type { Meta, StoryObj } from "@storybook/nextjs";
import CommunityManagePage from "./page";
import { decorators } from "../../../../../.storybook/previews";

const meta: Meta<typeof CommunityManagePage> = {
  title: "Pages/CommunityManage",
  component: CommunityManagePage,
  decorators: decorators,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        pathname: "/communities/1/manage",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/communities/1/manage",
      },
    },
  },
};

export const PrivateCommunity: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/communities/2/manage",
      },
    },
  },
};

export const NewCommunity: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/communities/new/manage",
      },
    },
  },
};
