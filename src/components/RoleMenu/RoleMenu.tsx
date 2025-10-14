import { CommunityManager } from "@/components/CommunityManage/CommunityManage";
import { createClient } from "@/lib/supabase/client";
import { ActionIcon, Divider, Menu } from "@mantine/core";
import { FcCheckmark, FcEmptyTrash, FcSupport } from "react-icons/fc";
import { mutate } from "swr";

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

export default function RoleMenu({ manager, currentUserRole }: RoleMenuProps) {
  const supabase = createClient();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          data-testid="role-menu-button"
        >
          <FcSupport />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Change Role</Menu.Label>
        {ROLE_OPTIONS.map((role) => {
          if (role.value === manager.role)
            return (
              <Menu.Item
                key={role.value}
                leftSection={<FcCheckmark size={14} />}
                disabled
              >
                {role.label}
              </Menu.Item>
            );
          return (
            <Menu.Item
              key={role.value}
              data-testid={`role-${role.value}-option`}
              onClick={async () => {
                const { error } = await supabase
                  .from("Circles")
                  .update({ role: role.value })
                  .eq("member", manager.Members.id);
                if (error) {
                  console.error(error);
                } else {
                  mutate("members");
                }
              }}
            >
              {role.label}
            </Menu.Item>
          );
        })}
        <Divider />
        <Menu.Item
          color="red"
          rightSection={<FcEmptyTrash size={14} />}
          disabled={manager.role === "owner"}
          data-testid="remove-member-option"
          onClick={async () => {
            console.log("outcasting", manager.Members.id);
            console.log("community", manager.community);
            const { error } = await supabase
              .from("Circles")
              .delete()
              .eq("member", manager.Members.id)
              .eq("community", manager.community);
            if (error) {
              console.error(error);
            } else {
              mutate("members");
            }
          }}
        >
          Outcast
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
