"use server";

import { createClient } from "@/lib/supabase/server";
import { processStripeOperations } from "./stripe-actions";
import { redirect } from "next/navigation";
import { EventFormData } from "@/components/EventForm/EventForm";

export async function updateEvent(
  eventId: string,
  communityId: string,
  eventData: Partial<EventFormData>,
  formData: EventFormData
) {
  try {
    // Process Stripe operations
    const stripeResult = await processStripeOperations(eventData, formData);
    
    if (!stripeResult.success) {
      throw new Error(stripeResult.error);
    }

    const { updatedFormData } = stripeResult;
    const finalData = { ...formData, ...updatedFormData };

    // Update database
    const supabase = await createClient();
    const startDate = new Date(finalData.start).toISOString();
    const finishDate = finalData.finish
      ? new Date(finalData.finish).toISOString()
      : null;

    const { error } = await supabase
      .from("Events")
      .update({
        title: finalData.title,
        description: finalData.description.length > 0 ? finalData.description : null,
        location: finalData.location,
        tags: finalData.tags,
        capacity: finalData.capacity,
        picture: finalData.picture,
        price: finalData.isFree ? 0 : finalData.isPayWhatYouCan ? null : finalData.price,
        start: startDate,
        finish: finishDate,
        stripe_product_id: finalData.stripe_product_id,
        stripe_price_id: finalData.stripe_price_id,
      })
      .eq("id", eventId);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

  } catch (error) {
    console.error("Event update error:", error);
    throw error;
  }
}
