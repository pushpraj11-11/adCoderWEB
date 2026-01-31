import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../types";

export const listWishlist = async (req: AuthRequest, res: Response) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.user!.id },
    include: { product: { include: { images: true } } }
  });
  return res.json(items);
};

export const addWishlist = async (req: AuthRequest, res: Response) => {
  const { productId } = req.body as { productId: string };
  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: req.user!.id, productId } },
    update: {},
    create: { userId: req.user!.id, productId },
    include: { product: { include: { images: true } } }
  });
  return res.status(201).json(item);
};

export const removeWishlist = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await prisma.wishlistItem.delete({ where: { id } });
  return res.json({ message: "Wishlist item removed" });
};
