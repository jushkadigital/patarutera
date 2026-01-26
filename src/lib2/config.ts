export const BASEURL: string = process.env.NEXT_PUBLIC_SERVER_URL || "";

if (!BASEURL && process.env.NODE_ENV !== 'test') {
  console.warn("Warning: NEXT_PUBLIC_PAYLOAD_API_URL is not set. API calls may fail.");
  // In a stricter setup, you might throw an error during build if it's not set:
  // if (process.env.NODE_ENV === 'production' && !baseUrl) {
  //   throw new Error("NEXT_PUBLIC_PAYLOAD_API_URL is not set for production build.");
  // }
} 