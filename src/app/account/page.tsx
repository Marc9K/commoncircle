import { redirect } from "next/navigation";
import { Account } from "@/components/Account";

export default async function AccountPage() {
  const user = undefined;

  if (!user) {
    redirect("/auth/login");
  }

  const userData = {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
    email: user.email || "",
  };

  return <Account user={userData} />;
}
