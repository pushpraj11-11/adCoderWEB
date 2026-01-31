import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAnalytics = async (_req: Request, res: Response) => {
  const [orderCount, totalSales, topProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.orderItem.groupBy({
      by: ["productId", "title"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5
    })
  ]);

  return res.json({
    orderCount,
    totalSales: totalSales._sum.total ?? 0,
    topProducts
  });
};
