"use client";

import { createClient } from "@/lib/supabase/client";
import { Card, Text, Title, Image, Group, Stack } from "@mantine/core";
import { useEffect, useState, useCallback } from "react";

interface CommunityCardProps {
  community: {
    id: number;
    name: string;
    picture: string;
    membercount?: number;
    eventcount?: number;
  };
}

export function CommunityCard({
  community: { id, name, picture, membercount, eventcount },
}: CommunityCardProps) {
  const supabase = createClient();

  const [pastEvents, setPastEvents] = useState(0);
  const [futureEvents, setFutureEvents] = useState(0);

  const fetchPastEvents = useCallback(async () => {
    const { data: pastEvents } = await supabase
      .from("Events")
      .select("start, community(id)")
      .lte("start", new Date().toISOString())
      .eq("community", id);
    setPastEvents(pastEvents?.length || 0);
  }, [supabase, id]);

  const fetchFutureEvents = useCallback(async () => {
    const { data: futureEvents } = await supabase
      .from("Events")
      .select("start, community(id)")
      .gt("start", new Date().toISOString())
      .eq("community", id);
    setFutureEvents(futureEvents?.length || 0);
  }, [supabase, id]);
  useEffect(() => {
    fetchPastEvents();
    fetchFutureEvents();
  }, [id, fetchPastEvents, fetchFutureEvents]);

  // const { data: memberCount, error: memberCountError } = await supabase
  //   .from("Circles")
  //   .select("COUNT(*)")
  //   .eq("community", id)
  //   .single();

  return (
    <Card
      component="a"
      href={`/communities/${id}`}
      withBorder
      padding="lg"
      radius="md"
      h="100%"
    >
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
            {membercount} members
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
