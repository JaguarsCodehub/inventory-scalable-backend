import { z } from 'zod';

export const createDeliverySchema = z.object({
    orderId: z.number(),
    trackingNumber: z.string().optional(),
});

export const updateDeliverySchema = z.object({
    deliveryStatus: z.enum(['PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED']),
});
