"use server";

import { Header } from "@/components/header/Header";
import {
  EventDetail,
  EventDetailData,
} from "@/components/EventDetail/EventDetail";
import { AppShell } from "@mantine/core";
import { notFound, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function EventDetailPage({
  params,
}: Promise<{ id: string; eventId: string }>) {
  const { id, eventId } = await params;
  const supabase = await createClient();

  if (!eventId || !id) {
    return notFound();
  }

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return notFound();
  }
  const { data: member, error: memberError } = await supabase
    .from("Members")
    .select("id")
    .eq("uid", user.user.id)
    .single();

  if (memberError) {
    return notFound();
  }

  const { data: event, error } = await supabase
    .from("Events")
    .select("*")
    .eq("id", eventId)
    .eq("community", id)
    .single();

  if (!event) {
    return notFound();
  }

  const { data: community, error: communityError } = await supabase
    .from("communities")
    .select("*")
    .eq("id", id)
    .single();

  if (communityError) {
    return notFound();
  }

  const { data: attendees_count, error: registeredCountError } =
    await supabase.rpc("attendees_count", { event_id: eventId });

  if (registeredCountError) {
    return notFound();
  }

  const { data: currentUserRole, error: currentUserRoleError } = await supabase
    .from("Circles")
    .select("role")
    .eq("community", id)
    .eq("member", member.id)
    .single();

  let { data: registration, error: isRegisteredError } = await supabase.rpc(
    "am_i_attending",
    { event_id: eventId }
  );

  if (isRegisteredError) {
    return notFound();
  }

  return (
    <EventDetail
      event={
        {
          ...event,
          currentUserRole: currentUserRole?.role,
          communityId: id,
          communityEmail: community.email,
          communityName: community.name,
          communityWebsite: community.website,
          capacity: event.capacity,
          attendees: attendees_count,
          eventType: event.type ? "public" : "private",
          isRegistered: registration.length > 0,
        } as EventDetailData
      }
    />
  );
}
