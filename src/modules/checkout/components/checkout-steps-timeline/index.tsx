"use client";

import { clx } from "@medusajs/ui";
import { useSearchParams } from "next/navigation";

type CheckoutStepsTimelineProps = {
  hasPreData: boolean;
  isPreDataCompleted: boolean;
};

type TimelineStepKey = "cart" | "passenger" | "payment";

type TimelineStep = {
  key: TimelineStepKey;
  label: string;
};

const TIMELINE_STEPS: TimelineStep[] = [
  { key: "cart", label: "Carrito" },
  { key: "passenger", label: "Pasajero" },
  { key: "payment", label: "Pago" },
];

const resolveCurrentStep = ({
  currentStep,
  hasPreData,
  isPreDataCompleted,
}: {
  currentStep: string | null;
  hasPreData: boolean;
  isPreDataCompleted: boolean;
}): TimelineStepKey => {
  if (hasPreData && currentStep === "predata") {
    return "passenger";
  }

  if (currentStep === "payment" || (!hasPreData && currentStep !== "predata")) {
    return "payment";
  }

  if (hasPreData && !isPreDataCompleted) {
    return "passenger";
  }

  return "payment";
};

export default function CheckoutStepsTimeline({
  hasPreData,
  isPreDataCompleted,
}: CheckoutStepsTimelineProps) {
  const searchParams = useSearchParams();
  const currentStepParam = searchParams.get("step");

  const activeStep = resolveCurrentStep({
    currentStep: currentStepParam,
    hasPreData,
    isPreDataCompleted,
  });

  const activeIndex = TIMELINE_STEPS.findIndex(
    (step) => step.key === activeStep,
  );

  return (
    <div
      className="overflow-x-auto px-1 py-2"
      data-testid="checkout-steps-timeline"
    >
      <div
        className="mx-auto min-w-[677px] max-w-[677px]"
        aria-label="Checkout timeline"
      >
        <ol className="flex items-center">
          {TIMELINE_STEPS.map((step, index) => {
            const isLast = index === TIMELINE_STEPS.length - 1;
            const isActive = index === activeIndex;

            return (
              <li key={step.key} className="flex items-center">
                <span
                  className={clx(
                    "flex h-[46px] w-[46px] items-center justify-center rounded-full border text-[24px] font-bold leading-none transition-colors",
                    {
                      "border-[#2970B7] bg-[#2970B7] text-white": isActive,
                      "border-[#CFCFCF] bg-white text-[#ACACAC]": !isActive,
                    },
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {!isLast && (
                  <div className="h-px w-[267px] bg-[#D9D9D9]">
                    <span
                      className={clx("block h-full transition-all", {
                        "w-full bg-[#2970B7]": index < activeIndex,
                        "w-0 bg-transparent": index >= activeIndex,
                      })}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex items-start">
          {TIMELINE_STEPS.map((step, index) => {
            return (
              <div key={step.key} className="flex items-start">
                <span className="w-[46px] text-center text-[16px] text-[#585858]">
                  {step.label}
                </span>
                {index < TIMELINE_STEPS.length - 1 && (
                  <div className="w-[267px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
