"use client";

import {
  Stack,
  Card,
  Text,
  Button,
  Group,
  Title,
  Alert,
  Modal,
  TextInput,
  Checkbox,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { FcDownload } from "react-icons/fc";
import { notifications } from "@mantine/notifications";
import TelegramButton from "../TelegramButton/TelegramButton";
import { Member } from "@/types/member";

export interface AccountSettingsProps {
  user: User;
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [member, setMember] = useState<Member | null>(null);

  const supabase = createClient();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      // Redirect will be handled by middleware
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDownloadData = async () => {
    setIsDownloading(true);
    try {
      const { data, error } = await supabase.rpc("get_all_my_data");

      if (error) {
        console.error("Error fetching data:", error);
        alert("Failed to download your data. Please try again.");
        return;
      }

      // Create a JSON blob and download it
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `my-commoncircle-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading data:", error);
      notifications.show({
        title: "Error downloading data",
        message: "Failed to download your data. Please try again.",
        color: "red",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc("delete_my_data");
      if (error) {
        console.error("Error deleting member:", error);
        notifications.show({
          title: "Error deleting account",
          message: "Failed to delete your account. Please try again.",
          color: "red",
        });
      } else {
        notifications.show({
          title: "Account deleted",
          message: "Your account has been deleted.",
          color: "green",
        });

        await supabase.auth.signOut();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchMember = async () => {
      const { data: member } = await supabase
        .from("Members")
        .select("*")
        .eq("uid", user.id)
        .single();
      setMember(member);
    };
    fetchMember();
  }, [user.id]);

  return (
    <Stack gap="lg">
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={3} size="h4">
            Profile Information
          </Title>

          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500}>
                Name
              </Text>
              <Text size="sm" c="dimmed">
                {user.user_metadata.name}
              </Text>
            </div>
          </Group>

          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500}>
                Email Address
              </Text>
              <Text size="sm" c="dimmed">
                {user.email}
              </Text>
            </div>
          </Group>
          {member?.telegram_username && (
            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>
                  Telegram
                </Text>
                <Text size="sm" c="dimmed">
                  {member.telegram_username}
                </Text>
              </div>
            </Group>
          )}
        </Stack>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={3} size="h4">
            Account Actions
          </Title>

          <Group justify="flex-start" gap="md">
            <Button
              variant="filled"
              onClick={handleSignOut}
              loading={isSigningOut}
              data-testid="sign-out-button"
            >
              Sign Out
            </Button>
            <Button
              variant="outline"
              leftSection={<FcDownload size={16} />}
              onClick={handleDownloadData}
              loading={isDownloading}
              data-testid="download-data-button"
            >
              Download My Data
            </Button>
            <Stack>
              <TelegramButton consentGiven={consentGiven} />
              <Checkbox
                label="I want to be communicated via Telegram"
                checked={consentGiven}
                onChange={(e) => {
                  setConsentGiven(e.target.checked);
                }}
              />
            </Stack>
          </Group>
        </Stack>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={3} size="h4" c="red">
            Danger Zone
          </Title>

          <Alert color="red" variant="light">
            <Text size="sm">
              Deleting your account will permanently remove all your data,
              including your communities and event registrations. This action
              cannot be undone.
            </Text>
          </Alert>

          <Group justify="flex-start">
            <Button
              variant="outline"
              color="red"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete Account
            </Button>
          </Group>
        </Stack>
      </Card>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete your account? This action cannot be
            undone and will permanently remove all your data.
          </Text>

          <Text size="sm" c="dimmed">
            Type <strong>DELETE</strong> to confirm:
          </Text>

          <TextInput
            placeholder="Type DELETE to confirm"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />

          <Group justify="flex-end" gap="md">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDeleteAccount}
              loading={isDeleting}
              disabled={deleteConfirmation !== "DELETE"}
            >
              Delete Account
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
