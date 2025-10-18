"use client";

import {
  Stack,
  Text,
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
  TagsInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CommunityDetailData } from "@/components/CommunityDetail/CommunityDetail";
import { createClient } from "@/lib/supabase/client";
import { Map } from "../Map/Map";
import { notifications } from "@mantine/notifications";

interface CommunityEditFormProps {
  community?: CommunityDetailData;
}

const COMMUNITY_TYPES = [
  { value: "public", label: "Public - Anyone can join" },
  { value: "private", label: "Private - Requires approval" },
];

export function CommunityEditForm({ community }: CommunityEditFormProps) {
  const router = useRouter();
  const [languages, setLanguages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    community?.picture ?? null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchLanguages = async () => {
      const { data: languages } = await supabase.rpc(
        "distinct_community_languages"
      );
      setLanguages(languages);
    };
    fetchLanguages();
  }, []);

  const form = useForm({
    initialValues: {
      name: community?.name ?? "",
      description: community?.description ?? "",
      email: community?.email ?? "",
      website: community?.website ?? "",
      location: community?.location ?? "",
      languages: community?.languages ?? [],
      public: community?.public ?? true,
      established: community?.established ?? "",
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Name must be at least 3 characters" : null,
    },
  });

  const handleImageChange = (file: File | null) => {
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("File size must be less than 2MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
      setUploadError(null);
    } else {
      setImagePreview(null);
      setSelectedFile(null);
      setUploadError(null);
    }
  };

  const uploadImageToSupabase = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    const supabase = createClient();

    const fileExt = selectedFile.name.split(".").pop();
    const uuid = crypto.randomUUID();
    const fileName = `${uuid}.${fileExt}`;

    try {
      const { error } = await supabase.storage
        .from("communities")
        .upload(fileName, selectedFile);

      if (error) {
        console.error("Upload error:", error);
        setUploadError(error.message);
        return null;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("communities")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image");
      return null;
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Authentication error:", authError);
        setIsSubmitting(false);
        router.push("/auth/login");
        return;
      }

      // Upload image first if a file is selected
      let imageUrl: string | null = null;
      if (selectedFile) {
        imageUrl = await uploadImageToSupabase();
        if (!imageUrl) {
          console.error("Failed to upload image");
          setIsSubmitting(false);
          return;
        }
      }

      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value !== "" && value !== null && value !== undefined;
        })
      );

      // Add image URL as 'picture' attribute
      if (imageUrl) {
        filteredValues.picture = imageUrl;
      }
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
      notifications.show({
        title: "Error",
        message: "Failed to create community. Please try again. " + error,
        color: "red",
      });
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
                      mah={200}
                      maw={200}
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

                    {uploadError && (
                      <Alert color="red" title="Upload Error">
                        {uploadError}
                      </Alert>
                    )}
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
                    onChange={(value) => {
                      form.setFieldValue("public", value === "public");
                    }}
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
                  {form.values.location && (
                    <Stack gap="sm">
                      <Text size="sm" fw={500}>
                        Location Preview
                      </Text>
                      <Map location={form.values.location} height="300px" />
                    </Stack>
                  )}
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
                    type="email"
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

              <TagsInput
                label="Languages"
                placeholder="Select languages spoken in your community"
                data={languages}
                clearable
                {...form.getInputProps("languages")}
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
              {selectedFile && isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
