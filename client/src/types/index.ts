export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface Variant {
  id: string;
  name: string;
  value: string;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  variants: Variant[];
  category?: Category;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  user: { name: string };
}

export interface CartItem {
  id: string;
  quantity: number;
  saveForLater: boolean;
  product: Product;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}
