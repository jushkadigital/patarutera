"use client";

import { Text } from "@medusajs/ui";
import React, { useEffect, useRef, useState } from "react";
import Spinner from "@modules/common/icons/spinner";
import {
  defaultPaymentConfig,
  getDataOrderDynamic,
  setupEventHandlers,
} from "../izipay/config";
import { myConvertToLocale } from "@lib/util/money";

type IzipayContainerProps = {
  paymentProviderId: string;
  selectedPaymentOptionId: string | null;
  paymentSessionData?: Record<string, unknown>;
  handleSubmitAction: () => Promise<void>;
  cart?: {
    billing_address?: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      address_1?: string;
      city?: string;
      province?: string;
      country_code?: string;
      postal_code?: string;
      company?: string;
    };
    shipping_address?: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      address_1?: string;
      city?: string;
      province?: string;
      country_code?: string;
      postal_code?: string;
    };
    email?: string;
  };
};

const IZIPAY_SDK_URL =
  "https://sandbox-checkout.izipay.pe/payments/v1/js/index.js";

declare global {
  interface Window {
    Izipay?: {
      new(config: { config: Record<string, unknown> }): {
        LoadForm: (options: {
          authorization: string;
          keyRSA: string;
          callbackResponse: (response: {
            status: string;
            message?: string;
          }) => void;
        }) => void;
      };
    };
  }
}

const useIzipaySDK = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (isLoadingRef.current || typeof window === "undefined") {
      return;
    }

    if (window.Izipay) {
      setIsLoaded(true);
      return;
    }

    isLoadingRef.current = true;
    setError(null);

    const script = document.createElement("script");
    script.src = IZIPAY_SDK_URL;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      isLoadingRef.current = false;
    };

    script.onerror = () => {
      setError("Failed to load iZipay SDK. Please try again.");
      isLoadingRef.current = false;
    };

    document.head.appendChild(script);
  }, []);

  return { isLoaded, error };
};

export const IzipayContainer: React.FC<IzipayContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentSessionData,
  handleSubmitAction,
  cart,
}) => {
  const isSelected = selectedPaymentOptionId === paymentProviderId;
  const [isInitialized, setIsInitialized] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { isLoaded, error: loadError } = useIzipaySDK();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const isMountedRef = useRef(false);

  // Track when container is mounted in DOM
  useEffect(() => {
    if (isSelected) {
      isMountedRef.current = true;
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [isSelected]);

  // Single unified effect for initialization
  useEffect(() => {
    console.log("=== iZipay useEffect triggered ===");
    console.log("isSelected:", isSelected);
    console.log("isLoaded:", isLoaded);
    console.log("paymentSessionData:", paymentSessionData);
    console.log("isMountedRef.current:", isMountedRef.current);
    console.log("isInitializingRef.current:", isInitializingRef.current);
    console.log("hasInitializedRef.current:", hasInitializedRef.current);

    // Reset when not selected
    if (!isSelected) {
      console.log("Not selected, resetting...");
      setIsInitialized(false);
      setSdkError(null);
      hasInitializedRef.current = false;
      setLoading(false);
      return;
    }

    // Check if SDK is loaded
    if (!isLoaded) {
      console.log("SDK not loaded yet, waiting...");
      return;
    }

    // Wait for container to be mounted in DOM
    if (!isMountedRef.current) {
      console.log("Waiting for container to mount...");
      return;
    }

    // Prevent multiple initializations
    if (isInitializingRef.current || hasInitializedRef.current) {
      console.log("Already initializing or initialized, skipping...");
      return;
    }

    // Check if payment session data is available
    if (!paymentSessionData) {
      console.warn("Payment session data not available yet, waiting...");
      // Don't set error, just wait for paymentSessionData to be available
      setLoading(false);
      return;
    }

    const initializePayment = async () => {
      console.log("🚀 initializePayment START");
      isInitializingRef.current = true;
      setLoading(true);
      setSdkError(null);

      try {
        console.log("Starting iZipay initialization...");
        console.log("paymentSessionData:", paymentSessionData);
        console.log("cart:", cart);

        if (!paymentSessionData) {
          console.error("❌ paymentSessionData is null/undefined");
          throw new Error(
            "Payment session data is not available. Please try selecting the payment method again.",
          );
        }

        const { publicKey, amount } = paymentSessionData;
        console.log(
          "Extracted from paymentSessionData - publicKey:",
          publicKey,
          "amount:",
          amount,
        );

        if (!publicKey || !amount) {
          console.error("❌ Missing publicKey or amount:", {
            publicKey,
            amount,
          });
          throw new Error(
            "Missing required payment data (publicKey or amount). Please try again.",
          );
        }

        console.log("✅ Payment session data validated");
        console.log("Loading payment token...");
        const { transactionId, orderNumber, currentTimeUnix } =
          getDataOrderDynamic();
        console.log("Generated dynamic data:", {
          transactionId,
          orderNumber,
          currentTimeUnix,
        });

        const { requestSource } = defaultPaymentConfig;

        const paymentData = {
          requestSource,
          orderNumber: orderNumber,
          merchantCode: "4004353",
          publicKey,
          amount: myConvertToLocale({
            amount: Number(amount),
            currency_code: "PEN",
            locale: "es-PE",
          }),
        };
        console.log("📤 About to send payment data:", paymentData);
        console.log(
          "🔗 Backend URL:",
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
        );
        console.log(
          "🔑 Publishable key:",
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
        );

        const fullUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/izipay/create-payment`;
        console.log("🌐 Full request URL:", fullUrl);

        console.log("⏳ Calling fetch...");
        const response = await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            transactionId: transactionId,
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify(paymentData),
        });
        console.log("✅ Fetch completed, response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to create payment token",
          );
        }

        const data = await response.json();

        if (!data.response?.token) {
          throw new Error("Invalid token response");
        }

        const sessionToken = data.response.token;
        console.log("Payment token loaded successfully");

        // Wait for DOM to be ready with more time
        await new Promise((resolve) => setTimeout(resolve, 300));

        console.log("Checking if container is in DOM...");
        // Use ref instead of getElementById
        if (!containerRef.current) {
          console.error("Container ref is null");
          throw new Error("Payment container ref is null");
        }

        // Verify element is actually in DOM
        if (!document.body.contains(containerRef.current)) {
          console.error("Container is not in DOM");
          throw new Error("Payment container is not in DOM");
        }

        console.log("Container is in DOM, creating iZipay config...");
        const iziConfig = {
          config: {
            transactionId: transactionId,
            action: "pay",
            merchantCode: "4004353",
            facilitatorCode: "",
            order: {
              orderNumber: orderNumber,
              showAmount: true,
              currency: "PEN",
              amount: myConvertToLocale({
                amount: Number(amount),
                currency_code: "PEN",
                locale: "es-PE",
              }),
              installments: "",
              deferred: "",
              payMethod: "all",
              channel: "web",
              processType: "AT",
              merchantBuyerId: "mc1993",
              dateTimeTransaction: currentTimeUnix,
            },
            card: {
              brand: "",
              pan: "",
              expirationMonth: "",
              expirationYear: "",
              cvc: "",
            },
            token: {
              cardToken: "",
            },
            billing: {
              firstName: "Lucho",
              lastName: "Torres",
              email: "luchotorres@izipay.pe",
              street: "Av. Jorge Chávez 275",
              city: "Lima",
              state: "Lima",
              country: "PE",
              postalCode: "15000",
              phoneNumber: "989897960",
              documentType: "DNI",
              document: "12345678",
              companyName: "",
            },
            shipping: {
              firstName: cart?.shipping_address?.first_name || "",
              lastName: cart?.shipping_address?.last_name || "",
              email: cart?.email || "",
              phoneNumber: cart?.shipping_address?.phone || "",
              street: cart?.shipping_address?.address_1 || "",
              city: cart?.shipping_address?.city || "",
              state: cart?.shipping_address?.province || "",
              country: cart?.shipping_address?.country_code || "",
              postalCode: cart?.shipping_address?.postal_code || "",
              document: "",
              documentType: "",
            },
            language: {
              init: "ESP",
              showControlMultiLang: false,
            },
            render: {
              typeForm: "embedded",
              container: "#izipay-checkout-container",
              showButtonProcessForm: true,
            },
            urlIPN:
              "https://testapi-pw.izipay.pe/ipnclient/NotificationPublic/requests",
            appearance: {
              styleInput: "normal",
              logo: "",
              theme: "green",
              customize: {
                visibility: {
                  hideOrderNumber: false,
                  hideResultScreen: false,
                  hideLogo: true,
                  hideMessageActivateOnlinePurchases: false,
                  hideTestCards: false,
                  hideShakeValidation: false,
                  hideGlobalErrors: false,
                },
                elements: [
                  {
                    paymentMethod: "CARD",
                    order: 1,
                    fields: [
                      {
                        name: "cardNumber",
                        order: 1,
                        visible: true,
                        groupName: "",
                      },
                    ],
                    changeButtonText: {
                      actionPay: "Pagar",
                    },
                  },
                ],
              },
            },
            customFields: [],
          },
        };

        const Izipay = window.Izipay;

        if (!Izipay) {
          throw new Error("Izipay SDK not loaded");
        }

        console.log("Creating Izipay instance...");
        const checkout = new Izipay({ config: iziConfig.config });
        containerRef.current = checkout as unknown as HTMLDivElement;

        console.log("Loading payment form...");
        checkout.LoadForm({
          authorization: sessionToken,
          keyRSA: "RSA",
          callbackResponse: (response: {
            status: string;
            message?: string;
          }) => {
            console.log("Payment callback:", response);
            if (response.status === "SUCCESS") {
            } else {
              setSdkError(response.message || "Payment failed");
            }
          },
        });

        setupEventHandlers(checkout, { handle: handleSubmitAction });

        setIsInitialized(true);
        hasInitializedRef.current = true;
        console.log("iZipay initialization completed successfully");
      } catch (error: unknown) {
        console.error("Failed to initialize iZipay:", error);
        setSdkError(
          error instanceof Error
            ? error.message
            : "Failed to initialize payment. Please try again.",
        );
        setIsInitialized(false);
      } finally {
        setLoading(false);
        isInitializingRef.current = false;
      }
    };

    initializePayment();
  }, [isSelected, isLoaded, paymentSessionData, cart, handleSubmitAction]);

  return (
    <>
      {isSelected && !isInitialized && (
        <div className="w-full mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner className="animate-spin mb-4" />
              <Text className="text-ui-fg-subtle text-sm">
                Loading payment form...
              </Text>
            </div>
          ) : sdkError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Text className="text-ui-fg-error text-sm mb-2">{sdkError}</Text>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover text-sm"
              >
                Retry
              </button>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Text className="text-ui-fg-error text-sm mb-2">{loadError}</Text>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover text-sm"
              >
                Retry
              </button>
            </div>
          ) : !paymentSessionData ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner className="animate-spin mb-4" />
              <Text className="text-ui-fg-subtle text-sm">
                Initializing payment session...
              </Text>
            </div>
          ) : null}
        </div>
      )}
      {/* Always render container when selected */}
      {isSelected && (
        <div
          id="izipay-checkout-container"
          ref={containerRef}
          className="min-h-[300px] w-full mt-4"
        />
      )}
    </>
  );
};
