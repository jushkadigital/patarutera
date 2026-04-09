import { getBaseURL } from "@lib/util/env";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import PageViewTracker from "@/components/analytics/page-view-tracker";
import CartItemAddedToastBridge from "@/components/cart-item-added-toast-bridge";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};

const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? "G-6XPFF81QJW";
const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "971219730544055";
const TIKTOK_PIXEL_ID =
  process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "D305TJ3C77U1O98E1P9G";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="es" data-mode="light">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <GoogleAnalytics gaId={GOOGLE_TAG_ID} />
        <CartItemAddedToastBridge />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
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
              fbq('init', '${META_PIXEL_ID}');
            `,
          }}
        />
        <Script
          id="tiktok-pixel-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function (w, d, t) {
w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


ttq.load('${TIKTOK_PIXEL_ID}');
}(window, document, 'ttq');
`,
          }}
        />
        {props.children}
      </body>
    </html>
  );
}
