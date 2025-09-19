import express from 'express';
import {
    createProduct,
    getProductsByShop,
    getProductsByMenuSection,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/productController';
import { authenticate } from '../middleware/auth';
import {
    validateProduct,
    validateProductId,
    validateShopId
} from '../middleware/validation';

const router = express.Router();

// Create a new product
router.post('/', authenticate, validateProduct, createProduct);

// Get all products for a shop
router.get('/shop/:shopId', validateShopId, getProductsByShop);

// Get products by menu section
router.get('/menu-section/:menuSectionId', getProductsByMenuSection);

// Get a single product by ID
router.get('/:id', validateProductId, getProductById);

// Update a product
router.put('/:id', authenticate, validateProductId, validateProduct, updateProduct);

// Delete a product
router.delete('/:id', authenticate, validateProductId, deleteProduct);

export default router;
