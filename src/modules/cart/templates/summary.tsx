"use client";

import { Button } from "@medusajs/ui";
import Modal from "@modules/common/components/modal";
import DiscountCode from "@modules/checkout/components/discount-code";
import { usePopupAuth } from "@/hooks/usePopupAuth";
import { HttpTypes } from "@medusajs/types";
import { useState } from "react";
import { usePathname } from "next/navigation";
import useToggleState from "@lib/hooks/use-toggle-state";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
};

const formatSolesAmount = (amount: number): string => {
  const hasDecimals = Math.abs(amount % 1) > 0;

  return new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

type SummaryProps = {
  cart: HttpTypes.StoreCart;
  hasAuthSessionCookie: boolean;
  hasMedusaSessionCookie: boolean;
};

const Summary = ({
  cart,
  hasAuthSessionCookie,
  hasMedusaSessionCookie,
}: SummaryProps) => {
  const checkoutHref = "/checkout";
  const pathname = usePathname();
  const localizedCheckoutPath = pathname.replace(/\/cart$/, checkoutHref);
  const { openPopup, isLoading, error } = usePopupAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const {
    state: isCheckoutChoiceOpen,
    open: openCheckoutChoice,
    close: closeCheckoutChoice,
  } = useToggleState(false);

  const originalTotal = toNumber(cart.original_total);
  const discountTotal = toNumber(cart.discount_total);
  const totalAmount = formatSolesAmount(toNumber(cart.total));
  const originalTotalAmount = formatSolesAmount(originalTotal);
  const discountAmount = formatSolesAmount(discountTotal);
  const hasDiscount = discountTotal > 0;

  const goToGuestCheckout = () => {
    closeCheckoutChoice();

    if (!hasAuthSessionCookie) {
      window.location.assign(localizedCheckoutPath);
      return;
    }

    const guestCheckoutUrl = `/api/auth/medusa-sync?mode=guest&callbackUrl=${encodeURIComponent(localizedCheckoutPath)}`;
    window.location.assign(guestCheckoutUrl);
  };

  const loginAndContinueCheckout = async () => {
    const syncUrl = `/api/auth/medusa-sync?callbackUrl=${encodeURIComponent(localizedCheckoutPath)}`;

    if (hasMedusaSessionCookie) {
      closeCheckoutChoice();
      window.location.assign(localizedCheckoutPath);
      return;
    }

    setIsSyncing(true);

    if (hasAuthSessionCookie && !hasMedusaSessionCookie) {
      closeCheckoutChoice();
      window.location.assign(syncUrl);
      return;
    }

    try {
      await openPopup({
        provider: "keycloak",
        redirectTo: syncUrl,
      });
    } catch {
      setIsSyncing(false);
      return;
    }

    closeCheckoutChoice();
    window.location.assign(syncUrl);
  };

  return (
    <div className="flex w-full justify-end">
      <div className=" max-w-[426px]">
        <div className="flex flex-col gap-5 rounded-[18px] border border-[#e5e7eb] bg-white p-5">
          <DiscountCode cart={cart} />

          <div className="space-y-3">
            {hasDiscount ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-[Poppins] text-[16px] leading-normal text-[#747474]">
                    Total Original
                  </span>
                  <span className="font-[Poppins] text-[18px] leading-normal text-[#747474] line-through">
                    s/. {originalTotalAmount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-[Poppins] text-[16px] font-medium leading-normal text-[#747474]">
                    Descuento del Cupón
                  </span>
                  <span className="font-[Poppins] text-[18px] font-semibold leading-normal text-[#2e8b57]">
                    - s/. {discountAmount}
                  </span>
                </div>
              </>
            ) : null}

            <div className="flex items-end justify-between border-t border-[#e5e7eb] pt-4">
              <span className="font-[Poppins] text-[20px] font-semibold leading-normal text-[#747474]">
                Total
              </span>

              <div className="flex items-end gap-2 font-[Poppins] font-bold leading-none text-[#2970b7]">
                <span className="text-[24px]">s/.</span>
                <span className="text-[40px]">{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <LocalizedClientLink href="/tours?destination=Cusco&categories=">
            <div className="w-[100px]"></div>
          </LocalizedClientLink>

          <Button
            className="h-[51px] w-full rounded-[8px] border border-[#e2e2e2] bg-[#efba06] px-6 font-[Poppins] text-[16px] font-medium text-white hover:bg-[#dba900] sm:w-[180px]"
            onClick={openCheckoutChoice}
            disabled={isLoading || isSyncing}
            aria-busy={isLoading || isSyncing}
            data-testid="checkout-button"
            type="button"
          >
            {isSyncing
              ? "Sincronizando..."
              : isLoading
                ? "Conectando..."
                : "Proceder Compra"}
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isCheckoutChoiceOpen}
        close={closeCheckoutChoice}
        size="small"
        data-testid="checkout-choice-modal"
      >
        <Modal.Title>
          <h3 className="font-[Poppins] text-[20px] font-semibold text-black">
            Como deseas continuar?
          </h3>
        </Modal.Title>
        <Modal.Description>
          Elige si quieres iniciar sesion para vincular tu compra o seguir como
          invitado.
        </Modal.Description>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="h-10"
            onClick={goToGuestCheckout}
            disabled={isLoading || isSyncing}
            data-testid="checkout-guest-button"
          >
            Continuar como invitado
          </Button>
          <Button
            className="h-10"
            onClick={() => void loginAndContinueCheckout()}
            disabled={isLoading || isSyncing}
            data-testid="checkout-login-button"
          >
            {isSyncing || isLoading ? "Conectando..." : "Iniciar sesion"}
          </Button>
        </Modal.Footer>
      </Modal>

      {error ? (
        <p className="text-sm text-red-500" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default Summary;
