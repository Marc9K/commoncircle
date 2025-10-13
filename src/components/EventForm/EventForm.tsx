"use client";

import {
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Group,
  Text,
  Container,
  Grid,
  TagsInput,
  Divider,
  Input,
  FileInput,
  Image,
  Tabs,
  Modal,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Map } from "../Map/Map";

export interface EventFormData {
  title: string;
  description: string;
  start: string;
  finish: string;
  location: string;
  picture?: string | File | null;
  tags: string[];
  price?: number;
  capacity?: number;
  isFree: boolean;
  isPayWhatYouCan: boolean;
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

// Helper function to convert database datetime to HTML datetime-local format
const formatDateTimeForInput = (dateTime: string | undefined): string => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  // Format as YYYY-MM-DDTHH:MM for datetime-local input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function EventForm({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
}: EventFormProps) {
  const [pricingType, setPricingType] = useState<
    "free" | "paid" | "pay-what-you-can"
  >(() => {
    if (initialData?.price === 0) return "free";
    if (initialData?.price == null) return "pay-what-you-can";
    return "paid";
  });

  const form = useForm<EventFormData>({
    initialValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      start: formatDateTimeForInput(initialData?.start),
      finish: formatDateTimeForInput(initialData?.finish),
      location: initialData?.location || "",
      picture: initialData?.picture || "",
      tags: initialData?.tags || [],
      price: initialData?.price,
      capacity: initialData?.capacity,
      isFree: initialData?.isFree ?? true,
      isPayWhatYouCan: initialData?.isPayWhatYouCan ?? false,
    },
    validate: {
      title: (value) =>
        value.length < 3 ? "Name must be at least 3 characters" : null,
      start: (value) => (!value ? "Start date is required" : null),
      price: (value) => {
        if (pricingType === "paid" && (!value || value <= 0)) {
          return "Price must be greater than 0 for paid events";
        }
        return null;
      },
    },
  });

  const handleSubmit = (values: EventFormData) => {
    const formData = {
      ...values,
      isFree: pricingType === "free",
      isPayWhatYouCan: pricingType === "pay-what-you-can",
      price: pricingType === "paid" ? values.price : undefined,
      picture: selectedFile,
    };
    onSubmit(formData);
  };
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setUploadError] = useState<string | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId;

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

  return (
    <Container size="md" py="xl" mt={120}>
      <Stack gap="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Group align="flex-start" gap="lg">
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Event preview"
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
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Event Title"
                  placeholder="Enter event title"
                  required
                  data-testid="event-title-input"
                  {...form.getInputProps("title")}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Description"
              placeholder="Describe your event..."
              minRows={4}
              resize="vertical"
              data-testid="event-description-input"
              {...form.getInputProps("description")}
            />

            <Grid>
              <Grid.Col span={6}>
                <Input.Wrapper label="Start Date & Time" required>
                  <Input
                    type="datetime-local"
                    placeholder="Select start date and time"
                    data-testid="event-start-input"
                    {...form.getInputProps("start")}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Input.Wrapper label="End Date & Time">
                  <Input
                    type="datetime-local"
                    placeholder="Select end date and time"
                    data-testid="event-finish-input"
                    {...form.getInputProps("finish")}
                  />
                </Input.Wrapper>
              </Grid.Col>
            </Grid>

            <TextInput
              label="Location"
              placeholder="Enter event location"
              data-testid="event-location-input"
              {...form.getInputProps("location")}
            />

            {form.values.location && !deleteModalOpened && (
              <Stack gap="sm">
                <Text size="sm" fw={500}>
                  Location Preview
                </Text>
                <Map
                  location={form.values.location}
                  height="300px"
                  showNoLocationMessage
                />
              </Stack>
            )}

            <TagsInput
              label="Tags"
              placeholder="Add tags (press Enter to add)"
              data-testid="event-tags-input"
              {...form.getInputProps("tags")}
            />

            <Divider />

            <Stack gap="md">
              <Text size="lg" fw={600}>
                Event Settings
              </Text>

              <Stack gap="sm">
                <Text size="sm" fw={500}>
                  Pricing Options
                </Text>

                <Tabs
                  value={pricingType}
                  onChange={(value) =>
                    setPricingType(
                      value as "free" | "paid" | "pay-what-you-can"
                    )
                  }
                  data-testid="event-pricing-tabs"
                >
                  <Tabs.List>
                    <Tabs.Tab value="free" data-testid="pricing-free-tab">
                      Free
                    </Tabs.Tab>
                    <Tabs.Tab value="paid" data-testid="pricing-paid-tab">
                      Fixed Price
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="pay-what-you-can"
                      data-testid="pricing-pay-what-you-can-tab"
                    >
                      Pay What You Can
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs>

                {pricingType === "paid" && (
                  <NumberInput
                    label="Price"
                    inputMode="decimal"
                    prefix="£"
                    allowNegative={false}
                    placeholder="Enter price"
                    min={0}
                    decimalScale={2}
                    hideControls
                    rightSectionPointerEvents="none"
                    data-testid="event-price-input"
                    {...form.getInputProps("price")}
                  />
                )}

                {pricingType === "pay-what-you-can" && (
                  <Stack gap="sm">
                    <Text size="sm" c="dimmed">
                      Attendees can choose their own contribution amount during
                      registration
                    </Text>
                  </Stack>
                )}

                {pricingType === "free" && (
                  <Text size="sm" c="dimmed">
                    No payment required - this event is completely free
                  </Text>
                )}
              </Stack>

              <NumberInput
                label="Capacity"
                placeholder="Maximum number of attendees (optional)"
                min={1}
                inputMode="numeric"
                allowNegative={false}
                decimalScale={0}
                data-testid="event-capacity-input"
                {...form.getInputProps("capacity")}
              />
            </Stack>

            <Group justify="space-between" gap="md">
              {eventId && (
                <Button
                  color="red"
                  variant="outline"
                  onClick={() => setDeleteModalOpened(true)}
                  data-testid="event-delete-button"
                >
                  Delete Event
                </Button>
              )}
              <Group gap="md" style={{ marginLeft: eventId ? "auto" : "0" }}>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  data-testid="event-cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isLoading}
                  data-testid="event-submit-button"
                >
                  {eventId ? "Update Event" : "Create Event"}
                </Button>
              </Group>
            </Group>
          </Stack>
        </form>
      </Stack>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Event"
        centered
      >
        <Stack gap="md">
          <Alert color="red" title="Warning">
            This action cannot be undone. This will permanently delete the event
            and all associated data.
          </Alert>

          <Text size="sm">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpened(false)}
              data-testid="event-cancel-delete-button"
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => {
                onDelete?.();
                setDeleteModalOpened(false);
              }}
              data-testid="confirm-delete-button"
            >
              Delete Event
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
