import express from 'express';
import {
    createMenuSection,
    getMenuSectionsByShop,
    getMenuSectionById,
    updateMenuSection,
    deleteMenuSection
} from '../controllers/menuSectionController';
import { authenticate } from '../middleware/auth';
import {
    validateMenuSection,
    validateMenuSectionId,
    validateShopId
} from '../middleware/validation';

const router = express.Router();

// Create a new menu section
router.post('/', authenticate, validateMenuSection, createMenuSection);

// Get all menu sections for a shop
router.get('/shop/:shopId', validateShopId, getMenuSectionsByShop);

// Get a single menu section by ID
router.get('/:id', validateMenuSectionId, getMenuSectionById);

// Update a menu section
router.put('/:id', authenticate, validateMenuSectionId, validateMenuSection, updateMenuSection);

// Delete a menu section
router.delete('/:id', authenticate, validateMenuSectionId, deleteMenuSection);

export default router;
