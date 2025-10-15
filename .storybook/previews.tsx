// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { useEffect, useState } from "react";
// import { addons } from "@storybook/preview-api";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import { MantineProvider, useMantineColorScheme } from "@mantine/core";
import { theme } from "../src/theme";
import React from "react";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";

// const channel = addons.getChannel();

function ColorSchemeWrapper({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const handleColorScheme = (value: boolean) =>
    setColorScheme(value ? "dark" : "light");

  // useEffect(() => {
  //   channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
  //   return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  // }, [channel]);

  return <>{children}</>;
}

export const decorators = [
  (renderStory: () => React.ReactNode) => (
    <ColorSchemeWrapper>{renderStory()}</ColorSchemeWrapper>
  ),
  (renderStory: () => React.ReactNode) => (
    <MantineProvider theme={theme}>{renderStory()}</MantineProvider>
  ),
  (renderStory: () => React.ReactNode) => {
    const [pathname, setPathname] = useState("/");
    const [query, setQuery] = useState({});

    const mockRouter: NextRouter = {
      pathname,
      query,
      asPath: pathname,
      basePath: "",
      route: pathname,
      isReady: true,
      isPreview: false,
      isLocaleDomain: false,
      isFallback: false,
      events: {
        on: () => {},
        off: () => {},
        emit: () => {},
      },
      push: async (url: string) => {
        setPathname(url);
        return true;
      },
      replace: async (url: string) => {
        setPathname(url);
        return true;
      },
      reload: () => {},
      back: () => {},
      prefetch: () => Promise.resolve(),
      beforePopState: () => {},
      forward: () => {},
    };

    return (
      <RouterContext.Provider value={mockRouter}>
        {renderStory()}
      </RouterContext.Provider>
    );
  },
];
