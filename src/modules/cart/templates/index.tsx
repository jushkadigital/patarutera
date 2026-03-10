import ItemsTemplate from "./items";
import Summary from "./summary";
import EmptyCartMessage from "../components/empty-cart-message";
import SignInPrompt from "../components/sign-in-prompt";
import Divider from "@modules/common/components/divider";
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
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {showExpiredCartNotice && (
          <div className="mb-6 rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
            Your previous cart was no longer available, so we redirected you
            from checkout.
          </div>
        )}
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white py-6">
                      <Summary
                        cart={cart as any}
                        hasAuthSessionCookie={hasAuthSessionCookie}
                        hasMedusaSessionCookie={hasMedusaSessionCookie}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
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
