import { Button } from "@medusajs/ui";
import { useMemo } from "react";

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { convertToLocale } from "@lib/util/money";
import { HttpTypes } from "@medusajs/types";

type OrderCardProps = {
  order: HttpTypes.StoreOrder;
};

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0) ?? 0
    );
  }, [order]);

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0;
  }, [order]);

  const topProducts = useMemo(() => {
    return (
      order.items
        ?.slice(0, 2)
        .map((item) => item.title)
        .join(", ") ?? "-"
    );
  }, [order]);

  const formatStatus = (status?: string | null) => {
    if (!status) {
      return "Unknown";
    }

    const formatted = status.split("_").join(" ");
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
  };

  return (
    <div
      className="h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col"
      data-testid="order-card"
    >
      <div className="uppercase text-small-semi mb-1">
        #<span data-testid="order-display-id">{order.display_id}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ui-fg-base">
        <span data-testid="order-created-at">
          {new Date(order.created_at).toDateString()}
        </span>
        <span className="text-gray-300">|</span>
        <span data-testid="order-amount">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span className="text-gray-300">|</span>
        <span>{`${numberOfLines} ${
          numberOfLines > 1 ? "items" : "item"
        }`}</span>
      </div>
      <div className="my-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <span className="text-gray-500">Payment</span>
          <span
            className="font-medium text-right"
            data-testid="order-payment-status"
          >
            {formatStatus(order.payment_status)}
          </span>
          <span className="text-gray-500">Products</span>
          <span className="font-medium text-right">{numberOfProducts}</span>
          <span className="text-gray-500">Top items</span>
          <span className="font-medium text-right truncate" title={topProducts}>
            {topProducts}
          </span>
        </div>
      </div>
      <div className="mt-auto flex justify-end">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button
            data-testid="order-details-link"
            variant="secondary"
            size="small"
          >
            See details
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default OrderCard;
