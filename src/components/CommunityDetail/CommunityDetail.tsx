"use client";

import { useState } from "react";

import { EventCard, EventCardData } from "@/components/EventCard/EventCard";
import Variable from "@/components/Variable/Variable";
import { Map } from "../Map/Map";
import {
  Stack,
  Group,
  Title,
  Text,
  Button,
  Image,
  Tabs,
  Grid,
  Badge,
  Box,
  Container,
} from "@mantine/core";
import { createClient } from "@/lib/supabase/client";

export interface CommunityDetailData {
  id: string | number;
  name: string;
  public: boolean;
  location: string;
  description: string;
  languages: string[];
  email: string;
  website: string;
  picture: string;
  established: string;
  memberCount: number;
  isMember: boolean;
  joinRequestPending?: boolean;
  pastEvents: EventCardData[];
  futureEvents: EventCardData[];
  currentUserRole?:
    | "owner"
    | "manager"
    | "event_creator"
    | "door_person"
    | null;
}
function CommunityImage({ community }: { community: CommunityDetailData }) {
  if (!community.picture) return null;
  return (
    <Image
      src={community.picture}
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
        {community.public ? "🌍 Public community" : "🔒 Private community"}•
        {community.memberCount.toLocaleString()} members • 📍
        {community.location}
      </Text>
    </Stack>
  );
}

function CommunityMeta({ community }: { community: CommunityDetailData }) {
  return (
    <Group gap="xs">
      {community.established && (
        <Text size="sm" c="dimmed">
          Founded in {new Date(community.established).getFullYear()}
        </Text>
      )}
      {community.email && (
        <Button
          size="xs"
          variant="subtle"
          component="a"
          href={`mailto:${community.email}`}
        >
          Contact us
        </Button>
      )}
      {community.website && (
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
      )}
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
  const isManager =
    community.currentUserRole === "owner" ||
    community.currentUserRole === "manager";

  return (
    <Group>
      {isManager ? (
        <Button
          data-testid="manage-community-button"
          variant="filled"
          onClick={() =>
            typeof window !== "undefined" &&
            (window.location.href = `/communities/${community.id}/manage`)
          }
        >
          Manage Community
        </Button>
      ) : isMember ? (
        <Button variant="light" color="red" onClick={onLeave}>
          Leave community
        </Button>
      ) : joinRequestPending ? (
        <Button
          variant="light"
          disabled
          data-testid="join-request-pending-button"
        >
          Join request pending
        </Button>
      ) : (
        <Button onClick={onJoinRequest} data-testid="join-community-button">
          {community.public ? "Join" : "Request to join"}
        </Button>
      )}
    </Group>
  );
}

function CommunityLocation({ community }: { community: CommunityDetailData }) {
  return (
    <Stack gap="sm">
      {community.location && (
        <Text size="md" fw={500}>
          📍 {community.location}
        </Text>
      )}
      <Box>
        <Map location={community.location} height="200px" zoom={13} />
      </Box>
    </Stack>
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
      {community.languages?.length && community.languages.length > 0 && (
        <Group gap="xs">
          {community.languages.map((language, index) => (
            <Badge key={index} variant="light" size="sm">
              {language}
            </Badge>
          ))}
        </Group>
      )}
    </Stack>
  );
}

export default function CommunityDetail({
  community,
}: {
  community: CommunityDetailData;
}) {
  const [isMember, setIsMember] = useState<boolean>(community.isMember);
  const [joinRequestPending, setJoinRequestPending] = useState<boolean>(
    community.joinRequestPending || false
  );

  const handleJoinRequest = async () => {
    const supabase = createClient();

    const { error } = await supabase.rpc("join_community", {
      community_id: community.id,
    });
    if (error) {
      console.error(error);
    }
    if (community.public) {
      setIsMember(true);
    } else {
      setJoinRequestPending(true);
    }
  };

  const handleLeave = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      console.error(userError);
      return;
    }
    if (!user) {
      console.error("No user found");
      return;
    }

    const { data: member, error: memberError } = await supabase
      .from("Members")
      .select("id")
      .eq("uid", user.id)
      .single();
    if (memberError) {
      console.error(memberError);
      return;
    }

    const { error } = await supabase
      .from("Circles")
      .delete()
      .eq("member", member.id)
      .eq("community", community.id);
    if (error) {
      console.error(error);
    }
    setIsMember(false);
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Variable at="md">
          <Stack>
            <Group align="flex-start" wrap="nowrap" gap="lg">
              <CommunityImage community={community} />
              <Stack gap={6} style={{ flex: 1 }}>
                <CommunityTitle community={community} />
                <CommunityMeta community={community} />
                <CommunityDescription community={community} />
                <CommunityLocation community={community} />
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
            <CommunityLocation community={community} />
            <CommunityMeta community={community} />
          </Stack>
        </Variable>

        <Tabs defaultValue="future">
          <Tabs.List>
            <Tabs.Tab value="future">Upcoming</Tabs.Tab>
            <Tabs.Tab value="past">Past</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="future" pt="md">
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Text size="sm" c="dimmed">
                  {community.futureEvents.length} upcoming events
                </Text>
                {community.currentUserRole &&
                  (community.currentUserRole === "owner" ||
                    community.currentUserRole === "manager" ||
                    community.currentUserRole === "event_creator") && (
                    <Button
                      variant="filled"
                      onClick={() =>
                        typeof window !== "undefined" &&
                        (window.location.href = `/communities/${community.id}/events/new`)
                      }
                    >
                      Create Event
                    </Button>
                  )}
              </Group>
              <Grid>
                {community.futureEvents.map((event) => (
                  <Grid.Col key={event.id} span={{ base: 12, sm: 6, md: 4 }}>
                    <EventCard event={event} />
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
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
    </Container>
  );
}
