"use client";

import {
  Stack,
  Card,
  Title,
  Text,
  Group,
  Table,
  ActionIcon,
  Avatar,
} from "@mantine/core";
import { useState } from "react";
import { FcCancel, FcOk } from "react-icons/fc";
import { createClient } from "@/lib/supabase/client";
import { mutate } from "swr";

export interface PendingMember {
  role: "owner" | "manager" | "event_creator" | "door_person";
  created_at: string;
  community: number;
  Members: {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
    uid: string;
  };
}

export type PropPendingMember = {
  role: "owner" | "manager" | "event_creator" | "door_person";
  created_at: string;
  community: number;
  Members: {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
    uid: string;
  };
};

interface PendingMembersProps {
  pendingMembers: PropPendingMember[];
  communityId?: string | number;
}

export function PendingMembers({ pendingMembers }: PendingMembersProps) {
  const [isProcessing, setIsProcessing] = useState<string | number | null>(
    null
  );
  const supabase = createClient();
  const handleApprove = async (member: PendingMember) => {
    setIsProcessing(member.Members.id);
    const { error } = await supabase
      .from("Circles")
      .update({ role: "member" })
      .eq("member", member.Members.id)
      .eq("community", member.community);
    if (error) {
      console.error(error);
    } else {
      mutate("members");
      setIsProcessing(null);
    }
  };

  const handleReject = async (member: PendingMember) => {
    setIsProcessing(member.Members.id);
    const { error } = await supabase
      .from("Circles")
      .delete()
      .eq("member", member.Members.id)
      .eq("community", member.community);
    if (error) {
      console.error(error);
    } else {
      mutate("members");
      setIsProcessing(null);
    }
  };

  return (
    <Stack gap="lg" data-testid="pending-members-section">
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
                <Table.Tr key={member.Members.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar
                        src={member.Members.avatar_url}
                        alt={member.Members.name}
                        size="sm"
                        radius="xl"
                      />
                      <Stack gap={0}>
                        <Text fw={500} size="sm">
                          {member.Members.name}
                        </Text>
                        <Text size="xs" c="dimmed" data-testid="member-email">
                          {member.Members.email}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(member.created_at).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        data-testid="approve-member-button"
                        color="green"
                        variant="light"
                        onClick={() => handleApprove(member)}
                        loading={isProcessing === member.Members.id}
                        disabled={isProcessing !== null}
                      >
                        <FcOk size={16} />
                      </ActionIcon>
                      <ActionIcon
                        data-testid="reject-member-button"
                        color="red"
                        variant="light"
                        onClick={() => handleReject(member)}
                        loading={isProcessing === member.Members.id}
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
