"use client";

import {
  Stack,
  Card,
  Title,
  Text,
  Group,
  Button,
  Select,
  Modal,
  TextInput,
  Table,
  Badge,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { CommunityManager } from "@/components/CommunityManage/CommunityManage";
import RoleMenu, { ROLE_OPTIONS } from "../RoleMenu/RoleMenu";

interface CommunityManagersProps {
  communityId: string;
  managers: CommunityManager[];
  currentUserRole: "owner" | "manager" | "event_creator" | "door_person";
}

const ROLE_COLORS = {
  owner: "red",
  manager: "blue",
  event_creator: "green",
  door_person: "orange",
} as const;

export function CommunityManagers({
  managers,
  currentUserRole,
}: CommunityManagersProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageManagers =
    currentUserRole === "owner" || currentUserRole === "manager";
  const canEditRole = (manager: CommunityManager) => {
    if (currentUserRole === "owner") return true;
    if (currentUserRole === "manager" && manager.role !== "owner") return true;
    return false;
  };

  const handleAddManager = () => {
    if (!searchEmail || !selectedRole) return;

    setIsSubmitting(true);
    close();
    setSearchEmail("");
    setSelectedRole("");
    setIsSubmitting(false);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        {canManageManagers && (
          <Button
            // leftSection={<IconPlus size={16} />}
            onClick={open}
          >
            Add Leader
          </Button>
        )}
      </Group>

      {!canManageManagers && (
        <Alert color="yellow" title="Limited Access">
          You need owner or manager permissions to manage community roles.
        </Alert>
      )}

      <Card withBorder padding="lg">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Manager</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {managers.map((manager) => (
              <Table.Tr key={manager.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Stack gap={2}>
                      <Text size="sm" fw={500}>
                        {manager.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {manager.email}
                      </Text>
                    </Stack>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Badge color={ROLE_COLORS[manager.role]} size="sm">
                      {
                        ROLE_OPTIONS.find((r) => r.value === manager.role)
                          ?.label
                      }
                    </Badge>
                  </Stack>
                </Table.Td>
                {canEditRole(manager) && (
                  <Table.Td>
                    <RoleMenu manager={manager} currentUserRole={"owner"} />
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        title="Add Community Manager"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Email Address"
            placeholder="user@example.com"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.currentTarget.value)}
            required
          />

          <Select
            label="Role"
            placeholder="Select a role"
            data={ROLE_OPTIONS}
            value={selectedRole}
            onChange={(value) => setSelectedRole(value || "")}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={handleAddManager}
              loading={isSubmitting}
              disabled={!searchEmail || !selectedRole}
            >
              Add Manager
            </Button>
          </Group>
          <Card withBorder padding="lg">
            <Title order={4} mb="md">
              Role Permissions
            </Title>
            <Stack gap="sm">
              {ROLE_OPTIONS.map((role) => (
                <Group key={role.value} align="flex-start" gap="md">
                  <Badge
                    color={ROLE_COLORS[role.value as keyof typeof ROLE_COLORS]}
                    size="sm"
                  >
                    {role.label}
                  </Badge>
                  <Text size="sm" style={{ flex: 1 }}>
                    {role.description}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Modal>
    </Stack>
  );
}
