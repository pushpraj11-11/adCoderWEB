import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listProducts = async (req: Request, res: Response) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort = "newest",
    page = "1",
    limit = "12"
  } = req.query as Record<string, string>;

  const where: Record<string, unknown> = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (category) {
    where.category = { slug: category };
  }
  if (minPrice || maxPrice) {
    where.price = {
      gte: minPrice ? Number(minPrice) : undefined,
      lte: maxPrice ? Number(maxPrice) : undefined
    };
  }

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" };

  const pageNumber = Number(page);
  const take = Number(limit);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, category: true, variants: true },
      orderBy,
      skip: (pageNumber - 1) * take,
      take
    }),
    prisma.product.count({ where })
  ]);

  return res.json({
    items,
    total,
    page: pageNumber,
    totalPages: Math.ceil(total / take)
  });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      images: true,
      variants: true,
      category: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id }
    },
    include: { images: true },
    take: 4
  });

  return res.json({ product, related });
};

export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    categoryId,
    compareAtPrice,
    isFeatured,
    isBestSeller,
    images,
    variants
  } = req.body as {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    compareAtPrice?: number;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    images?: { url: string; alt?: string }[];
    variants?: { name: string; value: string; sku: string; stock: number }[];
  };

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      categoryId,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      images: images
        ? { create: images.map((image) => ({ url: image.url, alt: image.alt })) }
        : undefined,
      variants: variants
        ? {
            create: variants.map((variant) => ({
              name: variant.name,
              value: variant.value,
              sku: variant.sku,
              stock: variant.stock
            }))
          }
        : undefined
    },
    include: { images: true, variants: true }
  });

  return res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body as Record<string, unknown>;

  const product = await prisma.product.update({
    where: { id },
    data: updates,
    include: { images: true, variants: true }
  });

  return res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  return res.json({ message: "Product deleted" });
};
