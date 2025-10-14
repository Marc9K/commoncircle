"use client";
import {
  Container,
  Group,
  Tabs,
  TextInput,
  VisuallyHidden,
  Stack,
} from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { FcSearch } from "react-icons/fc";
import classes from "./Header.module.css";
import Variable from "../Variable/Variable";
import { useState } from "react";

const tabs = [
  { value: "/", label: "Home" },
  { value: "/communities", label: "Communities" },
];

function TheTabs() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Tabs
      value={pathname}
      defaultValue="/"
      variant="outline"
      classNames={{
        root: classes.tabs,
        list: classes.tabsList,
        tab: classes.tab,
      }}
      onChange={(value) => {
        router.push(value as string);
      }}
    >
      <Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Tab value={tab.value} key={tab.value}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Panel value={tab.value} key={tab.value}>
          <VisuallyHidden></VisuallyHidden>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

function Input() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  return (
    <TextInput
      placeholder="Search"
      aria-label="Search"
      leftSection={<FcSearch size={16} />}
      value={search}
      onChange={(event) => {
        const value = event.target.value;
        setSearch(value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          router.push(`/communities?search=${search}`);
        }
      }}
    />
  );
}

function CompactTabs() {
  return (
    <Stack>
      <Input />
      <TheTabs />
    </Stack>
  );
}

function FullTabs() {
  return (
    <Group justify="space-between">
      <TheTabs />
      <Input />
    </Group>
  );
}

export default function MainTabs() {
  return (
    <Container size="md">
      <Variable at="xs">
        {FullTabs()}
        {CompactTabs()}
      </Variable>
    </Container>
  );
}
