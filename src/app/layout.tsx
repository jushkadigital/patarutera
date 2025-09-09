import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { BASEURL } from "@/lib/config";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Suspense } from 'react';
import PixelEvents from "@/components/PixelEvents";
import { GoogleTagManager } from '@next/third-parties/google'
import { TopBannerComplete } from "@/components/TopBanner";
import TikTokPixel from "@/components/PixelTiktok";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Patarutera - Your Next Adventure Awaits",
  description: "Discover amazing tours, insightful blog posts, and information about our travel agency.",
};

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`¡Error! El valor esperado no puede ser nulo o undefined.`);
  }
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const response = await fetch(`${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`)
  const data = await response.json()
  //const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID;



  return (
    <html lang="es" className={cn(poppins.variable, "font-poppins")}>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <GoogleTagManager gtmId="G-6XPFF81QJW" />
      <body className="min-h-screen flex flex-col">
        <Script
          id="fb-pixel-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            `,
          }}
        />
        <Script
          id="fb-pixel-script-tiktok"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function (w, d, t) {
w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


ttq.load('D305TJ3C77U1O98E1P9G');
ttq.page();
}(window, document, 'ttq');
`
          }}
        />
        <Suspense fallback={null}>
          <PixelEvents />
          <TikTokPixel />
        </Suspense>
        <TopBannerComplete destinations={data.docs} />
        <main className="flex-grow">
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
      </body>
    </html>
  );
}
