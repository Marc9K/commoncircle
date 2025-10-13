import { Flex, MantineBreakpoint } from "@mantine/core";

export default function Variable({
  children,
  at,
}: {
  children: React.ReactNode[];
  at: MantineBreakpoint;
}) {
  return (
    <Flex w="100%">
      <Flex w="100%" visibleFrom={at}>
        {children[0]}
      </Flex>
      <Flex w="100%" hiddenFrom={at}>
        {children[1]}
      </Flex>
    </Flex>
  );
}
