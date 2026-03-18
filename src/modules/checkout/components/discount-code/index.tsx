"use client";

import { applyCoupon, removeCoupon } from "@lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { Badge, Button, Input, Label, Text } from "@medusajs/ui";
import Trash from "@modules/common/icons/trash";
import { useRouter } from "next/navigation";
import React, { useMemo, useState, useTransition } from "react";
import ErrorMessage from "../error-message";
import { SubmitButton } from "../submit-button";

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart;
};

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRemoving, startRemoveTransition] = useTransition();

  const promotions = cart.promotions ?? [];
  const manualPromotion = useMemo(() => {
    return promotions.find((promotion) => !promotion.is_automatic);
  }, [promotions]);

  const automaticPromotions = useMemo(() => {
    return promotions.filter((promotion) => promotion.is_automatic);
  }, [promotions]);

  const paymentSessions = cart.payment_collection?.payment_sessions ?? [];
  const isLocked = paymentSessions.length > 0;

  const refreshCartState = () => {
    router.refresh();
    window.dispatchEvent(new CustomEvent("cart:updated"));
    window.dispatchEvent(new CustomEvent("cart:item-removed"));
  };

  const handleApplyCoupon = async (formData: FormData) => {
    if (isLocked) {
      return;
    }

    const code = formData.get("code");

    if (typeof code !== "string" || !code.trim()) {
      setErrorMessage("Coupon code is required.");
      return;
    }

    setErrorMessage(null);

    try {
      await applyCoupon(code);
      setIsFormOpen(false);
      refreshCartState();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to apply coupon.",
      );
    }
  };

  const handleRemoveCoupon = () => {
    if (isLocked || !manualPromotion) {
      return;
    }

    setErrorMessage(null);

    startRemoveTransition(async () => {
      try {
        await removeCoupon();
        refreshCartState();
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to remove coupon.",
        );
      }
    });
  };

  return (
    <div className="flex w-full flex-col rounded-[16px] border border-[#e5e7eb] bg-white px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Text className="font-[Poppins] text-[16px] font-semibold leading-normal text-black">
            Coupon code
          </Text>
          <Text className="font-[Poppins] text-[14px] leading-normal text-[#747474]">
            {isLocked
              ? "Coupons can’t be changed after a payment session starts."
              : "Apply one manual coupon to this reservation."}
          </Text>
        </div>

        {!manualPromotion ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsFormOpen((currentValue) => !currentValue)}
            disabled={isLocked}
            data-testid="add-discount-button"
            className="h-10 rounded-[10px] border border-[#d9d9d9] bg-white px-4 font-[Poppins] text-[14px] font-medium text-[#2970b7] hover:bg-[#f8fbff]"
          >
            {isFormOpen ? "Cancel" : "Add coupon"}
          </Button>
        ) : null}
      </div>

      {isFormOpen && !manualPromotion ? (
        <form action={handleApplyCoupon} className="mt-4 flex flex-col gap-3">
          <Label
            htmlFor="promotion-input"
            className="font-[Poppins] text-[13px] font-medium text-[#747474]"
          >
            Coupon code
          </Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              className="h-11 rounded-[10px] border border-[#d9d9d9] font-[Poppins]"
              id="promotion-input"
              name="code"
              type="text"
              autoComplete="off"
              disabled={isLocked}
              data-testid="discount-input"
            />
            <SubmitButton
              variant="secondary"
              className="h-11 rounded-[10px] border border-[#d9d9d9] bg-[#2970b7] px-5 font-[Poppins] text-[14px] font-medium text-white hover:bg-[#245f9a]"
              data-testid="discount-apply-button"
            >
              Apply coupon
            </SubmitButton>
          </div>
        </form>
      ) : null}

      {manualPromotion ? (
        <div
          className="mt-4 flex items-center justify-between gap-3 rounded-[12px] bg-[#f8fbff] px-4 py-3"
          data-testid="discount-row"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <Text className="font-[Poppins] text-[13px] font-medium uppercase tracking-[0.08em] text-[#747474]">
              Manual coupon
            </Text>
            <div className="flex items-center gap-2">
              <Badge color="grey" size="small">
                <span data-testid="discount-code">{manualPromotion.code}</span>
              </Badge>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-[14px] font-medium text-[#2970b7] disabled:cursor-not-allowed disabled:text-[#a3a3a3]"
            onClick={handleRemoveCoupon}
            disabled={isLocked || isRemoving}
            data-testid="remove-discount-button"
          >
            <Trash size={14} />
            <span>{isRemoving ? "Removing..." : "Remove"}</span>
          </button>
        </div>
      ) : null}

      {automaticPromotions.length > 0 ? (
        <div className="mt-4 space-y-2">
          {automaticPromotions.map((promotion) => {
            return (
              <div
                key={promotion.id}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-[#eef2f7] px-4 py-3"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <Text className="font-[Poppins] text-[13px] font-medium uppercase tracking-[0.08em] text-[#747474]">
                    Automatic promotion
                  </Text>
                  <Badge color="green" size="small">
                    {promotion.code}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <ErrorMessage error={errorMessage} data-testid="discount-error-message" />
    </div>
  );
};

export default DiscountCode;
