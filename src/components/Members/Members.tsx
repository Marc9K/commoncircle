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
  pendingMembers: PendingMember[];
  existingMembers: ExistingMember[];
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
        <PendingMembers pendingMembers={pendingMembers} />
      </Tabs.Panel>

      <Tabs.Panel value="existing" pt="md">
        <ExistingMembers existingMembers={existingMembers} />
      </Tabs.Panel>
    </Tabs>
  );
}
