"use client";

import { Container, Tabs, Title, Stack } from "@mantine/core";
import { AccountSettings } from "../AccountSettings/AccountSettings";
import {
  AccountCommunities,
  Community,
} from "../AccountCommunities/AccountCommunities";
import { AccountEvents, UserEvent } from "../AccountEvents/AccountEvents";
import { User } from "@supabase/supabase-js";

interface UserWithName extends User {
  name?: string;
}

export type PropCommunity = {
  role: "owner" | "manager" | "event_creator" | "door_person" | "member";
  community: { id: number; name: string; picture: string };
};
export interface AccountProps {
  user: UserWithName;
  memberCommunities?: PropCommunity[];
  runningCommunities?: PropCommunity[];
  pastEvents?: UserEvent[];
  futureEvents?: UserEvent[];
}

export function Account({
  user,
  memberCommunities,
  runningCommunities,
  pastEvents,
  futureEvents,
}: AccountProps) {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Tabs defaultValue="communities" variant="outline">
          <Tabs.List justify="flex-end">
            <Tabs.Tab value="communities" data-testid="communities-tab">
              Communities
            </Tabs.Tab>
            <Tabs.Tab value="events" data-testid="events-tab">
              Events
            </Tabs.Tab>
            <Tabs.Tab value="settings" data-testid="settings-tab">
              Settings
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="settings" pt="md">
            <AccountSettings user={user} />
          </Tabs.Panel>

          <Tabs.Panel value="communities" pt="md">
            <AccountCommunities
              user={user}
              memberCommunities={memberCommunities}
              runningCommunities={runningCommunities}
            />
          </Tabs.Panel>

          <Tabs.Panel value="events" pt="md">
            <AccountEvents
              user={user}
              pastEvents={pastEvents}
              futureEvents={futureEvents}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
