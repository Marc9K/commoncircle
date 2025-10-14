"use server";

import { Account } from "@/components/Account/Account";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) {
    redirect("/auth/login");
  }

  // First get the member record for the current user
  const { data: currentMember } = await supabase
    .from("Members")
    .select("id")
    .eq("uid", user.id)
    .single();

  const { data: runningCommunities } = await supabase
    .from(`Circles`)
    .select(`role, community (id, name, picture)`)
    .eq("member", currentMember?.id)
    .in("role", ["owner", "manager", "event_creator"]);
  const { data: memberCommunities } = await supabase
    .from(`Circles`)
    .select(`role, community (id, name, picture)`)
    .eq("member", currentMember?.id)
    .in("role", ["member", "door_person"]);

  const { data: pastEvents } = await supabase.rpc("get_my_past_events");

  const { data: futureEvents } = await supabase.rpc("get_my_future_events");

  return (
    <Account
      user={user}
      memberCommunities={memberCommunities ?? []}
      runningCommunities={runningCommunities ?? []}
      pastEvents={pastEvents ?? []}
      futureEvents={futureEvents ?? []}
    />
  );
}
