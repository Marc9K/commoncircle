import { Flex, MantineBreakpoint } from "@mantine/core";

export default function Variable({
  children,
  at,
}: {
  children: React.ReactNode[];
  at: MantineBreakpoint;
}) {
  return (
    <Flex>
      <Flex visibleFrom={at}>{children[0]}</Flex>
      <Flex hiddenFrom={at}>{children[1]}</Flex>
    </Flex>
  );
}
