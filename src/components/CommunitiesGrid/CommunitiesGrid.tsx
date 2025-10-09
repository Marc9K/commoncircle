import { Grid, Stack } from "@mantine/core";
import { CommunityCard } from "../CommunityCard/CommunityCard";

interface Community {
  id?: string | number;
  name: string;
  memberCount: number;
  tags: string[];
  imageSrc: string;
  pastEvents: number;
  futureEvents: number;
}

interface CommunitiesGridProps {
  communities: Community[];
  maxCommunities?: number;
}

export function CommunitiesGrid({
  communities,
  maxCommunities = 10,
}: CommunitiesGridProps) {
  const displayCommunities = communities.slice(0, maxCommunities);

  return (
    <Stack gap="lg">
      <Grid>
        {displayCommunities.map((community, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
            <CommunityCard
              name={community.name}
              memberCount={community.memberCount}
              tags={community.tags}
              picture={community.imageSrc}
              pastEvents={community.pastEvents}
              futureEvents={community.futureEvents}
              // href={
              //   community.id !== undefined
              //     ? `/communities/${community.id}`
              //     : undefined
              // }
            />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
}
