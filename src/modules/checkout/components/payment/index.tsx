"use client";

import { RadioGroup, Radio as RadioGroupOption } from "@headlessui/react";
import { isIzipay, isStripeLike, paymentInfoMap } from "@lib/constants";
import { initiatePaymentSession } from "@lib/data/cart";
import { CheckCircleSolid, CreditCard } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Button, Container, Heading, Text, clx } from "@medusajs/ui";
import ErrorMessage from "@modules/checkout/components/error-message";
import PaymentContainer from "@modules/checkout/components/payment-container";
import Divider from "@modules/common/components/divider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IzipayContainer } from "../payment-container/izipay-container";
import Radio from "@modules/common/components/radio";
import Spinner from "@modules/common/icons/spinner";

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart | null;
  availablePaymentMethods: HttpTypes.StorePaymentProvider[];
}) => {
  console.log("Payment component mounted");
  console.log("availablePaymentMethods:", availablePaymentMethods);

  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: HttpTypes.StorePaymentSession) =>
      paymentSession.status === "pending",
  );

  console.log("Payment component - activeSession:", activeSession);
  console.log(
    "Payment component - activeSession?.provider_id:",
    activeSession?.provider_id,
  );
  console.log("Payment component - activeSession?.data:", activeSession?.data);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? "",
  );
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    console.log("Payment component - activeSession updated:", activeSession);
    console.log("Payment component - forceUpdate:", forceUpdate);
  }, [activeSession, forceUpdate]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "payment";

  const setPaymentMethod = async (method: string) => {
    console.log("🎯 setPaymentMethod called with:", method);
    console.log("isIzipay(method):", isIzipay(method));
    console.log("cart:", cart);
    console.log("cart?.id:", cart?.id);
    console.log("cart?.payment_collection:", cart?.payment_collection);
    console.log(
      "cart?.payment_collection?.payment_sessions:",
      cart?.payment_collection?.payment_sessions,
    );

    setError(null);
    setSelectedPaymentMethod(method);

    if (isIzipay(method) && cart) {
      console.log("✅ iZipay selected, initializing payment session...");
      setIsInitializingPayment(true);

      let retries = 0;
      const maxRetries = 3;

      const tryInitiate = async () => {
        try {
          console.log(
            `📤 Attempt ${retries + 1}/${maxRetries} to initiate payment session...`,
          );
          console.log(
            "📤 Calling initiatePaymentSession with provider_id:",
            method,
          );

          const result = await initiatePaymentSession(cart, {
            provider_id: method,
          });

          console.log("✅ initiatePaymentSession completed successfully!");
          console.log("Result:", result);
          console.log("Result type:", typeof result);
          console.log("Result keys:", Object.keys(result || {}));
          console.log("Result.payment_collection:", result?.payment_collection);
          console.log(
            "Result.payment_collection?.payment_sessions:",
            result?.payment_collection?.payment_sessions,
          );
          console.log(
            "Result.payment_collection?.payment_sessions length:",
            result?.payment_collection?.payment_sessions?.length,
          );

          // Check if payment sessions exist
          const paymentSessions =
            result?.payment_collection?.payment_sessions || [];
          console.log("Payment sessions found:", paymentSessions);
          console.log(
            "Payment sessions details:",
            paymentSessions.map((ps: any) => ({
              id: ps.id,
              provider_id: ps.provider_id,
              status: ps.status,
              data: ps.data,
            })),
          );

          // Wait a bit for cart to update
          console.log("⏳ Waiting 500ms for cart to update...");
          await new Promise((resolve) => setTimeout(resolve, 500));

          console.log("🔄 Triggering force update...");
          setForceUpdate((prev) => prev + 1);

          setIsInitializingPayment(false);
        } catch (err: unknown) {
          console.error(`❌ Attempt ${retries + 1} failed:`, err);

          retries++;

          if (retries < maxRetries) {
            console.log(`🔄 Retrying in 1 second...`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await tryInitiate();
          } else {
            console.error("❌ All retries failed");
            const errorMessage =
              err instanceof Error
                ? err.message
                : "Failed to initialize payment session";
            console.error("Error details:", errorMessage);
            setError(errorMessage);
            setIsInitializingPayment(false);
          }
        }
      };

      await tryInitiate();
    }
  };

  const paymentReady = activeSession;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    });
  };

  const handleSubmit = async () => {
    if (!cart) {
      return;
    }

    setIsLoading(true);
    try {
      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod;

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  return (
    <div className="bg-white">
      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-gray-100 p-4 mb-4 text-xs border border-gray-300">
          <div className="font-bold mb-2">Payment Component Debug Info:</div>
          <div>activeSession: {JSON.stringify(activeSession, null, 2)}</div>
          <div>selectedPaymentMethod: {selectedPaymentMethod}</div>
          <div>isInitializingPayment: {isInitializingPayment}</div>
          <div>cart?.id: {cart?.id}</div>
          <div>
            cart?.payment_collection?.payment_sessions:
            {JSON.stringify(
              cart?.payment_collection?.payment_sessions,
              null,
              2,
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              console.log("🔄 Force update triggered");
              setForceUpdate((prev) => prev + 1);
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded mr-2"
          >
            Force Update
          </button>
          {isIzipay(selectedPaymentMethod) && (
            <button
              type="button"
              onClick={async () => {
                console.log("🧪 Manual iZipay payment session initialization");
                setIsInitializingPayment(true);
                try {
                  const result = await initiatePaymentSession(cart!, {
                    provider_id: selectedPaymentMethod,
                  });
                  console.log("✅ Manual init result:", result);
                  setForceUpdate((prev) => prev + 1);
                } catch (err: any) {
                  console.error("❌ Manual init failed:", err);
                  setError(
                    err.message || "Failed to initialize payment session",
                  );
                } finally {
                  setIsInitializingPayment(false);
                }
              }}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
            >
              Manual Init iZipay
            </button>
          )}
        </div>
      )}

      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            },
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isIzipay(paymentMethod.id) ? (
                      <RadioGroupOption
                        key={paymentMethod.id}
                        value={paymentMethod.id}
                        className={clx(
                          "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                          {
                            "border-ui-border-interactive":
                              selectedPaymentMethod === paymentMethod.id,
                          },
                        )}
                      >
                        <div className="flex items-center justify-between ">
                          <div className="flex items-center gap-x-4">
                            <Radio
                              checked={
                                selectedPaymentMethod === paymentMethod.id
                              }
                            />
                            <Text className="text-base-regular">
                              {paymentInfoMap[paymentMethod.id]?.title ||
                                paymentMethod.id}
                            </Text>
                          </div>
                          <span className="justify-self-end text-ui-fg-base">
                            {paymentInfoMap[paymentMethod.id]?.icon}
                          </span>
                        </div>
                        {isInitializingPayment &&
                        selectedPaymentMethod === paymentMethod.id ? (
                          <div className="flex items-center justify-center py-4">
                            <Spinner className="animate-spin mr-2" />
                            <Text className="text-ui-fg-subtle text-sm">
                              Initializing payment session...
                            </Text>
                          </div>
                        ) : (
                          <IzipayContainer
                            paymentProviderId={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                            handleSubmitAction={handleSubmit}
                            cart={cart || undefined}
                            paymentSessionData={activeSession?.data}
                          />
                        )}
                      </RadioGroupOption>
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!selectedPaymentMethod}
            data-testid="submit-payment-button"
          >
            Continue to review
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>Another step will appear</Text>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

export default Payment;
