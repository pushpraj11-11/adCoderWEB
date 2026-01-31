import { z } from "zod";

export const orderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          variantId: z.string().optional(),
          quantity: z.number().min(1)
        })
      )
      .min(1),
    shippingAddress: z.string().min(5),
    shippingMethod: z.string().min(2),
    paymentMethod: z.string().min(2)
  })
});
