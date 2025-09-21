"use client";

import {
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Group,
  Text,
  Title,
  Container,
  Grid,
  Select,
  TagsInput,
  Switch,
  Divider,
  Input,
  FileInput,
  Image,
  FloatingIndicator,
  Tabs,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

export interface EventFormData {
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  imageSrc: string;
  tags: string[];
  price?: number;
  capacity?: number;
  registrationDeadline?: string;
  isFree: boolean;
  isPayWhatYouCan: boolean;
  suggestedAmount?: number;
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function EventForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
}: EventFormProps) {
  const [pricingType, setPricingType] = useState<
    "free" | "paid" | "pay-what-you-can"
  >(() => {
    if (initialData?.isFree) return "free";
    if (initialData?.isPayWhatYouCan) return "pay-what-you-can";
    return "paid";
  });

  const form = useForm<EventFormData>({
    initialValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      startDateTime: initialData?.startDateTime || "",
      endDateTime: initialData?.endDateTime || "",
      location: initialData?.location || "",
      imageSrc: initialData?.imageSrc || "",
      tags: initialData?.tags || [],
      price: initialData?.price,
      capacity: initialData?.capacity,
      registrationDeadline: initialData?.registrationDeadline || "",
      isFree: initialData?.isFree ?? true,
      isPayWhatYouCan: initialData?.isPayWhatYouCan ?? false,
      suggestedAmount: initialData?.suggestedAmount,
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Name must be at least 3 characters" : null,
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters" : null,
      startDateTime: (value) => (!value ? "Start date is required" : null),
      endDateTime: (value, values) => {
        if (!value) return "End date is required";
        if (value <= values.startDateTime)
          return "End date must be after start date";
        return null;
      },
      location: (value) =>
        value.length < 3 ? "Location must be at least 3 characters" : null,
      price: (value, values) => {
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
    };
    onSubmit(formData);
  };
  const [imagePreview, setImagePreview] = useState<string | null>(
    "./people.jpg"
  );

  return (
    <Container size="md" py="xl">
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
                />
              </Stack>
            </Group>
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Event Name"
                  placeholder="Enter event name"
                  required
                  {...form.getInputProps("name")}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Description"
              placeholder="Describe your event..."
              minRows={4}
              resize="vertical"
              {...form.getInputProps("description")}
            />

            <Grid>
              <Grid.Col span={6}>
                <Input.Wrapper label="Start Date & Time" required>
                  <Input
                    type="datetime-local"
                    placeholder="Select start date and time"
                    {...form.getInputProps("startDateTime")}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Input.Wrapper label="End Date & Time" required>
                  <Input
                    type="datetime-local"
                    placeholder="Select end date and time"
                    {...form.getInputProps("endDateTime")}
                  />
                </Input.Wrapper>
              </Grid.Col>
            </Grid>

            <TextInput
              placeholder="Enter event location"
              required
              {...form.getInputProps("location")}
            />

            <TagsInput
              label="Tags"
              placeholder="Add tags (press Enter to add)"
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
                >
                  <Tabs.List>
                    <Tabs.Tab value="free">Free</Tabs.Tab>
                    <Tabs.Tab value="paid">Fixed Price</Tabs.Tab>
                    <Tabs.Tab value="pay-what-you-can">
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
                    {...form.getInputProps("price")}
                  />
                )}

                {pricingType === "pay-what-you-can" && (
                  <Stack gap="sm">
                    <Text size="sm" c="dimmed">
                      Attendees can choose their own contribution amount during
                      registration
                    </Text>
                    <NumberInput
                      label="Suggested Amount (Optional)"
                      inputMode="decimal"
                      prefix="£"
                      allowNegative={false}
                      placeholder="Enter suggested amount"
                      min={0}
                      decimalScale={2}
                      hideControls
                      rightSectionPointerEvents="none"
                      {...form.getInputProps("suggestedAmount")}
                    />
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
                {...form.getInputProps("capacity")}
              />
            </Stack>

            <Group justify="flex-end" gap="md">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                {isEditing ? "Update Event" : "Create Event"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
