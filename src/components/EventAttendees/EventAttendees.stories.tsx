import type { Meta, StoryObj } from "@storybook/nextjs";
import { EventAttendees, Attendee } from "./EventAttendees";
import { decorators } from "../../../.storybook/previews";

const meta: Meta<typeof EventAttendees> = {
  title: "Components/EventAttendees",
  component: EventAttendees,
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
  },
  args: {
    onCheckIn: () => {},
    onCancel: () => {},
    onRefund: () => {},
    onAddAttendee: () => {},
    onMarkAsPaid: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof EventAttendees>;

const sampleAttendees: Attendee[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "member",
    isCheckedIn: true,
    registrationDate: "2024-12-01T10:00:00",
    paymentStatus: "paid",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "member",
    isCheckedIn: false,
    registrationDate: "2024-12-02T14:30:00",
    paymentStatus: "paid",
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@example.com",
    role: "non_affiliated",
    isCheckedIn: false,
    registrationDate: "2024-12-03T09:15:00",
    paymentStatus: "pending",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    role: "member",
    isCheckedIn: true,
    registrationDate: "2024-12-04T16:45:00",
    paymentStatus: "paid",
  },
  {
    id: "5",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@example.com",
    role: "event_creator",
    isCheckedIn: false,
    registrationDate: "2024-12-05T11:20:00",
    paymentStatus: "paid",
  },
  {
    id: "6",
    name: "Lisa Park",
    email: "lisa.park@example.com",
    role: "door_person",
    isCheckedIn: true,
    registrationDate: "2024-12-06T08:30:00",
    paymentStatus: "paid",
  },
];

export const WithAttendees: Story = {
  args: {
    attendees: sampleAttendees,
    currentUserRole: "manager",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Attendees list with various roles and check-in statuses. Manager can check in attendees and manage registrations.",
      },
    },
  },
};

export const EmptyList: Story = {
  args: {
    attendees: [],
    currentUserRole: "manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Empty attendees list showing the placeholder message.",
      },
    },
  },
};

export const AsOwner: Story = {
  args: {
    attendees: sampleAttendees,
    currentUserRole: "owner",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Attendees list viewed by community owner with full management capabilities.",
      },
    },
  },
};

export const AsDoorPerson: Story = {
  args: {
    attendees: sampleAttendees,
    currentUserRole: "door_person",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Attendees list viewed by door person who can check in attendees but has limited management options.",
      },
    },
  },
};

export const AsRegularUser: Story = {
  args: {
    attendees: sampleAttendees,
    currentUserRole: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Attendees list viewed by a regular user with no management capabilities.",
      },
    },
  },
};

export const LargeEvent: Story = {
  args: {
    attendees: [
      ...sampleAttendees,
      {
        id: "7",
        name: "David Kim",
        email: "david.kim@example.com",
        role: "member",
        isCheckedIn: false,
        registrationDate: "2024-12-07T13:45:00",
        paymentStatus: "paid",
      },
      {
        id: "8",
        name: "Maria Garcia",
        email: "maria.garcia@example.com",
        role: "member",
        isCheckedIn: true,
        registrationDate: "2024-12-08T10:15:00",
        paymentStatus: "paid",
      },
      {
        id: "9",
        name: "Tom Wilson",
        email: "tom.wilson@example.com",
        role: "non_affiliated",
        isCheckedIn: false,
        registrationDate: "2024-12-09T15:30:00",
        paymentStatus: "refunded",
      },
      {
        id: "10",
        name: "Anna Thompson",
        email: "anna.thompson@example.com",
        role: "member",
        isCheckedIn: true,
        registrationDate: "2024-12-10T09:00:00",
        paymentStatus: "paid",
      },
    ],
    currentUserRole: "manager",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large event with many attendees showing how the component handles a bigger list.",
      },
    },
  },
};

export const MixedPaymentStatuses: Story = {
  args: {
    attendees: [
      {
        id: "1",
        name: "Paid Attendee",
        email: "paid@example.com",
        role: "member",
        isCheckedIn: true,
        registrationDate: "2024-12-01T10:00:00",
        paymentStatus: "paid",
      },
      {
        id: "2",
        name: "Pending Payment",
        email: "pending@example.com",
        role: "member",
        isCheckedIn: false,
        registrationDate: "2024-12-02T14:30:00",
        paymentStatus: "pending",
      },
      {
        id: "3",
        name: "Refunded Attendee",
        email: "refunded@example.com",
        role: "member",
        isCheckedIn: false,
        registrationDate: "2024-12-03T09:15:00",
        paymentStatus: "refunded",
      },
    ],
    currentUserRole: "manager",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Attendees with different payment statuses showing the various badges and states.",
      },
    },
  },
};
