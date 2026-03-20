import { Button } from "@medusajs/ui";
import Image from "next/image";
import { useMemo } from "react";

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { convertToLocale } from "@lib/util/money";
import { HttpTypes } from "@medusajs/types";

type OrderCardProps = {
  order: HttpTypes.StoreOrder;
};

type GroupedOrderRow = {
  groupId: string;
  destination: string;
  variantCount: number;
  totalAmount: number;
  purchaseDate: string;
  imageUrl?: string;
};

const getMetadataRecord = (
  metadata: HttpTypes.StoreOrderLineItem["metadata"],
): Record<string, unknown> | undefined => {
  if (typeof metadata !== "object" || metadata === null) {
    return undefined;
  }

  return metadata as Record<string, unknown>;
};

const getDestination = (item: HttpTypes.StoreOrderLineItem): string => {
  const metadataRecord = getMetadataRecord(item.metadata);
  const destinationKeys = [
    "tour_destination",
    "package_destination",
    "tour_name",
    "package_name",
    "destination",
    "destino",
  ];

  for (const key of destinationKeys) {
    const value = metadataRecord?.[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  if (typeof item.title === "string" && item.title.trim().length > 0) {
    return item.title;
  }

  if (
    typeof item.product_title === "string" &&
    item.product_title.trim().length > 0
  ) {
    return item.product_title;
  }

  return "Destino";
};

const getMetadataImage = (
  metadata: HttpTypes.StoreOrderLineItem["metadata"],
): string | undefined => {
  const metadataRecord = getMetadataRecord(metadata);

  if (!metadataRecord) {
    return undefined;
  }

  const imageKeys = [
    "thumbnail",
    "image",
    "tour_thumbnail",
    "tour_image",
    "featured_image",
  ];

  for (const key of imageKeys) {
    const value = metadataRecord[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
};

const getImageUrl = (
  item: HttpTypes.StoreOrderLineItem,
): string | undefined => {
  return (
    item.thumbnail ||
    item.variant?.product?.images?.[0]?.url ||
    getMetadataImage(item.metadata)
  );
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const OrderCard = ({ order }: OrderCardProps) => {
  const groupedRows = useMemo<GroupedOrderRow[]>(() => {
    const formattedPurchaseDate = new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(order.created_at));

    const groupedMap = new Map<string, HttpTypes.StoreOrderLineItem[]>();

    for (const item of order.items ?? []) {
      const metadataRecord = getMetadataRecord(item.metadata);
      const metadataGroupId = metadataRecord?.group_id;

      if (
        typeof metadataGroupId !== "string" ||
        metadataGroupId.trim().length === 0
      ) {
        continue;
      }

      const groupId = metadataGroupId.trim();
      const currentGroup = groupedMap.get(groupId) ?? [];
      currentGroup.push(item);
      groupedMap.set(groupId, currentGroup);
    }

    return Array.from(groupedMap.entries()).map(([groupId, groupItems]) => {
      const firstItem = groupItems[0];
      const itemWithImage = groupItems.find((groupItem) => {
        return Boolean(getImageUrl(groupItem));
      });

      const uniqueVariants = new Set(
        groupItems.map((groupItem) => groupItem.variant_id ?? groupItem.id),
      );

      const totalAmount = groupItems.reduce((acc, currentItem) => {
        return acc + toNumber(currentItem.total);
      }, 0);

      return {
        groupId,
        destination: getDestination(firstItem),
        variantCount: uniqueVariants.size,
        totalAmount,
        purchaseDate: formattedPurchaseDate,
        imageUrl: getImageUrl(itemWithImage ?? firstItem),
      };
    });
  }, [order]);

  return (
    <div
      className="h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col"
      data-testid="order-card"
    >
      <div className="uppercase text-small-semi mb-1">
        #<span data-testid="order-display-id">{order.display_id}</span>
      </div>
      <div className="my-3 space-y-3">
        {groupedRows.map((groupedRow) => (
          <div
            key={groupedRow.groupId}
            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <div className="flex items-start gap-3">
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-md bg-gray-200">
                {groupedRow.imageUrl ? (
                  <Image
                    src={groupedRow.imageUrl}
                    alt={groupedRow.destination}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-500">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ui-fg-base truncate">
                  {groupedRow.destination}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  <span className="text-gray-500">Destino</span>
                  <span
                    className="font-medium text-right"
                    data-testid="order-destination"
                  >
                    {groupedRow.destination}
                  </span>
                  <span className="text-gray-500">Variantes</span>
                  <span
                    className="font-medium text-right"
                    data-testid="order-variants-count"
                  >
                    {groupedRow.variantCount}
                  </span>
                  <span className="text-gray-500">Fecha de compra</span>
                  <span
                    className="font-medium text-right"
                    data-testid="order-purchase-date"
                  >
                    {groupedRow.purchaseDate}
                  </span>
                  <span className="text-gray-500">Precio total</span>
                  <span
                    className="font-medium text-right"
                    data-testid="order-amount"
                  >
                    {convertToLocale({
                      amount: groupedRow.totalAmount,
                      currency_code: order.currency_code,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!groupedRows.length && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
            No hay productos en este pedido.
          </div>
        )}
      </div>
      <div className="mt-auto flex justify-end">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button
            data-testid="order-details-link"
            variant="secondary"
            size="small"
          >
            Ver detalle
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default OrderCard;
