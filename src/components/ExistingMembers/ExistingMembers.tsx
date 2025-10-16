"use client";

import {
  Stack,
  Card,
  Title,
  Text,
  Group,
  Button,
  Table,
  Badge,
  Modal,
  Select,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import RoleMenu, { ROLE_OPTIONS } from "../RoleMenu/RoleMenu";
import { CommunityManager } from "../CommunityManage/CommunityManage";
import { PropExistingMember } from "../Members/Members";

export interface ExistingMember {
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

// type PropExistingMember = {
//   role: "owner" | "manager" | "event_creator" | "door_person";
//   created_at: string;
//   community: number;
//   Members: {
//     id: number;
//     name: string;
//     email: string;
//     avatar_url: string;
//     uid: string;
//   };
// };

interface ExistingMembersProps {
  existingMembers: PropExistingMember[];
}

export function ExistingMembers({ existingMembers }: ExistingMembersProps) {
  const [opened, { close }] = useDisclosure(false);
  const [selectedMember, setSelectedMember] = useState<ExistingMember | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMember || !selectedRole) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      close();
      setSelectedMember(null);
      setSelectedRole("");
    }, 1000);
  };

  return (
    <Stack gap="lg" data-testid="existing-members-section">
      <Stack gap="xs">
        <Title order={3}>Community Members</Title>
        <Text size="sm" c="dimmed">
          Manage existing members and promote them to leadership roles.
        </Text>
      </Stack>

      <Card withBorder padding="lg">
        {existingMembers.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No members found
          </Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Member</Table.Th>
                <Table.Th>Joined</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {existingMembers.map((member) => (
                <Table.Tr key={member.Members?.uid}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar
                        src={member.Members?.avatar_url}
                        alt={member.Members?.name}
                        size="sm"
                        radius="xl"
                      />
                      <div>
                        <Text fw={500} size="sm">
                          {member.Members?.name}
                        </Text>
                        <Text size="xs" c="dimmed" data-testid="member-email">
                          {member.Members?.email}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(member.created_at).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={
                        member.role === "event_creator"
                          ? "green"
                          : member.role === "door_person"
                          ? "orange"
                          : "blue"
                      }
                      size="sm"
                      data-testid="member-role"
                    >
                      {member.role.replace("_", " ")}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <RoleMenu
                      manager={member as unknown as CommunityManager}
                      currentUserRole={"owner"}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        title={
          selectedRole === "manager" ? "Promote to Manager" : "Assign Role"
        }
      >
        <Stack gap="md">
          <Text size="sm">
            {selectedRole === "manager"
              ? `Are you sure you want to promote ${selectedMember?.Members?.name} to manager? They will be able to manage community settings and members.`
              : `Assign a role to ${selectedMember?.Members?.name}:`}
          </Text>

          {selectedRole !== "manager" && (
            <Select
              label="Role"
              placeholder="Select a role"
              data={ROLE_OPTIONS}
              value={selectedRole}
              onChange={(value) => setSelectedRole(value || "")}
              required
            />
          )}

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!selectedRole}
            >
              {selectedRole === "manager" ? "Promote" : "Assign Role"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
