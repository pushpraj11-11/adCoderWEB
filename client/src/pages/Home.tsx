import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Category, Product } from "../types";
import { apiFetch } from "../utils/api";
import { Button } from "../components/Button";
import { ProductCard } from "../components/ProductCard";
import { Skeleton } from "../components/Skeleton";

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<Category[]>("/api/categories"),
      apiFetch<{ items: Product[] }>("/api/products?limit=6")
    ])
      .then(([categoryData, productData]) => {
        setCategories(categoryData);
        setProducts(productData.items);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-50 py-20 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              New Season 2024
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white md:text-5xl">
              Curated essentials for a modern, elevated lifestyle.
            </h1>
            <p className="mt-4 text-base text-slate-500 dark:text-slate-300">
              Discover thoughtful technology, minimalist home goods, and premium
              accessories designed with intention.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button onClick={() => (window.location.href = "/products")}>Shop Collection</Button>
              <Button variant="secondary">Explore Lookbook</Button>
            </div>
          </div>
          <div className="relative flex-1">
            <div className="absolute -left-12 top-10 h-48 w-48 rounded-full bg-brand-100 blur-3xl"></div>
            <div className="relative overflow-hidden rounded-[32px] bg-white shadow-card dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1518441985338-64ba229e8d03?auto=format&fit=crop&w=1200&q=80"
                alt="Premium audio gear"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Shop by category</h2>
            <Link to="/products" className="text-sm font-semibold text-brand-500">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-48" />
                ))
              : categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured & best sellers</h2>
            <Link to="/products" className="text-sm font-semibold text-brand-500">
              Shop all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-80" />
                ))
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-semibold">Loved by discerning shoppers</h3>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              “Every product feels considered. The packaging, the experience, the
              craftsmanship — simply premium.”
            </p>
            <p className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">
              — Jamie Lee, Design Lead
            </p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-8 text-white">
            <h3 className="text-xl font-semibold">Stay in the loop</h3>
            <p className="mt-4 text-sm text-slate-300">
              Join for early access drops, refined editorial picks, and private
              invites.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                placeholder="Enter your email"
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-slate-300 focus:outline-none"
              />
              <Button>Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
