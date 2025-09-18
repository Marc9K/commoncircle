import type { Meta, StoryObj } from "@storybook/nextjs";
import { EventCard, EventCardData } from "./EventCard";
import { decorators } from "../../.storybook/previews";

const meta = {
  title: "Components/EventCard",
  component: EventCard,
  decorators: decorators,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleEventSameDay: EventCardData = {
  id: 1,
  name: "React Workshop: Building Modern Web Apps",
  startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  endDateTime: new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
  ).toISOString(), // +3 hours
  location: "Manchester Tech Hub",
  imageSrc: "./people.jpg",
  tags: ["React", "JavaScript", "Web Development", "Frontend", "Workshop"],
  price: 25,
};

const sampleEventMultiDay: EventCardData = {
  id: 2,
  name: "Tech Conference 2024: Future of Development",
  startDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
  endDateTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(), // +2 days
  location: "London Convention Center",
  imageSrc: "./people.jpg",
  tags: ["Conference", "AI", "Blockchain", "Cloud Computing"],
  price: 199,
};

const freeEvent: EventCardData = {
  id: 3,
  name: "Community Meetup: Networking Night",
  startDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  endDateTime: new Date(
    Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
  ).toISOString(), // +2 hours
  location: "Local Coffee Shop",
  imageSrc: "./people.jpg",
  tags: ["Networking", "Community"],
  price: undefined, // Free event
};

const longTitleEvent: EventCardData = {
  id: 4,
  name: "Advanced Machine Learning Techniques for Data Scientists: A Comprehensive Deep Dive Workshop",
  startDateTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  endDateTime: new Date(
    Date.now() + 21 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
  ).toISOString(),
  location: "University of Manchester",
  imageSrc: "./people.jpg",
  tags: [
    "Machine Learning",
    "Data Science",
    "Python",
    "AI",
    "Deep Learning",
    "Neural Networks",
  ],
  price: 150,
};

export const SameDayEvent: Story = {
  args: {
    event: sampleEventSameDay,
  },
};

export const MultiDayEvent: Story = {
  args: {
    event: sampleEventMultiDay,
  },
};

export const FreeEvent: Story = {
  args: {
    event: freeEvent,
  },
};

export const LongTitleAndManyTags: Story = {
  args: {
    event: longTitleEvent,
  },
};

export const PastEvent: Story = {
  args: {
    event: {
      ...sampleEventSameDay,
      name: "Past Workshop: JavaScript Fundamentals",
      startDateTime: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 7 days ago
      endDateTime: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ).toISOString(), // +2 hours
      tags: ["JavaScript", "Beginner"],
      price: 15,
    },
  },
};

export const SameDayEventMobile: Story = {
  ...SameDayEvent,
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

export const MultiDayEventMobile: Story = {
  ...MultiDayEvent,
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

export const FreeEventMobile: Story = {
  ...FreeEvent,
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

export const LongTitleAndManyTagsMobile: Story = {
  ...LongTitleAndManyTags,
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};
