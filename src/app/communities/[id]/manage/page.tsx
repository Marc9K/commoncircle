"use client";

import { Header } from "@/components/header/Header";
import { AppShell, Container, Stack, Tabs } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { CommunityEditForm } from "@/components/CommunityEditForm/CommunityEditForm";
import { CommunityManagers } from "@/components/CommunityManagers/CommunityManagers";
import { Members } from "@/components/Members/Members";
import { CommunitySettings } from "@/components/CommunitySettings/CommunitySettings";
import { CommunityDetailData } from "../page";

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

export default function CommunityManagePage({
  community,
  managers,
  pendingMembers,
  existingMembers,
}: {
  community: CommunityDetailData;
  managers: CommunityManager[];
  pendingMembers: PendingMember[];
  existingMembers: ExistingMember[];
}) {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  //   if (!id) return <Text>Community not found</Text>;

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main mt={{ base: 60, sm: 30 }}>
        <Container size="lg">
          <Stack gap="lg">
            <Tabs defaultValue="details">
              <Tabs.List>
                <Tabs.Tab value="details">Info</Tabs.Tab>
                <Tabs.Tab value="managers">Leaders</Tabs.Tab>
                <Tabs.Tab value="members">Members</Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="details" pt="md">
                <CommunityEditForm community={community} />
              </Tabs.Panel>

              <Tabs.Panel value="managers" pt="md">
                <CommunityManagers
                  communityId={id}
                  managers={managers}
                  currentUserRole="owner"
                />
              </Tabs.Panel>

              <Tabs.Panel value="members" pt="md">
                <Members
                  communityId={id}
                  pendingMembers={pendingMembers}
                  existingMembers={existingMembers}
                  currentUserRole="owner"
                />
              </Tabs.Panel>

              <Tabs.Panel value="settings" pt="md">
                <CommunitySettings communityId={id} currentUserRole="owner" />
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
