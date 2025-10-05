import { Avatar, Group, UnstyledButton, Text, Button } from "@mantine/core";
import cx from "clsx";
import Link from "next/link";

import classes from "./Header.module.css";
import { Member } from "@/types/member";

function Account({ user }: { user: Member }) {
  return (
    <UnstyledButton
      hidden={user == undefined}
      className={cx(classes.user)}
      href="/account"
      component="a"
    >
      <Group gap={7}>
        <Avatar
          src={user.avatar_url ?? "/person.svg"}
          alt={user.name ?? "User"}
          radius="xl"
          size={20}
        />
        <Text fw={500} size="sm" lh={1} mr={3}>
          {user.name ?? "User"}
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

export default function AccountButton({ user }: { user?: Member | null }) {
  return user ? Account({ user }) : LoginButton();
}
