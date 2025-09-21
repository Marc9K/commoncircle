"use client";

import {
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Menu,
  ActionIcon,
  Avatar,
  Card,
  Grid,
  Modal,
  TextInput,
  Select,
  Divider,
  Title,
  Container,
  Input,
} from "@mantine/core";
import { useState, useMemo } from "react";
import { FcCancel, FcDownLeft, FcExpand, FcOk, FcSearch } from "react-icons/fc";

export interface Attendee {
  id: string;
  name: string;
  email: string;
  role:
    | "member"
    | "event_creator"
    | "manager"
    | "owner"
    | "door_person"
    | "non_affiliated";
  isCheckedIn: boolean;
  registrationDate: string;
  paymentStatus?: "paid" | "pending" | "refunded";
}

interface EventAttendeesProps {
  attendees: Attendee[];
  currentUserRole?:
    | "owner"
    | "manager"
    | "event_creator"
    | "door_person"
    | null;
  onCheckIn: (attendeeId: string) => void;
  onCancel: (attendeeId: string) => void;
  onRefund: (attendeeId: string) => void;
  onAddAttendee: (attendee: Omit<Attendee, "id" | "registrationDate">) => void;
  onMarkAsPaid: (attendeeId: string) => void;
}

function getRoleColor(role: Attendee["role"]) {
  switch (role) {
    case "owner":
      return "red";
    case "manager":
      return "orange";
    case "event_creator":
      return "blue";
    case "door_person":
      return "purple";
    case "member":
      return "cyan";
    case "non_affiliated":
      return "gray";
    default:
      return "gray";
  }
}

function getRoleLabel(role: Attendee["role"]) {
  switch (role) {
    case "owner":
      return "Owner";
    case "manager":
      return "Manager";
    case "event_creator":
      return "Event Creator";
    case "door_person":
      return "Door Person";
    case "member":
      return "Member";
    case "non_affiliated":
      return "Non-Affiliated";
    default:
      return "Unknown";
  }
}

function AttendeeCard({
  attendee,
  currentUserRole,
  onCheckIn,
  onCancel,
  onRefund,
  onMarkAsPaid,
}: {
  attendee: Attendee;
  currentUserRole?:
    | "owner"
    | "manager"
    | "event_creator"
    | "door_person"
    | null;
  onCheckIn: (attendeeId: string) => void;
  onCancel: (attendeeId: string) => void;
  onRefund: (attendeeId: string) => void;
  onMarkAsPaid: (attendeeId: string) => void;
}) {
  const canManage =
    currentUserRole === "owner" ||
    currentUserRole === "manager" ||
    currentUserRole === "door_person";

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" align="flex-start">
        <Group gap="sm" style={{ flex: 1 }}>
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text fw={500} size="sm">
              {attendee.name}
            </Text>
            <Text size="xs" c="dimmed">
              {attendee.email}
            </Text>
            <Group gap="xs">
              <Badge
                size="xs"
                color={getRoleColor(attendee.role)}
                variant="light"
              >
                {getRoleLabel(attendee.role)}
              </Badge>
              {attendee.paymentStatus && (
                <Badge
                  size="xs"
                  color={
                    attendee.paymentStatus === "paid"
                      ? "green"
                      : attendee.paymentStatus === "pending"
                      ? "yellow"
                      : "red"
                  }
                  variant="light"
                >
                  {attendee.paymentStatus}
                </Badge>
              )}
              {attendee.isCheckedIn && (
                <Badge size="xs" color="green" variant="light">
                  Checked In
                </Badge>
              )}
            </Group>
          </Stack>
        </Group>

        <Group gap="xs">
          {canManage && !attendee.isCheckedIn && (
            <Button
              size="xs"
              variant="light"
              color="green"
              leftSection={<FcOk size={14} />}
              onClick={() => onCheckIn(attendee.id)}
            >
              Check In
            </Button>
          )}

          {canManage && attendee.paymentStatus === "pending" && (
            <Button
              size="xs"
              variant="light"
              color="blue"
              leftSection={<FcOk size={14} />}
              onClick={() => onMarkAsPaid(attendee.id)}
            >
              Paid
            </Button>
          )}

          {canManage && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <FcExpand size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>Uncheck In</Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<FcCancel size={14} />}
                  onClick={() => onCancel(attendee.id)}
                >
                  Cancel
                </Menu.Item>
                {attendee.paymentStatus === "paid" && (
                  <Menu.Item
                    color="orange"
                    leftSection={<FcDownLeft size={14} />}
                    onClick={() => onRefund(attendee.id)}
                  >
                    Refund
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>
    </Card>
  );
}

function AddAttendeeModal({
  opened,
  onClose,
  onSubmit,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (attendee: Omit<Attendee, "id" | "registrationDate">) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "non_affiliated" as Attendee["role"],
  });

  const handleSubmit = () => {
    if (formData.name && formData.email) {
      onSubmit({
        ...formData,
        isCheckedIn: false,
        paymentStatus: "pending",
      });
      setFormData({ name: "", email: "", role: "non_affiliated" });
      onClose();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add Attendee" size="md">
      <Stack gap="md">
        <TextInput
          label="Name"
          placeholder="Enter attendee name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextInput
          label="Email"
          placeholder="Enter attendee email"
          type="email"
          inputMode="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Select
          label="Role"
          placeholder="Select role"
          value={formData.role}
          onChange={(value) =>
            setFormData({ ...formData, role: value as Attendee["role"] })
          }
          data={[
            { value: "member", label: "Member" },
            { value: "non_affiliated", label: "Non-Affiliated" },
          ]}
        />
        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Attendee</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export function EventAttendees({
  attendees,
  currentUserRole,
  onCheckIn,
  onCancel,
  onRefund,
  onAddAttendee,
  onMarkAsPaid,
}: EventAttendeesProps) {
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const canManage =
    currentUserRole === "owner" ||
    currentUserRole === "manager" ||
    currentUserRole === "door_person";

  // Filter attendees based on search query
  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) {
      return attendees;
    }

    const query = searchQuery.toLowerCase();
    return attendees.filter(
      (attendee) =>
        attendee.name.toLowerCase().includes(query) ||
        attendee.email.toLowerCase().includes(query)
    );
  }, [attendees, searchQuery]);

  const checkedInCount = attendees.filter((a) => a.isCheckedIn).length;
  const totalCount = attendees.length;

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} size="h3">
              Attendees ({totalCount})
            </Title>
            <Text c="dimmed" size="sm">
              {checkedInCount} checked in
            </Text>
          </div>
          {canManage && (
            <Button
              //   leftSection={<IconUserPlus size={16} />}
              onClick={() => setAddModalOpened(true)}
            >
              Add Attendee
            </Button>
          )}
        </Group>

        <Input
          placeholder="Search attendees by name or email..."
          leftSection={<FcSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="md"
        />

        <Divider />

        {attendees.length === 0 ? (
          <Card withBorder radius="md" p="xl" style={{ textAlign: "center" }}>
            <Stack gap="md">
              <Text size="lg" c="dimmed">
                No attendees yet
              </Text>
              <Text size="sm" c="dimmed">
                Attendees will appear here once they register for the event
              </Text>
            </Stack>
          </Card>
        ) : filteredAttendees.length === 0 ? (
          <Card withBorder radius="md" p="xl" style={{ textAlign: "center" }}>
            <Stack gap="md">
              <Text size="lg" c="dimmed">
                No attendees found
              </Text>
              <Text size="sm" c="dimmed">
                Try adjusting your search terms
              </Text>
            </Stack>
          </Card>
        ) : (
          <Grid>
            {attendees.map((attendee) => (
              <Grid.Col key={attendee.id} span={{ base: 12, sm: 6 }}>
                <AttendeeCard
                  attendee={attendee}
                  currentUserRole={currentUserRole}
                  onCheckIn={onCheckIn}
                  onCancel={onCancel}
                  onRefund={onRefund}
                  onMarkAsPaid={onMarkAsPaid}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}

        <AddAttendeeModal
          opened={addModalOpened}
          onClose={() => setAddModalOpened(false)}
          onSubmit={onAddAttendee}
        />
      </Stack>
    </Container>
  );
}
