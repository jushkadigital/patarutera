"use client";

import { useEffect } from "react";
import { AnalyticsPayload, trackPurchase } from "@lib/analytics";

type PurchaseTrackerProps = {
  eventKey: string;
  payload: AnalyticsPayload;
};

const getStorageKey = (eventKey: string) => `analytics:purchase:${eventKey}`;

export default function PurchaseTracker({
  eventKey,
  payload,
}: PurchaseTrackerProps) {
  useEffect(() => {
    const storageKey = getStorageKey(eventKey);

    if (window.sessionStorage.getItem(storageKey) === "tracked") {
      return;
    }

    trackPurchase(payload);
    window.sessionStorage.setItem(storageKey, "tracked");
  }, [eventKey, payload]);

  return null;
}
