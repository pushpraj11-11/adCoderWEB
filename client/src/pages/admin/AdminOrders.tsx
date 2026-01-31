import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { Select } from "../../components/Select";

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  user: { name: string; email: string };
  items: OrderItem[];
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () => {
    apiFetch<Order[]>("/api/orders/admin").then(setOrders);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await apiFetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Manage orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Order #{order.id}</p>
                <p className="text-xs text-slate-500">{order.user.name} · {order.user.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">${order.total.toFixed(2)}</span>
                <Select
                  value={order.status}
                  onChange={(event) => updateStatus(order.id, event.target.value)}
                >
                  <option>PROCESSING</option>
                  <option>SHIPPED</option>
                  <option>DELIVERED</option>
                  <option>CANCELLED</option>
                </Select>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <span>
                    {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
