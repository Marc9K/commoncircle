"use client";

import { EventForm, EventFormData } from "@/components/EventForm/EventForm";
import { Container, Loader } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateEvent } from "@/lib/actions/event-actions";
import { notifications } from "@mantine/notifications";

export default function EditEventPage() {
  const params = useParams<{ id: string; eventId: string }>();
  const router = useRouter();
  const [isLoading] = useState(false);
  const [eventData, setEventData] = useState<Partial<EventFormData> | null>(
    null
  );

  const communityId = params?.id;
  const eventId = params?.eventId;

  const supabase = createClient();
  useEffect(() => {
    const fetchEvent = async () => {
      const { data: event, error } = await supabase
        .from("Events")
        .select("*")
        .eq("id", eventId)
        .single();
      if (error) {
        console.error(error);
      }
      setEventData(event);
    };
    fetchEvent();
  }, [eventId, supabase]);

  if (!communityId || !eventId) {
    return <div>Event not found</div>;
  }

  const handleCancel = () => {
    router.push(`/communities/${communityId}/events/${eventId}`);
  };

  const handleDelete = async () => {
    if (!eventId) return;

    const { error } = await supabase.from("Events").delete().eq("id", eventId);

    if (error) {
      console.error("Error deleting event:", error);
      return;
    }

    // Navigate back to community page after successful deletion
    router.push(`/communities/${communityId}`);
  };

  if (!eventData) {
    return (
      <Container mt={120}>
        <Loader />
      </Container>
    );
  }

  return (
    <Container mt={120}>
      <EventForm
        initialData={eventData}
        onCancel={handleCancel}
        onDelete={handleDelete}
        isEditing={true}
        isLoading={isLoading}
        onSubmit={async (data: EventFormData) => {
          try {
            await updateEvent(eventId, communityId, eventData, data);
            window.location.href = `/communities/${communityId}/events/${eventId}`;
          } catch (error) {
            console.error("Failed to update event:", error);
            notifications.show({
              title: "Error",
              message: "Failed to update event. Please try again. " + error,
              color: "red",
            });
          }
        }}
      />
    </Container>
  );
}
