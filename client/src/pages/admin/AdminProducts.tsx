import React, { useEffect, useState } from "react";
import { Product, Category } from "../../types";
import { apiFetch } from "../../utils/api";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: ""
  });

  const load = () => {
    apiFetch<{ items: Product[] }>("/api/products?limit=50").then((data) =>
      setProducts(data.items)
    );
  };

  useEffect(() => {
    load();
    apiFetch<Category[]>("/api/categories").then(setCategories);
  }, []);

  const handleCreate = async () => {
    await apiFetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        categoryId: form.categoryId
      })
    });
    setForm({ name: "", description: "", price: "", categoryId: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    await apiFetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Manage products</h1>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Add product</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Input
            label="Price"
            type="number"
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
          >
            <option value="">Select</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
        <Button className="mt-4" onClick={handleCreate}>
          Create
        </Button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Inventory</h2>
        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-slate-500">${product.price.toFixed(2)}</p>
              </div>
              <Button variant="ghost" onClick={() => handleDelete(product.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
