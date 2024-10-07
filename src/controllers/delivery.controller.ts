import { Request, Response } from 'express';
import { createDeliverySchema, updateDeliverySchema } from '../validators/deliveryValidator';
import * as deliveryService from '../services/deliveryService';
import redisClient from '../utils/redis';

const cacheKey = "all_deliveries"

export const createDelivery = async (req: Request, res: Response) => {
    try {
        const { orderId, trackingNumber } = createDeliverySchema.parse(req.body);
        const newDelivery = await deliveryService.createDelivery(orderId, trackingNumber);
        res.status(201).json(newDelivery);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getAllDeliveries = async (req: Request, res: Response) => {
    try {
        const cachedDeliveries = await redisClient.get(cacheKey)
        if(cachedDeliveries) {
            res.status(200).json(JSON.parse(cachedDeliveries))
        }
        const deliveries = await deliveryService.getAllDeliveries();
        await redisClient.set(cacheKey, JSON.stringify(deliveries), {EX: 30})
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
};

export const getDeliveryByOrderId = async (req: Request, res: Response): Promise<void> => {
    try {
        const cachedDelivery = await redisClient.get(`delivery:${req.params.orderId}`)
        if(cachedDelivery) {
            res.status(200).json(JSON.parse(cachedDelivery))
        }
        const orderId = parseInt(req.params.orderId);
        const delivery = await deliveryService.getDeliveryByOrderId(orderId);
        await redisClient.set(`delivery:${req.params.orderId}`, JSON.stringify(delivery), {EX: 30})
        if (!delivery) {
            res.status(404).json({ error: 'Delivery not found for this order' });
            return;
        }
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch delivery' });
    }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
    try {
        const cachedDelivery = await redisClient.get(`delivery:${req.params.id}`)
        if(cachedDelivery) {
            res.status(200).json(JSON.parse(cachedDelivery))
        }
        const deliveryId = parseInt(req.params.id);
        const { deliveryStatus } = updateDeliverySchema.parse(req.body);
        const updatedDelivery = await deliveryService.updateDeliveryStatus(deliveryId, deliveryStatus);
        await redisClient.set(`delivery:${req.params.id}`, JSON.stringify(updatedDelivery), {EX: 30})
        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
};

export const deleteDelivery = async (req: Request, res: Response) => {
    try {
        const cachedDelivery = await redisClient.get(`delivery:${req.params.id}`)
        if(cachedDelivery) {
            res.status(200).json(JSON.parse(cachedDelivery))
        }
        const deliveryId = parseInt(req.params.id);
        await deliveryService.deleteDelivery(deliveryId);
        await redisClient.del(`delivery:${req.params.id}`)
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete delivery' });
    }
};
