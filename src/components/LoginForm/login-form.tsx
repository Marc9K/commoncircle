"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { createMember } from "@/app/auth/oauth/route";

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
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      const url = (await createMember("/communities", supabase)).url;
      router.push(url);
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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
          redirectTo: `${window.location.origin}/auth/oauth?next=/communities`,
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
