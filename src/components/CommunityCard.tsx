import { Card, Text, Title, Image, Group, Badge, Stack } from "@mantine/core";

interface CommunityCardProps {
  name: string;
  memberCount: number;
  tags: string[];
  imageSrc: string;
  pastEvents: number;
  futureEvents: number;
}

export function CommunityCard({
  name,
  memberCount,
  tags,
  imageSrc,
  pastEvents,
  futureEvents,
}: CommunityCardProps) {
  return (
    <Card withBorder padding="lg" radius="md" h="100%">
      <Stack gap="md">
        <Image
          src={imageSrc}
          alt={`${name} community`}
          radius="md"
          height={120}
          fit="cover"
        />
        <Stack gap="xs">
          <Title order={3} size="h4" lineClamp={2}>
            {name}
          </Title>
          <Text size="sm" c="dimmed">
            {memberCount.toLocaleString()} members
          </Text>
          <Group gap="md">
            <Text size="xs" c="dimmed">
              {pastEvents} past events
            </Text>
            <Text size="xs" c="dimmed">
              {futureEvents} upcoming
            </Text>
          </Group>
          <Group gap="xs">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} size="sm" variant="light" color="blue">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge size="sm" variant="light" color="gray">
                +{tags.length - 3}
              </Badge>
            )}
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}
