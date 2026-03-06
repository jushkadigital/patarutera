import { retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CartTemplate from "@modules/cart/templates";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
};

export default async function Cart() {
  const cookieStore = await cookies();
  const hasAuthSessionCookie = Boolean(
    cookieStore.get("authjs.session-token")?.value ||
      cookieStore.get("__Secure-authjs.session-token")?.value ||
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value,
  );
  const hasMedusaSessionCookie = Boolean(cookieStore.get("_medusa_jwt")?.value);

  const cart = await retrieveCart().catch((error) => {
    console.error(error);
    return null;
  });
  console.log("MONO");
  console.log(cart);
  const customer = await retrieveCustomer().catch(() => null);

  if (!cart) {
    notFound();
  }

  return (
    <CartTemplate
      cart={cart}
      customer={customer}
      hasAuthSessionCookie={hasAuthSessionCookie}
      hasMedusaSessionCookie={hasMedusaSessionCookie}
    />
  );
}
