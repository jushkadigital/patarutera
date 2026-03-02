"use client"

import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
import IzipayWrapper from "./izipay-wrapper"
import { HttpTypes } from "@medusajs/types"
import { isStripeLike, isIzipay } from "@lib/constants"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey =
  process.env.NEXT_PUBLIC_STRIPE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY

const medusaAccountId = process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID
const stripePromise = stripeKey
  ? loadStripe(
      stripeKey,
      medusaAccountId ? { stripeAccount: medusaAccountId } : undefined
    )
  : null

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  ) || cart.payment_collection?.payment_sessions?.[0]

  if (
    isStripeLike(paymentSession?.provider_id) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    )
  }

  if (isIzipay(paymentSession?.provider_id) && paymentSession) {
    return (
      <IzipayWrapper cart={cart} paymentSession={paymentSession}>
        {children}
      </IzipayWrapper>
    )
  }

  return <div>{children}</div>
}

export default PaymentWrapper
