"use client";

import { RadioGroup } from "@headlessui/react";
import { isIzipay, paymentInfoMap } from "@lib/constants";
import { initiatePaymentSession } from "@lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { Heading } from "@medusajs/ui";
import ErrorMessage from "@modules/checkout/components/error-message";
import PaymentButton from "@modules/checkout/components/payment-button";
import PaymentContainer from "@modules/checkout/components/payment-container";
import Divider from "@modules/common/components/divider";
import { Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Payment = ({
  cart,
  availablePaymentMethods,
  hasPreData,
}: {
  cart: HttpTypes.StoreCart | null;
  availablePaymentMethods: HttpTypes.StorePaymentProvider[];
  hasPreData: boolean;
}) => {
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: HttpTypes.StorePaymentSession) =>
      paymentSession.status === "pending",
  );

  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const currentStep = searchParams.get("step");
  const isPaymentStep =
    currentStep === "payment" || (!currentStep && !hasPreData);
  const router = useRouter();

  const selectedProviderFromQuery = searchParams.get("payment_provider") || "";

  const [error, setError] = useState<string | null>(null);
  const [isSyncingSession, setIsSyncingSession] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id || selectedProviderFromQuery || "",
  );

  const syncedProviderRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isPaymentStep) {
      return;
    }

    if (selectedPaymentMethod || !availablePaymentMethods?.length) {
      return;
    }

    const defaultProviderId =
      availablePaymentMethods.find((method) => isIzipay(method.id))?.id ||
      availablePaymentMethods[0]?.id ||
      "";

    if (!defaultProviderId) {
      return;
    }

    console.log("[Checkout][Payment] autoSelectDefaultProvider", {
      cartId: cart?.id,
      defaultProviderId,
    });

    setSelectedPaymentMethod(defaultProviderId);
  }, [availablePaymentMethods, cart?.id, isPaymentStep, selectedPaymentMethod]);

  useEffect(() => {
    if (!isPaymentStep) {
      return;
    }

    if (!cart || !selectedPaymentMethod) {
      return;
    }

    if (syncedProviderRef.current === selectedPaymentMethod) {
      return;
    }

    const syncPaymentSession = async () => {
      setIsSyncingSession(true);
      setError(null);

      try {
        console.log("[Checkout][Payment] syncPaymentSession:start", {
          cartId: cart.id,
          selectedPaymentMethod,
          activeSessionProviderId: activeSession?.provider_id,
          activeSessionStatus: activeSession?.status,
        });

        let initiatedSession = false;

        if (activeSession?.provider_id !== selectedPaymentMethod) {
          const initiateResponse = await initiatePaymentSession(cart, {
            provider_id: selectedPaymentMethod,
          });

          const pendingSession =
            initiateResponse?.payment_collection?.payment_sessions?.find(
              (session) =>
                session.provider_id === selectedPaymentMethod &&
                session.status === "pending",
            );

          console.log("[Checkout][Payment] initiatePaymentSession response", {
            selectedPaymentMethod,
            paymentSessions:
              initiateResponse?.payment_collection?.payment_sessions?.map(
                (session) => ({
                  providerId: session.provider_id,
                  status: session.status,
                }),
              ) || [],
            hasPendingSelectedSession: Boolean(pendingSession),
          });

          initiatedSession = true;
        }

        const params = new URLSearchParams(searchParamsString);
        params.set("step", "payment");
        params.set("payment_provider", selectedPaymentMethod);

        const nextSearchParams = params.toString();

        if (nextSearchParams !== searchParamsString) {
          router.push(`?${nextSearchParams}`, { scroll: false });
        }

        if (initiatedSession) {
          router.refresh();
        }

        syncedProviderRef.current = selectedPaymentMethod;
      } catch (err: unknown) {
        syncedProviderRef.current = null;
        console.error("[Checkout][Payment] syncPaymentSession:error", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsSyncingSession(false);
      }
    };

    void syncPaymentSession();
  }, [
    activeSession?.provider_id,
    activeSession?.status,
    cart,
    router,
    searchParamsString,
    selectedPaymentMethod,
    isPaymentStep,
  ]);

  const handlePaymentMethodChange = (method: string) => {
    console.log("[Checkout][Payment] setPaymentMethod", {
      cartId: cart?.id,
      method,
    });

    syncedProviderRef.current = null;
    setError(null);
    setSelectedPaymentMethod(method);
  };

  const shouldRenderPaymentButton = Boolean(cart && selectedPaymentMethod);

  if (!isPaymentStep && hasPreData) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="mb-6 flex flex-row items-center justify-between">
        <div className="flex flex-col  gap-y-3 w-2/3">
          <Heading

            className="flex flex-row text-3xl "
          >
            3.Pago de Tours
          </Heading>

          <span>Seleccion una forma de pago para continuar</span>

        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2970b7]">
          <Lock aria-hidden="true" className="h-4 w-4 text-[#2970b7]" />
          pago 100% seguro
        </span>
      </div>

      {availablePaymentMethods?.length ? (
        <RadioGroup
          value={selectedPaymentMethod}
          onChange={(value: string) => handlePaymentMethodChange(value)}
        >
          {availablePaymentMethods.map((paymentMethod) => (
            <div key={paymentMethod.id}>
              <PaymentContainer
                paymentInfoMap={paymentInfoMap}
                paymentProviderId={paymentMethod.id}
                selectedPaymentOptionId={selectedPaymentMethod}
              />
            </div>
          ))}
        </RadioGroup>
      ) : null}

      <ErrorMessage error={error} data-testid="payment-method-error-message" />

      {isSyncingSession ? (
        <div className="mt-4 text-ui-fg-subtle text-small-regular">
          Preparing payment session...
        </div>
      ) : null}

      {cart && shouldRenderPaymentButton ? (
        <div className="mt-6">
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </div>
      ) : null}

      <Divider className="mt-8" />
    </div>
  );
};

export default Payment;
