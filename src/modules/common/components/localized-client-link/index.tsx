"use client";

import { useCountryCode } from "@/lib/context/country-code-context";
import Link from "next/link";
import React from "react";

type LocalizedClientLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  "href"
> & {
  href: string;
};

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: LocalizedClientLinkProps) => {
  const countryCode = useCountryCode();
  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  const localizedHref = normalizedHref.startsWith(`/${countryCode}`)
    ? normalizedHref
    : `/${countryCode}${normalizedHref}`;

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
};

export default LocalizedClientLink;
