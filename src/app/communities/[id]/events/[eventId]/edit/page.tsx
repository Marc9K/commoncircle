"use client";

import { Header } from "@/components/header/Header";
import { EventForm, EventFormData } from "@/components/EventForm/EventForm";
import { AppShell, Container } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EditEventPage() {
  const params = useParams<{ id: string; eventId: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
  }, [eventId]);

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
        <div>Loading event data...</div>
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
          const startDate = new Date(data.start).toISOString();
          const finishDate = data.finish
            ? new Date(data.finish).toISOString()
            : null;
          const { data: supabasedata, error } = await supabase
            .from("Events")
            .update({
              title: data.title,
              description: data.description,
              location: data.location,
              tags: data.tags,
              capacity: data.capacity,
              picture: data.picture,
              price: data.isFree ? 0 : data.isPayWhatYouCan ? null : data.price,
              start: startDate,
              finish: finishDate,
            })
            .eq("id", eventId);
          if (error) {
            console.error(error);
          }
          router.push(`/communities/${communityId}/events/${eventId}`);
        }}
      />
    </Container>
  );
}
