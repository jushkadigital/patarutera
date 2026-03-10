"use client";

import Spinner from "@modules/common/icons/spinner";

interface FilterLoadingOverlayProps {
  label?: string;
}

export function FilterLoadingOverlay({
  label = "Actualizando filtros...",
}: FilterLoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[120] bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-lg border border-border text-[#2970b7] font-semibold">
        <Spinner size={22} />
        <span>{label}</span>
      </div>
    </div>
  );
}
