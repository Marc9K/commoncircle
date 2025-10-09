"use server";

import { redirect } from "next/navigation";
import { Account } from "@/components/Account/Account";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/server";
import React from "react";
import { Loader } from "@mantine/core";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (user === null) {
  //   redirect("/auth/login");
  // }

  const { data: runningCommunities, error: runningCommunitiesError } =
    await supabase
      .from(`Circles`)
      .select(`role, community (id, name, picture), member (uid)`)
      .eq("member.uid", user.id)
      .in("role", ["owner", "manager"]);

  console.log(runningCommunities);

  return (
    <Account
      user={user}
      memberCommunities={[]}
      runningCommunities={runningCommunities}
      pastEvents={[]}
      futureEvents={[]}
    />
  );
}
