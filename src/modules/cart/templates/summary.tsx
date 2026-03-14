"use client";

import { Button, Heading } from "@medusajs/ui";

import Divider from "@modules/common/components/divider";
import Modal from "@modules/common/components/modal";
import { usePopupAuth } from "@/hooks/usePopupAuth";
import { HttpTypes } from "@medusajs/types";
import { useState } from "react";
import { usePathname } from "next/navigation";
import CustomCartTotals from "@modules/common/components/custom-cart-totals";
import useToggleState from "@lib/hooks/use-toggle-state";

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
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Resumen
      </Heading>
      <Divider />
      <CustomCartTotals totals={cart} />
      <Button
        className="w-full h-10"
        onClick={openCheckoutChoice}
        disabled={isLoading || isSyncing}
        aria-busy={isLoading || isSyncing}
        data-testid="checkout-button"
      >
        {isSyncing
          ? "Sincronizando sesión..."
          : isLoading
            ? "Conectando..."
            : "Ir a checkout"}
      </Button>

      <Modal
        isOpen={isCheckoutChoiceOpen}
        close={closeCheckoutChoice}
        size="small"
        data-testid="checkout-choice-modal"
      >
        <Modal.Title>
          <Heading level="h3">Como deseas continuar?</Heading>
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
