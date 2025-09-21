import type { Meta, StoryObj } from "@storybook/nextjs";
import { EventDetail, EventDetailData } from "./EventDetail";
import { decorators } from "../../../.storybook/previews";

const meta = {
  title: "Components/EventDetail",
  component: EventDetail,
  decorators: decorators,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EventDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseEvent: EventDetailData = {
  id: 1,
  name: "React Workshop: Building Modern Web Apps",
  startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  endDateTime: new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
  ).toISOString(),
  location: "Manchester Tech Hub, 123 Innovation Street, Manchester M1 1AA",
  imageSrc: "./people.jpg",
  tags: ["React", "JavaScript", "Web Development", "Frontend", "Workshop"],
  price: 25,
  description: `Join us for an intensive React workshop where you'll learn to build modern web applications from scratch.

This hands-on workshop covers:
• Setting up a React development environment
• Understanding components and JSX
• State management with hooks
• Routing with React Router
• API integration and data fetching
• Styling with modern CSS techniques
• Best practices for production deployment

Perfect for developers with basic JavaScript knowledge who want to dive deep into React. You'll leave with a complete web application and the skills to build your own projects.

Please bring your laptop with Node.js installed. We'll provide all the starter code and resources.`,
  organizer: {
    name: "Tech Education Manchester",
    email: "workshops@techedu.manchester",
    website: "https://techedu.manchester",
    id: "org-1",
  },
  capacity: 30,
  registeredCount: 18,
  isRegistered: false,
  registrationDeadline: new Date(
    Date.now() + 6 * 24 * 60 * 60 * 1000
  ).toISOString(),
  communityId: 1,
  communityName: "Manchester Tech Community",
};

export const Default: Story = {
  args: {
    event: baseEvent,
  },
};

export const FreeEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Community Meetup: Networking Night",
      price: undefined,
      tags: ["Networking", "Community", "Informal", "Coffee"],
      description: `A relaxed networking evening for local developers, designers, and tech enthusiasts.

Join us for:
• Informal networking and conversations
• Lightning talks (5 minutes, optional)
• Career advice and job opportunities
• Project showcases
• Complimentary coffee and light refreshments

This is a beginner-friendly event - everyone is welcome!`,
      capacity: 25,
      registeredCount: 12,
    },
  },
};

export const AlreadyRegistered: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Photography Workshop - Confirmed Attendance",
      isRegistered: true,
      tags: ["Photography", "Workshop", "Creative", "Beginner-Friendly"],
      description: `Join us for a hands-on photography workshop perfect for beginners and enthusiasts alike.

You are confirmed to attend this event! Don't forget to add it to your calendar so you don't miss it.

What you'll learn:
• Camera basics and settings
• Composition techniques
• Lighting fundamentals
• Post-processing introduction
• Portfolio building tips

Please bring your camera (smartphone cameras are welcome too!) and dress comfortably for outdoor shooting.

Lunch and refreshments will be provided.`,
    },
  },
};

export const AlmostFullEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Exclusive AI Workshop - Limited Seats",
      capacity: 20,
      registeredCount: 19,
      price: 150,
      tags: ["AI", "Machine Learning", "Python", "Advanced", "Limited"],
    },
  },
};

export const FullEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Sold Out Conference",
      capacity: 100,
      registeredCount: 100,
      price: 199,
      tags: ["Conference", "Full", "Waitlist"],
    },
  },
};

export const PastEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Past Workshop: JavaScript Fundamentals",
      startDateTime: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDateTime: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ).toISOString(),
      tags: ["JavaScript", "Beginner", "Past Event"],
      registeredCount: 25,
      capacity: 30,
    },
  },
};

export const RegistrationClosed: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Workshop with Closed Registration",
      registrationDeadline: new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString(), // Yesterday
      capacity: 50,
      registeredCount: 35,
    },
  },
};

export const MultiDayConference: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Tech Conference 2024: Future of Development",
      startDateTime: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDateTime: new Date(
        Date.now() + 16 * 24 * 60 * 60 * 1000
      ).toISOString(), // 3 days later
      location:
        "London Convention Center, Excel London, Royal Victoria Dock, London E16 1XL",
      tags: ["Conference", "AI", "Blockchain", "Cloud Computing", "Keynote"],
      price: 199,
      description: `The premier technology conference bringing together industry leaders, innovators, and developers from around the world.

Day 1 - AI & Machine Learning
• Keynote: The Future of AI in Software Development
• Workshop: Building ML Models with Python
• Panel: Ethics in AI Development
• Networking Reception

Day 2 - Blockchain & Web3
• Cryptocurrency and DeFi Innovations
• Smart Contract Development Workshop
• NFTs Beyond the Hype

Day 3 - Cloud & Infrastructure
• Serverless Architecture Best Practices
• Kubernetes in Production
• DevOps Culture and Automation
• Closing Ceremony

Includes all sessions, workshops, meals, and networking events. Conference swag bag included!`,
      capacity: 500,
      registeredCount: 342,
      organizer: {
        name: "Global Tech Events Ltd",
        email: "info@globaltechevents.com",
        website: "https://techconf2024.com",
        id: "org-2",
      },
      communityName: "UK Developers Network",
    },
  },
};

export const EventWithManyTags: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Full Stack Development Bootcamp",
      tags: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "Docker",
        "AWS",
        "GraphQL",
        "Testing",
        "DevOps",
      ],
      price: 299,
      capacity: 40,
      registeredCount: 28,
    },
  },
};

export const LongTitleEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Advanced Machine Learning Techniques for Data Scientists: A Comprehensive Deep Dive Workshop on Neural Networks, Deep Learning, and Artificial Intelligence Applications in Modern Software Development",
    },
  },
};

export const NoCapacityLimit: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Virtual Conference - Unlimited Capacity",
      location: "Online Event",
      capacity: undefined,
      registeredCount: undefined,
      tags: ["Virtual", "Online", "Unlimited", "Global"],
    },
  },
};

export const PayWhatYouCanEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Community Workshop: Pay What You Can",
      price: undefined,
      payWhatYouCan: true,
      payWhatYouCanMin: 5,
      payWhatYouCanMax: 50,
      payWhatYouCanSuggested: 20,
      tags: ["Workshop", "Community", "Pay What You Can", "Flexible"],
      description: `Join us for a community-driven workshop where you contribute what you can afford.

This inclusive event covers:
• Introduction to web development
• Hands-on coding exercises
• Career guidance and mentorship
• Networking with fellow developers
• Project collaboration opportunities

We believe learning should be accessible to everyone. Pay what you can - whether that's £5, £25, or £50. Your contribution helps us cover venue costs and materials while keeping the event accessible to all.

Suggested contribution: £20
Minimum: £5 (to cover basic costs)
Maximum: £50 (to keep it fair for everyone)

No one will be turned away due to financial constraints.`,
      capacity: 40,
      registeredCount: 22,
      organizer: {
        name: "Inclusive Tech Community",
        email: "hello@inclusivetech.org",
        website: "https://inclusivetech.org",
        id: "org-3",
      },
      communityName: "Inclusive Tech Community",
    },
  },
};

export const DefaultMobile: Story = {
  ...Default,
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

export const MultiDayConferenceMobile: Story = {
  ...MultiDayConference,
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

export const AlreadyRegisteredMobile: Story = {
  ...AlreadyRegistered,
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};

export const PayWhatYouCanEventHighRange: Story = {
  args: {
    event: {
      ...baseEvent,
      name: "Premium Workshop: Pay What You Can",
      price: undefined,
      payWhatYouCan: true,
      payWhatYouCanMin: 50,
      payWhatYouCanMax: 200,
      payWhatYouCanSuggested: 100,
      tags: ["Premium", "Advanced", "Pay What You Can", "Professional"],
      description: `An advanced workshop for experienced developers looking to level up their skills.

This premium event includes:
• Advanced React patterns and performance optimization
• State management with Redux Toolkit and Zustand
• Testing strategies with Jest and React Testing Library
• Deployment and CI/CD best practices
• One-on-one mentoring sessions
• Premium materials and resources

Pay what you can within our range to help us maintain high-quality instruction and resources.

Suggested contribution: £100
Minimum: £50 (to cover premium venue and materials)
Maximum: £200 (to keep it accessible for professionals)

Includes lunch, premium materials, and post-workshop support.`,
      capacity: 20,
      registeredCount: 8,
      organizer: {
        name: "Advanced Tech Academy",
        email: "premium@advancedtech.academy",
        website: "https://advancedtech.academy",
        id: "org-4",
      },
      communityName: "Advanced Tech Academy",
    },
  },
};

export const PayWhatYouCanEventMobile: Story = {
  ...PayWhatYouCanEvent,
  globals: {
    viewport: {
      value: "mobile1",
    },
  },
};
