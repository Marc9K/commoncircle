"use client";

import { useParams } from "next/navigation";
import { CommunityManage } from "@/components/CommunityManage/CommunityManage";

export default function CommunityManagePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  return (
    <CommunityManage
      community={undefined}
      managers={undefined}
      pendingMembers={undefined}
      existingMembers={undefined}
      communityId={id}
      currentUserRole={undefined}
    />
  );
}
