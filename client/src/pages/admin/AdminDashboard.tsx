import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

interface Analytics {
  orderCount: number;
  totalSales: number;
  topProducts: { productId: string; title: string; _sum: { quantity: number } }[];
}

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    apiFetch<Analytics>("/api/admin/analytics")
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin analytics</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Total sales</p>
          <p className="mt-2 text-2xl font-semibold">
            ${analytics?.totalSales?.toFixed(2) ?? "0.00"}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-2 text-2xl font-semibold">{analytics?.orderCount ?? 0}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Top product</p>
          <p className="mt-2 text-base font-semibold">
            {analytics?.topProducts?.[0]?.title ?? "—"}
          </p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Top products</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {analytics?.topProducts?.map((product) => (
            <li key={product.productId} className="flex items-center justify-between">
              <span>{product.title}</span>
              <span className="text-slate-500">{product._sum.quantity} sold</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
