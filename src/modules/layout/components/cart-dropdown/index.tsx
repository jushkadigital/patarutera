"use client";

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { convertToLocale } from "@lib/util/money";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import DeleteButton, {
  CustomDeleteButton,
} from "@modules/common/components/delete-button";
import LineItemOptions from "@modules/common/components/line-item-options";
import LineItemPrice, {
  LineCustomItemPrice,
} from "@modules/common/components/line-item-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Thumbnail from "@modules/products/components/thumbnail";
import { groupBy } from "lodash";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { Heart, ShoppingCart, CircleUserRound, Mail } from "lucide-react";
const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null;
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined,
  );
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

  const newItems = groupBy(cartState?.items, "metadata.group_id");

  const groupsArray = Object.entries(newItems).map(([type, items]) => ({
    type,
    items,
    created_at: items[0].created_at,
  }));

  const totalItems = groupsArray.length;

  const subtotal = cartState?.subtotal ?? 0;
  const itemRef = useRef<number>(totalItems || 0);

  const timedOpen = () => {
    open();

    const timer = setTimeout(close, 5000);

    setActiveTimer(timer);
  };

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer);
    }

    open();
  };

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer);
      }
    };
  }, [activeTimer]);

  const pathname = usePathname();

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/pe/cart")) {
      timedOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current]);

  return (
    <Popover className="relative h-full">
      <PopoverButton className="h-full">
        <LocalizedClientLink
          className="hover:text-ui-fg-base flex flex-row text-white"
          href="/cart"
          data-testid="nav-cart-link"
        >
          {" "}
          <ShoppingCart size={"icon"} className="size-5" color="#fff" /> (
          {totalItems})
        </LocalizedClientLink>
      </PopoverButton>
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
        <PopoverPanel
          static
          className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
          data-testid="nav-cart-dropdown"
        >
          <div className="p-4 flex items-center justify-center">
            <h3 className="text-large-semi">Cart</h3>
          </div>
          {cartState && cartState.items?.length ? (
            <>
              <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                {groupsArray
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1;
                  })
                  .map(({ type, items }, idx) => (
                    <div
                      className="grid grid-cols-[122px_1fr] gap-x-4"
                      key={idx}
                      data-testid="cart-item"
                    >
                      <LocalizedClientLink
                        href={`/pe/${type}/${items[0].product_handle}`}
                        className="w-24"
                      >
                        <Thumbnail
                          thumbnail={items[0].thumbnail}
                          images={items[0].variant?.product?.images}
                          size="square"
                        />
                      </LocalizedClientLink>
                      <div className="flex flex-col justify-between flex-1">
                        <div className="flex flex-col flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                              <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                <LocalizedClientLink
                                  href={`/pe/${type}/${items[0].product_handle}`}
                                  data-testid="product-link"
                                >
                                  {items[0].title}
                                </LocalizedClientLink>
                              </h3>

                              {items.map((ele, idx) => (
                                <LineItemOptions
                                  key={idx}
                                  variant={ele.variant}
                                  data-testid="cart-item-variant"
                                  data-value={ele.variant}
                                />
                              ))}
                            </div>
                            <div className="flex justify-end">
                              <LineCustomItemPrice
                                items={items}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                          </div>
                        </div>

                        <CustomDeleteButton
                          ids={items.map((ele) => ele.id)}
                          className="mt-1"
                          data-testid="cart-item-remove-button"
                        >
                          Remove
                        </CustomDeleteButton>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                <div className="flex items-center justify-between">
                  <span className="text-ui-fg-base font-semibold">
                    Subtotal <span className="font-normal">(excl. taxes)</span>
                  </span>
                  <span
                    className="text-large-semi"
                    data-testid="cart-subtotal"
                    data-value={subtotal}
                  >
                    {convertToLocale({
                      amount: subtotal,
                      currency_code: cartState.currency_code,
                    })}
                  </span>
                </div>
                <LocalizedClientLink href="/pe/cart" passHref>
                  <Button
                    className="w-full"
                    size="large"
                    data-testid="go-to-cart-button"
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
                  <LocalizedClientLink href="/pe">
                    <>
                      <span className="sr-only">Go to all products page</span>
                      <Button onClick={close}>Explore products</Button>
                    </>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default CartDropdown;
