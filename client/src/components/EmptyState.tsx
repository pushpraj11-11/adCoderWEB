import React from "react";

export const EmptyState: React.FC<{ title: string; description: string }> = ({
  title,
  description
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
};
