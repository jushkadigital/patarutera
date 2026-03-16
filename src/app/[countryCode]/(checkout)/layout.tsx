import LocalizedClientLink from "@modules/common/components/localized-client-link";
import MedusaCTA from "@modules/layout/components/medusa-cta";
import Image from "next/image";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white border-b ">
        <nav className="flex flex-row justify-center h-full items-center w-full">
          <LocalizedClientLink
            href="/"
            className="w-36"
            data-testid="store-link"
          >
            <Image
              src={"/pataLogo.png"}
              width={100}
              height={100}
              alt="Logo"
              className={" object-cover"}
            />
          </LocalizedClientLink>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
      <div className="py-4 w-full flex items-center justify-center">
        <MedusaCTA />
      </div>
    </div>
  );
}
