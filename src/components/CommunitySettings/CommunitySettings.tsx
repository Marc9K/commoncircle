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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcEmptyTrash, FcHighPriority } from "react-icons/fc";

export function CommunitySettings() {
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [paymentOpened, { open: openPayment, close: closePayment }] =
    useDisclosure(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const supabase = createClient();
  const router = useRouter();
  const { id: communityId } = useParams();
  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    stripeAccountId: "",
    paypalEmail: "",
    bankAccount: "",
    paymentMethod: "stripe" as "stripe" | "paypal",
    isPaymentEnabled: false,
    currency: "USD",
    minimumAmount: 0,
  });

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

  const handleSavePaymentSettings = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      closePayment();
    }, 1000);
  };

  //   if (!canManageSettings) {
  //     return (
  //       <Alert color="yellow" title="Limited Access">
  //         You need owner permissions to manage community settings.
  //       </Alert>
  //     );
  //   }

  return (
    <Stack gap="lg">
      <Card withBorder padding="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Title order={4}>Payments</Title>
            </div>
            <Button onClick={openPayment}>Configure</Button>
          </Group>

          <Group>
            <Switch
              label="Enable"
              description="Allow members to pay for events"
              checked={paymentSettings.isPaymentEnabled}
              onChange={(event) =>
                setPaymentSettings({
                  ...paymentSettings,
                  isPaymentEnabled: event.currentTarget.checked,
                })
              }
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

      {/* Payment Settings Modal */}
      <Modal
        opened={paymentOpened}
        onClose={closePayment}
        title="Payment Settings"
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Payment Method"
            placeholder="Select payment method"
            data={[
              { value: "stripe", label: "Stripe" },
              { value: "paypal", label: "PayPal" },
            ]}
            value={paymentSettings.paymentMethod}
            onChange={(value) =>
              setPaymentSettings({
                ...paymentSettings,
                paymentMethod: value as "stripe" | "paypal",
              })
            }
          />

          {paymentSettings.paymentMethod === "stripe" && (
            <TextInput
              label="Stripe Account ID"
              placeholder="acct_..."
              value={paymentSettings.stripeAccountId}
              onChange={(event) =>
                setPaymentSettings({
                  ...paymentSettings,
                  stripeAccountId: event.currentTarget.value,
                })
              }
            />
          )}

          {paymentSettings.paymentMethod === "paypal" && (
            <TextInput
              label="PayPal Email"
              placeholder="your-email@example.com"
              value={paymentSettings.paypalEmail}
              onChange={(event) =>
                setPaymentSettings({
                  ...paymentSettings,
                  paypalEmail: event.currentTarget.value,
                })
              }
            />
          )}

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={closePayment}>
              Cancel
            </Button>
            <Button onClick={handleSavePaymentSettings} loading={isSaving}>
              Save Settings
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
