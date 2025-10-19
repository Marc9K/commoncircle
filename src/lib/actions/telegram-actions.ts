'use server'

import { AuthDataValidator } from "@telegram-auth/server";
import { createClient } from "../supabase/server";

export async function linkTelegramAccount(data: Map<string, string>) {
  const botUsername = process.env.BOT_USERNAME;
  const botToken = process.env.BOT_TOKEN;
  if (!botUsername || !botToken) {
    return null;
  }
  const supabase = await createClient();
  const { data: { user }} = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  console.log(data);
    const validator = new AuthDataValidator({ botToken });


    try {
        const telegramUser = await validator.validate(data);
        console.log(user);
        await supabase
        .from("Members")
        .update({
            telegram_id: telegramUser.id,
            telegram_username: telegramUser.username,
        })
        .eq("uid", user.id);
        console.log(telegramUser);
    } catch (error) {
        console.error(error);
    }
}