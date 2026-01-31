import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export const AdminLayout: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-[220px,1fr]">
        <aside className="space-y-2 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <NavLink to="/admin" end className="block text-sm font-semibold text-slate-600">
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className="block text-sm font-semibold text-slate-600">
            Products
          </NavLink>
          <NavLink to="/admin/categories" className="block text-sm font-semibold text-slate-600">
            Categories
          </NavLink>
          <NavLink to="/admin/orders" className="block text-sm font-semibold text-slate-600">
            Orders
          </NavLink>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
