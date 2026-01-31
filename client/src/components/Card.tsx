import React from "react";
import clsx from "clsx";

export const Card: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      {children}
    </div>
  );
};
