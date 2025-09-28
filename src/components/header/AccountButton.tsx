import { Avatar, Group, UnstyledButton, Text, Button } from "@mantine/core";
import cx from "clsx";
import Link from "next/link";

import classes from "./Header.module.css";
import { User } from "@supabase/supabase-js";

function Account({ user }: { user: User }) {
  return (
    <UnstyledButton
      hidden={user == undefined}
      className={cx(classes.user)}
      href="/account"
      component="a"
    >
      <Group gap={7}>
        <Avatar
          src={user.user_metadata.avatar_url ?? "/person.svg"}
          alt={user.user_metadata.name}
          radius="xl"
          size={20}
        />
        <Text fw={500} size="sm" lh={1} mr={3}>
          {user.user_metadata.name}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

function LoginButton() {
  return (
    <Button variant="filled" component={Link} href="/auth/login">
      Login
    </Button>
  );
}

export default function AccountButton({ user }: { user?: User }) {
  return user ? Account({ user }) : LoginButton();
}
