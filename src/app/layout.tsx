import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "../theme";
import { Header } from "@/components/header/Header";

export const metadata: Metadata = {
  title: "CommonCircle",
  description: "Meet your community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <AppShell>
            <AppShellHeader>
              <Header />
            </AppShellHeader>
            <AppShellMain>{children}</AppShellMain>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
