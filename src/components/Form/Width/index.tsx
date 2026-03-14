import * as React from "react";

type WidthProps = {
  children: React.ReactNode;
  className?: string;
  width?: number | string | null;
};

const normalizeWidth = (value?: number | string | null): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(100, Math.max(1, value));
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());

    if (Number.isFinite(parsed)) {
      return Math.min(100, Math.max(1, parsed));
    }
  }

  return undefined;
};

export const Width: React.FC<WidthProps> = ({ children, className, width }) => {
  const normalizedWidth = normalizeWidth(width);
  const widthValue = normalizedWidth ? `${normalizedWidth}%` : "100%";

  return (
    <div
      className={className}
      style={{
        width: widthValue,
        maxWidth: widthValue,
        flexBasis: widthValue,
      }}
    >
      {children}
    </div>
  );
};
