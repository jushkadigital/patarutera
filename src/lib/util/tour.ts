import { HttpTypes } from "@medusajs/types";

export function isTour(product: HttpTypes.StoreProduct): boolean {
  return !!(product as any).tour
}
