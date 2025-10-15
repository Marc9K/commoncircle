"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

function EmailLoginForm({
  setIsLoading,
  setError,
  isLoading,
}: {
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      await createMember("/communities", supabase);
      router.push("/communities");
      window.location.href = "/communities";
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleEmailLogin}
      className="flex flex-col gap-4"
      data-testid="email-login-form"
    >
      <div className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
          required
          data-testid="email-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
          required
          data-testid="password-input"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        data-testid="email-signin-button"
      >
        {isLoading ? "Signing in..." : "Sign in with Email"}
      </Button>
    </form>
  );
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${
            typeof window !== "undefined" ? window.location.origin : ""
          }/communities`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="flex flex-col gap-6" data-testid="login-form">
      {error && (
        <p className="text-sm text-destructive-500" data-testid="login-error">
          {error}
        </p>
      )}

      {isDevelopment && (
        <EmailLoginForm
          setIsLoading={setIsLoading}
          setError={setError}
          isLoading={isLoading}
        />
      )}

      <form onSubmit={handleSocialLogin} data-testid="google-oauth-form">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          data-testid="google-signin-button"
        >
          {isLoading ? "Logging in..." : "Sign in with Google"}
        </Button>
      </form>
    </div>
  );
}
