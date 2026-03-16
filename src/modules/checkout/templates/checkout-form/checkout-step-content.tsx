"use client";

import PreData from "@modules/checkout/components/pre-data";
import Payment from "@modules/checkout/components/payment";
import { HttpTypes } from "@medusajs/types";
import { useSearchParams } from "next/navigation";

type FormStructure = {
  group_id: string;
  formId: string | number;
  tour_date?: string;
  package_date?: string;
  structure: unknown;
};

type CheckoutStepContentProps = {
  cart: HttpTypes.StoreCart | null;
  paymentMethods: HttpTypes.StorePaymentProvider[];
  hasPreData: boolean;
  formStructures: FormStructure[];
};

export default function CheckoutStepContent({
  cart,
  paymentMethods,
  hasPreData,
  formStructures,
}: CheckoutStepContentProps) {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step");

  const shouldRenderPreData = hasPreData && currentStep !== "payment";

  if (shouldRenderPreData) {
    return <PreData cart={cart} formStructures={formStructures} />;
  }

  return (
    <Payment
      cart={cart}
      availablePaymentMethods={paymentMethods}
      hasPreData={hasPreData}
    />
  );
}
