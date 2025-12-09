import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { BASEURL } from "@/lib/config";
import { auth, signIn } from "@/lib/auth";
import { HeaderLogin } from "@/components/HeaderLogin";
import { SignIn } from "@/components/LoginKeycloak";
import { redirect } from "next/navigation";

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
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  if (!session) {
    redirect("/api/auth/login")
  }


  return (
    <html lang="es" className={cn(poppins.variable, "font-poppins")}>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col">
        <HeaderLogin session={session} />
        {children}
      </body>
    </html>
  );
}
