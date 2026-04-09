import { NuqsAdapter } from "nuqs/adapters/next/app";
import { BASEURL } from "@/lib2/config";
import Footer from "@/components/Footer";
import Script from "next/script";
import { TopBannerComplete } from "@/components/TopBanner";
import { retrieveCustomer } from "@lib/data/customer";
import { retrieveCart } from "@lib/data/cart";
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner";
import { ScrollToTopOnRouteChange } from "@/components/ScrollTopOnRoute";
import { Suspense } from "react";

export default async function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await fetch(
    `${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`,
  );
  const data = await response.json();

  const customer = await retrieveCustomer();
  const cart = await retrieveCart();

  return (
    <>
      <TopBannerComplete destinations={data.docs} />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}
      <main className="flex-grow">
        <ScrollToTopOnRouteChange />
        <Suspense fallback={null}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </Suspense>
      </main>
      <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
      <Footer destination={data.docs} />
    </>
  );
}
