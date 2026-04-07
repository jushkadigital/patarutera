export type AnalyticsItem = {
  itemId: string;
  itemName: string;
  price?: number;
  quantity?: number;
  itemCategory?: string;
  itemVariant?: string;
};

export type AnalyticsPayload = {
  currency?: string;
  value?: number;
  contentName?: string;
  contentCategory?: string;
  contentType?: string;
  description?: string;
  items?: AnalyticsItem[];
  transactionId?: string;
  pageLocation?: string;
  pageReferrer?: string;
  pageTitle?: string;
};

const DEFAULT_CURRENCY = "PEN";

const normalizeCurrency = (currency?: string) => {
  if (typeof currency !== "string" || currency.trim().length === 0) {
    return DEFAULT_CURRENCY;
  }

  return currency.trim().toUpperCase();
};

const sanitizeItems = (items?: AnalyticsItem[]) => {
  return (items ?? []).filter((item) => item.itemId && item.itemName);
};

const getItemQuantity = (quantity?: number) => {
  if (
    typeof quantity !== "number" ||
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    return 1;
  }

  return quantity;
};

const getItemPrice = (price?: number) => {
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return undefined;
  }

  return price;
};

const getPayloadValue = (payload: AnalyticsPayload, items: AnalyticsItem[]) => {
  if (typeof payload.value === "number" && Number.isFinite(payload.value)) {
    return payload.value;
  }

  return items.reduce((total, item) => {
    const price = getItemPrice(item.price);

    if (price === undefined) {
      return total;
    }

    return total + price * getItemQuantity(item.quantity);
  }, 0);
};

const buildMetaAndTikTokPayload = (payload: AnalyticsPayload) => {
  const items = sanitizeItems(payload.items);
  const currency = normalizeCurrency(payload.currency);
  const value = getPayloadValue(payload, items);

  return {
    ...(payload.contentName ? { content_name: payload.contentName } : {}),
    ...(payload.contentCategory
      ? { content_category: payload.contentCategory }
      : {}),
    ...(payload.contentType ? { content_type: payload.contentType } : {}),
    ...(payload.description ? { description: payload.description } : {}),
    ...(payload.transactionId ? { order_id: payload.transactionId } : {}),
    ...(items.length > 0
      ? {
          content_ids: items.map((item) => item.itemId),
          contents: items.map((item) => ({
            id: item.itemId,
            quantity: getItemQuantity(item.quantity),
            ...(getItemPrice(item.price) !== undefined
              ? { item_price: getItemPrice(item.price) }
              : {}),
          })),
          num_items: items.reduce(
            (total, item) => total + getItemQuantity(item.quantity),
            0,
          ),
        }
      : {}),
    ...(value > 0 ? { value } : {}),
    currency,
  };
};

const buildGaItems = (items: AnalyticsItem[]) => {
  return items.map((item) => ({
    item_id: item.itemId,
    item_name: item.itemName,
    quantity: getItemQuantity(item.quantity),
    ...(item.itemCategory ? { item_category: item.itemCategory } : {}),
    ...(item.itemVariant ? { item_variant: item.itemVariant } : {}),
    ...(getItemPrice(item.price) !== undefined
      ? { price: getItemPrice(item.price) }
      : {}),
  }));
};

const sendMetaEvent = (
  eventName: string,
  payload?: Record<string, unknown>,
) => {
  if (typeof window.fbq !== "function") {
    return;
  }

  if (payload && Object.keys(payload).length > 0) {
    window.fbq("track", eventName, payload);
    return;
  }

  window.fbq("track", eventName);
};

const sendTikTokEvent = (
  eventName: string,
  payload?: Record<string, unknown>,
) => {
  if (!window.ttq) {
    return;
  }

  if (eventName === "PageView") {
    window.ttq.page();
    return;
  }

  if (payload && Object.keys(payload).length > 0) {
    window.ttq.track(eventName, payload);
    return;
  }

  window.ttq.track(eventName);
};

const sendGoogleEvent = (
  eventName: string,
  payload: Record<string, unknown>,
  pushToEcommerceDataLayer: boolean = true,
) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    return;
  }

  if (!Array.isArray(window.dataLayer)) {
    return;
  }

  if (pushToEcommerceDataLayer) {
    window.dataLayer.push({
      event: eventName,
      ecommerce: payload,
    });

    return;
  }

  window.dataLayer.push({
    event: eventName,
    ...payload,
  });
};

export const trackPageView = (payload: AnalyticsPayload = {}) => {
  const googlePayload = {
    ...(payload.pageLocation ? { page_location: payload.pageLocation } : {}),
    ...(payload.pageReferrer ? { page_referrer: payload.pageReferrer } : {}),
    ...(payload.pageTitle ? { page_title: payload.pageTitle } : {}),
  };

  sendMetaEvent("PageView");
  sendTikTokEvent("PageView");
  sendGoogleEvent("page_view", googlePayload, false);
};

export const trackViewContent = (payload: AnalyticsPayload) => {
  const items = sanitizeItems(payload.items);
  const googlePayload = {
    currency: normalizeCurrency(payload.currency),
    value: getPayloadValue(payload, items),
    items: buildGaItems(items),
  };
  const providerPayload = buildMetaAndTikTokPayload({
    ...payload,
    contentType: payload.contentType ?? "product",
  });

  sendMetaEvent("ViewContent", providerPayload);
  sendTikTokEvent("ViewContent", providerPayload);
  sendGoogleEvent("view_item", googlePayload);
};

export const trackAddToCart = (payload: AnalyticsPayload) => {
  const items = sanitizeItems(payload.items);
  const googlePayload = {
    currency: normalizeCurrency(payload.currency),
    value: getPayloadValue(payload, items),
    items: buildGaItems(items),
  };
  const providerPayload = buildMetaAndTikTokPayload({
    ...payload,
    contentType: payload.contentType ?? "product",
  });

  sendMetaEvent("AddToCart", providerPayload);
  sendTikTokEvent("AddToCart", providerPayload);
  sendGoogleEvent("add_to_cart", googlePayload);
};

export const trackInitiateCheckout = (payload: AnalyticsPayload) => {
  const items = sanitizeItems(payload.items);
  const googlePayload = {
    currency: normalizeCurrency(payload.currency),
    value: getPayloadValue(payload, items),
    items: buildGaItems(items),
  };
  const providerPayload = buildMetaAndTikTokPayload({
    ...payload,
    contentType: payload.contentType ?? "product",
  });

  sendMetaEvent("InitiateCheckout", providerPayload);
  sendTikTokEvent("InitiateCheckout", providerPayload);
  sendGoogleEvent("begin_checkout", googlePayload);
};

export const trackPurchase = (payload: AnalyticsPayload) => {
  const items = sanitizeItems(payload.items);
  const googlePayload = {
    transaction_id: payload.transactionId,
    currency: normalizeCurrency(payload.currency),
    value: getPayloadValue(payload, items),
    items: buildGaItems(items),
  };
  const providerPayload = buildMetaAndTikTokPayload({
    ...payload,
    contentType: payload.contentType ?? "product",
  });

  sendMetaEvent("Purchase", providerPayload);
  sendTikTokEvent("Purchase", providerPayload);
  sendGoogleEvent("purchase", googlePayload);
};
