"use client";
import { Container, Flex, Group, Title } from "@mantine/core";
import classes from "./Header.module.css";
import { FcCalendar } from "react-icons/fc";
import AccountButton from "./AccountButton";
import MainTabs from "./MainTabs";
import React from "react";
import Variable from "../Variable/Variable";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const supabase = createClient();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <>
      <div className={classes.header}>
        <Container className={classes.mainSection} size="md">
          <Group justify="space-between">
            <Flex align="center" gap={8}>
              <FcCalendar size={32} />
              <Variable at="xs">
                <Title order={1}>CommonCircle</Title>

                <Title order={1}>CC</Title>
              </Variable>
            </Flex>

            <AccountButton user={user} />
          </Group>
        </Container>
        <MainTabs />
      </div>
    </>
  );
}
