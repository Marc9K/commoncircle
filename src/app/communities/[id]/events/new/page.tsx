"use client";

import { Header } from "@/components/header/Header";
import { EventForm, EventFormData } from "@/components/EventForm/EventForm";
import { AppShell } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function NewEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const communityId = params?.id;

  if (!communityId) {
    return <div>Community not found</div>;
  }

  const handleCancel = () => {
    router.push(`/communities/${communityId}`);
  };

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main mt={{ base: 60, sm: 30 }}>
        <EventForm
          onCancel={handleCancel}
          isEditing={false}
          isLoading={isLoading}
        />
      </AppShell.Main>
    </AppShell>
  );
}
