import { HttpTypes } from "@medusajs/types";
import { groupBy } from "lodash";
import Image from "next/image";

type ReservationGroup = {
  id: string;
  createdAt?: string | Date;
  title: string;
  passengers: number;
  total: number;
  thumbnail?: string;
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

  if (typeof item.title === "string" && item.title.trim().length > 0) {
    return item.title;
  }

  return "Reserva";
};

const formatSolesAmount = (amount: number): string => {
  const hasDecimals = Math.abs(amount % 1) > 0;

  return new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const groupedItems = groupBy(cart.items ?? [], (item) => {
    return item.metadata?.group_id ?? item.id;
  });

  const reservationGroups: ReservationGroup[] = Object.entries(groupedItems)
    .map(([groupId, items]) => {
      const firstItem = items[0];
      const firstItemWithImage = items.find((item) => {
        return (
          Boolean(item.thumbnail) ||
          Boolean(item.variant?.product?.images?.[0]?.url) ||
          Boolean(getMetadataImage(item.metadata))
        );
      });

      const thumbnail =
        firstItemWithImage?.thumbnail ||
        firstItemWithImage?.variant?.product?.images?.[0]?.url ||
        getMetadataImage(firstItem?.metadata);

      return {
        id: groupId,
        createdAt: firstItem?.created_at,
        title: getGroupTitle(firstItem),
        passengers: items.reduce((acc, item) => acc + (item.quantity ?? 0), 0),
        total: items.reduce((acc, item) => acc + toNumber(item.total), 0),
        thumbnail,
      };
    })
    .sort((a, b) => {
      return (a.createdAt ?? "") > (b.createdAt ?? "") ? -1 : 1;
    });

  return (
    <div className="flex w-full justify-end font-[Poppins] lg:w-1/2">
      <div className="w-full max-w-[465px] bg-[#f2f2f2]">
        <div className="px-5 pb-8 pt-6">
          <h2 className="font-[Poppins] text-[24px] font-medium leading-normal text-black">
            Resumen de la reserva
          </h2>
          <div className="mt-4 h-px w-[237px] bg-[#d9d9d9]" />

          <div className="mt-8 space-y-6">
            {reservationGroups.map((group) => (
              <div
                key={group.id}
                className="grid grid-cols-[142px_1fr] gap-x-5"
              >
                <div className="relative h-[142px] w-[142px] overflow-hidden rounded-[16px] bg-[#d9d9d9]">
                  {group.thumbnail ? (
                    <Image
                      src={group.thumbnail}
                      alt={group.title}
                      fill
                      className="object-cover"
                      sizes="142px"
                    />
                  ) : null}
                </div>

                <div className="flex min-h-[142px] flex-col justify-between py-2">
                  <div>
                    <p className="text-[15px] font-semibold leading-normal text-black">
                      {group.title}
                    </p>
                    <p className="mt-1 font-[Poppins] text-[15px] leading-normal text-[#747474]">
                      {group.passengers}{" "}
                      {group.passengers === 1 ? "pasajero" : "pasajeros"}
                    </p>
                  </div>

                  <div className="flex items-end justify-end gap-1 font-[Poppins] font-bold leading-none text-[#2970b7]">
                    <span className="text-[15px]">s/.</span>
                    <span className="text-[24px]">
                      {formatSolesAmount(group.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#d9d9d9] px-9 py-7">
          <div className="flex items-end justify-between">
            <span className="font-[Poppins] text-[20px] font-semibold leading-normal text-[#747474]">
              Total
            </span>
            <div className="flex items-end gap-2 font-[Poppins] font-bold leading-none text-[#2970b7]">
              <span className="text-[24px]">s/.</span>
              <span className="text-[40px]">
                {formatSolesAmount(toNumber(cart.total))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
