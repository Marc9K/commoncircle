"use client";

import { Container, Tabs, Title, Stack } from "@mantine/core";
import { AccountSettings } from "../AccountSettings/AccountSettings";
import {
  AccountCommunities,
  Community,
} from "../AccountCommunities/AccountCommunities";
import { AccountEvents, UserEvent } from "../AccountEvents/AccountEvents";
import { User } from "@supabase/supabase-js";

export interface AccountProps {
  user: User;
  memberCommunities?: Community[];
  runningCommunities?: Community[];
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
        <Title order={1}>Account</Title>

        <Tabs defaultValue="settings" variant="outline">
          <Tabs.List justify="flex-end">
            <Tabs.Tab value="communities">Communities</Tabs.Tab>
            <Tabs.Tab value="events">Events</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
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
