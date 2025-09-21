"use client";

import {
  Stack,
  Card,
  Title,
  Text,
  Group,
  Table,
  ActionIcon,
  Alert,
} from "@mantine/core";
import { useState } from "react";
import { FcCancel, FcOk } from "react-icons/fc";

export interface PendingMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  requestedAt: string;
  message?: string;
}

interface PendingMembersProps {
  communityId: string;
  pendingMembers: PendingMember[];
  currentUserRole: "owner" | "manager" | "event_creator" | "door_person";
}

export function PendingMembers({
  pendingMembers,
  currentUserRole,
}: PendingMembersProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const canManageMembers =
    currentUserRole === "owner" || currentUserRole === "manager";

  const handleApprove = async (memberId: string) => {
    setIsProcessing(memberId);
    setTimeout(() => setIsProcessing(null), 1000);
  };

  const handleReject = async (memberId: string) => {
    setIsProcessing(memberId);
    setTimeout(() => setIsProcessing(null), 1000);
  };

  if (!canManageMembers) {
    return (
      <Alert color="yellow" title="Limited Access">
        You need owner or manager permissions to manage member requests.
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Title order={3}>Pending Member Requests</Title>
        <Text size="sm" c="dimmed">
          Review and approve or reject membership requests for your community.
        </Text>
      </Stack>

      <Card withBorder padding="lg">
        {pendingMembers.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No pending member requests
          </Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Member</Table.Th>
                <Table.Th>Requested</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pendingMembers.map((member) => (
                <Table.Tr key={member.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Stack gap={0}>
                        <Text fw={500} size="sm">
                          {member.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {member.email}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(member.requestedAt).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        color="green"
                        variant="light"
                        onClick={() => handleApprove(member.id)}
                        loading={isProcessing === member.id}
                        disabled={isProcessing !== null}
                      >
                        <FcOk size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => handleReject(member.id)}
                        loading={isProcessing === member.id}
                        disabled={isProcessing !== null}
                      >
                        <FcCancel size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Stack>
  );
}
