import { Request, Response } from 'express';
import { createDeliverySchema, updateDeliverySchema } from '../validators/deliveryValidator';
import * as deliveryService from '../services/deliveryService';

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
        const deliveries = await deliveryService.getAllDeliveries();
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
};

export const getDeliveryByOrderId = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = parseInt(req.params.orderId);
        const delivery = await deliveryService.getDeliveryByOrderId(orderId);
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
        const deliveryId = parseInt(req.params.id);
        const { deliveryStatus } = updateDeliverySchema.parse(req.body);
        const updatedDelivery = await deliveryService.updateDeliveryStatus(deliveryId, deliveryStatus);
        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
};

export const deleteDelivery = async (req: Request, res: Response) => {
    try {
        const deliveryId = parseInt(req.params.id);
        await deliveryService.deleteDelivery(deliveryId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete delivery' });
    }
};
