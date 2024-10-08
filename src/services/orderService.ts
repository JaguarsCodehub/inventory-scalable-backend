import { OrderStatus } from "@prisma/client";
import db from "../utils/prisma";

export const createOrder = async (userId: number, items: any) => {
    let totalAmount = 0;

    const productUpdates: { productId: number; newStock: number; quantityOrdered: number }[] = [];

    // Transaction begins
    return await db.$transaction(async (prisma) => {
        // Loop through each item in the order
        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) throw new Error(`Product with ID ${item.productId} not found`);

            // Check if enough stock is available
            if (product.currentStock < item.quantity) {
                throw new Error(`Insufficient stock for product ID ${item.productId}`);
            }

            // Prepare stock updates and calculate total amount
            productUpdates.push({
                productId: product.id,
                newStock: product.currentStock - item.quantity,
                quantityOrdered: item.quantity,
            });

            totalAmount += product.price * item.quantity;
        }

        // Create the order
        const newOrder = await prisma.order.create({
            data: {
                userId,
                items,
                totalAmount,
                status: "PENDING",
            },
        });

        // Update stock levels and record stock history
        for (const update of productUpdates) {
            await prisma.product.update({
                where: { id: update.productId },
                data: { currentStock: update.newStock },
            });

            await prisma.stockHistory.create({
                data: {
                    productId: update.productId,
                    changeType: "REMOVE",
                    quantity: update.quantityOrdered,
                    userId,
                },
            });
        }

        return newOrder;
    });
};


export const getAllOrders = () => db.order.findMany();

export const getOrderById = (orderId: number) =>
    db.order.findUnique({
        where: { id: orderId },
        include: { deliveries: true },
    });

export const updateOrderStatus = (orderId: number, status: string) =>
    db.order.update({
        where: { id: orderId },
        data: { status: status as OrderStatus },
    });

export const deleteOrder = (orderId: number) => db.order.delete({ where: { id: orderId } });