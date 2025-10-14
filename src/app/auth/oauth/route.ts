"use client";

import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

export async function createMember(
  next: string,
  supabase?: SupabaseClient,
  request?: Request
) {
  supabase = supabase ?? createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User data:", {
    userId: user?.id,
    email: user?.email,
    name: user?.user_metadata?.name,
  });

  if (user) {
    const { error: memberError } = await supabase
      .from("Members")
      .select("id")
      .eq("uid", user.id)
      .single();

    // If member doesn't exist
    if (memberError && memberError.code === "PGRST116") {
      console.log("Creating new member for user:", user.id);
      const { error: insertError } = await supabase.from("Members").insert({
        uid: user.id,
        name: user.user_metadata?.name,
        email: user.email,
        avatar_url: user.user_metadata?.avatar_url,
      });

      if (insertError) {
        console.error("Error creating member:", insertError);
      } else {
        console.log("Member created successfully");
      }
    } else if (memberError) {
      console.error("Error checking member existence:", memberError);
    } else {
      console.log("Member already exists");
    }
  }

  const forwardedHost = request?.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  console.log("Redirecting to:", {
    next,
    origin,
    isLocalEnv,
    forwardedHost,
  });

  if (isLocalEnv) {
    // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
    console.log("Local redirect to:", `${origin}${next}`);
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    console.log("Production redirect to:", `https://${forwardedHost}${next}`);
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    console.log("Default redirect to:", `${origin}${next}`);
    return NextResponse.redirect(`${origin}${next}`);
  }
}

export async function GET(request: Request) {
  console.log("OAuth route called with:", request);
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  console.log("OAuth route called with:", {
    code: code ? "present" : "missing",
    next,
    origin,
    url: request.url,
  });

  if (code) {
    console.log("Processing OAuth code exchange...");
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      console.log("Code exchange successful");
      createMember(next, supabase, request);
    } else {
      console.error("Code exchange failed:", error);
    }
  } else {
    console.log("No code provided, redirecting to error page");
  }

  console.log("Redirecting to error page:", `${origin}/auth/error`);
  return NextResponse.redirect(`${origin}/auth/error`);
}
