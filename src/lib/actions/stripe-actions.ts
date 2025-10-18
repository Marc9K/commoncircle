"use server";

import { EventFormData } from "@/components/EventForm/EventForm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? process.env.NEXT_PUBLIC_STRIPE_SANDBOX_KEY!);

// Create Stripe product
export async function createStripeProduct(title: string, description: string) {
  try {
    const product = await stripe.products.create({
      name: title,
      description: description.length > 0 ? description : title + " ticket",
    });
    return { success: true, productId: product.id };
  } catch (error) {
    console.error("Error creating Stripe product:", error);
    return { success: false, error: "Failed to create Stripe product" };
  }
}

// Create Stripe price
export async function createStripePrice(productId: string, price?: number) {
    if (price == 0) {
        return { success: true, priceId: null };
    }
  try {
    const priceData: {
      currency: string;
      product: string;
      custom_unit_amount?: { enabled: boolean };
      unit_amount?: number;
    } = {
      currency: "GBP",
      product: productId,
    };

    if (price === undefined || price === null) {
      priceData.custom_unit_amount = { enabled: true };
    } else if (price > 0) {
      priceData.unit_amount = price * 100;
    }

    const stripePrice = await stripe.prices.create(priceData);
    return { success: true, priceId: stripePrice.id };
  } catch (error) {
    console.error("Error creating Stripe price:", error);
    return { success: false, error: "Failed to create Stripe price" };
  }
}

// Refund Stripe payment
export async function refundStripePayment(paymentSessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(paymentSessionId);
    const refund = await stripe.refunds.create({
      charge: session.payment_intent as string,
    });
    return { success: true, refund: { status: refund.status, id: refund.id } };
  } catch (error) {
    console.error("Error refunding Stripe payment:", error);
    return { success: false, error: "Failed to refund payment" };
  }
}

// Create Stripe account
export async function createStripeAccount() {
  try {
    const account = await stripe.accounts.create({
      country: "GB",
      type: "standard",
      default_currency: "GBP",
    });
    return { success: true, account: { id: account.id, detailsSubmitted: account.details_submitted, chargesEnabled: account.charges_enabled } };
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    return { success: false, error: "Failed to create Stripe account" };
  }
}

// Create Stripe account link
export async function createStripeAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      return_url: returnUrl,
      refresh_url: refreshUrl,
      type: "account_onboarding",
    });
    return { success: true, accountLink: { url: accountLink.url } };
  } catch (error) {
    console.error("Error creating Stripe account link:", error);
    return { success: false, error: "Failed to create account link" };
  }
}

// Verify Stripe account
export async function verifyStripeAccount(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    return { success: true, detailsSubmitted: account.details_submitted, chargesEnabled: account.charges_enabled };
  } catch (error) {
    console.error("Error verifying Stripe account:", error);
    return { success: false, error: "Failed to verify Stripe account" };
  }
}

// Delete Stripe account
export async function deleteStripeAccount(accountId: string) {
  try {
    const deleted = await stripe.accounts.del(accountId);
    return { success: true, deleted: { deleted: deleted.deleted } };
  } catch (error) {
    console.error("Error deleting Stripe account:", error);
    return { success: false, error: "Failed to delete Stripe account" };
  }
}

// Create Stripe checkout session
export async function createStripeCheckoutSession(
  priceId: string,
  clientReferenceId: string,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string,
  eventId: string,
  memberId: string,
  stripeAccountId: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      client_reference_id: clientReferenceId,
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: [
        "card",
        "link",
        "pay_by_bank",
        "revolut_pay",
        "bacs_debit",
      ],
      metadata: {
        event_id: eventId,
        member_id: memberId,
      },
      payment_intent_data: {
        on_behalf_of: stripeAccountId,
      },
    });
    return { success: true, session: { id: session.id, url: session.url } };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return { success: false, error: "Failed to create checkout session" };
  }
}

export async function processStripeOperations(
  eventData: Partial<EventFormData>,
  formData: EventFormData
) {
  try {
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

      if (formData.price === undefined || formData.price === null) {
        priceData.custom_unit_amount = {
          enabled: true,
        };
      } else if (formData.price > 0) {
        priceData.unit_amount = formData.price * 100;
      }

      const price = await stripe.prices.create(priceData);
      return price.id;
    };

    const updatedFormData = { ...formData };

    if (
      eventData.title !== formData.title ||
      eventData.description !== formData.description
    ) {
      const createProduct = async () => {
        const product = await stripe.products.create({
          name: formData.title,
          description:
            formData.description.length && formData.description.length > 0
              ? formData.description
              : formData.title + " ticket",
        });
        return product.id;
      };
      const productId = await createProduct();
      updatedFormData.stripe_product_id = productId;
      updatedFormData.stripe_price_id = await createPrice(productId);
    } else if (
      eventData.price !== formData.price &&
      eventData.stripe_product_id
    ) {
      updatedFormData.stripe_price_id = await createPrice(
        eventData.stripe_product_id
      );
    }

    return { success: true, updatedFormData };
  } catch (error) {
    console.error("Stripe operations error:", error);
    return { success: false, error: "Failed to process Stripe operations" };
  }
}
