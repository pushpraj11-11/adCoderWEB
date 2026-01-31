import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });
  return res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, description, imageUrl } = req.body as {
    name: string;
    description?: string;
    imageUrl?: string;
  };
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const category = await prisma.category.create({
    data: { name, slug, description, imageUrl }
  });
  return res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await prisma.category.update({
    where: { id },
    data: req.body as Record<string, unknown>
  });
  return res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.category.delete({ where: { id } });
  return res.json({ message: "Category deleted" });
};
