import cx from "clsx";
import {
  Avatar,
  Burger,
  Container,
  Flex,
  Group,
  Tabs,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { FcCalendar, FcSearch } from "react-icons/fc";

const tabs = ["Home", "Communities"];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          <Flex align="center" gap={8}>
            <FcCalendar size={32} />
            <Title order={1} visibleFrom="xs">
              CommonCircle
            </Title>
            <Title order={1} hiddenFrom="xs">
              CC
            </Title>
          </Flex>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

          <UnstyledButton className={cx(classes.user)}>
            <Group gap={7}>
              <Avatar
                src={"./favicon.ico"}
                alt={"user.name"}
                radius="xl"
                size={20}
              />
              <Text fw={500} size="sm" lh={1} mr={3}>
                {"user.name"}
              </Text>
            </Group>
          </UnstyledButton>
        </Group>
      </Container>
      <Container size="md">
        <Group justify="space-between">
          <Tabs
            defaultValue="Home"
            variant="outline"
            visibleFrom="sm"
            classNames={{
              root: classes.tabs,
              list: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <Tabs.List>{items}</Tabs.List>
          </Tabs>
          <TextInput
            placeholder="Search"
            leftSection={<FcSearch size={16} />}
            visibleFrom="xs"
          />
        </Group>
      </Container>
    </div>
  );
}
