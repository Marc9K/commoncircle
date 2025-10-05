"use client";

import {
  Stack,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Card,
  Title,
  Image,
  FileInput,
  MultiSelect,
  Grid,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CommunityDetailData } from "@/components/CommunityDetail/CommunityDetail";
import { createClient } from "@/lib/supabase/client";

interface CommunityEditFormProps {
  community?: CommunityDetailData;
}

const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Polish",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Other",
];

const COMMUNITY_TYPES = [
  { value: "public", label: "Public - Anyone can join" },
  { value: "private", label: "Private - Requires approval" },
];

export function CommunityEditForm({ community }: CommunityEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    community?.imageSrc ?? null
  );

  const form = useForm({
    initialValues: {
      name: community?.name ?? "",
      description: community?.description ?? "",
      email: community?.contactEmail ?? "",
      website: community?.website ?? "",
      location: community?.location ?? "",
      languages: community?.languages ?? [],
      public: community?.public ?? true,
      established: community?.establishedDate ?? "",
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Name must be at least 3 characters" : null,
    },
  });

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.log("Auth result:", { user: user?.id, error: authError });

    if (authError || !user) {
      console.error("Authentication error:", authError);
      setIsSubmitting(false);
      router.push("/auth/login");
      return;
    }

    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value != "" && value !== null && value !== undefined;
      })
    );

    try {
      if (community?.id) {
        const { error } = await supabase
          .from("communities")
          .update(filteredValues)
          .eq("id", community?.id);

        if (error) {
          console.error("Update error:", error);
          setIsSubmitting(false);
          throw error;
        }

        router.push(`/communities/${community.id}`);
      } else {
        const { data, error } = await supabase
          .from("communities")
          .insert(filteredValues)
          .select()
          .single();

        if (error) {
          console.error("Create community error:", error);
          setIsSubmitting(false);
          throw error;
        }

        router.push(`/communities/${data.id}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Stack gap="md">
                <Group align="flex-start" gap="lg">
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Community preview"
                      width={200}
                      height={120}
                      radius="md"
                      fit="cover"
                    />
                  )}
                  <Stack gap="sm" style={{ flex: 1 }}>
                    <FileInput
                      label="Upload Image"
                      placeholder="Choose an image file"
                      accept="image/*"
                      onChange={handleImageChange}
                      data-testid="community-image-input"
                    />
                  </Stack>
                </Group>
              </Stack>
              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <TextInput
                    label="Community Name"
                    placeholder="Enter community name"
                    required
                    {...form.getInputProps("name")}
                    data-testid="community-name-input"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Community Type"
                    data={COMMUNITY_TYPES}
                    required
                    value={form.values.public ? "public" : "private"}
                    onChange={(value) =>
                      form.setFieldValue("public", value === "public")
                    }
                    data-testid="community-type-select"
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Description"
                placeholder="Describe your community, its purpose, and what members can expect"
                minRows={4}
                {...form.getInputProps("description")}
                data-testid="community-description-input"
              />

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Location"
                    placeholder="e.g., Manchester, UK"
                    {...form.getInputProps("location")}
                    data-testid="community-location-input"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Established Date"
                    type="date"
                    {...form.getInputProps("established")}
                    data-testid="community-established-input"
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          {/* Contact Information */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Title order={3}>Contact Information</Title>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Contact Email"
                    placeholder="hello@community.org"
                    required
                    {...form.getInputProps("email")}
                    data-testid="community-email-input"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Website"
                    placeholder="https://community.org"
                    {...form.getInputProps("website")}
                    data-testid="community-website-input"
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          <Card withBorder padding="lg">
            <Stack gap="md">
              <Title order={3}>Languages Spoken</Title>

              <MultiSelect
                label="Languages"
                placeholder="Select languages spoken in your community"
                data={LANGUAGE_OPTIONS}
                searchable
                clearable
                {...form.getInputProps("languagesSpoken")}
                data-testid="languages-select"
              />
            </Stack>
          </Card>

          <Group justify="flex-end">
            <Button
              type="submit"
              loading={isSubmitting}
              data-testid="save-button"
            >
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
