import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../types";

export const listCart = async (req: AuthRequest, res: Response) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user?.id },
    include: { product: { include: { images: true, variants: true } } }
  });
  return res.json(items);
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  const { productId, variantId, quantity } = req.body as {
    productId: string;
    variantId?: string;
    quantity?: number;
  };

  const item = await prisma.cartItem.upsert({
    where: {
      userId_productId_variantId: {
        userId: req.user!.id,
        productId,
        variantId: variantId || null
      }
    },
    update: { quantity: { increment: quantity ?? 1 } },
    create: {
      userId: req.user!.id,
      productId,
      variantId: variantId || null,
      quantity: quantity ?? 1
    },
    include: { product: { include: { images: true } } }
  });

  return res.status(201).json(item);
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { quantity, saveForLater } = req.body as {
    quantity?: number;
    saveForLater?: boolean;
  };

  const item = await prisma.cartItem.update({
    where: { id },
    data: {
      quantity: quantity ?? undefined,
      saveForLater: saveForLater ?? undefined
    },
    include: { product: { include: { images: true } } }
  });

  return res.json(item);
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await prisma.cartItem.delete({ where: { id } });
  return res.json({ message: "Item removed" });
};
