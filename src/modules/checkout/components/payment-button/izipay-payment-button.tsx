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

const IzipayPaymentButton: React.FC<IzipayPaymentButtonProps> = ({

  "data-testid": dataTestId,
}) => {
  const context = useContext(IzipayContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isFormLoadedRef = useRef(false);

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
      // Prevent double initialization
      isFormLoadedRef.current = true;

      setTimeout(() => {
        try {
          const Izipay = window.Izipay;
          if (!Izipay) return;
          const checkout = new Izipay({ config: izipayConfig });

          checkout.LoadForm({
            authorization: sessionToken,
            keyRSA: "RSA",
            callbackResponse: async (response: {
              status: string;
              message?: string;
            }) => {
              console.log("Payment callback:", response);
              if (response.status === "SUCCESS") {
                try {
                  await placeOrder();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (err: any) {
                  console.error("Place order error:", err);
                  setErrorMessage(err.message || "Failed to place order");
                }
              } else {
                console.error("Payment failed:", response);
                setErrorMessage(response.message || "Payment failed");
              }
            },
          });
        } catch (err: unknown) {
          console.error("Error loading Izipay form:", err);
          setErrorMessage(
            err instanceof Error ? err.message : "Failed to load payment form"
          );
          isFormLoadedRef.current = false;
        }
      }, 100);
    } catch (err: unknown) {
      console.error("Error setting up Izipay form timeout:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to setup payment form"
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

      {(loading || !isInitialized) && (
        <div className="flex items-center justify-center py-4 min-h-[300px]">
          <Spinner />
        </div>
      )}

      <div
        id="izipay-checkout-container"
        className="min-h-[300px] w-full"
        data-testid={dataTestId}
        style={{
          display: loading || !isInitialized ? "none" : "block",
        }}
      />
    </div>
  );
};

export default IzipayPaymentButton;


