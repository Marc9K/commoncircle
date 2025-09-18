"use client";

import { Container, Tabs, Title, Stack } from "@mantine/core";
import { AccountSettings } from "./AccountSettings";
import { AccountCommunities, Community } from "./AccountCommunities";
import { AccountEvents, UserEvent } from "./AccountEvents";

export interface AccountProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
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
          <Tabs.List>
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
