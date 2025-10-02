"use client";

import { Header } from "@/components/header/Header";
import { AppShell, Container, Stack, Tabs } from "@mantine/core";
import { CommunityEditForm } from "@/components/CommunityEditForm/CommunityEditForm";
import { CommunityManagers } from "@/components/CommunityManagers/CommunityManagers";
import { Members } from "@/components/Members/Members";
import { CommunitySettings } from "@/components/CommunitySettings/CommunitySettings";
import { CommunityDetailData } from "@/components/CommunityDetail/CommunityDetail";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

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
  communityId?: string;
}

export function CommunityManage({ communityId }: CommunityManageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [community, setCommunity] = useState<CommunityDetailData | undefined>(
    undefined
  );
  const [managers, setManagers] = useState<CommunityManager[]>([]);
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [existingMembers, setExistingMembers] = useState<ExistingMember[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<
    "owner" | "manager" | "event_creator" | "door_person" | null
  >("owner");

  useEffect(() => {
    const fetchCommunity = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("id", communityId);

      setCommunity(data?.[0]);
    };
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      setUser(data.user);
    };
    if (communityId) {
      fetchCommunity();
      fetchUser();
    }
  }, [communityId]);
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
                  communityId={communityId as string}
                  managers={managers as CommunityManager[]}
                  currentUserRole={
                    currentUserRole as
                      | "owner"
                      | "manager"
                      | "event_creator"
                      | "door_person"
                  }
                />
              </Tabs.Panel>

              <Tabs.Panel value="members" pt="md">
                <Members
                  communityId={communityId as string}
                  pendingMembers={pendingMembers as PendingMember[]}
                  existingMembers={existingMembers as ExistingMember[]}
                  currentUserRole={
                    currentUserRole as
                      | "owner"
                      | "manager"
                      | "event_creator"
                      | "door_person"
                  }
                />
              </Tabs.Panel>

              <Tabs.Panel value="settings" pt="md">
                <CommunitySettings
                  communityId={communityId as string}
                  currentUserRole={
                    currentUserRole as
                      | "owner"
                      | "manager"
                      | "event_creator"
                      | "door_person"
                  }
                />
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
