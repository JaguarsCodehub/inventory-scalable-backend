import express, { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getLowStockProducts, getProductById, removeStock, updateProduct } from "../controllers/product.controller";
import { authenticateToken } from "../auth/middleware/auth.middleware";

const router: Router = express.Router();

// Protect all routes
router.use(authenticateToken);

// Remove Stock
router.post('/:productId/remove-stock', removeStock);

// Get Low Stock Products
router.get('/low-stock', getLowStockProducts);

router.post('/create', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;