import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cn } from "@/lib2/utils";
import { Header } from "@/components/Header";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { BASEURL } from "@/lib2/config";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Suspense } from 'react';
import PixelEvents from "@/components/PixelEvents";
import { GoogleTagManager } from '@next/third-parties/google'
import { TopBannerComplete } from "@/components/TopBanner";
import TikTokPixel from "@/components/PixelTiktok";
import { retrieveCustomer } from "@lib/data/customer";
import { retrieveCart } from "@lib/data/cart";
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner";
import { ScrollToTopOnRouteChange } from "@/components/ScrollTopOnRoute";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});



function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`¡Error! El valor esperado no puede ser nulo o undefined.`);
  }
}
export default async function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const response = await fetch(`${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`)
  const data = await response.json()
  //const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID;


  const customer = await retrieveCustomer()
  const cart = await retrieveCart()


  return (
    <>
      <Suspense fallback={null}>
        <PixelEvents />
        <TikTokPixel />
      </Suspense>
      <TopBannerComplete destinations={data.docs} />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}
      <main className="flex-grow">
        <ScrollToTopOnRouteChange />
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </main>
      <Script
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload" // Carga el script cuando el navegador está inactivo

      />
      {/* Aquí podrías agregar un Footer si lo tienes */}
      <Footer destination={data.docs} />
    </>
  );
}
