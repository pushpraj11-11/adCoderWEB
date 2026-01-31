import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <label className="block text-sm text-slate-600 dark:text-slate-300">
      {label && <span className="mb-2 block font-medium">{label}</span>}
      <input
        className={clsx(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white",
          className
        )}
        {...props}
      />
      {error && <span className="mt-2 block text-xs text-rose-500">{error}</span>}
    </label>
  );
};
