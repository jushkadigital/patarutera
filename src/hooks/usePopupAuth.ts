"use client";

import type { AuthPopupMessage } from "@/types/auth-popup";

import { useCallback, useState } from "react";

interface OpenPopupParams {
  provider?: "keycloak";
  redirectTo?: string;
  timeoutMs?: number;
}

interface UsePopupAuthResult {
  openPopup: (params?: OpenPopupParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const POPUP_NAME_PREFIX = "patarutera-auth-popup";
const POPUP_WIDTH = 520;
const POPUP_HEIGHT = 680;
const POLL_CLOSED_MS = 400;
const DEFAULT_TIMEOUT_MS = 3000000;

function createNonce(): string {
  if (typeof globalThis.crypto !== "undefined") {
    if (typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    if (typeof globalThis.crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      globalThis.crypto.getRandomValues(bytes);
      return Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("");
    }
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isAuthPopupMessage(data: unknown): data is AuthPopupMessage {
  if (!data || typeof data !== "object") {
    return false;
  }

  const candidate = data as Partial<AuthPopupMessage>;
  const hasValidType = candidate.type === "auth-popup";
  const hasValidStatus =
    candidate.status === "success" || candidate.status === "error";
  const hasValidNonce = typeof candidate.nonce === "string";
  const hasValidError =
    typeof candidate.error === "undefined" ||
    typeof candidate.error === "string";

  return hasValidType && hasValidStatus && hasValidNonce && hasValidError;
}

function buildLoginUrl(params: {
  provider?: "keycloak";
  redirectTo?: string;
  nonce: string;
}): string {
  const loginUrl = new URL("/api/auth/login", window.location.origin);

  const callbackUrl = new URL(
    params.redirectTo ?? "/api/auth/popup-callback",
    window.location.origin,
  );
  callbackUrl.searchParams.set("nonce", params.nonce);
  const redirectTo = `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}`;

  loginUrl.searchParams.set("redirectTo", redirectTo);

  if (params.provider) {
    loginUrl.searchParams.set("provider", params.provider);
  }

  return loginUrl.toString();
}

function buildPopupFeatures(width: number, height: number): string {
  const left = Math.max(
    0,
    window.screenX + Math.round((window.outerWidth - width) / 2),
  );
  const top = Math.max(
    0,
    window.screenY + Math.round((window.outerHeight - height) / 2),
  );

  return [
    "popup=yes",
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
  ].join(",");
}

export function usePopupAuth(): UsePopupAuthResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPopup = useCallback(
    async (params: OpenPopupParams = {}): Promise<void> => {
      if (typeof window === "undefined") {
        throw new Error("Popup auth is only available in the browser");
      }

      setIsLoading(true);
      setError(null);

      const nonce = createNonce();
      const channelName = `patarutera-auth-popup-${nonce}`;
      const popupName = `${POPUP_NAME_PREFIX}-${nonce}`;
      const timeoutMs = params.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      const loginUrl = buildLoginUrl({
        provider: params.provider,
        redirectTo: params.redirectTo,
        nonce,
      });

      const popupWindow = window.open(
        loginUrl,
        popupName,
        buildPopupFeatures(POPUP_WIDTH, POPUP_HEIGHT),
      );

      if (!popupWindow) {
        setIsLoading(false);
        window.location.href = loginUrl;
        return;
      }

      await new Promise<void>((resolve, reject) => {
        let settled = false;
        const cleanup = {
          closeInterval: undefined as
            | ReturnType<typeof setInterval>
            | undefined,
          timeoutId: undefined as ReturnType<typeof setTimeout> | undefined,
          authChannel: undefined as BroadcastChannel | undefined,
        };
        const finalize = (callback: () => void) => {
          if (settled) {
            return;
          }

          settled = true;
          window.removeEventListener("message", onMessage);
          if (cleanup.authChannel) {
            cleanup.authChannel.removeEventListener(
              "message",
              onBroadcastMessage,
            );
            cleanup.authChannel.close();
          }

          if (cleanup.closeInterval) {
            clearInterval(cleanup.closeInterval);
          }

          if (cleanup.timeoutId) {
            clearTimeout(cleanup.timeoutId);
          }

          callback();
          setIsLoading(false);
        };

        const handleAuthMessage = (data: unknown) => {
          if (!isAuthPopupMessage(data)) {
            return;
          }

          if (data.nonce !== nonce) {
            return;
          }

          if (data.status === "success") {
            finalize(() => resolve());
            return;
          }

          const errorMessage = data.error ?? "Authentication failed";
          finalize(() => {
            setError(errorMessage);
            reject(new Error(errorMessage));
          });
        };

        const onMessage = (event: MessageEvent<unknown>) => {
          if (event.origin !== window.location.origin) {
            return;
          }

          if (event.source !== popupWindow) {
            return;
          }

          handleAuthMessage(event.data);
        };

        const onBroadcastMessage = (event: MessageEvent<unknown>) => {
          handleAuthMessage(event.data);
        };

        window.addEventListener("message", onMessage);

        if (typeof window.BroadcastChannel === "function") {
          cleanup.authChannel = new window.BroadcastChannel(channelName);
          cleanup.authChannel.addEventListener("message", onBroadcastMessage);
        }

        cleanup.closeInterval = setInterval(() => {
          if (popupWindow.closed) {
            const cancelMessage = "Authentication popup was closed by the user";
            finalize(() => {
              setError(cancelMessage);
              reject(new Error(cancelMessage));
            });
          }
        }, POLL_CLOSED_MS);

        cleanup.timeoutId = setTimeout(() => {
          if (!popupWindow.closed) {
            popupWindow.close();
          }

          const timeoutMessage = `Authentication timed out after ${timeoutMs}ms`;
          finalize(() => {
            setError(timeoutMessage);
            reject(new Error(timeoutMessage));
          });
        }, timeoutMs);
      });
    },
    [],
  );

  return {
    openPopup,
    isLoading,
    error,
  };
}

export default usePopupAuth;
