import ItemsTemplate from "./items";
import Summary from "./summary";
import EmptyCartMessage from "../components/empty-cart-message";
import { HttpTypes } from "@medusajs/types";

const CartTemplate = ({
  cart,
  customer,
  showExpiredCartNotice,
  hasAuthSessionCookie,
  hasMedusaSessionCookie,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
  showExpiredCartNotice: boolean;
  hasAuthSessionCookie: boolean;
  hasMedusaSessionCookie: boolean;
}) => {
  const isAuthenticated = Boolean(
    customer?.id ||
    cart?.customer_id ||
    hasAuthSessionCookie ||
    hasMedusaSessionCookie,
  );

  return (
    <div className="py-12 font-[Poppins]">
      <div className="content-container" data-testid="cart-container">
        {showExpiredCartNotice && (
          <div className="mb-6 rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
            Tu carrito ya no esta disponible, seras redirigido al checkout{" "}
          </div>
        )}
        {cart?.items?.length ? (
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-6">
              {!customer && <></>}
              <ItemsTemplate cart={cart} />
            </div>
            {cart && cart.region && (
              <Summary
                cart={cart}
                isAuthenticated={isAuthenticated}
                hasAuthSessionCookie={hasAuthSessionCookie}
                hasMedusaSessionCookie={hasMedusaSessionCookie}
              />
            )}
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTemplate;
