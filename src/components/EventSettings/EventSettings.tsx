"use client";

import {
  Stack,
  Group,
  Text,
  Button,
  Card,
  Switch,
  Divider,
  Title,
  Container,
  Alert,
  Modal,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { FcSettings, FcDeleteDatabase, FcLock, FcUnlock } from "react-icons/fc";

interface EventSettingsProps {
  eventId: string | number;
  eventName: string;
  isRegistrationOpen: boolean;
  eventType: "public" | "private";
  currentUserRole?:
    | "owner"
    | "manager"
    | "event_creator"
    | "door_person"
    | null;
  onToggleRegistration: (isOpen: boolean) => void;
  onChangeEventType: (type: "public" | "private") => void;
  onDeleteEvent: () => void;
}

function RegistrationSettings({
  isRegistrationOpen,
  onToggleRegistration,
}: {
  isRegistrationOpen: boolean;
  onToggleRegistration: (isOpen: boolean) => void;
}) {
  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <div>
            <Text fw={600} size="md">
              Registration Status
            </Text>
            <Text size="sm" c="dimmed">
              Control whether people can register for this event
            </Text>
          </div>
          <Switch
            checked={isRegistrationOpen}
            onChange={(event) =>
              onToggleRegistration(event.currentTarget.checked)
            }
            color="green"
            size="lg"
          />
        </Group>
        <Alert color={isRegistrationOpen ? "green" : "red"} variant="light">
          {isRegistrationOpen
            ? "Registration is currently open - people can register for this event"
            : "Registration is closed - no new registrations are allowed"}
        </Alert>
      </Stack>
    </Card>
  );
}

function EventTypeSettings({
  eventType,
  onChangeEventType,
}: {
  eventType: "public" | "private";
  onChangeEventType: (type: "public" | "private") => void;
}) {
  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="md">
        <div>
          <Text fw={600} size="md">
            Event Visibility
          </Text>
          <Text size="sm" c="dimmed">
            Who can see and register for this event
          </Text>
        </div>
        <Group gap="md">
          <Button
            variant={eventType === "public" ? "filled" : "outline"}
            color="blue"
            leftSection={<FcUnlock size={16} />}
            onClick={() => onChangeEventType("public")}
            style={{ flex: 1 }}
          >
            Anyone
          </Button>
          <Button
            variant={eventType === "private" ? "filled" : "outline"}
            color="red"
            leftSection={<FcLock size={16} />}
            onClick={() => onChangeEventType("private")}
            style={{ flex: 1 }}
          >
            Members
          </Button>
        </Group>
        <Alert color={eventType === "public" ? "blue" : "red"} variant="light">
          {eventType === "public"
            ? "This is a public event - anyone can see and register for it"
            : "This is a private event - only community members can see and register for it"}
        </Alert>
      </Stack>
    </Card>
  );
}

function DeleteEventSection({
  eventName,
  onDeleteEvent,
}: {
  eventName: string;
  onDeleteEvent: () => void;
}) {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = () => {
    if (confirmText === eventName) {
      onDeleteEvent();
      setDeleteModalOpened(false);
      setConfirmText("");
    }
  };

  return (
    <>
      <Card withBorder radius="md" p="lg" style={{ borderColor: "#ff6b6b" }}>
        <Stack gap="md">
          <div>
            <Text fw={600} size="md" c="red">
              Danger Zone
            </Text>
            <Text size="sm" c="dimmed">
              These actions cannot be undone
            </Text>
          </div>
          <Button
            variant="outline"
            color="red"
            leftSection={<FcDeleteDatabase size={16} />}
            onClick={() => setDeleteModalOpened(true)}
          >
            Delete Event
          </Button>
        </Stack>
      </Card>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Event"
        size="md"
      >
        <Stack gap="md">
          <Alert color="red" variant="light">
            This action cannot be undone. This will permanently delete the event
            and all associated data.
          </Alert>
          <Text size="sm">
            To confirm deletion, type the event name:{" "}
            <strong>{eventName}</strong>
          </Text>
          <TextInput
            placeholder="Enter event name to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpened(false)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              disabled={confirmText !== eventName}
            >
              Delete Event
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export function EventSettings({
  eventId,
  eventName,
  isRegistrationOpen,
  eventType,
  currentUserRole,
  onToggleRegistration,
  onChangeEventType,
  onDeleteEvent,
}: EventSettingsProps) {
  const canManage =
    currentUserRole === "owner" ||
    currentUserRole === "manager" ||
    currentUserRole === "event_creator";

  if (!canManage) {
    return (
      <Container size="md" py="xl">
        <Card withBorder radius="md" p="xl" style={{ textAlign: "center" }}>
          <Stack gap="md">
            <FcSettings size={48} style={{ margin: "0 auto" }} />
            <Text size="lg" c="dimmed">
              Access Denied
            </Text>
            <Text size="sm" c="dimmed">
              You don't have permission to manage this event's settings
            </Text>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <RegistrationSettings
          isRegistrationOpen={isRegistrationOpen}
          onToggleRegistration={onToggleRegistration}
        />

        <EventTypeSettings
          eventType={eventType}
          onChangeEventType={onChangeEventType}
        />

        <Divider />

        <DeleteEventSection
          eventName={eventName}
          onDeleteEvent={onDeleteEvent}
        />
      </Stack>
    </Container>
  );
}
