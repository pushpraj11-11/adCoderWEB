import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../types";

export const addReview = async (req: AuthRequest, res: Response) => {
  const { productId, rating, title, body } = req.body as {
    productId: string;
    rating: number;
    title: string;
    body: string;
  };

  const review = await prisma.review.create({
    data: {
      productId,
      rating,
      title,
      body,
      userId: req.user!.id
    },
    include: { user: true }
  });

  return res.status(201).json(review);
};

export const listReviews = async (req: AuthRequest, res: Response) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.productId },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });
  return res.json(reviews);
};
