import type { Meta, StoryObj } from "@storybook/nextjs";
import { EventForm, EventFormData } from "./EventForm";
import { decorators } from "../../../.storybook/previews";

const meta: Meta<typeof EventForm> = {
  title: "Components/EventForm",
  component: EventForm,
  decorators: decorators,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isEditing: {
      control: "boolean",
      description: "Whether the form is in editing mode",
    },
    isLoading: {
      control: "boolean",
      description: "Whether the form is in a loading state",
    },
  },
  args: {
    onSubmit: () => {},
    onCancel: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof EventForm>;

// Sample event data for editing scenarios
const sampleEventData: Partial<EventFormData> = {
  title: "Tech Meetup 2024",
  description:
    "Join us for an exciting evening of networking and tech discussions. We'll have speakers from leading companies sharing their insights on the latest trends in software development, AI, and cloud computing.",
  start: "2024-12-25T18:00",
  finish: "2024-12-25T21:00",
  location: "Tech Hub London, 123 Innovation Street",
  picture:
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
  tags: ["networking", "tech", "AI", "cloud"],
  price: 25,
  capacity: 100,
  registrationDeadline: "2024-12-20T23:59",
  isFree: false,
  isPayWhatYouCan: false,
  suggestedAmount: 15,
};

export const CreateNewEvent: Story = {
  args: {
    isEditing: false,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form for creating a new event. Shows all fields in their default state.",
      },
    },
  },
};

export const CreateNewEventLoading: Story = {
  args: {
    isEditing: false,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Create event form in loading state while submitting.",
      },
    },
  },
};

export const EditExistingEvent: Story = {
  args: {
    initialData: sampleEventData,
    isEditing: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form for editing an existing event. Pre-populated with event data.",
      },
    },
  },
};

export const EditExistingEventLoading: Story = {
  args: {
    initialData: sampleEventData,
    isEditing: true,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Edit event form in loading state while updating.",
      },
    },
  },
};

export const FreeEvent: Story = {
  args: {
    initialData: {
      ...sampleEventData,
      isFree: true,
      isPayWhatYouCan: false,
      price: undefined,
    },
    isEditing: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edit form for a free event. Price field is hidden when event is free.",
      },
    },
  },
};

export const PayWhatYouCanEvent: Story = {
  args: {
    initialData: {
      ...sampleEventData,
      isFree: false,
      isPayWhatYouCan: true,
      price: undefined,
      suggestedAmount: 20,
    },
    isEditing: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edit form for a pay-what-you-can event. Attendees can choose their own contribution amount.",
      },
    },
  },
};

export const MinimalEvent: Story = {
  args: {
    initialData: {
      title: "Quick Coffee Chat",
      description: "A casual meetup for coffee and conversation.",
      start: "2024-12-15T10:00",
      finish: "2024-12-15T11:00",
      location: "Local Coffee Shop",
      tags: ["casual", "coffee"],
      isFree: true,
    },
    isEditing: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edit form for a minimal event with only basic information filled.",
      },
    },
  },
};

export const LargeEvent: Story = {
  args: {
    initialData: {
      ...sampleEventData,
      title: "Annual Tech Conference 2024",
      description:
        "Our biggest event of the year! Join us for a full day of presentations, workshops, and networking opportunities. We'll have keynote speakers from major tech companies, hands-on workshops, and plenty of time to connect with fellow professionals.",
      start: "2024-06-15T09:00",
      finish: "2024-06-15T17:00",
      location: "Convention Center, 456 Business District",
      tags: [
        "conference",
        "tech",
        "networking",
        "workshops",
        "keynote",
        "professional",
      ],
      price: 150,
      capacity: 500,
      registrationDeadline: "2024-06-01T23:59",
    },
    isEditing: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edit form for a large conference-style event with all fields populated.",
      },
    },
  },
};

export const EventWithValidationErrors: Story = {
  args: {
    initialData: {
      title: "A", // Too short
      description: "Short", // Too short
      start: "2024-12-25T18:00",
      finish: "2024-12-25T17:00", // Before start time
      location: "X", // Too short
      isFree: false,
      price: 0, // Invalid for paid event
    },
    isEditing: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Form showing validation errors for various fields.",
      },
    },
  },
};
