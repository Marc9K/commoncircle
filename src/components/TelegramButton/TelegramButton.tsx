"use client";
import { LoginButton } from "@telegram-auth/react";
import { linkTelegramAccount } from "@/lib/actions/telegram-actions";

export default function TelegramButton({
  consentGiven,
}: {
  consentGiven: boolean;
}) {
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;
  if (!botUsername) {
    return null;
  }

  return (
    <LoginButton
      botUsername={botUsername}
      requestAccess={consentGiven ? "write" : null}
      onAuthCallback={async (data) => {
        console.log(data);
        const authData = new Map(Object.entries(data));
        await linkTelegramAccount(authData);
      }}
    />
  );
}
