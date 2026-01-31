import React from "react";
import clsx from "clsx";

export const Badge: React.FC<{ label: string; variant?: "accent" | "muted" }> = ({
  label,
  variant = "accent"
}) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      variant === "accent"
        ? "bg-brand-100 text-brand-600"
        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
    )}
  >
    {label}
  </span>
);
