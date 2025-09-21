import type { Meta, StoryObj } from "@storybook/react";
import { EventSettings } from "./EventSettings";
import { decorators } from "../../../.storybook/previews";

const meta: Meta<typeof EventSettings> = {
  title: "Components/EventSettings",
  component: EventSettings,
  decorators: decorators,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    currentUserRole: {
      control: "select",
      options: ["owner", "manager", "event_creator", "door_person", null],
      description: "Current user's role in the community",
    },
    eventType: {
      control: "select",
      options: ["public", "private"],
      description: "Whether the event is public or private",
    },
    isRegistrationOpen: {
      control: "boolean",
      description: "Whether registration is currently open",
    },
  },
  args: {
    eventId: "event-123",
    eventName: "Tech Meetup 2024",
    onToggleRegistration: () => {},
    onChangeEventType: () => {},
    onDeleteEvent: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof EventSettings>;

export const PublicEventWithOpenRegistration: Story = {
  args: {
    eventType: "public",
    isRegistrationOpen: true,
    currentUserRole: "manager",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Settings for a public event with open registration. Manager can control all settings.",
      },
    },
  },
};

export const PrivateEventWithClosedRegistration: Story = {
  args: {
    eventType: "private",
    isRegistrationOpen: false,
    currentUserRole: "manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Settings for a private event with closed registration.",
      },
    },
  },
};

export const AsOwner: Story = {
  args: {
    eventType: "public",
    isRegistrationOpen: true,
    currentUserRole: "owner",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Settings viewed by community owner with full management capabilities.",
      },
    },
  },
};

export const AsEventCreator: Story = {
  args: {
    eventType: "private",
    isRegistrationOpen: true,
    currentUserRole: "event_creator",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Settings viewed by event creator who can manage the event they created.",
      },
    },
  },
};

export const AsRegularUser: Story = {
  args: {
    eventType: "public",
    isRegistrationOpen: true,
    currentUserRole: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Settings viewed by a regular user with no management capabilities - shows access denied.",
      },
    },
  },
};

export const AsDoorPerson: Story = {
  args: {
    eventType: "public",
    isRegistrationOpen: true,
    currentUserRole: "door_person",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Settings viewed by door person with no management capabilities - shows access denied.",
      },
    },
  },
};
