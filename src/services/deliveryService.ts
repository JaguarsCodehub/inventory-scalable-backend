import { DeliveryStatus } from '@prisma/client';
import db from '../utils/prisma';

export const createDelivery = (orderId: number, trackingNumber: string | undefined) =>
    db.delivery.create({
        data: {
            orderId,
            trackingNumber,
            deliveryStatus: 'PENDING',
        },
    });

export const getAllDeliveries = () => db.delivery.findMany();

export const getDeliveryByOrderId = (orderId: number) =>
    db.delivery.findFirst({
        where: { orderId },
    });

export const updateDeliveryStatus = (deliveryId: number, deliveryStatus: string) =>
    db.delivery.update({
        where: { id: deliveryId },
        data: { deliveryStatus: deliveryStatus as DeliveryStatus },
    });

export const deleteDelivery = (deliveryId: number) => db.delivery.delete({ where: { id: deliveryId } });
