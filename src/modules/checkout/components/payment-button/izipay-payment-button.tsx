"use client";

import { HttpTypes } from "@medusajs/types";
import { placeOrder } from "@lib/data/cart";
import ErrorMessage from "@modules/checkout/components/error-message";
import Spinner from "@modules/common/icons/spinner";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IzipayContext } from "../payment-wrapper/izipay-wrapper";

type IzipayPaymentButtonProps = {
  cart?: HttpTypes.StoreCart;
  "data-testid"?: string;
};

type IzipayCallbackResponse = {
  status?: string;
  code?: string;
  message?: string;
  messageUser?: string;
  response?: {
    order?: Array<{
      stateMessage?: string;
    }>;
  };
};

const IzipayPaymentButton: React.FC<IzipayPaymentButtonProps> = ({
  "data-testid": dataTestId,
}) => {
  const context = useContext(IzipayContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isFormLoadedRef = useRef(false);
  const isPlacingOrderRef = useRef(false);

  if (!context) {
    throw new Error("IzipayPaymentButton must be used within an IzipayWrapper");
  }

  const {
    isInitialized,
    loading,
    izipayConfig,
    sessionToken,
    error: contextError,
  } = context;
  const isPendingRender = loading || !isInitialized;
  const embedHeightClass = "min-h-[78dvh] sm:min-h-[620px]";

  useEffect(() => {
    if (
      !isInitialized ||
      !izipayConfig ||
      !sessionToken ||
      !window.Izipay ||
      isFormLoadedRef.current
    ) {
      return;
    }

    try {
      console.log("Loading Izipay form...");
      isFormLoadedRef.current = true;

      const Izipay = window.Izipay;
      if (!Izipay) {
        throw new Error("Izipay SDK not available");
      }

      const checkout = new Izipay({ config: izipayConfig });

      checkout.LoadForm({
        authorization: sessionToken,
        keyRSA: "RSA",
        callbackResponse: async (response: IzipayCallbackResponse) => {
          console.log("Payment callback:", response);

          const stateMessage = response.response?.order?.[0]?.stateMessage;
          const isSuccess =
            response.status === "SUCCESS" ||
            response.code === "00" ||
            stateMessage === "Autorizado";

          if (isSuccess) {
            if (isPlacingOrderRef.current) {
              return;
            }

            isPlacingOrderRef.current = true;

            try {
              await placeOrder();
              setErrorMessage(null);
            } catch (err: unknown) {
              console.error("Place order error:", err);
              setErrorMessage(
                err instanceof Error ? err.message : "Failed to place order",
              );
            } finally {
              isPlacingOrderRef.current = false;
            }
          } else {
            console.error("Payment failed:", response);
            setErrorMessage(
              response.messageUser || response.message || "Payment failed",
            );
          }
        },
      });
    } catch (err: unknown) {
      console.error("Error loading Izipay form:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load payment form",
      );
      isFormLoadedRef.current = false;
    }
  }, [isInitialized, izipayConfig, sessionToken]);

  return (
    <div className="flex flex-col gap-4">
      <ErrorMessage
        error={contextError || errorMessage}
        data-testid="izipay-payment-error-message"
      />

      <div className={`relative w-full ${embedHeightClass}`}>
        {isPendingRender && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center bg-white/80 ${embedHeightClass}`}
          >
            <Spinner />
          </div>
        )}

        <div
          id="izipay-checkout-container"
          className={`w-full ${embedHeightClass}`}
          data-testid={dataTestId}
          style={{
            visibility: isPendingRender ? "hidden" : "visible",
            pointerEvents: isPendingRender ? "none" : "auto",
          }}
        />
      </div>
    </div>
  );
};

export default IzipayPaymentButton;
