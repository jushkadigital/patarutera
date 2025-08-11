// Meta Pixel helpers

// Extend the Window interface to include the fbq function injected by Meta Pixel
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export type PixelEventOptions = Record<string, unknown>

/**
 * Fires the standard 'PageView' event.
 * Should be called on every route change on the client.
 */
export const pageview = (): void => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView')
  }
}

/**
 * Fires a custom event with additional payload.
 * @param name - Event name (e.g., 'AddToCart', 'Lead').
 * @param options - Arbitrary event payload.
 */
export const event = (name: string, options: PixelEventOptions = {}): void => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', name, options)
  }
}