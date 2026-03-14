import { listCartPaymentMethods } from "@lib/data/payment";
import CheckoutStepGuard from "@modules/checkout/components/checkout-step-guard";
import CheckoutStepsTimeline from "@modules/checkout/components/checkout-steps-timeline";
import PreData from "@modules/checkout/components/pre-data";
import { BASEURL } from "@/lib2/config";
import { HttpTypes } from "@medusajs/types";
import Payment from "@modules/checkout/components/payment";
import CheckoutSummary from "../checkout-summary";

type GroupedForm = {
  formId: string | number;
  group_id: string;
  tour_date?: string;
  package_date?: string;
  item_ids: string[];
};

type FormStructure = {
  group_id: string;
  formId: string | number;
  tour_date?: string;
  package_date?: string;
  structure: unknown;
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return value as Record<string, unknown>;
};

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  return value || undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const getGroupedForms = (cart: HttpTypes.StoreCart): GroupedForm[] => {
  const groupedForms = new Map<string, GroupedForm>();

  for (const item of cart.items ?? []) {
    const metadata = toRecord(item.metadata);
    const rawFormId = metadata.formId;
    const formId =
      typeof rawFormId === "string" || typeof rawFormId === "number"
        ? rawFormId
        : undefined;

    if (!formId) {
      continue;
    }

    const groupId = toOptionalString(metadata.group_id) ?? item.id;
    const existingGroup = groupedForms.get(groupId);

    if (existingGroup) {
      existingGroup.item_ids.push(item.id);
      continue;
    }

    groupedForms.set(groupId, {
      formId,
      group_id: groupId,
      tour_date: toOptionalString(metadata.tour_date),
      package_date: toOptionalString(metadata.package_date),
      item_ids: [item.id],
    });
  }

  return Array.from(groupedForms.values());
};

const getFormStructure = async (group: GroupedForm): Promise<FormStructure> => {
  if (!BASEURL) {
    return {
      group_id: group.group_id,
      formId: group.formId,
      tour_date: group.tour_date,
      package_date: group.package_date,
      structure: {
        id: group.formId,
        message: "NEXT_PUBLIC_SERVER_URL is not configured.",
      },
    };
  }

  try {
    const response = await fetch(`${BASEURL}/api/forms/${group.formId}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        group_id: group.group_id,
        formId: group.formId,
        tour_date: group.tour_date,
        package_date: group.package_date,
        structure: {
          id: group.formId,
          message: "The forms endpoint did not return 200.",
          status: response.status,
        },
      };
    }

    return {
      group_id: group.group_id,
      formId: group.formId,
      tour_date: group.tour_date,
      package_date: group.package_date,
      structure: await response.json(),
    };
  } catch (error) {
    console.error("Error fetching form structure", {
      formId: group.formId,
      error,
    });

    return {
      group_id: group.group_id,
      formId: group.formId,
      tour_date: group.tour_date,
      package_date: group.package_date,
      structure: {
        id: group.formId,
        message: "Failed to fetch form structure.",
      },
    };
  }
};

export default async function CheckoutForm({
  cart,
}: {
  cart: HttpTypes.StoreCart | null;
}) {
  if (!cart) {
    return null;
  }

  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "");

  if (!paymentMethods) {
    return null;
  }

  const groups = getGroupedForms(cart);
  const hasPreData = groups.length > 0;
  const isPreDataCompleted =
    isRecord(cart.metadata) && cart.metadata.preDataCompleted === true;
  const formStructures = hasPreData
    ? await Promise.all(groups.map((group) => getFormStructure(group)))
    : [];

  return (
    <div className="grid w-full grid-cols-1 gap-y-8 font-[Poppins]">
      <CheckoutStepGuard hasPreData={hasPreData} />
      <CheckoutStepsTimeline
        hasPreData={hasPreData}
        isPreDataCompleted={isPreDataCompleted}
      />
      <div className="flex flex-row">
        <div className="w-1/2">
          {hasPreData && (
            <PreData cart={cart} formStructures={formStructures} />
          )}
          <Payment
            cart={cart}
            availablePaymentMethods={paymentMethods}
            hasPreData={hasPreData}
          />
        </div>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  );
}
