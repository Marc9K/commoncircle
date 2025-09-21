"use client";

import { Header } from "@/components/header/Header";
import { CommunitiesGrid } from "@/components/CommunitiesGrid/CommunitiesGrid";
import {
  AppShell,
  Container,
  Stack,
  Group,
  Select,
  MultiSelect,
  Button,
  Grid,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMemo, useState } from "react";

interface Community {
  name: string;
  memberCount: number;
  tags: string[];
  imageSrc: string;
  pastEvents: number;
  futureEvents: number;
}

export default function CommunitiesPage() {
  const [opened, { toggle }] = useDisclosure();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | null>("popular");

  const communities: Community[] = [];

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const c of communities) c.tags.forEach((t) => tags.add(t));
    return Array.from(tags).sort();
  }, [communities]);

  const filtered = useMemo(() => {
    let result = communities;

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.tags.some((t) => t.toLowerCase().includes(term))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((c) =>
        selectedTags.every((t) => c.tags.includes(t))
      );
    }

    if (sortBy === "popular") {
      result = [...result].sort((a, b) => b.memberCount - a.memberCount);
    } else if (sortBy === "upcoming") {
      result = [...result].sort((a, b) => b.futureEvents - a.futureEvents);
    } else if (sortBy === "recent") {
      result = [...result].sort((a, b) => b.pastEvents - a.pastEvents);
    }

    return result;
  }, [communities, search, selectedTags, sortBy]);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main mt={{ base: 60, sm: 30 }}>
        <Container>
          <Stack gap="lg">
            <Grid>
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
                    { value: "upcoming", label: "Most upcoming events" },
                    { value: "recent", label: "Most past events" },
                  ]}
                  w={{ base: "100%", sm: 220 }}
                />
              </Grid.Col>
              <Group wrap="wrap" gap="sm">
                <Button
                  variant="light"
                  onClick={() => {
                    setSearch("");
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
      </AppShell.Main>
    </AppShell>
  );
}
