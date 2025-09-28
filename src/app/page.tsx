"use client";

import { Header } from "@/components/header/Header";
import {
  AppShell,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Visible from "@/components/Visible/Visible";
import { CommunitiesGrid } from "@/components/CommunitiesGrid/CommunitiesGrid";

export default function Home() {
  const [opened, { toggle }] = useDisclosure();
  const user = undefined;
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
              <Button size="md" variant="filled">
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
              <Title order={2}>12,345+</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder padding="lg" radius="md">
              <Text size="sm" c="dimmed">
                Events hosted
              </Text>
              <Title order={2}>980</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={12}>
            <Card withBorder padding="lg" radius="md">
              <Stack gap="xs">
                <Image src="./people.jpg" radius="md" />
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
