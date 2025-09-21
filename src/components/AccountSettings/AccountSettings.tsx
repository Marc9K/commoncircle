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
} from "@mantine/core";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AccountSettingsProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const supabase = createClient();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      // Redirect will be handled by middleware
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return;
    }

    setIsDeleting(true);
    try {
      // Note: This would typically call a server action or API route
      // to properly delete the user account from both auth and database
      console.log("Delete account functionality would be implemented here");
      
      // For now, just sign out
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

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
                {user.name}
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
        </Stack>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={3} size="h4">
            Account Actions
          </Title>
          
          <Group justify="flex-start">
            <Button
              variant="filled"
              onClick={handleSignOut}
              loading={isSigningOut}
            >
              Sign Out
            </Button>
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