"use client";

import { Button } from "@medusajs/ui";
import Modal from "@modules/common/components/modal";
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

  const totalAmount = formatSolesAmount(toNumber(cart.total));

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
    if (hasMedusaSessionCookie) {
      closeCheckoutChoice();
      window.location.assign(localizedCheckoutPath);
      return;
    }

    setIsSyncing(true);

    if (hasAuthSessionCookie && !hasMedusaSessionCookie) {
      closeCheckoutChoice();
      const syncUrl = `/api/auth/medusa-sync?callbackUrl=${encodeURIComponent(localizedCheckoutPath)}`;
      window.location.assign(syncUrl);
      return;
    }

    try {
      await openPopup({ provider: "keycloak" });
      closeCheckoutChoice();
      window.location.assign(localizedCheckoutPath);
    } catch {
      setIsSyncing(false);
      return;
    }

    setIsSyncing(false);
  };

  return (
    <div className="flex w-full justify-end">
      <div className=" max-w-[426px]">
        <div className="flex items-end justify-between">
          <span className="font-[Poppins] text-[20px] font-semibold leading-normal text-[#747474]">
            Total
          </span>

          <div className="flex items-end gap-2 font-[Poppins] font-bold leading-none text-[#2970b7]">
            <span className="text-[24px]">s/.</span>
            <span className="text-[40px]">{totalAmount}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <LocalizedClientLink href="/">
            <Button
              className="h-[51px] w-full rounded-[8px] border border-[#e2e2e2] bg-white px-6 font-[Poppins] text-[16px] font-medium text-[#b1b1b1] hover:bg-[#f8f8f8] sm:w-[229px]"
              data-testid="continue-shopping-button"
              type="button"
              variant="transparent"
            >
              Seguir Comprando
            </Button>
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
            Continuar como guest
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
