"use client";

import { EventForm, EventFormData } from "@/components/EventForm/EventForm";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { notifications } from "@mantine/notifications";

export default function NewEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const communityId = params?.id;

  if (!communityId) {
    return <div>Community not found</div>;
  }

  const handleCancel = () => {
    router.push(`/communities/${communityId}`);
  };

  const uploadImageToSupabase = async (
    selectedFile: File | null
  ): Promise<string | null> => {
    if (!selectedFile) return null;

    const supabase = createClient();

    const fileExt = selectedFile.name.split(".").pop();
    const uuid = crypto.randomUUID();
    const fileName = `${uuid}.${fileExt}`;
    const filePath = `${communityId}/${fileName}`;

    try {
      const { error } = await supabase.storage
        .from("events")
        .upload(filePath, selectedFile);

      if (error) {
        console.error("Upload error:", error);
        // setUploadError(error.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("events")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      // setUploadError("Failed to upload image");
      return null;
    }
  };

  const handleSubmit = async (data: EventFormData) => {
    setIsLoading(true);

    try {
      const startDate = new Date(data.start).toISOString();
      const finishDate = data.finish
        ? new Date(data.finish).toISOString()
        : null;

      const imageUrl = await uploadImageToSupabase(
        data.picture instanceof File ? data.picture : null
      );

      const { data: supabasedata, error } = await supabase
        .from("Events")
        .insert({
          community: parseInt(communityId),
          title: data.title,
          description: data.description,
          start: startDate,
          finish: finishDate,
          location: data.location,
          tags: data.tags,
          price: data.isFree ? 0 : data.isPayWhatYouCan ? null : data.price,
          capacity: data.capacity,
          public: true,
          picture: imageUrl,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating event:", error);
        notifications.show({
          title: "Error",
          message: "Failed to create event. Please try again.",
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Success",
        message: "Event created successfully!",
        color: "green",
      });
      console.log(data);
      router.push(
        `/communities/${communityId}/events/${supabasedata?.id ?? "new"}`
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EventForm
      onCancel={handleCancel}
      isEditing={false}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}
