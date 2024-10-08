import db from "../utils/prisma";

export const addStock = async (productId: number, quantity: number, userId: number) => {
    try {
        // Find the product
        const product = await db.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new Error('Product not found');
        }

        // Update the stock
        const updatedProduct = await db.product.update({
            where: { id: productId },
            data: {
                currentStock: product.currentStock + quantity,
            },
        });

        // Add a record to the StockHistory
        await db.stockHistory.create({
            data: {
                productId,
                changeType: 'ADD',
                quantity,
                userId,
            },
        });

        return updatedProduct;
    } catch (error) {
        throw new Error(`Failed to add stock: ${error}`);
    }
};
