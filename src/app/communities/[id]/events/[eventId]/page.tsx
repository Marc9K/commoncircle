"use client";

import { Header } from "@/components/header/Header";
import { EventDetail } from "@/components/EventDetail/EventDetail";
import { AppShell } from "@mantine/core";
import { notFound, useParams } from "next/navigation";

export default function EventDetailPage() {
  const params = useParams<{ id: string; eventId: string }>();
  const eventId = params?.eventId;
  const communityId = params?.id;

  if (!eventId || !communityId) {
    return notFound();
  }

  const event = undefined;

  if (!event) {
    return notFound();
  }

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main mt={{ base: 60, sm: 30 }}>
        <EventDetail event={event} />
      </AppShell.Main>
    </AppShell>
  );
}
