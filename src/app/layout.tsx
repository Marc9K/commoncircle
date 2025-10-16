"use client";

// import type { Metadata } from "next";
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
import { useRef, useEffect, useState } from "react";

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
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(140);

  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
    }
  }, []);

  return (
    <html
      lang="en"
      title="CommonCircle"
      aria-description="Meet your community"
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications />
          <AppShell
            header={{ offset: true, height: headerHeight }}
            footer={{ collapsed: !isAtBottom, height: 60 }}
          >
            <AppShellHeader>
              <Header ref={headerRef} />
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
