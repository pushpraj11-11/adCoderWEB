import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { Badge } from "./Badge";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt || product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {product.isFeatured && <Badge label="Featured" />}
          {product.isBestSeller && <Badge label="Best Seller" variant="muted" />}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
            {product.description}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400">View</span>
        </div>
      </div>
    </Link>
  );
};
