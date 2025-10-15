"use client";

import { CommunityManage } from "@/components/CommunityManage/CommunityManage";
import { PropCommunityManager } from "@/components/CommunityManagers/CommunityManagers";
import { PropPendingMember } from "@/components/PendingMembers/PendingMembers";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function CommunityManagePage() {
  const { id } = useParams();
  const supabase = createClient();

  const fetchCommunity = async () => {
    const { data: community, error } = await supabase
      .from("communities")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !community) {
      console.error(error);
      return null;
    }

    return community;
  };

  const fetchMembers = async () => {
    const { data: members, error: membersError } = await supabase
      .from("Circles")
      .select(
        "role, created_at, community, Members (id, name, email, avatar_url, uid)"
      )
      .eq("community", id);

    if (membersError) {
      console.error(membersError);
    }
    return members || [];
  };

  const { data: community = undefined } = useSWR("community", fetchCommunity);

  const { data: members = [] } = useSWR("members", fetchMembers);

  // if (isLoadingCommunity || membersLoading) {
  //   return (
  //     <Container size="lg" mt={100}>
  //       <Loader />
  //     </Container>
  //   );
  // }

  return (
    <CommunityManage
      community={community}
      managers={(members as unknown as PropCommunityManager[])?.filter(
        (member) =>
          member.role === "manager" ||
          member.role === "owner" ||
          member.role === "event_creator" ||
          member.role === "door_person"
      )}
      pendingMembers={
        members?.filter(
          (member) => member.role == undefined
        ) as unknown as PropPendingMember[]
      }
      existingMembers={members?.filter(
        (member) =>
          member.role === "member" ||
          member.role === "event_creator" ||
          member.role === "door_person"
      )}
    />
  );
}
