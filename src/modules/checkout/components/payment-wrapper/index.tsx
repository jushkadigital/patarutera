"use client";

import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import StripeWrapper from "./stripe-wrapper";
import IzipayWrapper from "./izipay-wrapper";
import { HttpTypes } from "@medusajs/types";
import { isStripeLike, isIzipay } from "@lib/constants";
import { useSearchParams } from "next/navigation";

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart;
  children: React.ReactNode;
};

const stripeKey =
  process.env.NEXT_PUBLIC_STRIPE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY;

const medusaAccountId = process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID;
const stripePromise = stripeKey
  ? loadStripe(
      stripeKey,
      medusaAccountId ? { stripeAccount: medusaAccountId } : undefined,
    )
  : null;

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const searchParams = useSearchParams();
  const paymentProviderFromQuery =
    searchParams.get("payment_provider") || undefined;

  const paymentSessions = cart.payment_collection?.payment_sessions ?? [];

  const paymentSession =
    paymentSessions.find((s) => s.status === "pending") || paymentSessions[0];

  const resolvedProviderId =
    paymentSession?.provider_id || paymentProviderFromQuery;

  console.log("[Checkout][PaymentWrapper] session resolution", {
    cartId: cart.id,
    sessions: paymentSessions.map((session) => ({
      providerId: session.provider_id,
      status: session.status,
    })),
    paymentProviderFromQuery,
    selectedProviderId: paymentSession?.provider_id,
    selectedStatus: paymentSession?.status,
    resolvedProviderId,
    isStripe: isStripeLike(resolvedProviderId),
    isIzipay: isIzipay(resolvedProviderId),
  });

  if (isStripeLike(resolvedProviderId) && paymentSession && stripePromise) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    );
  }

  if (isIzipay(resolvedProviderId) && resolvedProviderId) {
    return (
      <IzipayWrapper
        cart={cart}
        paymentSession={paymentSession}
        paymentProviderId={resolvedProviderId}
      >
        {children}
      </IzipayWrapper>
    );
  }

  return <div>{children}</div>;
};

export default PaymentWrapper;
