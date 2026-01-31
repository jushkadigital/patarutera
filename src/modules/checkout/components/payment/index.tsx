"use client";

import { RadioGroup, Radio as RadioGroupOption } from "@headlessui/react";
import { isIzipay, isStripeLike, paymentInfoMap } from "@lib/constants";
import { initiatePaymentSession } from "@lib/data/localCart";
import { CheckCircleSolid, CreditCard } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Button, Container, Heading, Text, clx } from "@medusajs/ui";
import ErrorMessage from "@modules/checkout/components/error-message";
import PaymentContainer from "@modules/checkout/components/payment-container";
import Divider from "@modules/common/components/divider";
import Radio from "@modules/common/components/radio";
import Spinner from "@modules/common/icons/spinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IzipayContainer } from "../payment-container/izipay-container";
import { retrieveCart } from "@lib/data/localCart";

const Payment = ({
  localCart: propCart,
  availablePaymentMethods,
}: {
  localCart: HttpTypes.StoreCart | null;
  availablePaymentMethods: HttpTypes.StorePaymentProvider[];
}) => {
  const [isFetchingCart, setIsFetchingCart] = useState(false);
  const [localCart, setLocalCart] = useState<HttpTypes.StoreCart | null>(
    propCart,
  );

  const activeSession = localCart?.payment_collection?.payment_sessions?.find(
    (paymentSession: HttpTypes.StorePaymentSession) =>
      paymentSession.status === "pending",
  );

  console.log("=== Payment Component Render ===");
  console.log("propCart:", propCart);
  console.log("localCart:", localCart);
  console.log("localCart.payment_collection:", localCart?.payment_collection);
  console.log(
    "localCart.payment_collection?.payment_sessions:",
    localCart?.payment_collection?.payment_sessions,
  );
  console.log("activeSession:", activeSession);
  console.log("activeSession.data:", activeSession?.data);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? "",
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "payment";

  const setPaymentMethod = useCallback(
    async (method: string) => {
      setError(null);
      setSelectedPaymentMethod(method);

      if (isIzipay(method) && localCart) {
        console.log("🔄 setPaymentMethod called with:", method);
        console.log("📦 Cart before session init:", localCart);

        await initiatePaymentSession(localCart, {
          provider_id: method,
        });

        setIsFetchingCart(true);
        console.log("🔄 Fetching updated localCart...");

        try {
          const updatedCart = await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${localCart.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key":
                  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
              },
            },
          );

          if (updatedCart.ok) {
            const data = await updatedCart.json();
            console.log("📦 Updated localCart received:", data.localCart);
            console.log(
              "📦 Updated localCart payment_collection:",
              data.localCart?.payment_collection,
            );

            if (data.localCart?.payment_collection?.payment_sessions) {
              console.log(
                "📦 Payment sessions in updated localCart:",
                data.localCart.payment_collection.payment_sessions,
              );
            }

            if (data.localCart?.payment_collection?.payment_sessions) {
              const session =
                data.localCart.payment_collection.payment_sessions.find(
                  (s) => s.provider_id === method && s.status === "pending",
                );
              console.log("📦 Active session:", session?.data);
            }

            setLocalCart(data.localCart);
          } else {
            console.error(
              "❌ Failed to fetch updated localCart:",
              updatedCart.status,
            );
          }
        } catch (error) {
          console.error("❌ Error fetching updated localCart:", error);
        } finally {
          setIsFetchingCart(false);
        }
      }
    },
    [localCart],
  );

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
    if (!localCart) {
      return;
    }

    setIsLoading(true);
    try {
      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod;

      if (!checkActiveSession) {
        await initiatePaymentSession(localCart, {
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
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !localCart?.payment_collection?.payment_sessions,
            },
          )}
        >
          Payment
          {!isOpen &&
            localCart?.payment_collection?.payment_sessions &&
            localCart.payment_collection.payment_sessions.some(
              (session) => session.status === "pending",
            ) && <CheckCircleSolid />}
        </Heading>
        {!isOpen &&
          localCart?.payment_collection?.payment_sessions &&
          localCart.payment_collection.payment_sessions.some(
            (session) => session.status === "pending",
          ) && (
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
                      <>
                        <RadioGroupOption
                          key={paymentMethod.id}
                          value={paymentMethod.id}
                          className={clx(
                            "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                            {
                              "border-ui-border-interactive":
                                selectedPaymentMethod === paymentMethod.id,
                            },
                          )}
                        >
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
                        </RadioGroupOption>
                        {selectedPaymentMethod === paymentMethod.id &&
                          isFetchingCart && (
                            <div className="w-full mt-4 flex items-center justify-center py-12">
                              <Spinner className="animate-spin mb-4" />
                              <Text className="text-ui-fg-subtle text-sm">
                                Initializing payment session...
                              </Text>
                            </div>
                          )}
                        {selectedPaymentMethod === paymentMethod.id &&
                          !isFetchingCart &&
                          localCart?.payment_collection?.payment_sessions &&
                          localCart.payment_collection.payment_sessions.some(
                            (session) =>
                              session.provider_id === selectedPaymentMethod &&
                              session.status === "pending",
                          ) && (
                            <IzipayContainer
                              paymentProviderId={paymentMethod.id}
                              selectedPaymentOptionId={selectedPaymentMethod}
                              handleSubmitAction={handleSubmit}
                              localCart={localCart || undefined}
                              paymentSessionData={
                                localCart.payment_collection.payment_sessions.find(
                                  (session) =>
                                    session.provider_id ===
                                      selectedPaymentMethod &&
                                    session.status === "pending",
                                )?.data
                              }
                            />
                          )}
                      </>
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
          {localCart &&
          localCart?.payment_collection?.payment_sessions &&
          localCart.payment_collection.payment_sessions.some(
            (session) => session.status === "pending",
          ) &&
          activeSession ? (
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
