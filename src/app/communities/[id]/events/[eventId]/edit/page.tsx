"use client";

import { Header } from "@/components/header/Header";
import { EventForm, EventFormData } from "@/components/EventForm/EventForm";
import { AppShell } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditEventPage() {
  const params = useParams<{ id: string; eventId: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState<Partial<EventFormData> | null>(
    null
  );

  const communityId = params?.id;
  const eventId = params?.eventId;

  if (!communityId || !eventId) {
    return <div>Event not found</div>;
  }

  useEffect(() => {}, [eventId]);

  const handleCancel = () => {
    router.push(`/communities/${communityId}/events/${eventId}`);
  };

  if (!eventData) {
    return (
      <AppShell padding="md" header={{ height: 60 }}>
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <AppShell.Main mt={{ base: 60, sm: 30 }}>
          <div>Loading event data...</div>
        </AppShell.Main>
      </AppShell>
    );
  }

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main mt={{ base: 60, sm: 30 }}>
        <EventForm
          initialData={eventData}
          onCancel={handleCancel}
          isEditing={true}
          isLoading={isLoading}
        />
      </AppShell.Main>
    </AppShell>
  );
}
