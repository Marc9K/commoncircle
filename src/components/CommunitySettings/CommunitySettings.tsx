"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Stack,
  Card,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Switch,
  Divider,
  Alert,
  Modal,
  Select,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcEmptyTrash, FcHighPriority } from "react-icons/fc";
import {
  createStripeAccount,
  createStripeAccountLink,
  verifyStripeAccount as verifyStripeAccountAction,
  deleteStripeAccount,
} from "@/lib/actions/stripe-actions";

export function CommunitySettings() {
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [verifyingStripeAccount, setVerifyingStripeAccount] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const supabase = createClient();
  const router = useRouter();
  const { id: communityId } = useParams();
  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    stripeAccountId: null as string | null,
    isPaymentEnabled: false,
  });
  const [creatingOnboardingLink, setCreatingOnboardingLink] = useState(false);

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      const { data: community } = await supabase
        .from("communities")
        .select("stripe_account, allowPayments")
        .eq("id", communityId)
        .single();
      if (community) {
        setPaymentSettings({
          stripeAccountId: community.stripe_account,
          isPaymentEnabled: community.allowPayments,
        });
      }
    };
    fetchPaymentSettings();
  }, [communityId]);

  const handleDeleteCommunity = async () => {
    setIsDeleting(true);
    console.log("Deleting community:", communityId);
    try {
      const { error } = await supabase
        .from("communities")
        .delete()
        .eq("id", communityId);
      setIsDeleting(false);
      if (error) {
        throw error;
      }
      closeDelete();
      router.push("/");
    } catch (error) {
      console.error("Error deleting community:", error);
    }
  };

  const connectStripe = async () => {
    setCreatingOnboardingLink(true);

    try {
      console.log("Creating stripe account");
      const accountResult = await createStripeAccount();
      if (!accountResult.success) {
        throw new Error(accountResult.error);
      }

      const account = accountResult.account!;
      // console.log("Stripe account created", JSON.stringify(account, null, 2));

      const accountLinkResult = await createStripeAccountLink(
        account.id,
        `${process.env.NEXT_PUBLIC_WEB_URL}/communities/${communityId}/`,
        `${process.env.NEXT_PUBLIC_WEB_URL}/communities/${communityId}/`
      );

      if (!accountLinkResult.success) {
        throw new Error(accountLinkResult.error);
      }

      const accountLink = accountLinkResult.accountLink!;
      // console.log("Account link created", JSON.stringify(accountLink, null, 2));

      const { error } = await supabase
        .from("communities")
        .update({ stripe_account: account.id })
        .eq("id", communityId);
      if (error) {
        console.error(error);
      } else {
        setPaymentSettings({
          ...paymentSettings,
          stripeAccountId: account.id,
        });
      }

      router.push(accountLink.url!);
    } catch (error) {
      console.error(
        "An error occurred when calling the Stripe API to create an account",
        error
      );
    }
  };

  //   if (!canManageSettings) {
  //     return (
  //       <Alert color="yellow" title="Limited Access">
  //         You need owner permissions to manage community settings.
  //       </Alert>
  //     );
  //   }

  const verifyStripeAccount = async () => {
    setVerifyingStripeAccount(true);

    const { data: community } = await supabase
      .from("communities")
      .select("stripe_account")
      .eq("id", communityId)
      .single();
    console.log(
      "Verifying stripe account",
      paymentSettings.stripeAccountId ?? community?.stripe_account
    );

    const accountId =
      paymentSettings.stripeAccountId ?? community?.stripe_account;
    const verifyResult = await verifyStripeAccountAction(accountId);

    if (!verifyResult.success) {
      throw new Error(verifyResult.error);
    }

    console.log(
      "Stripe account verification result",
      verifyResult.detailsSubmitted
    );
    console.log(
      "Stripe account retrieved",
      JSON.stringify(verifyResult, null, 2)
    );
    if (verifyResult.chargesEnabled) {
      const { error } = await supabase
        .from("communities")
        .update({ allowPayments: true })
        .eq("id", communityId);
      if (error) {
        console.error(error);
      } else {
        setPaymentSettings({
          ...paymentSettings,
          isPaymentEnabled: true,
        });
      }
    } else {
      console.error("Stripe account is not verified");
    }
    setVerifyingStripeAccount(false);
  };

  const disconnectStripeAccount = async () => {
    console.log("Disconnecting stripe account");

    const { data: community } = await supabase
      .from("communities")
      .select("stripe_account")
      .eq("id", communityId)
      .single();

    const accountId =
      paymentSettings.stripeAccountId ?? community?.stripe_account;
    const deleteResult = await deleteStripeAccount(accountId);

    if (!deleteResult.success) {
      throw new Error(deleteResult.error);
    }

    const deleted = deleteResult.deleted!;
    console.log("Stripe account deleted", JSON.stringify(deleted, null, 2));
    if (!deleted.deleted) {
      notifications.show({
        title: "Error disconnecting stripe account",
        message: "Failed to disconnect stripe account. Please try again.",
        color: "red",
      });
      return;
    }
    const { error } = await supabase
      .from("communities")
      .update({ stripe_account: null, allowPayments: false })
      .eq("id", communityId);
    if (error) {
      console.error(error);
    } else {
      notifications.show({
        title: "Stripe account disconnected",
        message: "Stripe account has been disconnected.",
        color: "green",
      });
    }
    setPaymentSettings({
      ...paymentSettings,
      stripeAccountId: null,
      isPaymentEnabled: false,
    });
  };

  const stopPayments = async () => {
    console.log("Disconnecting stripe account");
    const { error } = await supabase
      .from("communities")
      .update({ allowPayments: false })
      .eq("id", communityId);
    if (error) {
      console.error(error);
    } else {
      setPaymentSettings({
        ...paymentSettings,
        isPaymentEnabled: false,
      });
    }
  };

  return (
    <Stack gap="lg">
      <Card withBorder padding="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Title order={4}>Payments</Title>
            </div>
            {paymentSettings.isPaymentEnabled ? (
              <Button color="red" onClick={disconnectStripeAccount}>
                Disconnect Stripe Account
              </Button>
            ) : (
              <Button
                loading={creatingOnboardingLink}
                onClick={connectStripe}
                disabled={verifyingStripeAccount}
              >
                Onboard to collect payments
              </Button>
            )}
          </Group>

          <Group>
            <Switch
              label={paymentSettings.isPaymentEnabled ? "Enabled" : "Disabled"}
              thumbIcon={
                verifyingStripeAccount ? <Loader size={12} /> : undefined
              }
              disabled={
                !paymentSettings.stripeAccountId || verifyingStripeAccount
              }
              description="Allow members to pay for events online"
              checked={paymentSettings.isPaymentEnabled}
              onChange={async (event) => {
                event.preventDefault();
                event.target;
                if (event.currentTarget.checked) {
                  await verifyStripeAccount();
                } else {
                  await stopPayments();
                  setPaymentSettings({
                    ...paymentSettings,
                    isPaymentEnabled: event.currentTarget.checked,
                  });
                }
              }}
            />
          </Group>
        </Stack>
      </Card>

      <Card
        withBorder
        padding="lg"
        style={{ borderColor: "var(--mantine-color-red-6)" }}
      >
        <Stack gap="md">
          <Group>
            <FcHighPriority size={24} color="var(--mantine-color-red-6)" />
            <div>
              <Title order={4} c="red">
                Danger Zone
              </Title>
              <Text size="sm" c="dimmed">
                Irreversible and destructive actions
              </Text>
            </div>
          </Group>

          <Divider />

          <Group justify="space-between">
            <div>
              <Text fw={500}>Delete Community</Text>
              <Text size="sm" c="dimmed">
                Permanently delete this community and all its data. This action
                cannot be undone.
              </Text>
            </div>
            <Button
              color="red"
              variant="outline"
              leftSection={<FcEmptyTrash size={16} />}
              onClick={openDelete}
            >
              Delete Community
            </Button>
          </Group>
        </Stack>
      </Card>

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Community"
        centered
      >
        <Stack gap="md">
          <Alert color="red" title="Warning">
            This action cannot be undone. This will permanently delete the
            community, all events, members, and associated data.
          </Alert>

          <Text size="sm">
            Please type <strong>DELETE</strong> to confirm:
          </Text>

          <TextInput
            data-testid="community-description-input"
            placeholder="Type DELETE to confirm"
            onChange={(event) => {
              if (event.currentTarget.value === "DELETE") {
                setDeleteConfirmation(event.currentTarget.value);
              }
            }}
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={closeDelete}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDeleteCommunity}
              loading={isDeleting}
              disabled={deleteConfirmation !== "DELETE"}
              data-testid="save-settings-button"
            >
              Delete Community
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
