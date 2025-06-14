import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { BASEURL } from "@/lib/config";
import Footer from "@/components/Footer";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Patarutera - Your Next Adventure Awaits",
  description: "Discover amazing tours, insightful blog posts, and information about our travel agency.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const response = await fetch(`${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`)
  const data = await response.json()

  return (
    <html lang="es" className={cn(poppins.variable, "font-poppins")}>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col">
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
