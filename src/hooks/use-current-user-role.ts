import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export const useCurrentUserRole = (communityId: string) => {
  const [role, setRole] = useState<
    "owner" | "manager" | "event_creator" | "door_person" | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setRole(null);
          setLoading(false);
          return;
        }

        const mockRole = Math.random() > 0.5 ? "manager" : null;
        setRole(mockRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [communityId]);

  return { role, loading };
};
