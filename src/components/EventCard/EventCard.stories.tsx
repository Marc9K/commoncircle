import type { Meta, StoryObj } from "@storybook/nextjs";
import { EventCard, EventCardData } from "./EventCard";
import { decorators } from "../../../.storybook/previews";

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
  startDateTime: new Date("2024-12-15T10:00:00Z").toISOString(), // Fixed date for consistent rendering
  endDateTime: new Date("2024-12-15T13:00:00Z").toISOString(), // +3 hours
  location: "Manchester Tech Hub",
  imageSrc: "./people.jpg",
  tags: ["React", "JavaScript", "Web Development", "Frontend", "Workshop"],
  price: 25,
};

const sampleEventMultiDay: EventCardData = {
  id: 2,
  name: "Tech Conference 2024: Future of Development",
  startDateTime: new Date("2024-12-22T09:00:00Z").toISOString(), // Fixed date for consistent rendering
  endDateTime: new Date("2024-12-24T17:00:00Z").toISOString(), // +2 days
  location: "London Convention Center",
  imageSrc: "./people.jpg",
  tags: ["Conference", "AI", "Blockchain", "Cloud Computing"],
  price: 199,
};

const freeEvent: EventCardData = {
  id: 3,
  name: "Community Meetup: Networking Night",
  startDateTime: new Date("2024-12-11T19:00:00Z").toISOString(), // Fixed date for consistent rendering
  endDateTime: new Date("2024-12-11T21:00:00Z").toISOString(), // +2 hours
  location: "Local Coffee Shop",
  imageSrc: "./people.jpg",
  tags: ["Networking", "Community"],
  price: undefined, // Free event
};

const longTitleEvent: EventCardData = {
  id: 4,
  name: "Advanced Machine Learning Techniques for Data Scientists: A Comprehensive Deep Dive Workshop",
  startDateTime: new Date("2024-12-29T10:00:00Z").toISOString(),
  endDateTime: new Date("2024-12-29T14:00:00Z").toISOString(),
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
      startDateTime: new Date("2024-11-25T14:00:00Z").toISOString(), // Fixed date for consistent rendering
      endDateTime: new Date("2024-11-25T16:00:00Z").toISOString(), // +2 hours
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
