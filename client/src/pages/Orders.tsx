import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Order } from "../types";
import { apiFetch } from "../utils/api";

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    apiFetch<Order[]>("/api/orders").then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Order history</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <p className="text-sm font-semibold">Order #{order.id}</p>
              <p className="text-xs text-slate-500">{order.status}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">${order.total.toFixed(2)}</span>
              <Link
                to={`/tracking/${order.id}`}
                className="text-sm font-semibold text-brand-500"
              >
                Track
              </Link>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-slate-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
};
