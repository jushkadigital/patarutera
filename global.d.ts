declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      loaded?: boolean;
    };
    ttq?: {
      page: (...args: unknown[]) => void;
      track: (...args: unknown[]) => void;
    };
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    google_tag_manager?: Record<string, unknown>;
  }
}

export {};
