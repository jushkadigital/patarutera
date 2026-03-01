"use server";

import { sdk } from "@lib/config";
import medusaError from "@lib/util/medusa-error";
import { getAuthHeaders, getCacheOptions } from "./cookies";
import { HttpTypes } from "@medusajs/types";

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("payment_providers")),
  };

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "force-cache",
      },
    )
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1;
      }),
    )
    .catch(() => {
      return null;
    });
};

type IzipayCreatePaymentRequest = {
  requestSource: string;
  orderNumber: string;
  merchantCode: string;
  publicKey: string;
  amount: string;
};

type IzipayCreatePaymentResponse = {
  response?: {
    token?: string;
  };
  message?: string;
};

export const createIzipayPayment = async (
  data: IzipayCreatePaymentRequest,
  transactionId: string,
) => {
  const headers = {
    ...(await getAuthHeaders()),
    transactionId,
  };

  return sdk.client
    .fetch<IzipayCreatePaymentResponse>("/store/izipay/create-payment", {
      method: "POST",
      body: data,
      headers,
      cache: "no-store",
    })
    .catch(medusaError);
};
