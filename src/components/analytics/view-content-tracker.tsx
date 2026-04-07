"use client";

import { useEffect, useRef } from "react";
import { AnalyticsPayload, trackViewContent } from "@lib/analytics";

type ViewContentTrackerProps = {
  eventKey: string;
  payload: AnalyticsPayload;
};

export default function ViewContentTracker({
  eventKey,
  payload,
}: ViewContentTrackerProps) {
  const lastTrackedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedKeyRef.current === eventKey) {
      return;
    }

    trackViewContent(payload);
    lastTrackedKeyRef.current = eventKey;
  }, [eventKey, payload]);

  return null;
}
