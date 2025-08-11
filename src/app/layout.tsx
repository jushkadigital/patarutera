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
   const PIXEL_ID = 971219730544055
   
   assertIsDefined(PIXEL_ID)


  return (
    <html lang="es" className={cn(poppins.variable, "font-poppins")}>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
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
              fbq('init', '${PIXEL_ID}');
            `,
          }}
        />
        <Suspense fallback={null}>
          <PixelEvents />
        </Suspense>

        <Header destinations={data.docs}/>
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
        <Footer destination={data.docs}/>
      </body>
    </html>
  );
}
