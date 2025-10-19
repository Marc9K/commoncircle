"use client";

import {
  Container,
  Stack,
  Title,
  Text,
  List,
  Divider,
  Anchor,
} from "@mantine/core";
import { FcCheckmark } from "react-icons/fc";

export default function PrivacyPolicy() {
  const dpoEmail = process.env.NEXT_PUBLIC_DPO_EMAIL;
  return (
    <Container size="md" pt={160} pb={80}>
      <Stack gap="xl">
        <Stack gap="lg">
          <Title order={1}>Common Circle customer privacy notice</Title>
          <Text>
            This privacy notice tells you what to expect us to do with your
            personal information.
          </Text>
        </Stack>
        {dpoEmail && (
          <Stack gap="md">
            <Title order={2}>Contact details</Title>
            <Text fw={500}>Email</Text>
            <Text>{dpoEmail}</Text>
          </Stack>
        )}

        <Divider />

        <Stack gap="md">
          <Title order={2}>What information we collect, use, and why</Title>
          <Text>
            We collect or use the following information to{" "}
            <Text component="span" fw={500}>
              provide services and goods, including delivery
            </Text>
            :
          </Text>
          <List>
            <List.Item>Names and contact details</List.Item>
            <List.Item>Purchase or account history</List.Item>
            <List.Item>
              Payment details (including card or bank information for transfers
              and direct debits)
            </List.Item>
            <List.Item>Account information</List.Item>
          </List>

          <Text>
            We collect or use the following information for{" "}
            <Text component="span" fw={500}>
              the operation of customer accounts and guarantees
            </Text>
            :
          </Text>
          <List>
            <List.Item>Names and contact details</List.Item>
            <List.Item>Purchase history</List.Item>
            <List.Item>
              Account information, including registration details
            </List.Item>
          </List>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title order={2}>Lawful bases and data protection rights</Title>
          <Text>
            Under UK data protection law, we must have a &quot;lawful
            basis&quot; for collecting and using your personal information.
            There is a list of possible{" "}
            <Anchor
              href="https://ico.org.uk/for-organisations/advice-for-small-organisations/getting-started-with-gdpr/data-protection-principles-definitions-and-key-terms/#lawfulbasis"
              target="_blank"
            >
              lawful bases
            </Anchor>{" "}
            in the UK GDPR. You can find out more about lawful bases on the
            ICO&apos;s website.
          </Text>

          <Text>
            Which lawful basis we rely on may affect your data protection rights
            which are set out in brief below. You can find out more about your
            data protection rights and the exemptions which may apply on the
            ICO&apos;s website:
          </Text>

          <List withPadding size="lg" icon={<FcCheckmark size={16} />}>
            <List.Item>
              <Text fw={700}>Your right of access</Text>You have the right to
              ask us for copies of your personal information. You can request
              other information such as details about where we get personal
              information from and who we share personal information with. There
              are some exemptions which means you may not receive all the
              information you ask for. If you would like to request a copy of
              your personal information, please use Download My Data button in
              the <Anchor href="/account">account settings</Anchor>.{" "}
              <Anchor
                href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#roa"
                target="_blank"
              >
                Read more about the right of access
              </Anchor>
              .
            </List.Item>
            <List.Item>
              <Text fw={700}>Your right to rectification</Text>You have the
              right to ask us to correct or delete personal information you
              think is inaccurate or incomplete.{" "}
              <Anchor
                href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rtr"
                target="_blank"
              >
                Read more about the right to rectification
              </Anchor>
              .
            </List.Item>
            <List.Item>
              <Text fw={700}>Your right to erasure</Text>You have the right to
              ask us to delete your personal information. If you would like to
              delete your personal information, please delete your account
              through the <Anchor href="/account">account settings</Anchor>.{" "}
              <Anchor
                href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rte"
                target="_blank"
              >
                Read more about the right to erasure
              </Anchor>
              .
            </List.Item>
            <List.Item>
              <Text fw={700}>Your right to restriction of processing</Text>You
              have the You have the right to ask us to limit how we can use your
              personal information.{" "}
              <Anchor
                href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rtrop"
                target="_blank"
              >
                Read more about the right to restriction of processing
              </Anchor>
              .
            </List.Item>
            <List.Item>
              <Text fw={700}>Your right to object to processing</Text>You have
              the have the right to object to the processing of your personal
              data. If you would like to object to the processing of your
              personal data, please delete your account through the{" "}
              <Anchor href="/account">account settings</Anchor>.{" "}
              <Anchor
                href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rto"
                target="_blank"
              >
                Read more about the right to object to processing
              </Anchor>
              .
            </List.Item>
            <List.Item>
              <Text fw={700}>Your right to data portability</Text>You have the
              right to ask that we transfer the personal information you gave us
              to another organisation, or to you.{" "}
              <Anchor
                href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rtdp"
                target="_blank"
              >
                Read more about the right to data portability
              </Anchor>
              .
            </List.Item>
            <List.Item>
              <Text fw={700}>Your right to withdraw consent</Text>When we use
              consent as our lawful basis you have the right to withdraw your
              consent at any time. If you would like to withdraw your consent,
              please delete your account through the{" "}
              <Anchor href="/account">account settings</Anchor>.{" "}
              <Anchor
                href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rtwc"
                target="_blank"
              >
                Read more about the right to withdraw consent
              </Anchor>
              .
            </List.Item>
          </List>

          <Text>
            If you make a request, we must respond to you without undue delay
            and in any event within one month.
          </Text>

          <Text>
            To make a data protection rights request, please contact us using
            the contact details at the top of this privacy notice.
          </Text>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title order={2}>
            Our lawful bases for the collection and use of your data
          </Title>
          <Text>
            Our lawful bases for collecting or using personal information to{" "}
            <Text component="span" fw={500}>
              provide services and goods
            </Text>{" "}
            are:
          </Text>
          <List>
            <List.Item>
              Consent - we have permission from you after we gave you all the
              relevant information. All of your data protection rights may
              apply, except the right to object. To be clear, you do have the
              right to withdraw your consent at any time.
            </List.Item>
          </List>

          <Text>
            Our lawful bases for collecting or using personal information for{" "}
            <Text component="span" fw={500}>
              the operation of customer accounts and guarantees
            </Text>{" "}
            are:
          </Text>
          <List>
            <List.Item>
              Consent - we have permission from you after we gave you all the
              relevant information. All of your data protection rights may
              apply, except the right to object. To be clear, you do have the
              right to withdraw your consent at any time.
            </List.Item>
          </List>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title order={2}>Where we get personal information from</Title>
          <List>
            <List.Item>Directly from you</List.Item>
          </List>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title order={2}>How long we keep information</Title>
          <Text>
            We keep your personal information for as long as you have an account
            with us. You can delete your account at any time which will delete
            all your personal information.
          </Text>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title order={2}>Who we share information with</Title>
          <Title order={3}>Data processors</Title>

          <Text fw={500}>Supabase</Text>
          <Text>
            This data processor does the following activities for us: Stores and
            processes data
          </Text>

          <Text fw={500}>Vercel</Text>
          <Text>
            This data processor does the following activities for us: Presents
            users with the web site
          </Text>

          <Title order={3}>Others we share personal information with</Title>
          <List>
            <List.Item>
              Publicly on our website, social media or other marketing and
              information media
            </List.Item>
          </List>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title order={2}>How to complain</Title>
          <Text>
            If you have any concerns about our use of your personal data, you
            can make a complaint to us using the contact details at the top of
            this privacy notice.
          </Text>

          <Text>
            If you remain unhappy with how we&apos;ve used your data after
            raising a complaint with us, you can also complain to the ICO.
          </Text>

          <Text>The ICO&apos;s address:</Text>
          <Text>
            Information Commissioner&apos;s Office
            <br />
            Wycliffe House
            <br />
            Water Lane
            <br />
            Wilmslow
            <br />
            Cheshire
            <br />
            SK9 5AF
          </Text>

          <Text>Helpline number: 0303 123 1113</Text>

          <Text>
            Website:{" "}
            <Anchor href="https://ico.org.uk/make-a-complaint/" target="_blank">
              https://www.ico.org.uk/make-a-complaint
            </Anchor>
          </Text>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title order={2}>Last updated</Title>
          <Text size="sm" c="dimmed">
            {new Date().toLocaleDateString("en-GB")}
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
