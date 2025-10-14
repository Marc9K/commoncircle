"use client";

import { Container, Loader, Stack, Tabs } from "@mantine/core";
import { CommunityEditForm } from "@/components/CommunityEditForm/CommunityEditForm";
import { CommunityManagers } from "@/components/CommunityManagers/CommunityManagers";
import { Members } from "@/components/Members/Members";
import { CommunitySettings } from "@/components/CommunitySettings/CommunitySettings";
import { CommunityDetailData } from "@/components/CommunityDetail/CommunityDetail";

export interface CommunityManager {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "manager" | "event_creator" | "door_person";
  joinedAt: string;
}

export interface PendingMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  requestedAt: string;
  message?: string;
}

export interface ExistingMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  role: "member" | "event_creator" | "door_person";
  isActive: boolean;
}

export interface CommunityManageProps {
  community?: CommunityDetailData;
  managers?: CommunityManager[];
  pendingMembers?: PendingMember[];
  existingMembers?: ExistingMember[];
}

export function CommunityManage({
  community,
  managers,
  pendingMembers,
  existingMembers,
}: CommunityManageProps) {
  if (!community) {
    return (
      <Container size="lg" mt={100}>
        <Loader />
      </Container>
    );
  }

  return (
    <Container size="lg" mt={100}>
      <Stack gap="lg">
        <Tabs defaultValue="details">
          <Tabs.List>
            <Tabs.Tab
              value="details"
              data-testid="community-details-tab"
              key="details-tab-tab"
            >
              Info
            </Tabs.Tab>
            <Tabs.Tab
              value="managers"
              data-testid="community-managers-tab"
              key="managers-tab-tab"
            >
              Leaders
            </Tabs.Tab>
            <Tabs.Tab value="members" data-testid="community-members-tab">
              Members
            </Tabs.Tab>
            <Tabs.Tab value="settings" data-testid="community-settings-tab">
              Settings
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="md" key="details-tab-panel">
            <CommunityEditForm community={community} />
          </Tabs.Panel>

          <Tabs.Panel value="managers" pt="md" key="managers-tab-panel">
            <CommunityManagers managers={managers as CommunityManager[]} />
          </Tabs.Panel>

          <Tabs.Panel value="members" pt="md">
            <Members
              pendingMembers={pendingMembers as PendingMember[]}
              existingMembers={existingMembers as ExistingMember[]}
            />
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="md">
            <CommunitySettings />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
