"use client";

import { Transition } from "@headlessui/react";
import { convertToLocale } from "@lib/util/money";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import { CustomDeleteButton } from "@modules/common/components/delete-button";
import LineItemOptions from "@modules/common/components/line-item-options";
import { LineCustomItemPrice } from "@modules/common/components/line-item-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Thumbnail from "@modules/products/components/thumbnail";
import { groupBy } from "lodash";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

const getMetadataRecord = (
  metadata: HttpTypes.StoreCartLineItem["metadata"],
): Record<string, unknown> | undefined => {
  return metadata && typeof metadata === "object"
    ? (metadata as Record<string, unknown>)
    : undefined;
};

const getMetadataImage = (
  metadata: HttpTypes.StoreCartLineItem["metadata"],
): string | undefined => {
  const metadataRecord = getMetadataRecord(metadata);

  if (!metadataRecord) {
    return undefined;
  }

  const keys = [
    "thumbnail",
    "image",
    "tour_thumbnail",
    "tour_image",
    "featured_image",
  ];

  for (const key of keys) {
    const value = metadataRecord[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
};

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null;
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined,
  );
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [localCart, setLocalCart] = useState<HttpTypes.StoreCart | null>(
    cartState ?? null,
  );

  const groupedItems = groupBy(
    localCart?.items,
    (item) => item.metadata?.group_id ?? item.id,
  );

  const groupsArray = Object.entries(groupedItems).map(([groupId, items]) => ({
    groupId,
    items,
    created_at: items[0]?.created_at,
  }));

  const totalItems = groupsArray.length;
  const total = toNumber(localCart?.total);
  const originalTotal = toNumber(localCart?.original_total);
  const discountTotal = toNumber(localCart?.discount_total);
  const hasDiscount = discountTotal > 0;
  const itemRef = useRef<number>(totalItems || 0);

  const closeDropdown = () => {
    setCartDropdownOpen(false);
  };

  const openDropdown = () => {
    setCartDropdownOpen(true);
  };

  const timedOpen = () => {
    openDropdown();

    const timer = setTimeout(closeDropdown, 5000);
    setActiveTimer(timer);
  };

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer);
    }

    openDropdown();
  };

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        next: { revalidate: 0 },
      });
      const data = await response.json();
      setLocalCart(data.cart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const pathname = usePathname();

  useEffect(() => {
    if (!localCart && cartState) {
      setLocalCart(cartState);
    }
  }, [localCart, cartState]);

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer);
      }
    };
  }, [activeTimer]);

  useEffect(() => {
    if (itemRef.current < totalItems && !pathname.includes("/cart")) {
      timedOpen();
    }

    itemRef.current = totalItems;
  }, [totalItems, pathname]);

  useEffect(() => {
    const handleItemAdded = () => {
      fetchCart();
      if (!pathname.includes("/cart")) {
        timedOpen();
      }
    };

    const handleItemRemoved = () => {
      fetchCart();
    };

    const handleCartUpdated = () => {
      fetchCart();
    };

    window.addEventListener("cart:item-added", handleItemAdded);
    window.addEventListener("cart:item-removed", handleItemRemoved);
    window.addEventListener("cart:updated", handleCartUpdated);

    return () => {
      window.removeEventListener("cart:item-added", handleItemAdded);
      window.removeEventListener("cart:item-removed", handleItemRemoved);
      window.removeEventListener("cart:updated", handleCartUpdated);
    };
  }, [pathname]);

  return (
    <div
      className="relative h-full"
      onMouseEnter={openAndCancel}
      onMouseLeave={closeDropdown}
    >
      <LocalizedClientLink
        className="hover:text-ui-fg-base flex flex-row text-white"
        href="/cart"
        data-testid="nav-cart-link"
        onFocus={openAndCancel}
      >
        <ShoppingCart size={"icon"} className="size-5" color="#fff" /> (
        <span aria-live="polite">{totalItems}</span>)
      </LocalizedClientLink>
      <Transition
        show={cartDropdownOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div
          className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
          data-testid="nav-cart-dropdown"
        >
          <div className="p-4 flex items-center justify-center">
            <h3 className="text-large-semi">Cart</h3>
          </div>
          {localCart && localCart.items?.length ? (
            <>
              <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                {groupsArray
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1;
                  })
                  .map(({ groupId, items }) => {
                    const collectionType =
                      (items[0].metadata?.collection_type as
                        | string
                        | undefined) || "tour";
                    const normalizedCollectionType =
                      collectionType === "tour" ? "tours" : collectionType;
                    const productHandle = items[0]?.product_handle;
                    const href = productHandle
                      ? `/${normalizedCollectionType}/${productHandle}`
                      : "/cart";

                    const firstItemWithImage = items.find(
                      (item) =>
                        Boolean(item.thumbnail) ||
                        Boolean(item.variant?.product?.images?.[0]?.url) ||
                        Boolean(getMetadataImage(item.metadata)),
                    );

                    const thumbnail =
                      firstItemWithImage?.thumbnail ||
                      getMetadataImage(items[0]?.metadata) ||
                      getMetadataImage(firstItemWithImage?.metadata);

                    const images =
                      firstItemWithImage?.variant?.product?.images ||
                      items[0]?.variant?.product?.images;

                    return (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={groupId}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink href={href} className="w-24">
                          <Thumbnail
                            thumbnail={thumbnail}
                            images={images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                  <LocalizedClientLink
                                    href={href}
                                    data-testid="product-link"
                                  >
                                    {items[0].title}
                                  </LocalizedClientLink>
                                </h3>

                                {items.map((lineItem) => (
                                  <LineItemOptions
                                    key={lineItem.id}
                                    variant={lineItem.variant}
                                    data-testid="cart-item-variant"
                                    data-value={lineItem.variant}
                                  />
                                ))}
                              </div>
                              <div className="flex justify-end">
                                <LineCustomItemPrice
                                  items={items}
                                  style="tight"
                                  currencyCode={localCart.currency_code}
                                />
                              </div>
                            </div>
                          </div>

                          <CustomDeleteButton
                            ids={items.map((lineItem) => lineItem.id)}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </CustomDeleteButton>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                {hasDiscount ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-ui-fg-base font-semibold">
                        Original total
                      </span>
                      <span className="text-ui-fg-subtle line-through">
                        {convertToLocale({
                          amount: originalTotal,
                          currency_code: localCart.currency_code,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ui-fg-base font-semibold">
                        Coupon discount
                      </span>
                      <span
                        className="text-ui-fg-interactive"
                        data-testid="cart-discount"
                        data-value={discountTotal}
                      >
                        -
                        {convertToLocale({
                          amount: discountTotal,
                          currency_code: localCart.currency_code,
                        })}
                      </span>
                    </div>
                  </>
                ) : null}
                <div className="flex items-center justify-between">
                  <span className="text-ui-fg-base font-semibold">Total</span>
                  <span
                    className="text-large-semi"
                    data-testid="cart-total"
                    data-value={total}
                  >
                    {convertToLocale({
                      amount: total,
                      currency_code: localCart.currency_code,
                    })}
                  </span>
                </div>
                <LocalizedClientLink href="/cart" passHref>
                  <Button
                    className="w-full"
                    size="large"
                    data-testid="go-to-cart-button"
                    onClick={closeDropdown}
                  >
                    Go to cart
                  </Button>
                </LocalizedClientLink>
              </div>
            </>
          ) : (
            <div>
              <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                  <span>0</span>
                </div>
                <span>Your shopping bag is empty.</span>
                <div>
                  <LocalizedClientLink href="/">
                    <>
                      <span className="sr-only">Go to all products page</span>
                      <Button onClick={closeDropdown}>Explore products</Button>
                    </>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default CartDropdown;
