"use client";

import { Table, Text, clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import DeleteButton from "@modules/common/components/delete-button";
import { CustomDeleteButton } from "@modules/common/components/delete-button";
import LineItemPrice from "@modules/common/components/line-item-price";
import LineItemOptions from "@modules/common/components/line-item-options";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Thumbnail from "@modules/products/components/thumbnail";

type StoreCartLineItem = HttpTypes.StoreCartLineItem;

type ItemProps = {
  item: StoreCartLineItem | StoreCartLineItem[];
  type?: "full" | "preview";
  currencyCode: string;
  bookingDate: string;
  bookingDestination: string;
  bookingThumbnail: string;
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

const getMetadataRecord = (
  metadata: StoreCartLineItem["metadata"],
): Record<string, unknown> | undefined => {
  return metadata && typeof metadata === "object"
    ? (metadata as Record<string, unknown>)
    : undefined;
};

const getMetadataImage = (
  metadata: StoreCartLineItem["metadata"],
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

const getVariantBreakdownTotal = (
  metadata: StoreCartLineItem["metadata"],
): number => {
  const metadataRecord = getMetadataRecord(metadata);
  const breakdown = metadataRecord?.variant_breakdown;

  if (!Array.isArray(breakdown)) {
    return 0;
  }

  return breakdown.reduce((acc, entry) => {
    if (!entry || typeof entry !== "object") {
      return acc;
    }

    const record = entry as Record<string, unknown>;
    const lineTotal = toNumber(record.line_total);

    if (lineTotal > 0) {
      return acc + lineTotal;
    }

    return acc + toNumber(record.quantity) * toNumber(record.unit_price);
  }, 0);
};

const Item = ({ item, type = "full", currencyCode, bookingDate, bookingDestination, bookingThumbnail }: ItemProps) => {
  const groupedItems = Array.isArray(item) ? item : [item];
  const firstItemWithImage = groupedItems.find(
    (groupedItem) =>
      Boolean(groupedItem.thumbnail) ||
      Boolean(groupedItem.variant?.product?.images?.[0]?.url) ||
      Boolean(getMetadataImage(groupedItem.metadata)),
  );

  const lineItemsTotal = groupedItems.reduce(
    (acc, currentItem) => acc + toNumber(currentItem.total),
    0,
  );
  const lineItemsOriginalTotal = groupedItems.reduce(
    (acc, currentItem) => acc + toNumber(currentItem.original_total),
    0,
  );

  const variantBreakdownTotal = getVariantBreakdownTotal(
    groupedItems[0]?.metadata,
  );
  const aggregatedTotal =
    lineItemsTotal > 0 ? lineItemsTotal : variantBreakdownTotal;

  const displayItem = {
    ...groupedItems[0],
    thumbnail:
      firstItemWithImage?.thumbnail ||
      getMetadataImage(groupedItems[0]?.metadata) ||
      getMetadataImage(firstItemWithImage?.metadata),
    variant: firstItemWithImage?.variant || groupedItems[0]?.variant,
    quantity: groupedItems.reduce(
      (acc, currentItem) => acc + (currentItem.quantity ?? 0),
      0,
    ),
    total: aggregatedTotal,
    original_total:
      lineItemsOriginalTotal > 0 ? lineItemsOriginalTotal : aggregatedTotal,
  };



  const collectionType =
    (displayItem.metadata?.collection_type as string | undefined) || "tours";
  const normalizedCollectionType =
    collectionType === "tour" ? "tours" : collectionType;
  const productHref = displayItem.product_handle
    ? `/${normalizedCollectionType}/${displayItem.product_handle}`
    : undefined;
  const productTitle = bookingDestination

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        {productHref ? (
          <LocalizedClientLink
            href={productHref}
            className={clx("flex", {
              "w-16": type === "preview",
              "small:w-24 w-12": type === "full",
            })}
          >
            <Thumbnail
              thumbnail={bookingThumbnail}
              size="square"
            />
          </LocalizedClientLink>
        ) : (
          <div
            className={clx("flex", {
              "w-16": type === "preview",
              "small:w-24 w-12": type === "full",
            })}
          >
            <Thumbnail
              thumbnail={displayItem.thumbnail}
              size="square"
            />
          </div>
        )}
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {productHref ? (
            <LocalizedClientLink href={productHref}>
              {productTitle}
            </LocalizedClientLink>
          ) : (
            productTitle
          )}
        </Text>


      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <CustomDeleteButton
              ids={groupedItems.map((groupedItem) => groupedItem.id)}
              data-testid="product-delete-button"
            />
          </div>
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          <LineItemPrice
            item={displayItem}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  );
};

export default Item;
