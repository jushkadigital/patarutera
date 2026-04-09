import { NuqsAdapter } from "nuqs/adapters/next/app";
import { BASEURL } from "@/lib2/config";
import Footer from "@/components/Footer";
import Script from "next/script";
import { TopBannerComplete } from "@/components/TopBanner";
import { ScrollToTopOnRouteChange } from "@/components/ScrollTopOnRoute";

export default async function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await fetch(
    `${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`,
  );
  const data = await response.json();

  return (
    <>
      <TopBannerComplete destinations={data.docs} />
      <main className="flex-grow">
        <NuqsAdapter>
          <ScrollToTopOnRouteChange />
          {children}
        </NuqsAdapter>
      </main>
      <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
      <Footer destination={data.docs} />
    </>
  );
}
