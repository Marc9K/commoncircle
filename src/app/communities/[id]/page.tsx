"use server";

import { notFound } from "next/navigation";
import CommunityDetail, {
  CommunityDetailData,
} from "@/components/CommunityDetail/CommunityDetail";
import { createClient } from "@/lib/supabase/server";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: community, error } = await supabase
    .from("communities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return notFound();
  }

  const { data: count } = await supabase.rpc("community_members_count", {
    community_id: id,
  });

  let circle: {
    role: "owner" | "manager" | "event_creator" | "door_person" | "member";
  } | null = null;

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (!userError && user.user) {
    const { data: member, error: memberError } = await supabase
      .from("Members")
      .select("*")
      .eq("uid", user.user.id)
      .single();
    if (!memberError && member) {
      const { data } = await supabase
        .from("Circles")
        .select("*")
        .eq("community", id)
        .eq("member", member.id)
        .single();
      if (!error && data) {
        circle = data;
      }
    }
  }

  const { data: futureEvents, error: eventsError } = await supabase.rpc(
    "get_future_events",
    { community_id: id }
  );
  if (eventsError) {
    return notFound();
  }
  const { data: pastEvents, error: pastEventsError } = await supabase.rpc(
    "get_past_events",
    { community_id: id }
  );
  if (pastEventsError) {
    return notFound();
  }

  return (
    <CommunityDetail
      community={
        {
          ...community,
          memberCount: count,
          isMember: circle != undefined,
          joinRequestPending: circle?.role && circle.role == undefined,
          pastEvents: pastEvents,
          futureEvents: futureEvents,
          currentUserRole: circle?.role,
        } as CommunityDetailData
      }
    />
  );
}
