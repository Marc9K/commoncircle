"use client";

import { EventForm, EventFormData } from "@/components/EventForm/EventForm";
import { Container, Loader } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Stripe from "stripe";

export default function EditEventPage() {
  const params = useParams<{ id: string; eventId: string }>();
  const router = useRouter();
  const [isLoading] = useState(false);
  const [eventData, setEventData] = useState<Partial<EventFormData> | null>(
    null
  );

  const communityId = params?.id;
  const eventId = params?.eventId;

  const supabase = createClient();
  useEffect(() => {
    const fetchEvent = async () => {
      const { data: event, error } = await supabase
        .from("Events")
        .select("*")
        .eq("id", eventId)
        .single();
      if (error) {
        console.error(error);
      }
      setEventData(event);
    };
    fetchEvent();
  }, [eventId, supabase]);

  if (!communityId || !eventId) {
    return <div>Event not found</div>;
  }

  const handleCancel = () => {
    router.push(`/communities/${communityId}/events/${eventId}`);
  };

  const handleDelete = async () => {
    if (!eventId) return;

    const { error } = await supabase.from("Events").delete().eq("id", eventId);

    if (error) {
      console.error("Error deleting event:", error);
      return;
    }

    // Navigate back to community page after successful deletion
    router.push(`/communities/${communityId}`);
  };

  if (!eventData) {
    return (
      <Container mt={120}>
        <Loader />
      </Container>
    );
  }

  return (
    <Container mt={120}>
      <EventForm
        initialData={eventData}
        onCancel={handleCancel}
        onDelete={handleDelete}
        isEditing={true}
        isLoading={isLoading}
        onSubmit={async (data: EventFormData) => {
          if (!process.env.NEXT_PUBLIC_STRIPE_SANDBOX_KEY) {
            throw new Error("NEXT_PUBLIC_STRIPE_SANDBOX_KEY is not set");
          }
          const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SANDBOX_KEY);
          const createPrice = async (productId: string) => {
            const priceData: {
              currency: string;
              product: string;
              custom_unit_amount?: { enabled: boolean };
              unit_amount?: number;
            } = {
              currency: "GBP",
              product: productId,
            };

            if (data.price === undefined || data.price === null) {
              priceData.custom_unit_amount = {
                enabled: true,
              };
            } else if (data.price > 0) {
              priceData.unit_amount = data.price * 100;
            }

            const price = await stripe.prices.create(priceData);
            return price.id;
          };
          console.log("eventData", eventData);
          console.log("data", data);
          if (
            eventData.title !== data.title ||
            eventData.description !== data.description
          ) {
            const createProduct = async () => {
              const product = await stripe.products.create({
                name: data.title,
                description:
                  data.description.length && data.description.length > 0
                    ? data.description
                    : data.title + " ticket",
              });
              return product.id;
            };
            const productId = await createProduct();
            data.stripe_product_id = productId;
            data.stripe_price_id = await createPrice(productId);
          } else if (
            eventData.price !== data.price &&
            eventData.stripe_product_id
          ) {
            data.stripe_price_id = await createPrice(
              eventData.stripe_product_id
            );
          }
          const startDate = new Date(data.start).toISOString();
          const finishDate = data.finish
            ? new Date(data.finish).toISOString()
            : null;
          const { error } = await supabase
            .from("Events")
            .update({
              title: data.title,
              description: data.description,
              location: data.location,
              tags: data.tags,
              capacity: data.capacity,
              picture: data.picture,
              price: data.isFree ? 0 : data.isPayWhatYouCan ? null : data.price,
              start: startDate,
              finish: finishDate,
              stripe_product_id: data.stripe_product_id,
              stripe_price_id: data.stripe_price_id,
            })
            .eq("id", eventId);
          if (error) {
            console.error(error);
          }
          router.push(`/communities/${communityId}/events/${eventId}`);
        }}
      />
    </Container>
  );
}
