"use client";

import { createClient } from "@/lib/supabase/client";
import useSWR, { mutate } from "swr";
import {
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Menu,
  ActionIcon,
  Card,
  Grid,
  Modal,
  TextInput,
  Divider,
  Title,
  Container,
  Input,
  Paper,
} from "@mantine/core";
import { useState, useMemo } from "react";
import { FcCancel, FcDownLeft, FcExpand, FcSearch } from "react-icons/fc";

export interface Attendee {
  id: string;
  created_at: string;
  checkedin: boolean;
  paid: boolean | null;
  member: string;
  Members: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  }[];
}

interface EventAttendeesProps {
  eventId: string | number;
  currentUserRole?:
    | "owner"
    | "manager"
    | "event_creator"
    | "door_person"
    | "member"
    | null;
  onCheckIn: (attendeeId: string, checkedin?: boolean) => Promise<void>;
  onCancel: (attendeeId: string) => Promise<void>;
  onRefund: (attendeeId: string) => Promise<void>;
  onAddAttendee: (attendee: {
    name: string;
    email: string;
    checkedIn: boolean;
  }) => Promise<void>;
  onMarkAsPaid: (attendeeId: string) => Promise<void>;
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
    | "member"
    | null;
  onCheckIn: (attendeeId: string, checkedin?: boolean) => Promise<void>;
  onCancel: (attendeeId: string) => void;
  onRefund: (attendeeId: string) => Promise<void>;
  onMarkAsPaid: (attendeeId: string) => Promise<void>;
}) {
  const canManage =
    currentUserRole === "owner" ||
    currentUserRole === "manager" ||
    currentUserRole === "door_person";

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      data-testid={`attendee-card-${attendee.id}`}
    >
      <Group justify="space-between" align="flex-start">
        <Group gap="sm" style={{ flex: 1 }}>
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text fw={500} size="sm">
              {attendee.Members.name}
            </Text>
            <Text size="xs" c="dimmed">
              {attendee.Members.email}
            </Text>
            <Group gap="xs">
              {/* <Badge
                size="xs"
                color={getRoleColor(attendee.role)}
                variant="light"
              >
                {getRoleLabel(attendee.role)}
              </Badge> */}
              <Badge
                size="xs"
                color={
                  attendee.paid == undefined
                    ? "yellow"
                    : attendee.paid
                    ? "green"
                    : "red"
                }
                variant="light"
              >
                {attendee.paid == undefined
                  ? "Pending payment"
                  : attendee.paid
                  ? "Paid"
                  : "Not paid"}
              </Badge>
              {attendee.checkedin && (
                <Badge size="xs" color="green" variant="light">
                  Checked In
                </Badge>
              )}
            </Group>
          </Stack>
        </Group>

        {canManage && (
          <Group gap="xs">
            {!attendee.checkedin && (
              <Button
                size="xs"
                variant="light"
                color="green"
                onClick={async () => await onCheckIn(attendee.member)}
                data-testid={`check-in-button`}
              >
                Check In
              </Button>
            )}

            {(attendee.paid == undefined || attendee.paid == false) && (
              <Button
                size="xs"
                variant="light"
                color="blue"
                onClick={() => onMarkAsPaid(attendee.member)}
                data-testid={`mark-paid-button`}
              >
                Paid
              </Button>
            )}

            {
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    data-testid={`attendee-menu`}
                  >
                    <FcExpand size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {attendee.checkedin && (
                    <Menu.Item
                      onClick={() => onCheckIn(attendee.member, false)}
                      data-testid="uncheck-in-menu-item"
                    >
                      Uncheck In
                    </Menu.Item>
                  )}
                  <Menu.Item
                    color="red"
                    leftSection={<FcCancel size={14} />}
                    onClick={() => onCancel(attendee.member)}
                    data-testid="cancel-menu-item"
                  >
                    Cancel
                  </Menu.Item>
                  {attendee.paid && (
                    <Menu.Item
                      color="orange"
                      leftSection={<FcDownLeft size={14} />}
                      onClick={async () => await onRefund(attendee.member)}
                      data-testid="refund-menu-item"
                    >
                      Refund
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            }
          </Group>
        )}
      </Group>
    </Paper>
  );
}

function AddAttendeeModal({
  opened,
  onClose,
  onSubmit,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (attendee: { name: string; email: string }) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // role: "non_affiliated" as Attendee["role"],
  });

  const handleSubmit = () => {
    if (formData.name && formData.email) {
      console.log("Submitting form:", formData);
      onSubmit({
        name: formData.name,
        email: formData.email,
      });
      setFormData({ name: "", email: "" });
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
          data-testid="attendee-name-input"
        />
        <TextInput
          label="Email"
          placeholder="Enter attendee email"
          type="email"
          inputMode="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          data-testid="attendee-email-input"
        />
        {/* <Select
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
        /> */}
        <Group justify="flex-end" gap="sm">
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="add-attendee-cancel-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            data-testid="add-attendee-submit-button"
          >
            Add Attendee
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export function EventAttendees({
  eventId,
  currentUserRole,
  onCheckIn,
  onCancel,
  onRefund,
  onAddAttendee,
  onMarkAsPaid,
}: EventAttendeesProps) {
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [attendees, setAttendees] = useState<Attendee[]>([]);
  const supabase = createClient();
  const fetchAttendees = async () => {
    const { data: attendees, error: attendeesError } = await supabase
      .from("Attendees")
      .select(
        "id, created_at, checkedin, paid, member, Members (id, name, email, avatar_url)"
      )
      .eq("event", eventId);

    if (attendeesError) {
      console.error(attendeesError);
    }
    // setAttendees(attendees || []);
    return attendees || [];
  };
  const { data: attendees = [] } = useSWR("attendees", fetchAttendees);
  // useEffect(() => {
  //   fetchAttendees();
  // }, [eventId]);

  const canManage =
    currentUserRole === "owner" ||
    currentUserRole === "manager" ||
    currentUserRole === "door_person";

  // Filter attendees based on search query
  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) {
      return attendees || [];
    }

    const query = searchQuery.toLowerCase();
    return (attendees || []).filter(
      (attendee) =>
        attendee.Members.name.toLowerCase().includes(query) ||
        attendee.Members.email.toLowerCase().includes(query)
    );
  }, [attendees, searchQuery]);

  const checkedInCount = (attendees || []).filter((a) => a.checkedin).length;
  const totalCount = (attendees || []).length;

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
              data-testid="add-attendee-button"
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

        {(attendees || []).length === 0 ? (
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
        ) : (filteredAttendees || []).length === 0 ? (
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
            {(attendees || []).map((attendee) => (
              <Grid.Col key={attendee.id} span={{ base: 12, sm: 6 }}>
                <AttendeeCard
                  attendee={attendee}
                  currentUserRole={currentUserRole}
                  onCheckIn={async (attendeeId, checkedin) => {
                    await onCheckIn(attendeeId, checkedin);
                    mutate("attendees");
                  }}
                  onCancel={async () => {
                    await onCancel(attendee.member);
                    mutate("attendees");
                  }}
                  onRefund={async () => {
                    await onRefund(attendee.member);
                    mutate("attendees");
                  }}
                  onMarkAsPaid={async () => {
                    await onMarkAsPaid(attendee.member);
                    mutate("attendees");
                  }}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}

        <AddAttendeeModal
          opened={addModalOpened}
          onClose={() => setAddModalOpened(false)}
          onSubmit={async (attendee) => {
            await onAddAttendee(attendee);
            mutate("attendees");
          }}
        />
      </Stack>
    </Container>
  );
}
