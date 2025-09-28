"use client";

import { redirect } from "next/navigation";
import { Account } from "@/components/Account/Account";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import React from "react";
import { Loader } from "@mantine/core";

export default function AccountPage() {
  const [user, setUser] = React.useState<any>(undefined);
  const supabase = createClient();

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  if (user === null) {
    redirect("/auth/login");
  }
  if (user === undefined) {
    return <Loader />;
  }

  return <Account user={user} />;
}
