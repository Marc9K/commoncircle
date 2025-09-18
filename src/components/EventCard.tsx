import { Card, Image, Stack, Title, Text, Group, Badge } from "@mantine/core";

export interface EventCardData {
  id: string | number;
  name: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  imageSrc: string;
  tags: string[];
  price?: number; // undefined = free
}

interface EventCardProps {
  event: EventCardData;
}

function formatEventDateTime(startDateTime: string, endDateTime: string) {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  const startDate = start.toLocaleDateString();
  const endDate = end.toLocaleDateString();
  const startTime = start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (startDate === endDate) {
    return `${startDate} • ${startTime} - ${endTime}`;
  }

  return `${start.toLocaleDateString()}, ${startTime} - ${end.toLocaleDateString()}, ${endTime}`;
}

export function EventCard({ event }: EventCardProps) {
  const { name, startDateTime, endDateTime, location, imageSrc, tags, price } =
    event;

  return (
    <Card withBorder padding="lg" radius="md" h="100%">
      <Stack gap="sm">
        <Image
          src={imageSrc}
          alt={`${name} image`}
          radius="md"
          height={120}
          fit="cover"
        />
        <Stack gap="xs" style={{ flex: 1 }}>
          <Title order={4} size="h4" lineClamp={2}>
            {name}
          </Title>

          <Text size="sm" c="dimmed">
            {formatEventDateTime(startDateTime, endDateTime)}
          </Text>

          <Text size="sm" c="dimmed">
            📍 {location}
          </Text>

          {tags.length > 0 && (
            <Group gap="xs">
              {tags.map((tag, index) => (
                <Badge key={index} variant="light" size="xs">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}

          <Group justify="flex-end" align="center" mt="auto">
            <Text size="lg" fw={700} c={price === undefined ? "green" : "blue"}>
              {price === undefined ? "Free" : `£${price}`}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}
