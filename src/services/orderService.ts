import { OrderStatus } from "@prisma/client";
import db from "../utils/prisma";

export const createOrder = async (userId: number, items: any) => {
    let totalAmount = 0;
    for (const item of items) {
        const product = await db.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product with ID ${item.productId} not found`);
        totalAmount += product.price * item.quantity;
    }

    return db.order.create({
        data: {
            userId,
            items,
            totalAmount,
            status: 'PENDING'
        }
    })
}

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