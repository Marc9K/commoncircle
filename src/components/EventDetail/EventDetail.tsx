"use client";

import {
  Stack,
  Group,
  Title,
  Text,
  Image,
  Badge,
  Container,
  Grid,
  Card,
  Divider,
  Box,
  Button,
  Tabs,
  NumberInput,
} from "@mantine/core";
import { useState } from "react";
import Link from "next/link";
import Variable from "../Variable/Variable";
import { EventAttendees, Attendee } from "../EventAttendees/EventAttendees";
import { EventSettings } from "../EventSettings/EventSettings";
import { Map } from "../Map/Map";
import { createClient } from "@/lib/supabase/client";

export interface EventDetailData {
  id: string | number;
  title: string;
  start: string;
  finish?: string;
  location: string;
  picture: string;
  tags: string[];
  price?: number; // undefined = free
  payWhatYouCan?: boolean;
  description: string;
  capacity?: number;
  isRegistered?: boolean;
  communityId?: string | number;
  communityName?: string;
  communityEmail?: string;
  communityWebsite?: string;
  currentUserRole?:
    | "owner"
    | "manager"
    | "event_creator"
    | "door_person"
    | "member"
    | null;
  attendees?: number;
  public?: boolean;
}

function formatEventDateTime(startDateTime: string, endDateTime?: string) {
  const start = new Date(startDateTime);

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
  const startTime = start.toLocaleTimeString("en-GB", timeOptions);

  if (endDateTime) {
    const end = new Date(endDateTime);
    const endDate = end.toLocaleDateString("en-GB", options);
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

  return {
    dateString: `${startDate}`,
    timeString: `${startTime}`,
  };
}

function EventImage({ event }: { event: EventDetailData }) {
  if (!event.picture) return null;
  return (
    <Image
      src={event.picture}
      alt={`${event.title} image`}
      radius="md"
      fit="cover"
      h={{ base: 200, sm: 300, md: 400 }}
      w="100%"
    />
  );
}

function EventTitle({ event }: { event: EventDetailData }) {
  return (
    <Title order={1} size="h2">
      {event.title}
    </Title>
  );
}

function EventDateTime({ event }: { event: EventDetailData }) {
  const { dateString, timeString } = formatEventDateTime(
    event.start,
    event.finish
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
      {event.location && (
        <Text size="md" fw={500}>
          📍 {event.location}
        </Text>
      )}
      <Box>
        <Map location={event.location} height="200px" zoom={13} />
      </Box>
    </Stack>
  );
}

function PayWhatYouCanInput({
  amount,
  onAmountChange,
}: {
  event: EventDetailData;
  amount: number;
  onAmountChange: (value: number) => void;
}) {
  return (
    <Stack gap="sm">
      <Text size="md" fw={500}>
        Pay What You Can
      </Text>
      <NumberInput
        value={amount}
        onChange={(value) =>
          onAmountChange(typeof value === "number" ? value : 0)
        }
        min={0}
        step={1}
        prefix="£"
        placeholder={`set your own amount`}
        size="md"
      />
    </Stack>
  );
}

function EventPrice({ event }: { event: EventDetailData }) {
  if (event.payWhatYouCan) {
    return (
      <Stack gap="sm">
        <Text size="lg" fw={600} c="blue">
          Pay What You Can
        </Text>
      </Stack>
    );
  }

  return (
    <Group gap="xs">
      <Text size="xl" fw={700} c={event.price == undefined ? "green" : "blue"}>
        {event.price == undefined
          ? "Pay What You Can"
          : event.price === 0
          ? "Free"
          : `£${event.price}`}
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

  const spotsLeft = event.capacity - (event.attendees || 0);

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500} c="dimmed">
        Capacity:
      </Text>
      <Group gap="xs">
        <Text size="sm">
          {event.capacity - (event.attendees ?? 0)} avaliable
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
  payWhatYouCanAmount,
  onPayWhatYouCanAmountChange,
}: {
  event: EventDetailData;
  isRegistered: boolean;
  onRegister: () => void;
  onUnregister: () => void;
  payWhatYouCanAmount?: number;
  onPayWhatYouCanAmountChange?: (amount: number) => void;
}) {
  const isManager =
    event.currentUserRole === "owner" ||
    event.currentUserRole === "manager" ||
    event.currentUserRole === "event_creator";
  const spotsLeft = event.capacity
    ? event.capacity - (event.attendees || 0)
    : null;
  const isFull = spotsLeft === 0;
  const isPastEvent = new Date(event.finish ?? event.start) < new Date();

  const handleAddToCalendar = () => {
    const startDate = new Date(event.start);
    const endDate = event.finish
      ? new Date(event.finish)
      : new Date(startDate.getTime() + 1 * 60 * 60 * 1000);

    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const startTime = formatDate(startDate);
    const endTime = formatDate(endDate);

    const googleCalendarUrl = new URL(
      "https://calendar.google.com/calendar/render"
    );
    googleCalendarUrl.searchParams.set("action", "TEMPLATE");
    googleCalendarUrl.searchParams.set("text", event.title);
    googleCalendarUrl.searchParams.set("dates", `${startTime}/${endTime}`);
    googleCalendarUrl.searchParams.set("details", event.description);
    googleCalendarUrl.searchParams.set("location", event.location);

    // Open Google Calendar in a new tab
    window.open(googleCalendarUrl.toString(), "_blank");
  };

  if (isPastEvent) {
    return (
      <Button disabled variant="light">
        Event has ended
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <Stack gap="sm">
        <Button variant="light" color="red" onClick={onUnregister}>
          Unregister
        </Button>
        <Button
          variant="outline"
          color="blue"
          onClick={handleAddToCalendar}
          leftSection="📆"
        >
          Add to Google Calendar
        </Button>
      </Stack>
    );
  }

  if (isFull) {
    return (
      <Button disabled variant="light">
        Event Full
      </Button>
    );
  }

  if (isManager) {
    return (
      <Button
        variant="filled"
        color="blue"
        onClick={() =>
          typeof window !== "undefined" &&
          (window.location.href = `/communities/${event.communityId}/events/${event.id}/edit`)
        }
      >
        Manage Event
      </Button>
    );
  }

  if (event.payWhatYouCan && onPayWhatYouCanAmountChange) {
    return (
      <Stack gap="md">
        <PayWhatYouCanInput
          event={event}
          amount={payWhatYouCanAmount || 0}
          onAmountChange={onPayWhatYouCanAmountChange}
        />
        <Button onClick={onRegister}>Pay £{payWhatYouCanAmount || 0}</Button>
      </Stack>
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
        <Text>
          {event.communityId ? (
            <Link
              href={`/communities/${event.communityId}`}
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight: "inherit",
              }}
            >
              {event.communityName}
            </Link>
          ) : (
            event.communityName
          )}
        </Text>
        <Group gap="xs">
          <Button
            size="xs"
            variant="subtle"
            component="a"
            href={`mailto:${event.communityEmail}`}
          >
            Contact organizer
          </Button>
          {event.communityWebsite && (
            <Button
              size="xs"
              variant="subtle"
              component="a"
              href={event.communityWebsite}
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
  const [eventType, setEventType] = useState<"public" | "private">(
    event.public ? "public" : "private"
  );

  const supabase = createClient();

  const handleRegister = () => {
    setIsRegistered(true);
  };

  const handleUnregister = () => {
    setIsRegistered(false);
  };

  const handleCheckIn = async (
    attendeeId: string,
    checkedin: boolean = true
  ) => {
    // setAttendees((prev) =>
    //   prev.map((attendee) =>
    //     attendee.id === attendeeId
    //       ? { ...attendee, isCheckedIn: true }
    //       : attendee
    //   )
    // );
    console.log(attendeeId, checkedin);
    const { error } = await supabase
      .from("Attendees")
      .update({ checkedin: checkedin })
      .eq("member", attendeeId)
      .eq("event", event.id);
    console.log(error);
  };

  const handleCancel = async (attendeeId: string) => {
    await supabase
      .from("Attendees")
      .delete()
      .eq("member", attendeeId)
      .eq("event", event.id);
    // setAttendees((prev) =>
    //   prev.filter((attendee) => attendee.id !== attendeeId)
    // );
  };

  const handleRefund = async (attendeeId: string) => {
    await supabase
      .from("Attendees")
      .update({ paid: false })
      .eq("member", attendeeId)
      .eq("event", event.id);
    // setAttendees((prev) =>
    //   prev.map((attendee) =>
    //     attendee.id === attendeeId
    //       ? { ...attendee, paymentStatus: "refunded" as const }
    //       : attendee
    //   )
    // );
  };

  const handleAddAttendee = async (newAttendee: {
    name: string;
    email: string;
  }) => {
    console.log("Adding attendee:", newAttendee);
    const { data, error } = await supabase
      .from("Members")
      .insert({
        name: newAttendee.name,
        email: newAttendee.email,
      })
      .select();
    if (error) {
      console.error(error);
    }
    console.log("Added attendee:", data);
    if (data) {
      console.log("Adding attendee to attendees table:", event.id);
      const { error: attendeeError } = await supabase
        .from("Attendees")
        .insert({ member: data[0].id, event: event.id });
      if (attendeeError) {
        console.error(attendeeError);
      }
      console.log("Added attendee to attendees table:", attendeeError);
    }
  };

  const handleMarkAsPaid = async (attendeeId: string, paid: boolean = true) => {
    await supabase
      .from("Attendees")
      .update({ paid })
      .eq("member", attendeeId)
      .eq("event", event.id);
  };

  const handleChangeEventType = async (type: "public" | "private") => {
    setEventType(type);
    const { error } = await supabase
      .from("Events")
      .update({ public: type === "public" })
      .eq("id", event.id);
    if (error) {
      console.error(error);
    }
  };

  const handleDeleteEvent = async () => {
    await supabase.from("Events").delete().eq("id", event.id);
    // Navigate to community page after successful deletion
    if (typeof window !== "undefined" && event.communityId) {
      window.location.href = `/communities/${event.communityId}`;
    }
  };

  const details = (
    <>
      <Variable at="md">
        <Grid>
          <Grid.Col span={7}>
            <Stack gap="lg">
              <EventTitle event={event} />
              <EventDescription event={event} />
            </Stack>
          </Grid.Col>
          <Grid.Col span={5}>
            <Stack gap="lg">
              <Card withBorder radius="md" p="lg" w="100%">
                <Stack gap="md">
                  <EventDateTime event={event} />
                  <Divider />
                  <EventLocation event={event} />
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

          <EventDescription event={event} />
          <EventOrganizer event={event} />
        </Stack>
      </Variable>

      <EventTags event={event} />
    </>
  );
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <EventImage event={event} />
        {(event.currentUserRole === "owner" ||
          event.currentUserRole === "manager" ||
          event.currentUserRole === "event_creator" ||
          event.currentUserRole === "door_person") && (
          <Tabs defaultValue="details">
            <Tabs.List>
              <Tabs.Tab value="details">Event Details</Tabs.Tab>
              <Tabs.Tab value="attendees" data-testid="attendees-tab">
                Attendees ({event.attendees})
              </Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="details" pt="md">
              {details}
            </Tabs.Panel>

            <Tabs.Panel value="attendees" pt="md">
              <EventAttendees
                eventId={event.id}
                currentUserRole={event.currentUserRole}
                onCheckIn={handleCheckIn}
                onCancel={handleCancel}
                onRefund={handleRefund}
                onAddAttendee={handleAddAttendee}
                onMarkAsPaid={handleMarkAsPaid}
              />
            </Tabs.Panel>

            <Tabs.Panel value="settings" pt="md">
              <EventSettings
                eventId={event.id}
                eventName={event.title}
                eventType={eventType}
                currentUserRole={event.currentUserRole}
                onChangeEventType={handleChangeEventType}
                onDeleteEvent={handleDeleteEvent}
              />
            </Tabs.Panel>
          </Tabs>
        )}
        {event.currentUserRole === "member" && details}
      </Stack>
    </Container>
  );
}
