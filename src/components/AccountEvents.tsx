import {
  Stack,
  Tabs,
  SimpleGrid,
  Box,
  Badge,
  Group,
} from "@mantine/core";
import { EventCard, EventCardData } from "./EventCard";
import { EmptyState } from "./EmptyState";

export interface UserEvent extends EventCardData {
  registrationDate: string;
  registrationStatus: "confirmed" | "waitlist" | "cancelled";
  communityName: string;
}

export interface AccountEventsProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  pastEvents?: UserEvent[];
  futureEvents?: UserEvent[];
}


function UserEventCard({ event }: { event: UserEvent }) {
  const getStatusColor = (status: UserEvent["registrationStatus"]) => {
    switch (status) {
      case "confirmed":
        return "green";
      case "waitlist":
        return "orange";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: UserEvent["registrationStatus"]) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "waitlist":
        return "Waitlist";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  return (
    <Box pos="relative">
      <EventCard event={event} />
      <Group 
        gap="xs" 
        style={{ 
          position: "absolute", 
          top: 8, 
          right: 8, 
          zIndex: 1 
        }}
      >
        <Badge 
          color={getStatusColor(event.registrationStatus)}
          variant="filled"
          size="sm"
        >
          {getStatusLabel(event.registrationStatus)}
        </Badge>
      </Group>
      <Badge
        variant="light"
        color="blue"
        size="xs"
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          zIndex: 1
        }}
      >
        {event.communityName}
      </Badge>
    </Box>
  );
}

function EventsGrid({ events }: { events: UserEvent[] }) {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      spacing="lg"
    >
      {events.map((event) => (
        <UserEventCard key={event.id} event={event} />
      ))}
    </SimpleGrid>
  );
}

export function AccountEvents({
  pastEvents = [],
  futureEvents = [],
}: AccountEventsProps) {
  // Filter events based on date and status
  const confirmedPastEvents = pastEvents.filter(
    (event) => event.registrationStatus === "confirmed"
  );
  
  const activeFutureEvents = futureEvents.filter(
    (event) => event.registrationStatus !== "cancelled"
  );

  return (
    <Stack gap="lg">
      <Tabs defaultValue="future" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="future">
            Upcoming Events ({activeFutureEvents.length})
          </Tabs.Tab>
          <Tabs.Tab value="past">
            Past Events ({confirmedPastEvents.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="future" pt="md">
          {activeFutureEvents.length === 0 ? (
            <EmptyState
              title="No upcoming events"
              description="Register for events to see them here. Check out communities to discover new events"
            />
          ) : (
            <EventsGrid events={activeFutureEvents} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="past" pt="md">
          {confirmedPastEvents.length === 0 ? (
            <EmptyState
              title="No past events yet"
              description="Events you attend will appear here after they've finished"
            />
          ) : (
            <EventsGrid events={confirmedPastEvents} />
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}