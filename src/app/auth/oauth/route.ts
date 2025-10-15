"use client";

import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/client";
import { createMember } from "@/components/LoginForm/login-form";

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
