import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";
import { Product } from "../types";

interface WishlistItem {
  id: string;
  product: Product;
}

export const Wishlist: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    apiFetch<WishlistItem[]>("/api/wishlist")
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No saved items"
            description="Save your favorite pieces and revisit anytime."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};
