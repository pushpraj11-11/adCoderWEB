import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem } from "../types";
import { apiFetch } from "../utils/api";

interface CartContextValue {
  items: CartItem[];
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: string, variantId?: string) => Promise<void>;
  updateItem: (id: string, quantity: number, saveForLater?: boolean) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<CartItem[]>("/api/cart");
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, variantId?: string) => {
    await apiFetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, variantId })
    });
    await refresh();
  };

  const updateItem = async (id: string, quantity: number, saveForLater?: boolean) => {
    await apiFetch(`/api/cart/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity, saveForLater })
    });
    await refresh();
  };

  const removeItem = async (id: string) => {
    await apiFetch(`/api/cart/${id}`, { method: "DELETE" });
    await refresh();
  };

  useEffect(() => {
    refresh().catch(() => {
      setLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({ items, loading, refresh, addItem, updateItem, removeItem }),
    [items, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
