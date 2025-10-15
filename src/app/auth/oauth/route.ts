"use client";

import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/client";
import { createMember } from "@/components/LoginForm/login-form";
import { cacheGoogleAvatar } from "@/lib/supabase/avatar-cache";

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
      
      // Get user data to cache avatar
      const { data: { user } } = await supabase.auth.getUser();
      let cachedAvatarUrl: string | null = null;
      
      if (user?.user_metadata?.avatar_url) {
        console.log("Caching Google avatar...");
        const avatarResult = await cacheGoogleAvatar(
          user.user_metadata.avatar_url,
          user.id
        );
        cachedAvatarUrl = avatarResult.url;
        
        if (avatarResult.success) {
          console.log("Avatar cached successfully:", cachedAvatarUrl);
        } else {
          console.warn("Avatar caching failed, using Google URL:", avatarResult.error);
        }
      }
      
      createMember(next, supabase, request, cachedAvatarUrl);
    } else {
      console.error("Code exchange failed:", error);
    }
  } else {
    console.log("No code provided, redirecting to error page");
  }

  console.log("Redirecting to error page:", `${origin}/auth/error`);
  return NextResponse.redirect(`${origin}/auth/error`);
}
