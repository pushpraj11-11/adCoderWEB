import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Category, Product } from "../types";
import { apiFetch } from "../utils/api";
import { ProductCard } from "../components/ProductCard";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Skeleton } from "../components/Skeleton";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const currentPage = Number(searchParams.get("page") || 1);

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "newest"
    }),
    [searchParams]
  );

  useEffect(() => {
    apiFetch<Category[]>("/api/categories").then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      ...filters,
      page: currentPage.toString(),
      limit: "9"
    });
    apiFetch<{ items: Product[]; totalPages: number }>(
      `/api/products?${query.toString()}`
    )
      .then((data) => {
        setProducts(data.items);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [filters, currentPage]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold">Premium collection</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Curated essentials across audio, home, and wearables.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Search"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
          />
          <Select
            value={filters.sort}
            onChange={(event) => updateFilter("sort", event.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </Select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px,1fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Select
            label="Category"
            value={filters.category}
            onChange={(event) => updateFilter("category", event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input
            label="Min Price"
            type="number"
            value={filters.minPrice}
            onChange={(event) => updateFilter("minPrice", event.target.value)}
          />
          <Input
            label="Max Price"
            type="number"
            value={filters.maxPrice}
            onChange={(event) => updateFilter("maxPrice", event.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setSearchParams(new URLSearchParams());
            }}
          >
            Clear filters
          </Button>
        </div>

        <div>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-80" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search query."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center justify-center gap-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`h-10 w-10 rounded-full text-sm font-semibold ${
                  currentPage === index + 1
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
