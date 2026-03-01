"use client";

import { HttpTypes } from "@medusajs/types";
import React, { useEffect, useRef, useState } from "react";
import { Text } from "@medusajs/ui";
import Spinner from "@modules/common/icons/spinner";
import {
  defaultPaymentConfig,
  getDataOrderDynamic,
  setupEventHandlers,
} from "../izipay/config";
import { myConvertToLocale } from "@lib/util/money";
import { initiatePaymentSession, retrieveCart } from "@lib/data/cart";
import { createIzipayPayment } from "@lib/data/payment";

type IzipayContainerProps = {
  paymentProviderId: string;
  selectedPaymentOptionId: string | null;
  handleSubmitAction: () => Promise<void>;
  cart?: HttpTypes.StoreCart | null;
};

const IZIPAY_SDK_URL =
  "https://sandbox-checkout.izipay.pe/payments/v1/js/index.js";

declare global {
  interface Window {
    Izipay?: {
      new (config: { config: Record<string, unknown> }): {
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
  handleSubmitAction,
  cart,
}) => {
  const isSelected = selectedPaymentOptionId === paymentProviderId;
  const { isLoaded, error: loadError } = useIzipaySDK();
  const [isInitialized, setIsInitialized] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSessionData, setPaymentSessionData] = useState<
    Record<string, unknown> | undefined
  >(undefined);
  const [isSessionCreated, setIsSessionCreated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<any>(null);
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

  // Create payment session and fetch updated cart
  useEffect(() => {
    if (!isSelected || !cart?.id || isSessionCreated) {
      return;
    }

    const createSession = async () => {
      console.log("Creating payment session for:", paymentProviderId);
      setLoading(true);

      try {
        const paymentCollection = await initiatePaymentSession(cart, {
          provider_id: paymentProviderId,
        });

        let session =
          paymentCollection?.payment_collection?.payment_sessions?.find(
            (s) =>
              s.provider_id === paymentProviderId && s.status === "pending",
          );

        if (!session?.data) {
          const refreshedCart = await retrieveCart(
            cart.id,
            "id,*payment_collection,*payment_collection.payment_sessions",
          );

          session = refreshedCart?.payment_collection?.payment_sessions?.find(
            (s) =>
              s.provider_id === paymentProviderId && s.status === "pending",
          );
        }

        if (session?.data) {
          setPaymentSessionData(session.data as Record<string, unknown>);
          setIsSessionCreated(true);
        }
      } catch (error) {
        console.error("Failed to create payment session:", error);
      } finally {
        setLoading(false);
      }
    };

    createSession();
  }, [isSelected, cart, paymentProviderId, isSessionCreated]);

  useEffect(() => {
    console.log("=== iZipay Container Props ===");
    console.log("isSelected:", isSelected);
    console.log("isLoaded:", isLoaded);
    console.log("isSessionCreated:", isSessionCreated);
    console.log("paymentSessionData:", paymentSessionData);
    console.log("paymentSessionData type:", typeof paymentSessionData);
    console.log(
      "paymentSessionData keys:",
      paymentSessionData ? Object.keys(paymentSessionData) : "null",
    );
    console.log("cart:", cart);
    console.log("cart.id:", cart?.id);
    console.log("paymentProviderId:", paymentProviderId);
    console.log("selectedPaymentOptionId:", selectedPaymentOptionId);
  }, [
    isSelected,
    isLoaded,
    isSessionCreated,
    paymentSessionData,
    cart,
    paymentProviderId,
    selectedPaymentOptionId,
  ]);

  // Main initialization effect
  useEffect(() => {
    if (!isSelected || !isSessionCreated) {
      setIsInitialized(false);
      setSdkError(null);
      hasInitializedRef.current = false;
      if (checkoutRef.current) {
        checkoutRef.current = null;
      }
      return;
    }

    if (!isLoaded) {
      return;
    }

    if (!isMountedRef.current) {
      return;
    }

    if (isInitializingRef.current || hasInitializedRef.current) {
      return;
    }

    if (!paymentSessionData) {
      return;
    }

    const initializePayment = async () => {
      isInitializingRef.current = true;
      setLoading(true);
      setSdkError(null);

      try {
        console.log("Starting iZipay initialization...");

        if (!paymentSessionData) {
          console.error("paymentSessionData is null/undefined");
          throw new Error("Missing payment session data");
        }

        const { publicKey, amount } = paymentSessionData as {
          publicKey?: string;
          amount?: string | number;
        };

        if (!publicKey || !amount) {
          throw new Error("Missing payment session data");
        }

        const { transactionId, orderNumber, currentTimeUnix } =
          getDataOrderDynamic();
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

        const data = await createIzipayPayment(paymentData, transactionId);

        if (!data) {
          throw new Error("Failed to create payment token");
        }

        if (!data.response?.token) {
          throw new Error(data.message || "Invalid token response");
        }

        const sessionToken = data.response.token;

        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!containerRef.current) {
          throw new Error("Payment container ref is null");
        }

        if (!document.body.contains(containerRef.current)) {
          throw new Error("Payment container is not in DOM");
        }

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
        checkoutRef.current = checkout;

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
  }, [
    isSelected,
    isLoaded,
    isSessionCreated,
    paymentSessionData,
    cart,
    handleSubmitAction,
    paymentProviderId,
  ]);

  return (
    <>
      {isSelected && !isInitialized && (
        <div className="w-full mt-4">
          {!isSessionCreated && loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner className="animate-spin mb-4" />
              <Text className="text-ui-fg-subtle text-sm">
                Initializing payment session...
              </Text>
            </div>
          ) : isSessionCreated && loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner className="animate-spin mb-4" />
              <Text className="text-ui-fg-subtle text-sm">
                Loading payment form...
              </Text>
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
          ) : !paymentSessionData && isSessionCreated ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner className="animate-spin mb-4" />
              <Text className="text-ui-fg-subtle text-sm">
                Initializing payment session...
              </Text>
            </div>
          ) : null}
        </div>
      )}
      {isSelected && isSessionCreated && (
        <div
          id="izipay-checkout-container"
          ref={containerRef}
          className="min-h-[300px] w-full mt-4"
        />
      )}
    </>
  );
};
