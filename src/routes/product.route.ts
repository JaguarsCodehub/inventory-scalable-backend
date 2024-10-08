import express, { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller";
import { authenticateToken } from "../auth/middleware/auth.middleware";

const router: Router = express.Router();

// Protect all routes
router.use(authenticateToken);

router.post('/create', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;