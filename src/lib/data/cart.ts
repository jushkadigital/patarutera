"use server";

import { sdk } from "@lib/config";
import medusaError from "@lib/util/medusa-error";
import { getMedusaErrorMessage } from "@lib/util/get-medusa-error-message";
import { HttpTypes } from "@medusajs/types";
import { revalidateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies";
import { getRegion } from "./regions";
import { getLocale } from "@lib/data/locale-actions";

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, fields?: string) {
  const id = cartId || (await getCartId());
  const isCookieCartId = !cartId;
  fields ??=
    "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, *promotions, *payment_collection, *payment_collection.payment_sessions, +items.total, +total, +subtotal, +original_total, +discount_total, +shipping_methods.name";

  if (!id) {
    return null;
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("carts")),
  };

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ cart }: { cart: HttpTypes.StoreCart }) => cart)
    .catch(async () => {
      if (isCookieCartId) {
        await removeCartId();
      }

      return null;
    });
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  let cart = await retrieveCart(undefined, "id,region_id");

  const headers = {
    ...(await getAuthHeaders()),
  };

  if (!cart) {
    const locale = await getLocale();
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id, locale: locale || undefined },
      {},
      headers,
    );
    cart = cartResp.cart;

    await setCartId(cart.id);

    const cartCacheTag = await getCacheTag("carts");
    revalidateTag(cartCacheTag);
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers);
    const cartCacheTag = await getCacheTag("carts");
    revalidateTag(cartCacheTag);
  }

  return cart;
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error(
      "No existing cart found, please create one before updating",
    );
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);

      // Revalidate all pages
      try {
        revalidatePath("/", "layout");
      } catch (e) {
        // Fail silently
      }

      return cart;
    })
    .catch(medusaError);
}

const toMetadataRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
};

const toAnswersRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmailValue = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  if (!EMAIL_REGEX.test(trimmedValue)) {
    return null;
  }

  return trimmedValue.toLowerCase();
};

const isEmailFieldKey = (fieldKey: string): boolean => {
  const normalizedKey = fieldKey.toLowerCase().replace(/[^a-z0-9]/g, "");

  return normalizedKey.includes("email") || normalizedKey.includes("correo");
};

const findEmailInAnswers = (
  answers: Record<string, unknown>,
): string | null => {
  const queue: Array<[string, unknown]> = Object.entries(answers);

  while (queue.length > 0) {
    const [currentKey, currentValue] = queue.shift()!;

    if (typeof currentValue === "string") {
      if (!isEmailFieldKey(currentKey)) {
        continue;
      }

      const normalizedEmail = normalizeEmailValue(currentValue);
      if (normalizedEmail) {
        return normalizedEmail;
      }

      continue;
    }

    if (
      currentValue &&
      typeof currentValue === "object" &&
      !Array.isArray(currentValue)
    ) {
      for (const [nestedKey, nestedValue] of Object.entries(currentValue)) {
        queue.push([nestedKey, nestedValue]);
      }
    }
  }

  return null;
};

const hasOwnProperties = (value: Record<string, unknown>): boolean => {
  return Object.keys(value).length > 0;
};

type SavePreDataGroupSubmissionInput = {
  groupId: string;
  formId: string | number;
  answers: Record<string, unknown>;
  tourDate?: string;
  packageDate?: string;
};

export async function savePreDataGroupSubmission({
  answers,
  formId,
  groupId,
  packageDate,
  tourDate,
}: SavePreDataGroupSubmissionInput) {
  const cart = await retrieveCart(undefined, "id,email,customer_id,metadata");

  if (!cart) {
    throw new Error("No existing cart found when saving pre-data submission");
  }

  const currentMetadata = toMetadataRecord(cart.metadata);
  const currentPreData = toMetadataRecord(currentMetadata.preData);
  const currentGroups = toMetadataRecord(currentPreData.groups);
  const currentGroup = toMetadataRecord(currentGroups[groupId]);

  const currentRequiredGroupIds = toStringArray(
    currentPreData.required_group_ids,
  );
  const nextRequiredGroupIds = currentRequiredGroupIds.includes(groupId)
    ? currentRequiredGroupIds
    : [...currentRequiredGroupIds, groupId];

  const now = new Date().toISOString();

  const nextGroups = {
    ...currentGroups,
    [groupId]: {
      ...currentGroup,
      form_id: formId,
      answers: toAnswersRecord(answers),
      status: "completed",
      submitted_at: now,
      ...(tourDate ? { tour_date: tourDate } : {}),
      ...(packageDate ? { package_date: packageDate } : {}),
    },
  };

  const nextPreData = {
    ...currentPreData,
    version: 1,
    groups: nextGroups,
    required_group_ids: nextRequiredGroupIds,
    completed: false,
    updated_at: now,
  };

  const existingCartEmail = normalizeEmailValue(cart.email);
  const emailFromAnswers = findEmailInAnswers(answers);
  const nextCartEmail = existingCartEmail || emailFromAnswers;

  const isGuestCart = !cart.customer_id;
  const currentGuestMetadata = toMetadataRecord(currentMetadata.guest);
  const customerFromAnswers = toMetadataRecord(answers.customer);
  const guestFromAnswers = toMetadataRecord(answers.guest);
  const nextGuestMetadata: Record<string, unknown> = {
    ...currentGuestMetadata,
    ...(hasOwnProperties(customerFromAnswers)
      ? { customer: customerFromAnswers }
      : {}),
    ...(hasOwnProperties(guestFromAnswers) ? guestFromAnswers : {}),
    ...(nextCartEmail ? { email: nextCartEmail } : {}),
    updated_at: now,
    source: "predata",
  };

  return updateCart({
    ...(nextCartEmail ? { email: nextCartEmail } : {}),
    metadata: {
      ...currentMetadata,
      preData: nextPreData,
      preDataCompleted: false,
      ...(isGuestCart ? { guest: nextGuestMetadata } : {}),
    },
  });
}

type CompletePreDataStepInput = {
  requiredGroupIds: string[];
};

export async function completePreDataStep({
  requiredGroupIds,
}: CompletePreDataStepInput) {
  const cart = await retrieveCart(undefined, "id,metadata");

  if (!cart) {
    throw new Error("No existing cart found when completing pre-data step");
  }

  const currentMetadata = toMetadataRecord(cart.metadata);
  const currentPreData = toMetadataRecord(currentMetadata.preData);
  const currentGroups = toMetadataRecord(currentPreData.groups);

  const sanitizedRequiredGroupIds = Array.from(
    new Set(requiredGroupIds.filter((groupId) => typeof groupId === "string")),
  );

  const missingGroupIds = sanitizedRequiredGroupIds.filter((groupId) => {
    const group = toMetadataRecord(currentGroups[groupId]);
    const status = group.status;
    return status !== "completed";
  });

  if (missingGroupIds.length > 0) {
    throw new Error(
      `Missing completed forms for groups: ${missingGroupIds.join(", ")}`,
    );
  }

  const now = new Date().toISOString();

  const nextPreData = {
    ...currentPreData,
    version: 1,
    groups: currentGroups,
    required_group_ids: sanitizedRequiredGroupIds,
    completed: true,
    completed_at: now,
    updated_at: now,
  };

  return updateCart({
    metadata: {
      ...currentMetadata,
      preData: nextPreData,
      preDataCompleted: true,
    },
  });
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
  metadata,
}: {
  variantId: string;
  quantity: number;
  countryCode: string;
  metadata?: Record<string, any>;
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart");
  }

  const cart = await getOrSetCart(countryCode);

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
        metadata,
      },
      {},
      headers,
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);

      // Revalidate all pages
      try {
        revalidatePath("/", "layout");
      } catch (e) {
        // Fail silently
      }
    })
    .catch(medusaError);
}

type MultipleCartType = {
  variant_id: string;
  countryCode: string;
  quantity: number;
  unit_price?: number;
  metadata?: Record<string, any>;
}[];

type TourItemInput = {
  variant_id: string;
  quantity: number;
  unit_price?: number;
  metadata?: Record<string, any>;
};
type PackageItemInput = {
  variant_id: string;
  quantity: number;
  unit_price?: number;
  metadata?: Record<string, any>;
};

type AddTourItemsToCartInput = {
  countryCode: string;
  tourDate: string;
  items: TourItemInput[];
  formId?: number;
};

type AddPackageItemsToCartInput = {
  countryCode: string;
  packageDate: string;
  items: PackageItemInput[];
  formId?: number;
};

type AddBookingItemsToCartResult =
  | { success: true }
  | { success: false; errorMessage: string };

export async function addTourItemsToCart({
  countryCode,
  tourDate,
  items,
  formId,
}: AddTourItemsToCartInput): Promise<AddBookingItemsToCartResult> {
  try {
    if (!tourDate) {
      return {
        success: false,
        errorMessage: "Falta seleccionar una fecha para el tour.",
      };
    }

    if (!items || items.length === 0) {
      return {
        success: false,
        errorMessage:
          "Selecciona al menos un pasajero antes de agregar al carrito.",
      };
    }

    const cart = await getOrSetCart(countryCode);

    if (!cart) {
      return {
        success: false,
        errorMessage: "No se pudo preparar el carrito. Intenta nuevamente.",
      };
    }

    const headers = {
      ...(await getAuthHeaders()),
    };

    const payload = {
      cart_id: cart.id,
      tour_date: tourDate,
      items: items.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        ...(item.unit_price !== undefined
          ? { unit_price: item.unit_price }
          : {}),
        metadata: {
          ...(item.metadata ?? {}),
          tour_date: tourDate,
          ...(formId ? { formId: formId } : {}),
        },
      })),
    };

    await sdk.client
      .fetch<{ cart: HttpTypes.StoreCart }>("/store/cart/tour-items", {
        method: "POST",
        body: payload,
        headers,
      })
      .then(async () => {
        const cartCacheTag = await getCacheTag("carts");
        revalidateTag(cartCacheTag);

        const fulfillmentCacheTag = await getCacheTag("fulfillment");
        revalidateTag(fulfillmentCacheTag);

        try {
          revalidatePath("/", "layout");
        } catch {
          // Fail silently
        }
      });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      errorMessage: getMedusaErrorMessage(
        error,
        "No se pudo agregar el tour al carrito.",
      ),
    };
  }
}

export async function addPackagesItemsToCart({
  countryCode,
  packageDate,
  items,
  formId,
}: AddPackageItemsToCartInput): Promise<AddBookingItemsToCartResult> {
  try {
    if (!packageDate) {
      return {
        success: false,
        errorMessage: "Falta seleccionar una fecha para el paquete.",
      };
    }

    if (!items || items.length === 0) {
      return {
        success: false,
        errorMessage:
          "Selecciona al menos un pasajero antes de agregar al carrito.",
      };
    }

    const cart = await getOrSetCart(countryCode);

    if (!cart) {
      return {
        success: false,
        errorMessage: "No se pudo preparar el carrito. Intenta nuevamente.",
      };
    }

    const headers = {
      ...(await getAuthHeaders()),
    };

    const payload = {
      cart_id: cart.id,
      package_date: packageDate,
      items: items.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        ...(item.unit_price !== undefined
          ? { unit_price: item.unit_price }
          : {}),
        metadata: {
          ...(item.metadata ?? {}),
          package_date: packageDate,
          ...(formId ? { formId: formId } : {}),
        },
      })),
    };

    await sdk.client
      .fetch<{ cart: HttpTypes.StoreCart }>("/store/cart/package-items", {
        method: "POST",
        body: payload,
        headers,
      })
      .then(async () => {
        const cartCacheTag = await getCacheTag("carts");
        revalidateTag(cartCacheTag);

        const fulfillmentCacheTag = await getCacheTag("fulfillment");
        revalidateTag(fulfillmentCacheTag);

        try {
          revalidatePath("/", "layout");
        } catch {
          // Fail silently
        }
      });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      errorMessage: getMedusaErrorMessage(
        error,
        "No se pudo agregar el paquete al carrito.",
      ),
    };
  }
}

export async function addMultipleToCart(items: MultipleCartType) {
  //const variants = items.map(ele => ele.variantId)

  //if (variants.find(ele => ele == undefined) == undefined) {
  //  throw new Error(`Missing variant ID in array when adding to cart `)
  // }

  const countries = items.map((ele) => ele.countryCode);
  const cart = await getOrSetCart(countries[0]);

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.client
    .fetch(`store/customcart/add/${cart.id}`, {
      method: "POST",
      body: {
        items: items.map(({ countryCode, ...rest }) => rest),
      },
      headers,
    })
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);

      // Revalidate all pages
      try {
        revalidatePath("/", "layout");
      } catch (e) {
        // Fail silently
      }
    })
    .catch(medusaError);
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item");
  }

  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);

      // Revalidate all pages
      try {
        revalidatePath("/", "layout");
      } catch (e) {
        // Fail silently
      }
    })
    .catch(medusaError);
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item");
  }

  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);
    })
    .catch(medusaError);
}

export async function deleteMultipleLineItem(lineIds: string[]) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item");
  }
  const next = {
    ...(await getCacheOptions("carts")),
  };

  const headers = {
    ...(await getAuthHeaders()),
  };
  await sdk.client
    .fetch(`store/cart/delete-items`, {
      method: "POST",
      body: {
        cart_id: cartId,
        items: lineIds.map((ele) => ele),
      },
      query: {},
      next,
      headers,
    })
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);

      // Revalidate cart page (dynamic routes)
      try {
        revalidatePath("/", "layout");
      } catch (e) {
        // Fail silently
      }
    })
    .catch(medusaError);
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string;
  shippingMethodId: string;
}) {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);
    })
    .catch(medusaError);
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession,
) {
  const headers = {
    ...(await getAuthHeaders()),
  };

  console.log("[Server][Cart] initiatePaymentSession:start", {
    cartId: cart.id,
    providerId: data.provider_id,
  });

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      console.log("[Server][Cart] initiatePaymentSession:success", {
        cartId: cart.id,
        providerId: data.provider_id,
        sessions:
          resp.payment_collection?.payment_sessions?.map((session) => ({
            providerId: session.provider_id,
            status: session.status,
          })) ?? [],
      });

      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);
      return resp;
    })
    .catch((error) => {
      console.error("[Server][Cart] initiatePaymentSession:error", {
        cartId: cart.id,
        providerId: data.provider_id,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      return medusaError(error);
    });
}

export async function applyCoupon(code: string) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No existing cart found");
  }

  const trimmedCode = code.trim();

  if (!trimmedCode) {
    throw new Error("Coupon code is required.");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}/promotions`, {
      method: "POST",
      body: {
        promo_codes: [trimmedCode],
      },
      headers,
    })
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);

      // Revalidate all pages
      try {
        revalidatePath("/", "layout");
      } catch (e) {
        // Fail silently
      }

      return cart;
    })
    .catch(medusaError);
}

export async function removeCoupon(code: string) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No existing cart found");
  }

  const trimmedCode = code.trim();

  if (!trimmedCode) {
    throw new Error("Coupon code is required.");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}/promotions`, {
      method: "DELETE",
      body: {
        promo_codes: [trimmedCode],
      },
      headers,
    })
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      const cartCacheTag = await getCacheTag("carts");
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);

      // Revalidate all pages
      try {
        revalidatePath("/", "layout");
      } catch (e) {
        // Fail silently
      }

      return cart;
    })
    .catch(medusaError);
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[],
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData,
) {
  const code = formData.get("code");

  if (typeof code !== "string") {
    return "Coupon code is required.";
  }

  try {
    await applyCoupon(code);
  } catch (error: unknown) {
    return error instanceof Error ? error.message : "Failed to apply coupon.";
  }
}

// TODO: Pass a POJO instead of a form entity here
function getFormDataValue(
  formData: FormData,
  key: string,
  defaultValue: string = "",
): string {
  const value = formData.get(key);
  return (value as string) || defaultValue;
}

export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses");
    }
    const cartId = getCartId();
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses");
    }

    const shipping_address = {
      first_name: getFormDataValue(formData, "shipping_address.first_name"),
      last_name: getFormDataValue(formData, "shipping_address.last_name"),
      address_1: getFormDataValue(formData, "shipping_address.address_1"),
      address_2: "",
      company: getFormDataValue(formData, "shipping_address.company"),
      postal_code: getFormDataValue(formData, "shipping_address.postal_code"),
      city: getFormDataValue(formData, "shipping_address.city"),
      country_code: getFormDataValue(formData, "shipping_address.country_code"),
      province: getFormDataValue(formData, "shipping_address.province"),
      phone: getFormDataValue(formData, "shipping_address.phone"),
    };

    const email = getFormDataValue(formData, "email");

    const sameAsBilling = formData.get("same_as_billing");

    let billing_address = shipping_address;

    if (sameAsBilling !== "on") {
      billing_address = {
        first_name: getFormDataValue(formData, "billing_address.first_name"),
        last_name: getFormDataValue(formData, "billing_address.last_name"),
        address_1: getFormDataValue(formData, "billing_address.address_1"),
        address_2: "",
        company: getFormDataValue(formData, "billing_address.company"),
        postal_code: getFormDataValue(formData, "billing_address.postal_code"),
        city: getFormDataValue(formData, "billing_address.city"),
        country_code: getFormDataValue(
          formData,
          "billing_address.country_code",
        ),
        province: getFormDataValue(formData, "billing_address.province"),
        phone: getFormDataValue(formData, "billing_address.phone"),
      };

      if (
        !billing_address.first_name ||
        !billing_address.last_name ||
        !billing_address.address_1 ||
        !billing_address.city ||
        !billing_address.country_code ||
        !billing_address.postal_code ||
        !billing_address.phone
      ) {
        throw new Error(
          "Billing address is incomplete. Please fill in all required fields.",
        );
      }
    }

    const data = {
      shipping_address,
      billing_address,
      email,
    } as any;

    await updateCart(data);
  } catch (e: any) {
    return e.message;
  }

  redirect(
    `/${getFormDataValue(formData, "shipping_address.country_code")}/checkout?step=delivery`,
  );
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId());

  if (!id) {
    throw new Error("No existing cart found when placing an order");
  }

  const cartForValidation = await retrieveCart(
    id,
    "id,metadata,*items,*items.metadata",
  );

  if (!cartForValidation) {
    throw new Error("Cart not found when validating pre-data before order");
  }

  const metadataRecord = toMetadataRecord(cartForValidation.metadata);
  const preDataRecord = toMetadataRecord(metadataRecord.preData);
  const preDataGroups = toMetadataRecord(preDataRecord.groups);

  const requiredGroupsFromMetadata = toStringArray(
    preDataRecord.required_group_ids,
  );

  const requiredGroupsFromItems = (cartForValidation.items ?? []).reduce(
    (acc, item) => {
      const itemMetadata = toMetadataRecord(item.metadata);
      const formId = itemMetadata.formId;

      if (typeof formId !== "string" && typeof formId !== "number") {
        return acc;
      }

      const groupId =
        typeof itemMetadata.group_id === "string" && itemMetadata.group_id
          ? itemMetadata.group_id
          : item.id;

      acc.push(groupId);
      return acc;
    },
    [] as string[],
  );

  const firstRequiredGroupIdFromItems = requiredGroupsFromItems[0];
  const firstRequiredGroupIdFromMetadata = requiredGroupsFromMetadata[0];
  const firstRequiredGroupId =
    firstRequiredGroupIdFromMetadata ?? firstRequiredGroupIdFromItems;
  const requiredGroupIds = firstRequiredGroupId ? [firstRequiredGroupId] : [];

  const missingRequiredGroupIds = requiredGroupIds.filter((groupId) => {
    const groupData = toMetadataRecord(preDataGroups[groupId]);
    return groupData.status !== "completed";
  });

  if (requiredGroupIds.length > 0) {
    const preDataCompleted = metadataRecord.preDataCompleted === true;

    if (!preDataCompleted || missingRequiredGroupIds.length > 0) {
      throw new Error(
        missingRequiredGroupIds.length > 0
          ? `Complete all pre-data forms before placing the order. Missing groups: ${missingRequiredGroupIds.join(", ")}`
          : "Complete all pre-data forms before placing the order.",
      );
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  const completeCart = async (path: string) => {
    const response =
      await sdk.client.fetch<HttpTypes.StoreCompleteCartResponse>(path, {
        method: "POST",
        headers,
      });

    const cartCacheTag = await getCacheTag("carts");
    revalidateTag(cartCacheTag);

    return response;
  };

  let cartRes: HttpTypes.StoreCompleteCartResponse;

  try {
    console.log("[Server][Cart] placeOrder:start", {
      cartId: id,
      endpoint: `/store/carts/${id}/complete`,
    });

    cartRes = await completeCart(`/store/carts/${id}/complete`);
  } catch (error: unknown) {
    return medusaError(error);
  }

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase();

    const orderCacheTag = await getCacheTag("orders");
    revalidateTag(orderCacheTag);

    removeCartId();
    redirect(`/pe/order/${cartRes?.order.id}/confirmed`);
  }

  return cartRes.cart;
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId();
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  if (cartId) {
    await updateCart({ region_id: region.id });
    const cartCacheTag = await getCacheTag("carts");
    revalidateTag(cartCacheTag);
  }

  const regionCacheTag = await getCacheTag("regions");
  revalidateTag(regionCacheTag);

  const productsCacheTag = await getCacheTag("products");
  revalidateTag(productsCacheTag);

  redirect(`/${countryCode}${currentPath}`);
}

export async function listCartOptions() {
  const cartId = await getCartId();
  const headers = {
    ...(await getAuthHeaders()),
  };
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  };

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[];
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  });
}
