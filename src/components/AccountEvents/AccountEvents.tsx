import { Stack, Tabs, SimpleGrid, Box, Badge, Group } from "@mantine/core";
import { EventCard, EventCardData } from "../EventCard/EventCard";
import { EmptyState } from "../EmptyState/EmptyState";

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
  return (
    <Box pos="relative">
      <EventCard event={event} />
      <Group
        gap="xs"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
        }}
      ></Group>
      <Badge
        variant="light"
        color="blue"
        size="xs"
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          zIndex: 1,
        }}
      >
        {event.communityName}
      </Badge>
    </Box>
  );
}

function EventsGrid({ events }: { events: UserEvent[] }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
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
  return (
    <Stack gap="lg">
      <Tabs defaultValue="future" variant="outline">
        <Tabs.List justify="flex-end">
          <Tabs.Tab value="future">
            Upcoming Events ({futureEvents.length})
          </Tabs.Tab>
          <Tabs.Tab value="past">Past Events ({pastEvents.length})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="future" pt="md">
          {futureEvents.length === 0 ? (
            <EmptyState
              title="No upcoming events"
              description="Register for events to see them here. Check out communities to discover new events"
            />
          ) : (
            <EventsGrid events={futureEvents} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="past" pt="md">
          {pastEvents.length === 0 ? (
            <EmptyState
              title="No past events yet"
              description="Events you attend will appear here after they've finished"
            />
          ) : (
            <EventsGrid events={pastEvents} />
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
