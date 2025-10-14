import { CommunityEditForm } from "@/components/CommunityEditForm/CommunityEditForm";
import { Container } from "@mantine/core";

export default function NewCommunity() {
  return (
    <Container size="lg" mt={100}>
      <CommunityEditForm />
    </Container>
  );
}
