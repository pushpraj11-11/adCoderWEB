import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../utils/api";

const statusSteps = ["PROCESSING", "SHIPPED", "DELIVERED"];

export const OrderTracking: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    apiFetch<{ id: string; status: string }>(`/api/orders/track/${id}`)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [id]);

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <p>Order not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Track order</h1>
      <p className="mt-2 text-sm text-slate-500">Order #{order.id}</p>
      <div className="mt-8 space-y-4">
        {statusSteps.map((step, index) => {
          const active = statusSteps.indexOf(order.status) >= index;
          return (
            <div key={step} className="flex items-center gap-4">
              <div
                className={`h-4 w-4 rounded-full ${
                  active ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
              <span className={active ? "text-slate-900" : "text-slate-400"}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
