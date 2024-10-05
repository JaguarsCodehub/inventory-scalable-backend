import { z } from 'zod';

export const createOrderSchema = z.object({
    userId: z.number(),
    items: z.array(
        z.object({
            productId: z.number(),
            quantity: z.number().min(1),
        })
    ),
});

export const updateOrderSchema = z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});
