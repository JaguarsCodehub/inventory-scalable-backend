import { Request, Response } from 'express';
import { createOrderSchema, updateOrderSchema } from '../validators/orderValidator';
import * as orderService from '../services/orderService';
import redisClient from '../utils/redis';

const cacheKey = "all_orders"

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, items } = createOrderSchema.parse(req.body);
        const newOrder = await orderService.createOrder(userId, items);
        res.status(201).json(newOrder);
    } catch (error) {
        // Handle errors such as insufficient stock
        res.status(400).json({ error: (error as Error).message });
    }
};


export const getAllOrders = async (req: Request, res: Response) => {
    try {

        const cachedOrders = await redisClient.get(cacheKey);
        if (cachedOrders) {
            res.status(200).json(JSON.parse(cachedOrders))
        }
        const orders = await orderService.getAllOrders();

        await redisClient.set(cacheKey, JSON.stringify(orders), { EX: 30 })
        res.status(200).json(orders);
    } catch (error) {
        console.log("Error fetching orders", error)
        res.status(500).json({ message: (error as Error).message })
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const cachedOrder = await redisClient.get(`order:${req.params.id}`)
        if (cachedOrder) {
            res.status(200).json(JSON.parse(cachedOrder))
        }
        const orderId = parseInt(req.params.id);
        const order = await orderService.getOrderById(orderId);

        await redisClient.set(`order:${req.params.id}`, JSON.stringify(order), { EX: 30 })
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
        const cachedOrder = await redisClient.get(`order:${req.params.id}`)
        if (cachedOrder) {
            res.status(200).json(JSON.parse(cachedOrder))
        }
        const orderId = parseInt(req.params.id);
        const { status } = updateOrderSchema.parse(req.body);
        const updatedOrder = await orderService.updateOrderStatus(orderId, status);

        await redisClient.set(`order:${req.params.id}`, JSON.stringify(updatedOrder), { EX: 30 })
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const cachedOrder = await redisClient.get(`order:${req.params.id}`)
        if (cachedOrder) {
            res.status(200).json(JSON.parse(cachedOrder))
        }
        const orderId = parseInt(req.params.id);
        await orderService.deleteOrder(orderId);

        await redisClient.del(`order:${req.params.id}`)
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
