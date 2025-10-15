"use client";

import {
  Button,
  Card,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Image,
  NavLink,
} from "@mantine/core";
import Visible from "@/components/Visible/Visible";
import { CommunitiesGrid } from "@/components/CommunitiesGrid/CommunitiesGrid";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Home() {
  const user = undefined;
  const supabase = createClient();
  const [members, setMembers] = useState(0);
  const [events, setEvents] = useState(0);
  useEffect(() => {
    const fetchMembers = async () => {
      const { data: members } = await supabase.rpc("total_auth_users");
      setMembers(members);
    };
    const fetchEvents = async () => {
      const { data: events } = await supabase.rpc("total_events_hosted");
      setEvents(events);
    };
    fetchMembers();
    fetchEvents();
  }, []);
  return (
    <Container pt={160}>
      <Stack gap="lg">
        <Stack gap={8}>
          <Title order={1}>Connect, Learn, Grow Together</Title>
          <Text c="dimmed">
            Join vibrant communities, discover amazing events, and build lasting
            connections with people who share your passions.
          </Text>
        </Stack>

        {!user && (
          <Visible visibleFrom="sm">
            <Group>
              <Button
                component="a"
                href="/auth/login"
                size="md"
                variant="filled"
              >
                Join us
              </Button>
            </Group>
          </Visible>
        )}

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder padding="lg" radius="md">
              <Text size="sm" c="dimmed">
                Members
              </Text>
              <Title order={2}>{members}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder padding="lg" radius="md">
              <Text size="sm" c="dimmed">
                Events hosted
              </Text>
              <Title order={2}>{events}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={12}>
            <Card withBorder padding="lg" radius="md">
              <Stack gap="xs">
                <Image src="./people.jpg" radius="md" alt="Community members" />
                <Title order={2}>Top community growth +32%</Title>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <CommunitiesGrid communities={[]} maxCommunities={10} />
      </Stack>
    </Container>
  );
}
