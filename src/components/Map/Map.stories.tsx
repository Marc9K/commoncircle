import type { Meta, StoryObj } from "@storybook/nextjs";
import { Map } from "./Map";

const meta: Meta<typeof Map> = {
  title: "Components/Map",
  component: Map,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    location: {
      control: { type: "text" },
      description: "Location string to geocode and display on map",
    },
    height: {
      control: { type: "text" },
      description: "Height of the map container",
    },
    zoom: {
      control: { type: "number", min: 1, max: 18 },
      description: "Initial zoom level of the map",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    location: "London, UK",
    height: "300px",
    zoom: 13,
  },
};

export const Manchester: Story = {
  args: {
    location: "Manchester, UK",
    height: "300px",
    zoom: 13,
  },
};

export const NewYork: Story = {
  args: {
    location: "New York, USA",
    height: "300px",
    zoom: 13,
  },
};

export const SpecificAddress: Story = {
  args: {
    location: "Manchester Tech Hub, 123 Innovation Street, Manchester M1 1AA",
    height: "300px",
    zoom: 15,
  },
};

export const SmallMap: Story = {
  args: {
    location: "London, UK",
    height: "150px",
    zoom: 15,
  },
};

export const LargeMap: Story = {
  args: {
    location: "London, UK",
    height: "500px",
    zoom: 10,
  },
};

export const InvalidLocation: Story = {
  args: {
    location: "This is not a real location that should fail",
    height: "300px",
    zoom: 13,
  },
};
