import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Product, Review } from "../types";
import { apiFetch } from "../utils/api";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { notify } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiFetch<{ product: Product & { reviews: Review[] }; related: Product[] }>(
      `/api/products/${id}`
    )
      .then((data) => {
        setProduct(data.product);
        setRelated(data.related);
        setSelectedVariant(data.product.variants?.[0]?.id);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const inStock = useMemo(() => {
    if (!product) return false;
    if (!product.variants?.length) return true;
    return product.variants.some((variant) => variant.stock > 0);
  }, [product]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.alt || product.name}
              className="h-96 w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images.slice(1).map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={image.alt}
                className="h-40 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              {product.name}
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {product.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Variants
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    selectedVariant === variant.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {variant.name}: {variant.value}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${
                inStock ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {inStock ? "In stock" : "Out of stock"}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={async () => {
                try {
                  await addItem(product.id, selectedVariant);
                  notify("Added to cart", "success");
                } catch (error) {
                  notify("Please sign in to add to cart", "error");
                }
              }}
              disabled={!inStock}
            >
              Add to cart
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await apiFetch("/api/wishlist", {
                    method: "POST",
                    body: JSON.stringify({ productId: product.id })
                  });
                  notify("Added to wishlist", "success");
                } catch (error) {
                  notify("Please sign in to save", "error");
                }
              }}
            >
              Save to wishlist
            </Button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <p className="font-medium text-slate-900 dark:text-white">Shipping</p>
            <p className="mt-2">Free premium shipping on orders over $150.</p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <div className="mt-6 grid gap-4">
          {product.reviews?.length ? (
            product.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{review.title}</p>
                  <span className="text-xs text-slate-400">{review.rating} ★</span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {review.body}
                </p>
                <p className="mt-3 text-xs text-slate-400">{review.user.name}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          )}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Related products</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
};
