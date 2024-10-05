import { Request, Response } from 'express';
import { createOrderSchema, updateOrderSchema } from '../validators/orderValidator';
import * as orderService from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, items } = createOrderSchema.parse(req.body);
        const newOrder = await orderService.createOrder(userId, items);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = parseInt(req.params.id);
        const order = await orderService.getOrderById(orderId);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id);
        const { status } = updateOrderSchema.parse(req.body);
        const updatedOrder = await orderService.updateOrderStatus(orderId, status);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id);
        await orderService.deleteOrder(orderId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
