"use client";

import { Tabs } from "@mantine/core";
import {
  PendingMembers,
  PropPendingMember,
} from "../PendingMembers/PendingMembers";
import { ExistingMembers } from "../ExistingMembers/ExistingMembers";

export type PropExistingMember = {
  role: "owner" | "manager" | "event_creator" | "door_person";
  created_at: string;
  community: number;
  Members: {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
    uid: string;
  }[];
};

interface MembersProps {
  pendingMembers: PropPendingMember[];
  existingMembers: PropExistingMember[];
  communityId?: string | number;
}

export function Members({ pendingMembers, existingMembers }: MembersProps) {
  return (
    <Tabs defaultValue="pending">
      <Tabs.List>
        <Tabs.Tab value="pending" data-testid="pending-members-tab">
          Pending ({pendingMembers.length})
        </Tabs.Tab>
        <Tabs.Tab value="existing" data-testid="existing-members-tab">
          Existing ({existingMembers.length})
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="pending" pt="md">
        <PendingMembers
          pendingMembers={pendingMembers as unknown as PropPendingMember[]}
        />
      </Tabs.Panel>

      <Tabs.Panel value="existing" pt="md">
        <ExistingMembers existingMembers={existingMembers} />
      </Tabs.Panel>
    </Tabs>
  );
}
