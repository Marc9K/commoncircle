import { CommunityManager } from "@/app/communities/[id]/manage/page";
import { ActionIcon, Divider, Menu } from "@mantine/core";
import { FcEmptyTrash, FcSupport } from "react-icons/fc";

export const ROLE_OPTIONS = [
  {
    value: "owner",
    label: "Owner",
    description: "Full control over community",
  },
  {
    value: "manager",
    label: "Manager",
    description: "Manage community settings and members",
  },
  {
    value: "event_creator",
    label: "Event Creator",
    description: "Create and manage events",
  },
  {
    value: "door_person",
    label: "Door Person",
    description: "Check-in attendees at events",
  },
  {
    value: "member",
    label: "Member",
    description: "Member of the community",
  },
];

interface RoleMenuProps {
  manager: CommunityManager;
  currentUserRole: "owner" | "manager" | "event_creator" | "door_person";
}

export default function RoleMenu({ manager }: RoleMenuProps) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <FcSupport />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Change Role</Menu.Label>
        {ROLE_OPTIONS.map((role) => (
          <Menu.Item key={role.value}>{role.label}</Menu.Item>
        ))}
        <Divider />
        <Menu.Item
          color="red"
          rightSection={<FcEmptyTrash size={14} />}
          disabled={manager.role === "owner"}
        >
          Outcast
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
