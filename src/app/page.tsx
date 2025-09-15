"use client";

import { Header } from "@/components/header/Header";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function Home() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
