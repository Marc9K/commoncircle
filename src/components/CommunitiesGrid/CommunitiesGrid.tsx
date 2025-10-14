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
  maxCommunities,
}: CommunitiesGridProps) {
  const displayCommunities = maxCommunities
    ? communities.slice(0, maxCommunities)
    : communities;
  console.log(displayCommunities);
  return (
    <Stack gap="lg">
      <Grid>
        {displayCommunities.map((community, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
            <CommunityCard community={community} />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
}
