"use client";
import {
  Stack,
  Tabs,
  SimpleGrid,
  Button,
  Group,
  Title,
  Box,
} from "@mantine/core";
import { CommunityCard } from "../CommunityCard/CommunityCard";
import { EmptyState } from "../EmptyState/EmptyState";
import { useRouter } from "next/navigation";

export interface Community {
  id: string;
  name: string;
  memberCount: number;
  tags: string[];
  imageSrc: string;
  pastEvents: number;
  futureEvents: number;
  role?: "member" | "admin" | "owner";
}

type PropCommunity = {
  role: "owner" | "manager" | "event_creator" | "door_person" | "member";
  community: {
    id: number;
    name: string;
    picture: string;
    membercount?: number;
    eventcount?: number;
  };
};

export interface AccountCommunitiesProps {
  user: {
    id: string;
    name?: string;
    email?: string;
  };
  memberCommunities?: PropCommunity[];
  runningCommunities?: PropCommunity[];
}

function CommunityGrid({ communities }: { communities: PropCommunity[] }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {communities.map((community) => (
        <Box key={community.community.id}>
          <CommunityCard {...community} />
        </Box>
      ))}
    </SimpleGrid>
  );
}

export function AccountCommunities({
  memberCommunities = [],
  runningCommunities = [],
}: AccountCommunitiesProps) {
  const router = useRouter();
  const handleCreateNewCommunity = () => {
    router.push("/communities/new");
  };

  return (
    <Stack gap="lg">
      <Tabs defaultValue="member" variant="outline">
        <Tabs.List justify="flex-end">
          <Tabs.Tab value="member">Membership</Tabs.Tab>
          <Tabs.Tab value="running">Leadership</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="member" pt="md">
          {memberCommunities.length === 0 ? (
            <EmptyState
              title="You haven't joined any communities yet"
              description="Join communities to discover events and connect with others who share your interests"
            />
          ) : (
            <CommunityGrid communities={memberCommunities} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="running" pt="md">
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={4}>Managed Communities</Title>
              <Button component="a" href="/communities/new">
                Start New Community
              </Button>
            </Group>

            {runningCommunities.length === 0 ? (
              <EmptyState
                title="You're not running any communities yet"
                description="Start building your community today and connect with like-minded people"
                actionLabel="Start New Community"
                onAction={handleCreateNewCommunity}
              />
            ) : (
              <CommunityGrid communities={runningCommunities} />
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
