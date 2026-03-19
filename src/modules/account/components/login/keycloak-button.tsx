"use client";
import React, { useState } from "react";
import { usePopupAuth } from "@/hooks/usePopupAuth";

export const KeycloakButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { openPopup } = usePopupAuth();

  const handleKeycloakLogin = async () => {
    setIsLoading(true);

    try {
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      await openPopup({
        provider: "keycloak",
        redirectTo: currentPath,
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to start Keycloak login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-2 mt-4">
      <div className="w-full border-t border-gray-200 mb-2" />
      <button
        onClick={handleKeycloakLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
      >
        <span className="mr-2">🔐</span>
        {isLoading ? "Redirigiendo..." : "Iniciar sesión con Keycloak"}
      </button>
    </div>
  );
};
