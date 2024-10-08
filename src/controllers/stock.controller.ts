import { Request, Response } from 'express';
import { z } from 'zod';
import { addStock } from '../services/stockService';

// Validation schema using Zod
const addStockSchema = z.object({
    productId: z.number().min(1, "Product ID must be at least 1"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    userId: z.number().min(1, "User ID must be at least 1"),
});

export const addStockController = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const { productId, quantity, userId } = addStockSchema.parse(req.body);

        // Call the service to add stock
        const updatedProduct = await addStock(productId, quantity, userId);

        // Respond with the updated product
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};
