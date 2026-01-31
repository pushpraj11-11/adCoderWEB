import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../types";
import { OrderStatus } from "@prisma/client";

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { items, shippingAddress, shippingMethod, paymentMethod } = req.body as {
    items: { productId: string; variantId?: string; quantity: number }[];
    shippingAddress: string;
    shippingMethod: string;
    paymentMethod: string;
  };

  const productData = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) } },
    include: { images: true }
  });

  const orderItems = items.map((item) => {
    const product = productData.find((p) => p.id === item.productId)!;
    return {
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price: product.price,
      title: product.name,
      imageUrl: product.images[0]?.url || ""
    };
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      total,
      items: { create: orderItems }
    },
    include: { items: true }
  });

  await prisma.cartItem.deleteMany({ where: { userId: req.user!.id } });

  return res.status(201).json(order);
};

export const listOrders = async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user?.id },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });
  return res.json(orders);
};

export const listAllOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" }
  });
  return res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: OrderStatus };
  const order = await prisma.order.update({
    where: { id },
    data: { status }
  });
  return res.json(order);
};

export const trackOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true }
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  return res.json(order);
};
