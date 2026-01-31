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
import Radio from "@modules/common/components/radio";
import Spinner from "@modules/common/icons/spinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IzipayContainer } from "../payment-container/izipay-container";

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart | null;
  availablePaymentMethods: HttpTypes.StorePaymentProvider[];
}) => {
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: HttpTypes.StorePaymentSession) =>
      paymentSession.status === "pending",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? "",
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "payment";

  const [isSessionCreated, setIsSessionCreated] = useState(false);

  const setPaymentMethod = async (method: string) => {
    setError(null);
    setSelectedPaymentMethod(method);

    if (isIzipay(method) && cart) {
      console.log("Creating payment session for:", method);
      await initiatePaymentSession(cart, {
        provider_id: method,
      });

      setIsSessionCreated(true);
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
                          isIzipay(paymentMethod.id) &&
                          !isSessionCreated && (
                            <div className="w-full mt-4 flex items-center justify-center py-12">
                              <Spinner className="animate-spin mb-4" />
                              <Text className="text-ui-fg-subtle text-sm">
                                Initializing payment session...
                              </Text>
                            </div>
                          )}
                        {selectedPaymentMethod === paymentMethod.id &&
                          isSessionCreated &&
                          activeSession?.data && (
                            <IzipayContainer
                              paymentProviderId={paymentMethod.id}
                              selectedPaymentOptionId={selectedPaymentMethod}
                              handleSubmitAction={handleSubmit}
                              cart={cart || undefined}
                              paymentSessionData={activeSession.data}
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
