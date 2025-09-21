import { Flex, MantineBreakpoint } from "@mantine/core";

export default function Visible({
  children,
  visibleFrom,
  hiddenFrom,
}: {
  children: React.ReactNode;
  visibleFrom?: MantineBreakpoint;
  hiddenFrom?: MantineBreakpoint;
}) {
  return (
    <Flex visibleFrom={visibleFrom} hiddenFrom={hiddenFrom}>
      {children}
    </Flex>
  );
}
