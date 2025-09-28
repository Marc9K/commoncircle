"use client";

import { Header } from "@/components/header/Header";
import { AppShell } from "@mantine/core";
import { notFound, useParams, useRouter } from "next/navigation";
import CommunityDetail, {
  CommunityDetailData,
} from "@/components/CommunityDetail/CommunityDetail";

export default function CommunityDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  if (!id) return notFound();

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main mt={{ base: 60, sm: 30 }}>
        <CommunityDetail community={{} as CommunityDetailData} />
      </AppShell.Main>
    </AppShell>
  );
}
