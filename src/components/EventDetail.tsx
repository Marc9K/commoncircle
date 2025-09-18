"use client";

import {
  Stack,
  Group,
  Title,
  Text,
  Button,
  Image,
  Badge,
  Container,
  Grid,
  Card,
  Divider,
  Box,
} from "@mantine/core";
import { useState } from "react";
import Variable from "./Variable";

export interface EventDetailData {
  id: string | number;
  name: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  imageSrc: string;
  tags: string[];
  price?: number; // undefined = free
  description: string;
  organizer: {
    name: string;
    email: string;
    website?: string;
    id: string;
  };
  capacity?: number;
  registeredCount?: number;
  isRegistered?: boolean;
  registrationDeadline?: string;
  communityId?: string | number;
  communityName?: string;
}

function formatEventDateTime(startDateTime: string, endDateTime: string) {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const startDate = start.toLocaleDateString("en-GB", options);
  const endDate = end.toLocaleDateString("en-GB", options);
  const startTime = start.toLocaleTimeString("en-GB", timeOptions);
  const endTime = end.toLocaleTimeString("en-GB", timeOptions);

  if (start.toDateString() === end.toDateString()) {
    return {
      dateString: startDate,
      timeString: `${startTime} - ${endTime}`,
    };
  }

  return {
    dateString: `${startDate} - ${endDate}`,
    timeString: `${startTime} - ${endTime}`,
  };
}

function EventImage({ event }: { event: EventDetailData }) {
  return (
    <Image
      src={event.imageSrc}
      alt={`${event.name} image`}
      radius="md"
      fit="cover"
      h={{ base: 200, sm: 300, md: 400 }}
      w="100%"
    />
  );
}

function EventTitle({ event }: { event: EventDetailData }) {
  return (
    <Stack gap={4}>
      <Title order={1} size="h2">
        {event.name}
      </Title>
      {event.communityName && (
        <Text c="dimmed" size="sm">
          Hosted by {event.communityName}
        </Text>
      )}
    </Stack>
  );
}

function EventDateTime({ event }: { event: EventDetailData }) {
  const { dateString, timeString } = formatEventDateTime(
    event.startDateTime,
    event.endDateTime
  );

  return (
    <Stack gap="xs">
      <Group gap="xs">
        <Text size="lg" fw={600}>
          📅 {dateString}
        </Text>
      </Group>
      <Group gap="xs">
        <Text size="md" c="dimmed">
          🕐 {timeString}
        </Text>
      </Group>
    </Stack>
  );
}

function EventLocation({ event }: { event: EventDetailData }) {
  return (
    <Stack gap="sm">
      <Group gap="xs">
        <Text size="md" fw={500}>
          📍 {event.location}
        </Text>
      </Group>
      <Box>
        <Box
          style={{
            height: 200,
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6c757d",
          }}
        >
          <Text size="sm">Map will be displayed here</Text>
        </Box>
      </Box>
    </Stack>
  );
}

function EventPrice({ event }: { event: EventDetailData }) {
  return (
    <Group gap="xs">
      <Text size="xl" fw={700} c={event.price === undefined ? "green" : "blue"}>
        {event.price === undefined ? "Free" : `£${event.price}`}
      </Text>
    </Group>
  );
}

function EventTags({ event }: { event: EventDetailData }) {
  if (event.tags.length === 0) return null;

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500} c="dimmed">
        Tags:
      </Text>
      <Group gap="xs">
        {event.tags.map((tag, index) => (
          <Badge key={index} variant="light" size="md">
            {tag}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
}

function EventCapacity({ event }: { event: EventDetailData }) {
  if (!event.capacity) return null;

  const spotsLeft = event.capacity - (event.registeredCount || 0);

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500} c="dimmed">
        Capacity:
      </Text>
      <Group gap="xs">
        <Text size="sm">
          {event.capacity - (event.registeredCount ?? 0)} avaliable
        </Text>
        {spotsLeft === 0 && (
          <Badge color="red" variant="light" size="sm">
            Event Full
          </Badge>
        )}
      </Group>
    </Stack>
  );
}

function RegistrationButton({
  event,
  isRegistered,
  onRegister,
  onUnregister,
}: {
  event: EventDetailData;
  isRegistered: boolean;
  onRegister: () => void;
  onUnregister: () => void;
}) {
  const spotsLeft = event.capacity
    ? event.capacity - (event.registeredCount || 0)
    : null;
  const isFull = spotsLeft === 0;
  const isPastEvent = new Date(event.startDateTime) < new Date();
  const isRegistrationClosed = event.registrationDeadline
    ? new Date(event.registrationDeadline) < new Date()
    : false;

  if (isPastEvent) {
    return (
      <Button disabled variant="light">
        Event has ended
      </Button>
    );
  }

  if (isRegistrationClosed) {
    return (
      <Button disabled variant="light">
        Registration closed
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <Button variant="light" color="red" onClick={onUnregister}>
        Unregister
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button disabled variant="light">
        Event Full
      </Button>
    );
  }

  return (
    <Button onClick={onRegister}>
      {event.price === undefined ? "Attend" : `Purchase`}
    </Button>
  );
}

function EventOrganizer({ event }: { event: EventDetailData }) {
  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="sm">
        <Text fw={600} size="md">
          Organizer
        </Text>
        <Text>{event.organizer.name}</Text>
        <Group gap="xs">
          <Button
            size="xs"
            variant="subtle"
            component="a"
            href={`mailto:${event.organizer.email}`}
          >
            Contact organizer
          </Button>
          {event.organizer.website && (
            <Button
              size="xs"
              variant="subtle"
              component="a"
              href={event.organizer.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit website
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
}

function EventDescription({ event }: { event: EventDetailData }) {
  return (
    <Stack gap="sm">
      <Text fw={600} size="lg">
        About this event
      </Text>
      <Text style={{ whiteSpace: "pre-wrap" }}>{event.description}</Text>
    </Stack>
  );
}

export function EventDetail({ event }: { event: EventDetailData }) {
  const [isRegistered, setIsRegistered] = useState<boolean>(
    event.isRegistered || false
  );

  const handleRegister = () => {
    setIsRegistered(true);
  };

  const handleUnregister = () => {
    setIsRegistered(false);
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <EventImage event={event} />

        <Variable at="md">
          <Grid>
            <Grid.Col span={8}>
              <Stack gap="lg">
                <EventTitle event={event} />
                <EventDescription event={event} />
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack gap="lg">
                <Card withBorder radius="md" p="lg">
                  <Stack gap="md">
                    <EventDateTime event={event} />
                    <Divider />
                    <EventLocation event={event} />
                    <Divider />
                    <EventPrice event={event} />
                    <Divider />
                    <EventCapacity event={event} />
                    <RegistrationButton
                      event={event}
                      isRegistered={isRegistered}
                      onRegister={handleRegister}
                      onUnregister={handleUnregister}
                    />
                  </Stack>
                </Card>
                <EventOrganizer event={event} />
              </Stack>
            </Grid.Col>
          </Grid>
          <Stack gap="lg">
            <EventTitle event={event} />
            <Card withBorder radius="md" p="lg">
              <Stack gap="md">
                <EventDateTime event={event} />
                <EventLocation event={event} />
                <EventPrice event={event} />
                <EventCapacity event={event} />
                <RegistrationButton
                  event={event}
                  isRegistered={isRegistered}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                />
              </Stack>
            </Card>
            <EventDescription event={event} />
            <EventOrganizer event={event} />
          </Stack>
        </Variable>

        <EventTags event={event} />
      </Stack>
    </Container>
  );
}
