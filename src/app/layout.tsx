"use client";

import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "leaflet/dist/leaflet.css";

import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  MantineProvider,
  NavLink,
  mantineHtmlProps,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "../theme";
import { Header } from "@/components/header/Header";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";

// export const metadata: Metadata = {
//   title: "CommonCircle",
//   description: "Meet your community",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAtBottom = useScrollToBottom();

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications />
          <AppShell
            header={{ height: 60, offset: true }}
            footer={{ collapsed: !isAtBottom, height: 60 }}
          >
            <AppShellHeader>
              <Header />
            </AppShellHeader>
            <AppShellMain>{children}</AppShellMain>
            <AppShellFooter>
              <NavLink href="/privacy" label="Privacy Policy" />
            </AppShellFooter>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
