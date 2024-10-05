import { Router } from 'express';
import * as deliveryController from '../controllers/delivery.controller';

const router = Router();

router.post('/', deliveryController.createDelivery);
router.get('/', deliveryController.getAllDeliveries);
router.get('/:orderId', deliveryController.getDeliveryByOrderId);
router.put('/:id', deliveryController.updateDeliveryStatus);
router.delete('/:id', deliveryController.deleteDelivery);

export default router;
