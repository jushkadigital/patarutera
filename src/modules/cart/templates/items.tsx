import { HttpTypes } from "@medusajs/types";
import { Heading } from "@medusajs/ui";
import { groupBy } from "lodash";
import Image from "next/image";

import { CustomDeleteButton } from "@modules/common/components/delete-button";

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart;
};

type CartGroupRow = {
  groupId: string;
  ids: string[];
  title: string;
  bookingDate?: string;
  totalQuantity: number;
  totalAmount: number;
  thumbnail?: string;
  createdAt?: string | Date;
};

const getMetadataRecord = (
  metadata: HttpTypes.StoreCartLineItem["metadata"],
): Record<string, unknown> | undefined => {
  if (typeof metadata !== "object" || metadata === null) {
    return undefined;
  }

  return metadata as Record<string, unknown>;
};

const getMetadataImage = (
  metadata: HttpTypes.StoreCartLineItem["metadata"],
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

const getGroupTitle = (item: HttpTypes.StoreCartLineItem): string => {
  const metadataRecord = getMetadataRecord(item.metadata);
  const metadataTitleKeys = [
    "tour_destination",
    "package_destination",
    "tour_name",
    "package_name",
  ];

  for (const key of metadataTitleKeys) {
    const value = metadataRecord?.[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return item.title?.trim() || "Reserva";
};

const getGroupDate = (
  item: HttpTypes.StoreCartLineItem,
): string | undefined => {
  const metadataRecord = getMetadataRecord(item.metadata);
  const rawDate = metadataRecord?.tour_date ?? metadataRecord?.package_date;

  if (typeof rawDate !== "string" || rawDate.trim().length === 0) {
    return undefined;
  }

  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return rawDate;
  }

  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
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

const formatSolesAmount = (amount: number): string => {
  const hasDecimals = Math.abs(amount % 1) > 0;

  return new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items ?? [];
  const groupedItems = groupBy(
    items,
    (item) => item.metadata?.group_id ?? item.id,
  );

  const groupsArray: CartGroupRow[] = Object.entries(groupedItems)
    .map(([groupId, groupItems]) => {
      const firstItem = groupItems[0];
      const firstItemWithImage = groupItems.find((groupedItem) => {
        return (
          Boolean(groupedItem.thumbnail) ||
          Boolean(groupedItem.variant?.product?.images?.[0]?.url) ||
          Boolean(getMetadataImage(groupedItem.metadata))
        );
      });

      const thumbnail =
        firstItemWithImage?.thumbnail ||
        firstItemWithImage?.variant?.product?.images?.[0]?.url ||
        getMetadataImage(firstItem?.metadata);

      return {
        groupId,
        ids: groupItems.map((groupedItem) => groupedItem.id),
        title: getGroupTitle(firstItem),
        bookingDate: getGroupDate(firstItem),
        totalQuantity: groupItems.reduce(
          (acc, currentItem) => acc + (currentItem.quantity ?? 0),
          0,
        ),
        totalAmount: groupItems.reduce(
          (acc, currentItem) => acc + toNumber(currentItem.total),
          0,
        ),
        createdAt: firstItem?.created_at,
        thumbnail,
      };
    })
    .sort((a, b) => {
      return (a.createdAt ?? "") > (b.createdAt ?? "") ? -1 : 1;
    });

  return (
    <div className="bg-[#fafafa] px-4 py-8 sm:px-8 lg:px-12">
      <Heading className="font-[Poppins] text-[24px] font-semibold leading-normal text-[#747474]">
        Tu Carrito de Compras
      </Heading>

      <div className="mt-8 hidden grid-cols-[2.3fr_1fr_0.7fr_0.8fr_44px] px-4 lg:grid">
        <span className="font-[Poppins] text-[15px] font-semibold text-[#747474]">
          Tour
        </span>
        <span className="font-[Poppins] text-[15px] font-semibold text-[#747474]">
          Fecha y hora
        </span>
        <span className="font-[Poppins] text-[15px] font-semibold text-[#747474]">
          Viajeros
        </span>
        <span className="font-[Poppins] text-[15px] font-semibold text-[#747474]">
          Precio
        </span>
        <span />
      </div>

      <div className="mt-4 space-y-6">
        {groupsArray.map((groupedItem) => {
          return (
            <div
              className="grid grid-cols-1 gap-y-4 rounded-[15px] bg-white px-3 py-3 sm:px-4 lg:grid-cols-[2.3fr_1fr_0.7fr_0.8fr_44px] lg:items-center lg:gap-y-0"
              key={groupedItem.groupId}
            >
              <div className="flex items-center gap-4">
                <div className="relative h-[96px] w-[96px] overflow-hidden rounded-[12px] bg-[#d9d9d9] lg:h-[142px] lg:w-[142px] lg:rounded-[15px]">
                  {groupedItem.thumbnail ? (
                    <Image
                      src={groupedItem.thumbnail}
                      alt={groupedItem.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 96px, 142px"
                    />
                  ) : null}
                </div>

                <p className="font-[Poppins] text-[15px] font-semibold leading-normal text-black">
                  {groupedItem.title}
                </p>
              </div>

              <div>
                <p className="font-[Poppins] text-[13px] text-[#747474] lg:hidden">
                  Fecha y hora
                </p>
                <p className="font-[Poppins] text-[15px] leading-normal text-[#747474]">
                  {groupedItem.bookingDate ?? "-"}
                </p>
              </div>

              <div>
                <p className="font-[Poppins] text-[13px] text-[#747474] lg:hidden">
                  Viajeros
                </p>
                <p className="font-[Poppins] text-[15px] leading-normal text-[#747474]">
                  {groupedItem.totalQuantity}
                </p>
              </div>

              <div>
                <p className="font-[Poppins] text-[13px] text-[#747474] lg:hidden">
                  Precio
                </p>
                <div className="flex items-end gap-1 font-[Poppins] font-bold leading-none text-[#2970b7]">
                  <span className="text-[15px]">s/.</span>
                  <span className="text-[32px] lg:text-[24px]">
                    {formatSolesAmount(groupedItem.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end lg:justify-center">
                <CustomDeleteButton
                  ids={groupedItem.ids}
                  className="text-[#cfcfcf] hover:text-[#747474]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemsTemplate;
