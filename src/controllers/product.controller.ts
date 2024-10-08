import { Request, Response, NextFunction } from "express";
import db from "../utils/prisma";
import redisClient from "../utils/redis";
import { z } from "zod";

const cacheKey = "all_products";
const productSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    stock: z.number().min(0)
});

export const createProduct = async (req: Request, res: Response) => {
    try {
        // Validate request body using Zod
        const validatedData = productSchema.parse(req.body);
        const { name, description, price, stock } = validatedData;

        // Create product
        const product = await db.product.create({
            data: {
                name,
                description,
                price,
                currentStock: stock
            }
        });

        // Create initial stock history
        await db.stockHistory.create({
            data: {
                productId: product.id,
                changeType: 'ADD',
                quantity: stock,
                userId: 1 // Assume admin userId for now
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error creating product", error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const cachedProducts = await redisClient.get(cacheKey);
        if (cachedProducts) {
            res.status(200).json(JSON.parse(cachedProducts))
        }

        const products = await db.product.findMany();
        await redisClient.set(cacheKey, JSON.stringify(products), { EX: 30 })
        res.status(200).json(products)
    } catch (error) {
        console.log("Error fetching products", error)
        res.status(500).json({ message: (error as Error).message })
    }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const cachedProduct = await redisClient.get(`product:${id}`)
        if (cachedProduct) {
            res.status(200).json(JSON.parse(cachedProduct))
        }


        const productId = parseInt(id);
        if (isNaN(productId)) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }

        const product = await db.product.findUnique({
            where: { id: productId },
        });

        await redisClient.set(`product:${id}`, JSON.stringify(product), { EX: 30 })

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        // Validate request body using Zod
        const validatedData = productSchema.parse(req.body);
        const { name, description, price, stock } = validatedData;

        // Find existing product
        const product = await db.product.findUnique({
            where: { id: Number(id) }
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        // Update product details and stock
        const updatedProduct = await db.product.update({
            where: { id: Number(id) },
            data: { name, description, price, currentStock: stock }
        });

        // Record stock changes in stock history
        const stockChange = stock - product.currentStock;
        const changeType = stockChange > 0 ? 'ADD' : 'REMOVE';

        await db.stockHistory.create({
            data: {
                productId: product.id,
                changeType,
                quantity: Math.abs(stockChange),
                userId: 1 // Assuming an admin user
            }
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await db.product.delete({
            where: { id: Number(id) },
        });

        res.status(204).send(); // No content on successful deletion
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};