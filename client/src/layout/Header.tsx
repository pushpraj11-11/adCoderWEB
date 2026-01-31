import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  MoonIcon,
  SunIcon
} from "@heroicons/react/24/outline";
import { Category } from "../types";
import { apiFetch } from "../utils/api";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch<Category[]>("/api/categories").then(setCategories).catch(() => {
      setCategories([]);
    });
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="text-lg font-bold text-slate-900 dark:text-white">
          AdCoderWEB
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/products" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Shop
          </NavLink>
          <div className="group relative">
            <span className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Categories
            </span>
            <div className="absolute left-0 mt-4 hidden w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-card group-hover:block dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Explore
              </p>
              <div className="mt-3 grid gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {category.name}
                    <span className="text-xs text-slate-400">Browse</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <NavLink to="/wishlist" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Wishlist
          </NavLink>
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Admin
            </NavLink>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex"
          >
            <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="w-40 bg-transparent text-sm text-slate-700 focus:outline-none dark:text-slate-200"
            />
          </form>
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          <Link to="/cart" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300">
            <ShoppingBagIcon className="h-5 w-5" />
          </Link>
          {user ? (
            <button
              onClick={logout}
              className="rounded-full border border-slate-200 p-2 text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300"
            >
              <UserCircleIcon className="h-5 w-5" />
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-slate-200 p-2 text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300"
            >
              <UserCircleIcon className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
