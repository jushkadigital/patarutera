"use client";

import { HttpTypes } from "@medusajs/types";
import React, { createContext, useEffect, useRef, useState } from "react";
import { initiatePaymentSession, retrieveCart } from "@lib/data/cart";
import { createIzipayPayment } from "@lib/data/payment";
import { defaultPaymentConfig, getDataOrderDynamic } from "../izipay/config";
import { myConvertToLocale } from "@lib/util/money";

const FALLBACK_IZIPAY_MERCHANT_CODE =
  process.env.NEXT_PUBLIC_IZIPAY_MERCHANT_CODE || "4004353";

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

export const IzipayContext = createContext<{
  isLoaded: boolean;
  isInitialized: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  izipayConfig: any;
  sessionToken: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentSessionData: any;
  error: string | null;
  loading: boolean;
} | null>(null);

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

type IzipayWrapperProps = {
  cart: HttpTypes.StoreCart;
  paymentSession?: HttpTypes.StorePaymentSession | null;
  paymentProviderId?: string;
  children: React.ReactNode;
};

type IzipaySessionData = Record<string, unknown> & {
  publicKey?: string;
  public_key?: string;
  amount?: string | number;
  merchantCode?: string;
  merchant_code?: string;
  commerceCode?: string;
  commerce_code?: string;
  clientId?: string;
};

const getNormalizedString = (value: unknown) => {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
};

const resolveMerchantCode = (paymentSessionData?: Record<string, unknown>) => {
  if (!paymentSessionData) {
    return FALLBACK_IZIPAY_MERCHANT_CODE;
  }

  const sessionData = paymentSessionData as IzipaySessionData;

  return (
    getNormalizedString(sessionData.merchantCode) ||
    getNormalizedString(sessionData.merchant_code) ||
    getNormalizedString(sessionData.commerceCode) ||
    getNormalizedString(sessionData.commerce_code) ||
    getNormalizedString(sessionData.clientId) ||
    FALLBACK_IZIPAY_MERCHANT_CODE
  );
};

export const IzipayWrapper: React.FC<IzipayWrapperProps> = ({
  cart,
  paymentSession,
  paymentProviderId,
  children,
}) => {
  const { isLoaded, error: loadError } = useIzipaySDK();
  const [isInitialized, setIsInitialized] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [izipayConfig, setIzipayConfig] = useState<any>(null);

  const [paymentSessionData, setPaymentSessionData] = useState<
    Record<string, unknown> | undefined
  >(paymentSession?.data as Record<string, unknown> | undefined);
  const [isSessionCreated, setIsSessionCreated] =
    useState(!!paymentSessionData);

  const isInitializingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const providerId = paymentSession?.provider_id || paymentProviderId;

  // Create payment session and fetch updated cart
  useEffect(() => {
    console.log("createSession effect dependencies:", {
      cartId: cart?.id,
      isSessionCreated,
      providerId,
    });
    if (!cart?.id || isSessionCreated || !providerId) {
      return;
    }

    const createSession = async () => {
      console.log("Creating payment session for:", providerId);
      setLoading(true);

      try {
        const paymentCollection = await initiatePaymentSession(cart, {
          provider_id: providerId,
        });

        let session =
          paymentCollection?.payment_collection?.payment_sessions?.find(
            (s) => s.provider_id === providerId && s.status === "pending",
          );

        if (!session?.data) {
          const refreshedCart = await retrieveCart(
            cart.id,
            "id,*payment_collection,*payment_collection.payment_sessions",
          );

          session = refreshedCart?.payment_collection?.payment_sessions?.find(
            (s) => s.provider_id === providerId && s.status === "pending",
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
  }, [cart, providerId, isSessionCreated]);

  // Main initialization effect
  useEffect(() => {
    console.log("IzipayWrapper Effect running:", {
      isSessionCreated,
      isLoaded,
      paymentSessionData,
      isInitializingRef: isInitializingRef.current,
      hasInitializedRef: hasInitializedRef.current,
    });
    if (!isSessionCreated) {
      setIsInitialized(false);
      setSdkError(null);
      hasInitializedRef.current = false;
      setIzipayConfig(null);
      return;
    }

    if (!isLoaded) {
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
        console.log(
          "Starting iZipay initialization. PaymentSessionData:",
          paymentSessionData,
        );

        const {
          publicKey: rawPublicKey,
          public_key: rawPublicKeySnake,
          amount,
        } = paymentSessionData as IzipaySessionData;

        const publicKey = rawPublicKey || rawPublicKeySnake;
        const merchantCode = resolveMerchantCode(paymentSessionData);

        if (!publicKey || !amount) {
          throw new Error("Missing payment session data");
        }

        const { transactionId, orderNumber, currentTimeUnix } =
          getDataOrderDynamic();
        const { requestSource } = defaultPaymentConfig;

        const paymentData = {
          requestSource,
          orderNumber: orderNumber,
          merchantCode,
          publicKey,
          amount: myConvertToLocale({
            amount: Number(amount),
            currency_code: "PEN",
            locale: "es-PE",
          }),
        };

        console.log("Calling createIzipayPayment with:", {
          paymentData,
          transactionId,
          merchantCodeSource:
            merchantCode === FALLBACK_IZIPAY_MERCHANT_CODE
              ? "fallback-or-env"
              : "payment-session",
        });
        const data = await createIzipayPayment(paymentData, transactionId);
        console.log("createIzipayPayment response:", data);

        if (!data) {
          throw new Error("Failed to create payment token");
        }

        if (!data.response?.token) {
          throw new Error(data.message || "Invalid token response");
        }

        const token = data.response.token;
        setSessionToken(token);

        const iziConfig = {
          config: {
            transactionId: transactionId,
            action: "pay",
            merchantCode,
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
            urlIPN: "https://commerce.patarutera.pe/custom/izipay/callback",
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

        console.log("Setting Izipay config...");
        setIzipayConfig(iziConfig.config);

        setIsInitialized(true);
        hasInitializedRef.current = true;
        console.log("iZipay initialization completed successfully");
      } catch (error: unknown) {
        console.error("Failed to initialize iZipay (catch block):", error);
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
  }, [isLoaded, paymentSessionData, cart, isSessionCreated]);

  return (
    <IzipayContext.Provider
      value={{
        isLoaded,
        isInitialized,
        izipayConfig,
        sessionToken,
        paymentSessionData,
        error: loadError || sdkError,
        loading,
      }}
    >
      {children}
    </IzipayContext.Provider>
  );
};

export default IzipayWrapper;
