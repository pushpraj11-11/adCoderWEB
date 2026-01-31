import { z } from "zod";

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    price: z.number(),
    categoryId: z.string().min(1),
    compareAtPrice: z.number().optional(),
    isFeatured: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    images: z
      .array(
        z.object({
          url: z.string().url(),
          alt: z.string().optional()
        })
      )
      .optional(),
    variants: z
      .array(
        z.object({
          name: z.string(),
          value: z.string(),
          sku: z.string(),
          stock: z.number()
        })
      )
      .optional()
  })
});
