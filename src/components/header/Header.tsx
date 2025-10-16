"use client";
import { Container, Flex, Group, Title } from "@mantine/core";
import classes from "./Header.module.css";
import { FcCalendar } from "react-icons/fc";
import AccountButton from "./AccountButton";
import MainTabs from "./MainTabs";
import React, { forwardRef } from "react";
import Variable from "../Variable/Variable";
import { useCurrentMember } from "@/hooks/use-current-member";

export const Header = forwardRef<HTMLDivElement>((props, ref) => {
  const { member } = useCurrentMember();

  return (
    <>
      <div ref={ref} className={classes.header}>
        <Container className={classes.mainSection} size="md">
          <Group justify="space-between">
            <Flex align="center" gap={8}>
              <FcCalendar size={32} />
              <Variable at="xs">
                <Title order={1}>CommonCircle</Title>

                <Title order={1}>CC</Title>
              </Variable>
            </Flex>

            <AccountButton user={member} />
          </Group>
        </Container>
        <MainTabs />
      </div>
    </>
  );
});

Header.displayName = "Header";
