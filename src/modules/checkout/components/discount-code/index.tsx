"use client";

import { applyCoupon, removeCoupon } from "@lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { Badge, Button, Input, Label, Text } from "@medusajs/ui";
import Spinner from "@modules/common/icons/spinner";
import Trash from "@modules/common/icons/trash";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import ErrorMessage from "../error-message";

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart;
};

const ApplyCouponSubmitButton = ({
  disabled,
  isLoading,
}: {
  disabled: boolean;
  isLoading: boolean;
}) => {
  return (
    <Button
      type="submit"
      variant="secondary"
      disabled={disabled || isLoading}
      className="h-11 min-w-[160px] rounded-[10px] border border-[#d9d9d9] bg-[#2970b7] px-5 font-[Poppins] text-[14px] font-medium text-white hover:bg-[#245f9a] disabled:opacity-70"
      data-testid="discount-apply-button"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner size="18" className="text-white" />
          <span>Validando...</span>
          <span className="sr-only">Validating coupon</span>
        </span>
      ) : (
        "Aplicar Cupón"
      )}
    </Button>
  );
};

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isRemoving, startRemoveTransition] = useTransition();

  const promotions = cart.promotions ?? [];
  const manualPromotion = promotions.find(
    (promotion) => !promotion.is_automatic,
  );
  const automaticPromotions = promotions.filter(
    (promotion) => promotion.is_automatic,
  );

  const paymentSessions = cart.payment_collection?.payment_sessions ?? [];
  const isLocked = paymentSessions.length > 0;

  const refreshCartState = () => {
    router.refresh();
    window.dispatchEvent(new CustomEvent("cart:updated"));
    window.dispatchEvent(new CustomEvent("cart:item-removed"));
  };

  const handleToggleForm = () => {
    if (isApplying) {
      return;
    }

    setErrorMessage(null);
    setCouponCode("");
    setIsFormOpen((currentValue) => !currentValue);
  };

  const handleApplyCoupon = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLocked || isApplying) {
      return;
    }

    const code = couponCode.trim();

    if (!code) {
      setErrorMessage("El codigo del cupon es requerido");
      return;
    }

    setErrorMessage(null);
    setIsApplying(true);

    try {
      await applyCoupon(code);
      setCouponCode("");
      setIsFormOpen(false);
      refreshCartState();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Fallo al aplicar cupon",
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    if (isLocked || !manualPromotion) {
      return;
    }

    const manualPromotionCode = manualPromotion.code;

    if (!manualPromotionCode) {
      setErrorMessage("Se necesita codigo de Cupon");
      return;
    }

    setErrorMessage(null);

    startRemoveTransition(async () => {
      try {
        await removeCoupon(manualPromotionCode);
        refreshCartState();
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : "Error al remover Cupon",
        );
      }
    });
  };

  return (
    <div className="flex w-full flex-col rounded-[16px] border border-[#e5e7eb] bg-white px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Text className="font-[Poppins] text-[16px] font-semibold leading-normal text-black">
            Cupón
          </Text>
          <Text className="font-[Poppins] text-[14px] leading-normal text-[#747474]">
            {isLocked
              ? "Coupons no pueden ser cambiados en el transcurso de una sesion"
              : "Aplica un cupon para esta reserva"}
          </Text>
        </div>

        {!manualPromotion ? (
          <Button
            type="button"
            variant="secondary"
            onClick={handleToggleForm}
            disabled={isLocked || isApplying}
            data-testid="add-discount-button"
            className="h-10 rounded-[10px] border border-[#d9d9d9] bg-white px-4 font-[Poppins] text-[14px] font-medium text-[#2970b7] hover:bg-[#f8fbff]"
          >
            {isFormOpen ? "Cancelar" : "Aplicar Cupón"}
          </Button>
        ) : null}
      </div>

      {isFormOpen && !manualPromotion ? (
        <form
          onSubmit={handleApplyCoupon}
          className="mt-4 flex flex-col gap-3"
          aria-busy={isApplying}
        >
          <Label
            htmlFor="promotion-input"
            className="font-[Poppins] text-[13px] font-medium text-[#747474]"
          >
            Cupón
          </Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              className="h-11 rounded-[10px] border border-[#d9d9d9] font-[Poppins]"
              id="promotion-input"
              name="code"
              type="text"
              autoComplete="off"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              disabled={isLocked || isApplying}
              data-testid="discount-input"
            />
            <ApplyCouponSubmitButton
              disabled={
                isLocked || isRemoving || couponCode.trim().length === 0
              }
              isLoading={isApplying}
            />
          </div>

          {isApplying ? (
            <Text
              className="font-[Poppins] text-[13px] leading-normal text-[#747474]"
              aria-live="polite"
            >
              Validando cupón...
            </Text>
          ) : null}
        </form>
      ) : null}

      {manualPromotion ? (
        <div
          className="mt-4 flex items-center justify-between gap-3 rounded-[12px] bg-[#f8fbff] px-4 py-3"
          data-testid="discount-row"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <Text className="font-[Poppins] text-[13px] font-medium uppercase tracking-[0.08em] text-[#747474]">
              Cupón Manual
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
            {isRemoving ? (
              <>
                <Spinner size="16" />
                <span className="sr-only">Removing coupon</span>
              </>
            ) : (
              <>
                <Trash size={14} />
                <span>Remover</span>
              </>
            )}
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
                    Promocion Automatica
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
