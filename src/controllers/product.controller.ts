import { Request, Response, NextFunction } from "express";
import db from "../utils/prisma";
import redisClient from "../utils/redis";

const cacheKey = "all_products";
let products;


export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, stock } = req.body;

    try {
        const product = await db.product.create({
            data: {
                name,
                description,
                price,
                stock
            }
        })
        res.status(201).json(product)
    } catch (error) {
        console.log("Error creating product", error)
        res.status(500).json({ message: (error as Error).message })
    }
}


export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const productId = parseInt(id);
        if (isNaN(productId)) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }

        const product = await db.product.findUnique({
            where: { id: productId },
        });

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

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    try {
        const updatedProduct = await db.product.update({
            where: { id: Number(id) },
            data: { name, description, price, stock },
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