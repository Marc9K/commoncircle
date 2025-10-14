"use client";

import { CommunitiesGrid } from "@/components/CommunitiesGrid/CommunitiesGrid";
import {
  Container,
  Stack,
  Group,
  Select,
  MultiSelect,
  Button,
  Grid,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Community {
  name: string;
  memberCount: number;
  tags: string[];
  imageSrc: string;
  pastEvents: number;
  futureEvents: number;
}

export default function CommunitiesPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | null>("popular");

  const [communities, setCommunities] = useState<Community[]>([]);

  const supabase = createClient();

  useEffect(() => {
    let query = supabase
      .from("communities")
      .select(
        "id, name, languages, created_at, picture, description, email, website, established, location, public, Circles(count), Events(count)"
      );

    if (search && search.trim() !== "") {
      query = query.textSearch("name", search, {
        type: "websearch",
      });
    }

    query.then(({ data, error }) => {
      if (error) {
        console.error(error);
      } else {
        setCommunities(data);
      }
    });
  }, [supabase, search]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const c of communities) c.languages?.forEach((t) => tags.add(t));
    return Array.from(tags).sort();
  }, [communities]);

  const filtered = useMemo(() => {
    let result = communities;

    if (selectedTags.length > 0) {
      result = result.filter((c) =>
        selectedTags.every((t) => c.languages?.includes(t))
      );
    }

    if (sortBy === "popular") {
      result = [...result].sort(
        (a, b) => a.Circles?.[0]?.count - b.Circles?.[0]?.count
      );
    } else if (sortBy === "eventful") {
      result = [...result].sort(
        (a, b) => b.Events?.[0]?.count - a.Events?.[0]?.count
      );
    }
    console.log("result", result);
    return result;
  }, [communities, selectedTags, sortBy]);

  return (
    <Container mt={100} style={{ overflow: "hidden" }}>
      <Stack gap="lg">
        <Grid style={{ overflow: "hidden" }}>
          <Grid.Col>
            <MultiSelect
              placeholder="Filter by tags"
              data={allTags}
              value={selectedTags}
              onChange={setSelectedTags}
              searchable
              clearable
              w={{ base: "100%", sm: 320 }}
            />
          </Grid.Col>
          <Grid.Col>
            <Select
              placeholder="Sort by"
              value={sortBy}
              onChange={setSortBy}
              data={[
                { value: "popular", label: "Most members" },
                { value: "eventful", label: "Most events" },
              ]}
              w={{ base: "100%", sm: 220 }}
            />
          </Grid.Col>
          <Group wrap="wrap" gap="sm">
            <Button
              variant="light"
              onClick={() => {
                setSelectedTags([]);
                setSortBy("popular");
              }}
            >
              Reset
            </Button>
          </Group>
        </Grid>

        <CommunitiesGrid communities={filtered} />
      </Stack>
    </Container>
  );
}
