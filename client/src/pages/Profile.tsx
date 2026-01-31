import React, { useEffect, useState } from "react";
import { Order } from "../types";
import { apiFetch } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    apiFetch<Order[]>("/api/orders").then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Your profile</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr,2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="mt-2 text-sm text-slate-500">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Order history</h2>
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Order #{order.id}</p>
                  <p className="text-xs text-slate-500">{order.status}</p>
                </div>
                <span className="text-sm font-semibold">${order.total.toFixed(2)}</span>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-slate-500">No orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
