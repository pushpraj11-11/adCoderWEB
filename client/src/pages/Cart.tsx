import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";

export const Cart: React.FC = () => {
  const { items, updateItem, removeItem } = useCart();

  const activeItems = items.filter((item) => !item.saveForLater);
  const savedItems = items.filter((item) => item.saveForLater);
  const total = activeItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Your cart</h1>
      {activeItems.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Your cart is empty"
            description="Browse our premium collection and add your favorites."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center"
              >
                <img
                  src={item.product.images[0]?.url}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-base font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-slate-500">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateItem(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="h-8 w-8 rounded-full border border-slate-200"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    className="h-8 w-8 rounded-full border border-slate-200"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-col gap-2 text-right text-sm">
                  <button
                    onClick={() => updateItem(item.id, item.quantity, true)}
                    className="text-slate-500 hover:text-slate-900"
                  >
                    Save for later
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-rose-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="mt-6 flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="mt-6 block">
              <Button className="w-full">Proceed to checkout</Button>
            </Link>
          </div>
        </div>
      )}

      {savedItems.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Saved for later</h2>
          <div className="mt-4 grid gap-4">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <p className="text-sm font-semibold">{item.product.name}</p>
                  <p className="text-xs text-slate-500">${item.product.price}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateItem(item.id, item.quantity, false)}
                    className="text-sm text-brand-500"
                  >
                    Move to cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-rose-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
