import { Avatar, Group, UnstyledButton, Text, Button } from "@mantine/core";
import cx from "clsx";

import classes from "./Header.module.css";

function Account({ user }) {
  return (
    <UnstyledButton
      hidden={user == undefined}
      className={cx(classes.user)}
      href="/account"
      component="a"
    >
      <Group gap={7}>
        <Avatar src={"/person.svg"} alt={user.name} radius="xl" size={20} />
        <Text fw={500} size="sm" lh={1} mr={3}>
          {user.name}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

function LoginButton() {
  return <Button variant="filled">Login</Button>;
}

export default function AccountButton() {
  const user = { name: "John" };
  return user ? Account({ user }) : LoginButton();
}
