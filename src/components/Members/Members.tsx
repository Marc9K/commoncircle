"use client";

import { Tabs } from "@mantine/core";
import {
  PendingMembers,
  PendingMember,
} from "../PendingMembers/PendingMembers";
import {
  ExistingMembers,
  ExistingMember,
} from "../ExistingMembers/ExistingMembers";

interface MembersProps {
  communityId: string;
  pendingMembers: PendingMember[];
  existingMembers: ExistingMember[];
  currentUserRole: "owner" | "manager" | "event_creator" | "door_person";
}

export function Members({
  communityId,
  pendingMembers,
  existingMembers,
  currentUserRole,
}: MembersProps) {
  return (
    <Tabs defaultValue="pending">
      <Tabs.List>
        <Tabs.Tab value="pending">Pending ({pendingMembers.length})</Tabs.Tab>
        <Tabs.Tab value="existing">
          Existing ({existingMembers.length})
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="pending" pt="md">
        <PendingMembers
          communityId={communityId}
          pendingMembers={pendingMembers}
          currentUserRole={currentUserRole}
        />
      </Tabs.Panel>

      <Tabs.Panel value="existing" pt="md">
        <ExistingMembers
          communityId={communityId}
          existingMembers={existingMembers}
          currentUserRole={currentUserRole}
        />
      </Tabs.Panel>
    </Tabs>
  );
}
