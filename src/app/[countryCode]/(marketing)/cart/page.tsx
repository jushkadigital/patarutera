import { retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import { Metadata } from "next";
import CartTemplate from "@modules/cart/templates";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
};

type Args = {
  searchParams: Promise<{ reason?: string | string[] | undefined }>;
};

export default async function Cart({
  searchParams: searchParamsPromise,
}: Args) {
  const searchParams = await searchParamsPromise;
  const reason = Array.isArray(searchParams.reason)
    ? searchParams.reason[0]
    : searchParams.reason;
  const showExpiredCartNotice = reason === "expired-cart";

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
  const customer = await retrieveCustomer().catch(() => null);

  return (
    <CartTemplate
      cart={cart}
      customer={customer}
      showExpiredCartNotice={showExpiredCartNotice}
      hasAuthSessionCookie={hasAuthSessionCookie}
      hasMedusaSessionCookie={hasMedusaSessionCookie}
    />
  );
}
