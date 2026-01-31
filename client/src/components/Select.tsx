import React from "react";
import clsx from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, className, children, ...props }) => {
  return (
    <label className="block text-sm text-slate-600 dark:text-slate-300">
      {label && <span className="mb-2 block font-medium">{label}</span>}
      <select
        className={clsx(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
};
