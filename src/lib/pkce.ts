/**
 * PKCE (Proof Key for Code Exchange) generator utilities
 * Implements RFC 7636 for OAuth 2.0 public clients
 */

/**
 * Generate a cryptographically random code verifier
 * Returns a base64url-encoded string without padding (43-128 chars)
 */
export function generateCodeVerifier(): string {
  // Generate 32 random bytes (256 bits)
  const randomBytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(randomBytes);

  // Convert to base64url without padding
  return base64UrlEncode(randomBytes);
}

/**
 * Generate a code challenge from a code verifier
 * Uses SHA-256 hash and base64url encoding without padding
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  // Encode verifier as ASCII
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);

  // Compute SHA-256 hash
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);

  // Convert to base64url without padding
  return base64UrlEncode(new Uint8Array(hashBuffer));
}

/**
 * Generate a complete PKCE pair (verifier and challenge)
 */
export async function generatePkcePair(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  return { codeVerifier, codeChallenge };
}

/**
 * Convert Uint8Array to base64url string without padding
 * Replaces '+' with '-', '/' with '_', and removes '=' padding
 */
function base64UrlEncode(bytes: Uint8Array): string {
  // Convert to base64
  const base64 = btoa(String.fromCharCode(...bytes));

  // Convert to base64url
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
