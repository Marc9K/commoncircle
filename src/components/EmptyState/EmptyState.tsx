import { Stack, Text, Center, Button } from "@mantine/core";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="md">
        <Text size="lg" c="dimmed">
          {title}
        </Text>
        <Text size="sm" c="dimmed" ta="center" maw={400}>
          {description}
        </Text>
        {actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
      </Stack>
    </Center>
  );
}