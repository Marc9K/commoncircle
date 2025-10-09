"use client";

import { createClient } from "@/lib/supabase/client";
import { Card, Text, Title, Image, Group, Badge, Stack } from "@mantine/core";
import { useEffect, useState } from "react";

interface CommunityCardProps {
  role: string;
  community: {
    id: number;
    name: string;
    picture: string;
  };
}

export function CommunityCard({
  role,
  community: { id, name, picture },
}: CommunityCardProps) {
  const supabase = createClient();

  const [memberCount, setMemberCount] = useState(0);
  const [pastEvents, setPastEvents] = useState(0);
  const [futureEvents, setFutureEvents] = useState(0);

  const fetchMemberCount = async () => {
    const {
      data: {
        member: { count },
      },
      error: memberCountError,
    } = await supabase
      .from("Circles")
      .select("member(count)")
      .eq("community", id)
      .single();
    setMemberCount(count);
  };

  const fetchPastEvents = async () => {
    const { data: pastEvents, error: pastEventsError } = await supabase
      .from("Events")
      .select("start, community(id)")
      .lte("start", new Date().toISOString())
      .eq("community", id);
    setPastEvents(pastEvents?.length || 0);
  };

  const fetchFutureEvents = async () => {
    const { data: futureEvents, error: futureEventsError } = await supabase
      .from("Events")
      .select("start, community(id)")
      .gt("start", new Date().toISOString())
      .eq("community", id);
    setFutureEvents(futureEvents?.length || 0);
  };
  useEffect(() => {
    fetchMemberCount();
    fetchPastEvents();
    fetchFutureEvents();
  }, [id]);

  // const { data: memberCount, error: memberCountError } = await supabase
  //   .from("Circles")
  //   .select("COUNT(*)")
  //   .eq("community", id)
  //   .single();

  return (
    <Card withBorder padding="lg" radius="md" h="100%">
      <Stack gap="md">
        {picture && (
          <Image
            src={picture}
            alt={`${name} community`}
            radius="md"
            height={120}
            fit="cover"
          />
        )}
        <Stack gap="xs">
          <Title order={3} size="h4" lineClamp={2}>
            {name}
          </Title>
          <Text size="sm" c="dimmed">
            {memberCount} members
          </Text>
          <Group gap="md">
            <Text size="xs" c="dimmed">
              {pastEvents} past events
            </Text>
            <Text size="xs" c="dimmed">
              {futureEvents} upcoming
            </Text>
          </Group>
          {/* <Group gap="xs">
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
          </Group> */}
        </Stack>
      </Stack>
    </Card>
  );
}
