import express, { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller";
import { authenticateToken } from "../auth/middleware/auth.middleware";

const router: Router = express.Router();

// Protect all routes
router.use(authenticateToken);

router.post('/products', createProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;