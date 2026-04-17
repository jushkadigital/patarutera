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
    <div className="px-1 py-2" data-testid="checkout-steps-timeline">
      <div
        className="mx-auto w-full max-w-[677px]"
        aria-label="Checkout timeline"
      >
        <ol className="flex w-full items-start">
          {TIMELINE_STEPS.map((step, index) => {
            const isLast = index === TIMELINE_STEPS.length - 1;
            const isActive = index === activeIndex;

            return (
              <li key={step.key} className="flex min-w-0 flex-1 items-start">
                <div className="flex shrink-0 flex-col items-center text-center">
                  <span
                    className={clx(
                      "flex h-10 w-10 items-center justify-center rounded-full border text-[18px] font-bold leading-none transition-colors sm:h-[46px] sm:w-[46px] sm:text-[24px]",
                      {
                        "border-[#2970B7] bg-[#2970B7] text-white": isActive,
                        "border-[#CFCFCF] bg-white text-[#ACACAC]": !isActive,
                      },
                    )}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mt-3 w-16 text-center text-[12px] leading-tight text-[#585858] sm:w-20 sm:text-[16px] sm:leading-normal">
                    {step.label}
                  </span>
                </div>

                {!isLast && (
                  <div className="mx-2 mt-5 h-px min-w-3 flex-1 bg-[#D9D9D9] sm:mx-4 sm:mt-[23px]">
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
      </div>
    </div>
  );
}
