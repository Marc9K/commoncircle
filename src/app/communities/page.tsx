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
  Loader,
  Center,
  Text,
} from "@mantine/core";
import { useMemo, useState, Suspense, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface Community {
  id?: string | number;
  name: string;
  memberCount: number;
  tags: string[];
  imageSrc: string;
  pastEvents: number;
  futureEvents: number;
}

interface SupabaseCommunity {
  id: number;
  name: string;
  languages: string[];
  created_at: string;
  picture: string;
  description: string;
  email: string;
  website: string;
  established: string;
  location: string;
  public: boolean;
  Circles: { count: number }[];
  Events: { count: number }[];
  memberCount: number;
  tags: string[];
  imageSrc: string;
  pastEvents: number;
  futureEvents: number;
}

function CommunitiesContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | null>("popular");

  const [communities, setCommunities] = useState<SupabaseCommunity[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver();

  const supabase = createClient();

  const fetchCommunities = async (page: number, reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    const limit = 10;
    const offset = page * limit;

    let query = supabase.from("communities_with_counts").select("*");

    if (search && search.trim() !== "") {
      query = query.textSearch("name", search, {
        type: "websearch",
      });
    }
    if (sortBy === "popular") {
      query = query.order("membercount", { ascending: false });
    } else if (sortBy === "eventful") {
      query = query.order("eventcount", { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    try {
      const { data, error } = await query;
      if (error) {
        console.error(error);
      } else {
        const newCommunities = data as SupabaseCommunity[];
        console.log("New communities:", newCommunities);
        if (reset) {
          setCommunities(newCommunities);
        } else {
          setCommunities((prev) => [...prev, ...newCommunities]);
        }
        setHasMore(newCommunities.length === limit);
      }
    } finally {
      setLoading(false);
    }
  };

  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      const { data: languages } = await supabase.rpc(
        "distinct_community_languages"
      );
      setAllTags(languages || []);
    };
    fetchLanguages();
  });

  useEffect(() => {
    setCurrentPage(0);
    setHasMore(true);
    fetchCommunities(0, true);
  }, [supabase, search, sortBy]);

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchCommunities(nextPage, false);
    }
  }, [isIntersecting, hasMore, loading, currentPage]);

  const filtered = useMemo(() => {
    let result = communities;

    if (selectedTags.length > 0) {
      result = result.filter((c) =>
        selectedTags.every((t) => c.languages?.includes(t))
      );
    }

    // if (sortBy === "popular") {
    //   result = [...result].sort(
    //     (a, b) => a.Circles?.[0]?.count - b.Circles?.[0]?.count
    //   );
    // } else if (sortBy === "eventful") {
    //   result = [...result].sort(
    //     (a, b) => b.Events?.[0]?.count - a.Events?.[0]?.count
    //   );
    // }

    return result;
  }, [communities, selectedTags, sortBy]);

  return (
    <Container mt={100} style={{ overflow: "hidden" }}>
      <Stack gap="lg">
        <Grid style={{ overflow: "hidden" }}>
          <Grid.Col>
            <MultiSelect
              placeholder="Filter by languages"
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

        {/* Intersection observer trigger - invisible element to detect when to load more */}
        {hasMore && <div ref={loadMoreRef} style={{ height: "1px" }} />}

        {loading && (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <Loader size="sm" />
              <Text size="sm" c="dimmed">
                Loading more communities...
              </Text>
            </Stack>
          </Center>
        )}

        {!hasMore && communities.length > 0 && (
          <Center py="xl">
            <Text size="sm" c="dimmed">
              No more communities to load
            </Text>
          </Center>
        )}
      </Stack>
    </Container>
  );
}

export default function CommunitiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommunitiesContent />
    </Suspense>
  );
}
