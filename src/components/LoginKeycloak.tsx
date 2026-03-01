"use client";

import { usePopupAuth } from "@/hooks/usePopupAuth";

export function SignIn() {
  const { openPopup, isLoading, error } = usePopupAuth();

  const handleClick = async () => {
    try {
      await openPopup({ provider: "keycloak" });
      window.location.reload();
    } catch {}
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
      {error ? (
        <p role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </>
  );
}
