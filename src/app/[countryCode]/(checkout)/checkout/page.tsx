import { retrieveCart } from "@lib/data/cart";
import PaymentWrapper from "@modules/checkout/components/payment-wrapper";
import CheckoutForm from "@modules/checkout/templates/checkout-form";
import CheckoutSummary from "@modules/checkout/templates/checkout-summary";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Checkout",
};

type CheckoutPageParams = {
  countryCode: string;
};

type Args = {
  params: Promise<CheckoutPageParams>;
};

export default async function Checkout({ params: paramsPromise }: Args) {
  const { countryCode } = await paramsPromise;
  const cart = await retrieveCart();

  if (!cart) {
    redirect(`/${countryCode}/cart?reason=expired-cart`);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  );
}
