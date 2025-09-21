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
import { CommunityDetailData } from "@/app/communities/[id]/page";

interface CommunityEditFormProps {
  community: CommunityDetailData;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    community.imageSrc
  );

  const form = useForm({
    initialValues: {
      name: community.name,
      description: community.description,
      contactEmail: community.contactEmail,
      website: community.website,
      location: community.location,
      languagesSpoken: community.languagesSpoken,
      type: community.type,
      establishedDate: community.establishedDate,
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

  const handleSubmit = (values: typeof form.values) => {
    setIsSubmitting(true);
    // Update form values
    form.setValues(values);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsSubmitting(false);
  };

  return (
    <Stack gap="lg">
      {showSuccess && (
        <Alert color="green" title="Success">
          Community details updated successfully!
        </Alert>
      )}

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
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Community Type"
                    data={COMMUNITY_TYPES}
                    required
                    {...form.getInputProps("type")}
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Description"
                placeholder="Describe your community, its purpose, and what members can expect"
                minRows={4}
                required
                {...form.getInputProps("description")}
              />

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Location"
                    placeholder="e.g., Manchester, UK"
                    required
                    {...form.getInputProps("location")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Established Date"
                    type="date"
                    required
                    {...form.getInputProps("establishedDate")}
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
                    {...form.getInputProps("contactEmail")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Website"
                    placeholder="https://community.org"
                    {...form.getInputProps("website")}
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
              />
            </Stack>
          </Card>

          <Group justify="flex-end">
            <Button variant="light" type="button">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
