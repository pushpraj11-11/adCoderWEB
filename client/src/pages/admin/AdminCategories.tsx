import React, { useEffect, useState } from "react";
import { Category } from "../../types";
import { apiFetch } from "../../utils/api";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "" });

  const load = () => {
    apiFetch<Category[]>("/api/categories").then(setCategories);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    await apiFetch("/api/categories", {
      method: "POST",
      body: JSON.stringify(form)
    });
    setForm({ name: "", description: "", imageUrl: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    await apiFetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Manage categories</h1>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Add category</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Input
            label="Image URL"
            value={form.imageUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
        </div>
        <Button className="mt-4" onClick={handleCreate}>
          Create
        </Button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">All categories</h2>
        <div className="mt-4 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{category.name}</p>
                <p className="text-xs text-slate-500">{category.slug}</p>
              </div>
              <Button variant="ghost" onClick={() => handleDelete(category.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
