import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Patarutera - Your Next Adventure Awaits",
  description: "Discover amazing tours, insightful blog posts, and information about our travel agency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(poppins.variable, "font-poppins")}>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </main>
        {/* Aquí podrías agregar un Footer si lo tienes */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
