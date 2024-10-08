import { Router } from 'express';
import { addStockController } from '../controllers/stock.controller';

const router = Router();

// POST route to add stock
router.post('/add-stock', addStockController);

export default router;
