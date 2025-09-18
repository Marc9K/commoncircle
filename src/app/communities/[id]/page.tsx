"use client";

import { Header } from "@/components/header/Header";
import { EventCard, EventCardData } from "@/components/EventCard";
import {
  AppShell,
  Container,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Image,
  Tabs,
  Grid,
  Badge,
} from "@mantine/core";
import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Variable from "@/components/Variable";

export interface EventItem extends EventCardData {}

// Legacy interface for backward compatibility
export interface LegacyEventItem {
  id: string | number;
  name: string;
  datetime: string;
  location: string;
  imageSrc: string;
}

export interface CommunityDetailData {
  id: string | number;
  name: string;
  description: string;
  memberCount: number;
  imageSrc: string;
  isMember: boolean;
  joinRequestPending?: boolean;
  establishedDate: string;
  contactEmail: string;
  website: string;
  location: string;
  languagesSpoken: string[];
  type: "public" | "private";
  pastEvents: EventItem[];
  futureEvents: EventItem[];
}
function CommunityImage({ community }: { community: CommunityDetailData }) {
  return (
    <Image
      src={community.imageSrc}
      alt={community.name}
      radius="md"
      fit="contain"
      mah={350}
      w="auto"
      maw="100%"
    />
  );
}

function CommunityTitle({ community }: { community: CommunityDetailData }) {
  return (
    <Stack gap={4} miw={300}>
      <Title order={1}>{community.name}</Title>
      <Text c="dimmed" size="sm">
        {community.type === "private"
          ? "🔒 Private community"
          : "🌍 Public community"}{" "}
        • {community.memberCount.toLocaleString()} members • 📍{" "}
        {community.location}
      </Text>
    </Stack>
  );
}

function CommunityMeta({ community }: { community: CommunityDetailData }) {
  return (
    <Group gap="xs">
      <Text size="sm" c="dimmed">
        Founded in {new Date(community.establishedDate).getFullYear()}
      </Text>
      <Button
        size="xs"
        variant="subtle"
        component="a"
        href={`mailto:${community.contactEmail}`}
      >
        Contact us
      </Button>
      <Button
        size="xs"
        variant="subtle"
        component="a"
        href={community.website}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit website
      </Button>
    </Group>
  );
}

function JoinButton({
  community,
  isMember,
  joinRequestPending,
  onJoinRequest,
  onLeave,
}: {
  community: CommunityDetailData;
  isMember: boolean;
  joinRequestPending: boolean;
  onJoinRequest: () => void;
  onLeave: () => void;
}) {
  return (
    <Group>
      {isMember ? (
        <Button variant="light" color="red" onClick={onLeave}>
          Leave community
        </Button>
      ) : joinRequestPending ? (
        <Button variant="light" disabled>
          Join request pending
        </Button>
      ) : (
        <Button onClick={onJoinRequest}>
          {community.type === "public" ? "Join" : "Request to join"}
        </Button>
      )}
    </Group>
  );
}

function CommunityDescription({
  community,
}: {
  community: CommunityDetailData;
}) {
  return (
    <Stack gap="sm">
      <Text>{community.description}</Text>
      <Group gap="xs">
        {community.languagesSpoken.map((language, index) => (
          <Badge key={index} variant="light" size="sm">
            {language}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
}

export function CommunityDetail({
  community,
}: {
  community: CommunityDetailData;
}) {
  const [isMember, setIsMember] = useState<boolean>(community.isMember);
  const [joinRequestPending, setJoinRequestPending] = useState<boolean>(
    community.joinRequestPending || false
  );

  const handleJoinRequest = () => {
    if (community.type === "public") {
      setIsMember(true);
    } else {
      setJoinRequestPending(true);
    }
  };

  const handleLeave = () => setIsMember(false);

  return (
    <Stack gap="lg">
      <Variable at="md">
        <Stack>
          <Group align="flex-start" wrap="nowrap" gap="lg">
            <CommunityImage community={community} />
            <Stack gap={6} style={{ flex: 1 }}>
              <CommunityTitle community={community} />
              <CommunityMeta community={community} />
              <CommunityDescription community={community} />
              <JoinButton
                community={community}
                isMember={isMember}
                joinRequestPending={joinRequestPending}
                onJoinRequest={handleJoinRequest}
                onLeave={handleLeave}
              />
            </Stack>
          </Group>
        </Stack>
        <Stack gap="md">
          <CommunityImage community={community} />
          <CommunityTitle community={community} />
          <JoinButton
            community={community}
            isMember={isMember}
            joinRequestPending={joinRequestPending}
            onJoinRequest={handleJoinRequest}
            onLeave={handleLeave}
          />
          <CommunityDescription community={community} />
          <CommunityMeta community={community} />
        </Stack>
      </Variable>

      <Tabs defaultValue="future">
        <Tabs.List>
          <Tabs.Tab value="future">Upcoming events</Tabs.Tab>
          <Tabs.Tab value="past">Past events</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="future" pt="md">
          <Grid>
            {community.futureEvents.map((event) => (
              <Grid.Col key={event.id} span={{ base: 12, sm: 6, md: 4 }}>
                <EventCard event={event} />
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="past" pt="md">
          <Grid>
            {community.pastEvents.map((event) => (
              <Grid.Col key={event.id} span={{ base: 12, sm: 6, md: 4 }}>
                <EventCard event={event} />
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

export default function CommunityDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  if (!id) return notFound();

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main mt={{ base: 60, sm: 30 }}>
        <CommunityDetail community={{}} />
      </AppShell.Main>
    </AppShell>
  );
}
